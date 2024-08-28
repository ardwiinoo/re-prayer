export const parseTime = (time: string): Date => {
    const [hours, minutes] = time.split(':')

    if (
        hours === undefined ||
        minutes === undefined ||
        isNaN(parseInt(hours)) ||
        isNaN(parseInt(minutes))
    ) {
        throw new Error(`parseTime: Invalid time format: ${time}`)
    }

    const date = new Date()
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)

    // Jika waktu yang diatur sudah lewat, set untuk hari berikutnya
    if (date < new Date()) {
        date.setDate(date.getDate() + 1)
    }

    return date
}
