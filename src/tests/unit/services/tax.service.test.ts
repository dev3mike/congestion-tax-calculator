import { MONTHS, VEHICLES } from "@enums";
import { TaxRuleType } from "@root/types/tax-rule.type";
import { TaxHelpers } from '@root/helpers/tax.helpers';
import { TaxService } from "@services/tax.service";
import { PublicHolidayObjectType, PublicHolidays } from "@configuration";


describe('TaxService', () => {


    test('Verify returns the highest toll if its within the same hour', async () => {
        // Arrange
        const cityName = "CITY_NAME";
        const vehicelType = VEHICLES.Personal;
        const dateStrings = [
            "2013-02-05 06:23:27",
            "2013-02-06 06:23:27", // Before public holiday
            "2013-02-07 06:23:27", // Public holiday
        ]
        const dates = dateStrings.map(i => new Date(i));
        const mockTaxRule: TaxRuleType = getMockTaxRules();
        const mockPublicHolidays = getMockPublicHolidays();

        // Act
        const tollAmounts = TaxService.CalculateTax(cityName, vehicelType, dates, [mockTaxRule], mockPublicHolidays);

        // Assert
        expect(tollAmounts).toStrictEqual([{ "amount": 8, "date": "2013-02-05" }]);
    });


});

function getMockPublicHolidays(): PublicHolidayObjectType[] {
    return [
        {
            city: 'CITY_NAME',
            publicHolidays: [
                "2013-02-07"
            ]
        }
    ];
}

function getMockTaxRules(): TaxRuleType {
    return {
        city: 'CITY_NAME',
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

}