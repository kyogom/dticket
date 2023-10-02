import Link from "next/link";

export default function Home() {
  const { OAUTH_ENDPOINT, CLIENT_ID } = process.env;
  const scope = "identify%20email";
  const link = `${OAUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${"https%3A%2F%2Fdticket.vercel.app%2Foauth%2Fcallback"}&response_type=code&scope=${scope}`;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link
        href={link}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Discord Oauth
      </Link>
    </main>
  );
}
