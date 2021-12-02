import { loadScript } from "https://unpkg.com/@paypal/paypal-js@4.2.1/dist/esm/paypal-js.js";
import { getOptionsFromQueryString } from "../../utils.js";

const sdkScriptDefaultOptions = {
    "client-id": "test",
    cachebust: "calzone",
};

const sdkScriptOptionsFromQueryString = getOptionsFromQueryString();
const sdkScriptOptions = Object.keys(sdkScriptOptionsFromQueryString).length
    ? sdkScriptOptionsFromQueryString
    : sdkScriptDefaultOptions;

const buttonOptions = {
    createOrder(data, actions) {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: 2.0,
                        },
                    },
                ],
            })
            .then((orderID) => {
                console.log({ orderID });
                return orderID;
            });
    },

    onApprove(data, actions) {
        return actions.order.capture().then((orderDetails) => {
            console.log({ orderDetails });
        });
    },
};

loadScript(sdkScriptOptions)
    .then((paypal) => {
        let buttonsInstance;

        try {
            buttonsInstance = paypal.Buttons(buttonOptions);
        } catch (err) {
            console.error("failed to create the buttons component", err);
        }

        buttonsInstance.render("#buttons-container").catch((err) => {
            console.error("failed to render paypal buttons", err);
        });
    })
    .catch((err) => {
        console.error("failed to load the JS SDK script", err);
    });
