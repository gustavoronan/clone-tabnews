import { InternalServerError, MethodNotAllowed } from "infra/errors";

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });
  console.error(publicErrorObject);

  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowed();
  response.status(publicErrorObject.statusCode).json(publicErrorObject); //essa funcao
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler, //se o metodo nao coincidir com o get passado a cima chama a funcao
    onError: onErrorHandler,
  },
};
export default controller;
