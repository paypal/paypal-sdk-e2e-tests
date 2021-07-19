import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent } from "../components/buttons-component";

describe("paylater button click", () => {
    it("clicking on the paylater button should launch the popup", async () => {
        await browser.testUrl();

        const paypalButtonComponent = new ButtonsComponent(FUNDING.PAYLATER);
        await paypalButtonComponent.click();
        await paypalButtonComponent.switchToPopupFrame();

        // wait for the login form to show up
        const loginForm = await $("form");
        await loginForm.waitForDisplayed();

        expect(await browser.getTitle()).to.contain(
            "Log in to your PayPal account"
        );
    });
});
