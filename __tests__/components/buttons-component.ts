import { FUNDING } from "@paypal/sdk-constants";

export class ButtonsComponent {
    fundingSource: string;

    constructor(fundingSource: string) {
        const validFundingSources = Object.values(FUNDING);

        if (!validFundingSources.includes(fundingSource)) {
            throw new Error(
                `Invalid funding source "${fundingSource}". Valid funding sources: ${JSON.stringify(
                    validFundingSources
                )}`
            );
        }

        this.fundingSource = fundingSource;
    }

    async click(): Promise<void> {
        await this.switchToButtonsFrame();

        // select a button by funding source
        const button = await $(`[data-funding-source="${this.fundingSource}"]`);
        await button.waitAndClick();
    }

    async switchToButtonsFrame(): Promise<void> {
        const frameBody = await $("body[data-client-version]");

        // already in the iframe so there's no need to switch
        if (await frameBody.isDisplayed()) {
            return;
        }

        // wait for second render to complete
        const frame = await $("iframe[class='component-frame visible']");
        await frame.waitForDisplayed();
        await browser.switchToFrame(frame);
    }

    async switchToPopupFrame(): Promise<void> {
        let windows;
        await browser.waitUntil(
            async () => {
                windows = await browser.getWindowHandles();
                return windows.length >= 2;
            },
            {
                timeoutMsg: "Expired time waiting checkout window",
            }
        );

        if (!windows) {
            throw new Error("Failed to switch to the popup iframe");
        }

        await browser.switchToWindow(windows[1]);
    }

    async getSDKVersion(): Promise<string> {
        return await browser.execute((windowNamespace) => {
            const paypalNamespace = (window as any)[windowNamespace];

            if (paypalNamespace) {
                return paypalNamespace.version;
            }
        }, "paypal");
    }

    async getText(): Promise<string> {
        await this.switchToButtonsFrame();
        const buttonTextElement = await $(
            `[data-funding-source="${this.fundingSource}"] .paypal-button-text`
        );
        return buttonTextElement.getText();
    }
}
