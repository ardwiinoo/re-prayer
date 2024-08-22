import { ApiError } from "@/exceptions/ApiError"
import { City } from "@/models/types"
import axios from "axios"

class CityService {
    
    private static cities: City[] = []

    constructor(private apiUrl: string) {}

    private async fetchCities(): Promise<City[]> {
        try {
            const res = await axios.get(`${this.apiUrl}/kota/semua`)
            CityService.cities = res.data.data
        } catch (err) {
            throw new ApiError('Failed to fetch cities')
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