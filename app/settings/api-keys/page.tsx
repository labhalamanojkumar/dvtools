import { redirect } from "next/navigation";

export default function ApiKeysRedirectPage() {
  // Redirect to the main settings page anchor
  redirect("/settings#api-keys");
}
