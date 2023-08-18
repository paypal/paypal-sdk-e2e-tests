import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent, DEFAULT_URL } from "../components/buttons-component";

describe("card button 3ds flow", () => {
    it("should show the inline guest form when clicking on the card button", async () => {
        // TODO: Remove this and add instructions in readme to sun the test locally
        await browser.buttonsUrl(
            `https://paypal.github.io/paypal-sdk-e2e-tests/components/card-buttons/card-buttons.html?sdkBaseURL=https://<stageURL>/sdk/js&client-id=AfALq_mQ3SUUltuavn8MnEaXPCPFRl4aOZDTcDTo1I4FsJGN3TPFZ1THvcT39wAF3S250a5oqCUbpJHH&currency=GBP&allowBillingPayments=false`
        );

        const cardButtonComponent = new ButtonsComponent(FUNDING.CARD);

        // wait for the button text to display to know when second render is complete
        await browser.waitUntil(async () => {
            const text = await cardButtonComponent.getText();
            return Boolean(text);
        });

        await cardButtonComponent.click();
        const cardFieldsFrameSelector = "iframe[title='paypal_card_form']";

        // wait for the loading spinner to get replaced by the actual form
        // the height changes from 300px to over 700px after this change
        let cardFieldsComponent;
        await browser.waitUntil(async () => {
            cardFieldsComponent = await browser.$(cardFieldsFrameSelector);
            const { height } = await cardFieldsComponent.getSize();
            return height > 200;
        });

        cardFieldsComponent = await browser.$(cardFieldsFrameSelector);

        await browser.switchToFrame(cardFieldsComponent);

        // Fill in the credit card details
        await cardButtonComponent.fillInCardDetails();

        // verify the card number input displays
        const cardNumberInput = await browser.$('input[name="cardnumber"]');
        const isCardNumberInputDisplayed = await cardNumberInput.isDisplayed();
        expect(isCardNumberInputDisplayed).to.equal(true);

        //click Submit button
        const submitButton = await $("#submit-button");
        await submitButton.click();

        // switch back to the parent window context
        const windows = await browser.getWindowHandles();
        await browser.switchToWindow(windows[0]);

        const vaultMessage = await $("#output");
        await vaultMessage.waitForDisplayed();
        const successText = await vaultMessage.getText();
        expect(successText).to.be.equal("Thank you for your payment!");
    });
});
