import { z } from 'zod'

export const selZonaBatallaSchema = z.object({
  event: z.string(),
  payload: z.object({
    jugadorId: z.string(),
    idZonaBatalla: z.number()
  })
})

export type SeleccionarZonaBatallaRequest = z.infer<typeof selZonaBatallaSchema>
