import fs from 'fs';
import client from '../db.js';
import { isNonEmptyString, isValidDocumentCode, isValidEkatte, isValidNUTS, isValidRegionCode } from '../validators/validators.js';

const importRegions = () =>{
    fs.readFile('./ekatteFiles/ek_obl.json','utf8',async (err,data)=>{
        if (err) {
            console.error("Error reading JSON file", err);
            return;
        }

        const regions = JSON.parse(data);

        const validRegions = regions.filter(region => {
            if (!region) return false;

            return (
                isValidEkatte(region.ekatte) &&
                isValidRegionCode(region.oblast) &&
                isNonEmptyString(region.name) && 
                isNonEmptyString(region.name_en) && 
                isValidNUTS(region.nuts1, region.nuts2,region.nuts3) &&
                isValidDocumentCode(region.document)
            )
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


        const query = {
            text: 'INSERT INTO regions(code, region_code, name_bg, name_lat, NUTS1, NUTS2, NUTS3, document) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            values: [
                region.ekatte,
                region.oblast,
                region.name,
                region.name_en,
                region.nuts1,
                region.nuts2,
                region.nuts3,
                region.document,
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