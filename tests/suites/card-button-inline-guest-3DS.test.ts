import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent } from "../components/buttons-component";

describe("card button 3ds flow", () => {
    it("should show the inline guest form when clicking on the card button", async () => {
        // TODO: Remove this and add instructions in readme to sun the test locally
        await browser.buttonsUrl(
            `https://paypal.github.io/paypal-sdk-e2e-tests/components/card-buttons/card-buttons.html`
        );

        const cardButtonComponent = new ButtonsComponent(FUNDING.CARD); //card

        // wait for the button text to display to know when second render is complete
        await browser.waitUntil(async () => {
            const text = await cardButtonComponent.getText();
            return Boolean(text);
        });
        await cardButtonComponent.click();
        const cardFieldsFrameSelector = "iframe[title='paypal_card_form']"; //"#card-fields-container iframe.zoid-visible";

        // wait for the loading spinner to get replaced by the actual form
        // the height changes from 300px to over 700px after this change

        await browser.waitUntil(async () => {
            const cardFieldsComponent = await browser.$(
                cardFieldsFrameSelector
            );
            const { height } = await cardFieldsComponent.getSize();
            return height > 200;
        });

        const cardFieldsComponent = await browser.$(cardFieldsFrameSelector);

        await browser.switchToFrame(cardFieldsComponent);

        // Fill in the credit card details
        await cardButtonComponent.fillInCardDetails();

        const submitButton = await browser.$("#submit-button");
        await submitButton.waitForDisplayed();
        expect(await submitButton.isClickable()).to.equal(true);
        await submitButton.click({ button: 1 });

        // switch to 3DS Modal Overlay
        const tdsOverlay = await browser.$(
            "iframe[title='PayPal Checkout Overlay']"
        );
        await tdsOverlay.waitForDisplayed();
        await browser.switchToFrame(tdsOverlay);
        const otpInputField = await browser.$("input[name = otp]");
        expect(await otpInputField.isDisplayed()).to.equal(true);
    });
});
