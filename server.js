const express = require("express");
const db = require("./database.js");

const app = express();
const HTTP_PORT = 8000;

app.use(express.json());

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({ "message": "Ok" });
});

// Get all providers
app.get("/api/providers", (req, res, next) => {
    const sql = "select * from providers";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Get a single provider
app.get("/api/providers/:id", (req, res, next) => {
    const sql = "select * from providers where id = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
});

// Create a new provider
app.post("/api/providers", (req, res, next) => {
    const errors = [];
    if (!req.body.name) {
        errors.push("No name specified");
    }
    if (!req.body.company) {
        errors.push("No company specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    const data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company
    }
    const sql = 'INSERT INTO providers (name, email, phone, company) VALUES (?,?,?,?)';
    const params = [data.name, data.email, data.phone, data.company];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        });
    });
});

// Update a provider
app.put("/api/providers/:id", (req, res, next) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company
    };
    db.run(
        `UPDATE providers set 
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           phone = COALESCE(?,phone), 
           company = COALESCE(?,company) 
           WHERE id = ?`,
        [data.name, data.email, data.phone, data.company, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message });
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "changes": this.changes
            });
        });
});

// Delete a provider
app.delete("/api/providers/:id", (req, res, next) => {
    db.run(
        'DELETE FROM providers WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message });
                return;
            }
            res.json({ "message": "deleted", changes: this.changes });
        });
});

// Default response for any other request
app.use((req, res) => {
    res.status(404);
});
