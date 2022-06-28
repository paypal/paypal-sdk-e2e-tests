# paypal-sdk-e2e-tests

> Automation tests for the PayPal JS SDK

[![BrowserStack Tests](https://github.com/paypal/paypal-sdk-e2e-tests/actions/workflows/main.yml/badge.svg)](https://github.com/paypal/paypal-sdk-e2e-tests/actions/workflows/main.yml)

This library uses WebDriver.io and BrowserStack to run end-to-end tests against websites using the JS SDK.

## Quick Start

1. `npm install`
2. `npm test`

## Features

There are two different ways to run the test suite:

1. `npm test` - local runner that uses Chrome
2. `npm run test-browserstack` - uses BrowserStack and requires a username and access key

### Setting Up the `.env` File

BrowserStack requires a username and access key to run tests. Find your credentials using [BrowserStack.com](https://www.browserstack.com/).

In addition to BrowserStack credentials, you will need PayPal login credentials for the buttons tests to work in your script environment. For example, you will need `BUYER_EMAIL=<stage email>` and `BUYER_PASSWORD=<stage password>` for use with a stage script.

When you have your credentials ready, run the following command:

```bash
npm run save-credentials
```

This will save your credentials to a local .env file, which is ignored by git. This .env file gets loaded by the app and will use the credentials in it to connect to BrowserStack. This is designed for local development. CI tools like GitHub Actions should directly set the BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY, BUYER_EMAIL, and BUYER_PASSWORD environment variables.

### Running a single test

By default, these commands run all the tests in the test suite. To run a single test, pass the test name as an argument like so:

```bash
npm test -- --spec paylater-button-click.test.ts
```

### Running against a custom URL

The tests run against the following default urls:

-   buttons: https://paypal.github.io/paypal-sdk-e2e-tests/components/buttons/buttons.html
-   messages: https://paypal.github.io/paypal-sdk-e2e-tests/components/messages/messages.html

These urls can be overriden using the `BUTTONS_URL` and `MESSAGES_URL` environment variables to test the JS SDK on different websites. For example, the button tests can be run against the react-paypal-js storybook demo:

```bash
BUTTONS_URL="https://paypal.github.io/react-paypal-js/iframe.html?id=example-paypalbuttons--default&args=&viewMode=story" npm test -- --spec button
```

### BrowserStack local testing from the command line

BrowserStack local testing can be enabled from the command line by adding `LOCAL_TESTING=true` to `npm run test-browserstack` or `npm run test-browserstack-german`:

```bash
LOCAL_TESTING=true npm run test-browserstack
```

This is useful for running tests using `localhost` and/or a test page that uses a custom JS SDK test environment:

```bash
BUTTONS_URL="https://paypal.github.io/paypal-sdk-e2e-tests/components/buttons/buttons.html?client-id=<client-id>&sdkBaseURL=<js-sdk-test-env-url>" LOCAL_TESTING=true npm run test-browserstack
```
