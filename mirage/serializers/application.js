import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  // FIXME http://www.ember-cli-mirage.com/docs/v0.4.x/upgrading/#03x--04-upgrade-guide
  alwaysIncludeLinkageData: true,
});
