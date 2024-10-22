import { BrowserRouter, Route, Routes } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import NavigationDrawer from "./components/NavigationDrawer";
import { navigationConfig } from "./config/navigation";

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
    </BrowserRouter>
  );
}

export default App;
