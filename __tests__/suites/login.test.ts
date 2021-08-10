import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent } from "../components/buttons-component";
import { UnifiedLoginComponent } from "../components/unified-login-component";

describe("login", () => {
    it("should log in with an email and password", async () => {
        await browser.testUrl();

        const paypalButton = new ButtonsComponent(FUNDING.PAYPAL);
        expect(await paypalButton.isLoaded()).to.be.equal(true);

        await paypalButton.click();

        await paypalButton.switchToPopupFrame();

        const unifiedLogin = new UnifiedLoginComponent();

        await unifiedLogin.loginWithEmailAndPassword();

        const isLoggedIn = await unifiedLogin.isLoggedIn();
        expect(isLoggedIn).to.be.equal(true);
    });
});
