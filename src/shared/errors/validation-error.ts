export interface ValidationError {
  code: "FST_ERR_VALIDATION"
  validation: Array<{
    message: string
    instancePath: string
  }>
}

export function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "FST_ERR_VALIDATION" &&
    "validation" in error &&
    Array.isArray(error.validation)
  )
}
