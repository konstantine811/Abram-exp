import { BrowserRouter, Route, Routes } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import NavigationDrawer from "./components/NavigationDrawer";
import { navigationConfig } from "./config/navigation";
import { Chip } from "@nextui-org/chip";

function App() {
  return (
    <BrowserRouter>
      <NavigationDrawer />
      <Routes>
        {navigationConfig.map((config) => (
          <Route
            key={config.path}
            path={config.path}
            element={config.element}
          />
        ))}
      </Routes>
      <div className="fixed bottom-4 right-3 z-50">
        <Chip>Created by Abramkin Constantine</Chip>
      </div>
    </BrowserRouter>
  );
}

export default App;
