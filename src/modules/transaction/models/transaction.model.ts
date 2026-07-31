import mongoose, { type InferSchemaType } from "mongoose";

export const TransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    exchangeRate: {
        type: Number,
        required: true
    },
    convertedAmount: {
        type: Number,
        required: true
    },
    currencyFrom: {
        type: String,
        enum: ["BRL"],
        immutable: true
    },
    currencyTo: {
        type: String,
        enum: ["USD"],
        immutable: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
},
{
    versionKey: false
})

TransactionSchema.index({ createdAt: -1 })

export const TransactionModel = mongoose.model(
    'Transaction',
    TransactionSchema
)

export type Transaction = InferSchemaType<typeof TransactionSchema>