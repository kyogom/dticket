import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { APP_NAME } from "./constants";

const inter = Inter({ subsets: ["latin"] });

const { NODE_ENV } = process.env;

export const metadata: Metadata = {
  title: NODE_ENV === "production" ? APP_NAME : `${APP_NAME} | ${NODE_ENV}`,
  description: "Customer Service App for Discord Users",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
