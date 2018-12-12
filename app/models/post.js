import { computed, get } from '@ember/object';
import DS from 'ember-data';
import { modelAction, resourceAction } from 'ember-custom-actions';

export default DS.Model.extend({
  body: DS.attr('string'),
  unread: DS.attr('boolean'),

  bodyJson: computed('body', {
    get() {
      let body = this.get('body');

      if (body) {
        return JSON.parse(this.get('body'));
      } else {
        return undefined;
      }
    },

    set(key, value) {
      this.set('body', JSON.stringify(value));
      return value;
    },
  }),

  poster: DS.belongsTo('user'),

  insertedAt: DS.attr('date'),

  validationErrors: computed('errors.[]', function() {
    const attributes = get(this.constructor, 'attributes');
    return attributes._keys.list.reduce((response, key) => {
      const errors = this.get(`errors.${key}`) || [];
      response[key] = errors.mapBy('message');
      return response;
    }, {});
  }),

  markAllRead: resourceAction('readings', {
    method: 'POST',
    pushToStore: true,
  }),
  markRead: modelAction('readings', { method: 'POST', pushToStore: true }),
  markUnread: modelAction('readings', { method: 'DELETE', pushToStore: true }),
});
