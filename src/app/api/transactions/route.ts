import { NextResponse } from "next/server";
import { ApiError, handleApiError } from "@/lib/utils/api-error";

// Use environment variable for the API key
const API_KEY = process.env.NEXT_PUBLIC_HELIUS_KEY || "fcdc89d9-0a66-4f94-8360-cf947fb92ae8";
const API_URL = "https://mainnet.helius-rpc.com/";

/**
 * API route to fetch transaction details
 */
export async function POST(req: Request) {
  try {
    // Parse the request body and validate
    let body;
    try {
      body = await req.json();
    } catch (error) {
      throw ApiError.badRequest("Invalid request body");
    }

    const { txSignature } = body;

    if (!txSignature || typeof txSignature !== "string") {
      throw ApiError.badRequest("Transaction signature is required and must be a string");
    }

    // Send request to Helius API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "helius-transaction",
        method: "getTransaction",
        params: [txSignature, "json"],
      }),
    });

    if (!response.ok) {
      throw ApiError.internal(`Helius API responded with status ${response.status}`);
    }

    const data = await response.json();

    // Check for JSON-RPC errors
    if (data.error) {
      throw ApiError.internal("Helius API error", data.error);
    }

    // Check if the transaction data is available
    if (!data?.result) {
      throw ApiError.notFound("No transaction details found", { signature: txSignature });
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      transactionDetails: data.result,
    });

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Handle GET requests to provide informational response
 */
export async function GET() {
  return NextResponse.json(
    {
      message: "Use POST method with a 'txSignature' in the request body to fetch transaction details",
      example: { 
        txSignature: "5UxgM1SJfWrPbJ7iyGBUWNR6XT5RGoaCGofRTtPdnSKFJvHNoUt8U9FmYH9tZrYBRKJeGiMGWbK1xJsqrCtCvxeC" 
      }
    },
    { status: 200 }
  );
}
