import discord from "./discord.svg";
import Image from "next/image";
import { postAuthCode } from "@/lib/fetch";

const Callback = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { code, guild_id } = searchParams;
  if (typeof code !== "string") {
    return <>Authentication Failed {`code: ${code}`}</>;
  }
  try {
    const { message } = await postAuthCode({ code });
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center p-8 bg-white rounded shadow">
          <Image src={discord} alt="Discord Logo" className="w-16 h-16 mb-4" />
          <h1 className="text-2xl font-bold text-gray-600">DiscordTicket</h1>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  } 
};

export default Callback;
