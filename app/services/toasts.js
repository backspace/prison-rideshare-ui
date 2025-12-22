import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { cancelTask, runTask } from 'ember-lifeline';
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
      this.#dismissTimer = runTask(
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
      cancelTask(this, this.#dismissTimer);
      this.#dismissTimer = null;
    }
  }
}
