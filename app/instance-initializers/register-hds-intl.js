import HdsIntl from 'prison-rideshare-ui/services/hdsintl';

export function initialize(appInstance) {
  appInstance.register('service:hdsIntl', HdsIntl);
}

export default {
  initialize,
};
