export const DEFAULT_URL =
    "http://localhost:5000/components/messages.html";

export class MessagesComponent {
    iframeMessageSelector: string;
    iframeCreditModalSelector: string;

    constructor() {
        this.iframeMessageSelector = "iframe[name^='__zoid__paypal_message__']";
        this.iframeCreditModalSelector = "iframe[name^='__zoid__paypal_credit_modal__']";
    }

    async isLoaded(): Promise<boolean> {
        // wait for second render to complete
        let frame = await $(this.iframeMessageSelector);
        await frame.waitForDisplayed();

        // reselect the frame to avoid the error "Could not switch frame, unknown id"
        frame = await $(this.iframeMessageSelector);
        await frame.waitForDisplayed();

        return await frame.isDisplayed();
    }

    async switchToMessagesFrame(): Promise<void> {
        const frameBody = await $("script[src*='/upstream/bizcomponents']");

        // first check and see if we are already in the frame
        if (await frameBody.isDisplayed()) {
            return;
        }

        // otherwise assume we are on the merchant page
        if (!(await this.isLoaded())) {
            throw new Error("Second render failed for the messages component");
        }

        const frame = await $(this.iframeMessageSelector);
        await browser.switchToFrame(frame);
        await browser.pause(3000);
    }

    async switchToModalFrame(): Promise<void> {
        const frame = await $(this.iframeCreditModalSelector);
        await browser.switchToFrame(frame);
    }

    async click(): Promise<void> {
        await this.switchToMessagesFrame();

        const button = await $("button");
        await button.waitAndClick();
    }
}
