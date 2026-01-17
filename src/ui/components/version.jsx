// To support: system="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Theme } from "@swc-react/theme";
import { Button } from "@swc-react/button";
import React, { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import CommitPanel from "./CommitPanel";
import HistoryTimeline from "./HistoryTimeline";
import ErrorBanner from "./ErrorBanner";
import StorageService from "../services/storage";
import VersionService from "../services/versionService";
import ThumbnailService from "../services/thumbnailService";
import "./version.css";

const App = ({ addOnUISdk, sandboxProxy, onBack }) => {
    const [commits, setCommits] = useState([]);
    const [currentVersion, setCurrentVersion] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [error, setError] = useState(null);

    const storageService = new StorageService(addOnUISdk.instance.clientStorage);
    const versionService = new VersionService();
    const thumbnailService = new ThumbnailService(addOnUISdk);

    // Initialize: Load existing commits
    useEffect(() => {
        const initialize = async () => {
            try {
                console.log("[Version] Initializing version control...");
                
                // Load project name
                const docTitle = await addOnUISdk.app.document.title();
                setProjectName(docTitle || "Untitled Project");

                // Load existing commits
                console.log("[Version] Loading existing commits...");
                const existingCommits = await storageService.getCommits();
                console.log("[Version] Found commits:", existingCommits.length);
                console.log("[Version] Commits:", existingCommits.map(c => ({ id: c.versionId, message: c.commitMessage })));
                
                setCommits(existingCommits);

                // Load current version - use latest commit if available
                if (existingCommits.length > 0) {
                    // Always use the latest commit as current version
                    const latestVersion = existingCommits[0].versionId;
                    setCurrentVersion(latestVersion);
                    console.log("[Version] Current version set to:", latestVersion);
                    // Also update stored current version if it's different
                    const storedCurrent = await storageService.getCurrentVersion();
                    if (storedCurrent !== latestVersion) {
                        await storageService.setCurrentVersion(latestVersion);
                    }
                } else {
                    // No commits yet, check if there's a stored current version
                    const current = await storageService.getCurrentVersion();
                    if (current) {
                        setCurrentVersion(current);
                        console.log("[Version] No commits, but found stored version:", current);
                    } else {
                        console.log("[Version] No commits and no stored version");
                    }
                }

                // Check if there are changes (simplified - in production, compare current state with latest commit)
                setHasChanges(true);
            } catch (error) {
                console.error("Error initializing:", error);
            }
        };

        initialize();
    }, [addOnUISdk, storageService]);

    // Handle commit creation
    const handleCommit = useCallback(async (commitMessage) => {
        setIsLoading(true);
        setError(null);
        try {
            // Capture document structure from sandbox
            const snapshot = await sandboxProxy.captureSnapshot();
            
            // Generate thumbnail from UI context (returns null if fails)
            const thumbnailBlob = await thumbnailService.generateThumbnail();
            
            // Generate version ID
            const versionId = versionService.generateNextVersion(commits);
            
            // Get current user
            const userId = await addOnUISdk.app.currentUser.userId();
            const author = userId || "Unknown User";

            // Create commit object
            const commit = {
                versionId,
                author,
                commitMessage,
                timestamp: Date.now(),
                designSnapshot: snapshot.documentSnapshot,
                thumbnailPreview: thumbnailBlob
            };

            // Save commit
            console.log("[Version] Saving commit:", commit.versionId);
            await storageService.addCommit(commit);
            await storageService.setCurrentVersion(versionId);

            // Update state - reload commits from storage
            console.log("[Version] Reloading commits from storage...");
            const updatedCommits = await storageService.getCommits();
            console.log("[Version] Loaded commits:", updatedCommits.length);
            console.log("[Version] Commits:", updatedCommits.map(c => ({ id: c.versionId, message: c.commitMessage })));
            
            setCommits(updatedCommits);
            setCurrentVersion(versionId);
            // Keep hasChanges as true so user can commit again
            setHasChanges(true);
            
            console.log("[Version] State updated, commits count:", updatedCommits.length);
        } catch (error) {
            console.error("Error creating commit:", error);
            setError(error.message || "Failed to save version. Please try again.");
            
            // Show error dialog
            try {
                await addOnUISdk.app.showModalDialog({
                    variant: "error",
                    title: "Failed to Save Version",
                    description: error.message || "An error occurred while saving the version. Please check the console for details.",
                    buttonLabels: {
                        primary: "OK"
                    }
                });
            } catch (dialogError) {
                // If dialog fails, at least log it
                console.error("Could not show error dialog:", dialogError);
            }
        } finally {
            setIsLoading(false);
        }
    }, [commits, sandboxProxy, storageService, versionService, thumbnailService, addOnUISdk]);

    // Handle rollback
    const handleRollback = useCallback(async (commit) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('🔄 Starting rollback to version:', commit.versionId);
            console.log('📦 Full commit object:', commit);
            console.log('📦 Snapshot data:', commit.designSnapshot);
            
            // Verify snapshot has data
            if (!commit.designSnapshot) {
                throw new Error('Invalid snapshot: designSnapshot is missing');
            }
            
            if (!commit.designSnapshot.pages || commit.designSnapshot.pages.length === 0) {
                throw new Error('Invalid snapshot: No pages found in the commit');
            }
            
            // Check if snapshot has any children
            const hasChildren = commit.designSnapshot.pages.some(page => 
                page.artboards && page.artboards.some(artboard => 
                    artboard.children && artboard.children.length > 0
                )
            );
            
            if (!hasChildren) {
                console.warn('⚠️ Snapshot has no children to restore');
                console.warn('⚠️ This might be because the original commit was made with an empty document');
            } else {
                const totalChildren = commit.designSnapshot.pages.reduce((sum, page) => 
                    sum + (page.artboards?.reduce((artSum, artboard) => 
                        artSum + (artboard.children?.length || 0), 0) || 0), 0
                );
                console.log(`📊 Snapshot contains ${totalChildren} total nodes to restore`);
                
                // Log first artboard's children for debugging
                const firstPage = commit.designSnapshot.pages[0];
                if (firstPage.artboards && firstPage.artboards.length > 0) {
                    const firstArtboard = firstPage.artboards[0];
                    if (firstArtboard.children && firstArtboard.children.length > 0) {
                        console.log('📋 First artboard children types:', firstArtboard.children.map(c => c.type));
                    }
                }
            }
            
            // Restore from snapshot
            console.log("[Version] Calling restoreFromSnapshot...");
            console.log("[Version] sandboxProxy:", sandboxProxy);
            console.log("[Version] sandboxProxy keys:", sandboxProxy ? Object.keys(sandboxProxy) : "sandboxProxy is null");
            console.log("[Version] restoreFromSnapshot function:", typeof sandboxProxy?.restoreFromSnapshot);
            
            if (!sandboxProxy) {
                throw new Error('sandboxProxy is not available. The sandbox may not be properly initialized.');
            }
            
            if (typeof sandboxProxy.restoreFromSnapshot !== 'function') {
                console.error("[Version] Available methods on sandboxProxy:", Object.keys(sandboxProxy));
                throw new Error(`restoreFromSnapshot is not a function. Available methods: ${Object.keys(sandboxProxy).join(', ')}`);
            }
            
            console.log("[Version] Calling restoreFromSnapshot with:", commit.designSnapshot);
            
            try {
                const restoreResult = await sandboxProxy.restoreFromSnapshot(commit.designSnapshot);
                console.log("[Version] Restore result:", restoreResult);
            } catch (restoreError) {
                console.error("[Version] Error during restore:", restoreError);
                console.error("[Version] Error message:", restoreError.message);
                console.error("[Version] Error stack:", restoreError.stack);
                throw new Error(`Failed to restore snapshot: ${restoreError.message || restoreError.toString()}`);
            }
            
            // Wait a bit for the UI to update
            await new Promise(resolve => setTimeout(resolve, 500));

            // Create a new commit for the rollback
            const userId = await addOnUISdk.app.currentUser.userId();
            const author = userId || "Unknown User";
            const versionId = versionService.generateNextVersion(commits);

            // Capture current state after rollback (for the rollback commit)
            const snapshot = await sandboxProxy.captureSnapshot();
            
            // Generate thumbnail (allow to fail gracefully)
            let thumbnailBlob = null;
            try {
                thumbnailBlob = await thumbnailService.generateThumbnail();
            } catch (thumbnailError) {
                console.warn("Thumbnail generation failed during rollback, continuing without thumbnail:", thumbnailError);
                // Continue without thumbnail - the rollback commit will still be saved
            }

            const rollbackCommit = {
                versionId,
                author,
                commitMessage: `Reverted to ${commit.versionId}`,
                timestamp: Date.now(),
                designSnapshot: snapshot.documentSnapshot,
                thumbnailPreview: thumbnailBlob,
                revertedFrom: commit.versionId
            };

            // Save rollback commit
            await storageService.addCommit(rollbackCommit);
            await storageService.setCurrentVersion(versionId);

            // Update state
            const updatedCommits = await storageService.getCommits();
            setCommits(updatedCommits);
            setCurrentVersion(versionId);
            // Keep hasChanges as true so user can commit again
            setHasChanges(true);
        } catch (error) {
            console.error("Error rolling back:", error);
            setError(error.message || "Failed to rollback. Please try again.");
            
            // Show error dialog
            try {
                await addOnUISdk.app.showModalDialog({
                    variant: "error",
                    title: "Failed to Rollback",
                    description: error.message || "An error occurred while rolling back. Please check the console for details.",
                    buttonLabels: {
                        primary: "OK"
                    }
                });
            } catch (dialogError) {
                console.error("Could not show error dialog:", dialogError);
            }
        } finally {
            setIsLoading(false);
        }
    }, [commits, sandboxProxy, storageService, versionService, thumbnailService, addOnUISdk]);

    return (
        <Theme system="express" scale="medium" color="light">
            <div className="relative min-h-screen bg-classic">
                {onBack && (
                    <div className="absolute top-6 left-6 z-50 glass px-4 py-2.5 animate-fade-in-up">
                        <Button 
                            size="m" 
                            onClick={onBack}
                            className="bg-transparent border-none text-slate-700 font-medium hover:text-slate-900 transition-colors"
                        >
                            ← Back
                        </Button>
                    </div>
                )}
                <ErrorBanner 
                    error={error} 
                    onDismiss={() => setError(null)} 
                />
                <div className="max-w-3xl mx-auto pt-20 px-6 pb-8">
                    <div className="animate-fade-in-up">
                        <Header 
                            projectName={projectName} 
                            currentVersion={commits.length > 0 ? (currentVersion || commits[0]?.versionId) : null} 
                        />
                        <CommitPanel
                            onCommit={handleCommit}
                            isDisabled={!hasChanges}
                            isLoading={isLoading}
                        />
                        <HistoryTimeline
                            commits={commits}
                            currentVersion={currentVersion}
                            onRollback={handleRollback}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </Theme>
    );
};

export default App;
