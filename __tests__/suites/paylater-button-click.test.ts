import { expect } from "chai";
import { ButtonsComponent } from "../components/buttons-component";

describe("paylater button click", () => {
    it("clicking on the paylater button should launch the popup", async () => {
        await browser.useCustomURL();

        const paypalButtonComponent = new ButtonsComponent("paylater");
        await paypalButtonComponent.click();
        await paypalButtonComponent.switchToPopupFrame();

        // wait for the login form to show up
        const loginForm = await $('form');
        await loginForm.waitForDisplayed();

        expect(await browser.getTitle()).to.contain(
            "Log in to your PayPal account"
        );
    });
});
