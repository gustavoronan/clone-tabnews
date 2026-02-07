import migrator from "models/migrators";
import { createRouter } from "next-connect";
import controller from "infra/controller.js";

const router = createRouter();
router.get(getHandler); //antigo metodo migrations
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  // const allowedMethods = ["GET"];
  // if (!allowedMethods.includes(request.method)) {
  //   return response.status(405).json({
  //     error: `Method "${request.method}" not allowed`,
  //   });
  // }
  const pendingMigrations = await migrator.listPendingMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations();
  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}
