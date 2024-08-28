import { City } from '@/models/types'
import AlarmService from './alarm/AlarmService'
import CityService from './city/CityService'
import PrayerTimeService from './prayertime/PrayerTimeService'
import nodeNotifier from 'node-notifier'
import prompts from 'prompts'

class App {
    private cityService: CityService
    private prayerTimeService: PrayerTimeService
    private alarmService: AlarmService

    constructor(apiUrl: string) {
        this.cityService = new CityService(apiUrl)
        this.prayerTimeService = new PrayerTimeService(apiUrl)
        this.alarmService = new AlarmService()
    }

    private async showWelcomeMessage() {
        console.clear()

        console.log(`
        ============================================================
        |                  WELCOME TO PRAYER REMINDER              |
        |                                                          |
        |           Author: ardwiinoo                              |
        |           Description: Reminder for prayer times         |
        ============================================================
        `)

        const response = await prompts({
            type: 'confirm',
            name: 'continue',
            message: 'Would you like to continue?',
            initial: true,
        })

        if (!response.continue) {
            console.log('Goodbye!')
            process.exit(0)
        }
    }

    public async selectCity(): Promise<City> {
        const cities: City[] = await this.cityService.getCities()

        const response = await prompts({
            type: 'select',
            name: 'selectedCityId',
            message: 'Select your city',
            choices: cities.map((city) => ({
                title: city.lokasi,
                value: city.id,
            })),
            initial: cities.findIndex((city) => city.id === '1414'), // Menggunakan indeks sebagai initial
        })

        if (!response.selectedCityId) {
            throw new Error('No city selected')
        }

        const selectedCity = cities.find(
            (city) => city.id === response.selectedCityId
        )

        if (!selectedCity) {
            throw new Error('Selected city not found')
        }

        return selectedCity
    }

    private handleNotifications() {
        this.alarmService.on('alarm', (prayerName: string) => {
            nodeNotifier.notify({
                title: 'Prayer Reminder',
                message: `It's time for ${prayerName} prayer.`,
                sound: 'ping',
                wait: true,
                actions: ['Dismiss', 'Snooze'],
            })
        })
    }

    private keepProcessAlive() {
        setInterval(() => {}, 1000)

        process.on('SIGINT', () => {
            console.log('\nAlarms cancelled. Exiting...')
            process.exit()
        })
    }

    private async scheduleAlarms(prayerTimes: any) {
        const prayerNames = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya']
        const prayerTimesList = [
            prayerTimes.jadwal.subuh,
            prayerTimes.jadwal.dzuhur,
            prayerTimes.jadwal.ashar,
            prayerTimes.jadwal.maghrib,
            prayerTimes.jadwal.isya,
        ]

        prayerTimesList.forEach((time: string, index: number) => {
            this.alarmService.setAlarm(prayerNames[index]!, time)
        })

        console.log(
            "Alarms are set. You'll receive a notification when it's time."
        )

        this.handleNotifications()
        await this.showMenu()
    }

    private async showMenu() {
        const response = await prompts({
            type: 'select',
            name: 'option',
            message: 'What would you like to do?',
            choices: [
                { title: 'Show alarms', value: 'show' },
                { title: 'Change city', value: 'change' },
                { title: 'Quit', value: 'quit' },
            ],
        })

        if (response.option === 'show') {
            this.showAlarms()
            await this.showMenu()
        } else if (response.option === 'change') {
            await this.run()
        } else if (response.option === 'quit') {
            console.log('Goodbye!')
            process.exit(0)
        }
    }

    private showAlarms() {
        const alarms = this.alarmService.getAlarms()

        console.log('\nCurrent Alarms:')
        console.log('--------------------------------------------------')
        console.log('| No | Prayer   | Time                | Status     |')
        console.log('--------------------------------------------------')
        alarms.forEach((alarm, index) => {
            console.log(
                `| ${String(index + 1).padEnd(2)} | ${alarm.prayerName.padEnd(
                    8
                )} | ${new Date(
                    alarm.time
                ).toLocaleString()} | ${alarm.status.padEnd(10)} |`
            )
        })
        console.log('--------------------------------------------------')
    }

    public async run() {
        try {
            await this.showWelcomeMessage()

            const selectedCity = await this.selectCity()
            this.alarmService.clearAlarms()

            const currentDate = new Date().toISOString().split('T')[0]
            const prayerTimes = await this.prayerTimeService.fetchPrayerTimes(
                selectedCity.id,
                currentDate!
            )

            // console.log(
            //     `Prayer times for ${prayerTimes.lokasi} on ${prayerTimes.jadwal.tanggal}:`
            // )
            // console.log(prayerTimes.jadwal)

            await this.scheduleAlarms(prayerTimes)
            this.keepProcessAlive()
        } catch (err) {
            console.error((err as Error).message)
        }
    }
}

export default App
