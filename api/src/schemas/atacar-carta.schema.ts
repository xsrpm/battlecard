import { z } from 'zod'

export const atacarCartaSchema = z.object({
  event: z.string(),
  payload: z.object({
    jugadorId: z.string().uuid(),
    idZonaBatalla: z.number(),
    idZonaBatallaEnemiga: z.number()
  })

})

export type AtacarCartaRequest = z.infer<typeof atacarCartaSchema>
