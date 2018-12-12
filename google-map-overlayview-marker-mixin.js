import { GoogleMapOverlayviewMixin } from './google-map-overlayview-mixin.js';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin';

/**
 * Use `GoogleMapOverlayViewMarkerBehavior` to implement elements that should be displayed as `Marker` on a `google-map` using an overlayview
 * Users should either override the `_update` if they need to customize the positioning.
 * @polymer
 * @mixinFunction
 */
export const GoogleMapOverlayviewMarkerMixin = dedupingMixin((superClass) => {
  return class extends GoogleMapOverlayviewMixin(superClass) {
    static get properties() {
      return {
        /**
        * The position of the marker on the map
        */
        position: {
          type: Object,
          value: null
        },

        /**
        * The size of the marker
        */
        size: {
          type: Number,
          value: 25,
        },

        /**
        * Set to true if the marker should be draggable
        */
        isDraggable: {
          type: Boolean,
          value: false
        },
      }
    }

    ready() {
      super.ready();
      this.style.position = 'absolute';
    }

    /**
    * Returns the position of the marker
    */
    getPosition() {
      return this.position;
    }

    /**
    * Returns whether marker is draggable.
    */
    getDraggable() {
      return this.isDraggable;
    }

    /**
    * Returns the map instance.
    */
    getMap() {
      return this.overlay ? this.overlay.getMap() : null;
    }
    /**
    * Sets the map instance
    */
    setMap(map) {
      if (this.overlay && this.overlay instanceof google.maps.OverlayView) {
        this.overlay.setMap(map);
      }
    }

    /**
    * Draw callback forwarded to the function `update`.
    */
    draw() {
      this.update(this.position, this.size);
    }

    /**
    * Override this function to implement custom positioning.
    * By default will `left` and `top` CSS settings are used to position the element.
    */
    update(position, size) {
      const projection = this.overlay.getProjection();
      if( projection ) {
        const mapPos = projection.fromLatLngToDivPixel(position), style = this.style;
        style.left = (mapPos.x - size / 2) + 'px';
        style.top = (mapPos.y - size / 2) + 'px';
      }
    }
  };

});
