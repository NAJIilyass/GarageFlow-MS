const ClientService = require("../services/clientService");

const clientService = new ClientService();

getAllClients = async (req, res) => {
    try {
        const response = await clientService.getAllClients();
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

getClientById = async (req, res) => {
    const { clientId } = req.params;

    try {
        const response = await clientService.getClientById(clientId);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);

        if (err.message.includes("Invalid"))
            res.status(400).json({ error: err.message });
        else if (err.message.includes("not found"))
            res.status(404).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

createClient = async (req, res) => {
    const { first_name, last_name, address, phone, email } = req.body;

    try {
        const response = await clientService.createClient(
            first_name,
            last_name,
            address,
            phone,
            email
        );
        res.status(201).json(response);
    } catch (err) {
        console.error(err);

        if (err.message.includes("required") || err.message.includes("format"))
            res.status(400).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

updateClient = async (req, res) => {
    const { clientId } = req.params;
    const { first_name, last_name, address, phone, email } = req.body;

    const updatedClient = {};
    if (first_name) updatedClient.first_name = first_name;
    if (last_name) updatedClient.last_name = last_name;
    if (address) updatedClient.address = address;
    if (phone) updatedClient.phone = phone;
    if (email) updatedClient.email = email;

    try {
        const response = await clientService.updateClient(
            clientId,
            updatedClient
        );
        res.status(200).json(response);
    } catch (err) {
        console.error(err);

        if (
            err.message.includes("Invalid") ||
            err.message.includes("Missing") ||
            err.message.includes("empty")
        )
            res.status(400).json({ error: err.message });
        else if (err.message.includes("not found"))
            res.status(404).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
};
