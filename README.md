# ScreenshotMAX TypeScript SDK

[![build](https://github.com/screenshotmax/typescript-sdk/actions/workflows/build.yaml/badge.svg)](https://github.com/screenshotmax/typescript-sdk/actions/workflows/build.yaml)
[![test](https://github.com/screenshotmax/typescript-sdk/actions/workflows/test.yaml/badge.svg)](https://github.com/screenshotmax/typescript-sdk/actions/workflows/test.yaml)

This is the official JavaScript & TypeScript SDK for the [ScreenshotMAX API](https://screenshotmax.com/).

It allows you to easily capture high-quality screenshots of any URL directly from your applications.
The SDK handles authentication, request signing, and provides a simple interface to integrate ScreenshotMAX’s powerful screenshot services into your TypeScript or JavaScript projects.

Get started in minutes. Just [sign up](https://screenshotmax.com) to receive your access and secret keys, import the client, and you’re ready to capture screenshots.”

The SDK client is synchronized with the latest [ScreenshotMAX API options](https://docs.screenshotmax.com/guides/start/introduction).


## Installation

```shell
npm install @screenshotmax/sdk
```

## Usage

Use the SDK to generate signed or unsigned URLs for screenshots, PDFs, web scraping, or animated screenshot—without executing the request. Or fetch and download the result directly. You have full control over when and how each capture runs.

### Screenshot example
```typescript
import fs from "node:fs";
import { SDK } from "@screenshotmax/sdk";

// create API client 
const sdk = new SDK("<ACCESS_KEY>", "<SECRET_KEY>");

// set up options
sdk.screenshot.setOptions({
  url: "https://example.com",
  format: "png"
});

// generate URL (https://api.screenshotmax.com/v1/screenshot?url=https%3A%2F%2Fexample.com&image_width=1280&image_height=720&format=png&image_quality=80&access_key=<ACCESS_KEY>&signature=370f5b161bc59eed13b76........1f778635d7fc595dbab12)
const url = sdk.screenshot.getUrl();

// generate screenshot
const result = await sdk.screenshot.fetch();

fs.writeFileSync("screenshot.png", Buffer.from(result.data, "binary"));
```

### Web scraping example
```typescript
import fs from "node:fs";
import { SDK } from "@screenshotmax/sdk";

// create API client 
const sdk = new SDK("<ACCESS_KEY>", "<SECRET_KEY>");

// set up options
sdk.scrape.setOptions({
  url: "https://example.com",
  format: "html",
});

const result = await sdk.scrape.fetch();

fs.writeFileSync("scrape.html", result.data);
```

### PDF generation example
```typescript
import fs from "node:fs";
import { SDK } from "@screenshotmax/sdk";

// create API client 
const sdk = new SDK("<ACCESS_KEY>", "<SECRET_KEY>");

// set up options and scrape content (chaining)
const result = await sdk.pdf
  .setOptions({
    url: "https://example.com",
    paper_format: "letter",
  })
  .fetch();

fs.writeFileSync("pdf.pdf", Buffer.from(result.data, "binary"));
```

### Scheduled task example

```typescript
import { SDK } from "@screenshotmax/sdk";

// create API client 
const sdk = new SDK("<ACCESS_KEY>", "<SECRET_KEY>");

// get all tasks from account
const tasks = await sdk.task.getTasks();
// {
//   tasks: [
//     {
//       id: 5678133109850112,
//       name: 'My cron test',
//       api: 'screenshot',
//       query: 'url=https%3A%2F%2Fexample.com',
//       frequency: 'every_day',
//       crontab: '25 13 * * *',
//       timezone: 'Etc/UTC',
//       enabled: true,
//       created: 1747229104,
//       last_run: 1748438712,
//       runs: 16
//     }
//   ]
// }
```

## License

`@screenshotmax/sdk` is released under [the MIT license](LICENSE).
