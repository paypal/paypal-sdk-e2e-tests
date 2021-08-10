import { CookieBannerComponent } from "./cookie-banner-component";

export const isLoginFormReady = async (
    expectedPaths: string[] = ["/signin", "/checkoutnow"]
) => {
    let url = await browser.getUrl();

    await browser.waitUntil(async () => {
        url = await browser.getUrl();
        const { pathname } = new URL(url);

        return expectedPaths.some((supportedPath) => {
            return pathname.startsWith(supportedPath);
        });
    });
};
export class UnifiedLoginComponent {
    async loginWithEmailAndPassword({
        email = process.env.BUYER_EMAIL,
        password = process.env.BUYER_PASSWORD,
    }: {
        email?: string;
        password?: string;
    } = {}): Promise<void> {
        if (!email || !password) throw new Error("Email and Password required");
        await isLoginFormReady();

        // consider the page ready after js is loaded
        const javascriptEnabled = await browser.$("html.js");
        javascriptEnabled.waitForDisplayed();

        const emailInput = await browser.$("#email");
        await emailInput.waitForDisplayed();
        await emailInput.setValue(email);

        // retry entering email if it fails the first time
        if (!(await emailInput.getValue())) {
            await emailInput.setValue(email);
        }

        const nextButton = await browser.$("#btnNext");
        await nextButton.waitAndClick();

        await browser.waitUntil(async () => {
            const passwordInput = await browser.$("#password");

            // use the login with password option on the One Time code screen
            const secondaryLink = await browser.$(".secondaryLink a");

            if (await passwordInput.isDisplayed()) {
                return true;
            } else if (await secondaryLink.isDisplayed()) {
                await secondaryLink.waitAndClick();
            }
            return false;
        });

        const passwordInput = await browser.$("#password");
        await passwordInput.waitForDisplayed();
        await passwordInput.setValue(password);

        const cookieBanner = new CookieBannerComponent();
        await cookieBanner.attemptToClose();

        const loginButton = await browser.$("#btnLogin");
        await loginButton.waitAndClick();
    }

    async isLoggedIn(
        expectedPaths: string[] = ["/checkoutweb", "/webapps/hermes"]
    ): Promise<boolean> {
        async function isExpectedPath(): Promise<boolean> {
            const url = await browser.getUrl();
            const { pathname } = new URL(url);

            return expectedPaths.some((supportedPath) => {
                return pathname.startsWith(supportedPath);
            });
        }

        await browser.waitUntil(async () => {
            return await isExpectedPath();
        });

        const cookieBanner = new CookieBannerComponent();
        await cookieBanner.attemptToClose();

        return await isExpectedPath();
    }
}
