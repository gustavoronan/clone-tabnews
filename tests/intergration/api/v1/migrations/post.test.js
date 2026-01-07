import database from "infra/database.js";
beforeAll(cleanDataBase)
async function cleanDataBase() {
  await database.query("drop schema public cascade; create schema public")
}
test("POST to /api/v1/migrations should return to 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(200);
  const responseBody = await response.json();
    const migrationsRowsCount = await database.query(
   "SELECT COUNT(*)::int as qtMigrations FROM pgmigrations",
  );
  console.log(migrationsRowsCount.rows[0]);
  const migrationName = responseBody.map(item => item.name);
  expect(migrationName.length).toBeGreaterThan(0);
  expect(Array.isArray(responseBody)).toBe(true);
});
