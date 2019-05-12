/* global self */
self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    // This seems to be from paper-data-table, though I can’t find exactly where 🤔
    { handler: 'silence', matchId: 'ember-component.send-action' },

    // Ember Data is triggering these, currently stuck at 3.1 due to https://github.com/samselikoff/ember-cli-mirage/pull/1613
    {
      handler: 'silence',
      matchId: 'ember-views.curly-components.jquery-element',
    },
    { handler: 'silence', matchId: 'ember-env.old-extend-prototypes' },
    { handler: 'silence', matchId: 'ember-polyfills.deprecate-merge' },

    // Despite adding a setter for child-mixin#parentComponent, the warning still occrus, maybe because of https://github.com/miguelcobain/ember-paper/blob/faa243a68943ce8406b82f72d21ec64e2484c3b9/addon/templates/components/paper-radio-group.hbs#L10
    { handler: 'silence', matchId: 'computed-property.override' },

    // There’s some work to do in ember-simple-auth for this: https://github.com/simplabs/ember-simple-auth/pull/1829
    { handler: 'silence', matchId: 'computed-property.volatile' },
  ],
};
