import {
  clickable,
  collection,
  create,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/log'),
  newPost: clickable('button.new'),

  posts: collection('.posts tbody tr', {
    date: text('.date'),
    poster: text('.poster'),
    content: text('.content'),

    editButton: {
      scope: 'button.edit'
    },

    deleteButton: {
      scope: 'button.delete',
    },

    deleteConfirm: {
      scope: 'button.delete-confirm'
    }
  }),

  form: {
    scope: 'form',

    content: {
      scope: '.content',
      field: {
        scope: '.mobiledoc-editor__editor'
      },
      error: {
        scope: '.paper-input-error'
      }
    },

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel')
  },
});
