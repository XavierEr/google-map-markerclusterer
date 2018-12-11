import { html, PolymerElement } from '@polymer/polymer';

import '../google-map-markerclusterer.js';
import { randomizeMarkers, fetchDataJson } from './demo-helpers.js';

export class TestMap extends PolymerElement {
  static get is() { return 'test-map' }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
        }

        * {
          box-sizing: border-box;
        }

        google-map {
          max-width: calc(100vw / 16 * 9);
          min-width: 100px;
          min-height: 100px;
          width: 100%;
          height: 100%;
          margin: 0 auto;
          padding-top: 100%;
        }

        .bullet {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: red;
        }
      </style>

      <google-map
        id="mapelement"
        latitude="39.91"
        longitude="116.38"
        zoom="2"
        map="{{map}}"></google-map>
      <google-map-markerclusterer
        map="{{map}}"
        max-zoom="16"
        minimum-cluster-size="2"
        grid-size="60"
        markers="[[markersToDisplay]]"
        average-center="false"
        styles="[[styles]]">
        <!-- <slot slot="cluster-icon" id="custom_cluster_icon" name="clustericon"></slot> -->
        <div slot="cluster-icon" class="bullet"></div>
      </google-map-markerclusterer>
    `;
  }

  static get properties() {
    return {
      map: {
        type: Object,
        notify: true,
        value: () => null,
        observer: '_mapChanged',
      },

      markersToDisplay: {
        type: Array,
        value: () => [],
      },

      styles: {
        type: Object,
        value: () => {
          return [{
              url: 'people35.png',
              width: "35px",
              height: "35px",
              textColor: '#ff00ff',
              textSize: "10px"
          }, {
              url: 'people45.png',
              width: "45px",
              height: "45px",
              textColor: '#ff0000',
              textSize: "11px"
          }, {
              url: 'people55.png',
              width: "55px",
              height: "55px",
              textColor: '#ffffff',
              textSize: "12px"
          }].map(n => (n.url = `${this.BASE_IMAGE_URL}/${n.url}`));
        },
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  _mapChanged() {
    if (this.map == null) return;

    fetchDataJson(this.DATA_JSON_URL)
      .then(r => r.text())
      .then(data => data.replace('var data = ', ''))
      .then(data => JSON.parse(data))
      .then((data) => {
        this.markersToDisplay = randomizeMarkers(data);
      });
  }

  get BASE_IMAGE_URL() {
    return 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images';
  }

  get DATA_JSON_URL() {
    return 'http://timeu.github.io/google-map-markerclusterer/components/google-map-markerclusterer/demo/data.json';
  }
}

window.customElements.define(TestMap.is, TestMap);
