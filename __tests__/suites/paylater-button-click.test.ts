import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent } from "../components/buttons-component";
import { isLoginFormReady } from "../components/unified-login-component";

describe("paylater button click", () => {
    it("clicking on the paylater button should launch the popup", async () => {
        await browser.testUrl();

        const paypalButtonComponent = new ButtonsComponent(FUNDING.PAYLATER);
        await paypalButtonComponent.click();
        await paypalButtonComponent.switchToPopupFrame();

        const expectedPaths = ["/checkoutnow", "/webapps/hermes"];
        await isLoginFormReady(expectedPaths);

        const url = await browser.getUrl();
        const { pathname } = new URL(url);
        expect(expectedPaths).to.include(pathname);
    });
});
