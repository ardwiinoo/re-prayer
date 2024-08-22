import { getCurrentTime, parseTime } from '@/utils/timeUtils'
import { EventEmitter } from 'events'

class AlarmService extends EventEmitter {
    
    constructor() {
        super()
    }

    public setAlarm(prayerName: string, prayerTime: string) {
        const prayerDateTime = parseTime(prayerTime)
        const currentTime = getCurrentTime()
        const timeDifference = prayerDateTime.getTime() - currentTime.getTime()

        console.log(`Current time: ${currentTime}`)
        console.log(`Prayer time for ${prayerName}: ${prayerDateTime}`)
        console.log(`Time difference: ${timeDifference} milliseconds`)

        if (timeDifference > 0) {
            setTimeout(() => {
                this.emit('alarm', prayerName)
            }, timeDifference) // Set alarm after the remaining time
        } else {
            console.log(`The prayer time for ${prayerName} has already passed. No alarm set.`)
        }
    }
}

export default AlarmService