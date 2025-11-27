import { debounceSuggest, highlightMatch } from "./helpers/utils.js";

const searchInput = document.getElementById("searchInput");
const suggestionsList = document.getElementById("suggestions");

export async function loadSuggestions() {
    const q = searchInput.value.trim();

    if (q.length < 2) {
        suggestionsList.classList.add("hidden");
        return;
    }

    const res = await fetch(`http://127.0.0.1:3000/api/suggest?query=${encodeURIComponent(q)}`);
    const data = await res.json();

    suggestionsList.innerHTML = "";

    if (!data.suggestions.length) {
        suggestionsList.classList.add("hidden");
        return;
    }

    data.suggestions.forEach(s => {
        const li = document.createElement("li");
        li.innerHTML = highlightMatch(s.name_bg,q);
        li.addEventListener("click",()=>{
            searchInput.value = s.name_bg;
            suggestionsList.classList.add("hidden");

            window.performSearch();
            
        });
        suggestionsList.appendChild(li);
    });

    suggestionsList.classList.remove("hidden");
}

searchInput.addEventListener("input", () => {
    debounceSuggest(loadSuggestions, 300);
});