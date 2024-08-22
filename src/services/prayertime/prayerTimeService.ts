import { ApiError } from "@/exceptions/ApiError"
import { PrayerTime } from "@/models/types"
import axios from "axios"

class PrayerTimeService {

    constructor(private apiUrl: string) {}

    public async fetchPrayerTimes(cityId: string, date: string): Promise<PrayerTime> {
        try {
            const response = await axios.get(`${this.apiUrl}/jadwal/${cityId}/${date}`)
            return response.data.data
        } catch (error) {
            throw new ApiError('Failed to fetch prayer time')
        }
    }
}

export default PrayerTimeService