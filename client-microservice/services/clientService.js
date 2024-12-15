const mongoose = require("mongoose");
const ClientRepository = require("../repositories/clientRepository");

class ClientService {
    constructor() {
        this.clientRepository = new ClientRepository();
    }

    getAllClients = async () => {
        return await this.clientRepository.getAllClients();
    };

    getClientById = async (clientId) => {
        if (!mongoose.Types.ObjectId.isValid(clientId))
            throw new Error("Invalid Object ID");

        const client = await this.clientRepository.getClientById(clientId);

        if (!client) throw new Error("Client not found");

        return client;
    };

    createClient = async (first_name, last_name, address, phone, email) => {
        if (!first_name || !last_name || !address || !phone || !email)
            throw new Error(
                "first_name, last_name, address, phone and email are all required"
            );

        const phoneRegex =
            /^(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{1,4}\)?[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error("Invalid phone number format");
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }

        return await this.clientRepository.createClient({
            first_name,
            last_name,
            address,
            phone,
            email,
        });
    };

    updateClient = async (clientId, updatedClient) => {
        if (!mongoose.Types.ObjectId.isValid(clientId))
            throw new Error("Invalid Object ID");

        if (!updatedClient) throw new Error("Missing updated Object Data");

        if (
            updatedClient.email &&
            !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                updatedClient.email
            )
        ) {
            throw new Error("Invalid email format");
        }

        if (
            updatedClient.phone &&
            !/^(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{1,4}\)?[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/.test(
                updatedClient.phone
            )
        ) {
            throw new Error("Invalid phone number format");
        }

        Object.keys(updatedClient).forEach((key) => {
            if (updatedClient[key] === "") {
                throw new Error(`${key} cannot be empty`);
            }
        });

        if (updatedClient.createdAt) {
            delete updatedClient.createdAt;
        }

        const updatedResult = await this.clientRepository.updateClient(
            clientId,
            updatedClient
        );

        if (!updatedResult) throw new Error("Client not found");

        return updatedResult;
    };
}

module.exports = ClientService;
