import * as dotenv from "dotenv";

// load environment variables from .env file for local development
dotenv.config();

export const config = {
    runner: "local",
    specs: ["../../tests/**/*.test.ts"],
    logLevel: "warn",
    coloredLogs: true,
    bail: 0,
    waitforTimeout: 60000,
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
            "buttonsUrl",
            function (defaultUrl: string): Promise<string> {
                return this.url(process.env.BUTTONS_URL || defaultUrl);
            }
        );

        browser.addCommand(
            "messagesUrl",
            function (defaultUrl: string): Promise<string> {
                return this.url(process.env.MESSAGES_URL || defaultUrl);
            }
        );

        browser.addCommand(
            "waitAndClick",
            async function (): Promise<void> {
                await this.waitForDisplayed();
                await browser.pause(3000);
                await this.click();
            },
            true
        );
    },
};
