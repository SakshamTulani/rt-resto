import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app";

describe("Health Check", () => {
  it("GET /health should return 200 OK", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: "ok",
        timestamp: expect.any(String),
      }),
    );
  });
});
