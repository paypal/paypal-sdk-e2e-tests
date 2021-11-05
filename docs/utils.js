export function getOptionsFromQueryString() {
    const allowedSDKQueryParams = [
        "components",
        "debug",
        "client-id",
        "merchant-id",
        "locale",
        "currency",
        "intent",
        "commit",
        "vault",
        "buyer-country",
        "enable-funding",
        "disable-funding",
        "disable-card",
        "integration-date",
        "data-namespace",
        "sdkBaseURL",
    ];

    const searchParams = new URLSearchParams(window.location.search);
    const validOptions = {};

    searchParams.forEach((value, key) => {
        if (allowedSDKQueryParams.includes(key)) {
            validOptions[key] = value;
        }
    });

    return validOptions;
}
