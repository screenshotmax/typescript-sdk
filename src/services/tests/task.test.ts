import {patch} from "axios";
import {type Mock, beforeEach, describe, expect, it, vi} from "vitest";
import type {APIClient} from "../../client";
import {TaskService} from "../task";

describe("TaskService", () => {
  let client: APIClient;
  let service: TaskService;

  beforeEach(() => {
    client = {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
    } as unknown as APIClient;
    service = new TaskService(client);
  });

  it("should call client.get with correct parameters", async () => {
    (client.get as unknown as Mock).mockResolvedValue({data: "get tasks"});

    const result = await service.getTasks();

    expect(client.get).toHaveBeenCalledWith(service.path);
    expect(result).toBe("get tasks");
  });

  it("should call client.get with correct parameters", async () => {
    const taskId = 500_00_001;
    (client.get as unknown as Mock).mockResolvedValue({
      data: "get task"
    });

    const result = await service.getTask(taskId);

    expect(client.get).toHaveBeenCalledWith(`${service.path}/${taskId}`);
    expect(result).toBe("get task");
  });

  it("should call client.post with correct parameters", async () => {
    const body = {
      name: "test",
      api: "screenshot",
      query: "url=https://example.com",
      frequency: "every_day",
      timezone: "Etc/UTC",
      enabled: true,
    } as const;
    (client.post as unknown as Mock).mockResolvedValue({data: body});

    const result = await service.createTask(body);

    expect(client.post).toHaveBeenCalledWith(service.path, body);
    expect(result).toBe(body);
  });

  it("should call client.patch with correct parameters", async () => {
    const taskId = 500_00_001;
    const body = {
      name: "test",
      api: "screenshot",
      query: "url=https://example.com",
      frequency: "every_day",
      timezone: "Etc/UTC",
      enabled: true,
    } as const;

    (client.patch as unknown as Mock).mockResolvedValue(body);

    const result = await service.updateTask(taskId, body);

    expect(client.patch).toHaveBeenCalledWith(
      `${service.path}/${taskId}`,
      body,
    );
    expect(result).toBe(body);
  });

  it("should call client.delete with correct parameters", async () => {
    const taskId = 500_00_001;
    (client.delete as unknown as Mock).mockResolvedValue(undefined);

    const result = await service.deleteTask(taskId);

    expect(client.delete).toHaveBeenCalledWith(`${service.path}/${taskId}`);
    expect(result).toBeUndefined();
  });
});
