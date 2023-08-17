import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent, DEFAULT_URL } from "../components/buttons-component";

describe("card button 3ds flow", () => {
    it("should show the inline guest form when clicking on the card button", async () => {
        // TODO: Remove this and add instructions in readme to sun the test locally
        await browser.buttonsUrl(
            `http://localhost:8081/docs/components/card-buttons/card-buttons.html?sdkBaseURL=https://www.msmaster.qa.paypal.com/sdk/js&client-id=B_A-Ozg24p6ABR4eMS4hIgSHFw25ziFsVe4aKXJ74ZHVRwFI0jsYZzhZbH3PmmrQt1iIpq4yNATP22bgBM&currency=GBP`
        );

        const cardButtonComponent = new ButtonsComponent(FUNDING.CARD); //card

        // wait for the button text to display to know when second render is complete
        await browser.waitUntil(async () => {
            const text = await cardButtonComponent.getText();
            return Boolean(text);
        });
        console.log(cardButtonComponent);
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
        console.log("cardFieldsComponent");
        console.log(cardFieldsComponent);
        console.log("selector ", cardFieldsFrameSelector);

        await browser.switchToFrame(cardFieldsComponent); //verify
        await browser.pause(1000);
        console.log(await browser.getPageSource());

        // Fill in the credit card details
        await cardButtonComponent.fillInCardDetails();

        //verify the card number input displays
        const cardNumberInput = await browser.$('input[name="cardnumber"]');
        const isCardNumberInputDisplayed = await cardNumberInput.isDisplayed();
        expect(isCardNumberInputDisplayed).to.equal(true);

        console.log(JSON.stringify(browser));
        //click Submit button
        const submitButton = await $("#submit-button");
        await submitButton.waitForDisplayed();
        console.log(submitButton);
        await submitButton.click();

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
