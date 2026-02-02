const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize database
async function initDB() {
    try {
        await fs.access(DB_FILE);
    } catch {
        const initialData = {
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
        await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
        console.log('✅ Database initialized');
    }
}

// Read database
async function readDB() {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
}

// Write database
async function writeDB(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// ============================================
// ENDPOINTS
// ============================================

// Get all data
app.get('/api/data', async (req, res) => {
    try {
        const data = await readDB();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error reading data' });
    }
});

// Get comedians only
app.get('/api/comedians', async (req, res) => {
    try {
        const data = await readDB();
        res.json(data.comedians);
    } catch (error) {
        res.status(500).json({ error: 'Error reading comedians' });
    }
});

// Add comedian
app.post('/api/comedians', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const data = await readDB();
        const newComedian = {
            id: data.nextId,
            name: name.trim()
        };

        data.comedians.push(newComedian);
        data.votos[newComedian.id] = 0;
        data.maxDB[newComedian.id] = 0;
        data.nextId++;

        await writeDB(data);
        res.json(newComedian);
    } catch (error) {
        res.status(500).json({ error: 'Error adding comedian' });
    }
});

// Update comedian
app.put('/api/comedians/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const data = await readDB();
        const comedian = data.comedians.find(c => c.id === id);

        if (!comedian) {
            return res.status(404).json({ error: 'Comedian not found' });
        }

        comedian.name = name.trim();
        await writeDB(data);
        res.json(comedian);
    } catch (error) {
        res.status(500).json({ error: 'Error updating comedian' });
    }
});

// Delete comedian
app.delete('/api/comedians/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await readDB();
        const index = data.comedians.findIndex(c => c.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Comedian not found' });
        }

        data.comedians.splice(index, 1);
        delete data.votos[id];
        delete data.maxDB[id];

        // Reset votes if someone voted for this comedian
        Object.keys(data.votes).forEach(sessionId => {
            if (data.votes[sessionId] === id) {
                delete data.votes[sessionId];
            }
        });

        await writeDB(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting comedian' });
    }
});

// Register attendee
app.post('/api/register', async (req, res) => {
    try {
        const { nombre, email, telefono } = req.body;

        if (!nombre || !email || !telefono) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const data = await readDB();
        data.registrados.push({
            nombre,
            email,
            telefono,
            timestamp: new Date().toISOString()
        });

        await writeDB(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error registering attendee' });
    }
});

// Vote for comedian
app.post('/api/vote', async (req, res) => {
    try {
        const { comedianId, sessionId } = req.body;

        if (!comedianId || !sessionId) {
            return res.status(400).json({ error: 'Comedian ID and session ID required' });
        }

        const data = await readDB();

        // Check if already voted
        if (data.votes[sessionId]) {
            return res.status(400).json({ error: 'Already voted' });
        }

        // Check if comedian exists
        const comedian = data.comedians.find(c => c.id === comedianId);
        if (!comedian) {
            return res.status(404).json({ error: 'Comedian not found' });
        }

        // Register vote
        data.votos[comedianId] = (data.votos[comedianId] || 0) + 1;
        data.votes[sessionId] = comedianId;

        await writeDB(data);
        res.json({ success: true, votes: data.votos[comedianId] });
    } catch (error) {
        res.status(500).json({ error: 'Error registering vote' });
    }
});

// Update max dB for comedian
app.post('/api/maxdb', async (req, res) => {
    try {
        const { comedianId, maxDB } = req.body;

        if (!comedianId || maxDB === undefined) {
            return res.status(400).json({ error: 'Comedian ID and maxDB required' });
        }

        const data = await readDB();
        const comedian = data.comedians.find(c => c.id === comedianId);

        if (!comedian) {
            return res.status(404).json({ error: 'Comedian not found' });
        }

        // Only update if new max is higher
        if (maxDB > (data.maxDB[comedianId] || 0)) {
            data.maxDB[comedianId] = maxDB;
            await writeDB(data);
        }

        res.json({ success: true, maxDB: data.maxDB[comedianId] });
    } catch (error) {
        res.status(500).json({ error: 'Error updating maxDB' });
    }
});

// Get ranking
app.get('/api/ranking', async (req, res) => {
    try {
        const data = await readDB();
        const ranking = data.comedians.map(comedian => ({
            ...comedian,
            votos: data.votos[comedian.id] || 0,
            maxDB: data.maxDB[comedian.id] || 0,
            score: (data.votos[comedian.id] || 0) * 10 + (data.maxDB[comedian.id] || 0)
        }));

        ranking.sort((a, b) => b.score - a.score);
        res.json(ranking);
    } catch (error) {
        res.status(500).json({ error: 'Error getting ranking' });
    }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
    try {
        const data = await readDB();
        const totalVotos = Object.values(data.votos).reduce((sum, v) => sum + v, 0);
        const maxGlobal = Math.max(...Object.values(data.maxDB), 0);

        res.json({
            registrados: data.registrados.length,
            totalVotos,
            maxGlobal: Math.round(maxGlobal),
            comediantes: data.comedians.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Error getting statistics' });
    }
});

// Reset all data
app.post('/api/reset', async (req, res) => {
    try {
        const data = await readDB();

        // Keep comedians but reset everything else
        data.registrados = [];
        data.votes = {};

        // Reset votes and maxDB for all comedians
        data.comedians.forEach(c => {
            data.votos[c.id] = 0;
            data.maxDB[c.id] = 0;
        });

        await writeDB(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error resetting data' });
    }
});

// Export data
app.get('/api/export', async (req, res) => {
    try {
        const data = await readDB();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=comedy-battle-export.json');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error exporting data' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Initialize and start server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════╗
║   🎤 Comedy Battle Server Running 🎤  ║
╠════════════════════════════════════════╣
║   Port: ${PORT.toString().padEnd(30)}║
║   Public: http://localhost:${PORT.toString().padEnd(19)}║
║   Admin:  http://localhost:${PORT}/admin${' '.repeat(10)}║
║   API:    http://localhost:${PORT}/api${' '.repeat(12)}║
╚════════════════════════════════════════╝
        `);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
