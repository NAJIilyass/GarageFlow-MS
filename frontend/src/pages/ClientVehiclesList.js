import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ClientService from "../services/ClientService";
import VehicleService from "../services/VehicleService";

import AddNew from "../components/AddNew";
import NoElementFound from "../components/NoElementFound";
import VehicleDetails from "../components/VehicleDetails";

const ClientVehiclesList = () => {
    const clientService = new ClientService();
    const vehicleService = new VehicleService();

    const { id: client_id } = useParams();

    const [vehicles, setVehicles] = useState(null);
    const [client, setClient] = useState(null);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const data = await clientService.getClientById(client_id);
                setClient(data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchVehicles = async () => {
            try {
                const data = await vehicleService.getVehiclesByOwnerId(
                    client_id
                );
                setVehicles(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchClient();
        fetchVehicles();
    }, [client_id]);

    return (
        <div>
            <div className="mb-8 text-center flex flex-col gap-5">
                {client && (
                    <p className="text-3xl font-semibold">
                        {client.first_name} {client.last_name} Vehicles
                    </p>
                )}
            </div>

            {!vehicles && (
                <div className="my-16">
                    <NoElementFound target={"vehicle"} />
                </div>
            )}
            {vehicles &&
                vehicles.map((vehicle) => (
                    <div key={vehicle._id}>
                        <VehicleDetails vehicle={vehicle} />
                    </div>
                ))}

            <div className="my-8">
                <AddNew target={"vehicle"} clientId={client_id} />
            </div>
        </div>
    );
};

export default ClientVehiclesList;
