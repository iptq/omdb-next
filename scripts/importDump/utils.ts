import { Presets, SingleBar } from "cli-progress";
import { Prisma, PrismaClient } from "../../old-db/generated/prisma-client-js";
import { ExpressionBuilder, InsertObject } from "kysely";
import { db } from "../../src/db";
import { DB } from "../../src/db/types";

export const oldClient = new PrismaClient();
export const newClient = db;

export type EB<T extends keyof DB> = ExpressionBuilder<DB, T>;
const chunkSize = 100;

type PrimaryKeyType = string | number;

export interface TemplateImportOpts {
  destTableName: keyof DB;
  srcModelName: string;
  destPrimaryKey: string;
  srcPrimaryKey: PrimaryKeyType;
  convert: (_: object) => object;
  onDup: (eb) => void;
}

export async function templateImport({
  destTableName,
  destPrimaryKey,
  srcModelName,
  srcPrimaryKey,
  onDup,
  convert,
}: TemplateImportOpts) {
  const bar = new SingleBar({}, Presets.shades_classic);
  const howMany = await oldClient[srcModelName].count();
  console.log(`Importing ${howMany} comments...`);
  bar.start(howMany, 0);

  let cursor;
  while (true) {
    const findOpts = {
      take: chunkSize,
      orderBy: { [srcPrimaryKey]: "asc" },
      skip: undefined,
      cursor: undefined,
    };

    if (cursor) {
      findOpts.skip = 1;
      findOpts.cursor = { [srcPrimaryKey]: cursor };
    }

    const chunk = await oldClient[srcModelName].findMany(findOpts);
    if (chunk.length === 0) break;

    const newRecords: InsertObject<DB, tableName>[] = [];

    await Promise.all(
      chunk.map(async (oldObject) => {
        newRecords.push(convert(oldObject));
      }),
    );

    // console.log("new records", newRecords);

    try {
      await newClient.insertInto(destTableName).values(newRecords).onDuplicateKeyUpdate(onDup).execute();
    } catch (e) {
      console.log();
      console.error("error", e, JSON.stringify(e));
      console.log();
    }

    bar.increment(chunk.length);
    const lastComment = chunk[chunk.length - 1];
    cursor = lastComment[srcPrimaryKey];
  }

  bar.stop();
  console.log("Imported comments.");
}
