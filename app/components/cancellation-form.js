/* eslint-disable ember/no-actions-hash, ember/no-classic-classes, ember/no-classic-components, ember/require-tagless-components */
import Component from '@ember/component';

import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';

const reasons = Object.keys(reasonToIcon).sort();
const shortcuts = ['driver not found', 'visitor'];

const shortcutReasonToIcon = shortcuts.reduce(
  (shortcutReasonToIcon, shortcut) => {
    shortcutReasonToIcon[shortcut] = reasonToIcon[shortcut];
    return shortcutReasonToIcon;
  },
  {}
);

export default Component.extend({
  reasons,
  shortcutReasonToIcon,

  actions: {
    cancelledChanged(cancelled) {
      if (!cancelled) {
        this.set('ride.cancellationReason', null);
      }

      this.set('ride.cancelled', cancelled);
    },

    cancelViaShortcut(reason) {
      this.set('ride.cancelled', true);
      this.set('ride.cancellationReason', reason);
      this.save();
    },
  },
});
