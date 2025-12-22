import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { cancel, later } from '@ember/runloop';
import { action } from '@ember/object';
import config from 'prison-rideshare-ui/config/environment';

const DEFAULT_DURATION = 3000;

export default class ToastsService extends Service {
  @tracked activeToast = null;

  #dismissTimer = null;

  show(message, options = {}) {
    this.dismiss();

    const toast = {
      message,
    };

    this.activeToast = toast;

    const duration = this.resolveDuration(options.duration);

    if (duration !== false && duration !== null && duration !== undefined) {
      this.#dismissTimer = later(
        this,
        () => {
          if (this.activeToast === toast) {
            this.dismiss(toast);
          }
        },
        duration,
      );
    }

    return toast;
  }

  @action
  dismiss(toast = this.activeToast) {
    if (!toast || this.activeToast !== toast) {
      return;
    }

    this.clearScheduledDismiss();
    this.activeToast = null;
  }

  resolveDuration(duration) {
    if (duration === undefined) {
      return config.toastDuration ?? DEFAULT_DURATION;
    }

    return duration;
  }

  clearScheduledDismiss() {
    if (this.#dismissTimer) {
      cancel(this.#dismissTimer);
      this.#dismissTimer = null;
    }
  }
}
