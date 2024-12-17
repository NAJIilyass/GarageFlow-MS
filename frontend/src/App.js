import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import MaintenanceTaskCreate from "./pages/MaintenanceTaskCreate";
import ClientsList from "./pages/ClientsList";
import ClientCreate from "./pages/ClientCreate";
import ClientVehiclesList from "./pages/ClientVehiclesList";
import ClientVehicleCreate from "./pages/ClientVehicleCreate";

function App() {
    return (
        <div>
            <Router>
                <Navbar />
                <div className="font-mono">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/maintenance-tasks/create"
                            element={<MaintenanceTaskCreate />}
                        />
                        <Route path="/clients" element={<ClientsList />} />
                        <Route
                            path="/clients/create"
                            element={<ClientCreate />}
                        />
                        <Route
                            path="/clients/:id/vehicles"
                            element={<ClientVehiclesList />}
                        />
                        <Route
                            path="/clients/:id/vehicles/create"
                            element={<ClientVehicleCreate />}
                        />
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
