/**
 * Создание БД stellazh_komplekt (если ещё нет).
 * Требует psql в PATH и PostgreSQL на localhost.
 *
 *   node scripts/setup-db.mjs
 */

import { execSync } from "child_process";

const dbName = "stellazh_komplekt";
const user = process.env.PGUSER ?? "postgres";
const host = process.env.PGHOST ?? "127.0.0.1";
const port = process.env.PGPORT ?? "5432";

try {
  execSync(`psql -U ${user} -h ${host} -p ${port} -tc "SELECT 1 FROM pg_database WHERE datname='${dbName}'"`, {
    stdio: ["inherit", "pipe", "inherit"],
    env: process.env,
  });
} catch {
  console.log("psql не найден или нет доступа — создайте БД вручную:");
  console.log(`  CREATE DATABASE ${dbName};`);
  process.exit(1);
}

try {
  const out = execSync(
    `psql -U ${user} -h ${host} -p ${port} -tc "SELECT 1 FROM pg_database WHERE datname='${dbName}'"`,
    { encoding: "utf-8", env: process.env },
  ).trim();

  if (out === "1") {
    console.log(`БД ${dbName} уже существует`);
  } else {
    execSync(
      `psql -U ${user} -h ${host} -p ${port} -c "CREATE DATABASE ${dbName};"`,
      { stdio: "inherit", env: process.env },
    );
    console.log(`БД ${dbName} создана`);
  }

  console.log(`
Дальше:
  npm run db:migrate
  npm run db:seed-content
  npm run dev
`);
} catch (e) {
  console.error("Ошибка:", e.message);
  console.log(`
Создайте БД вручную (pgAdmin или psql):
  CREATE DATABASE ${dbName};
`);
  process.exit(1);
}
