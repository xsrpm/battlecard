import { z } from 'zod'

export const terminalTurnoSchema = z.object({
  event: z.string(),
  payload: z.object({
    jugadorId: z.string().uuid(),
    idZonaBatalla: z.number()
  })
})

export type SeleccionarZonaBatallaRequest = z.infer<typeof terminalTurnoSchema>
