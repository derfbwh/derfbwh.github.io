/**
 * 2026 US House & Senate Forecast Model - Main Orchestrator & UI Controller
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Application State ---
    let activeSenatePolls = JSON.parse(JSON.stringify(window.ForecastData.senateBaselineData));
    let activeHousePolls = JSON.parse(JSON.stringify(window.ForecastData.houseBaselineData));
    let genericBallotShift = 0.0; // Slider value (positive = Dem shift, negative = Rep shift)
    let selectedStateAbbr = null;
    
    // Store manually added polls during this session
    let sessionPolls = [];
    
    // Charts references
    let senateChartInstance = null;
    let houseChartInstance = null;

    // --- 2. DOM Elements Cache ---
    const elements = {
        // Tabs
        tabButtons: document.querySelectorAll(".tab-btn"),
        tabContents: document.querySelectorAll(".tab-content"),
        
        // Overall Dashboard KPI Cards
        senateDemProb: document.getElementById("senateDemProb"),
        senateRepProb: document.getElementById("senateRepProb"),
        senateDemSeats: document.getElementById("senateDemSeats"),
        senateRepSeats: document.getElementById("senateRepSeats"),
        senateUpset: document.getElementById("senateUpset"),
        
        houseDemProb: document.getElementById("houseDemProb"),
        houseRepProb: document.getElementById("houseRepProb"),
        houseDemSeats: document.getElementById("houseDemSeats"),
        houseRepSeats: document.getElementById("houseRepSeats"),
        
        // Progress Bars & Gauges
        senateProgressBar: document.getElementById("senateProgressBar"),
        houseProgressBar: document.getElementById("houseProgressBar"),
        senateNeedle: document.getElementById("senateNeedle"),
        houseNeedle: document.getElementById("houseNeedle"),
        
        // Generic Ballot Slider
        genericSlider: document.getElementById("genericSlider"),
        genericSliderVal: document.getElementById("genericSliderVal"),
        
        // State details drawer
        detailsPanel: document.getElementById("detailsPanel"),
        detailsClose: document.getElementById("detailsClose"),
        detailsStateName: document.getElementById("detailsStateName"),
        detailsIncumbent: document.getElementById("detailsIncumbent"),
        detailsPVI: document.getElementById("detailsPVI"),
        detailsDemCand: document.getElementById("detailsDemCand"),
        detailsRepCand: document.getElementById("detailsRepCand"),
        detailsWinRate: document.getElementById("detailsWinRate"),
        detailsRating: document.getElementById("detailsRating"),
        detailsPollsList: document.getElementById("detailsPollsList"),
        
        // Tables
        senateTableBody: document.getElementById("senateTableBody"),
        houseTableBody: document.getElementById("houseTableBody"),
        sessionPollsBody: document.getElementById("sessionPollsBody"),
        
        // Ingestion & Manual forms
        addPollForm: document.getElementById("addPollForm"),
        pollTargetType: document.getElementById("pollTargetType"),
        pollStateSelect: document.getElementById("pollStateSelect"),
        pollDistrictSelect: document.getElementById("pollDistrictSelect"),
        pollsterInput: document.getElementById("pollster"),
        pollDemInput: document.getElementById("pollDem"),
        pollRepInput: document.getElementById("pollRep"),
        pollDateInput: document.getElementById("pollDate"),
        
        // API controls
        apiFetchBtn: document.getElementById("apiFetchBtn"),
        apiUrlInput: document.getElementById("apiUrlInput"),
        apiStatusDot: document.getElementById("apiStatusDot"),
        apiStatusText: document.getElementById("apiStatusText"),
        resetDataBtn: document.getElementById("resetDataBtn"),
        
        // Countdown
        countdownTimer: document.getElementById("countdownTimer")
    };

    // --- 3. Initialize Widgets & Controls ---
    
    // Countdown Timer to November 3, 2026
    function updateCountdown() {
        const days = window.ForecastEngine.getDaysUntilElection();
        if (days === 0) {
            elements.countdownTimer.textContent = "TODAY IS ELECTION DAY!";
        } else {
            elements.countdownTimer.textContent = `${days} Days Until the 2026 Midterms`;
        }
    }
    updateCountdown();

    // Populate Poll State & District Selectors dynamically
    function populateFormSelects() {
        // State dropdown (Senate)
        elements.pollStateSelect.innerHTML = '<option value="">-- Select State --</option>';
        activeSenatePolls.forEach(race => {
            const opt = document.createElement("option");
            opt.value = race.state;
            opt.textContent = `${race.stateName} (Class II)`;
            elements.pollStateSelect.appendChild(opt);
        });
        
        // District dropdown (House)
        elements.pollDistrictSelect.innerHTML = '<option value="">-- Select District --</option>';
        activeHousePolls.forEach(race => {
            const opt = document.createElement("option");
            opt.value = race.district;
            opt.textContent = race.district;
            elements.pollDistrictSelect.appendChild(opt);
        });
    }
    populateFormSelects();

    // Toggle form dropdowns based on Poll Target Type (Senate vs House)
    elements.pollTargetType.addEventListener("change", (e) => {
        if (e.target.value === "senate") {
            elements.pollStateSelect.parentElement.classList.remove("hidden");
            elements.pollDistrictSelect.parentElement.classList.add("hidden");
            elements.pollStateSelect.required = true;
            elements.pollDistrictSelect.required = false;
        } else {
            elements.pollStateSelect.parentElement.classList.add("hidden");
            elements.pollDistrictSelect.parentElement.classList.remove("hidden");
            elements.pollStateSelect.required = false;
            elements.pollDistrictSelect.required = true;
        }
    });

    // --- 4. Main Tab Switching Controller ---
    elements.tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            elements.tabButtons.forEach(b => b.classList.remove("active"));
            elements.tabContents.forEach(c => c.classList.add("hidden"));
            
            btn.classList.add("active");
            const targetId = btn.getAttribute("data-tab");
            document.getElementById(targetId).classList.remove("hidden");
            
            // Re-render charts on tab switch to avoid canvas rendering glitches
            if (targetId === "tab-simulator") {
                renderCharts();
            }
        });
    });

    // --- 5. Interactive SVG Map Binder ---
    function bindMapInteractions() {
        const states = document.querySelectorAll(".map-state");
        states.forEach(statePath => {
            const stateAbbr = statePath.getAttribute("id");
            
            // Check if this state has a Senate election
            const hasElection = activeSenatePolls.some(r => r.state === stateAbbr);
            if (hasElection) {
                statePath.classList.add("active-election");
            } else {
                statePath.style.opacity = "0.25";
                statePath.style.cursor = "default";
            }
            
            // Handle clicking
            statePath.addEventListener("click", () => {
                if (!hasElection) return;
                
                // Toggle active outline
                states.forEach(s => s.classList.remove("selected"));
                statePath.classList.add("selected");
                
                selectedStateAbbr = stateAbbr;
                openStateDetailsDrawer(stateAbbr);
            });
        });
    }

    // Close details drawer
    elements.detailsClose.addEventListener("click", () => {
        elements.detailsPanel.classList.add("hidden");
        document.querySelectorAll(".map-state").forEach(s => s.classList.remove("selected"));
        selectedStateAbbr = null;
    });

    // Drawer populate helper
    function openStateDetailsDrawer(stateAbbr) {
        const race = activeSenatePolls.find(r => r.state === stateAbbr);
        if (!race) return;
        
        // Find simulated win details
        const simResult = lastSimResult.senate.raceRates.find(r => r.state === stateAbbr);
        
        elements.detailsStateName.textContent = race.stateName;
        elements.detailsIncumbent.textContent = `${race.incumbent} (${race.party})`;
        
        const pviText = race.pvi > 0 ? `D+${race.pvi}` : race.pvi < 0 ? `R+${Math.abs(race.pvi)}` : "EVEN";
        elements.detailsPVI.textContent = pviText;
        
        elements.detailsDemCand.textContent = race.demCandidate;
        elements.detailsRepCand.textContent = race.repCandidate;
        
        if (simResult) {
            elements.detailsWinRate.innerHTML = `
                <span class="prob-cell dem">${simResult.demChance.toFixed(1)}% Dem</span>
                <span class="prob-cell rep">${simResult.repChance.toFixed(1)}% Rep</span>
            `;
            elements.detailsRating.textContent = simResult.rating;
        }
        
        // List polls specifically for this state
        const statePolls = sessionPolls.filter(p => p.target === stateAbbr);
        elements.detailsPollsList.innerHTML = "";
        
        if (statePolls.length === 0) {
            elements.detailsPollsList.innerHTML = "<tr><td colspan='4' class='text-center' style='color: var(--text-muted);'>No custom polls added for this state. Using baseline averages.</td></tr>";
        } else {
            statePolls.forEach(p => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${p.pollster}</td>
                    <td class="mono-col">${p.date}</td>
                    <td class="mono-col text-center" style="color:var(--color-dem); font-weight:600;">${p.dem}%</td>
                    <td class="mono-col text-center" style="color:var(--color-rep); font-weight:600;">${p.rep}%</td>
                `;
                elements.detailsPollsList.appendChild(tr);
            });
        }
        
        elements.detailsPanel.classList.remove("hidden");
        elements.detailsPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // --- 6. Monte Carlo Orchestration & UI Updates ---
    let lastSimResult = null;
    
    function runModelSimulation() {
        // Run simulation
        lastSimResult = window.ForecastEngine.runMonteCarloForecast(
            activeSenatePolls,
            activeHousePolls,
            genericBallotShift
        );
        
        updateOverallKPIs();
        updateUSMapColors();
        populateSenateTable();
        populateHouseTable();
        populateSessionPollsTable();
        renderCharts();
        
        // If drawer is open, refresh its data too
        if (selectedStateAbbr) {
            openStateDetailsDrawer(selectedStateAbbr);
        }
    }

    function updateOverallKPIs() {
        const senate = lastSimResult.senate;
        const house = lastSimResult.house;
        
        // Update percentages
        elements.senateDemProb.textContent = `${senate.demChance.toFixed(1)}%`;
        elements.senateRepProb.textContent = `${senate.repChance.toFixed(1)}%`;
        elements.senateDemSeats.textContent = `${senate.avgDem} Seats`;
        elements.senateRepSeats.textContent = `${senate.avgRep} Seats`;
        elements.senateUpset.textContent = senate.upsetComparison;
        
        elements.houseDemProb.textContent = `${house.demChance.toFixed(1)}%`;
        elements.houseRepProb.textContent = `${house.repChance.toFixed(1)}%`;
        elements.houseDemSeats.textContent = `${house.avgDem} Seats`;
        elements.houseRepSeats.textContent = `${house.avgRep} Seats`;
        
        // Update Progress bar positions (win percentages)
        elements.senateProgressBar.style.width = `${senate.demChance}%`;
        elements.houseProgressBar.style.width = `${house.demChance}%`;
        
        // Update Gauges needle sweep (rotation based on win probabilities)
        // 0% dem probability = -80deg (full Rep), 100% dem = +80deg (full Dem), 50% = 0deg (vertical)
        const senateAngle = (senate.demChance - 50) * 1.6;
        const houseAngle = (house.demChance - 50) * 1.6;
        
        elements.senateNeedle.style.transform = `rotate(${senateAngle}deg)`;
        elements.houseNeedle.style.transform = `rotate(${houseAngle}deg)`;
        
        // Change color based on favorite
        elements.senateNeedle.style.background = senate.demChance > senate.repChance ? "var(--color-dem)" : "var(--color-rep)";
        elements.houseNeedle.style.background = house.demChance > house.repChance ? "var(--color-dem)" : "var(--color-rep)";
    }

    function updateUSMapColors() {
        lastSimResult.senate.raceRates.forEach(rate => {
            const statePath = document.getElementById(rate.state);
            if (!statePath) return;
            
            // Clean previous rating class
            statePath.classList.remove("safe-d", "likely-d", "lean-d", "tossup", "lean-r", "likely-r", "safe-r");
            
            // Assign class based on simulated rating
            const cls = rate.rating.toLowerCase().replace(" ", "-");
            statePath.classList.add(cls);
        });
    }

    function populateSenateTable() {
        elements.senateTableBody.innerHTML = "";
        
        // Sort races: competitive first, then by state name alphabetically
        const sortedRates = [...lastSimResult.senate.raceRates].sort((a, b) => {
            const aComp = activeSenatePolls.find(r => r.state === a.state).isCompetitive;
            const bComp = activeSenatePolls.find(r => r.state === b.state).isCompetitive;
            
            if (aComp && !bComp) return -1;
            if (!aComp && bComp) return 1;
            return a.stateName.localeCompare(b.stateName);
        });
        
        sortedRates.forEach(rate => {
            const originalRace = activeSenatePolls.find(r => r.state === rate.state);
            const tr = document.createElement("tr");
            
            const pviText = rate.pvi > 0 ? `D+${rate.pvi}` : rate.pvi < 0 ? `R+${Math.abs(rate.pvi)}` : "EVEN";
            const rowClass = originalRace.isCompetitive ? "style='background: rgba(245, 158, 11, 0.03);'" : "";
            
            tr.innerHTML = `
                <td ${rowClass}><strong>${rate.stateName}</strong></td>
                <td ${rowClass}>${rate.incumbent} (${originalRace.party})</td>
                <td class="mono-col" ${rowClass}>${pviText}</td>
                <td class="mono-col text-center" ${rowClass}>${originalRace.demPoll.toFixed(1)}%</td>
                <td class="mono-col text-center" ${rowClass}>${originalRace.repPoll.toFixed(1)}%</td>
                <td ${rowClass}>
                    <span class="prob-cell ${rate.rating.toLowerCase().includes('d') ? 'dem' : rate.rating.toLowerCase().includes('r') ? 'rep' : 'tossup'}">
                        ${rate.rating} (${Math.max(rate.demChance, rate.repChance).toFixed(0)}%)
                    </span>
                </td>
            `;
            
            // Clicking row centers on SVG map state
            tr.style.cursor = "pointer";
            tr.addEventListener("click", () => {
                const statePath = document.getElementById(rate.state);
                if (statePath && originalRace.isCompetitive) {
                    document.querySelectorAll(".map-state").forEach(s => s.classList.remove("selected"));
                    statePath.classList.add("selected");
                    selectedStateAbbr = rate.state;
                    openStateDetailsDrawer(rate.state);
                }
            });
            
            elements.senateTableBody.appendChild(tr);
        });
    }

    function populateHouseTable() {
        elements.houseTableBody.innerHTML = "";
        
        lastSimResult.house.raceRates.forEach(rate => {
            const tr = document.createElement("tr");
            const originalRace = activeHousePolls.find(r => r.district === rate.district);
            
            const pviText = rate.pvi > 0 ? `D+${rate.pvi}` : rate.pvi < 0 ? `R+${Math.abs(rate.pvi)}` : "EVEN";
            
            tr.innerHTML = `
                <td><strong>${rate.district}</strong></td>
                <td>${rate.incumbent} (${originalRace.party})</td>
                <td class="mono-col">${pviText}</td>
                <td class="mono-col text-center">${originalRace.demPoll.toFixed(1)}%</td>
                <td class="mono-col text-center">${originalRace.repPoll.toFixed(1)}%</td>
                <td>
                    <span class="prob-cell ${rate.rating.toLowerCase().includes('d') ? 'dem' : rate.rating.toLowerCase().includes('r') ? 'rep' : 'tossup'}">
                        ${rate.rating} (${Math.max(rate.demChance, rate.repChance).toFixed(0)}%)
                    </span>
                </td>
            `;
            elements.houseTableBody.appendChild(tr);
        });
    }

    function populateSessionPollsTable() {
        elements.sessionPollsBody.innerHTML = "";
        
        if (sessionPolls.length === 0) {
            elements.sessionPollsBody.innerHTML = "<tr><td colspan='6' class='text-center' style='color:var(--text-muted);'>No manual overrides added yet in this session.</td></tr>";
            return;
        }
        
        sessionPolls.forEach((p, idx) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="mono-col">${p.type.toUpperCase()}</td>
                <td><strong>${p.target}</strong></td>
                <td>${p.pollster}</td>
                <td class="mono-col text-center" style="color:var(--color-dem); font-weight:600;">${p.dem}%</td>
                <td class="mono-col text-center" style="color:var(--color-rep); font-weight:600;">${p.rep}%</td>
                <td>
                    <button class="btn-secondary" style="padding: 2px 8px; font-size:0.75rem; border-color:var(--color-rep); color:var(--color-rep);" data-index="${idx}">Remove</button>
                </td>
            `;
            
            // Delete button binding
            tr.querySelector("button").addEventListener("click", (e) => {
                const index = parseInt(e.target.getAttribute("data-index"));
                removeSessionPoll(index);
            });
            
            elements.sessionPollsBody.appendChild(tr);
        });
    }

    // --- 7. Generic Ballot Slider Event Handler ---
    // Update model simulations in real-time as slider moves!
    elements.genericSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        genericBallotShift = val;
        
        const sign = val > 0 ? "+" : "";
        elements.genericSliderVal.textContent = `D ${sign}${val.toFixed(1)}%`;
        
        runModelSimulation();
    });

    // --- 8. Manual Poll Submission ---
    elements.addPollForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const type = elements.pollTargetType.value;
        const target = type === "senate" ? elements.pollStateSelect.value : elements.pollDistrictSelect.value;
        const pollster = elements.pollsterInput.value.trim();
        const dem = parseFloat(elements.pollDemInput.value);
        const rep = parseFloat(elements.pollRepInput.value);
        const date = elements.pollDateInput.value;
        
        if (!target) return;
        
        const newPoll = { type, target, pollster, dem, rep, date };
        sessionPolls.push(newPoll);
        
        // Blend this new poll into the active dataset!
        // We blend 50% of this new poll directly into the active average to show its immediate effect
        if (type === "senate") {
            const idx = activeSenatePolls.findIndex(r => r.state === target);
            if (idx !== -1) {
                // Blend 50/50
                activeSenatePolls[idx].demPoll = (activeSenatePolls[idx].demPoll + dem) / 2;
                activeSenatePolls[idx].repPoll = (activeSenatePolls[idx].repPoll + rep) / 2;
            }
        } else {
            const idx = activeHousePolls.findIndex(r => r.district === target);
            if (idx !== -1) {
                activeHousePolls[idx].demPoll = (activeHousePolls[idx].demPoll + dem) / 2;
                activeHousePolls[idx].repPoll = (activeHousePolls[idx].repPoll + rep) / 2;
            }
        }
        
        // Clear fields
        elements.pollsterInput.value = "";
        elements.pollDemInput.value = "";
        elements.pollRepInput.value = "";
        
        // Recalculate
        runModelSimulation();
    });

    function removeSessionPoll(index) {
        const poll = sessionPolls[index];
        sessionPolls.splice(index, 1);
        
        // Reset specific poll values to baselines, then re-blend remaining session polls
        activeSenatePolls = JSON.parse(JSON.stringify(window.ForecastData.senateBaselineData));
        activeHousePolls = JSON.parse(JSON.stringify(window.ForecastData.houseBaselineData));
        
        sessionPolls.forEach(p => {
            if (p.type === "senate") {
                const idx = activeSenatePolls.findIndex(r => r.state === p.target);
                if (idx !== -1) {
                    activeSenatePolls[idx].demPoll = (activeSenatePolls[idx].demPoll + p.dem) / 2;
                    activeSenatePolls[idx].repPoll = (activeSenatePolls[idx].repPoll + p.rep) / 2;
                }
            } else {
                const idx = activeHousePolls.findIndex(r => r.district === p.target);
                if (idx !== -1) {
                    activeHousePolls[idx].demPoll = (activeHousePolls[idx].demPoll + p.dem) / 2;
                    activeHousePolls[idx].repPoll = (activeHousePolls[idx].repPoll + p.rep) / 2;
                }
            }
        });
        
        runModelSimulation();
    }

    // Reset Model Button
    elements.resetDataBtn.addEventListener("click", () => {
        activeSenatePolls = JSON.parse(JSON.stringify(window.ForecastData.senateBaselineData));
        activeHousePolls = JSON.parse(JSON.stringify(window.ForecastData.houseBaselineData));
        sessionPolls = [];
        elements.genericSlider.value = 0.0;
        genericBallotShift = 0.0;
        elements.genericSliderVal.textContent = "D +0.0%";
        
        elements.apiStatusDot.className = "status-indicator success";
        elements.apiStatusText.textContent = "Connected (Using Premium Baseline)";
        
        runModelSimulation();
    });

    // --- 9. Dynamic CSV Ingestion Engine (PapaParse) ---
    elements.apiFetchBtn.addEventListener("click", () => {
        const url = elements.apiUrlInput.value.trim();
        if (!url) return;
        
        elements.apiFetchBtn.innerHTML = '<span class="spinner"></span> Parsing...';
        elements.apiStatusDot.className = "status-indicator warning";
        elements.apiStatusText.textContent = "Fetching raw data...";
        
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Network response error");
                return res.text();
            })
            .then(csvText => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function(results) {
                        const count = processParsedPollingAverages(results.data);
                        if (count > 0) {
                            elements.apiStatusDot.className = "status-indicator success";
                            elements.apiStatusText.textContent = `Successfully merged ${count} polls.`;
                            runModelSimulation();
                        } else {
                            elements.apiStatusDot.className = "status-indicator warning";
                            elements.apiStatusText.textContent = "No valid Senate/House polls parsed. Format mismatch.";
                        }
                        elements.apiFetchBtn.textContent = "Ingest Feed";
                    },
                    error: function(err) {
                        throw new Error(err.message);
                    }
                });
            })
            .catch(err => {
                console.error(err);
                elements.apiStatusDot.className = "status-indicator error";
                elements.apiStatusText.textContent = `Fetch Failed: ${err.message}. Using high-quality baselines.`;
                elements.apiFetchBtn.textContent = "Ingest Feed";
            });
    });

    // Parse CSV rows into model averages (blended with 30% weight)
    function processParsedPollingAverages(data) {
        let matchCount = 0;
        
        data.forEach(row => {
            // Support columns like: "state", "type" (senate/house), "pct_dem", "pct_rep" or "candidate_name", "pct"
            const state = (row.state || "").trim().toUpperCase();
            const type = (row.type || "senate").toLowerCase();
            const pctDem = parseFloat(row.pct_dem || row.dem || row.pct_harris || 0);
            const pctRep = parseFloat(row.pct_rep || row.rep || row.pct_trump || 0);
            
            if (!isNaN(pctDem) && !isNaN(pctRep) && pctDem > 0 && pctRep > 0) {
                if (type === "senate") {
                    const idx = activeSenatePolls.findIndex(r => r.state === state);
                    if (idx !== -1) {
                        activeSenatePolls[idx].demPoll = (activeSenatePolls[idx].demPoll * 0.7) + (pctDem * 0.3);
                        activeSenatePolls[idx].repPoll = (activeSenatePolls[idx].repPoll * 0.7) + (pctRep * 0.3);
                        matchCount++;
                    }
                } else if (type === "house") {
                    const district = (row.district || "").trim().toUpperCase();
                    const idx = activeHousePolls.findIndex(r => r.district === district);
                    if (idx !== -1) {
                        activeHousePolls[idx].demPoll = (activeHousePolls[idx].demPoll * 0.7) + (pctDem * 0.3);
                        activeHousePolls[idx].repPoll = (activeHousePolls[idx].repPoll * 0.7) + (pctRep * 0.3);
                        matchCount++;
                    }
                }
            }
        });
        
        return matchCount;
    }

    // --- 10. Chart.js Render Engine (Bell Curves) ---
    function renderCharts() {
        if (!lastSimResult) return;
        
        // Build Senate Data
        const senateLabels = [];
        const senateData = [];
        for (let s = 40; s <= 65; s++) {
            senateLabels.push(`${s} Seats`);
            senateData.push(lastSimResult.senate.distribution[s] || 0);
        }
        
        // Build House Data
        const houseLabels = [];
        const houseData = [];
        for (let h = 195; h <= 240; h++) {
            houseLabels.push(`${h} Seats`);
            houseData.push(lastSimResult.house.distribution[h] || 0);
        }
        
        // 1. Senate Chart
        const senateCtx = document.getElementById("senateChart").getContext("2d");
        if (senateChartInstance) senateChartInstance.destroy();
        
        senateChartInstance = new Chart(senateCtx, {
            type: "bar",
            data: {
                labels: senateLabels,
                datasets: [{
                    label: "Simulation Occurrences",
                    data: senateData,
                    backgroundColor: senateLabels.map(l => {
                        const seats = parseInt(l);
                        if (seats >= 51) return "rgba(59, 130, 246, 0.4)"; // Dem Majority
                        if (seats === 50) return "rgba(245, 158, 11, 0.4)"; // Tie
                        return "rgba(239, 68, 68, 0.4)"; // Rep Majority
                    }),
                    borderColor: senateLabels.map(l => {
                        const seats = parseInt(l);
                        if (seats >= 51) return "var(--color-dem)";
                        if (seats === 50) return "var(--color-tossup)";
                        return "var(--color-rep)";
                    }),
                    borderWidth: 1.5,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        titleColor: "#fff",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { color: "rgba(255, 255, 255, 0.03)" },
                        ticks: { color: "var(--text-secondary)", font: { family: "JetBrains Mono" } }
                    },
                    y: {
                        grid: { color: "rgba(255, 255, 255, 0.03)" },
                        ticks: { color: "var(--text-secondary)" }
                    }
                }
            }
        });
        
        // 2. House Chart
        const houseCtx = document.getElementById("houseChart").getContext("2d");
        if (houseChartInstance) houseChartInstance.destroy();
        
        houseChartInstance = new Chart(houseCtx, {
            type: "bar",
            data: {
                labels: houseLabels,
                datasets: [{
                    label: "Simulation Occurrences",
                    data: houseData,
                    backgroundColor: houseLabels.map(l => {
                        const seats = parseInt(l);
                        return seats >= 218 ? "rgba(59, 130, 246, 0.4)" : "rgba(239, 68, 68, 0.4)";
                    }),
                    borderColor: houseLabels.map(l => {
                        const seats = parseInt(l);
                        return seats >= 218 ? "var(--color-dem)" : "var(--color-rep)";
                    }),
                    borderWidth: 1.5,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        titleColor: "#fff",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { color: "rgba(255, 255, 255, 0.03)" },
                        ticks: { color: "var(--text-secondary)", font: { family: "JetBrains Mono" } }
                    },
                    y: {
                        grid: { color: "rgba(255, 255, 255, 0.03)" },
                        ticks: { color: "var(--text-secondary)" }
                    }
                }
            }
        });
    }

    // --- 11. Automated CSV Feed Loader ---
    function loadAutomatedFeed() {
        fetch("./polls.csv")
            .then(res => {
                if (!res.ok) throw new Error("Local automated feed not found. Using baseline.");
                return res.text();
            })
            .then(csvText => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function(results) {
                        const count = processParsedPollingAverages(results.data);
                        if (count > 0) {
                            console.log(`Auto-loaded ${count} live polls from polls.csv`);
                            elements.apiStatusDot.className = "status-indicator success";
                            elements.apiStatusText.textContent = "Live Automated Feed Connected";
                        }
                        runModelSimulation();
                    }
                });
            })
            .catch(err => {
                console.log(err.message);
                // Fallback to baseline
                runModelSimulation();
            });
    }

    // --- 12. Initial Kickoff ---
    bindMapInteractions();
    loadAutomatedFeed();
});
