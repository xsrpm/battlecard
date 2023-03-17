import classes from './styles.module.css'

export default function ResultAttack () {
  return (
    <div className={classes.resultadoAtaque}>
      <div className="atacante">
        <slot name="nombre-atacante"></slot>
      </div>
      <div id="cartaAtacante" className="carta">
        <slot name="valor-atacante"></slot>
        <slot name="elemento-atacante"></slot>
      </div>
      <div className="bonusAtacante">
        <slot name="bonus-atacante"></slot>
      </div>
      <div className="vs">
        <span>VS</span>
      </div>
      <div className="resultado">
        <slot name="resultado"></slot>
      </div>
      <div className="detalleResultado">
        <slot name="detalle-resultado"></slot>
      </div>
      <div className="atacado">
        <slot name="nombre-atacado"></slot>
      </div>
      <div id="cartaAtacada" className="carta">
        <slot name="valor-atacado"></slot>
        <slot name="elemento-atacado"></slot>
      </div>
      <div className="bonusAtacado">
        <slot name="bonus-atacado"></slot>
      </div>
    </div>
  )
}
