import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/users";

const router = createRouter();
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;
  console.log(userInputValues);

  const newUser = await user.create(userInputValues);
  console.log("New User:: =-=-", newUser);
  return response.status(201).json(newUser);
}
