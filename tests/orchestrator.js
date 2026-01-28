import retry from "async-retry";
import database from "infra/database.js";

async function waitForAllServices() {
  await awaiForWebServer();
  async function awaiForWebServer() {
    return retry(fecthStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });
    async function fecthStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (!response.ok) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public");
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};
export default orchestrator;
