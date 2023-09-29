import discord from "./discord.svg";
import Image from "next/image";

const Callback = async ({ params }: { params: { slug: string } }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center p-8 bg-white rounded shadow">
        <Image src={discord} alt="Discord Logo" className="w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold">DiscordTicket</h1>
        <p className="text-gray-600">Discordとの連携が完了しました</p>
      </div>
    </div>
  );
};

export default Callback;
