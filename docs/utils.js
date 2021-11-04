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

export function getSDKScriptPerformance() {
    if (!window.performance) {
        return;
    }

    const sdkScript = document.querySelector("script[src*='/sdk/js?']");
    const src = sdkScript ? sdkScript.src : "https://www.paypal.com/sdk/js?";

    const scriptPerformance = performance
        .getEntriesByType("resource")
        .find((item) => item.name.includes(src));

    return scriptPerformance;
}

export function setInnerHTML(selector, value) {
    var element = document.querySelector(selector);
    if (!element) {
        return;
    }

    element.innerHTML = value;
}

export function getPagePerformance() {
    if (!window.performance) {
        return;
    }

    const performanceTiming = window.performance.getEntriesByType("navigation");

    if (performanceTiming && performanceTiming[0]) {
        return performanceTiming[0];
    }
}
