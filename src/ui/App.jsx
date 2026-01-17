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
                <div className="relative w-full min-h-screen bg-classic">
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-50 flex gap-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-classic-lg border border-slate-200">
                        <Button 
                            size="m" 
                            onClick={() => setCurrentView("publish")}
                            className="px-4 py-2 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors shadow-md"
                        >
                            Publish
                        </Button>
                        <Button 
                            size="m" 
                            onClick={() => setCurrentView("version")}
                            className="px-4 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors shadow-md"
                        >
                            Version
                        </Button>
                    </div>
                    <div className="pt-20">
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

