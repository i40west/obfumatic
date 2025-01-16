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
        const decodedValue = this.sanitizeHtml(this.getDecodedStuff());
        const visibleText = this.sanitizeHtml(this.getAttribute('say')) || decodedValue;
        const mailToLink = `<a part="link" href="mailto:${decodedValue}">${visibleText}</a>`;
        this._shadowRoot.innerHTML = `
            <style>
            a {
                color: var(--link-color, revert);
                transition: var(--link-hover-transition, none);
                text-decoration: var(--link-text-decoration, revert);
                text-decoration-color: var(--link-underline-color, revert);
                text-decoration-thickness: var(--link-underline-thickness, revert);
                text-decoration-style: var(--link-underline-style, revert);
            }
            a:hover {
                color: var(--link-hover-color, revert);
                text-decoration: var(--link-hover-text-decoration, var(--link-text-decoration, revert));
                text-decoration-color: var(--link-underline-hover-color, var(--link-underline-color, revert));
                text-decoration-style: var(--link-underline-hover-style, var(--link-underline-style, revert));
            }
            a::selection {
                color: var(--selection-a-color, revert);
                background-color: var(--selection-bg, revert);
            }
            </style>
            <span part="span">${mailToLink}</span>`;
    }

    getDecodedStuff() {
        if (!this.hasAttribute('stuff')) { return ''; }
        const stuff = this.sanitizeStuff(this.getAttribute('stuff'));
        return atob(atob(stuff));
    }

    sanitizeStuff(stuff) {
        // Check if stuff is a valid base64 string
        if (/^[A-Za-z0-9+/]*={0,2}$/.test(stuff)) {
            return stuff;
        } else {
            console.error('Invalid base64 string in stuff attribute');
            return '';
        }
    }

    sanitizeHtml(str) {
        if (str === null || str === undefined) {
            return null;
        }

        // Escape any special characters
        return str.replace(/["'<>&]/g, function(m) {
            switch (m) {
                case '"': return '&quot;';
                case "'": return '&#039;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
            }
        });
    }
}

// define the custom element
customElements.define('obfu-matic', ObfuMatic);
