/* eslint-disable ember/no-classic-classes*/
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default JSONAPISerializer.extend({
  extractErrors(store, typeClass, payload, id) {
    let extracted = this._super(store, typeClass, payload, id);

    if (payload && Array.isArray(payload.errors)) {
      if (!extracted || typeof extracted !== 'object' || Array.isArray(extracted)) {
        extracted = {};
      }

      const baseErrors = payload.errors
        .filter((error) => !error?.source?.pointer)
        .map((error) => error?.detail || error?.title)
        .filter(Boolean);

      if (baseErrors.length) {
        extracted.base = (extracted.base || []).concat(baseErrors);
      }
    }

    return extracted;
  },
});
