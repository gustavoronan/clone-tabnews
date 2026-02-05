import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous User", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        message: "Metodo nao permitido para este endpoint",
        name: "MethodNotAllowed",
        action: "Verifique o metodo HTTP enviado para este endpoint",
        statusCode: 405,
      });
    });
  });
});
