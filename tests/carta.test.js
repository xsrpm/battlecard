/* eslint-disable no-undef */

const Carta = require('../clases/carta.js')


describe('Carta',()=>{
    test('tiene propiedades estaticas',()=>{
        expect(Carta.MAXVALORCARTA).toBe(13)
        expect(Carta.MINVALORCARTA).toBe(1)
        expect(Carta.Elemento.COCO).toBe("\u2666")
        expect(Carta.Elemento.CORAZON).toBe("\u2665")
        expect(Carta.Elemento.CORAZON).toBe("\u2665")
        expect(Carta.Elemento.TREBOL).toBe("\u2663")
        expect(Carta.Elemento.ESPADA).toBe("\u2660")
        expect(Carta.NUMEROELEMENTOSCARTAS).toBe(4)
    })

    test('crea objeto Carta válido',()=>{
        let c=new Carta(12,Carta.Elemento.COCO)
        expect(Object.values(Carta.Elemento)).toContain(c.elemento)
        expect(c.valor).toBeLessThanOrEqual(Carta.MAXVALORCARTA)
        expect(c.valor).toBeGreaterThanOrEqual(Carta.MINVALORCARTA)
    })
})