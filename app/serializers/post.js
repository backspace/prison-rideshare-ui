import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    body: 'content',
  },
});
