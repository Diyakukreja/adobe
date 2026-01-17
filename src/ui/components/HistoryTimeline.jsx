import React, { useState } from "react";
import "./HistoryTimeline.css";
import RollbackModal from "./RollbackModal";

const HistoryTimeline = ({ commits, currentVersion, onRollback, isLoading }) => {
    const [selectedCommit, setSelectedCommit] = useState(null);
    const [showRollbackModal, setShowRollbackModal] = useState(false);

    const handleRollbackClick = (commit) => {
        setSelectedCommit(commit);
        setShowRollbackModal(true);
    };

    const handleRollbackConfirm = () => {
        if (selectedCommit) {
            onRollback(selectedCommit);
            setShowRollbackModal(false);
            setSelectedCommit(null);
        }
    };

    const handleRollbackCancel = () => {
        setShowRollbackModal(false);
        setSelectedCommit(null);
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
        });
    };

    if (commits.length === 0) {
        return (
            <div className="history-timeline empty">
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <p className="empty-title">No versions yet</p>
                    <p className="empty-description">
                        Save your first version to start tracking changes
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="history-timeline">
                <div className="timeline-header">
                    <h3 className="panel-title">Version History</h3>
                    <span className="commit-count">{commits.length} version{commits.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="timeline-content">
                    {commits.map((commit, index) => {
                        const isCurrent = commit.versionId === currentVersion;
                        let thumbnailUrl = null;
                        try {
                            thumbnailUrl = commit.thumbnailPreview 
                                ? URL.createObjectURL(commit.thumbnailPreview)
                                : null;
                        } catch (error) {
                            console.warn("Could not create thumbnail URL:", error);
                        }

                        return (
                            <div
                                key={commit.versionId}
                                className={`timeline-item ${isCurrent ? 'current' : ''}`}
                            >
                                <div className="timeline-connector">
                                    {index < commits.length - 1 && <div className="connector-line" />}
                                </div>
                                <div className="timeline-card">
                                    {thumbnailUrl ? (
                                        <div className="commit-thumbnail">
                                            <img src={thumbnailUrl} alt={`Version ${commit.versionId}`} />
                                        </div>
                                    ) : (
                                        <div className="commit-thumbnail placeholder">
                                            <div className="placeholder-icon">📄</div>
                                        </div>
                                    )}
                                    <div className="commit-content">
                                        <div className="commit-header">
                                            <span className="commit-version">{commit.versionId}</span>
                                            {isCurrent && (
                                                <span className="current-badge">Current</span>
                                            )}
                                        </div>
                                        <p className="commit-message">{commit.commitMessage}</p>
                                        <div className="commit-meta">
                                            <span className="commit-author">{commit.author}</span>
                                            <span className="commit-separator">•</span>
                                            <span className="commit-time">{formatTimestamp(commit.timestamp)}</span>
                                        </div>
                                    </div>
                                    {!isCurrent && (
                                        <div className="commit-actions">
                                            <button
                                                className="rollback-button"
                                                onClick={() => handleRollbackClick(commit)}
                                                disabled={isLoading}
                                                title="Rollback to this version"
                                            >
                                                Rollback
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {showRollbackModal && selectedCommit && (
                <RollbackModal
                    commit={selectedCommit}
                    onConfirm={handleRollbackConfirm}
                    onCancel={handleRollbackCancel}
                />
            )}
        </>
    );
};

export default HistoryTimeline;
