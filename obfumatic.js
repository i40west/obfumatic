class ObfuMatic extends HTMLElement {
    // define the observed attributes
    static get observedAttributes() {
        return ['stuff', 'say'];
    }
    constructor() {
        super();
        // create a shadow root
        this._shadowRoot = this.attachShadow({ mode: 'closed' });
        this._setContent();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // called when an attribute is added, removed, or updated
        this._setContent();
    }

    _setContent() {
        const decodedValue = this.getDecodedStuff();
        const visibleText = this.getAttribute('say') || decodedValue;
        const mailToLink = `<a part="link" href="mailto:${decodedValue}">${visibleText}</a>`;
        this._shadowRoot.innerHTML = `
            <style>
              a {
                color: var(--link-color, inherit);
                transition: var(--link-hover-transition, none);
                text-decoration: var(--link-text-decoration, underline);
                text-decoration-color: var(--link-underline-color, initial);
                text-decoration-thickness: var(--link-underline-thickness, initial);
              }
              a:hover {
                color: var(--link-hover-color, inherit);
                text-decoration: var(--link-hover-text-decoration, var(--link-text-decoration, underline));
                text-decoration-color: var(--link-underline-hover-color, var(--link-underline-color, initial));
              }
              a::selection {
                color: var(--selection-a-color, inherit);
                background-color: var(--selection-bg, inherit);
              }
            </style>
            <span part="span">${mailToLink}</span>`;
    }

    getDecodedStuff() {
        if (!this.hasAttribute('stuff')) { return ''; }
        return atob(atob(this.getAttribute('stuff')));
    }
}

// define the custom element
customElements.define('obfu-matic', ObfuMatic);
