import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home | Village Square",
};

export default function Home() {
  return redirect("/dashboard/social");
}
