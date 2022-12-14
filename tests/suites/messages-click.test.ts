import { expect } from "chai";

import {
    MessagesComponent,
    DEFAULT_URL,
} from "../components/messages-component";

describe("messages", () => {
    it("should open the credit modal when clicking on the messages component", async () => {
        await browser.messagesUrl(DEFAULT_URL);

        const paypalMessagesComponent = new MessagesComponent();
        await paypalMessagesComponent.click();

        await paypalMessagesComponent.switchToModalFrame();

        const h2 = await $("h2");
        const h2Text = await h2.getText();

        const possibleHeadings = [
            "Buy now, pay later",
            "Pay in 4 interest-free payments",
            "Pay over time with PayPal Credit",
            "Pay with monthly installments",
            "Pay Monthly",
        ];

        expect(possibleHeadings).to.include(h2Text);
    });
});
