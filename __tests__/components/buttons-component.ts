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

    /**
     * Clicks on the PayPal Button
     */
    async click(): Promise<void> {
        const frame = await $(".paypal-buttons iframe[title='PayPal']");
        await frame.waitForDisplayed();
        await browser.switchToFrame(frame);

        const button = await $(`[data-funding-source="${this.fundingSource}"]`);

        await button.waitForDisplayed();

        // wait for second render to complete
        await $('script[src^="https://www.paypal.com/sdk/js"][data-uid]');
        await this.getSDKVersion();

        await button.click();
    }
    /**
     * Switches context to the popup iframe
     */
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
}
