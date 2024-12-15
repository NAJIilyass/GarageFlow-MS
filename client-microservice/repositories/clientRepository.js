const Client = require("../Models/clientModel");

class ClientRepository {
    getAllClients = async () => {
        try {
            const response = await Client.find({}).sort({ createdAt: -1 });
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    getClientById = async (clientId) => {
        try {
            const response = await Client.findById(clientId);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    createClient = async (createdClient) => {
        try {
            const response = await Client.create(createdClient);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    updateClient = async (clientId, updatedClient) => {
        try {
            const response = await Client.findByIdAndUpdate(
                clientId,
                updatedClient,
                {
                    new: true,
                }
            );
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
}

module.exports = ClientRepository;
