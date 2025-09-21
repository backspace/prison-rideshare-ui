/* eslint-disable ember/no-classic-classes*/
import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { modelAction, resourceAction } from 'ember-custom-actions';

export default Model.extend({
  body: attr('string'),
  unread: attr('boolean'),

  bodyJson: computed('body', {
    get() {
      let body = this.body;

      if (body) {
        return JSON.parse(this.body);
      } else {
        return undefined;
      }
    },

    set(key, value) {
      this.set('body', JSON.stringify(value));
      return value;
    },
  }),

  poster: belongsTo('user'),

  insertedAt: attr('date'),

  validationErrors: computed(
    'constructor.attributes',
    'errors.[]',
    function () {
      const attributes = this.constructor.attributes;
      return Array.from(attributes.keys()).reduce((response, key) => {
        const errors = this.get(`errors.${key}`) || [];
        response[key] = errors.mapBy('message');
        return response;
      }, {});
    },
  ),

  markAllRead: resourceAction('readings', {
    method: 'POST',
    pushToStore: true,
  }),
  markRead: modelAction('readings', { method: 'POST', pushToStore: true }),
  markUnread: modelAction('readings', { method: 'DELETE', pushToStore: true }),
});
