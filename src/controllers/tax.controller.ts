import { PublicHolidays, TaxRules } from "@configuration";
import { TaxCalculationPayload } from "@root/types/tax-calculation-payload.type";
import { TaxService } from "@services/tax.service";
import { Body, Controller, Get, JsonController, Param, Post } from "routing-controllers";
import { z } from "zod";

@JsonController("/tax")
export class TaxController {
    @Get("/")
    public async home() {
        return { message: "Hello" };
    }

    @Post("/:city")
    public async getTax(@Param("city") cityName: string, @Body() payload: TaxCalculationPayload.type) {
        const cityNameValue = z
            .string()
            .refine(c => TaxRules.cities.includes(c), 'City is not valid')
            .parse(cityName);

        const taxCalculationPayload = TaxCalculationPayload.zodSchema.parse(payload);

        return TaxService.CalculateTax(
            cityNameValue,
            taxCalculationPayload.vehicleType,
            taxCalculationPayload.dates,
            TaxRules.rules,
            PublicHolidays);
    }
}