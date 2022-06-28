import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent, DEFAULT_URL } from "../components/buttons-component";
import { UnifiedLoginComponent } from "../components/unified-login-component";
import { CookieBannerComponent } from "../components/cookie-banner-component";

describe("paypal button", () => {
    it("should complete payment with the paypal button", async () => {
        await browser.buttonsUrl(DEFAULT_URL);

        const paypalButton = new ButtonsComponent(FUNDING.PAYPAL);

        await paypalButton.click();
        await paypalButton.switchToPopupFrame();

        const unifiedLogin = new UnifiedLoginComponent();
        await unifiedLogin.loginWithEmailAndPassword();

        const isLoggedIn = await unifiedLogin.isLoggedIn();
        expect(isLoggedIn).to.be.equal(true);

        const SELECTORS = {
            PAY_NOW_BUTTON: '[data-testid="submit-button-initial"]', // checkoutlite app
            FALLBACK_PAY_NOW_BUTTON: "#confirmButtonTop", // hermes app
            ON_APPROVE_SUCCESS_MESSAGE: "#output",
        };

        const cookieBanner = new CookieBannerComponent();
        await cookieBanner.attemptToClose();

        let payNowButton = await $(SELECTORS.PAY_NOW_BUTTON);
        const isPayNowButtonDisplayed = await payNowButton.isDisplayed();

        if (!isPayNowButtonDisplayed) {
            // fallback to hermes button selector
            payNowButton = await $(SELECTORS.FALLBACK_PAY_NOW_BUTTON);
        }

        await payNowButton.waitForDisplayed();

        await payNowButton.waitAndClick();

        // switch back to the parent window context
        const windows = await browser.getWindowHandles();
        await browser.switchToWindow(windows[0]);

        const onApproveMessage = await $(SELECTORS.ON_APPROVE_SUCCESS_MESSAGE);
        await onApproveMessage.waitForDisplayed();
        const messageText = await onApproveMessage.getText();

        expect(messageText).to.be.equal("Thank you for your payment!");
    });
});
