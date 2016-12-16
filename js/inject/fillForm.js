/*jshint esversion: 6 */

const fileinput = document.getElementById("ctl00_ContentPlaceHolder1_FileUpload1");
const TOP = 1, BOTH = 2, BOTTOM = 3, NONE = 4;
const MAIL = 0, EMAIL = 1, FAX = 2;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        fillForms (request.data);
        sendResponse ({farewell: "Done!"});
    }
);

function fillForms (data) {

    const part_number = document.getElementById ("txtPart1");
    const rev_number = document.getElementById ("txtRevision1");
    const x_dim = document.getElementById ("txtXDim1");
    const y_dim = document.getElementById ("txtYDim1");
    const quantity = document.getElementById("txtQuantity1");

    const multiple = document.getElementById ("chkMultipartOrder");

    const billing_city = document.getElementById ("txtBillingCity");
    const billing_company = document.getElementById ("txtBillingCompany");
    const billing_address1 = document.getElementById ("txtBillingAddress1");
    const billing_address2 = document.getElementById ("txtBillingAddress2");
    const billing_zip = document.getElementById ("txtBillingZipCode");

    const first_name = document.getElementById ("txtShippingFirstName");
    const last_name = document.getElementById ("txtShippingLastname");

    const credit_card_name = document.getElementById ("txtCreditCardName");

    const shipping_account = document.getElementById ("txtShippingAccount");
    const shipping_city = document.getElementById ("txtShippingCity");
    const shipping_company = document.getElementById ("txtShippingCompany");
    const shipping_address1 = document.getElementById ("txtShippingAddress1");
    const shipping_address2 = document.getElementById ("txtShippingAddress2");
    const shipping_zip = document.getElementById ("txtShippingZipCode");
    const shipping_phone = document.getElementById ("txtShippingPhoneNumber");

    const cc_number = document.getElementById ("txtCreditCardNumber");
    const po_number = document.getElementById ("txtCreditCartPO");
    const exp = document.getElementById ("txtCreditCardExpiration");

    const itar_yes = document.getElementById ("radITARYes");
    const itar_no = document.getElementById ("radITARNo");

    const comments  = document.getElementById ("txtComments");

    let billingStateElement = "#drpBillingState > option[value='"+data.billing_info.state+"']";
    const billing_state = document.querySelector(billingStateElement);

    let shippingStateElement = "#drpShippingState > option[value='"+data.shipping_info.state+"']";
    const shipping_state = document.querySelector (shippingStateElement);

    if (data.shipping_method === "Fedx Standard")
        data.shipping_method = "FedX Standard";

    let shippingMethodElement = "#dropShippingMethod > option[value='"+data.shipping_method+"']";
    const shipping_method = document.querySelector (shippingMethodElement);


    // filling form
    part_number.value = data.part_number;
    x_dim.value = data.x_dim;
    y_dim.value = data.y_dim;
    quantity.value = data.quantity;

    credit_card_name.value = data.credit_card_name;
    cc_number.value = data.cc_number;
    po_number.value = data.po_number;
    exp.value = data.exp;
    shipping_method.selected = "selected";

    if (data.itar === "yes") {
        itar_yes.checked = "checked";
    }

    else {
        itar_no.checked = "checked";
    }

    billing_city.value = data.billing_info.city;
    billing_company.value = data.billing_info.company;
    billing_address1.value = data.billing_info.address1;
    billing_address2.value = data.billing_info.address2;
    billing_zip.value = data.billing_info.zip;
    billing_state.selected = "selected";
    rev_number.value = data.rev_number;

    first_name.value = data.first_name;
    last_name.value = data.last_name;

    shipping_account.value = data.shipping_account;
    shipping_city.value = data.shipping_info.city;
    shipping_company.value = data.shipping_info.company;
    shipping_zip.value = data.shipping_info.zip;
    shipping_address1.value = data.shipping_info.address1;
    shipping_address2.value = data.shipping_info.address2;
    shipping_phone.value = data.shipping_info.phone;
    shipping_state.selected = "selected";

    // Solder Mask
    let maskValue = 0;
    switch (data.solder_mask) {
        case "both":
            maskValue = BOTH;
            break;
        case "top":
            maskValue = TOP;
            break;
        case "bottom":
            maskValue = BOTTOM;
            break;
        case "none":
            maskValue = NONE;
            break;
    }

    let solderSidesElement = "#dropSolderSides > option[value='"+maskValue+"']";
    const solder_mask = document.querySelector(solderSidesElement);
    solder_mask.selected = "selected";

    // Silkscreen

    let silkValue = 0;
    switch (data.silkscreen) {
        case "both":
            silkValue = BOTH;
            break;
        case "top":
            silkValue = TOP;
            break;
        case "bottom":
            silkValue = BOTTOM;
            break;
        case "none":
            silkValue = NONE;
            break;
    }

    let silkscreenElement = "#dropSilkSides > option[value='"+silkValue+"']";
    const silkscreen = document.querySelector(silkscreenElement);
    silkscreen.selected = "selected";

    // Invoice method
    let invoiceValue = 0;

    switch (data.invoice_method) {
        case "email":
            invoiceValue = EMAIL;
            break;
        case "mail":
            invoiceValue = MAIL;
            break;
        case "fax":
            invoiceValue = FAX;
            break;
    }

    let invoiceElement = "#drpInvoiceMethod> option[value='"+invoiceValue+"']";
    const invoice_method = document.querySelector(invoiceElement);
    invoice_method.selected = "selected";


    if (data.multiple_images === "no") {
        multiple.removeAttribute ("checked");
    }
    else {
        multiple.setAttribute("checked", true);
    }

    comments.value = data.comments;
}
