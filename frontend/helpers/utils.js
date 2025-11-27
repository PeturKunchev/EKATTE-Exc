export let debounceSearchTimer = null;
export let debounceSuggestTimer = null;

export function debounceSearch(callback, delay = 300) {
  clearTimeout(debounceSearchTimer);
  debounceSearchTimer = setTimeout(callback, delay);
}

export function debounceSuggest(callback, delay = 300) {
  clearTimeout(debounceSuggestTimer);
  debounceSuggestTimer = setTimeout(callback, delay);
}

export function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<strong>$1</strong>");
}
