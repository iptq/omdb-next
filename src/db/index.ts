import { DB } from "./types"; // this is the Database interface we defined earlier
import { createPool } from "mysql2"; // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from "kysely";

const dialect = new MysqlDialect({
  pool: createPool({
    database: "omdb",
    host: "localhost",
    user: "root",
    password: "example",
    port: 3306,
    connectionLimit: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
  log: (event) => {
    if (event.level === "query") {
      console.log(event.query.sql);
      console.log(event.query.parameters);
    }
  },
});
