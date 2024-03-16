import { VEHICLES, MONTHS } from "@root/enums"

type TollTimeStringType = `${number}${number}:${number}${number}-${number}${number}:${number}${number}`;

type TollAmountType = {
    time: TollTimeStringType,
    amount: number
}

export type TaxRuleType = {
    city: string,
    tollFreeVehicles: VEHICLES[],
    tollAmountByTime: TollAmountType[],
    maxChargePerDay: number,
    shouldChargeOnWeekends: boolean,
    shouldChargeOnPublicHolidays: boolean,
    shouldChargeOnDayBeforePublicHolidays: boolean,
    monthsExemptFromCharging: MONTHS[],
    isSingleChargeEnabled: boolean
}