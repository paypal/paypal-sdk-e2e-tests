import { expect } from "chai";
import { ButtonsComponent } from "../components/buttons-component";

describe("paypal button click", () => {
    it("clicking on the paypal button should launch the popup", async () => {
        await browser.useCustomURL();

        const paypalButtonComponent = new ButtonsComponent("paypal");
        await paypalButtonComponent.click();
        await paypalButtonComponent.switchToPopupFrame();

        await browser.waitUntil(async () => {
            const title = await browser.getTitle();
            return Boolean(title.length);
        });

        expect(await browser.getTitle()).to.contain(
            "Log in to your PayPal account"
        );
    });
});
