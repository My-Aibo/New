import { NextResponse } from "next/server";

export type ApiErrorOptions = {
  statusCode?: number;
  message?: string;
  details?: unknown;
};

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(options: ApiErrorOptions = {}) {
    const { statusCode = 500, message = "Internal Server Error", details } = options;
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "ApiError";
  }

  public static badRequest(message = "Bad Request", details?: unknown) {
    return new ApiError({ statusCode: 400, message, details });
  }

  public static unauthorized(message = "Unauthorized", details?: unknown) {
    return new ApiError({ statusCode: 401, message, details });
  }

  public static forbidden(message = "Forbidden", details?: unknown) {
    return new ApiError({ statusCode: 403, message, details });
  }

  public static notFound(message = "Not Found", details?: unknown) {
    return new ApiError({ statusCode: 404, message, details });
  }

  public static tooManyRequests(message = "Too Many Requests", details?: unknown) {
    return new ApiError({ statusCode: 429, message, details });
  }

  public static internal(message = "Internal Server Error", details?: unknown) {
    return new ApiError({ statusCode: 500, message, details });
  }
}

export function handleApiError(error: unknown) {
  console.error("[API ERROR]", error);
  
  if (error instanceof ApiError) {
    // Return structured API error
    return NextResponse.json(
      {
        error: {
          message: error.message,
          ...(error.details && { details: error.details }),
        },
      },
      { status: error.statusCode }
    );
  }

  // For unknown errors, return a generic 500 error
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  return NextResponse.json(
    { error: { message } },
    { status: 500 }
  );
}
