import { env } from "../../configs/env.ts";
import { ExternalApiError } from "../../shared/errors/external-api-error.ts";
import { AWESOME_API_URL } from "./awesome-api.constants.ts";
import { AwesomeApiResponse, ExchangeRate } from "./awesome-api.types.ts";

export class AwesomeApiProvider {
    async getExchangeRate(): Promise<ExchangeRate> {
        const response = await fetch(AWESOME_API_URL, {
            headers: {
                'x-api-key': env.AWESOME_API_KEY
            }
        })

        if (!response.ok) {
            throw new ExternalApiError()
        }

        const data = await response.json() as AwesomeApiResponse
    
        return {
            exchangeRate: Number(data.BRLUSD.bid)
        }
    }
}
