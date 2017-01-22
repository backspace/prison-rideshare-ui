import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: ['institution', 'driver', 'carOwner', 'children']
});
