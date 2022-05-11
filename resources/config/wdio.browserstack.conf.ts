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
        maskCommands: "setValues, getValues, setCookies, getCookies",
        debug: true,
        video: true,
        networkLogs: false,
        sessionName:
            parseArgs(process.argv.slice(2))["bstack-session-name"] ||
            "default_name",
        buildName: process.env.BROWSERSTACK_BUILD_NAME
            ? process.env.BROWSERSTACK_BUILD_NAME.substring(0, 255)
            : `paypal-sdk-e2e-tests-${epochTime}`,
    },
    capabilities: [
        {
            "bstack:options": {
                os: "Windows",
                osVersion: "10",
            },
            browserName: "Chrome",
            browserVersion: "90",
        },
        {
            "bstack:options": {
                os: "OS X",
                osVersion: "Big Sur",
            },
            browserName: "Firefox",
            browserVersion: "latest",
            acceptInsecureCerts: true,
        },
        {
            "bstack:options": {
                osVersion: "10.0",
                deviceName: "Samsung Galaxy S20",
                realMobile: "true",
            },
            browserName: "Chrome",
            acceptInsecureCerts: true,
        },
        {
            "bstack:options": {
                osVersion: "11.0",
                deviceName: "Google Pixel 5",
                realMobile: "true",
            },
            browserName: "Chrome",
            acceptInsecureCerts: true,
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
            commonCapabilities: { buildName },
        } = config;

        const sessionResults = await getSessionResults(buildName);

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

tmpConfig.capabilities.forEach(function ({
    "bstack:options": caps,
}: {
    [x: string]: unknown;
}) {
    for (const i in tmpConfig.commonCapabilities)
        caps[i] = caps[i] || tmpConfig.commonCapabilities[i];
});

export const config = tmpConfig;
