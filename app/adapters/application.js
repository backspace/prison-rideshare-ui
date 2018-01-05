import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from 'prison-rideshare-ui/config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: config.DS.host,
  namespace: config.DS.namespace,
  authorizer: 'authorizer:application',

  urlForCreateRecord(modelName) {
    switch(modelName) {
      case 'user':
      case 'users':
        return this._super.apply(this, arguments).replace('users', 'register');
      default:
        return this._super(...arguments);
    }
  },

  urlForQueryRecord(query) {
    if (query.me) {
      delete query.me;
      return `${this._super(...arguments)}/me`;
    }

    return this._super(...arguments);
  }
});
