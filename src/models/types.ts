export interface City {
    id: string
    lokasi: string
}

export interface PrayerTime {
    id: number
    lokasi: string
    daerah: string
    jadwal: {
        tanggal: string
        imsak: string
        subuh: string
        terbit: string
        dhuha: string
        dzuhur: string
        ashar: string
        maghrib: string
        isya: string
        date: string
    }
}

export interface Alarm {
    prayerName: string
    time: string
    status: 'pending' | 'completed' | 'next day'
}
