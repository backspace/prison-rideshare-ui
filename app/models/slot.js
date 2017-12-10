import DS from 'ember-data';

export default DS.Model.extend({
  start: DS.attr('date'),
  end: DS.attr('date'),
  count: DS.attr('number'),

  commitments: DS.hasMany({ async: false })
});
