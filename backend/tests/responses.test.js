import { notFound } from "../helpers/responses.js";
import { test, expect } from "vitest";

test("notFound sends 404 JSON response", () => {
    const res = {
        status: null,
        headers: {},
        body: "",
        writeHead(status, headers) {
            this.status = status;
            this.headers = headers;
        },
        end(payload) { this.body = payload; }
    };

    notFound(res);

    expect(res.status).toBe(404);
    expect(res.headers["Content-Type"]).toBe("application/json");

    const body = JSON.parse(res.body);
    expect(body.error).toBe("Not found");
});