export const DEFAULT_URL =
    "https://paypal.github.io/paypal-sdk-e2e-tests/components/messages.html";

export const messagesComponentSelectors = {
    iframeMessageSelector: "iframe[name^='__zoid__paypal_message__']",
    messageContainer: ".message[role='button",
    iframeModalSelector: "iframe[name^='__zoid__paypal_credit_modal__']",
    modalContainer: ".modal-wrapper",
    modalCloseButton: "button.close",
};

export class MessagesComponent {
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

        frame = await $(frameSelector);
        await browser.switchToFrame(frame);
    }

    async switchToMessagesFrame(): Promise<void> {
        const { iframeMessageSelector, messageContainer } =
            messagesComponentSelectors;

        let frameBody = await $(messageContainer);

        // first check and see if we are already in the frame
        if (await frameBody.isDisplayed()) {
            return;
        }

        await this.switchToFrame(iframeMessageSelector);

        // wait for client-side render to complete
        frameBody = await $(messageContainer);
        await frameBody.waitForDisplayed();
    }

    async switchToModalFrame(): Promise<void> {
        const { iframeModalSelector, modalContainer } =
            messagesComponentSelectors;

        let frameBody = await $(modalContainer);

        // first check and see if we are already in the frame
        if (await frameBody.isDisplayed()) {
            return;
        }

        await this.switchToFrame(iframeModalSelector);

        // wait for client-side render to complete
        frameBody = await $(modalContainer);
        await frameBody.waitForDisplayed();
    }

    async click(): Promise<void> {
        await this.switchToMessagesFrame();

        const { messageContainer } = messagesComponentSelectors;
        const button = await $(messageContainer);
        await button.waitAndClick();
    }
}
