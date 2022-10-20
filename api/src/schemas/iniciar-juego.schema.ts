import { z } from 'zod'

export const iniciarJuegoSchema = z.object({
  event: z.string()
})

export type IniciarJuegoRequest = z.infer<typeof iniciarJuegoSchema>
