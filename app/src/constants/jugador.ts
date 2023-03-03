export enum ResultadoCogerCarta {
  MANO_LLENA = 'MANO LLENA',
  DECK_VACIO = 'DECK VACIO',
  EXITO = 'EXITO',
}

export enum ResultadoAtacarCarta {
  ATAQUES_SOLO_SE_REALIZAN_EN_SEGUNDO_TURNO = 'Ataques solo se pueden realizar desde el segundo turno',
  SIN_CARTAS_EN_ZONA_BATALLA = 'Sin cartas en zona de batalla',
  NO_HAY_CARTAS_EN_ZONA_BATALLA_ENEMIGA = 'No hay cartas en zona de batalla enemiga',
  NO_QUEDAN_ATAQUES_DISPONIBLES = 'No le quedan ataques disponibles',
  JUGADOR_ENEMIGO_DEBE_TENER_BARRERAS = 'Jugador enemigo debe tener barreras',
  POSIBLE = 'Posible',
  NO_HAY_CARTA_EN_TU_UBICACION_EN_ZONA_BATALLA = 'No hay carta en tu ubicación de zona de batalla',
  CARTA_ATACANTE_NO_TIENE_ATAQUE_DISPONIBLE = 'Carta atacante no tiene ataque disponible',
  CARTA_ATACANTE_NO_EN_POSICION_ATAQUE = 'Carta atacante no está en posición de ataque',
  NO_HAY_CARTA_EN_UBICACION_EN_ZONA_BATALLA_ENEMIGA = 'No hay carta en ubicación de zona de batalla enemiga'
}

export enum ResultadoAtacarBarrera {
  SIN_CARTAS_EN_ZONA_BATALLA = 'Sin cartas en zona de batalla',
  HAY_CARTAS_EN_ZONA_BATALLA_ENEMIGA = 'Hay cartas en zona de batalla enemiga',
  NO_QUEDAN_ATAQUES_DISPONIBLES = 'No le quedan ataques disponibles',
  ATAQUES_SOLO_SE_REALIZAN_EN_SEGUNDO_TURNO = 'Ataques solo se pueden realizar desde el segundo turno',
  POSIBLE = 'Posible',
  NO_HAY_CARTA_EN_TU_UBICACION_EN_ZONA_BATALLA = 'No hay carta en tu ubicación de zona de batalla',
  CARTA_ATACANTE_NO_ESTA_EN_POSICION_ATAQUE = 'Carta atacante no está en posición de ataque',
  CARTA_ATACANTE_NO_TIENE_ATAQUES_DISPONIBLES = 'Carta atacante no tiene ataque disponible'
}

export enum ResultadoCambiarPosicion {
  SIN_CARTAS_EN_ZONA_BATALLA = 'Sin cartas en zona de batalla',
  SIN_CAMBIOS_DE_POSICION_DISPONIBLES = 'Sin cambios de posición disponibles',
  POSIBLE = 'Posible',
  NO_HAY_CARTA_EN_TU_UBICACION_EN_ZONA_BATALLA = 'No hay carta en tu ubicación de zona de batalla',
  CARTA_NO_TIENE_DISPONIBLE_CAMBIO_POSICION = 'Carta indicada no tiene disponible el cambio de posición',
  POSICION_CAMBIADA = 'Posicion cambiada'
}

export enum ResultadoColocarCarta {
  YA_COLOCO_CARTA_EN_ESTE_TURNO = 'Ya colocó cartas en este turno',
  ZONA_BATALLA_ESTA_LLENA = 'La zona de batalla está llena',
  POSIBLE = 'Posible',
  NO_HAY_CARTA_EN_LA_MANO_EN_ESA_POSICION = 'No hay carta en la mano para esa posición',
  POSICION_EN_ZONA_BATALLA_OCUPADA = 'Posición en zona de batalla está ocupada',
  CARTA_COLOCADA = 'Carta colocada',
}

export enum EstadoCarta {
  ACTIVA = 'ACTIVA', // Carta activa
  DESTRUIDA = 'DESTRUIDA', // Carta destruida
};
