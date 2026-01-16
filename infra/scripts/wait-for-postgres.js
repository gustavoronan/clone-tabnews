const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
}

function handleReturn(error, stdout) {
  if (stdout.search("accepting connections") === -1) {
    //stdout retorna -1 se nao encontrar e cai no if
    process.stdout.write(".");
    checkPostgres();
    return;
  }
  console.log(" \n 🟢 Postgres Pronto para conexao");
}
console.log("🔴 Aguardando conexao do postgres");
checkPostgres(); //inicia a funcao de checagem de conexao
