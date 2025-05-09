import { PrivyClient } from "@privy-io/server-auth";

if (!process.env.NEXT_PUBLIC_APP_ID || !process.env.NEXT_PUBLIC_APP_SECRET) {
  throw new Error(
    "Environment variables PRIVY_APP_ID and PRIVY_APP_SECRET must be set"
  );
}

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_APP_ID,
  process.env.NEXT_PUBLIC_APP_SECRET
);

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { did } = req.body;

  if (!did) return res.status(400).json({ error: "Missing DID" });

  try {
    await privy.deleteUser(did);
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete user" });
  }
}
