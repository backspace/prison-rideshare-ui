import 'decorator-transforms/globals';

import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'prison-rideshare-ui/config/environment';
import * as Sentry from '@sentry/ember';
import { registerDateLibrary } from 'ember-power-calendar';
import DateUtils from 'ember-power-calendar-moment';
import '@warp-drive/ember/install';

Sentry.init({
  dsn: config.sentry.dsn,
  sendDefaultPii: true,
});

registerDateLibrary(DateUtils);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
