import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

/**
 * Use `ClusterIconBehavior` to implement elements that should display a custom cluster icon.
 * Users should implement the `updateMarkers` function if they need to customize based on the markers that are contained
 * in the cluster.
 * @polymer
 * @mixinFunction
*/
export const MarkerclusterIconMixin = dedupingMixin((superClass) => {
  return class extends superClass {
    static get properties() {
      return {
        /**
         * The markers that are contained in the cluster.
         */
        markers: {
          type: Array,
          observer: 'updateMarkers'
        }
      };
    }
    /**
     * Observer function that is called when the `markers` Array is changed.
     */
    updateMarkers(markers) {
      //abstract
    }
  }
});
