import discord from "./discord.svg";
import Image from "next/image";
import { postAuthCode } from "@/lib/fetch";
import Link from "next/link";

const Callback = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { code, guild_id } = searchParams;
  if (typeof code !== "string" || typeof guild_id !== "string") {
    return <>Authentication Failed {`code: ${code}, guild_id: ${guild_id}`}</>;
  }
  const { message } = await postAuthCode({ code, guild_id });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center p-8 bg-white rounded shadow">
        <Image src={discord} alt="Discord Logo" className="w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold text-gray-600">DiscordTicket</h1>
        <p className="text-gray-600">{message}</p>
        <Link
          href={
            "https://discord.com/oauth2/authorize?client_id=1157162840784908389&scope=bot&permissions=8"
          }
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Next, invite bot.
        </Link>
      </div>
    </div>
  );
};

export default Callback;
