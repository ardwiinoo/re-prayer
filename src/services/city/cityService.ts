import { ApiError } from '@/exceptions/ApiError'
import { City } from '@/models/types'

class CityService {
    private static cities: City[] = []

    constructor(private apiUrl: string) {}

    private async fetchCities(): Promise<City[]> {
        try {
            const res = await fetch(`${this.apiUrl}/kota/semua`, {
                method: 'GET',
            })

            const data = await res.json()
            CityService.cities = data.data
        } catch (err) {
            throw new ApiError(`CityService.fetchCities: ${err}`)
        }

        return CityService.cities
    }

    public async getCities(): Promise<City[]> {
        if (CityService.cities.length === 0) {
            await this.fetchCities()
        }

        return CityService.cities
    }
}

export default CityService
