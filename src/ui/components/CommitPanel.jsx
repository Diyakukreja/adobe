import React, { useState } from "react";
import { Button } from "@swc-react/button";
import "./CommitPanel.css";

const CommitPanel = ({ onCommit, isDisabled, isLoading }) => {
    const [commitMessage, setCommitMessage] = useState("");

    const handleCommit = () => {
        if (commitMessage.trim() && !isDisabled && !isLoading) {
            onCommit(commitMessage.trim());
            setCommitMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            handleCommit();
        }
    };

    return (
        <div className="commit-panel">
            <div className="commit-panel-header">
                <h3 className="panel-title">Save Version</h3>
            </div>
            <div className="commit-panel-content">
                <textarea
                    className="commit-message-input"
                    placeholder="Describe what changed in this version..."
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isDisabled || isLoading}
                    rows={3}
                />
                <div className="commit-panel-footer">
                    <div className="commit-hint">
                        Press Cmd/Ctrl + Enter to save
                    </div>
                    <Button
                        size="m"
                        variant="accent"
                        onClick={handleCommit}
                        disabled={!commitMessage.trim() || isDisabled || isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Version"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CommitPanel;
