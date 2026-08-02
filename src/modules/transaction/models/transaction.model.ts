import mongoose, { type InferSchemaType } from "mongoose"
import { CurrencyCode } from "../../../shared/utils/constants/currency-code.constants.ts"

export const TransactionSchema = new mongoose.Schema(
  {
    amount: {
      required: true,
      type: Number,
    },
    convertedAmount: {
      required: true,
      type: Number,
    },
    createdAt: {
      default: Date.now,
      immutable: true,
      type: Date,
    },
    currencyFrom: {
      default: CurrencyCode.BRL,
      enum: [CurrencyCode.BRL],
      immutable: true,
      type: String,
    },
    currencyTo: {
      default: CurrencyCode.USD,
      enum: [CurrencyCode.USD],
      immutable: true,
      type: String,
    },
    exchangeRate: {
      required: true,
      type: Number,
    },
  },
  {
    versionKey: false,
  }
)

TransactionSchema.set("toJSON", {
  transform(_, ret) {
    const { _id, ...rest } = ret
    const converted = { ...rest } as Record<string, unknown>

    if (_id !== undefined) {
      converted.id = _id.toString()
    }

    const createdAt = converted.createdAt as Date | undefined

    if (createdAt instanceof Date) {
      converted.createdAt = createdAt.toISOString()
    }

    return converted
  },
})

TransactionSchema.index({ createdAt: -1 })

export const TransactionModel = mongoose.model("Transaction", TransactionSchema)

export type Transaction = InferSchemaType<typeof TransactionSchema>
