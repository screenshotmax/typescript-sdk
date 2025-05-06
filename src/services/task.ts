import type {APIClient} from "../client";
import type {paths} from "../types";

export class TaskService {
  public path = "/v1/tasks" as const;

  constructor(private client: APIClient) { }

  getTasks(): Promise<string> {
    return this.client.get<string>(this.path);
  }

  getTask(taskId: number): Promise<string> {
    return this.client.get<string>(`${this.path}/${taskId}`);
  }

  createTask(
    options: Omit<
      NonNullable<
        paths[this["path"]]["post"]["requestBody"]
      >["content"]["application/json"],
      "access_key"
    >,
  ): Promise<string> {
    return this.client.post<string>(this.path, options);
  }

  deleteTask(taskId: number): Promise<string> {
    return this.client.delete<string>(`${this.path}/${taskId}`);
  }

  updateTask(
    taskId: number,
    options: Omit<
      NonNullable<
        paths["/v1/tasks/{id}"]["patch"]["requestBody"]
      >["content"]["application/json"],
      "access_key"
    >,
  ): Promise<string> {
    return this.client.patch<string>(`${this.path}/${taskId}`, options);
  }
}
