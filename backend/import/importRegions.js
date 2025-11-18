import fs from 'fs';
import client from '../db.js';

const importRegions = () =>{
    fs.readFile('./ekatteFiles/ek_obl.json','utf8',async (err,data)=>{
        if (err) {
            console.error("Error reading JSON file", err);
            return;
        }

        const regions = JSON.parse(data);

        const validRegions = regions.filter(region => {
            return region && region.ekatte && region.name && region.oblast;
        });

        for (const region of validRegions) {

            const checkQuery = {
                text: 'SELECT COUNT(*) FROM regions WHERE region_code = $1', 
                values: [region.oblast], 
            };

            const result = await client.query(checkQuery);
            const count = parseInt(result.rows[0].count);

            if (count > 0) {
                console.log(`Region ${region.name} already exists in the database. Skipping insertion.`);
                continue;  
            }

            const docQuery = {
            text: "SELECT id FROM documents WHERE document = $1",
            values: [region.document]
            };

            const docResult = await client.query(docQuery);
            const document_id = docResult.rows[0].id;

        const query = {
            text: 'INSERT INTO regions(code, region_code, name_bg, name_lat, NUTS1, NUTS2, NUTS3, document_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            values: [
                region.ekatte,
                region.oblast,
                region.name,
                region.name_en,
                region.nuts1,
                region.nuts2,
                region.nuts3,
                document_id,
            ],
        };
        try {
            await client.query(query);
            console.log(`Inserted region ${region.name}`);
            
        } catch (error) {
            console.error(`Error inserting ${region.name}`, error);
        }
    }
    });

}
importRegions();