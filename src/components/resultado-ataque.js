class ResultadoAtaque extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({ mode: "open" });
        this.render()
    }
    static get observedAttributes() {
        return ["mostrar"];
    }
    attributeChangedCallback(attr, oldVal, newVal) {
        if (attr === "mostrar") {
            if(newVal === "true")
                this.shadowRoot.children[0].classList.add("mostrar")
            else
                this.shadowRoot.children[0].classList.remove("mostrar")
        }
    }
    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <div class="resultadoAtaque">
                <div class="atacante">
                    <slot name="nombre-atacante"></slot>
                </div>
                <div id="cartaAtacante" class="carta">
                    <slot name="valor-atacante"></slot><slot name="elemento-atacante"></slot>
                </div>
                <div class="bonusAtacante">
                    <slot name="bonus-atacante"></slot>
                </div>
                <div class="vs">
                    <span>VS</span>
                </div>
                <div class="resultado">
                    <slot name="resultado"></slot>
                </div>
                <div class="detalleResultado">
                    <slot name="detalle-resultado"></slot>
                </div>
                <div class="atacado">
                    <slot name="nombre-atacado"></slot>
                </div>
                <div id="cartaAtacada" class="carta">
                    <slot name="valor-atacado"></slot><slot name="elemento-atacado"></slot>
                </div>
                <div class="bonusAtacado">
                    <slot name="bonus-atacado"></slot>
                </div>
            </div>
          ${this.getStyles()}
        `;
        return template;
    }
    getStyles() {
    return `
        <style>
            :host{
                position: absolute;
                visibility: hidden;
            }
            .resultadoAtaque{
                display: grid;
                grid-template-columns:1fr 1fr 1fr;
                grid-template-rows: 0.5fr 1fr 0.5fr;
                grid-template-areas: 
                                    "atacante vs atacado"
                                    "cartaAtacante resultado cartaAtacada"
                                    "bonusAtacante detalleResultado bonusAtacado";
                background-color: tomato;
                text-align: center;
                justify-items: center;
                align-items: center;
                
            }
            .resultadoAtaque.mostrar{
                visibility:visible;
            }
            .atacante{
                display: grid;
                grid-area: atacante;
            }
            .cartaAtacante{
                display: grid;
                grid-area: cartaAtacante;
            }
            .bonusAtacante{
                display: grid;
                grid-area: bonusAtacante;
            }
            .vs{
                display: grid;
                grid-area: vs;
            }
            .resultado{
                display: grid;
                grid-area: resultado;
            }
            .detalleResultado{
                display: grid;
                grid-area: detalleResultado;
            }
            .atacado{
                display: grid;
                grid-area: atacado;
            }
            .cartaAtacada{
                display: grid;
                grid-area: cartaAtacada;
            }
            .bonusAtacado{
                display: grid;
                grid-area: bonusAtacado;
            }
            .carta{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 4.5vw;
                height: 13vh;
                border-style: solid;
                border-color:rgb(71, 93, 192);
                border-width: 0.2em;
                background-color:white;
            }
        </style>
    `;
    }
    render() {
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
    }
}

customElements.define("resultado-ataque", ResultadoAtaque);