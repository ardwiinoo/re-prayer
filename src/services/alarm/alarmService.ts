import { Alarm } from '@/models/types'
import { parseTime } from '@/utils/timeUtils'
import { EventEmitter } from 'events'

class AlarmService extends EventEmitter {
    private currentTime: Date
    private alarms: Alarm[]

    constructor() {
        super()
        this.currentTime = new Date()
        this.alarms = []
    }

    private calculateNextAlarmTime(prayerTime: string): Date {
        const prayerDateTime = parseTime(prayerTime)

        if (prayerDateTime < this.currentTime) {
            prayerDateTime.setDate(prayerDateTime.getDate() + 1)
        }

        return prayerDateTime
    }

    public setAlarm(prayerName: string, prayerTime: string) {
        this.currentTime = new Date()

        const alarmTime = this.calculateNextAlarmTime(prayerTime)
        const timeDifference = alarmTime.getTime() - this.currentTime.getTime()

        // console.log(`Current time: ${this.currentTime}`)
        // console.log(`Alarm set for ${prayerName} at ${alarmTime}`)
        // console.log(`Time difference: ${timeDifference} milliseconds`)

        this.alarms.push({
            prayerName,
            time: alarmTime.toISOString(),
            status: 'pending',
        })

        setTimeout(() => {
            this.emit('alarm', prayerName)
            this.updateAlarmStatus(prayerName, 'completed')
        }, timeDifference)
    }

    public getAlarms(): Alarm[] {
        return this.alarms
    }

    public clearAlarms() {
        this.alarms = []
    }

    private updateAlarmStatus(
        prayerName: string,
        status: 'completed' | 'next day'
    ) {
        const alarm = this.alarms.find(
            (alarm) => alarm.prayerName === prayerName
        )
        if (alarm) {
            alarm.status = status
        }
    }
}

export default AlarmService
