import * as dotenv from "dotenv";

// load environment variables from .env file for local development
dotenv.config();

export const config = {
    runner: "local",
    specs: ["tests/**/*.test.ts"],
    capabilities: [
        {
            maxInstances: 1,
            browserName: "chrome",
            acceptInsecureCerts: true,
        },
    ],
    logLevel: "warn",
    coloredLogs: true,
    bail: 0,
    waitforTimeout: 30000,
    connectionRetryTimeout: 120000,
    chromeOptions: {
        prefs: {
            "profile.default_content_setting_values.geolocation": 1,
        },
    },
    framework: "mocha",
    mochaOpts: {
        ui: "bdd",
        timeout: 150000,
    },
    afterTest: function (
        _test: Record<string, unknown>,
        _context: Record<string, unknown>,
        { error }: Record<string, unknown>
    ): void {
        if (error) {
            browser.takeScreenshot();
        }
    },
    before: function (): void {
        browser.addCommand(
            "testUrl",
            async function (defaultUrl: string): Promise<string> {
                const testUrl = process.env.TEST_URL || defaultUrl;
                const unsafeReferer = process.env.UNSAFE_REFERER;
                const isChrome = this.capabilities.browserName === "Chrome";
                if (unsafeReferer && isChrome) {
                    await this.url(testUrl);
                    await this.newWindow(unsafeReferer);
                    const body = await $("body");
                    const bodyExists = await body.isExisting();
                    bodyExists
                        ? await body.addValue("thisisunsafe")
                        : console.error("The 'body' element doesn't exist.");
                    await this.closeWindow();
                }
                const url = await this.url(testUrl);
                if (this.capabilities.browserName === "Safari") {
                    try {
                        await this.fullscreenWindow();
                    } catch (err) {
                        // Ignore error
                    }
                }
                return url;
            }
        );

        browser.addCommand(
            "waitAndClick",
            async function (): Promise<void> {
                await this.waitForDisplayed();
                await this.waitForClickable();
                await browser.pause(3000);
                await this.click();
                // Allow Button click impact to take place.
                await browser.pause(3000);
            },
            true
        );
    },
};
