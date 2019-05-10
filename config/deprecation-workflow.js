/* global self */
self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-component.send-action' },

    // Ember Data is triggering this, currently stuck at 3.1 due to https://github.com/samselikoff/ember-cli-mirage/pull/1613
    {
      handler: 'silence',
      matchId: 'ember-views.curly-components.jquery-element',
    },

    // Also Ember Data
    { handler: 'silence', matchId: 'ember-env.old-extend-prototypes' },
  ],
};
