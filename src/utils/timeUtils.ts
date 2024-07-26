export const getCurrentTime = (): Date => {
    return new Date()
}

export const parseTime = (time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number)
    const date = new Date()
    date.setHours(hours!, minutes, 0, 0)
    return date
}
