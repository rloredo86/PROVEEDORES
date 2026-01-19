const express = require("express");
const supabase = require("./supabase");

const app = express();
const HTTP_PORT = 8000;

app.use(express.json());

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        "message": "Provider API is running (Supabase)",
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
app.get("/api/providers", async (req, res) => {
    const { data, error } = await supabase
        .from('providers')
        .select('*');

    if (error) {
        res.status(400).json({ "error": error.message });
        return;
    }
    res.json({
        "message": "success",
        "data": data
    });
});

// Get a single provider
app.get("/api/providers/:id", async (req, res) => {
    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (error) {
        res.status(404).json({ "error": "Provider not found" });
        return;
    }
    res.json({
        "message": "success",
        "data": data
    });
});

// Create a new provider
app.post("/api/providers", async (req, res) => {
    const errors = [];
    if (!req.body.name) errors.push("No name specified");
    if (!req.body.company) errors.push("No company specified");

    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }

    const providerData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company
    };

    const { data, error } = await supabase
        .from('providers')
        .insert([providerData])
        .select();

    if (error) {
        res.status(400).json({ "error": error.message });
        return;
    }

    res.json({
        "message": "success",
        "data": data[0],
        "id": data[0].id
    });
});

// Update a provider
app.put("/api/providers/:id", async (req, res) => {
    const { data, error } = await supabase
        .from('providers')
        .update(req.body)
        .eq('id', req.params.id)
        .select();

    if (error) {
        res.status(400).json({ "error": error.message });
        return;
    }

    // Check if any row was actually updated
    if (data.length === 0) {
        res.status(404).json({ "error": "Provider not found" });
        return;
    }

    res.json({
        "message": "success",
        "data": data[0],
        "changes": 1
    });
});

// Delete a provider
app.delete("/api/providers/:id", async (req, res) => {
    const { message, error } = await supabase
        .from('providers')
        .delete()
        .eq('id', req.params.id);

    if (error) {
        res.status(400).json({ "error": error.message });
        return;
    }

    // Note: delete() doesn't return count by default without select or count option, 
    // but for simplicity we assume success if no error.
    res.json({ "message": "deleted" });
});

// Default response for any other request
app.use((req, res) => {
    res.status(404);
});
