/**
 * 2026 US House & Senate Forecast Model - Baseline Dataset
 * All partisan leans (PVI) are represented as:
 * - Positive numbers: Democratic lean (e.g. +4 = D+4)
 * - Negative numbers: Republican lean (e.g. -6 = R+6)
 */

const senateBaselineData = [
    {
        state: "ME",
        stateName: "Maine",
        incumbent: "Susan Collins",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Susan Collins",
        pvi: 2, // State lean D+2, but Collins is personally popular
        demPoll: 46.0,
        repPoll: 48.0,
        isCompetitive: true
    },
    {
        state: "GA",
        stateName: "Georgia",
        incumbent: "Jon Ossoff",
        party: "D",
        demCandidate: "Jon Ossoff",
        repCandidate: "TBD Rep",
        pvi: -1, // R+1
        demPoll: 48.5,
        repPoll: 47.5,
        isCompetitive: true
    },
    {
        state: "MI",
        stateName: "Michigan",
        incumbent: "Open Seat (Peters retiring)",
        party: "D",
        demCandidate: "TBD Dem",
        repCandidate: "TBD Rep",
        pvi: 1, // D+1
        demPoll: 47.0,
        repPoll: 47.0,
        isCompetitive: true
    },
    {
        state: "NC",
        stateName: "North Carolina",
        incumbent: "Open Seat (Tillis retiring)",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "TBD Rep",
        pvi: -3, // R+3
        demPoll: 46.5,
        repPoll: 48.0,
        isCompetitive: true
    },
    {
        state: "NH",
        stateName: "New Hampshire",
        incumbent: "Open Seat (Shaheen retiring)",
        party: "D",
        demCandidate: "TBD Dem",
        repCandidate: "TBD Rep",
        pvi: 4, // D+4
        demPoll: 49.0,
        repPoll: 46.5,
        isCompetitive: true
    },
    {
        state: "IA",
        stateName: "Iowa",
        incumbent: "Open Seat (Ernst retiring)",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "TBD Rep",
        pvi: -6, // R+6
        demPoll: 43.0,
        repPoll: 49.0,
        isCompetitive: true
    },
    {
        state: "TX",
        stateName: "Texas",
        incumbent: "John Cornyn",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "John Cornyn",
        pvi: -5, // R+5
        demPoll: 44.5,
        repPoll: 49.5,
        isCompetitive: true
    },
    {
        state: "OH",
        stateName: "Ohio",
        incumbent: "Appointed Incumbent (Vance seat)",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Appointed Rep",
        pvi: -6, // R+6
        demPoll: 44.0,
        repPoll: 49.0,
        isCompetitive: true
    },
    {
        state: "FL",
        stateName: "Florida",
        incumbent: "Appointed Incumbent (Rubio seat)",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Appointed Rep",
        pvi: -6, // R+6
        demPoll: 43.5,
        repPoll: 49.5,
        isCompetitive: true
    },
    {
        state: "MN",
        stateName: "Minnesota",
        incumbent: "Open Seat (Smith retiring)",
        party: "D",
        demCandidate: "TBD Dem",
        repCandidate: "TBD Rep",
        pvi: 1, // D+1
        demPoll: 49.0,
        repPoll: 45.0,
        isCompetitive: true
    },
    {
        state: "AK",
        stateName: "Alaska",
        incumbent: "Dan Sullivan",
        party: "R",
        demCandidate: "Mary Peltola",
        repCandidate: "Dan Sullivan",
        pvi: -8, // R+8
        demPoll: 45.0,
        repPoll: 49.0,
        isCompetitive: true
    },
    {
        state: "VA",
        stateName: "Virginia",
        incumbent: "Mark Warner",
        party: "D",
        demCandidate: "Mark Warner",
        repCandidate: "TBD Rep",
        pvi: 2, // D+2
        demPoll: 51.0,
        repPoll: 44.0,
        isCompetitive: false
    },
    {
        state: "CO",
        stateName: "Colorado",
        incumbent: "John Hickenlooper",
        party: "D",
        demCandidate: "John Hickenlooper",
        repCandidate: "TBD Rep",
        pvi: 4, // D+4
        demPoll: 53.0,
        repPoll: 42.0,
        isCompetitive: false
    },
    {
        state: "NM",
        stateName: "New Mexico",
        incumbent: "Ben Ray Luján",
        party: "D",
        demCandidate: "Ben Ray Luján",
        repCandidate: "TBD Rep",
        pvi: 3, // D+3
        demPoll: 52.0,
        repPoll: 43.0,
        isCompetitive: false
    },
    {
        state: "AL",
        stateName: "Alabama",
        incumbent: "Tommy Tuberville",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Tommy Tuberville",
        pvi: -15, // R+15
        demPoll: 33.0,
        repPoll: 60.0,
        isCompetitive: false
    },
    {
        state: "AR",
        stateName: "Arkansas",
        incumbent: "Tom Cotton",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Tom Cotton",
        pvi: -16, // R+16
        demPoll: 32.0,
        repPoll: 62.0,
        isCompetitive: false
    },
    {
        state: "DE",
        stateName: "Delaware",
        incumbent: "Chris Coons",
        party: "D",
        demCandidate: "Chris Coons",
        repCandidate: "TBD Rep",
        pvi: 7, // D+7
        demPoll: 56.0,
        repPoll: 38.0,
        isCompetitive: false
    },
    {
        state: "ID",
        stateName: "Idaho",
        incumbent: "Jim Risch",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Jim Risch",
        pvi: -18, // R+18
        demPoll: 28.0,
        repPoll: 65.0,
        isCompetitive: false
    },
    {
        state: "IL",
        stateName: "Illinois",
        incumbent: "Dick Durbin",
        party: "D",
        demCandidate: "Dick Durbin",
        repCandidate: "TBD Rep",
        pvi: 7, // D+7
        demPoll: 55.0,
        repPoll: 39.0,
        isCompetitive: false
    },
    {
        state: "KS",
        stateName: "Kansas",
        incumbent: "Roger Marshall",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Roger Marshall",
        pvi: -10, // R+10
        demPoll: 36.0,
        repPoll: 57.0,
        isCompetitive: false
    },
    {
        state: "KY",
        stateName: "Kentucky",
        incumbent: "Mitch McConnell",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Mitch McConnell",
        pvi: -16, // R+16
        demPoll: 32.0,
        repPoll: 60.0,
        isCompetitive: false
    },
    {
        state: "LA",
        stateName: "Louisiana",
        incumbent: "Bill Cassidy",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Bill Cassidy",
        pvi: -12, // R+12
        demPoll: 34.0,
        repPoll: 60.0,
        isCompetitive: false
    },
    {
        state: "MA",
        stateName: "Massachusetts",
        incumbent: "Ed Markey",
        party: "D",
        demCandidate: "Ed Markey",
        repCandidate: "TBD Rep",
        pvi: 15, // D+15
        demPoll: 62.0,
        repPoll: 32.0,
        isCompetitive: false
    },
    {
        state: "MS",
        stateName: "Mississippi",
        incumbent: "Cindy Hyde-Smith",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Cindy Hyde-Smith",
        pvi: -11, // R+11
        demPoll: 38.0,
        repPoll: 56.0,
        isCompetitive: false
    },
    {
        state: "MT",
        stateName: "Montana",
        incumbent: "Steve Daines",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Steve Daines",
        pvi: -11, // R+11
        demPoll: 37.0,
        repPoll: 57.0,
        isCompetitive: false
    },
    {
        state: "NE",
        stateName: "Nebraska",
        incumbent: "Pete Ricketts",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Pete Ricketts",
        pvi: -13, // R+13
        demPoll: 32.0,
        repPoll: 61.0,
        isCompetitive: false
    },
    {
        state: "NJ",
        stateName: "New Jersey",
        incumbent: "Cory Booker",
        party: "D",
        demCandidate: "Cory Booker",
        repCandidate: "TBD Rep",
        pvi: 6, // D+6
        demPoll: 54.0,
        repPoll: 40.0,
        isCompetitive: false
    },
    {
        state: "OK",
        stateName: "Oklahoma",
        incumbent: "James Lankford",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "James Lankford",
        pvi: -20, // R+20
        demPoll: 26.0,
        repPoll: 68.0,
        isCompetitive: false
    },
    {
        state: "OR",
        stateName: "Oregon",
        incumbent: "Jeff Merkley",
        party: "D",
        demCandidate: "Jeff Merkley",
        repCandidate: "TBD Rep",
        pvi: 6, // D+6
        demPoll: 54.0,
        repPoll: 40.0,
        isCompetitive: false
    },
    {
        state: "RI",
        stateName: "Rhode Island",
        incumbent: "Jack Reed",
        party: "D",
        demCandidate: "Jack Reed",
        repCandidate: "TBD Rep",
        pvi: 12, // D+12
        demPoll: 60.0,
        repPoll: 35.0,
        isCompetitive: false
    },
    {
        state: "SC",
        stateName: "South Carolina",
        incumbent: "Lindsey Graham",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Lindsey Graham",
        pvi: -8, // R+8
        demPoll: 40.0,
        repPoll: 54.0,
        isCompetitive: false
    },
    {
        state: "SD",
        stateName: "South Dakota",
        incumbent: "Mike Rounds",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Mike Rounds",
        pvi: -16, // R+16
        demPoll: 30.0,
        repPoll: 64.0,
        isCompetitive: false
    },
    {
        state: "TN",
        stateName: "Tennessee",
        incumbent: "Bill Hagerty",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Bill Hagerty",
        pvi: -14, // R+14
        demPoll: 32.0,
        repPoll: 62.0,
        isCompetitive: false
    },
    {
        state: "WV",
        stateName: "West Virginia",
        incumbent: "Shelley Moore Capito",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "Shelley Moore Capito",
        pvi: -22, // R+22
        demPoll: 24.0,
        repPoll: 70.0,
        isCompetitive: false
    },
    {
        state: "WY",
        stateName: "Wyoming",
        incumbent: "Open Seat (Lummis retiring)",
        party: "R",
        demCandidate: "TBD Dem",
        repCandidate: "TBD Rep",
        pvi: -25, // R+25
        demPoll: 20.0,
        repPoll: 75.0,
        isCompetitive: false
    }
];

const houseBaselineData = [
    { district: "CA-13", incumbent: "John Duarte", party: "R", pvi: 1, demPoll: 48.0, repPoll: 48.0 },
    { district: "CA-22", incumbent: "David Valadao", party: "R", pvi: 5, demPoll: 48.0, repPoll: 47.0 },
    { district: "CA-27", incumbent: "Mike Garcia", party: "R", pvi: 4, demPoll: 47.0, repPoll: 48.0 },
    { district: "CA-45", incumbent: "Michelle Steel", party: "R", pvi: 2, demPoll: 47.0, repPoll: 48.0 },
    { district: "NY-04", incumbent: "Anthony D'Esposito", party: "R", pvi: 5, demPoll: 49.0, repPoll: 46.0 },
    { district: "NY-17", incumbent: "Mike Lawler", party: "R", pvi: 3, demPoll: 47.0, repPoll: 48.0 },
    { district: "NY-19", incumbent: "Marc Molinaro", party: "R", pvi: 1, demPoll: 48.0, repPoll: 48.0 },
    { district: "OR-05", incumbent: "Lori Chavez-DeRemer", party: "R", pvi: 2, demPoll: 48.0, repPoll: 48.0 },
    { district: "AZ-01", incumbent: "David Schweikert", party: "R", pvi: -2, demPoll: 47.0, repPoll: 48.0 },
    { district: "AZ-06", incumbent: "Juan Ciscomani", party: "R", pvi: -3, demPoll: 47.0, repPoll: 48.0 },
    { district: "CO-08", incumbent: "Yadira Caraveo", party: "D", pvi: 0, demPoll: 48.0, repPoll: 48.0 },
    { district: "MI-07", incumbent: "Open (Slotkin Seat)", party: "D", pvi: -2, demPoll: 47.0, repPoll: 47.0 },
    { district: "MI-08", incumbent: "Dan Kildee", party: "D", pvi: -1, demPoll: 48.0, repPoll: 48.0 },
    { district: "NC-01", incumbent: "Don Davis", party: "D", pvi: -1, demPoll: 48.0, repPoll: 48.0 },
    { district: "PA-07", incumbent: "Susan Wild", party: "D", pvi: -2, demPoll: 48.0, repPoll: 48.0 },
    { district: "PA-08", incumbent: "Matt Cartwright", party: "D", pvi: -4, demPoll: 48.0, repPoll: 49.0 },
    { district: "ME-02", incumbent: "Jared Golden", party: "D", pvi: -6, demPoll: 49.0, repPoll: 47.0 },
    { district: "WA-03", incumbent: "Marie Gluesenkamp Perez", party: "D", pvi: -5, demPoll: 48.0, repPoll: 48.0 },
    { district: "NM-02", incumbent: "Gabe Vasquez", party: "D", pvi: 1, demPoll: 48.0, repPoll: 48.0 },
    { district: "VA-07", incumbent: "Open (Spanberger Seat)", party: "D", pvi: 1, demPoll: 48.0, repPoll: 47.0 },
    { district: "VA-02", incumbent: "Jen Kiggans", party: "R", pvi: -2, demPoll: 47.0, repPoll: 48.0 },
    { district: "NJ-07", incumbent: "Thomas Kean Jr.", party: "R", pvi: -1, demPoll: 47.0, repPoll: 48.0 },
    { district: "OH-09", incumbent: "Marcy Kaptur", party: "D", pvi: -3, demPoll: 49.0, repPoll: 47.0 },
    { district: "OH-13", incumbent: "Emilia Sykes", party: "D", pvi: -1, demPoll: 48.0, repPoll: 48.0 },
    { district: "IA-03", incumbent: "Zach Nunn", party: "R", pvi: -3, demPoll: 46.0, repPoll: 49.0 },
    { district: "IA-01", incumbent: "Mariannette Miller-Meeks", party: "R", pvi: -3, demPoll: 46.0, repPoll: 48.0 },
    { district: "NE-02", incumbent: "Don Bacon", party: "R", pvi: 1, demPoll: 48.0, repPoll: 48.0 },
    { district: "WI-03", incumbent: "Derrick Van Orden", party: "R", pvi: -4, demPoll: 46.0, repPoll: 49.0 },
    { district: "TX-34", incumbent: "Vicente Gonzalez", party: "D", pvi: 9, demPoll: 50.0, repPoll: 46.0 },
    { district: "AK-AL", incumbent: "Open (Peltola running Senate)", party: "D", pvi: -8, demPoll: 45.0, repPoll: 48.0 }
];

const upsetComparisons = [
    { text: "drawing a specific single card from a full deck of 52 cards", minProb: 1.5, maxProb: 2.5 },
    { text: "rolling a double-six on two standard six-sided dice", minProb: 2.5, maxProb: 3.5 },
    { text: "correctly guessing a random digit from 0 to 9 on the first try", minProb: 9, maxProb: 11 },
    { text: "drawing any Face card (Jack, Queen, King) from a deck of 52 cards", minProb: 20, maxProb: 25 },
    { text: "flipping a fair coin and getting heads (50/50 toss-up)", minProb: 45, maxProb: 55 },
    { text: "rolling a 4, 5, or 6 on a single six-sided die", minProb: 48, maxProb: 52 },
    { text: "making a free throw in basketball if you are an average player", minProb: 65, maxProb: 75 },
    { text: "a seasoned professional golfer making a 3-foot putt", minProb: 95, maxProb: 99.5 },
    { text: "the sun rising tomorrow (a absolute sure thing!)", minProb: 99.5, maxProb: 100 }
];

// Exporting to window object for access across modular vanilla JS files
window.ForecastData = {
    senateBaselineData,
    houseBaselineData,
    upsetComparisons,
    genericBallotBaseline: {
        dem: 47.5,
        rep: 47.0
    }
};
