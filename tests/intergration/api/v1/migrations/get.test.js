import database from "infra/database.js";

test("GET to /api/v1/migrations should return to 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
  console.log(responseBody);
  const jestAmbient = process.env.NODE_ENV;
  if (jestAmbient == "test") {
    console.log("O ambiente em que o Jest esta rodando eh de Testes");
    console.log(process.POSTGRES_DB);
  }
});
