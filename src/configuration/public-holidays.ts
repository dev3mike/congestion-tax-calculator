export type PublicHolidayObjectType = {
    readonly city: string,
    readonly publicHolidays: string[]
}

export const PublicHolidays: PublicHolidayObjectType[] = [
    {
        city: 'gothenburg',
        publicHolidays: [
            "2013-04-01",
            "2013-04-05",
            "2013-04-07"
        ]
    }
];

export type PublicHolidayType = typeof PublicHolidays['0']['publicHolidays'];