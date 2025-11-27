import { setCors } from "../helpers/setCors.js";
import { test, expect } from "vitest";

function createResMock() {
    return {
        headers: {},
        setHeader(key, value) {
            this.headers[key] = value;
        }
    };
}

test("setCors sets correct headers", () => {
    const res = createResMock();
    setCors(res);

    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.headers["Access-Control-Allow-Methods"]).toBe("GET, POST, OPTIONS");
    expect(res.headers["Access-Control-Allow-Headers"]).toBe("Content-Type, Authorization");
});