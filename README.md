# typescript-sdk

[![build](https://github.com/screenshotmax/typescript-sdk/actions/workflows/build.yaml/badge.svg)](https://github.com/screenshotmax/typescript-sdk/actions/workflows/build.yaml)
[![test](https://github.com/screenshotmax/typescript-sdk/actions/workflows/test.yaml/badge.svg)](https://github.com/screenshotmax/typescript-sdk/actions/workflows/test.yaml)

This is the official JavaScript & TypeScript SDK for the [ScreenshotMAX API](https://screenshotmax.com/).

It allows you to easily capture high-quality screenshots of any URL directly from your applications.
The SDK handles authentication, request signing, and provides a simple interface to integrate ScreenshotMAX’s powerful screenshot services into your TypeScript or JavaScript projects.

Get started in minutes. Just [sign up](https://screenshotmax.com) to receive your access and secret keys, import the client, and you’re ready to capture screenshots.”

The SDK client is synchronized with the latest [ScreenshotMAX API options](https://docs.screenshotmax.com/guides/start/introduction).


## Installation

```shell
npm install @screenshotmax/sdk --save
```

## Usage

Generate a screenshot URL without executing the request. Or download the screenshot. It is up to you: 
```javascript
import fs from "node:fs";
import { SDK } from "@screenshotmax/sdk";

// create API client 
const sdk = new SDK("<ACCESS_KEY>", "<SECRET_KEY>");

// set up options
sdk.screenshot.options({
  url: "https://example.com",
  format: "png"
});

// generate URL (https://api.screenshotmax.com/v1/screenshot?access_key=<ACCESS_KEY>&url=https://example.com&format=png)
const url = sdk.screenshot.getUrl();

// generate screenshot
const screenshot = await sdk.screenshot.fetch();

fs.writeFileSync("screenshot.jpg", Buffer.from(screenshot.data, "binary"));
```

## License 

`@screenshotmax/sdk` is released under [the MIT license](LICENSE).
