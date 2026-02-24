import user from "models/users";
import password from "models/password";
import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});
describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous User", () => {
    test("NonMatch User", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioNaoExiste",
        { method: "PATCH" },
      );
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        name: "NotFoundError",
        message: "O UserName informado nao foi encontrado no sistema",
        action: "Verifique se o Username Esta digitado corretamente",
        statusCode: 404,
      });
    });
  });

  test("Duplicated User ->", async () => {
    const user1Response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "user1",
        email: "user1@gmail.com",
        password: "senha123",
      }),
    });
    expect(user1Response.status).toBe(201);

    const user2Response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "user2",
        email: "user2@gmail.com",
        password: "senha123",
      }),
    });
    expect(user2Response.status).toBe(201);

    //////////////////////////////////////////////////////////////////////
    const response = await fetch("http://localhost:3000/api/v1/users/user2", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "user1",
      }),
    });
    expect(response.status).toBe(400);

    const responseBody = await response.json();
    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "O Username informado ja esta sendo utilizado",
      action: "Para esta operacao utilize outro Username",
      statusCode: 400,
    });
  });

  test("Duplicated email ->", async () => {
    const user1Response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "email1",
        email: "email1@gmail.com",
        password: "senha123",
      }),
    });
    expect(user1Response.status).toBe(201);

    const user2Response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "email2",
        email: "email2@gmail.com",
        password: "senha123",
      }),
    });
    expect(user2Response.status).toBe(201);

    //////////////////////////////////////////////////////////////////////
    const response = await fetch("http://localhost:3000/api/v1/users/email2", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "email1@gmail.com",
      }),
    });
    expect(response.status).toBe(400);

    const responseBody = await response.json();
    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "O email informado ja esta sendo utilizado",
      action: "Para esta operacao utilize outro email",
      statusCode: 400,
    });
  });

  test("Unique User ->", async () => {
    const uniqueResponse = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "unique",
        email: "unique@gmail.com",
        password: "senha123",
      }),
    });
    expect(uniqueResponse.status).toBe(201);

    const response = await fetch("http://localhost:3000/api/v1/users/unique", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "unique2",
      }),
    });
    expect(response.status).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toEqual({
      id: responseBody.id,
      username: "unique2",
      email: "unique@gmail.com",
      password: responseBody.password,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });

    expect(uuidVersion(responseBody.id)).toBe(4);
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
  });

  test("Unique Email ->", async () => {
    const uniqueResponse = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "uniqueEmail",
        email: "uniqueEmail@gmail.com",
        password: "senha123",
      }),
    });
    expect(uniqueResponse.status).toBe(201);

    const response = await fetch(
      "http://localhost:3000/api/v1/users/uniqueEmail",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "uniqueEmail2@gmail.com",
        }),
      },
    );
    expect(response.status).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toEqual({
      id: responseBody.id,
      username: "uniqueEmail",
      email: "uniqueEmail2@gmail.com",
      password: responseBody.password,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });

    expect(uuidVersion(responseBody.id)).toBe(4);
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
  });

  test("New Password ->", async () => {
    const uniqueResponse = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "newPass",
        email: "newPass@gmail.com",
        password: "senha123",
      }),
    });
    expect(uniqueResponse.status).toBe(201);

    const response = await fetch("http://localhost:3000/api/v1/users/newPass", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: "newPassword",
      }),
    });
    expect(response.status).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toEqual({
      id: responseBody.id,
      username: "newPass",
      email: "newPass@gmail.com",
      password: responseBody.password,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });

    expect(uuidVersion(responseBody.id)).toBe(4);
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    const userInDatabase = await user.findOneByUsername("newPass");
    const correctPasswordMatch = await password.compare(
      "newPassword",
      userInDatabase.password,
    );
    expect(correctPasswordMatch).toBe(true);

    const incorrectPasswordMatch = await password.compare(
      "senha123",
      userInDatabase.password,
    );

    expect(incorrectPasswordMatch).toBe(false);
  });
});
