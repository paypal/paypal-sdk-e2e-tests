function getOptionsFromQueryString() {
    var customOptions = window.location.search
        .replace("?", "")
        .split("&")
        .map(function (value) {
            return value.split("=");
        })
        .reduce(function (acc, val) {
            if (!val.length) {
                return;
            }
            var key = val[0];
            if (key) {
                acc[key] = val[1];
            }

            return acc;
        }, {});

    return customOptions;
}

var sdkScriptDefaultOptions = {
    "client-id": "test",
    cachebust: "calzone",
};

var sdkScriptOptionsFromQueryString = getOptionsFromQueryString();
var sdkScriptOptions = Object.keys(sdkScriptOptionsFromQueryString).length
    ? sdkScriptOptionsFromQueryString
    : sdkScriptDefaultOptions;

window
    .paypalLoadScript(sdkScriptOptions)
    .then(function (paypal) {
        var buttonsInstance;

        try {
            buttonsInstance = paypal.Buttons();
        } catch (err) {
            console.error("failed to create the buttons component", err);
        }

        buttonsInstance.render("#buttons-container").catch((err) => {
            console.error("failed to render paypal buttons", err);
        });
    })
    .catch(function (err) {
        console.error("failed to load the JS SDK script", err);
    });
