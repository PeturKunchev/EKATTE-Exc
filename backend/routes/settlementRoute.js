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

    //PAGINATION

    let page = parseInt(parsedUrl.searchParams.get("page")) || 1;
    let limit = parseInt(parsedUrl.searchParams.get("limit")) || 20;

    if (page < 1) page = 1;
    if (limit < 1 || limit > 200) limit = 20;

    const offset = (page - 1) * limit;

    try {
        
        const totalRecordsQuery = `SELECT COUNT(*) AS all_records FROM settlements`;
        const totalRecordsResult = await client.query(totalRecordsQuery);
        const allRecords = Number(totalRecordsResult.rows[0].all_records);


        const countQuery = `SELECT COUNT(*) AS total FROM settlements s WHERE LOWER(s.name_bg) LIKE $1 OR LOWER (s.name_lat) LIKE $1`;
        const countResult = await client.query(countQuery, [searchKey]);
        const total = Number(countResult.rows[0].total);

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
               OR LOWER(s.name_lat) LIKE $1
               LIMIT $2 OFFSET $3
               `;
        const results = await client.query(resultsQuery,[searchKey,limit,offset]);
         return sendJSON(res, 200, {
            query: key,
            page,
            limit,
            total,
            allRecords,
            found: results.rowCount,   
            results: results.rows
        });
    } catch (error) {
        console.error("Search error:", error);
        return sendJSON(res, 500, { error: "Database search error" });
    }
}