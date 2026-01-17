// // To support: system="express" scale="medium" color="light"
// // import these spectrum web components modules:
// import "@spectrum-web-components/theme/express/scale-medium.js";
// import "@spectrum-web-components/theme/express/theme-light.js";

// // To learn more about using "swc-react" visit:
// // https://opensource.adobe.com/spectrum-web-components/using-swc-react/
// import { Button } from "@swc-react/button";
// import { Theme } from "@swc-react/theme";
// import React from "react";
// import "./App.css";

// const App = ({ addOnUISdk, sandboxProxy }) => {
//     function handleClick() {
//         sandboxProxy.createRectangle();
//     }

//     return (
//         // Please note that the below "<Theme>" component does not react to theme changes in Express.
//         // You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
//         <Theme system="express" scale="medium" color="light">
//             <div className="container">
//                 <Button size="m" onClick={handleClick}>
//                     Create Rectangle
//                 </Button>
//             </div>
//         </Theme>
//     );
// };

// export default App;

// Import Spectrum components
// Import Spectrum components


// import "@spectrum-web-components/theme/express/scale-medium.js";
// import "@spectrum-web-components/theme/express/theme-light.js";
// import { Theme } from "@swc-react/theme";
// import React from "react";
// import FlowchartGenerator from "./components/FlowchartGenerator";

// const App = ({ addOnUISdk, sandboxProxy }) => {
//     return (
//         <Theme system="express" scale="medium" color="light">
//             <div style={{ padding: "0" }}>
//                 <FlowchartGenerator 
//                     addOnUISdk={addOnUISdk} 
//                     sandboxProxy={sandboxProxy} 
//                 />
//             </div>
//         </Theme>
//     );
// };

// export default App;


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
                <div style={{ 
                    position: "relative", 
                    width: "100%", 
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                }}>
                    <div
                        style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            zIndex: 1000,
                            display: "flex",
                            gap: "12px",
                            background: "rgba(255, 255, 255, 0.95)",
                            padding: "8px 16px",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                        }}
                    >
                        <Button 
                            size="m" 
                            onClick={() => setCurrentView("publish")}
                            style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600"
                            }}
                        >
                            Publish
                        </Button>
                        <Button 
                            size="m" 
                            onClick={() => setCurrentView("version")}
                            style={{
                                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600"
                            }}
                        >
                            Version
                        </Button>
                    </div>
                    <div style={{ paddingTop: "60px" }}>
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

export default App;  // ✅ Make sure this line exists!

