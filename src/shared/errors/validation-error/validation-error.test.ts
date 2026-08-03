import { describe, expect, it } from "vitest"
import { isValidationError, type ValidationError } from "./validation-error.ts"

describe("isValidationError", () => {
  it("should return true for a valid validation error", () => {
    const error: ValidationError = {
      code: "FST_ERR_VALIDATION",
      validation: [
        {
          instancePath: "/amount",
          message: "Required",
        },
      ],
    }

    expect(isValidationError(error)).toBe(true)
  })

  it.each([undefined, null, "error", 123, true, []])(
    "should return false for invalid values: %p",
    (value) => {
      expect(isValidationError(value)).toBe(false)
    }
  )

  it("should return false when code is different", () => {
    const error = {
      code: "OTHER_ERROR",
      validation: [],
    }

    expect(isValidationError(error)).toBe(false)
  })

  it("should return false when validation is missing", () => {
    const error = {
      code: "FST_ERR_VALIDATION",
    }

    expect(isValidationError(error)).toBe(false)
  })

  it("should return false when validation is not an array", () => {
    const error = {
      code: "FST_ERR_VALIDATION",
      validation: {},
    }

    expect(isValidationError(error)).toBe(false)
  })
})
