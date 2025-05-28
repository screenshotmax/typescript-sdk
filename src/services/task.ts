import type {APIClient} from "../client";
import type {paths} from "../types";

export class TaskService {
  public path = "/v1/tasks" as const;

  constructor(private client: APIClient) { }

  async getTasks(): Promise<string> {
    return (await this.client.get<string>(this.path)).data;
  }

  async getTask(taskId: number): Promise<string> {
    return (await this.client.get<string>(`${this.path}/${taskId}`)).data;
  }

  async createTask(
    options: Omit<
      NonNullable<
        paths[this["path"]]["post"]["requestBody"]
      >["content"]["application/json"],
      "access_key"
    >,
  ): Promise<string> {
    return (await this.client.post<string>(this.path, options)).data;
  }

  async deleteTask(taskId: number): Promise<void> {
    return this.client.delete<void>(`${this.path}/${taskId}`);
  }

  async updateTask(
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
