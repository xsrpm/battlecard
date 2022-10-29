export class JugadorPanel extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.render()
  }

  static get observedAttributes () {
    return ['en-turno']
  }

  attributeChangedCallback (attr: string, _oldVal: any, newVal: string) {
    if (attr === 'en-turno') {
      if (newVal === 'true') {
        (this.shadowRoot as ShadowRoot).children[0].classList.add('jugEnTurno')
      } else {
        (this.shadowRoot as ShadowRoot).children[0].classList.remove('jugEnTurno')
      }
    }
  }

  getTemplate () {
    const template = document.createElement('template')
    template.innerHTML = `
            <div>
                <h2><slot name="jugadorNombre">Jugador Enemigo</slot></h2>
                <h3>Deck: <span><slot name="nCartas">20</slot></span></h3>
                <p>En turno</p>
            </div>
          ${this.getStyles()}
        `
    return template
  }

  getStyles () {
    return `
          <style>
            :host{
                
            }
            div{
                display:flex;
                flex-direction:column;
                justify-content: center;
                word-wrap: break-word;
                text-align: center;
                opacity:0.5;
                height:100%;
                background-color: rgb(236, 236, 192);
            }
            div p{
                visibility: hidden
            }
            .jugEnTurno{
                opacity:1;
                border-style: double;
            }
            .jugEnTurno p{
                visibility: visible;
                color:red;
                font-weight: bolder;
            }
          </style>
        `
  }

  render () {
    (this.shadowRoot as ShadowRoot).appendChild(this.getTemplate().content.cloneNode(true))
  }
}

customElements.define('jugador-panel', JugadorPanel)
