import RouteTemplate from 'ember-route-template';
import { LinkTo } from '@ember/routing';
export default RouteTemplate(
  <template>
    <LinkTo @route='rides.new'>
      New ride
    </LinkTo>
  </template>,
);
