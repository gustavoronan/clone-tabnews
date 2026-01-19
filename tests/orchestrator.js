import retry from "async-retry";

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

export default {
  waitForAllServices,
};
