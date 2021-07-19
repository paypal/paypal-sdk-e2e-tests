import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent } from "../components/buttons-component";

describe("paypal button click", () => {
    it("clicking on the paypal button should launch the popup", async () => {
        await browser.testUrl();

        const paypalButtonComponent = new ButtonsComponent(FUNDING.PAYPAL);
        await paypalButtonComponent.click();
        await paypalButtonComponent.switchToPopupFrame();

        const expectedPaths = ["/checkoutnow", "/webapps/hermes"];

        let url = await browser.getUrl();

        await browser.waitUntil(async () => {
            url = await browser.getUrl();
            const { pathname } = new URL(url);

            return expectedPaths.some((supportedPath) => {
                return pathname.startsWith(supportedPath);
            });
        });

        const { pathname } = new URL(url);
        expect(expectedPaths).to.include(pathname);
    });
});
