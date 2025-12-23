import {
  clickable,
  collection,
  create,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/log'),
  newPost: clickable('[data-test-log-new-post]'),

  markAllReadButton: {
    scope: '[data-test-log-mark-all-read]',
  },

  posts: collection('[data-test-log-post-row]', {
    date: text('[data-test-log-post-date]'),
    poster: text('[data-test-log-post-poster]'),
    content: text('[data-test-log-post-content]'),

    editButton: {
      scope: '[data-test-log-post-edit]',
    },

    deleteButton: {
      scope: '[data-test-log-post-delete]',
    },

    deleteConfirm: {
      scope: '[data-test-log-post-delete-confirm]',
    },

    markReadButton: {
      scope: '[data-test-log-post-mark-read]',
    },

    markUnreadButton: {
      scope: '[data-test-log-post-mark-unread]',
    },
  }),

  form: {
    scope: '[data-test-log-modal]',

    content: {
      scope: '[data-test-log-form]',
      field: {
        scope: '.mobiledoc-editor__editor',
      },
      error: {
        scope: '[data-test-log-form-error]',
      },
    },

    submit: clickable('[data-test-log-form-save]'),
    cancel: clickable('[data-test-log-form-cancel]'),
  },
});
