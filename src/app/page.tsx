import Image from "next/image";
import styles from "./page.module.css";
import { PrismaClient } from "@prisma/client";
import RatingTable from "@/components/RatingTable";

export async function getData() {
  const prisma = new PrismaClient();

  const comments = await prisma.comments.findMany({ take: 20 });

  return { comments };
}

export default async function Home() {
  const data = await getData();
  console.log("data", data);

  return (
    <main className={styles.main}>
      <div className="flex-container column-when-mobile-container">
        <RatingTable />
      </div>
    </main>
  );
}
