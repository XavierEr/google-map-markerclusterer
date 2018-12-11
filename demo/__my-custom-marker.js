import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
// import '../google-map-overlayview-mixin.js';

import './my-css-pie.js';
import { GoogleMapOverlayviewMarkerMixin } from '../google-map-overlayview-marker-mixin.js';

class MyCustomMarker extends GoogleMapOverlayviewMarkerMixin(PolymerElement) {
  static get template() {
    return html`
    <my-css-pie id="chart" data="{{data}}"></my-css-pie>
`;
  }

  static get is() { return 'my-custom-marker'; }

  constructor() {
    super();
    this.infoWindow = null;
    this.data = [10,20,40,30];
  }

  ready() {
    super.ready();
    this.addEventListener('click', function(event) {
      this.onClickMarker();
    }.bind(this));
  }

  onAdd() {
    this.style.cursor="pointer";
    //this.pieChart.data = this.data ;
    this.$.chart.size = 25;
    var panes = this.overlay.getPanes();
    panes.overlayMouseTarget.appendChild(this);
  }
  onClickMarker() {
    if (!this.infoWindow) {
      this.infoWindow = new google.maps.InfoWindow();
    }
    var divContainer = document.createElement("div");
    divContainer.style.width="150px";
    divContainer.style.height="140px";
    var pieChart = document.createElement('my-css-pie');
    pieChart.data = this.data;
    pieChart.size = 100;
    divContainer.appendChild(pieChart);
    this.infoWindow.setContent(divContainer);
    this.infoWindow.setPosition(this.position);
    this.infoWindow.open(this.overlay.getMap());

  }
  onRemove() {
      super.onRemove();
      if (!this.pieChart)
        return;
      this.shadowRoot.removeChild(this.pieChart);
      this.infoWindow = null;
  }
}

window.customElements.define(MyCustomMarker.is, MyCustomMarker);
