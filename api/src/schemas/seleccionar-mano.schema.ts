import { z } from 'zod'

export const seleccionarManoSchema = z.object({
  event: z.string(),
  payload: z.object({
    idMano: z.number()
  })
})

export type SeleccionarManoRequest = z.infer<typeof seleccionarManoSchema>
