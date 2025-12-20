test("GET to /api/v1/status should return to 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json(); //variavel aguarda resposta json
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString(); // verifica se updated_at eh uma data iso
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt); //verifica se as datas coincidem, variavel e corpo

  expect(responseBody.dependencies.database.version).toEqual("16.0");
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  expect(responseBody.dependencies.database.oppened_connections).toEqual(1);
});
