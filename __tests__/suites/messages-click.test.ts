import { expect } from "chai";

import {
    MessagesComponent,
    DEFAULT_URL,
} from "../components/messages-component";

describe("messages banner", () => {
    it("clicking should launch the credit modal", async () => {
        await browser.testUrl(DEFAULT_URL);

        const paypalMessagesComponent = new MessagesComponent();
        await paypalMessagesComponent.click();

        await paypalMessagesComponent.switchToModalFrame();

        const h1 = await $("h1");
        const h1Text = await h1.getText();

        expect(h1Text).to.equal("Buy now, pay later");
    });
});
