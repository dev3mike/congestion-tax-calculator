import { PublicHolidayType, PublicHolidays } from "@configuration";
import { VEHICLES } from "@enums";
import { TaxHelpers } from "@root/helpers/tax.helpers";
import { TaxRuleType } from "@root/types/tax-rule.type";

export namespace TaxService {
    export function CalculateTax(city: string, vehicle: VEHICLES, dates: Date[], taxRules: TaxRuleType[], publicHolidays: typeof PublicHolidays) {

        const taxRule = taxRules.find(i => i.city === city)!;
        const publicHoliday = publicHolidays.find(i => i.city === city)!;

        if (isVehicleTollFree(vehicle, taxRule)) return [];

        const entryTollsAndAmounts: TaxHelpers.TollEntry[] = [];

        for (let i = 0; i < dates.length; i++) {
            const tollAmount = TaxHelpers.findApplicableTollAmount(taxRule, dates[i]);
            entryTollsAndAmounts.push({ date: dates[i], tollAmount });
        }

        const aggregateTollsByDate = TaxHelpers.aggregateTollsByDate(entryTollsAndAmounts, taxRule);
        const aggregatedTollsArray = Object.keys(aggregateTollsByDate).map(date => ({
            date,
            amount: aggregateTollsByDate[date]
        }));
        // Filter out non-taxable dates (weekends, public holidays and ...)
        const filteredTolls = aggregatedTollsArray.filter(i => TaxHelpers.isDateTaxable(new Date(i.date), taxRule, publicHoliday.publicHolidays));

        return filteredTolls;
    }

    function isVehicleTollFree(vehicle: VEHICLES, taxRule: TaxRuleType) {
        return taxRule.tollFreeVehicles.includes(vehicle);
    }
}