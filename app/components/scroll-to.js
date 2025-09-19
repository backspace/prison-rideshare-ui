/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/no-component-lifecycle-hooks, ember/require-tagless-components */
import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);
    this.element.scrollIntoView();
  },
});
