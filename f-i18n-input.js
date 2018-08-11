import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import {html} from '@polymer/polymer/polymer-element.js';
import 'f-i18n/f-i18n.js';
window.FirmFirm = window.FirmFirm || {};
FirmFirm.I18nInput = class I18nInput extends customElements.get('paper-input') {
  static get is() { return 'f-i18n-input'; }
  static get template() {
    if (!this.hasOwnProperty('_template')) {
      const baseClass = Object.getPrototypeOf(this.prototype).constructor;
      this._template = baseClass.template.cloneNode(true);
      // Hack around current paper-input bug
      const match = /Chrome\/(\d+)\..+/i.exec(navigator.userAgent);
      const patch = !match || match.length <= 1 || parseInt(match[1]) < 54
      if (patch) {
        this._template.content.appendChild(document.importNode(html`
          <style>
            :host {
              --paper-input-container-underline_-_display: none;
            }
            iron-input { display: flex; }
            input { border: solid 1px gray; }
            paper-input-error {
              left: inherit;
              right: inherit;
            }
          </style>
        `.content, true));
      }
      this._template.content.appendChild(document.importNode(html`
        <div>
          <f-i18n m="[[mLabel]]" value="{{label}}" provider></f-i18n>
          <f-i18n m="[[mErrorMessage]]" value="{{errorMessage}}" provider></f-i18n>
        </div>
      `.content, true));
    }
    return this._template;
  }
  static get properties() {
    return {
      /**
       * f-i18n message key for `label`, e.g. `"domain.message"`
       */
      mLabel: String,
      /**
       * f-i18n message key for `error-message`, e.g. `"domain.message"`
       */
      mErrorMessage: String,
      /**
       * If false, skips the validation
       */
      validatorActive: {
        type: Boolean,
        value: true,
      },
    };
  }
  ready() {
    super.ready();
    this.addEventListener('focus', this._onFocus.bind(this));
  }
  get keyBindings() {
    if (!this._fkeyBindings) {
      this._fkeyBindings = Object.assign({}, super.keyBindings, {
        'enter:keydown': '_onEnter',
      });
    }
    return this._fkeyBindings;
  }
  validate() {
    if (!this.validatorActive) return true;
    const result = super.validate();
    this.autoValidate = !result;
    return result;
  }
  _onEnter() {
    this.fire('enter');
  }
  _onFocus() {
    this.dispatchEvent(new Event('f-i18n-input-focus', {
      bubbles: true,
      composed: true,
    }));
  }
}
customElements.define(FirmFirm.I18nInput.is, FirmFirm.I18nInput);
