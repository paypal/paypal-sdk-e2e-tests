import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent, DEFAULT_URL } from "../components/buttons-component";
import { UnifiedLoginComponent } from "../components/unified-login-component";

describe("paylater button", () => {
    it("should open the popup when clicking on the paylater button", async () => {
        browser.execute(() => {
            console.log("correlation id: ", window.paypal.getCorrelationID());
        });

        await browser.buttonsUrl(DEFAULT_URL);

        const paypalButtonComponent = new ButtonsComponent(FUNDING.PAYLATER);
        await paypalButtonComponent.click();
        await paypalButtonComponent.switchToPopupFrame();

        const unifiedLogin = new UnifiedLoginComponent();
        const isLoginFormReady = await unifiedLogin.isLoginFormReady();

        expect(isLoginFormReady).to.be.equal(true);

        await paypalButtonComponent.closePopup();
    });
});
