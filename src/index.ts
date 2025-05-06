import { APIClient } from "./client";
import { DeviceService } from "./services/device";
import { PDFService } from "./services/pdf";
import { ScrapeService } from "./services/scrape";
import { ScreencastService } from "./services/screencast";
import { ScreenshotService } from "./services/screenshot";
import { TaskService } from "./services/task";
import { UsageService } from "./services/usage";

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
