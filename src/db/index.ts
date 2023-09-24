import { DB } from "./types"; // this is the Database interface we defined earlier
import { createPool } from "mysql2"; // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from "kysely";

// https://dev.to/noclat/fixing-too-many-connections-errors-with-database-clients-stacking-in-dev-mode-with-next-js-3kpm
function registerService<T>(name: string, initFn: () => T): T {
  if (process.env.NODE_ENV === "development") {
    if (!(name in global)) {
      global[name] = initFn();
    }
    return global[name];
  }
  return initFn();
}

// import { config } from "dotenv";
// config();
// config({ path: ".env.local", override: true });

const dialect = new MysqlDialect({
  pool: createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 16,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = registerService(
  "db",
  () =>
    new Kysely<DB>({
      dialect,
      log: (event) => {
        if (event.level === "error") {
          console.log(event.query.sql);
          console.log(event.query.parameters);
        }
      },
    }),
);
