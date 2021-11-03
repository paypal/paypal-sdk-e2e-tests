import { expect } from "chai";

import { MessagesComponent, DEFAULT_URL } from "../components/messages-component";

describe("messaging banner click", () => {
    it("clicking on the messaging banner should launch the popup", async () => {
        await browser.testUrl(DEFAULT_URL);

        const paypalMessagesComponent = new MessagesComponent();
        await paypalMessagesComponent.click();

        await paypalMessagesComponent.click();
        // await paypalMessagesComponent.switchToModalFrame();

        // const h1 = await $('h1');
        // const h1Text = await h1.getText();

        // expect(h1Text).to.equal(
        //     "Buy now, pay later"
        // );

    });
});
