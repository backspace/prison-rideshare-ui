/* global self */

self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-global' },
    {
      handler: 'silence',
      matchId: 'deprecated-run-loop-and-computed-dot-access',
    },
    { handler: 'silence', matchId: 'implicit-injections' },
    { handler: 'silence', matchId: 'this-property-fallback' },
    { handler: 'silence', matchId: 'ember-utils.try-invoke' },
    { handler: 'silence', matchId: 'ember-metal.get-with-default' },
    { handler: 'silence', matchId: 'ensure-safe-component.string' },
    { handler: 'silence', matchId: 'ember-modifier.use-modify' },
    { handler: 'silence', matchId: 'ember-modifier.no-args-property' },
    { handler: 'silence', matchId: 'ember-modifier.no-element-property' },
    { handler: 'silence', matchId: 'ember-modifier.use-destroyables' },
    { handler: 'silence', matchId: 'routing.transition-methods' },

    // Is this comment still relevant?
    // This seems to be from paper-data-table, though I can’t find exactly where 🤔
    { handler: 'silence', matchId: 'ember-component.send-action' },
    { handler: 'silence', matchId: 'ember.link-to.tag-name' },

    // Is this comment still relevant?
    // Despite adding a setter for child-mixin#parentComponent, the warning still occurs, maybe because of https://github.com/miguelcobain/ember-paper/blob/faa243a68943ce8406b82f72d21ec64e2484c3b9/addon/templates/components/paper-radio-group.hbs#L10
    { handler: 'silence', matchId: 'computed-property.override' },
    { handler: 'silence', matchId: 'ember-cli-page-object.is-property' },
  ],
};
