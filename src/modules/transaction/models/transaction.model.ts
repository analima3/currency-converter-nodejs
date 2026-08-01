import mongoose, { type InferSchemaType } from "mongoose"

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
      default: "BRL",
      enum: ["BRL"],
      immutable: true,
      type: String,
    },
    currencyTo: {
      default: "USD",
      enum: ["USD"],
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

TransactionSchema.index({ createdAt: -1 })

export const TransactionModel = mongoose.model("Transaction", TransactionSchema)

export type Transaction = InferSchemaType<typeof TransactionSchema>
