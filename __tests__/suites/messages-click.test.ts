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

        expect(h1Text).to.equal("Buy now, pay later");
    });
});
