import { expect } from "chai";

import {
    MessagesComponent,
    DEFAULT_URL,
} from "../components/messages-component";

describe("messages", () => {
    it("should open the credit modal when clicking on the messages component", async () => {
        await browser.testUrl(DEFAULT_URL);

        const paypalMessagesComponent = new MessagesComponent();
        await paypalMessagesComponent.click();

        await paypalMessagesComponent.switchToModalFrame();

        const pageTitle = await browser.getTitle();
        expect(pageTitle).to.equal("Buy Now, Pay Later - PayPal");
    });
});
