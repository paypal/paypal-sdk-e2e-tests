export class CookieBannerComponent {
    async attemptToClose(): Promise<void> {
        const cookiesAlert = await browser.$("#acceptAllButton");
        if (await cookiesAlert.isDisplayed()) {
            await cookiesAlert.waitAndClick();
        }
    }
}
