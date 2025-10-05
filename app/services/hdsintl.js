// import HdsIntlService from '@hashicorp/design-system-components/services/hds-intl';
import Service from '@ember/service';

// FIXME is this needed, and the initialiser? Maybe not if the t helper is hacked
export default class HdsIntl extends Service {
  t(key, options) {
    const { default: defaultString, ...restOptions } = options;
    return defaultString || key;
  }
}
