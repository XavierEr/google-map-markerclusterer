import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import { MarkerclusterIconMixin } from '../google-map-markercluster-icon-mixin.js';
import './my-css-pie.js';

class MyCustomClusterIcon extends MarkerclusterIconMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        position:absolute;
        top:-15px;
        left:-15px;
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
        font-size:16px;
        width:30px;
        line-height:30px;
        color:black;
        top:0;
        left:0;
      }
    </style>
    <div class="icon" id="icon"><my-css-pie id="pie" size="30"></my-css-pie>
    <div class="text" id="text">{{text}}</div>
  </div>
`;
  }

  static get is() { return 'my-custom-clustericon'; }
  static get properties() {
    return {
      iconOffset: {
        type:Array,
        value: function()  {return ["15px","15px"]}
      },
      textOffset: {
        type:Array,
        value: function()  {return [0,0]}
      }
    }
  }

  constructor() {
    super();
  }
  ready() {
    super.ready();
  }
  updateMarkers(markers) {
    this.$.pie.data = [10,20,40,30];
    this.text = markers.length;
  }
}

window.customElements.define(MyCustomClusterIcon.is, MyCustomClusterIcon);
