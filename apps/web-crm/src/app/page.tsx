import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  return (
    <div style={{ padding: 40, fontFamily: "monospace" }}>
      <h1>SentraCX — Session Debug</h1>
      <h2>Logged in as: {session?.user?.name ?? "(no name claim)"}</h2>

      <form
        action={async () => {
          "use server";
          await signOut({ redirect: false });
          redirect(
            `${process.env.AUTH_ISSUER}connect/logout?post_logout_redirect_uri=${encodeURIComponent("https://localhost:3005/")}`,
          );
        }}
      >
        <button type="submit" style={{ padding: "8px 16px", marginBottom: 20 }}>
          Log out
        </button>
      </form>

      <h3>systems claim:</h3>
      <pre>{JSON.stringify(session?.systems, null, 2)}</pre>
      <h3>Full session object:</h3>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
