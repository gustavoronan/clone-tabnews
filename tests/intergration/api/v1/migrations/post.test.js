import database from "infra/database.js";
beforeAll(cleanDataBase);
async function cleanDataBase() {
  await database.query("drop schema public cascade; create schema public");
}
test("POST to /api/v1/migrations should return to 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);
  const response1Body = await response1.json();

  expect(Array.isArray(response1Body)).toBe(true);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);
  const response2Body = await response2.json();
  expect(response2Body.length).toBe(0);
});
