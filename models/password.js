import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getRoundsNumber();
  const pepper = process.env.PASSWORD_PEPPER;

  return await bcryptjs.hash(password + pepper, rounds);
}

function getRoundsNumber() {
  let rounds = 1;

  if (process.env.NODE_ENV == "production") {
    rounds = 14;
  }

  return rounds;
}

async function compare(providedPassword, storedPassword) {
  const pepper = process.env.PASSWORD_PEPPER;
  return await bcryptjs.compare(providedPassword + pepper, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
