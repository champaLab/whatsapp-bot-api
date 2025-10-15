import axios, { AxiosResponse, AxiosError } from 'axios'
import env from '../env'

const apiBot = axios.create({
    baseURL: env.API_BOT_URL
})

apiBot.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => Promise.reject(error)
)

export default apiBot
