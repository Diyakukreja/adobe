class VersionService {
    generateNextVersion(commits) {
        if (!commits || commits.length === 0) {
            return "v1.0.0";
        }

        // Get the latest version
        const latestCommit = commits[0];
        const latestVersion = latestCommit.versionId;

        // Extract version number (e.g., "v1.0.0" -> [1, 0, 0])
        const versionMatch = latestVersion.match(/v(\d+)\.(\d+)\.(\d+)/);
        if (!versionMatch) {
            // If version format is unexpected, start from v1.0.0
            return "v1.0.0";
        }

        const major = parseInt(versionMatch[1], 10);
        const minor = parseInt(versionMatch[2], 10);
        const patch = parseInt(versionMatch[3], 10);

        // Increment patch version
        return `v${major}.${minor}.${patch + 1}`;
    }
}

export default VersionService;
