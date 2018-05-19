import { computed } from '@ember/object';

export default function(property: string) {
  return computed(property, {
    get() {
      return this.get(property)/100;
    },

    set(_key: string, value: number) {
      this.set(property, Math.floor(value*100));
      return value;
    }
  });
}
