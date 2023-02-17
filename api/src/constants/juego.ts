export enum Pantalla {
    EN_SALA_DE_ESPERA = 'EN SALA DE ESPERA',
    EN_JUEGO = 'EN JUEGO',
    FIN_DE_JUEGO = 'FIN DE JUEGO'
}

export enum Sala {
    SALA_ABIERTA = 'SALA ABIERTA',
    SALA_CERRADA = 'SALA CERRADA',
    SALA_INICIADA = 'SALA INICIADA'
}

export enum ResultadoUnirASala {
    EXITO = 'Exito',
    NO_INDICO_NOMBRE_JUGADOR = 'No indicó nombre de jugador',
    SALA_LLENA_NO_PUEDEN_ENTRAR_JUGADORES = 'Sala llena, no pueden entrar jugadores',
    NOMBRE_EN_USO = 'Nombre de Jugador/Nick ya está en uso'
}

export enum ResultadoSalirDeSala {
    SALIO_DE_SALA = 'SALIO DE SALA',
    NO_ESTA_EN_SALA = 'NO ESTA EN SALA'
}

export enum ResultadoIniciarJuego {
    NO_SE_TIENEN_2_JUGADORES_PARA_EMPEZAR = 'No se tienen 2 jugadores para empezar',
    JUEGO_INICIADO = 'JUEGO INICIADO',
    CONDICION_NO_MANEJADA_AL_INICIAR_JUEGO = 'Condición no manejada al iniciarJuego'
}