import { describe, test, expect } from "vitest";
import {
    isNonEmptyString,
    trimString,
    isValidEkatte,
    isValidRegionCode,
    isValidMunicipalityCode,
    isValidMayoraltyCode,
    isValidDocumentCode,
    isValidNUTS,
    isValidSettlementType,
    isValidSettlementKind,
    isValidCategory,
    isValidAltitude
} from "../validators/validators.js";

describe("validators.js", () => {

    test("isNonEmptyString", () => {
        expect(isNonEmptyString("Hello")).toBe(true);
        expect(isNonEmptyString("   ")).toBe(false);
        expect(isNonEmptyString(123)).toBe(false);
        expect(isNonEmptyString(null)).toBe(false);
    });

    test("trimString", () => {
        expect(trimString("  hi  ")).toBe("hi");
        expect(trimString(123)).toBe(123);
        expect(trimString(null)).toBe(null);
    });

    test("isValidEkatte", () => {
        expect(isValidEkatte("12345")).toBe(true);
        expect(isValidEkatte("1234")).toBe(false);
        expect(isValidEkatte("abcde")).toBe(false);
    });

    test("isValidRegionCode", () => {
        expect(isValidRegionCode("VAR")).toBe(true);
        expect(isValidRegionCode("VaR")).toBe(true);
        expect(isValidRegionCode("V")).toBe(false);
        expect(isValidRegionCode("123")).toBe(false);
    });

    test("isValidMunicipalityCode", () => {
        expect(isValidMunicipalityCode("VAR01")).toBe(true);
        expect(isValidMunicipalityCode("V0101")).toBe(false);
        expect(isValidMunicipalityCode("VAR1")).toBe(false);
    });

    test("isValidMayoraltyCode", () => {
        expect(isValidMayoraltyCode("VAR01-03")).toBe(true);
        expect(isValidMayoraltyCode("VAR0103")).toBe(false);
        expect(isValidMayoraltyCode("VA01-01")).toBe(false);
    });

    test("isValidDocumentCode", () => {
        expect(isValidDocumentCode("123")).toBe(true);
        expect(isValidDocumentCode("1234")).toBe(true);
        expect(isValidDocumentCode("12")).toBe(false);
        expect(isValidDocumentCode("abc")).toBe(false);
    });

    test("isValidNUTS", () => {
        expect(isValidNUTS("BG3", "BG33", "BG331")).toBe(true);
        expect(isValidNUTS("BGX", "BG33", "BG331")).toBe(false);
        expect(isValidNUTS("BG3", "BG3A", "BG331")).toBe(false);
        expect(isValidNUTS("BG3", "BG33", "BG33A")).toBe(false);
    });

    test("isValidSettlementType", () => {
        expect(isValidSettlementType("гр.")).toBe(true);
        expect(isValidSettlementType("с.")).toBe(true);
        expect(isValidSettlementType("ман.")).toBe(true);
        expect(isValidSettlementType("test")).toBe(false);
    });

    test("isValidSettlementKind", () => {
        expect(isValidSettlementKind("1")).toBe(true);
        expect(isValidSettlementKind(3)).toBe(true);
        expect(isValidSettlementKind("5")).toBe(false);
    });

    test("isValidCategory", () => {
        expect(isValidCategory("4")).toBe(true);
        expect(isValidCategory("10")).toBe(false);
        expect(isValidCategory("A")).toBe(false);
    });

    test("isValidAltitude", () => {
        expect(isValidAltitude("5")).toBe(true);
        expect(isValidAltitude(8)).toBe(true);
        expect(isValidAltitude(0)).toBe(false);
        expect(isValidAltitude(9)).toBe(false);
    });

});