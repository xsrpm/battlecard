import { Carta as ICarta } from './carta';
export interface CeldaBatalla{
    posBatalla: string
    dispAtaque: string
    dispCambio: string
    carta: ICarta | null
}