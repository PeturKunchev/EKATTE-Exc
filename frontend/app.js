const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const statsBox = document.getElementById("stats");
const statSettlements = document.getElementById("statSettlements");
const statMayoralities = document.getElementById("statMayoralities");
const statMunicipalities = document.getElementById("statMunicipalities");
const statRegions = document.getElementById("statRegions");

const resultsTable = document.getElementById("resultsTable");
const resultsBody = document.getElementById("resultsBody");

let debounceTimer = null;

function debounce(callback, delay = 300) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, delay);
}

async function performSearch() {
    const query = searchInput.value.trim();

    if (!query) {
        resultsTable.classList.add("hidden");
        statsBox.classList.add("hidden");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:3000/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!response.ok) {
            console.error("Server error:", data);
            return;
        }

        updateStats(data.stats);
        updateResults(data.results);

    } catch (err) {
        console.error("Client fetch error:", err);
    }
}

function updateStats(stats) {
    statSettlements.textContent = stats.settlements;
    statMayoralities.textContent = stats.mayoralties;
    statMunicipalities.textContent = stats.municipalities;
    statRegions.textContent = stats.regions;
    statsBox.classList.remove("hidden");
}

function updateResults(results) {
    resultsBody.innerHTML = "";

    if (results.length === 0) {
        resultsTable.classList.add("hidden");
        return;
    }

    for (const row of results) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${row.ekatte_code}</td>
            <td>${row.settlement_name}</td>
            <td>${row.mayoralty_name && row.mayoralty_name.trim() !== "" 
        ? row.mayoralty_name 
        : 'Няма кметство'}</td>
            <td>${row.municipality_name}</td>
            <td>${row.region_name}</td>
        `;

        resultsBody.appendChild(tr);
    }

    resultsTable.classList.remove("hidden");
}

searchBtn.addEventListener("click", () => performSearch());

searchInput.addEventListener("input", () => {
    debounce(performSearch, 300);
});