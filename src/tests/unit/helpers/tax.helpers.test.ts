import { MONTHS, VEHICLES } from "@enums";
import { TaxRuleType } from "@root/types/tax-rule.type";
import { TaxHelpers } from '@root/helpers/tax.helpers';

const applicableAmountTestCases: [string, number][] = [
    ["2013-02-08 06:20:27", 8],
    ["2013-02-09 17:59:00", 13],
    ["2013-02-09 18:23:30", 8],
]


describe('TaxHelpers', () => {
    test.each(applicableAmountTestCases)(
        "Verify returns applicable toll amount, %p = %p",
        (input: string, expectedOutput: number) => {
            // Arrange
            const mockTaxRule: TaxRuleType = getMockTaxRules();
            const mockDate = new Date(input);

            // Act
            const applicableAmount = TaxHelpers.findApplicableTollAmount(mockTaxRule, mockDate);

            // Assert
            expect(applicableAmount).toBe(expectedOutput);
        }
    );

    test('Verify returns the highest toll if its within the same hour', async () => {
        // Arrange
        const mockTaxRule: TaxRuleType = getMockTaxRules();
        const mockEntryTollsAndAmounts: TaxHelpers.TollEntry[] = [
            { date: new Date("2013-02-08 06:27:00"), tollAmount: 40 },
            { date: new Date("2013-02-08 06:32:00"), tollAmount: 30 },
            { date: new Date("2013-02-08 06:32:00"), tollAmount: 50 },
            { date: new Date("2013-02-08 07:31:00"), tollAmount: 30 },
            { date: new Date("2013-02-08 07:30:00"), tollAmount: 12 }
        ];

        // Act
        const aggregatedTolls = TaxHelpers.aggregateTollsByDate(mockEntryTollsAndAmounts, mockTaxRule);

        // Assert
        expect(aggregatedTolls).toStrictEqual({ "2013-02-08": 50 });
    });

    test('Verify returns max 60 in the same day', async () => {
        // Arrange
        const mockTaxRule: TaxRuleType = getMockTaxRules();
        const mockEntryTollsAndAmounts: TaxHelpers.TollEntry[] = [
            { date: new Date("2013-02-08 04:27:00"), tollAmount: 40 },
            { date: new Date("2013-02-08 05:32:00"), tollAmount: 30 },
            { date: new Date("2013-02-08 06:35:00"), tollAmount: 50 }
        ];

        // Act
        const aggregatedTolls = TaxHelpers.aggregateTollsByDate(mockEntryTollsAndAmounts, mockTaxRule);

        // Assert
        expect(aggregatedTolls).toStrictEqual({ "2013-02-08": 60 });
    });
});

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