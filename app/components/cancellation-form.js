import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
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

@classic
export default class CancellationForm extends Component {
  reasons = reasons;
  shortcutReasonToIcon = shortcutReasonToIcon;

  @action
  cancelledChanged(cancelled) {
    if (!cancelled) {
      this.set('ride.cancellationReason', null);
    }

    this.set('ride.cancelled', cancelled);
  }

  @action
  cancelViaShortcut(reason) {
    this.set('ride.cancelled', true);
    this.set('ride.cancellationReason', reason);
    this.save();
  }
}
