import { z } from 'zod'

export const cambiarPosicionSchema = z.object({
  event: z.string(),
  payload: z.object({
    idZonaBatalla: z.number()
  })

})

export type CambiarPosicionRequest = z.infer<typeof cambiarPosicionSchema>
