import dayjs from 'dayjs'

export function dateFormatService(date: string) {
    return dayjs(date).format('YYYY-MM-DD')
}

export function dateFormatter(date: Date | any): string {
    const formatted = dayjs(date).format('YYYY-MM-DD')
    if (formatted.includes('Invalid')) return ''
    return formatted
}

//
export const dateDir = dayjs().format('YYYYMMDD')
export function dateTimeFormat(date?: Date | string | any): string {
    if (!date) return ''

    const result = dayjs(date).format('DD/MM/YYYY HH:mm:ss')
    if (result.includes('Invalid')) {
        return ''
    }
    return result
}

export const today = (date = new Date()) => {
    return dayjs(dayjs(date).add(7, 'hours').format()).toDate()
}

export const timestamp = (date = new Date()) => {
    return dayjs(dayjs(date).add(7, 'hours').format()).toDate()
}
