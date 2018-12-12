import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import { GoogleMapOverlayviewMixin } from './google-map-overlayview-mixin.js';
/*
 * The `google-map-markercluster` is an internal element that is used by `google-map-markerclusterer`. By default it wraps a `<google-map-defaulticon>` element
 * @customElement
 * @polymer
 */
class GoogleMapMarkerCluster extends GoogleMapOverlayviewMixin(PolymerElement) {
  static get template() {
    return html`
      <div hidden\$="{{hidden}}">
        <slot id="overlayContent"></slot>
      </div>
    `;
  }

  static get is() { return 'google-map-markercluster'; }

  /**
   * Fired when the mouse enters the area of the cluster.
   * @param {google.maps.MouseEvent} event The mouse event.
   * @event google-map-markercluster-mouseover
   */

  /**
   * Fired when the mouse leaves the area of the cluster.
   * @param {google.maps.MouseEvent} event The mouse event.
   * @event google-map-markercluster-mouseout
   */

  /**
   * Fired when the cluster was clicked.
   * @param {google.maps.MouseEvent} event The mouse event.
   * @event google-map-markercluster-click
   */

  constructor() {
    super();
    this.markers = [];
    this._listeners = {};
  }

  static get properties() {
    return {
      /**
       * The center position of the cluster element (lat,lon)
       */
      center:{
        type: Object,
        value: null,
        notify: true,
      },

      /**
       * When set the cluster icon is hidden
       */
      hidden: {
        type: Boolean,
        value: false,
      },
    };
  }

  ready() {
    super.ready();

    this.$.overlayContent.addEventListener('slotchange', this._initClusterSubIcon.bind(this));
    setTimeout(this._initClusterSubIcon.bind(this));
  }

  _initClusterSubIcon() {
    const contents =
      this.$.overlayContent
        .assignedNodes({ flatten: true })
        .filter(n => n.ELEMENT_NODE === Node.ELEMENT_NODE);

    if (contents.length > 0) {
      this.clusterSubIcon = contents[0];
      this.clusterSubIcon.markers = this.markers;
    }
  }

  disconnectedCallback() {
    this.map = null;
  }

  /**
   * draw callback when the cluster is drawn.
   */
  draw() {
    if (this.visible) {
      const pos = this.getPosFromLatLng(this.center);

      this.style.top = pos.y + 'px';
      this.style.left = pos.x + 'px';
    }
  }

  /**
   * Update the icon when a marker is added
   */
  _updateIcon() {
    var mCount = this.markers.length;

    if (this.maxZoom !== null && this.map.getZoom() > this.maxZoom) {
     this.hidden = true;
     return;
    }

    if (mCount < this.minimumClusterSize) {
       // Min cluster size not yet reached.
       this.hidden = true;
       return;
    }

    if (this.clusterSubIcon) {
      this.clusterSubIcon.markers = this.markers;
    }

    this.hidden = false;
  }

  /**
   * Check if the marker was already added
   */
  _isMarkerAlreadyAdded(marker) {
    if (this.markers.indexOf) {
      return this.markers.indexOf(marker) !== -1;
    } else {
      for (let i = 0; i < this.markers.length; i += 1) {
        if (marker === this.markers[i]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
  * Calculates the extended bounds that is given by the contained markers.
  */
  _calculateBounds() {
     const bounds = new google.maps.LatLngBounds(this.center, this.center);
     this.bounds = this.getExtendedBounds(bounds,this.gridSize);
  }

  /**
   * Check if marker is inside the extended bounds.
   */
  isMarkerInClusterBounds(marker) {
    return this.bounds.contains(marker.getPosition());
  }

  /**
   * Calculates the bounds that is given by the contained markers.
   */
  _getBounds() {
     const bounds = new google.maps.LatLngBounds(this.center, this.center);

     for (let i = 0; i < this.markers.length; i++) {
       bounds.extend(this.markers[i].getPosition());
     }

     return bounds;
  }

  /**
   * Adds a marker to the cluster and updates the cluster icon
   */
  addMarker(marker) {
    if (this._isMarkerAlreadyAdded(marker)) {
     return false;
    }

    if (!this.center) {
     this.center = marker.getPosition();
     this._calculateBounds();
    } else {
     if (this.averageCenter) {
       const l = this.markers.length + 1;
       const lat = (this.center.lat() * (l - 1) + marker.getPosition().lat()) / l;
       const lng = (this.center.lng() * (l - 1) + marker.getPosition().lng()) / l;

       this.center = new google.maps.LatLng(lat, lng);
       this._calculateBounds();
     }
    }

    marker.isAdded = true;
    this.markers.push(marker);

    let mCount = this.markers.length;
    let mz = this.maxZoom;

    if (mz !== null && this.map.getZoom() > mz) {
     // Zoomed in past max zoom, so show the marker.
     if (marker.getMap() !== this.map) {
       marker.setMap(this.map);
     }
    } else if (mCount < this.minimumClusterSize) {
     // Min cluster size not reached so show the marker.
     if (marker.getMap() !== this.map) {
       marker.setMap(this.map);
     }
    } else if (mCount === this.minimumClusterSize) {
     // Hide the markers that were showing.
     for (let i = 0; i < mCount; i++) {
       this.markers[i].setMap(null);
     }
    } else {
     marker.setMap(null);
    }

    this._updateIcon();
    return true;
  }

  /**
   * onRemove callback when the cluster is removed.
   * Clears the event listeners.
   */
  onRemove() {
    this._clearListener('mouseout');
    this._clearListener('mouseover');
    this._clearListener('click');
    this._clearListener('mousedown');
    this._clearListener('boundsChanged');
    google.maps.event.clearInstanceListeners(this);

    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }

    this.markers = [];
  }

  /**
   * onAdd callback when the cluster is added.
   * Event listeners for various events are setup.
   */
  onAdd() {
    this.style.position = 'absolute';
    this.style.cursor='pointer';
    var cMouseDownInCluster;
    var cDraggingMapByCluster;

    this.overlay.getPanes().overlayMouseTarget.appendChild(this);

    // Fix for Issue 157
    this._listeners.boundsChanged = google.maps.event.addListener(
      this.map,
      'bounds_changed',
      function () {
        cDraggingMapByCluster = cMouseDownInCluster;
      });

    this._listeners.mousedown = google.maps.event.addDomListener(
      this,
      'mousedown',
      function () {
        cMouseDownInCluster = true;
        cDraggingMapByCluster = false;
      });

    this._listeners.click = google.maps.event.addDomListener(
      this,
      'click',
      function (e) {
        cMouseDownInCluster = false;
        this.dispatchEvent(new CustomEvent('google-map-markercluster-click', { bubbles: true, composed: true }));
        if (!cDraggingMapByCluster) {
          var theBounds;
          var mz;
                      if (!this.zoomOnClick) {
            return;
                      }
          mz = this.maxZoom;
          theBounds = this._getBounds();
          this.map.fitBounds(theBounds);
          // There is a fix for Issue 170 here:
        /* this.async(function() {
            this.map.fitBounds(theBounds);
            // Don't zoom beyond the max zoom level

          },null,100);*/
          if (mz !== null && (this.map.getZoom() > mz)) {
            this.map.setZoom(mz + 1);
          }
          // Prevent event propagation to the map:
          e.cancelBubble = true;
          if (e.stopPropagation) {
            e.stopPropagation();
          }
        }
      }.bind(this));


    this._forwardEvent('mouseover');
    this._forwardEvent('mouseout');

  }
  _forwardEvent(name) {
    this._listeners[name] = google.maps.event.addDomListener(
      this,
      name,
      function() {
        this.dispatchEvent(new CustomEvent('google-map-markercluster-' + name, { bubbles: true, composed: true }));
      }.bind(this));
  }

  _clearListener(name) {
    if (this._listeners[name]) {
      google.maps.event.removeListener(this._listeners[name]);
      this._listeners[name] = null;
    }
  }
}

window.customElements.define(GoogleMapMarkerCluster.is, GoogleMapMarkerCluster);
