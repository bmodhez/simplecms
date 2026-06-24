import { PageForm } from "@/components/admin/PageForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Page" };

export default function NewPagePage() {
  return <PageForm />;
}
