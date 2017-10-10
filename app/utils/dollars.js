import { computed } from '@ember/object';

export default function(property) {
  return computed(property, {
    get() {
      return this.get(property)/100;
    },

    set(key, value) {
      this.set(property, Math.floor(value*100));
      return value;
    }
  });
}
