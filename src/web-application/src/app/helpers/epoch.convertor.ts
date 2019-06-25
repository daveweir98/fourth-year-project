
export function convertEpoch(epochTime:number) : string {

    if (typeof epochTime == "number") {
        let date : Date = new Date(0);

        date.setSeconds(epochTime);

        let dateOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };

        return date.toLocaleString("UTC", dateOptions);
    }

    return epochTime;

}
