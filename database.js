const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "database.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE providers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text, 
            phone text, 
            company text
            )`,
        (err) => {
            if (err) {
                // Table already created
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO providers (name, email, phone, company) VALUES (?,?,?,?)'
                db.run(insert, ["Juan Perez", "juan@example.com", "555-0100", "Distribuidora Perez"])
                db.run(insert, ["Maria Lopez", "maria@example.com", "555-0101", "Importadora Lopez"])
            }
        });  
    }
});

module.exports = db;
