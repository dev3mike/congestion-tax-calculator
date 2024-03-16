import { MONTHS, VEHICLES } from '@root/enums';
import { TaxRuleType } from "@root/types/tax-rule.type";

export namespace TaxRules {
    export const rules: TaxRuleType[] = [
        {
            city: 'gothenburg',
            tollFreeVehicles: [
                VEHICLES.Emergency,
                VEHICLES.Bus,
                VEHICLES.Diplomat,
                VEHICLES.Motorcycle,
                VEHICLES.Military,
                VEHICLES.Foreign,
            ],
            tollAmountByTime: [
                { time: "06:00-06:29", amount: 8 },
                { time: "06:30-06:59", amount: 13 },
                { time: "07:00-07:59", amount: 18 },
                { time: "08:00-08:29", amount: 13 },
                { time: "08:30-14:59", amount: 8 },
                { time: "15:00-15:29", amount: 13 },
                { time: "15:30-16:59", amount: 18 },
                { time: "17:00-17:59", amount: 13 },
                { time: "18:00-18:29", amount: 8 },
                { time: "18:30-05:59", amount: 0 }
            ],
            maxChargePerDay: 60,
            shouldChargeOnWeekends: false,
            shouldChargeOnPublicHolidays: false,
            shouldChargeOnDayBeforePublicHolidays: false,
            monthsExemptFromCharging: [MONTHS.July],
            isSingleChargeEnabled: false,
        }
    ]

    export const cities = rules.map(i => i.city);
}