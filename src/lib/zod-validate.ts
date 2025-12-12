import { NextResponse } from "next/server";
import {  z } from "zod";

/**
 * Custom error used to immediately return an HTTP response on validation failure.
 */
export class ValidationResponseError extends Error {
  response: NextResponse;
  constructor(response: NextResponse) {
    super("Validation failed, returning HTTP response.");
    this.name = "ValidationResponseError";
    this.response = response;
  }
}

const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorResponse = NextResponse.json(
      { error: z.treeifyError(result.error).errors },
      { status: 400 }
    );
    throw new ValidationResponseError(errorResponse); 
  }

  return result.data;
};

export default validate;