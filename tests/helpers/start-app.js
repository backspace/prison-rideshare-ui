import Application from '../../app';
import config from '../../config/environment';
import { merge } from '@ember/polyfills';
import { run } from '@ember/runloop';

import registerPowerSelectHelpers from '../../tests/helpers/ember-power-select';
import registerPowerCalendarHelpers from '../../tests/helpers/ember-power-calendar';

registerPowerSelectHelpers();
registerPowerCalendarHelpers();

export default function startApp(attrs) {
  let attributes = merge({}, config.APP);
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
