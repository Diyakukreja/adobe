import React from "react";
import { Button } from "@swc-react/button";
import "./RollbackModal.css";

const RollbackModal = ({ commit, onConfirm, onCancel }) => {
    let thumbnailUrl = null;
    try {
        thumbnailUrl = commit.thumbnailPreview 
            ? URL.createObjectURL(commit.thumbnailPreview)
            : null;
    } catch (error) {
        console.warn("Could not create thumbnail URL for modal:", error);
    }

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    };

    return (
        <div className="rollback-modal-overlay" onClick={onCancel}>
            <div className="rollback-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Rollback to {commit.versionId}?</h3>
                </div>
                <div className="modal-content">
                    {thumbnailUrl ? (
                        <div className="modal-preview">
                            <img src={thumbnailUrl} alt={`Version ${commit.versionId}`} />
                        </div>
                    ) : (
                        <div className="modal-preview placeholder">
                            <div className="placeholder-icon">📄</div>
                            <p className="placeholder-text">Preview not available</p>
                        </div>
                    )}
                    <div className="modal-info">
                        <div className="info-row">
                            <span className="info-label">Version:</span>
                            <span className="info-value">{commit.versionId}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Message:</span>
                            <span className="info-value">{commit.commitMessage}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Author:</span>
                            <span className="info-value">{commit.author}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Date:</span>
                            <span className="info-value">{formatTimestamp(commit.timestamp)}</span>
                        </div>
                    </div>
                    <div className="modal-warning">
                        <div className="warning-icon">⚠️</div>
                        <p className="warning-text">
                            This will create a new commit restoring your design to this version. 
                            Your current work will be preserved in the history.
                        </p>
                    </div>
                </div>
                <div className="modal-footer">
                    <Button
                        size="m"
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="m"
                        variant="accent"
                        onClick={onConfirm}
                    >
                        Rollback
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RollbackModal;
