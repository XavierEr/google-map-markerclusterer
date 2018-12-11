import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@vowo/google-apis/google-client-loader.js';
import '@vowo/google-apis/google-js-api.js';
import '@vowo/google-apis/google-legacy-loader.js';
import '@vowo/google-apis/google-maps-api.js';

import { GoogleMapOverlayviewMixin } from './google-map-overlayview-mixin.js';
{/* <script type="module" src="./google-map-overlayview-behavior.js"></script>
<script type="module" src="../../google-apis/google-apis.js"></script> */}

/*
 * The `google-map-overlayview` element is a generic overlay container element.
 * It maps to the OverlayView of google maps v3.
 * <b>Example</b>:
 *     <google-map-overlayview><some-element /></google-map-overlayview>
 *
 * For example to embed a simple `<img>` element into a overlay use this code:
 *
 *     <google-map-overlayview><img src="URL" /></google-map-overlayview>
 *
 * It is also possible to embed another `custom element` inside a `<google-map-overlayview>`
 * @customElement
 * @polymer
 */
class GoogleMapOverlayView extends GoogleMapOverlayviewMixin(PolymerElement) {
  static get template() {
    return html`
      <slot id="overlayContent"></slot>
    `;
  }

  static get is() { return 'google-map-overlayview'; }
}

window.customElements.define(GoogleMapOverlayView.is, GoogleMapOverlayView);
