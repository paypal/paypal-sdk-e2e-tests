declare namespace WebdriverIO {
    interface Element {
        waitAndClick: () => Promise<void>;
    }
    interface Browser {
        buttonsUrl: (defaultUrl: string) => Promise<string>;
    }
}
