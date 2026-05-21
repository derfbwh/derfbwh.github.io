/**
 * 2026 US House & Senate Forecast Model - Monte Carlo Simulation Engine
 */

// Helper to generate a random number from a standard normal distribution (Box-Muller transform)
function randomNormal(mean = 0, stdDev = 1) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * stdDev + mean;
}

// Calculate days remaining until election
function getDaysUntilElection() {
    const electionDate = new Date('2026-11-03T00:00:00');
    const today = new Date();
    const diffTime = electionDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
}

// Assign regions to states for regional correlated polling errors
function getStateRegion(stateAbbr) {
    const midwest = ["MI", "MN", "IA", "OH", "IL", "KS", "NE", "SD", "ND", "WI", "IN"];
    const south = ["GA", "NC", "TX", "FL", "AL", "AR", "MS", "KY", "LA", "OK", "SC", "TN", "WV", "VA"];
    const northeast = ["ME", "NH", "DE", "MA", "NJ", "RI", "CO", "NM", "OR", "ID", "AK", "WY", "VT", "CT", "NY", "PA", "MD", "CA", "WA", "HI", "UT", "MT", "NV", "AZ"];
    
    if (midwest.includes(stateAbbr)) return "midwest";
    if (south.includes(stateAbbr)) return "south";
    return "northeast"; // Northeast & West combined
}

/**
 * Runs 1000 Monte Carlo simulations of the 2026 US Senate and US House elections.
 * @param {Array} activeSenatePolls - Current active Senate polls dataset
 * @param {Array} activeHousePolls - Current active House polls dataset
 * @param {number} genericBallotShift - Shift from default Generic Congressional Ballot (positive is Dem shift)
 * @returns {Object} Simulation results
 */
function runMonteCarloForecast(activeSenatePolls, activeHousePolls, genericBallotShift = 0) {
    const SIM_COUNT = 1000;
    const daysLeft = getDaysUntilElection();
    
    // Time-based uncertainty multiplier (decays as we approach Nov 3, 2026)
    // 166 days from May 21 to Nov 3. Let's scale relative to a 6-month cycle.
    const uncertaintyMultiplier = Math.max(0.4, Math.min(2.5, Math.sqrt(daysLeft / 45) * 0.75));
    
    // Senate Constants
    const SENATE_SEATS_NOT_UP = { dem: 34, rep: 31 }; // 65 seats not up in 2026 (34 Dem, 31 Rep)
    
    // House Constants
    const HOUSE_SEATS_SAFE = { dem: 200, rep: 205 }; // 405 non-battlegrounds (200 Dem, 205 Rep)
    
    // Simulation accumulators
    let demSenateWinCount = 0;
    let repSenateWinCount = 0;
    let tieSenateCount = 0; // 50-50 Senate
    
    let demHouseWinCount = 0;
    let repHouseWinCount = 0;
    
    let senateDemSeatsSum = 0;
    let houseDemSeatsSum = 0;
    
    // Seat distributions for frequency charting (bell curves)
    const senateDemSeatsDist = {};
    const houseDemSeatsDist = {};
    for (let s = 30; s <= 70; s++) senateDemSeatsDist[s] = 0;
    for (let h = 180; h <= 250; h++) houseDemSeatsDist[h] = 0;
    
    // Track state win rates
    const senateStateWins = {};
    activeSenatePolls.forEach(race => {
        senateStateWins[race.state] = { demWins: 0, repWins: 0 };
    });
    
    const houseDistrictWins = {};
    activeHousePolls.forEach(race => {
        houseDistrictWins[race.district] = { demWins: 0, repWins: 0 };
    });

    // Run 1000 simulations
    for (let sim = 0; sim < SIM_COUNT; sim++) {
        // --- 1. Draw Correlated Polling Errors ---
        // National Polling Error: affects all polls in the country in a unified direction
        const nationalError = randomNormal(0, 2.2) * uncertaintyMultiplier;
        
        // Regional Polling Errors: affects states by region (Midwest, South, Northeast/West)
        const regionalErrors = {
            midwest: randomNormal(0, 1.2) * uncertaintyMultiplier,
            south: randomNormal(0, 1.2) * uncertaintyMultiplier,
            northeast: randomNormal(0, 1.2) * uncertaintyMultiplier
        };
        
        // Combine generic ballot shift (direct user slider) and national polling error
        const totalDemShift = nationalError + genericBallotShift;
        
        // --- 2. Simulate Senate (35 seats) ---
        let demSimSenateSeats = SENATE_SEATS_NOT_UP.dem;
        let repSimSenateSeats = SENATE_SEATS_NOT_UP.rep;
        
        activeSenatePolls.forEach(race => {
            const region = getStateRegion(race.state);
            const regError = regionalErrors[region] || 0;
            // Local independent polling error for this specific state
            const localError = randomNormal(0, 1.8) * uncertaintyMultiplier;
            
            // Partisan lean blend: blends baseline poll with the PVI state lean
            const pviAdjustment = race.pvi * 0.4; // 40% weighting to PVI
            const rawDem = race.demPoll + pviAdjustment;
            const rawRep = race.repPoll - pviAdjustment;
            
            // Total simulated shift for Democrats
            const netShift = totalDemShift + regError + localError;
            
            const simulatedDem = rawDem + netShift;
            const simulatedRep = rawRep - netShift;
            
            if (simulatedDem > simulatedRep) {
                demSimSenateSeats++;
                senateStateWins[race.state].demWins++;
            } else {
                repSimSenateSeats++;
                senateStateWins[race.state].repWins++;
            }
        });
        
        // Record Senate outcomes
        senateDemSeatsSum += demSimSenateSeats;
        if (demSimSenateSeats >= 51) {
            demSenateWinCount++;
        } else if (demSimSenateSeats === 50) {
            // JD Vance is VP (Republican), so 50-50 Senate favors Republicans for control, but we track ties
            tieSenateCount++;
        } else {
            repSenateWinCount++;
        }
        
        if (senateDemSeatsDist[demSimSenateSeats] !== undefined) {
            senateDemSeatsDist[demSimSenateSeats]++;
        }
        
        // --- 3. Simulate House (435 seats) ---
        let demSimHouseSeats = HOUSE_SEATS_SAFE.dem;
        let repSimHouseSeats = HOUSE_SEATS_SAFE.rep;
        
        // Simulate individual 30 key battlegrounds
        activeHousePolls.forEach(race => {
            const localError = randomNormal(0, 2.0) * uncertaintyMultiplier;
            
            // House battlegrounds are highly local but affected by national swing
            const pviAdjustment = race.pvi * 0.35;
            const rawDem = race.demPoll + pviAdjustment;
            const rawRep = race.repPoll - pviAdjustment;
            
            const netShift = totalDemShift + localError;
            
            const simulatedDem = rawDem + netShift;
            const simulatedRep = rawRep - netShift;
            
            if (simulatedDem > simulatedRep) {
                demSimHouseSeats++;
                houseDistrictWins[race.district].demWins++;
            } else {
                repSimHouseSeats++;
                houseDistrictWins[race.district].repWins++;
            }
        });
        
        // Simulate wave effects on the 405 non-battleground seats
        // If national error/shift is large, safe seats can flip.
        // On average, each 1% national shift moves about 2.8 House seats.
        const houseFlipEffect = Math.round(totalDemShift * 2.8);
        if (houseFlipEffect > 0) {
            // Wave favors Democrats: they flip some Republican safe seats
            demSimHouseSeats += houseFlipEffect;
            repSimHouseSeats -= houseFlipEffect;
        } else if (houseFlipEffect < 0) {
            // Wave favors Republicans: they flip some Democratic safe seats
            demSimHouseSeats += houseFlipEffect; // negative addition
            repSimHouseSeats -= houseFlipEffect;
        }
        
        // Keep within absolute physical boundaries
        demSimHouseSeats = Math.max(140, Math.min(295, demSimHouseSeats));
        repSimHouseSeats = 435 - demSimHouseSeats;
        
        // Record House outcomes
        houseDemSeatsSum += demSimHouseSeats;
        if (demSimHouseSeats >= 218) {
            demHouseWinCount++;
        } else {
            repHouseWinCount++;
        }
        
        if (houseDemSeatsDist[demSimHouseSeats] !== undefined) {
            houseDemSeatsDist[demSimHouseSeats]++;
        }
    }
    
    // --- 4. Post-Simulation Aggregations ---
    const avgSenateDem = Math.round(senateDemSeatsSum / SIM_COUNT);
    const avgSenateRep = 100 - avgSenateDem;
    
    const avgHouseDem = Math.round(houseDemSeatsSum / SIM_COUNT);
    const avgHouseRep = 435 - avgHouseDem;
    
    // Compute win probabilities as percentages
    const demSenateChance = (demSenateWinCount / SIM_COUNT) * 100;
    // Tie is counted under Republican control because of Vance, but we present it beautifully:
    // Dem chance = demSenateChance (needs 51)
    // Rep chance = (repSenateWinCount + tieSenateCount) / SIM_COUNT * 100
    const tieSenateChance = (tieSenateCount / SIM_COUNT) * 100;
    const repSenateChance = ((repSenateWinCount + tieSenateCount) / SIM_COUNT) * 100;
    
    const demHouseChance = (demHouseWinCount / SIM_COUNT) * 100;
    const repHouseChance = (repHouseWinCount / SIM_COUNT) * 100;
    
    // Calculate final win rates for individual Senate races
    const senateStateRates = [];
    activeSenatePolls.forEach(race => {
        const dWin = (senateStateWins[race.state].demWins / SIM_COUNT) * 100;
        const rWin = (senateStateWins[race.state].repWins / SIM_COUNT) * 100;
        
        // Classify rating
        let rating = "Tossup";
        if (dWin >= 95) rating = "Safe D";
        else if (dWin >= 80) rating = "Likely D";
        else if (dWin >= 60) rating = "Lean D";
        else if (rWin >= 95) rating = "Safe R";
        else if (rWin >= 80) rating = "Likely R";
        else if (rWin >= 60) rating = "Lean R";
        
        senateStateRates.push({
            state: race.state,
            stateName: race.stateName,
            incumbent: race.incumbent,
            party: race.party,
            demCandidate: race.demCandidate,
            repCandidate: race.repCandidate,
            pvi: race.pvi,
            demChance: dWin,
            repChance: rWin,
            rating
        });
    });
    
    // Calculate final win rates for individual House races
    const houseDistrictRates = [];
    activeHousePolls.forEach(race => {
        const dWin = (houseDistrictWins[race.district].demWins / SIM_COUNT) * 100;
        const rWin = (houseDistrictWins[race.district].repWins / SIM_COUNT) * 100;
        
        let rating = "Tossup";
        if (dWin >= 95) rating = "Safe D";
        else if (dWin >= 80) rating = "Likely D";
        else if (dWin >= 60) rating = "Lean D";
        else if (rWin >= 95) rating = "Safe R";
        else if (rWin >= 80) rating = "Likely R";
        else if (rWin >= 60) rating = "Lean R";
        
        houseDistrictRates.push({
            district: race.district,
            incumbent: race.incumbent,
            party: race.party,
            pvi: race.pvi,
            demChance: dWin,
            repChance: rWin,
            rating
        });
    });
    
    // Select closest Upset Odds Comparison
    // We look at the smaller win probability (the upset candidate/party) in the Senate
    const smallerSenateChance = Math.min(demSenateChance, repSenateChance);
    let bestSenateComparison = "rolling a standard six-sided die"; // fallback
    let minDiff = 100;
    
    window.ForecastData.upsetComparisons.forEach(comp => {
        const midPoint = (comp.minProb + comp.maxProb) / 2;
        const diff = Math.abs(midPoint - smallerSenateChance);
        if (diff < minDiff) {
            minDiff = diff;
            bestSenateComparison = comp.text;
        }
    });

    return {
        senate: {
            demChance: demSenateChance,
            repChance: repSenateChance,
            tieChance: tieSenateChance,
            avgDem: avgSenateDem,
            avgRep: avgSenateRep,
            distribution: senateDemSeatsDist,
            raceRates: senateStateRates,
            upsetComparison: bestSenateComparison
        },
        house: {
            demChance: demHouseChance,
            repChance: repHouseChance,
            avgDem: avgHouseDem,
            avgRep: avgHouseRep,
            distribution: houseDemSeatsDist,
            raceRates: houseDistrictRates
        },
        uncertaintyFactor,
        daysLeft
    };
}

// Attach simulation engine to window
window.ForecastEngine = {
    runMonteCarloForecast,
    getDaysUntilElection
};
