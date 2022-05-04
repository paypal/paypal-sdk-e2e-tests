import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent, DEFAULT_URL } from "../components/buttons-component";
import { UnifiedLoginComponent } from "../components/unified-login-component";

describe("paypal button", () => {
    it("should open the popup when clicking on the paypal button", async () => {
        await browser.testUrl(DEFAULT_URL);

        const paypalButtonComponent = new ButtonsComponent(FUNDING.PAYPAL);
        await paypalButtonComponent.unsafeReferer();
        await paypalButtonComponent.click();
        await paypalButtonComponent.switchToPopupFrame();

        const unifiedLogin = new UnifiedLoginComponent();
        const isLoginFormReady = await unifiedLogin.isLoginFormReady();

        expect(isLoginFormReady).to.be.equal(true);

        await paypalButtonComponent.closePopup();
    });
});
