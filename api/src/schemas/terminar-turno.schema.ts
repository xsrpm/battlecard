import { z } from 'zod'

export const terminalTurnoSchema = z.object({
  event: z.string(),
  payload: z.object({
    jugadorId: z.string().uuid()
  })
})

export type SeleccionarZonaBatallaRequest = z.infer<typeof terminalTurnoSchema>
