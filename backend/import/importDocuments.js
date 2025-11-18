import fs from 'fs';
import client from '../db.js';

const importDocuments = () =>{
    fs.readFile('./ekatteFiles/ek_doc.json','utf8',async (err,data)=>{
        if (err) {
            console.error("Error reading JSON file", err);
            return;
        }

        const documents = JSON.parse(data);

        const validDocuments = documents.filter(document => {
            return document && document.document && document.doc_name;
        });

        for (const document of validDocuments) {

            const checkQuery = {
                text: 'SELECT COUNT(*) FROM documents WHERE document = $1', 
                values: [document.document], 
            };

            const result = await client.query(checkQuery);
            const count = parseInt(result.rows[0].count);

            if (count > 0) {
                console.log(`Document ${document.document} already exists in the database. Skipping insertion.`);
                continue;  
            }

        const query = {
            text: 'INSERT INTO documents(document, doc_kind, doc_name, doc_name_en, doc_inst, doc_num, doc_date, doc_act,dv_danni,dv_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            values: [
                document.document,
                document.doc_kind,
                document.doc_name,
                document.doc_name_en,
                document.doc_inst,
                document.doc_num,
                document.doc_date,
                document.doc_act,
                document.dv_danni,
                document.dv_date
            ],
        };
        try {
            await client.query(query);
            console.log(`Inserted document ${document.document}`);
            
        } catch (error) {
            console.error(`Error inserting ${document.document}`, error);
        }
    }
    });

}
importDocuments();