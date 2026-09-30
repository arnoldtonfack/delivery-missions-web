import { redirect } from "next/navigation";

/** `/` est aiguillé par `src/proxy.ts` ; repli si le proxy ne s'applique pas. */
export default function Home(): never {
  redirect("/login");
}
