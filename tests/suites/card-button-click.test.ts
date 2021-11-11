import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent, DEFAULT_URL } from "../components/buttons-component";

describe("card button", () => {
    it("should show the inline guest credit card form on click", async () => {
        await browser.testUrl(DEFAULT_URL);

        const cardButtonComponent = new ButtonsComponent(FUNDING.CARD);

        await browser.waitUntil(async () => {
            const text = await cardButtonComponent.getText();
            return Boolean(text);
        });

        await cardButtonComponent.click();

        const cardFieldsFrameSelector =
            "#card-fields-container iframe.zoid-visible";

        await browser.waitUntil(async () => {
            const cardFieldsComponent = await browser.$(
                cardFieldsFrameSelector
            );
            const { height } = await cardFieldsComponent.getSize();
            return height > 400;
        });

        const cardFieldsComponent = await browser.$(cardFieldsFrameSelector);

        await browser.switchToFrame(cardFieldsComponent);

        const cardNumberInput = await browser.$('input[name="cardnumber"]');
        const isCardNumberInputDisplayed = await cardNumberInput.isDisplayed();

        expect(isCardNumberInputDisplayed).to.equal(true);
    });
});
