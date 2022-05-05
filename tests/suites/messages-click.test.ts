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

        const h1 = await $("h1");
        const h1Text = await h1.getText();

        const possibleHeadings = [
            "Buy now, pay later",
            "Pay in 4 interest-free payments",
            "Pay over time with PayPal Credit",
        ];

        expect(possibleHeadings).to.include(h1Text);
    });
});
