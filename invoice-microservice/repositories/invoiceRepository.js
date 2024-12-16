const Invoice = require("../Models/invoiceModel");

class InvoiceRepository {
    getInvoiceById = async (invoiceId) => {
        try {
            const response = await Invoice.findById(invoiceId);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    createInvoice = async (newInvoice) => {
        try {
            const response = await Invoice.create(newInvoice);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    getNumberOfInvoices = async () => {
        try {
            const count = await Invoice.countDocuments();
            return count;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };
}

module.exports = InvoiceRepository;
