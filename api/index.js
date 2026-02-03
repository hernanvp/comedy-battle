const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ============================================
// IN-MEMORY DATABASE
// Persiste durante la sesión del serverless
// Para eventos de 1-2 horas es suficiente
// ============================================
let database = {
    comedians: [
        { id: 1, name: "Diego Comediante" },
        { id: 2, name: "María Risas" },
        { id: 3, name: "Carlos Jokester" },
        { id: 4, name: "Laura Stand-Up" }
    ],
    nextId: 5,
    registrados: [],
    votos: { "1": 0, "2": 0, "3": 0, "4": 0 },
    maxDB: { "1": 0, "2": 0, "3": 0, "4": 0 },
    votes: {}
};

// ============================================
// ENDPOINTS
// ============================================

// Get all data
app.get('/api/data', (req, res) => {
    res.json(database);
});

// Get comedians only
app.get('/api/comedians', (req, res) => {
    res.json(database.comedians);
});

// Add comedian
app.post('/api/comedians', (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const newComedian = {
        id: database.nextId,
        name: name.trim()
    };

    database.comedians.push(newComedian);
    database.votos[newComedian.id] = 0;
    database.maxDB[newComedian.id] = 0;
    database.nextId++;

    res.json(newComedian);
});

// Update comedian
app.put('/api/comedians/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const comedian = database.comedians.find(c => c.id === id);

    if (!comedian) {
        return res.status(404).json({ error: 'Comedian not found' });
    }

    comedian.name = name.trim();
    res.json(comedian);
});

// Delete comedian
app.delete('/api/comedians/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = database.comedians.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Comedian not found' });
    }

    database.comedians.splice(index, 1);
    delete database.votos[id];
    delete database.maxDB[id];

    // Reset votes if someone voted for this comedian
    Object.keys(database.votes).forEach(sessionId => {
        if (database.votes[sessionId] === id) {
            delete database.votes[sessionId];
        }
    });

    res.json({ success: true });
});

// Register attendee
app.post('/api/register', (req, res) => {
    const { nombre, email, telefono } = req.body;

    if (!nombre || !email || !telefono) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    database.registrados.push({
        nombre,
        email,
        telefono,
        timestamp: new Date().toISOString()
    });

    res.json({ success: true });
});

// Vote for comedian
app.post('/api/vote', (req, res) => {
    const { comedianId, sessionId } = req.body;

    if (!comedianId || !sessionId) {
        return res.status(400).json({ error: 'Comedian ID and session ID required' });
    }

    // Check if already voted
    if (database.votes[sessionId]) {
        return res.status(400).json({ error: 'Already voted' });
    }

    // Check if comedian exists
    const comedian = database.comedians.find(c => c.id === comedianId);
    if (!comedian) {
        return res.status(404).json({ error: 'Comedian not found' });
    }

    // Register vote
    database.votos[comedianId] = (database.votos[comedianId] || 0) + 1;
    database.votes[sessionId] = comedianId;

    res.json({ success: true, votes: database.votos[comedianId] });
});

// Update max dB for comedian
app.post('/api/maxdb', (req, res) => {
    const { comedianId, maxDB } = req.body;

    if (!comedianId || maxDB === undefined) {
        return res.status(400).json({ error: 'Comedian ID and maxDB required' });
    }

    const comedian = database.comedians.find(c => c.id === comedianId);

    if (!comedian) {
        return res.status(404).json({ error: 'Comedian not found' });
    }

    // Only update if new max is higher
    if (maxDB > (database.maxDB[comedianId] || 0)) {
        database.maxDB[comedianId] = maxDB;
    }

    res.json({ success: true, maxDB: database.maxDB[comedianId] });
});

// Get ranking
app.get('/api/ranking', (req, res) => {
    const ranking = database.comedians.map(comedian => ({
        ...comedian,
        votos: database.votos[comedian.id] || 0,
        maxDB: database.maxDB[comedian.id] || 0,
        score: (database.votos[comedian.id] || 0) * 10 + (database.maxDB[comedian.id] || 0)
    }));

    ranking.sort((a, b) => b.score - a.score);
    res.json(ranking);
});

// Get statistics
app.get('/api/stats', (req, res) => {
    const totalVotos = Object.values(database.votos).reduce((sum, v) => sum + v, 0);
    const maxGlobal = Math.max(...Object.values(database.maxDB), 0);

    res.json({
        registrados: database.registrados.length,
        totalVotos,
        maxGlobal: Math.round(maxGlobal),
        comediantes: database.comedians.length
    });
});

// Reset all data
app.post('/api/reset', (req, res) => {
    database.registrados = [];
    database.votes = {};

    // Reset votes and maxDB for all comedians
    database.comedians.forEach(c => {
        database.votos[c.id] = 0;
        database.maxDB[c.id] = 0;
    });

    res.json({ success: true });
});

// Export data
app.get('/api/export', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=comedy-battle-export.json');
    res.json(database);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        storage: 'in-memory',
        comedians: database.comedians.length,
        votes: Object.keys(database.votes).length
    });
});

// Root route
app.get('/api', (req, res) => {
    res.json({
        message: 'Comedy Battle API',
        version: '2.0',
        storage: 'in-memory',
        endpoints: {
            comedians: '/api/comedians',
            vote: '/api/vote',
            ranking: '/api/ranking',
            stats: '/api/stats',
            health: '/api/health'
        }
    });
});

// CRITICAL: Export for Vercel serverless
module.exports = app;
