import Image from "next/image";
import { Markets } from "./components/Markets";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Markets />
    </main>
  );
}
