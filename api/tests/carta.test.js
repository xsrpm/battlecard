/* eslint-disable no-undef */

const Carta = require("../clases/carta.js");

describe("Carta", () => {
  test("tiene propiedades estaticas", () => {
    expect(Carta.MAX_VALOR_CARTA).toBe(13);
    expect(Carta.MIN_VALOR_CARTA).toBe(1);
    expect(Carta.Elemento.COCO).toBe("0x2666");
    expect(Carta.Elemento.CORAZON).toBe("0x2665");
    expect(Carta.Elemento.CORAZON).toBe("0x2665");
    expect(Carta.Elemento.TREBOL).toBe("0x2663");
    expect(Carta.Elemento.ESPADA).toBe("0x2660");
    expect(Carta.NUMERO_ELEMENTOS_CARTAS).toBe(4);
  });

  test("crea objeto Carta válido", () => {
    let c = new Carta(12, Carta.Elemento.COCO);
    expect(Object.values(Carta.Elemento)).toContain(c.elemento);
    expect(c.valor).toBeLessThanOrEqual(Carta.MAX_VALOR_CARTA);
    expect(c.valor).toBeGreaterThanOrEqual(Carta.MIN_VALOR_CARTA);
  });
});
