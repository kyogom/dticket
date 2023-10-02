import Link from "next/link";

export default function Home() {
  const { CLIENT_ID, OAUTH_ENDPOINT, VERCEL_URL } = process.env;
  const scope = encodeURIComponent("identify email");

  // FIXME: domainに依存
  const redirect_uri = encodeURIComponent(
    "https://dticket.vercel.app/oauth/callback"
  );

  const link = `${OAUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`;
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
