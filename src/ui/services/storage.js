class StorageService {
    constructor(clientStorage) {
        this.storage = clientStorage;
        this.memoryStorage = {}; // Fallback in-memory storage
        this.COMMITS_KEY = "version_commits";
        this.CURRENT_VERSION_KEY = "current_version";
    }

    async getCommits() {
        try {
            let commitsJson = null;
            
            // Try multiple storage methods
            if (this.storage) {
                // Try get method
                if (typeof this.storage.get === 'function') {
                    commitsJson = await this.storage.get(this.COMMITS_KEY);
                }
                // Try getItem method (localStorage-like)
                else if (typeof this.storage.getItem === 'function') {
                    commitsJson = await this.storage.getItem(this.COMMITS_KEY);
                }
                // Try direct property access
                else if (this.storage[this.COMMITS_KEY]) {
                    commitsJson = this.storage[this.COMMITS_KEY];
                }
            }
            
            // Fallback to in-memory storage
            if (!commitsJson) {
                commitsJson = this.memoryStorage[this.COMMITS_KEY] || null;
            }
            
            if (!commitsJson) {
                console.log("[Storage] No commits found, returning empty array");
                return [];
            }
            
            // Handle both string and already-parsed JSON
            const commits = typeof commitsJson === 'string' ? JSON.parse(commitsJson) : commitsJson;
            // Ensure it's an array
            if (!Array.isArray(commits)) {
                console.warn("[Storage] Commits is not an array:", commits);
                return [];
            }
            
            console.log(`[Storage] Retrieved ${commits.length} commits`);
            // Sort by timestamp descending (newest first)
            return commits.sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error("Error getting commits:", error);
            // Try memory storage as fallback
            try {
                const memData = this.memoryStorage[this.COMMITS_KEY];
                if (memData) {
                    const commits = typeof memData === 'string' ? JSON.parse(memData) : memData;
                    return Array.isArray(commits) ? commits.sort((a, b) => b.timestamp - a.timestamp) : [];
                }
            } catch (e) {
                console.error("[Storage] Error reading from memory storage:", e);
            }
            return [];
        }
    }

    async addCommit(commit) {
        try {
            console.log("[Storage] Adding commit:", commit.versionId);
            const commits = await this.getCommits();
            console.log(`[Storage] Current commits count: ${commits.length}`);
            
            commits.unshift(commit); // Add to beginning
            const commitsJson = JSON.stringify(commits);
            console.log(`[Storage] New commits count: ${commits.length}`);
            
            // Try multiple storage methods
            let saved = false;
            if (this.storage) {
                // Try set method
                if (typeof this.storage.set === 'function') {
                    await this.storage.set(this.COMMITS_KEY, commitsJson);
                    saved = true;
                    console.log("[Storage] Saved using .set() method");
                }
                // Try setItem method (localStorage-like)
                else if (typeof this.storage.setItem === 'function') {
                    await this.storage.setItem(this.COMMITS_KEY, commitsJson);
                    saved = true;
                    console.log("[Storage] Saved using .setItem() method");
                }
            }
            
            // Always save to memory storage as well (for reliability)
            this.memoryStorage[this.COMMITS_KEY] = commitsJson;
            console.log("[Storage] Saved to memory storage");
            
            if (!saved) {
                console.warn("[Storage] Could not save to clientStorage, using memory storage only");
            }
            
            return commit;
        } catch (error) {
            console.error("Error adding commit:", error);
            // Still save to memory as fallback
            try {
                const commits = await this.getCommits();
                commits.unshift(commit);
                this.memoryStorage[this.COMMITS_KEY] = JSON.stringify(commits);
                console.log("[Storage] Saved to memory storage as fallback");
            } catch (e) {
                console.error("Error saving to memory storage:", e);
            }
            throw error;
        }
    }

    async getCurrentVersion() {
        try {
            let version = null;
            
            // Try to use clientStorage if it has get method
            if (this.storage && typeof this.storage.get === 'function') {
                version = await this.storage.get(this.CURRENT_VERSION_KEY);
            } else {
                // Fallback to in-memory storage
                version = this.memoryStorage[this.CURRENT_VERSION_KEY] || null;
            }
            
            return version || null;
        } catch (error) {
            console.error("Error getting current version:", error);
            // Return memory storage as fallback
            return this.memoryStorage[this.CURRENT_VERSION_KEY] || null;
        }
    }

    async setCurrentVersion(versionId) {
        try {
            // Try to use clientStorage if it has set method
            if (this.storage && typeof this.storage.set === 'function') {
                await this.storage.set(this.CURRENT_VERSION_KEY, versionId);
            } else {
                // Fallback to in-memory storage
                this.memoryStorage[this.CURRENT_VERSION_KEY] = versionId;
            }
        } catch (error) {
            console.error("Error setting current version:", error);
            // Still save to memory as fallback
            this.memoryStorage[this.CURRENT_VERSION_KEY] = versionId;
            throw error;
        }
    }
}

export default StorageService;
