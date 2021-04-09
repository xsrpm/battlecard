class JugadorPanel extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({ mode: "open" });
        this.render()
    }
    static get observedAttributes() {
        return ["en-turno"];
    }
    attributeChangedCallback(attr, oldVal, newVal) {
        if (attr === "en-turno") {
            if(newVal === "true")
                this.shadowRoot.children[0].classList.add("jugEnTurno")
            else
                this.shadowRoot.children[0].classList.remove("jugEnTurno")
        }
    }
    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <div>
                <h2><slot name="jugadorNombre">Jugador Enemigo</slot></h2>
                <h3>Deck: <span><slot name="nCartas">20</slot></span></h3>
                <p>En turno</p>
            </div>
          ${this.getStyles()}
        `;
        return template;
      }
      getStyles() {
        return `
          <style>
            div{
                opacity:0.5;
                width:15vw;
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
        `;
      }
      render() {
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
      }
}

customElements.define("jugador-panel", JugadorPanel);