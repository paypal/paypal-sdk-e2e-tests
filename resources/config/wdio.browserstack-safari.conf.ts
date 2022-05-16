import { config as defaultConfig } from "./wdio.browserstack.conf";

const overrides = {
    maxInstances: 1,
    services: ["safaridriver"],
    specs: ["tests/**/*.test.ts"],
    capabilities: [
        {
            os: "OS X",
            os_version: "Big Sur",
            browserName: "Safari",
            browser_version: "latest",
        },
    ],
};

export const config = Object.assign({}, defaultConfig, overrides);
