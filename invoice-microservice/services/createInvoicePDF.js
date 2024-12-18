const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

// Main method
createInvoicePDF = (invoice) => {
    let doc = new PDFDocument({ size: "A4", margin: 50 });
    const filePath = path.join(
        __dirname,
        `${invoice.client_first_name}_${invoice.client_last_name}_invoice.pdf`
    );

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(filePath));
    return filePath;
};

// Helpers
generateHeader = (doc) => {
    doc.image("./assets/logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text("The Garage Team", 110, 57)
        .fontSize(10)
        .text("The Garage Team", 200, 50, { align: "right" })
        .text("123 Main Street", 200, 65, { align: "right" })
        .text("Al Irfane, Rabat, 10112", 200, 80, { align: "right" })
        .moveDown();
};

generateCustomerInformation = (doc, invoice) => {
    doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc.fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_number, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(formatCurrency(invoice.amount), 150, customerInformationTop + 30)

        .font("Helvetica-Bold")
        .text(
            `${invoice.client_first_name} ${invoice.client_last_name}`,
            300,
            customerInformationTop
        )
        .font("Helvetica")
        .text(invoice.clientPhone, 300, customerInformationTop + 15)
        .text(invoice.clientAddress, 300, customerInformationTop + 30)
        .moveDown();

    generateHr(doc, 252);
};

generateInvoiceTable = (doc, invoice) => {
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Make",
        "Model",
        "Unit Cost",
        "Quantity",
        "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    generateTableRow(
        doc,
        invoiceTableTop + 30,
        invoice.vehicleBrand,
        invoice.vehicleModel,
        formatCurrency(invoice.amount),
        1,
        formatCurrency(invoice.amount)
    );

    generateHr(doc, invoiceTableTop + 50);

    const subtotalPosition = invoiceTableTop + 60;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        formatCurrency(invoice.amount)
    );

    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "",
        "Paid To Date",
        "",
        formatCurrency(0)
    );

    const duePosition = paidToDatePosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
        "",
        "Balance Due",
        "",
        formatCurrency(invoice.amount)
    );
    doc.font("Helvetica");
};

generateFooter = (doc) => {
    doc.fontSize(10).text(
        "Payment is due within 15 days. Thank you for your business.",
        50,
        780,
        { align: "center", width: 500 }
    );
};

generateTableRow = (
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
) => {
    doc.fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
};

generateHr = (doc, y) => {
    doc.strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
};

formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formattedValue = formatter.format(value);
    return `${formattedValue.replace(/,/g, " ")} MAD`;
};

formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
};

module.exports = { createInvoicePDF };
