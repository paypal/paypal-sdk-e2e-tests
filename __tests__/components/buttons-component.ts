export type FUNDING_SOURCE = "paypal" | "paylater" | "card";

/**
 * Class for the window.paypal.Buttons() JS SDK component
 *
 */
export class ButtonsComponent {
    fundingSource: FUNDING_SOURCE;

    constructor(fundingSource: FUNDING_SOURCE) {
        this.fundingSource = fundingSource;
    }

    async click(): Promise<void> {
        await this.switchToButtonsFrame();

        const button = await $(`[data-funding-source="${this.fundingSource}"]`);
        await button.waitForDisplayed();

        // wait for second render to complete
        await $('script[src^="https://www.paypal.com/sdk/js"][data-uid]');
        await this.getSDKVersion();

        await button.click();
    }

    async switchToButtonsFrame(): Promise<void> {
        const frameBody = await $("body[data-client-version]");

        // already in the iframe so there's no need to switch
        if (await frameBody.isDisplayed()) {
            return;
        }

        const frame = await $(".paypal-buttons iframe[title='PayPal']");
        await frame.waitForDisplayed();
        await browser.switchToFrame(frame);
    }

    async switchToPopupFrame(): Promise<void> {
        const windows: string[] = await browser.getWindowHandles();
        if (windows.length === 2) {
            await browser.switchToWindow(windows[1]);
        }
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
