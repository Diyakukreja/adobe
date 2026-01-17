import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import { Theme } from "@swc-react/theme";
import { Button } from "@swc-react/button";
import React, { useState } from "react";
import FlowchartGenerator from "./components/FlowchartGenerator";
import VersionPage from "./components/version";
import CanvasPublish from "./components/CanvasPublish";

function App({ addOnUISdk, sandboxProxy }) {
    const [currentView, setCurrentView] = useState("main");

    return (
        <Theme system="express" scale="medium" color="light">
            {currentView === "main" ? (
                <div className="relative w-full min-h-screen bg-classic">
                    {/* Professional navigation bar */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 flex gap-3 glass px-5 py-2.5 animate-fade-in-up">
                        <Button 
                            size="m" 
                            onClick={() => setCurrentView("publish")}
                            className="px-5 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                        >
                            Publish
                        </Button>
                        <Button 
                            size="m" 
                            onClick={() => setCurrentView("version")}
                            className="px-5 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2"
                        >
                            Version
                        </Button>
                    </div>
                    
                    <div className="pt-24 relative z-10">
                        <FlowchartGenerator 
                            addOnUISdk={addOnUISdk} 
                            sandboxProxy={sandboxProxy} 
                        />
                    </div>
                </div>
            ) : currentView === "version" ? (
                <VersionPage 
                    addOnUISdk={addOnUISdk} 
                    sandboxProxy={sandboxProxy}
                    onBack={() => setCurrentView("main")}
                />
            ) : (
                <CanvasPublish 
                    addOnUISdk={addOnUISdk} 
                    sandboxProxy={sandboxProxy}
                    onBack={() => setCurrentView("main")}
                />
            )}
        </Theme>
    );
}

export default App;
