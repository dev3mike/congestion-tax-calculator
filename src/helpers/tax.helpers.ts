import { PublicHolidayType, PublicHolidays, TaxRules } from "@configuration";
import { TaxRuleType } from "@root/types/tax-rule.type";

export namespace TaxHelpers {
    export function findApplicableTollAmount(taxRules: TaxRuleType, date: Date): number | null {
        const timeRanges = taxRules.tollAmountByTime;
        if (!timeRanges) return null;

        const providedDate = new Date(date);

        for (const { time, amount } of timeRanges) {
            const [startTime, endTime] = time.split('-');
            const [startHours, startMinutes] = startTime.split(':').map(Number);
            const [endHours, endMinutes] = endTime.split(':').map(Number);

            let start = new Date(providedDate);
            start.setHours(startHours, startMinutes, 0, 0);

            let end = new Date(providedDate);
            if (endHours < startHours) {
                // Handle overnight time range by adding a day to the end date.
                end.setDate(end.getDate() + 1);
            }
            end.setHours(endHours, endMinutes, 0, 0);

            // Check if current time is within the start and end times.
            if (start <= providedDate && providedDate <= end) {
                return amount;
            }
        }
        return null;
    }

    export function aggregateTollsByDate(entries: TollEntry[], taxRule: TaxRuleType): AggregatedTolls {
        // Sort entries by date
        const sortedEntries = entries.sort((a, b) => a.date.getTime() - b.date.getTime());

        const aggregatedTolls: AggregatedTolls = {};

        sortedEntries.forEach((item, i) => {
            const dayKey = item.date.toISOString().split('T')[0];

            const isDayKeyExist = !!aggregatedTolls[dayKey];

            if (!isDayKeyExist) {
                aggregatedTolls[dayKey] = item.tollAmount;
            } else {
                // Check the time difference with the previous entry, if any
                let applyCharge = true;
                for (let j = i - 1; j >= 0; j--) {
                    const previousEntry = sortedEntries[j];
                    const previousDayKey = previousEntry.date.toISOString().split('T')[0];
                    if (previousDayKey !== dayKey) break; // Stop if we're no longer looking at the same day

                    const diffMinutes = (item.date.getTime() - previousEntry.date.getTime()) / 60000;
                    if (diffMinutes <= 60) {
                        // Within 60 minutes of the previous charge; apply only if higher
                        const itemTollAmount = item.tollAmount ?? 0;
                        const previousEntryTollAmount = previousEntry.tollAmount!
                        const currentToll = aggregatedTolls[dayKey] ?? 0;

                        if ((itemTollAmount > previousEntryTollAmount) && (itemTollAmount > currentToll)) {
                            aggregatedTolls[dayKey] = itemTollAmount;
                        }

                        applyCharge = false;
                        break;
                    }
                }

                if (applyCharge) {
                    aggregatedTolls[dayKey]! += item.tollAmount ?? 0;
                }
            }

            // Apply maximum charge per day
            if (aggregatedTolls[dayKey]! > 60) {
                aggregatedTolls[dayKey] = 60;
            }
        });

        return aggregatedTolls;
    }

    export function isDateTaxable(date: Date, taxRule: TaxRuleType, publicHolidays: PublicHolidayType) {
        let isTaxable = true;

        if (!taxRule.shouldChargeOnWeekends && isWeekend(date)) isTaxable = false;
        if (!taxRule.shouldChargeOnPublicHolidays && isPublicHoliday(date, publicHolidays)) isTaxable = false;
        if (!taxRule.shouldChargeOnDayBeforePublicHolidays && isDayBeforePublicHoliday(date, publicHolidays)) isTaxable = false;
        if (taxRule.monthsExemptFromCharging.length > 0 && isSameMonth(date, taxRule.monthsExemptFromCharging)) isTaxable = false;

        return isTaxable;
    }

    function isWeekend(date: Date) {
        const day = date.getDay();
        return day === 6 || day === 0;
    }

    function isSameMonth(date: Date, monthsExemptFromCharging: number[]): boolean {
        const month = date.getMonth() + 1;
        return monthsExemptFromCharging.includes(month);
    }

    function isPublicHoliday(date: Date, publicHolidays: PublicHolidayType) {
        return publicHolidays.some(holiday => {
            const holidayDate = new Date(holiday);
            return date.getFullYear() === holidayDate.getFullYear() &&
                date.getMonth() === holidayDate.getMonth() &&
                date.getDate() === holidayDate.getDate();
        });
    }

    function isDayBeforePublicHoliday(date: Date, publicHolidays: PublicHolidayType) {
        return publicHolidays.some(holiday => {
            const holidayDate = new Date(holiday);
            // Create a new Date object for the day before the holiday
            const dayBeforeHoliday = new Date(holidayDate);
            dayBeforeHoliday.setDate(holidayDate.getDate() - 1);

            return date.getFullYear() === dayBeforeHoliday.getFullYear() &&
                date.getMonth() === dayBeforeHoliday.getMonth() &&
                date.getDate() === dayBeforeHoliday.getDate();
        });
    }

    export type TollEntry = {
        date: Date;
        tollAmount: number | null;
    };

    type AggregatedTolls = {
        [date: string]: number | null;
    };
}