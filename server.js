const express = require("express");
const app = express();
const HTTP_PORT = 8000;

app.use(express.json());

// Hardcoded in-memory data
let providers = [
    { id: 1, name: "Juan Perez", email: "juan@example.com", phone: "555-0100", company: "Distribuidora Perez" },
    { id: 2, name: "Maria Lopez", email: "maria@example.com", phone: "555-0101", company: "Importadora Lopez" }
];
let nextId = 3;

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        "message": "Provider API is running (In-Memory)",
        "endpoints": {
            "GetAll": "GET /api/providers",
            "GetOne": "GET /api/providers/:id",
            "Create": "POST /api/providers",
            "Update": "PUT /api/providers/:id",
            "Delete": "DELETE /api/providers/:id"
        }
    });
});

// Get all providers
app.get("/api/providers", (req, res) => {
    res.json({
        "message": "success",
        "data": providers
    });
});

// Get a single provider
app.get("/api/providers/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const provider = providers.find(p => p.id === id);
    if (!provider) {
        res.status(404).json({ "error": "Provider not found" });
        return;
    }
    res.json({
        "message": "success",
        "data": provider
    });
});

// Create a new provider
app.post("/api/providers", (req, res) => {
    const errors = [];
    if (!req.body.name) errors.push("No name specified");
    if (!req.body.company) errors.push("No company specified");

    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }

    const newProvider = {
        id: nextId++,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company
    };

    providers.push(newProvider);

    res.json({
        "message": "success",
        "data": newProvider,
        "id": newProvider.id
    });
});

// Update a provider
app.put("/api/providers/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const providerIndex = providers.findIndex(p => p.id === id);

    if (providerIndex === -1) {
        res.status(404).json({ "error": "Provider not found" });
        return;
    }

    const current = providers[providerIndex];
    const updated = {
        id: id,
        name: req.body.name || current.name,
        email: req.body.email || current.email,
        phone: req.body.phone || current.phone,
        company: req.body.company || current.company
    };

    providers[providerIndex] = updated;

    res.json({
        "message": "success",
        "data": updated,
        "changes": 1
    });
});

// Delete a provider
app.delete("/api/providers/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = providers.length;
    providers = providers.filter(p => p.id !== id);

    if (providers.length === initialLength) {
        res.status(404).json({ "message": "Provider not found or already deleted", changes: 0 });
        return;
    }

    res.json({ "message": "deleted", changes: 1 });
});

// Default response for any other request
app.use((req, res) => {
    res.status(404);
});
