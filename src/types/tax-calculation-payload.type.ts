import { VEHICLES } from "@enums";
import { z } from "zod";

export namespace TaxCalculationPayload {
    export const zodSchema = z.object({
        vehicleType: z.nativeEnum(VEHICLES),
        dates: z.array(z.string().transform(str => new Date(str)))
    });

    export type type = z.infer<typeof zodSchema>;
}
