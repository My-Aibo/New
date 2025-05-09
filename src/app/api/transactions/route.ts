import { NextResponse } from "next/server";

// Replace this with your real Helius API key
const API_KEY = "fcdc89d9-0a66-4f94-8360-cf947fb92ae8";

export async function POST(req: Request) {
  const { txSignature } = await req.json(); // Extract transaction signature

  if (!txSignature) {
    return NextResponse.json(
      { error: "Transaction signature is required" },
      { status: 400 }
    );
  }

  try {
    // Send request to Helius API
    const res = await fetch("https://mainnet.helius-rpc.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getTransaction",
        params: [txSignature, "json"],
      }),
    });

    const data = await res.json();

    // Check if the transaction data is available
    if (data?.result) {
      return NextResponse.json({ transactionDetails: data.result });
    } else {
      return NextResponse.json(
        { error: "No transaction details found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching transaction:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
