import { useState, useEffect } from "react";

import ClientService from "../services/ClientService";

import AddNew from "../components/AddNew";
import NoElementFound from "../components/NoElementFound";
import ClientDetails from "../components/ClientDetails";

const ClientsList = () => {
    const clientService = new ClientService();
    const [clients, setClients] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await clientService.getAllClients();
                setClients(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchClients();
    }, []);

    return (
        <div>
            <div className="mb-8 text-center flex flex-col gap-5">
                <p className="text-3xl font-semibold">Clients List</p>
            </div>

            {!clients && (
                <div className="my-16">
                    <NoElementFound target={"client"} />
                </div>
            )}
            {clients &&
                clients.map((client) => (
                    <div key={client._id}>
                        <ClientDetails client={client} />
                    </div>
                ))}

            <div className="my-8">
                <AddNew target={"client"} />
            </div>
        </div>
    );
};

export default ClientsList;
