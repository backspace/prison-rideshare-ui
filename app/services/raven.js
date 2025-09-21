import classic from 'ember-classic-decorator';
import RavenLogger from 'ember-cli-sentry/services/raven';

@classic
export default class RavenService extends RavenLogger {
  unhandledPromiseErrorMessage = '';
}
