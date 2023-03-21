import { z } from 'zod'

export const unirASalaSchema = z.object({
  event: z.string(),
  payload: z.object({
    nombreJugador: z.string().min(3)
  })
})

export type UnirASalaRequest = z.infer<typeof unirASalaSchema>
