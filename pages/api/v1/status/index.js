import database from "infra/database.js";

async function status(request, response) {
  //const updatedAt = Date.now();
  const updatedAt = new Date().toISOString();
  const query = await database.query(
    "SELECT (SELECT version()) AS version, (SELECT COUNT (*)::int FROM pg_stat_activity) as pgUsers, (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') AS pgConnections",
  );
  console.log(query.rows);
  response.status(200).json({
    updated_at: updatedAt,
    query: query.rows,
  });
}
export default status;
