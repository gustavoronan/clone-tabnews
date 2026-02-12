import orchestrator from "tests/orchestrator.js";
import database from "infra/database";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});
describe("POST /api/v1/users", () => {
  describe("Anonymous User", () => {
    test("With Unic and Valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "gustavoronan",
          email: "gustavo@gmail.com",
          password: "senha123",
        }),
      });

      const users = await database.query("SELECT * FROM users");
      console.log("========= User Test", users.rows);

      expect(response.status).toBe(201);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "gustavoronan",
        email: "gustavo@gmail.com",
        password: "senha123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    /////////////////////////////////////////////////////////////////////////

    test("Duplicated Email", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "userduplicado",
          email: "emailduplicado@gmail.com",
          password: "senha123",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "nomeduplicado",
          email: "Emailduplicado@gmail.com",
          password: "senha123",
        }),
      });
      expect(response2.status).toBe(400);
      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O email informado ja esta sendo utilizado",
        action: "Para se cadastrar utilize outro email",
        statusCode: 400,
      });
    });

    test("Duplicated User ->", async () => {
      const response3 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "userduplicado",
          email: "nomeduplicado@gmail.com",
          password: "senha123",
        }),
      });
      const response3Body = await response3.json();
      expect(response3Body).toEqual({
        name: "ValidationError",
        message: "O Username informado ja esta sendo utilizado",
        action: "Para se cadastrar utilize outro Username",
        statusCode: 400,
      });
    });
  });
});
