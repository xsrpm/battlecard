import { z } from 'zod'

export const seleccionarManoSchema = z.object({
  event: z.string(),
  payload: z.object({
    jugadorId: z.string().uuid(),
    idMano: z.number()
  })
})

export type SeleccionarManoRequest = z.infer<typeof seleccionarManoSchema>
