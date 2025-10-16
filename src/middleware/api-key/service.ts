import env from "../../env"

export async function checkApiKeyService(apiKey: string) {
    // const sql = `
    //       SELECT apiKey, expiredAt, status, expiredAt, description
    //       FROM reward_partner_api_key
    //       WHERE apiKey = ?;
    //       `

    try {
        // const [rows]: any = await prismaClient

        // const wrappedRow: APIKey = rows[0]
        // return wrappedRow
        const apiKeys = [
            {
                apiKey: env.API_KEY,
                expiredAt: Date.now(),
                status: true,
                description: ''
            }
        ]

        return apiKeys.filter((key) => key.apiKey === apiKey)[0]
    } catch (error) {
        throw error
    }
}

export interface APIKey {
    apiKey: string
    expiredAt: Date
    status: number
    description: string | null
}
