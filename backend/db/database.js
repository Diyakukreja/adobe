import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_DIR = join(__dirname, 'data');
const DB_FILE = join(DB_DIR, 'canvas.json');

// Ensure data directory exists
if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true });
}

// Initialize database structure
const initDB = () => ({
    canvas: {},
    milestones: {},
    tracking: {}
});

// Load database
function loadDB() {
    try {
        if (existsSync(DB_FILE)) {
            const data = readFileSync(DB_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading database:', error);
    }
    return initDB();
}

// Save database
function saveDB(data) {
    try {
        writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

// Database operations
const db = {
    // Canvas operations
    createCanvas(id, title, content, structure) {
        const data = loadDB();
        data.canvas[id] = {
            id,
            title,
            content: JSON.stringify(content),
            structure: JSON.stringify(structure),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        saveDB(data);
        return data.canvas[id];
    },

    getCanvas(id) {
        const data = loadDB();
        return data.canvas[id] || null;
    },

    // Milestone operations
    createMilestone(canvasId, name, reason, content, structure) {
        const data = loadDB();
        const id = Date.now().toString();
        if (!data.milestones[canvasId]) {
            data.milestones[canvasId] = [];
        }
        const milestone = {
            id,
            canvas_id: canvasId,
            name,
            reason,
            content: JSON.stringify(content),
            structure: JSON.stringify(structure),
            created_at: new Date().toISOString()
        };
        data.milestones[canvasId].push(milestone);
        saveDB(data);
        return milestone;
    },

    getMilestones(canvasId) {
        const data = loadDB();
        return data.milestones[canvasId] || [];
    },

    // Tracking operations
    initTracking(canvasId, sections) {
        const data = loadDB();
        if (!data.tracking[canvasId]) {
            data.tracking[canvasId] = {};
        }
        
        // Calculate how many sections should be marked as viewed (70-80% range)
        const totalSections = sections.length;
        const minViewed = Math.floor(totalSections * 0.70);
        const maxViewed = Math.floor(totalSections * 0.80);
        const viewedCount = Math.floor(Math.random() * (maxViewed - minViewed + 1)) + minViewed;
        
        // Shuffle sections and mark first N as viewed
        const shuffledSections = [...sections].sort(() => Math.random() - 0.5);
        
        sections.forEach((section) => {
            if (!data.tracking[canvasId][section.id]) {
                const isViewed = shuffledSections.indexOf(section) < viewedCount;
                data.tracking[canvasId][section.id] = {
                    section_id: section.id,
                    viewed: isViewed,
                    view_count: isViewed ? Math.floor(Math.random() * 3) + 1 : 0,
                    time_spent: isViewed ? Math.floor(Math.random() * 30) + 5 : 0,
                    last_viewed: isViewed ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null
                };
            }
        });
        saveDB(data);
    },

    trackView(canvasId, sectionId, timeSpent = 0) {
        const data = loadDB();
        if (!data.tracking[canvasId]) {
            data.tracking[canvasId] = {};
        }
        if (!data.tracking[canvasId][sectionId]) {
            data.tracking[canvasId][sectionId] = {
                section_id: sectionId,
                viewed: false,
                view_count: 0,
                time_spent: 0,
                last_viewed: null
            };
        }
        const track = data.tracking[canvasId][sectionId];
        track.viewed = true;
        track.view_count += 1;
        track.time_spent += timeSpent;
        track.last_viewed = new Date().toISOString();
        saveDB(data);
    },

    getTracking(canvasId) {
        const data = loadDB();
        return data.tracking[canvasId] || {};
    }
};

console.log('✅ Database initialized successfully');

export default db;
