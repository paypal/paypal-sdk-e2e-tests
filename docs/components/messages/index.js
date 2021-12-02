import { loadScript } from "https://unpkg.com/@paypal/paypal-js@4.2.1/dist/esm/paypal-js.js";
import { getOptionsFromQueryString } from "../../utils.js";

const sdkScriptDefaultOptions = {
    "client-id": "test",
    components: "messages",
    cachebust: "calzone",
};

const sdkScriptOptionsFromQueryString = getOptionsFromQueryString();
const sdkScriptOptions = Object.keys(sdkScriptOptionsFromQueryString).length
    ? sdkScriptOptionsFromQueryString
    : sdkScriptDefaultOptions;

const messageOptions = {
    amount: 500,
    placement: "product",
    style: {
        layout: "text",
        logo: {
            type: "primary",
            position: "top",
        },
    },
};

loadScript(sdkScriptOptions)
    .then((paypal) => {
        paypal.Messages(messageOptions).render("#messages-container");
    })
    .catch((err) => {
        console.error("failed to load the JS SDK script", err);
    });
