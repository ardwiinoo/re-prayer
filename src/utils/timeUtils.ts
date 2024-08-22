export const getCurrentTime = (): Date => {
    return new Date()
}

export const parseTime = (time: string): Date => {
    let hours: number | undefined, minutes: number | undefined

    if (time.includes('T')) {
        // Check if it's an ISO format
        const date = new Date(time)
        hours = date.getHours()
        minutes = date.getMinutes()
    } else {
        const parts = time.split(':').map(Number)
        if (parts.length === 2) {
            ;[hours, minutes] = parts
        }
    }

    if (
        hours === undefined ||
        minutes === undefined ||
        isNaN(hours) ||
        isNaN(minutes)
    ) {
        throw new Error(`Invalid time format: ${time}`)
    }

    const date = new Date()
    date.setHours(hours, minutes, 0, 0)

    if (date < new Date()) {
        date.setDate(date.getDate() + 1)
    }

    return date
}
