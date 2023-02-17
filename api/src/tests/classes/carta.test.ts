
import { Carta } from '../../classes/carta'
import { Elemento, MAX_VALOR_CARTA, MIN_VALOR_CARTA } from '../../constants/carta'

describe('Carta', () => {

  test('crea objeto Carta válido', () => {
    const c = new Carta(12, Elemento.COCO)
    expect(Object.values(Elemento)).toContain(c.elemento)
    expect(c.valor).toBeLessThanOrEqual(MAX_VALOR_CARTA)
    expect(c.valor).toBeGreaterThanOrEqual(MIN_VALOR_CARTA)
  })
})
