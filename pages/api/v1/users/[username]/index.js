import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/users";

const router = createRouter();
router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;
  const foundUser = await user.findOneByUsername(username);
  return response.status(200).json(foundUser);
}

async function patchHandler(request, response) {
  const username = request.query.username;
  console.log(username);
  const userInputValues = request.body;
  const updatedUser = await user.update(username, userInputValues);

  return response.status(200).json(updatedUser);
}
