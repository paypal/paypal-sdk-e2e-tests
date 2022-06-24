import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent, DEFAULT_URL } from "../components/buttons-component";
import { UnifiedLoginComponent } from "../components/unified-login-component";

describe("login", () => {
    it("should log in with an email and password", async () => {
        browser.execute(() => {
            console.log("correlation id: ", window.paypal.getCorrelationID());
        });

        await browser.buttonsUrl(DEFAULT_URL);

        const paypalButton = new ButtonsComponent(FUNDING.PAYPAL);

        await paypalButton.click();
        await paypalButton.switchToPopupFrame();

        const unifiedLogin = new UnifiedLoginComponent();
        await unifiedLogin.loginWithEmailAndPassword();

        const isLoggedIn = await unifiedLogin.isLoggedIn();
        expect(isLoggedIn).to.be.equal(true);

        await paypalButton.closePopup();
    });
});
