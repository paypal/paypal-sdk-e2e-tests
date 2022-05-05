declare namespace WebdriverIO {
    interface Element {
        waitAndClick: () => Promise<void>;
    }
    interface Browser {
        testUrl: (defaultUrl: string) => Promise<string>;
    }
}
