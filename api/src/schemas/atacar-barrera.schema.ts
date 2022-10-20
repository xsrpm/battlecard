import { z } from 'zod'

export const atacarBarreraSchema = z.object({
  event: z.string(),
  payload: z.object({
    idZonaBatalla: z.number()
  })

})

export type AtacarBarreraRequest = z.infer<typeof atacarBarreraSchema>
