function status(request, response) {
  response.status(200).json({
    chave: "Tudo Okay",
  });
}
export default status;
