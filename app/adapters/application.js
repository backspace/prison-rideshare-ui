import DS from 'ember-data';
import config from 'prison-rideshare-ui/config/environment';

export default DS.JSONAPIAdapter.extend({
  namespace: config.apiNamespace
});
