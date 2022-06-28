import { expect } from "chai";
import { FUNDING } from "@paypal/sdk-constants";

import { ButtonsComponent, DEFAULT_URL } from "../components/buttons-component";

const buttonTextByLanguage: Record<string, string> = {
    en: "Debit or Credit Card",
    de: "Debit- oder Kreditkarte",
};

// Returns a 2 char string representing the language, i.e. "en", "de"
async function getBrowserLanguage(): Promise<string> {
    const language = await browser.execute(() => {
        if (window.navigator.language) {
            return window.navigator.language.substr(0, 2);
        }
        return "en";
    });

    return language;
}

describe("card button", () => {
    it(`should display the card button text based on the browser language`, async () => {
        await browser.buttonsUrl(DEFAULT_URL);

        const cardButtonComponent = new ButtonsComponent(FUNDING.CARD);

        const language = await getBrowserLanguage();
        const expectedButtonText = buttonTextByLanguage[language];

        await browser.waitUntil(async () => {
            const text = await cardButtonComponent.getText();
            return Boolean(text);
        });

        expect(await cardButtonComponent.getText()).to.equal(
            expectedButtonText
        );
    });
});
