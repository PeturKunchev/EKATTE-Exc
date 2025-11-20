import client from "../db.js";
import { sendJSON } from "../helpers/sendJson.js";

export async function searchRouter(req,res) {
    const {method, url} = req;

    if (method !== "GET") {
        return sendJSON(res, 405, { error: "Method not allowed" });
    }

    const parsedUrl = new URL(url, "http://localhost");
    const key = parsedUrl.searchParams.get("query");

    if (!key || key.trim().length < 1) {
        return sendJSON(res, 400, { error: "Missing or empty ?query=" });
    }
    const searchKey = `%${key.toLowerCase()}%`;

    try {
        const resultsQuery = `
         SELECT 
                s.id,
                s.ekatte_code,
                s.name_bg AS settlement_name,

                COALESCE(m.name_bg, '') AS mayoralty_name,
                mu.name_bg AS municipality_name,
                r.name_bg AS region_name

            FROM settlements s
            LEFT JOIN mayoralties m ON s.mayoralty_id = m.id
            JOIN municipalities mu ON s.municipality_id = mu.id
            JOIN regions r ON s.region_id = r.id

            WHERE LOWER(s.name_bg) LIKE $1
               OR LOWER(s.name_lat) LIKE $1`;
        const results = await client.query(resultsQuery,[searchKey]);
        const stats = {
            settlements: results.rowCount,
            mayoralties: new Set(results.rows.map(r=> r.mayoralty_name)).size,
            municipalities: new Set(results.rows.map(r => r.municipality_name)).size,
            regions: new Set(results.rows.map(r => r.region_name)).size
        };
        return sendJSON(res,200,{
            query: key,
            stats,
            results: results.rows
        });
    } catch (error) {
        onsole.error("Search error:", err);
        return sendJSON(res, 500, { error: "Database search error" });
    }
}