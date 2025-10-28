import { redirect } from "next/navigation";

export default function ExportRedirectPage() {
  // Redirect to the main settings page anchor for export
  redirect("/settings#export");
}
