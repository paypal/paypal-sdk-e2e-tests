import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent } from "../components/buttons-component";
import { UnifiedLoginComponent } from "../components/unified-login-component";

describe("paylater button click", () => {
    it("clicking on the paylater button should launch the popup", async () => {
        await browser.testUrl();

        const paypalButtonComponent = new ButtonsComponent(FUNDING.PAYLATER);
        await paypalButtonComponent.click();
        await paypalButtonComponent.switchToPopupFrame();

        const unifiedLogin = new UnifiedLoginComponent();
        const isLoginFormReady = await unifiedLogin.isLoginFormReady();

        expect(isLoginFormReady).to.be.equal(true);
    });
});
