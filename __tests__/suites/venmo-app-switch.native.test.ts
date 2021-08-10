import { expect } from "chai";
import { ButtonsComponent } from "../components/buttons-component";
import { WEBSITE_FOR_VENMO_PROD_TESTING } from "../constants";

describe("venmo app switch on android", () => {
    it("clicking on venmo button should app switch", async () => {
        // launch the venmo app and verify initial state
        let appActivity = await driver.getCurrentActivity();
        expect(appActivity).to.equal(
            "com.venmo.controller.welcome.WelcomeContainer"
        );

        const chromePackage = "com.android.chrome";
        const chromeActivity = "com.google.android.apps.chrome.Main";

        // start chrome and switch to web context
        await driver.startActivity(chromePackage, chromeActivity);
        await driver.waitUntil(async () => {
            const contexts = await driver.getContexts();
            return contexts && contexts.length > 1;
        });

        driver.switchContext("WEBVIEW_chrome");

        await browser.url(WEBSITE_FOR_VENMO_PROD_TESTING);

        const paypalButtonComponent = new ButtonsComponent("venmo");
        await paypalButtonComponent.click();

        driver.switchContext("NATIVE_APP");

        const openWithVenmoOption = await $(
            'android=new UiSelector().text("Venmo").className("android.widget.TextView")'
        );

        await openWithVenmoOption.click();

        const justOnceConfirmation = await $(
            'android=new UiSelector().text("Just once").className("android.widget.Button")'
        );
        await justOnceConfirmation.click();

        await driver.pause(3000);

        appActivity = await driver.getCurrentActivity();
        expect(appActivity).to.equal(
            "com.venmo.controller.login.LoginContainer"
        );
    });
});
