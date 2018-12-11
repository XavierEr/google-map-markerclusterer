import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import { MarkerclusterIconMixin } from './google-map-markercluster-icon-mixin.js';

var BASE_IMAGE_URL = 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/';
var DEFAULT_STYLES = [
  {
    url: BASE_IMAGE_URL + 'm1.png',
    width: '53px',
    height: '52px',
    textColor: 'black',
    textSize: '11px'
  },
  {
    url: BASE_IMAGE_URL + 'm2.png',
    width: '56px',
    height: '56px',
    textColor: 'black',
    textSize: '11px'
  },
  {
    url: BASE_IMAGE_URL + 'm3.png',
    width: '66px',
    height: '66px',
    textColor: 'black',
    textSize: '12px'
  },
  {
    url: BASE_IMAGE_URL + 'm4.png',
    width: '78px',
    height: '78px',
    textColor: 'black',
    textSize: '13px'
  },
  {
    url: BASE_IMAGE_URL +'m5.png',
    width: '90px',
    height: '90px',
    textColor: 'black',
    textSize: '14px'
  }
];
/*
 * The `google-map-defaulticon` element is displayed by default when the user does not provide a custom cluster icon.
 * @customElement
 * @polymer
 */
class GoogleMapDefaultIcon extends MarkerclusterIconMixin(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          position:absolute;
          user-select: none;
        }
        .icon  {
          position:absolute;
          left:0;
          top:0;
        }
        .text {
          position:absolute;
          text-align:center;
          font-family: Arial,sans-serif;
          font-weight: bold;
          font-style: normal;
          text-decoration: none;
        }
      </style>

      <img class="icon" id="icon" src\$="{{_iconStyle.url}}">
      <div class="text" id="text">{{_computeText(markers)}}</div>
  `;
  }

  static get is() { return 'google-map-defaulticon'; }

  static get properties() {
    return {
      /**
       * The list of styles that should be applied to the cluster icon for the various
       * cluster levels. If not set, the default styles will be used.
       * Must be of object with following keys `{url,width,height,textColor,textSize}`
       */
      styles :  {
        type:Array,
        value: () => DEFAULT_STYLES,
      },

      /**
       * The active style for the current cluster level
       */
      _iconStyle : {
        type: Object,
        value: () => ({}),
      }
    }
  }

  static get observers() {
    return [
      '_updateCustom(markers,styles)'
    ];
  }

  /**
   * Calculates the index of the active style that should be displayed for the current cluster.
   */
  _calcActiveStyleIndex(markerLength, numStyles) {
    let index = 0;
    let dv = markerLength;

    while (dv !== 0) {
      dv = parseInt(dv / 10, 10);
      index++;
    }

    return Math.max(0, Math.min(index, numStyles) - 1);
  }

  /**
   * Returns the text that should be displayed
   */
  _computeText(markers) {
    return markers.length;
  }

  /**
   * Observer function that is called when either the `markers` or `styles` is changed.
   */
  _updateCustom(markers, styles) {
      styles = styles || DEFAULT_STYLES;
      // check also cluster.markers because remove on cluster will also delete the markers field
      if (!markers || !styles) return;

      this._iconStyle = styles[this._calcActiveStyleIndex(markers.length,styles.length)];

      const iconStyleHeight = this._iconStyle.height;
      const iconStyleWidth = this._iconStyle.width;
      const iconOffset = this._iconStyle.anchorIcon
        || [
          `${Number(iconStyleHeight) / 2}px`,
          `${Number(iconStyleWidth) / 2}px`,
        ];
      const textOffset = this._iconStyle.anchorText || ['0px', '0px'];

      this.$.text.style.position='absolute';
      this.$.text.style.width = iconStyleWidth;
      this.$.text.style.height = iconStyleHeight;
      this.$.text.style.top = textOffset[0];
      this.$.text.style.left = textOffset[1];
      this.$.text.style.color = this._iconStyle.textColor;
      this.$.text.style.fontSize = this._iconStyle.textSize;
      this.$.text.style.lineHeight = iconStyleHeight;

      this.style.left = '-'+iconOffset[1];
      this.style.top = '-'+iconOffset[0];
  }
}

window.customElements.define(GoogleMapDefaultIcon.is, GoogleMapDefaultIcon);
