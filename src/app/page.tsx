import Image from "next/image";
import styles from "./page.module.css";
import { PrismaClient } from "@prisma/client";
import RatingTable from "@/components/RatingTable";

export default async function Home() {
  return (
    <main className={styles.main}>
      <div className="flex-container column-when-mobile-container">
        <RatingTable />
      </div>
    </main>
  );
}
