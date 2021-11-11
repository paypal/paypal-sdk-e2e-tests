import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent, DEFAULT_URL } from "../components/buttons-component";

describe("card button", () => {
    it("should show the inline guest form when clicking on the card button", async () => {
        await browser.testUrl(DEFAULT_URL);

        const cardButtonComponent = new ButtonsComponent(FUNDING.CARD);

        // wait for the button text to display to know when second render is complete
        await browser.waitUntil(async () => {
            const text = await cardButtonComponent.getText();
            return Boolean(text);
        });

        await cardButtonComponent.click();

        const cardFieldsFrameSelector =
            "#card-fields-container iframe.zoid-visible";

        // wait for the loading spinner to get replaced by the actual form
        // the height changes from 300px to over 700px after this change
        await browser.waitUntil(async () => {
            const cardFieldsComponent = await browser.$(
                cardFieldsFrameSelector
            );
            const { height } = await cardFieldsComponent.getSize();
            return height > 400;
        });

        const cardFieldsComponent = await browser.$(cardFieldsFrameSelector);

        await browser.switchToFrame(cardFieldsComponent);

        // verify the card number input displays
        const cardNumberInput = await browser.$('input[name="cardnumber"]');
        const isCardNumberInputDisplayed = await cardNumberInput.isDisplayed();

        expect(isCardNumberInputDisplayed).to.equal(true);
    });
});
