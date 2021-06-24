# paypal-sdk-e2e-tests

> Automation tests for the PayPal JS SDK

This library uses WebDriver.io and BrowserStack to run end-to-end tests against websites using the JS SDK.

## Quick Start

1. `npm install`
2. `npm test`

## Features

There are two different ways to run the test suite:

1. using Chrome with the local runner: `npm test`
2. using BrowserStack: `npm run test-browserstack`

### Running a single test

By default, these commands run all the tests in the test suite. To run a single test, pass the test name as an argument like so:

```bash
npm test -- --spec paylater-button-click.test.ts
```

### Running against a custom URL

The tests run against the following website by default: https://developer.paypal.com/demo/checkout/#/pattern/client.

This url can be overriden using the `TEST_URL` environment variable to test the JS SDK on different websites:

```bash
TEST_URL="https://paypal.github.io/react-paypal-js/iframe.html?id=example-paypalbuttons--default&args=&viewMode=story" npm test
```
