import { z } from 'zod'

export const colocarCartaSchema = z.object({
  event: z.string(),
  payload: z.object({
    jugadorId: z.string().uuid(),
    posicion: z.string(),
    idZonaBatalla: z.number(),
    idMano: z.number()
  })

})

export type ColocarCartaRequest = z.infer<typeof colocarCartaSchema>
