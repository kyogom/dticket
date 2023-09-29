import discord from "./discord.svg";
import Image from "next/image";
import { postAuthCode } from "@/lib/fetch";

const Callback = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { code, guild_id } = searchParams;
  if (typeof code !== "string" && typeof guild_id !== "string") {
    return <>Authentication Failed {`code: ${code}, guild_id: ${guild_id}`}</>;
  }
  try {
    await postAuthCode({ code: String(code), guild_id: String(guild_id) });
  } catch (error) {
    return <>Authentication Failed {`code: ${code}, guild_id: ${guild_id}`}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center p-8 bg-white rounded shadow">
        <Image src={discord} alt="Discord Logo" className="w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold text-gray-600">DiscordTicket</h1>
        <p className="text-gray-600">Discordとの連携が完了しました</p>
        <p className="text-red-600">※本来、ログインが必須</p>
      </div>
    </div>
  );
};

export default Callback;
