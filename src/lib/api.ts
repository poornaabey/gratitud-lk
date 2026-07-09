import { NextResponse } from "next/server"
import { ZodError } from "zod"

export type ApiErrorBody = {
  ok: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiSuccessBody<T> = {
  ok: true
  data: T
}

export type ApiBody<T> = ApiSuccessBody<T> | ApiErrorBody

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data } satisfies ApiSuccessBody<T>, init)
}

export function apiError(
  code: string,
  message: string,
  status = 400,
  details?: unknown,
) {
  return NextResponse.json(
    {
      ok: false,
      error: { code, message, details },
    } satisfies ApiErrorBody,
    { status },
  )
}

export function handleApiError(error: unknown) {
  console.error("[api]", error)

  if (error instanceof ZodError) {
    return apiError("VALIDATION_ERROR", "Invalid request payload.", 400, error.flatten())
  }

  if (error instanceof Error && error.message.includes("DATABASE_URL")) {
    return apiError(
      "DATABASE_NOT_CONFIGURED",
      "Database is not configured. Set DATABASE_URL in .env.local.",
      503,
    )
  }

  return apiError("INTERNAL_ERROR", "Something went wrong. Please try again.", 500)
}
