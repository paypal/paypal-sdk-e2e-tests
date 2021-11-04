const SELECTORS = {
    ACCEPT_ALL_BUTTON: "#acceptAllButton",
};

export class CookieBannerComponent {
    async attemptToClose(): Promise<void> {
        const { ACCEPT_ALL_BUTTON } = SELECTORS;
        const cookiesAlert = await browser.$(ACCEPT_ALL_BUTTON);
        if (await cookiesAlert.isDisplayed()) {
            await cookiesAlert.waitAndClick();
        }
    }
}
