import fs from 'fs';
import client from '../db.js';

const importMayoralities = () => {
    fs.readFile('./ekatteFiles/ek_atte.json','utf8', async (error,data)=>{
        if (error) {
            console.error("Error reading JSON file", error);
            return;
        }

        const settlements = JSON.parse(data);

        const validSettlements = settlements.filter(settlement => {
            return settlement && settlement.ekatte && settlement.name;
        });

        for (const settlement of validSettlements) {

            const checkQuery = {
                text: 'SELECT COUNT(*) FROM settlements WHERE ekatte_code = $1', 
                values: [settlement.ekatte], 
            };

            const result = await client.query(checkQuery);
            const count = parseInt(result.rows[0].count);
            
            if (count > 0) {
                console.log(`Settlement ${settlement.name} already exists in the database. Skipping insertion.`);
                continue;  
            }

            const municipalityCode = settlement.kmetstvo.split("-")[0];

            const municipalityIdQuery = {
                text: `SELECT id FROM municipalities WHERE code = $1`,
                values: [municipalityCode]
            }
            const resultMunicipalityId = await client.query(municipalityIdQuery);
            const municipalityId = resultMunicipalityId.rows[0].id;


            const regionQuery = {
                text: `SELECT id FROM regions WHERE region_code = $1`,
                values: [settlement.oblast]
            };

            const resultRegion = await client.query(regionQuery);
            const region_id = resultRegion.rows[0].id;
            const mayoralityQuery = {
                text: `SELECT id FROM mayoralties WHERE id_code = $1`,
                values: [settlement.kmetstvo]
            };
            const resultMayorality = await client.query(mayoralityQuery);
            let mayorality_id = null;
            if (resultMayorality.rows.length > 0) {
                mayorality_id = resultMayorality.rows[0].id;
            }
            
            const query = {
                text:'INSERT INTO settlements(ekatte_code,type,name_bg,name_lat,region_id,municipality_id,mayoralty_id,type_code,category_code,sea_level_code,sea_level,document) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
                values:[
                    settlement.ekatte,
                    settlement.t_v_m,
                    settlement.name,
                    settlement.name_en,
                    region_id,
                    municipalityId,
                    mayorality_id,
                    settlement.kind,
                    settlement.category,
                    settlement.altitude,
                    settlement.text,
                    settlement.document,
                ]
            };

            try {
                await client.query(query);
                console.log(`Inserted settlement ${settlement.name}`);
            } catch (error) {
                console.error(`Error inserting ${settlement.name}`, error);
            }
            
        }
    }
)
}
importMayoralities();