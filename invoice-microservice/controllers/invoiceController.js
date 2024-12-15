const InvoiceService = require("../services/invoiceService");

const invoiceService = new InvoiceService();

getInvoiceById = async (req, res) => {
    const { invoiceId } = req.params;

    try {
        const response = await invoiceService.getInvoiceById(invoiceId);
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

createInvoice = async (req, res) => {
    const { clientId, vehicleId, amount, description } = req.body;

    try {
        const response = await invoiceService.createInvoice(
            clientId,
            vehicleId,
            amount,
            description
        );
        res.status(201).json(response);
    } catch (err) {
        console.error(err);

        if (err.message.includes("required") || err.message.includes("Invalid"))
            res.status(400).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getInvoiceById,
    createInvoice,
};
