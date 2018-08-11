import 'f-i18n/f-i18n.js';
import {html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-toast/paper-toast.js';
window.FirmFirm = window.FirmFirm || {};
FirmFirm.I18nToast = class I18nToast extends customElements.get('paper-toast') {
  static get is() { return 'f-i18n-toast'; }
  static get template() {
    if (!this.hasOwnProperty('_template')) {
      this._template = Object.getPrototypeOf(this.prototype).constructor.template.cloneNode(true);
      const content = this._template.content;
      content.appendChild(document.importNode(html`
        <style>
          :host {min-width: 1em;}
          #label {vertical-align: middle;}
        </style>
        <f-i18n provider m="[[m]]" params="[[params]]" value="{{_msg}}"></f-i18n>
      `.content, true));
    }
    return this._template;
  }
  static get properties() {
    return {
      /**
       * `f-i18n` translation domain and key (e.g. `domain.key`).
       */
      m: String,
      params: String,
      _msg: {
        type: String,
        observer: '_msgChanged',
      },
    };
  }
  static get observers() {
    return ['_textChanged(text)'];
  }
  _msgChanged(newMsg) {
    this.text = newMsg;
    this._openedChanged(); // triggers resize
  }
}
customElements.define(FirmFirm.I18nToast.is, FirmFirm.I18nToast);
