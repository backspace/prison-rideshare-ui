import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from 'prison-rideshare-ui/config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service session;

  host = config.DS.host;
  namespace = config.DS.namespace;

  @computed('session.data.authenticated.access_token')
  get headers() {
    let { access_token } = this.get('session.data.authenticated');

    if (access_token) {
      return {
        Authorization: `Bearer ${access_token}`,
      };
    } else {
      return {};
    }
  }

  urlForCreateRecord(modelName) {
    switch (modelName) {
      case 'user':
      case 'users':
        return super.urlForCreateRecord
          .apply(this, arguments)
          .replace('users', 'register');
      default:
        return super.urlForCreateRecord(...arguments);
    }
  }

  urlForQueryRecord(query) {
    if (query.me) {
      delete query.me;
      return `${super.urlForQueryRecord(...arguments)}/me`;
    }

    return super.urlForQueryRecord(...arguments);
  }
}
