import Ember from 'ember';

export default function(property) {
  return Ember.computed(property, {
    get() {
      return this.get(property)/100;
    },

    set(key, value) {
      this.set(property, Math.floor(value*100));
      return value;
    }
  });
}
