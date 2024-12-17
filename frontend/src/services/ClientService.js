import axios from "axios";

class ClientService {
    constructor() {
        this.gatewayURL = "http://localhost:4000";
        this.baseURL = `${this.gatewayURL}/clients`;
    }

    getAllClients = async () => {
        try {
            const response = await axios.get(this.baseURL);
            return response.data;
        } catch (err) {
            console.error("Error fetching clients:", err);
            throw err;
        }
    };

    getClientById = async (clientId) => {
        try {
            const response = await axios.get(`${this.baseURL}/${clientId}`);
            return response.data;
        } catch (err) {
            console.error(`Error fetching client of ID ${clientId}:`, err);
            throw err;
        }
    };

    createClient = async (createdClient) => {
        try {
            const response = await axios.post(this.baseURL, createdClient);
            return response.data;
        } catch (err) {
            console.error("Error creating client:", err);
            throw err;
        }
    };

    updateClient = async (clientId, updatedClient) => {
        try {
            const response = await axios.patch(
                `${this.baseURL}/${clientId}`,
                updatedClient
            );
            return response.data;
        } catch (err) {
            console.error("Error updating client:", err);
            throw err;
        }
    };
}

export default ClientService;
