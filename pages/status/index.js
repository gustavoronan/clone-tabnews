import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  //console.log(response.isLoading);
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = [];
  if (!isLoading && data) {
    updatedAtText = [
      {
        Atualizado: new Date(data.updated_at).toLocaleString("pt-BR"),
        Versao: data.dependencies.database.version,
        MaxConnections: data.dependencies.database.max_connections,
        Conexoes: data.dependencies.database.oppened_connections,
      },
    ];
  }

  return (
    <div>
      Dados da API:
      {updatedAtText.map((item, index) => (
        <div key={index}>
          <div>Atualizado: {item.Atualizado}</div>
          <div>Versão: {item.Versao}</div>
          <div>Conexões Abertas: {item.Conexoes}</div>
        </div>
      ))}
    </div>
  );
}
