/* eslint-disable */
// Adapted from https://github.com/adopted-ember-addons/ember-paper/blob/002fa43fd64a609b55d90daeecc0e151085b40e3/addon/services/paper-toaster.js
import { reads } from '@ember/object/computed';
import { assign } from '@ember/polyfills';
import { cancel, later } from '@ember/runloop';
import { A } from '@ember/array';
import Service from '@ember/service';
import EObject from '@ember/object';
import config from 'ember-get-config';
import { action } from '@ember/object';

const DEFAULT_PROPS = {
  duration: 3000,
  position: 'bottom left',
};

export default Service.extend({
  queue: A(),

  activeToast: reads('queue.firstObject'),

  show(text, options) {
    let t = EObject.create(
      assign({ text, show: true }, this.buildOptions(options)),
    );
    this.queue.pushObject(t);
    this.scheduleAutoDismiss(t);
    return t;
  },

  showComponent(componentName, options) {
    let t = EObject.create(
      assign({ componentName, show: true }, this.buildOptions(options)),
    );
    this.queue.pushObject(t);
    this.scheduleAutoDismiss(t);
    return t;
  },

  @action
  cancelToast(toast) {
    this.clearScheduledDismiss(toast);
    toast.set('show', false);

    if (this.activeToast === toast) {
      later(() => {
        if (toast.onClose) {
          toast.onClose();
        }
        this.queue.removeObject(toast);
      }, 400);
    } else {
      if (toast.onClose) {
        toast.onClose();
      }
      this.queue.removeObject(toast);
    }
  },

  scheduleAutoDismiss(toast) {
    let { duration } = toast;

    if (duration === false || duration === null || duration === undefined) {
      return;
    }

    if (typeof duration === 'number' && duration > 0) {
      toast.set(
        '_dismissTimer',
        later(() => {
          // Only close if still visible and in queue to avoid canceling a replaced toast.
          if (this.queue.includes(toast) && toast.show !== false) {
            this.cancelToast(toast);
          }
        }, duration),
      );
    }
  },

  clearScheduledDismiss(toast) {
    let dismissTimer = toast.get('_dismissTimer');

    if (dismissTimer) {
      cancel(dismissTimer);
      toast.set('_dismissTimer', null);
    }
  },

  buildOptions(options) {
    let toasterOptions = {};
    if (config['ember-paper'] && config['ember-paper']['paper-toaster']) {
      toasterOptions = config['ember-paper']['paper-toaster'];
    }
    return assign({}, DEFAULT_PROPS, toasterOptions, options);
  },
});
