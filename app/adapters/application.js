import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from 'prison-rideshare-ui/config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: config.DS.host,
  namespace: config.DS.namespace,

  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');

    if (access_token) {
      xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
    }
  },

  urlForCreateRecord(modelName) {
    switch (modelName) {
      case 'user':
      case 'users':
        return this._super.apply(this, arguments).replace('users', 'register');
      default:
        return this._super(...arguments);
    }
  },

  urlForQuery(query) {
    if (query.overlaps) {
      delete query.overlaps;
      return `${this._super(...arguments)}/overlaps`;
    }

    return this._super(...arguments);
  },

  urlForQueryRecord(query) {
    if (query.me) {
      delete query.me;
      return `${this._super(...arguments)}/me`;
    }

    return this._super(...arguments);
  },
});
