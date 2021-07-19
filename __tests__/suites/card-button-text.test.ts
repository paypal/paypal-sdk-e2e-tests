import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent } from "../components/buttons-component";

const buttonTextByLanguage: Record<string, string> = {
    "en-US": "Debit or Credit Card",
    "de-DE": "Debit- oder Kreditkarte",
};

async function getBrowserLanguage(): Promise<string> {
    const language = await browser.execute(() => {
        if (window.navigator.language) {
            return window.navigator.language;
        }
    });

    return language || "en-US";
}

describe("card button text", () => {
    it(`should be based on the set browser language`, async () => {
        await browser.testUrl();

        const language = await getBrowserLanguage();
        const expectedButtonText = buttonTextByLanguage[language];
        const paypalButtonComponent = new ButtonsComponent(FUNDING.CARD);

        await browser.waitUntil(async () => {
            const text = await paypalButtonComponent.getText();
            return Boolean(text);
        });

        expect(await paypalButtonComponent.getText()).to.equal(
            expectedButtonText
        );
    });
});
