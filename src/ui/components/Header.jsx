import React from "react";
import "./Header.css";

const Header = ({ projectName, currentVersion }) => {
    return (
        <div className="version-control-header">
            <div className="header-content">
                <h2 className="project-name">{projectName || "Untitled Project"}</h2>
                {currentVersion && (
                    <div className="version-badge">
                        <span className="version-label">Current:</span>
                        <span className="version-value">{currentVersion}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
