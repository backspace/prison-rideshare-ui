import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from 'prison-rideshare-ui/config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: config.DS.host,
  namespace: config.DS.namespace,
  authorizer: 'authorizer:application'
});
