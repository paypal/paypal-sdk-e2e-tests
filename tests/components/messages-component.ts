export const DEFAULT_URL =
    "https://paypal.github.io/paypal-sdk-e2e-tests/components/messages/messages.html";

const SELECTORS = {
    MESSAGE_IFRAME: "iframe[name^='__zoid__paypal_message__']",
    MESSAGE_CONTAINER: ".message[role='button']",
    MODAL_IFRAME: "iframe[name^='__zoid__paypal_credit_modal__']",
    MODAL_CONTAINER: ".modal-wrapper",
    MODAL_CLOSE_BUTTON: "button.close",
};

export class MessagesComponent {
    async switchToFrame(frameSelector: string): Promise<void> {
        browser.switchToParentFrame();

        const frame = await $(frameSelector);
        await frame.waitForDisplayed();

        if (!(await frame.isDisplayed())) {
            throw new Error(`Failed to load the iframe "${frameSelector}"`);
        }

        await browser.switchToFrame(frame);
    }

    async switchToMessagesFrame(): Promise<void> {
        const { MESSAGE_IFRAME, MESSAGE_CONTAINER } = SELECTORS;

        let frameBody = await $(MESSAGE_CONTAINER);

        // first check and see if we are already in the frame
        if (await frameBody.isDisplayed()) {
            return;
        }

        await this.switchToFrame(MESSAGE_IFRAME);

        // wait for client-side render to complete
        frameBody = await $(MESSAGE_CONTAINER);
        await frameBody.waitForDisplayed();
    }

    async switchToModalFrame(): Promise<void> {
        const { MODAL_IFRAME, MODAL_CONTAINER } = SELECTORS;

        let frameBody = await $(MODAL_CONTAINER);

        // first check and see if we are already in the frame
        if (await frameBody.isDisplayed()) {
            return;
        }

        await this.switchToFrame(MODAL_IFRAME);

        // wait for client-side render to complete
        frameBody = await $(MODAL_CONTAINER);
        await frameBody.waitForDisplayed();
    }

    async click(): Promise<void> {
        await this.switchToMessagesFrame();

        const { MESSAGE_CONTAINER } = SELECTORS;
        const button = await $(MESSAGE_CONTAINER);
        await button.waitAndClick();
    }
}
