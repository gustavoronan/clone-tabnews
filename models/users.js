import database from "infra/database";
import password from "models/password.js";
import { ValidationError, NotFoundError } from "infra/errors.js";

async function findOneByUsername(username) {
  const userFound = runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
      SELECT 
        * 
      FROM
       users 
      WHERE 
        LOWER(username) = LOWER($1)
      LIMIT 1
        `,
      values: [username],
    });

    if (results.rowCount == 0) {
      throw new NotFoundError({
        message: "O UserName informado nao foi encontrado no sistema",
        action: "Verifique se o Username Esta digitado corretamente",
      });
    }

    return results.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueUser(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = runInsertQuery(userInputValues);

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
      INSERT INTO
      users 
      (username, email, password)
      VALUES 
      ($1, $2, $3)
      RETURNING * 
      `,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return results.rows[0];
  }

  return newUser;
}

async function update(username, userInputValues) {
  const currentUser = await findOneByUsername(username);
  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("username" in userInputValues) {
    await validateUniqueUser(userInputValues.username);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = {
    ...currentUser,
    ...userInputValues,
  }; //aqui estou fazendo o spread e pegando apenas os valores que dao match no update

  const updatedUser = await runUpdateQuery(userWithNewValues);
  return updatedUser;

  async function runUpdateQuery(userWithNewValues) {
    const results = await database.query({
      text: `UPDATE 
        users 
      SET 
        username = $2, email = $3, password = $4, updated_at = timezone('utc', now()) 
      WHERE 
        id = $1 
      RETURNING 
        *`,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });

    return results.rows[0];
  }
}

async function validateUniqueUser(username) {
  const results = await database.query({
    text: `
      SELECT 
        username 
      FROM
       users 
      WHERE 
        LOWER(username) = LOWER($1)
        `,
    values: [username],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O Username informado ja esta sendo utilizado",
      action: "Para esta operacao utilize outro Username",
    });
  }
}

async function validateUniqueEmail(email) {
  const results = await database.query({
    text: `
      SELECT 
        email 
      FROM
       users 
      WHERE 
        LOWER(email) = LOWER($1)
        `,
    values: [email],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado ja esta sendo utilizado",
      action: "Para esta operacao utilize outro email",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);

  userInputValues.password = hashedPassword;
}

const user = {
  create,
  findOneByUsername,
  update,
};

export default user;
