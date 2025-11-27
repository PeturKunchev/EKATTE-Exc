import { sendJSON } from "../helpers/sendJson.js";
import { test, expect } from "vitest";

test("sendJSON sets headers and sends JSON", () => {
    const res = {
        headers: {},
        body: "",
        status: null,
        setHeader(key, value) { this.headers[key] = value; },
        writeHead(status, headers) {
            this.status = status;
            this.headers = { ...this.headers, ...headers };
        },
        end(payload) {
            this.body = payload;
        }
    };

    sendJSON(res, 200, { ok: true });

    expect(res.status).toBe(200);
    expect(res.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(res.body)).toEqual({ ok: true });
});