import fs from 'fs';
import client from '../db.js';

const importMayoralities = () => {
    fs.readFile('./ekatteFiles/ek_kmet.json','utf8', async (error,data)=>{
        if (error) {
            console.error("Error reading JSON file", error);
            return;
        }

        const mayoralities = JSON.parse(data);

        const validMayoralities = mayoralities.filter(mayorality => {
            return mayorality && mayorality.ekatte && mayorality.name && mayorality.kmetstvo;
        });

        for (const mayorality of validMayoralities) {

            const checkQuery = {
                text: 'SELECT COUNT(*) FROM mayoralties WHERE id_code = $1', 
                values: [mayorality.kmetstvo], 
            };

            const result = await client.query(checkQuery);
            const count = parseInt(result.rows[0].count);
            
            if (count > 0) {
                console.log(`Mayorality ${mayorality.name} already exists in the database. Skipping insertion.`);
                continue;  
            }
            const municipalityCode = mayorality.kmetstvo.split("-")[0];

            const municipalityIdQuery = {
                text: `SELECT id FROM municipalities WHERE code = $1`,
                values: [municipalityCode]
            }
            const resultMunicipalityId = await client.query(municipalityIdQuery);
            const municipalityId = resultMunicipalityId.rows[0].id;
            const docQuery = {
            text: "SELECT id FROM documents WHERE document = $1",
            values: [mayorality.document]
            };
            
            const docResult = await client.query(docQuery);
            const document_id = docResult.rows[0].id;
            const query = {
                text:'INSERT INTO mayoralties(id_code,name_bg,name_lat,municipality_id,code,document_id,category) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                values:[
                    mayorality.kmetstvo,
                    mayorality.name,
                    mayorality.name_en,
                    municipalityId,
                    mayorality.ekatte,
                    document_id,
                    mayorality.category
                ]
            };

            try {
                await client.query(query);
                console.log(`Inserted mayorality ${mayorality.name}`);
            } catch (error) {
                console.error(`Error inserting ${mayorality.name}`, error);
            }
            
        }
    }
)
}
importMayoralities();