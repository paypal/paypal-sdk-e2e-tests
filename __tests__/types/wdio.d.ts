declare namespace WebdriverIO {
    interface Element {
        waitAndClick: () => Promise<void>;
    }
    interface Browser {
        testUrl: () => Promise<string>;
    }
}
