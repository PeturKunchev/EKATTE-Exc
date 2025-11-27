import http from 'http';
import client from './db.js';
import 'dotenv/config';
import { sendJSON } from './helpers/sendJson.js';
import { setCors } from './helpers/setCors.js';
import { notFound } from './helpers/responses.js';
// import { regionsRouter } from './routes/regions.js';
import { searchRouter } from './routes/settlementRoute.js';
import { suggestRouter } from './routes/suggestRoute.js';

const PORT = process.env.PORT;
const URL = process.env.URL;

const server = http.createServer(async (req,res)=>{

    const {url,method} = req;
    if (method === 'OPTIONS') {
        setCors(res);
        res.writeHead(204);
        return res.end();
    }
    if (url === "/api/ping" && method === "GET") {
        return sendJSON(res, 200, { message: "PONG" });
    }
    if (url === "/api/db-test" && method === "GET") {
        try {
            const result = await client.query("SELECT NOW()");
            return sendJSON(res, 200, { dbTime: result.rows[0] });
        } catch (err) {
            return sendJSON(res, 500, { error: err.message });
        }
    }

    // if (url.startsWith("/api/regions")) {
    //     return regionsRouter(req,res);
    // }
    if (url.startsWith("/api/search")) {
    return searchRouter(req, res);
}

    if (url.startsWith("/api/suggest")) {
        return suggestRouter(req,res);
    }

    return notFound(res);
});

server.listen(PORT, ()=>{
    console.log(`API running at ${URL}:${PORT}`);
    
});