export const isPrayerTime = (prayerTime: string): boolean => {
    const now = new Date()
    const [prayerHour, prayerMinute] = prayerTime.split(':').map(Number)

    return now.getHours() === prayerHour && now.getMinutes() === prayerMinute
}