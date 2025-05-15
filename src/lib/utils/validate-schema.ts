import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError } from "./api-error";

/**
 * Helper function to validate API request bodies against Zod schemas
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Parsed data if valid
 * @throws ApiError if validation fails
 */
export async function validateSchema<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): Promise<z.infer<T>> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ApiError.badRequest("Validation error", {
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }
    throw ApiError.badRequest("Invalid request data");
  }
}

/**
 * Middleware to validate request bodies in API routes
 * @param schema - Zod schema to validate against
 */
export function withValidation<T extends z.ZodTypeAny>(
  schema: T,
  handler: (req: Request, validated: z.infer<T>) => Promise<NextResponse>
) {
  return async function (req: Request) {
    try {
      let body;
      try {
        body = await req.json();
      } catch (error) {
        throw ApiError.badRequest("Invalid JSON");
      }

      const validated = await validateSchema(schema, body);
      return handler(req, validated);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message, details: error.details },
          { status: error.statusCode }
        );
      }
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  };
}
