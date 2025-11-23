export function isNonEmptyString(str) {
    return typeof str === "string" && str.trim().length > 0;
}

export function trimString(str) {
    return typeof str === "string" ? str.trim() : str;
}

export function isValidEkatte(code) {
    return /^\d{5}$/.test(code);
}

export function isValidRegionCode(code) {
    return /^[A-Za-z]{3}$/.test(code);
}

export function isValidMunicipalityCode(code) {
    return /^[A-Za-z]{3}\d{2}$/.test(code);
}

export function isValidMayoraltyCode(code) {
    return /^[A-Za-z]{3}\d{2}-\d{2}$/.test(code);
}

export function isValidDocumentCode(doc) {
    return /^\d{3,4}$/.test(doc);
}

export function isValidNUTS(n1,n2,n3) {
    return (
        /^BG\d$/.test(n1) && /^BG\d{2}$/.test(n2) && /^BG\d{3}$/.test(n3)
    )
}

export function isValidSettlementType(type) {
    return ["гр.","с.","ман."].includes(type.trim());
}

export function isValidSettlementKind(kind) {
    return ["1","3","7"].includes(String(kind));
}

export function isValidCategory(category) {
    return /^\d$/.test(category);
}

export function isValidAltitude(alt) {
    return /^[1-8]$/.test(String(alt));
}