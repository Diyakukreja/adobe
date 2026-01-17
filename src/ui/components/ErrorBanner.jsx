import React from "react";
import "./ErrorBanner.css";

const ErrorBanner = ({ error, onDismiss }) => {
    if (!error) return null;

    return (
        <div className="error-banner">
            <div className="error-content">
                <span className="error-icon">⚠️</span>
                <span className="error-message">{error}</span>
            </div>
            <button className="error-dismiss" onClick={onDismiss} aria-label="Dismiss error">
                ×
            </button>
        </div>
    );
};

export default ErrorBanner;
