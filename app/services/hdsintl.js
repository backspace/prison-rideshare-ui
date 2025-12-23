import Service from '@ember/service';

// This is a stub to provide the translation helper, things break without it despite this not needing intl
export default class HdsIntl extends Service {
  t(key, options) {
    const { default: defaultString } = options;
    return defaultString || key;
  }
}
