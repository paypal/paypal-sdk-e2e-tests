import { FUNDING } from "@paypal/sdk-constants";

export const DEFAULT_URL =
    "https://paypal.github.io/paypal-sdk-e2e-tests/components/buttons.html";

const SELECTORS = {
    BUTTON_IFRAME: "iframe[class='component-frame visible']",
    BUTTON_CONTAINER: "body[data-client-version]",
    BUTTON_TEXT: ".paypal-button-text",
    OVERLAY_IFRAME: "iframe[title='PayPal Checkout Overlay']",
    OVERLAY_CLOSE_BUTTON: ".paypal-checkout-close",
};

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

    async switchToFrame(frameSelector: string): Promise<void> {
        browser.switchToParentFrame();

        // wait for second render to complete
        let frame = await $(frameSelector);
        await frame.waitForDisplayed();

        // reselect the frame to avoid the error "Could not switch frame, unknown id"
        frame = await $(frameSelector);
        await frame.waitForDisplayed();

        if (!(await frame.isDisplayed())) {
            throw new Error(`Failed to load the iframe "${frameSelector}"`);
        }

        await browser.switchToFrame(frame);
    }

    async switchToButtonsFrame(): Promise<void> {
        const { BUTTON_IFRAME, BUTTON_CONTAINER } = SELECTORS;
        const frameBody = await $(BUTTON_CONTAINER);

        // first check and see if we are already in the frame
        if (await frameBody.isDisplayed()) {
            return;
        }

        this.switchToFrame(BUTTON_IFRAME);
    }

    async click(): Promise<void> {
        await this.switchToButtonsFrame();

        // select a button by funding source
        const button = await $(`[data-funding-source="${this.fundingSource}"]`);
        await button.waitAndClick();
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

        const { BUTTON_TEXT } = SELECTORS;
        const buttonTextElement = await $(
            `[data-funding-source="${this.fundingSource}"] ${BUTTON_TEXT}`
        );

        return buttonTextElement.getText();
    }

    async closePopup(): Promise<void> {
        // switch from the popup back to the parent window
        const windows = await browser.getWindowHandles();
        await browser.switchToWindow(windows[0]);

        const { OVERLAY_IFRAME, OVERLAY_CLOSE_BUTTON } = SELECTORS;

        // switch into the overlay iframe
        const frame = await $(OVERLAY_IFRAME);
        await browser.switchToFrame(frame);

        // click the close button
        const closeButton = await $(OVERLAY_CLOSE_BUTTON);
        await closeButton.waitAndClick();

        // wait until the popup window closes
        await browser.waitUntil(
            async () => {
                const windows = await browser.getWindowHandles();
                return windows.length === 1;
            },
            {
                timeoutMsg: "Expired time waiting for popup to close",
            }
        );
    }
}
