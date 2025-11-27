import { debounceSearch, highlightMatch } from "./helpers/utils.js";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const suggestionsList = document.getElementById("suggestions");


const resultsTable = document.getElementById("resultsTable");
const resultsBody = document.getElementById("resultsBody");
const statSettlements = document.getElementById("statsFound");
const paginationBox = document.getElementById("pagination");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageLabel = document.getElementById("pageLabel");
const statsBox = document.getElementById("stats");

let currentPage = 1;
const limit = 20; 
let lastQuery = "";
let totalResults = 0;


export async function performSearch(page = 1) {
    const query = searchInput.value.trim();
    lastQuery = query;

    if (!query) {
        resultsTable.classList.add("hidden");
        paginationBox.classList.add("hidden");
        return;
    }

    try {
        const response = await fetch(
            `http://127.0.0.1:3000/api/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
        );        
        const data = await response.json();

        if (!response.ok) {
            console.error("Server error:", data);
            return;
        }
        currentPage = data.page;
        totalResults = data.total;

        updateStats(data.total, data.allRecords);
        updateResults(data.results);
        updatePagination();

    } catch (err) {
        console.error("Client fetch error:", err);
    }
}

function updateStats(totalFound, allRecords) {
    statSettlements.textContent = `${totalFound} / ${allRecords}`;
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
            <td>${highlightMatch(row.settlement_name, lastQuery)}</td>
            <td>${row.mayoralty_name && row.mayoralty_name.trim() !== "" 
        ? row.mayoralty_name 
        : row.settlement_name}</td>
            <td>${row.municipality_name}</td>
            <td>${row.region_name}</td>
        `;

        resultsBody.appendChild(tr);
    }

    resultsTable.classList.remove("hidden");
}
function updatePagination() {
    const totalPages = Math.ceil(totalResults / limit);

    pageLabel.textContent = `${currentPage} / ${totalPages}`;

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;

    paginationBox.classList.remove("hidden");
}
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        performSearch(currentPage - 1);
    }
})
nextBtn.addEventListener("click", () => {
    performSearch(currentPage + 1);
});
searchBtn.addEventListener("click", () => {
    suggestionsList.classList.add("hidden");
    performSearch()}
);

searchInput.addEventListener("input", () => {
    debounceSearch(()=> performSearch(), 300);
    suggestionsList.classList.add("hidden");
});
window.performSearch = performSearch;
