import { ApiError } from '@/exceptions/ApiError'
import { PrayerTime } from '@/models/types'

class PrayerTimeService {
    constructor(private apiUrl: string) {}

    public async fetchPrayerTimes(
        cityId: string,
        date: string
    ): Promise<PrayerTime> {
        try {
            const res = await fetch(`${this.apiUrl}/jadwal/${cityId}/${date}`, {
                method: 'GET',
            })

            const data = await res.json()
            return data.data
        } catch (err) {
            throw new ApiError(`PrayerTimeService.fetchPrayerTimes: ${err}`)
        }
    }
}

export default PrayerTimeService
