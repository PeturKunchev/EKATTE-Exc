import client from "../db.js";
import { sendJSON } from "../helpers/sendJson.js";

export async function suggestRouter(req,res) {
    
    const {method, url} = req;

    if (method !== "GET") {
        return (res, 405, { error: "Method not allowed" });
    }

    const parsedUrl = new URL(url, "http://localhost");
    const key = parsedUrl.searchParams.get("query");

    if (!key || key.trim().length < 1) {
        return sendJSON(res, 200, {suggestions: []});
    }

    const searchKey = `${key.toLowerCase()}%`;

    try {
        const q = `
            SELECT ekatte_code, name_bg 
            FROM settlements
            WHERE LOWER(name_bg) LIKE $1
            ORDER BY name_bg
            LIMIT 10
        `;
        const result = await client.query(q, [searchKey]);

        return sendJSON(res, 200, { suggestions: result.rows });

    } catch (err) {
        console.error("Suggest error:", err);
        return sendJSON(res, 500, { error: "Database error" });
    }

}