const fs = require('fs').promises;
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'database.json');

async function initDB() {
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

    try {
        await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
        console.log('✅ Database initialized successfully at:', DB_FILE);
        console.log('📊 Initial data:', JSON.stringify(initialData, null, 2));
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
}

initDB();
