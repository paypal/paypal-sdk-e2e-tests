class PerformanceTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        const tableElement = document.createElement("table");
        tableElement.setAttribute("class", "table");

        const tableRows = [
            {
                heading: "SDK Version",
                id: "sdk-version",
            },
            {
                heading: "SDK Script Load Time",
                id: "sdk-script-load-time",
            },
            {
                heading: "DOM Content Loaded Event",
                id: "dom-content-loaded-event",
            },
            {
                heading: "Page Load Event",
                id: "page-load-event",
            },
        ];

        const tableBodyElement = document.createElement("tbody");

        tableRows.forEach(({ heading, id }) => {
            const rowElement = document.createElement("tr");
            const headingElement = document.createElement("th");
            const dataElement = document.createElement("td");

            headingElement.textContent = heading;
            dataElement.setAttribute("id", id);

            rowElement.append(headingElement, dataElement);
            tableBodyElement.append(rowElement);
        });

        tableElement.append(tableBodyElement);

        const style = document.createElement("style");
        const lightGray = "#dee2e6";
        style.textContent = `
            .table {
                width: 100%;
                max-width: 100%;
                margin-bottom: 1rem;
                background-color: transparent;
                border: 1px solid ${lightGray};
                border-collapse: collapse;
                text-align: left;
                max-width: 500px;
            }

            .table th,
            .table td {
                padding: 0.75rem;
                vertical-align: top;
                border: 1px solid ${lightGray};
                width: 50%;
            }`;

        // attach the created elements to the shadow DOM
        this.shadowRoot.append(style, tableElement);
    }

    connectedCallback() {
        window.addEventListener("load", () => {
            this.addSDKVersion();
            this.addSDKScriptLoadTime();
            this.addPagePerformanceMetrics();
        });
    }

    addPagePerformanceMetrics() {
        if (!window.performance) {
            return;
        }

        const performanceTiming =
            window.performance.getEntriesByType("navigation");
        const pagePerformance = performanceTiming && performanceTiming[0];

        if (pagePerformance) {
            const { domContentLoadedEventEnd, loadEventStart } =
                pagePerformance;

            const domContentLoadedElement = this.shadowRoot.querySelector(
                "#dom-content-loaded-event"
            );

            if (domContentLoadedElement) {
                domContentLoadedElement.innerHTML = `${Math.round(
                    domContentLoadedEventEnd
                )} ms`;
            }

            const pageLoadElement =
                this.shadowRoot.querySelector("#page-load-event");

            if (pageLoadElement) {
                pageLoadElement.innerHTML = `${Math.round(loadEventStart)} ms`;
            }
        }
    }

    addSDKScriptLoadTime() {
        if (!window.performance) {
            return;
        }

        const sdkScript = this.getSDKScriptElement();
        const src = sdkScript
            ? sdkScript.src
            : "https://www.paypal.com/sdk/js?";

        const { duration } = performance
            .getEntriesByType("resource")
            .find((item) => item.name.includes(src));

        const sdkScriptLoadElement = this.shadowRoot.querySelector(
            "#sdk-script-load-time"
        );

        if (sdkScriptLoadElement) {
            sdkScriptLoadElement.innerHTML = `${Math.round(duration)} ms`;
        }
    }

    addSDKVersion() {
        const sdkScript = this.getSDKScriptElement();

        if (!sdkScript) {
            return;
        }

        const dataNamespace =
            sdkScript.getAttribute("data-namespace") || "paypal";

        const sdkScriptVersionElement =
            this.shadowRoot.querySelector("#sdk-version");

        if (sdkScriptVersionElement && window[dataNamespace]) {
            sdkScriptVersionElement.innerHTML = window[dataNamespace].version;
        }
    }

    getSDKScriptElement() {
        return document.querySelector("script[src*='/sdk/js?']");
    }
}

window.customElements.define("performance-table", PerformanceTable);
