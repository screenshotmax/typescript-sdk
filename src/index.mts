import {APIClient} from "./client.mjs";
import {DeviceService} from "./services/device.mjs";
import {PDFService} from "./services/pdf.mjs";
import {ScrapeService} from "./services/scrape.mjs";
import {ScreencastService} from "./services/screencast.mjs";
import {ScreenshotService} from "./services/screenshot.mjs";
import {TaskService} from "./services/task.mjs";
import {UsageService} from "./services/usage.mjs";

export class SDK {
  public screenshot: ScreenshotService;
  public screencast: ScreencastService;
  public scrape: ScrapeService;
  public pdf: PDFService;
  public task: TaskService;
  public usage: UsageService;
  public device: DeviceService;

  constructor(accessKey: string, secretKey: string) {
    const client = new APIClient(accessKey, secretKey);

    this.screenshot = new ScreenshotService(client);
    this.screencast = new ScreencastService(client);
    this.scrape = new ScrapeService(client);
    this.pdf = new PDFService(client);
    this.task = new TaskService(client);
    this.usage = new UsageService(client);
    this.device = new DeviceService(client);
  }
}
