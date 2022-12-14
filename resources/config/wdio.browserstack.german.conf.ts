import { config as defaultConfig } from "./wdio.browserstack.conf";
import * as _ from "lodash";

const overrides = {
    // paylater button is not eligible in Germany
    exclude: ["../../tests/**/*paylater*.test.ts"],
    commonCapabilities: {},
    capabilities: [
        {
            "goog:chromeOptions": {
                prefs: {
                    "intl.accept_languages": "de-DE",
                },
            },
        },
        {
            "moz:firefoxOptions": {
                prefs: {
                    "intl.accept_languages": "de-DE",
                },
            },
        },
        {
            "appium:language": "de",
            "appium:locale": "de",
        },
        {
            "appium:language": "de",
            "appium:locale": "de",
        },
    ],
};

const tmpConfig = _.defaultsDeep(overrides, defaultConfig);

tmpConfig.capabilities.forEach(function ({
    "bstack:options": caps,
}: {
    [x: string]: unknown;
}) {
    for (const i in tmpConfig.commonCapabilities)
        caps[i] = caps[i] || tmpConfig.commonCapabilities[i];
});

export const config = tmpConfig;
