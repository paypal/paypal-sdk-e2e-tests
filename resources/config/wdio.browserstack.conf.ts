import * as _ from "lodash";
import * as parseArgs from "minimist";

import { getSessionResults } from "../utils/browserstack-session-results";
import { config as defaultConfig } from "./wdio.conf";

const epochTime = new Date().getTime();

const overrides = {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    services: [
        [
            "@browserstack/wdio-browserstack-service",
            {
                browserstackLocal: true,
            },
        ],
    ],
    specs: ["tests/**/*.test.ts"],
    host: "hub.browserstack.com",
    maxInstances: 15,
    baseUrl: "https://developer.paypal.com",
    commonCapabilities: {
        "browserstack.maskCommands":
            "setValues, getValues, setCookies, getCookies",
        "browserstack.debug": true,
        "browserstack.video": true,
        "browserstack.networkLogs": false,
        name:
            parseArgs(process.argv.slice(2))["bstack-session-name"] ||
            "default_name",
        build: process.env.BROWSERSTACK_BUILD_NAME
            ? process.env.BROWSERSTACK_BUILD_NAME.substring(0, 255)
            : `paypal-sdk-e2e-tests-${epochTime}`,
        acceptInsecureCerts: true,
    },
    capabilities: [
        {
            os: "Windows",
            os_version: "10",
            browserName: "Chrome",
            browser_version: "90",
        },
        {
            os: "OS X",
            os_version: "Big Sur",
            browserName: "Firefox",
            browser_version: "latest",
        },
        {
            os_version: "10.0",
            device: "Samsung Galaxy S20",
            real_mobile: "true",
            browserName: "Android",
        },
        {
            os_version: "11.0",
            device: "Google Pixel 5",
            real_mobile: "true",
            browserName: "Android",
        },
    ],
    afterTest: async function (
        test: { title: string },
        _context: Record<string, unknown>,
        { passed, error }: unknown
    ) {
        const sessionNameFromArgs = parseArgs(process.argv.slice(2))[
            "bstack-session-name"
        ];

        if (sessionNameFromArgs) {
            await browser.executeScript(
                `browserstack_executor: {
                    "action": "setSessionName",
                    "arguments": { "name": "${sessionNameFromArgs}" }
                }`,
                []
            );
        } else {
            await browser.executeScript(
                `browserstack_executor: {
                    "action": "setSessionName",
                    "arguments": { "name": "${test.title}" }
                }`,
                []
            );
        }

        if (passed) {
            await browser.executeScript(
                `browserstack_executor: {
                    "action": "setSessionStatus",
                    "arguments": { "status": "passed", "reason": "Assertions passed" }
                }`,
                []
            );
        } else {
            await browser.takeScreenshot();
            const reason = (
                "At least 1 assertion failed: " +
                (error as string).toString().replace(/[^a-zA-Z0-9.]/g, " ")
            ).substring(0, 255);

            await browser.executeScript(
                `browserstack_executor: {
                    "action": "setSessionStatus",
                    "arguments": { "status": "failed", "reason": "${reason}" }
                }`,
                []
            );
        }
    },

    onComplete: async function (exitCode: number, config: Record<string, any>) {
        const {
            commonCapabilities: { build },
        } = config;

        const sessionResults = await getSessionResults(build);

        if (!sessionResults) {
            return;
        }

        const formattedSessionDetails = sessionResults.map(
            ({
                automation_session: {
                    name,
                    duration,
                    os,
                    os_version,
                    browser,
                    browser_version,
                    status,
                    public_url,
                    browser_url,
                },
            }) => {
                return {
                    name,
                    duration,
                    os,
                    os_version,
                    browser,
                    browser_version,
                    status,
                    public_url,
                    browser_url,
                };
            }
        );

        console.log(JSON.stringify(formattedSessionDetails, null, 4));
    },
};

const tmpConfig = _.defaultsDeep(overrides, defaultConfig);

tmpConfig.capabilities.forEach(function (caps: { [x: string]: unknown }) {
    for (const i in tmpConfig.commonCapabilities)
        caps[i] = caps[i] || tmpConfig.commonCapabilities[i];
});

export const config = tmpConfig;
