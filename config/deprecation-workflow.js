/* global self */
self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    // This seems to be from paper-data-table, though I can’t find exactly where 🤔
    { handler: 'silence', matchId: 'ember-component.send-action' },

    // Despite adding a setter for child-mixin#parentComponent, the warning still occrus, maybe because of https://github.com/miguelcobain/ember-paper/blob/faa243a68943ce8406b82f72d21ec64e2484c3b9/addon/templates/components/paper-radio-group.hbs#L10
    { handler: 'silence', matchId: 'computed-property.override' },

    // There’s some work to do in ember-simple-auth for this: https://github.com/simplabs/ember-simple-auth/pull/1829
    { handler: 'silence', matchId: 'computed-property.volatile' },
  ],
};
