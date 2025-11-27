import fs from "fs";
import client from "../db.js";
import {
  isNonEmptyString,
  isValidCategory,
  isValidDocumentCode,
  isValidEkatte,
  isValidMunicipalityCode,
} from "../validators/validators.js";

const importMunicipalities = () => {
  fs.readFile("./ekatteFiles/ek_obst.json", "utf8", async (error, data) => {
    if (error) {
      console.error("Error reading JSON file", err);
      return;
    }

    const municipalities = JSON.parse(data);

    const validMunicipalities = municipalities.filter((municipality) => {
      if (!municipality) {
        return false;
      }
      return (
        isValidEkatte(municipality.ekatte) &&
        isValidMunicipalityCode(municipality.obshtina) &&
        isValidDocumentCode(municipality.document) &&
        isNonEmptyString(municipality.name) &&
        isNonEmptyString(municipality.name_en) &&
        isValidCategory(municipality.category)
      );
    });

    for (const municipality of validMunicipalities) {
      const regionQuery = {
        text: `SELECT id FROM regions WHERE nuts3 = $1`,
        values: [municipality.nuts3],
      };

      const resultRegion = await client.query(regionQuery);
      const region_id = resultRegion.rows[0].id;

      const checkQuery = {
        text: "SELECT COUNT(*) FROM municipalities WHERE code = $1",
        values: [municipality.obshtina],
      };

      const result = await client.query(checkQuery);
      const count = parseInt(result.rows[0].count);

      if (count > 0) {
        console.log(
          `Municipality ${municipality.name} already exists in the database. Skipping insertion.`
        );
        continue;
      }

      const query = {
        text: "INSERT INTO municipalities(code,municipality_code,region_id,name_bg,name_lat,category,document) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        values: [
          municipality.obshtina,
          municipality.ekatte,
          region_id,
          municipality.name,
          municipality.name_en,
          municipality.category,
          municipality.document,
        ],
      };

      try {
        await client.query(query);
        console.log(`Inserted municipality ${municipality.name}`);
      } catch (error) {
        console.error(`Error inserting ${municipality.name}`, error);
      }
    }
  });
};
importMunicipalities();
