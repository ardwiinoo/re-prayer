import { City } from "@/models/types"
import AlarmService from "./alarm/AlarmService"
import CityService from "./city/CityService"
import PrayerTimeService from "./prayertime/PrayerTimeService"
import readline from "readline"
import nodeNotifier from "node-notifier"
import { parseTime } from "@/utils/timeUtils"

class App {

    private cityService: CityService
    private prayerTimeService: PrayerTimeService
    private alarmService: AlarmService

    constructor(apiUrl: string) {
        this.cityService = new CityService(apiUrl)
        this.prayerTimeService = new PrayerTimeService(apiUrl)
        this.alarmService = new AlarmService()
    }

    public async run() {
        try {
            const cities: City[] = await this.cityService.getCities()

            console.log('Available Cities:')
            cities.forEach(city => console.log(`${city.id}. ${city.lokasi}`))

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })

            rl.question('Enter the city ID you want to set reminders for: ', async (cityId) => {
                const selectedCityId = cityId.trim() || "1414" // klaten

                let currentDate = new Date()
                let today = currentDate.toISOString().split('T')[0]
                let prayerTimes = await this.prayerTimeService.fetchPrayerTimes(selectedCityId, today!)

                console.log(`Prayer times for ${prayerTimes.lokasi} on ${prayerTimes.jadwal.tanggal}:`)
                console.log(prayerTimes.jadwal)

                const prayerNames = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'] // sholat yang dipilih
                const prayerTimesList = [
                  prayerTimes.jadwal.subuh,
                  prayerTimes.jadwal.dzuhur,
                  prayerTimes.jadwal.ashar,
                  prayerTimes.jadwal.maghrib,
                  prayerTimes.jadwal.isya
                ]

                prayerTimesList.forEach((time, index) => {
                    let prayerTime = parseTime(time) // Pastikan ini dalam format 'HH:MM'

                    // Konversi ke waktu lokal tanpa membuat format ISO
                    let localTime = new Date()
                    localTime.setHours(prayerTime.getHours(), prayerTime.getMinutes(), 0, 0)

                    if (localTime < currentDate) {
                        localTime.setDate(localTime.getDate() + 1)
                        console.log(`${prayerNames[index]} prayer time has passed. Scheduling for next day at ${localTime.toISOString()}.`)
                    } else {
                        console.log(`${prayerNames[index]} prayer time is set for today at ${localTime.toISOString()}.`)
                    }

                    // Gunakan jam dan menit saja untuk set alarm
                    const alarmTime = `${localTime.getHours()}:${localTime.getMinutes()}`
                    this.alarmService.setAlarm(prayerNames[index]!, alarmTime)
                })

                console.log('Alarms are set. You can cancel with CTRL + C.')

                this.alarmService.on('alarm', (prayerName: string) => {
                    nodeNotifier.notify({
                        title: 'Prayer Reminder',
                        message: `It's time for ${prayerName} prayer.`,
                        sound: true
                    })
                })

                // Keep alive
                setInterval(() => {}, 1000)

                process.on('SIGINT', () => {
                  console.log('\nAlarms cancelled. Exiting...')
                  process.exit()
                })

                rl.close()
            })
        } catch (err) {
            console.error((err as Error).message)
        }
    }
}

export default App