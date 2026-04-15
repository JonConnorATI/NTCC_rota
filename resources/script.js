// ------------------------------
// FIXED SHIFT PATTERNS
// ------------------------------
const shiftPatterns = [
    { job: 55, shifts: ["Nights","Nights","Nights","Nights","Nights","Rest","Rest"] },
    { job: 56, shifts: ["Rest","Late","Late","Late","Late","Late","Late"] },
    { job: 57, shifts: ["Late","Rest","Rest","Early","Early","Early","Early"] },
    { job: 58, shifts: ["1900","1900","1900","1900","1900","Rest","Rest"] },
    { job: 59, shifts: ["A/R","A/R","A/R","A/R","A/R","A/R","A/R"] },
    { job: 60, shifts: ["Early","Early","Early","Late","Late","Rest","Rest"] },
    { job: 61, shifts: ["Late","Late","Late","Rest","Rest","Nights","Nights"] },
    { job: 62, shifts: ["Rest","Rest","Rest","Early","Early","Middle","Middle"] },
    { job: 63, shifts: ["Early","Early","Early","Rest","Rest","1900","1900"] },
    { job: 64, shifts: ["A/R","A/R","A/R","A/R","A/R","A/R","A/R"] },
    { job: 65, shifts: ["Rest","Rest","A/R","A/R","A/R","Early","Early"] },
    { job: 66, shifts: ["Early Breaks","Early Breaks","Early Breaks","Early Breaks","Early Breaks","Rest","Rest"] },
    { job: 67, shifts: ["A/R","A/R","A/R","A/R","A/R","A/R","A/R"] }
];

// ------------------------------
// NAMES THAT ROTATE
// ------------------------------
const names = [
    "Declan C",
    "Marco V B",
    "Reece McD",
    "Nick V",
    "Pat F",
    "Eddie McK",
    "Harrison J",
    "Jack D",
    "Jon C",
    "Nico B",
    "Caroline O'B",
    "Dave C",
    "Aran O"
];

// ------------------------------
// BUILD WEEK SELECTOR
// ------------------------------
function buildWeekSelector() {
    const select = document.getElementById("weekSelect");

    for (let w = 16; w <= 52; w++) {
        const opt = document.createElement("option");
        opt.value = w;
        opt.textContent = `Week ${w}`;
        select.appendChild(opt);
    }
    for (let w = 1; w <= 15; w++) {
        const opt = document.createElement("option");
        opt.value = w;
        opt.textContent = `Week ${w}`;
        select.appendChild(opt);
    }
}
buildWeekSelector();

// ------------------------------
// DATE CALCULATION
// ------------------------------
const week16Start = new Date("2026-04-13");

function getWeekDates(week) {
    let start;

    if (week >= 16) {
        const offset = (week - 16) * 7;
        start = new Date(week16Start);
        start.setDate(start.getDate() + offset);
    } else {
        const week1Start = new Date("2026-12-28");
        const offset = (week - 1) * 7;
        start = new Date(week1Start);
        start.setDate(start.getDate() + offset);
    }

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.toDateString()} - ${end.toDateString()}`;
}

// ------------------------------
// NAME ROTATION (DOWNWARD)
// ------------------------------
function rotateNames(week) {
    const rotated = [...names];
    const shift = (week - 16) % names.length;

    for (let i = 0; i < names.length; i++) {
        rotated[i] = names[(i - shift + names.length) % names.length];
    }
    return rotated;
}

// ------------------------------
// UPDATE ROTA TABLE
// ------------------------------
function updateRota() {
    const week = parseInt(document.getElementById("weekSelect").value);
    const rotatedNames = rotateNames(week);

    document.getElementById("dateRange").innerText = getWeekDates(week);

    const tbody = document.querySelector("#rotaTable tbody");
    tbody.innerHTML = "";

    for (let i = 0; i < shiftPatterns.length; i++) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${shiftPatterns[i].job}</td>
            <td>${rotatedNames[i]}</td>
            ${shiftPatterns[i].shifts.map(s => {
                let cls = s.replace(" ", "").replace("/", "\\/");
                if (cls === "1900") cls = "_1900";
                return `<td class="${cls}">${s}</td>`;
            }).join("")}
        `;

        tbody.appendChild(row);
    }
}

// ------------------------------
// AUTO‑SELECT CURRENT WEEK
// ------------------------------
function autoSelectCurrentWeek() {
    const today = new Date();
    const diff = Math.floor((today - week16Start) / (7 * 24 * 60 * 60 * 1000));
    let week = 16 + diff;

    if (week > 52) week = week - 52;
    if (week < 1) week = 16;

    document.getElementById("weekSelect").value = week;
}
autoSelectCurrentWeek();

// Initial render
updateRota();
