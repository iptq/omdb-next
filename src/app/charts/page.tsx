import { Metadata } from "next";
import Chart from "./Chart";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  return (
    <>
      <Chart />
    </>
  );
}
