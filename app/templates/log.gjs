import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import PaperButton from 'ember-paper/components/paper-button';
import paperIcon from 'ember-paper/components/paper-icon';
import PaperContent from 'ember-paper/components/paper-content/component';
import PaperDataTable from 'paper-data-table/components/paper-data-table';
import filterBy from 'ember-composable-helpers/helpers/filter-by';
import sortBy from 'ember-composable-helpers/helpers/sort-by';
import momentFormat from 'ember-moment/helpers/moment-format';
import eq from 'ember-truth-helpers/helpers/eq';
import PaperDialog from 'ember-paper/components/paper-dialog';
import PaperForm from 'ember-paper/components/paper-form';
import PaperDialogContent from 'ember-paper/components/paper-dialog-content';
import MobiledocEditor from 'ember-mobiledoc-editor/components/mobiledoc-editor/component';
import MobiledocToolbar from 'ember-mobiledoc-editor/components/mobiledoc-toolbar/component';
import PaperDialogActions from 'ember-paper/components/paper-dialog-actions';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import DOMRenderer from 'ember-mobiledoc-dom-renderer';
import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

export default RouteTemplate(
  <template>
    {{! template-lint-disable no-action }}
    <ToolbarHeader @title='Log'>
      <PaperButton
        @mini={{true}}
        @aria-label='New post'
        @title='New post'
        @class='new'
        @onClick={{@controller.newPost}}
      >
        {{paperIcon 'note_add'}}
      </PaperButton>
    </ToolbarHeader>

    <PaperContent>
      <PaperDataTable @class='posts' as |table|>
        <table.head as |head|>
          <head.column>
            Meta
          </head.column>
          <head.column>
            Content
          </head.column>
          <head.column>
            {{#if (filterBy 'unread' @controller.model)}}
              <PaperButton
                @aria-label='Mark all read'
                @title='Mark all read'
                @class='markAllRead'
                @onClick={{@controller.markAllRead}}
              >
                Mark all read{{paperIcon 'done_all'}}
              </PaperButton>
            {{/if}}
          </head.column>
        </table.head>
        <table.body as |body|>
          {{#each (sortBy 'insertedAt:desc' @controller.model) as |post|}}
            {{#unless post.isNew}}
              <body.row as |row|>
                <row.cell @class='meta'>
                  <span class='date'>
                    {{momentFormat post.insertedAt 'ddd MMM D YYYY h:mma'}}
                  </span>
                  <br />
                  <span class='poster'>
                    {{post.poster.email}}
                  </span>
                </row.cell>
                <row.cell @class='content'>
                  <MobiledocRenderer @mobiledoc={{post.bodyJson}} />
                </row.cell>
                <row.cell @class='controls'>
                  {{#if post.unread}}
                    <PaperButton
                      @aria-label='Mark read'
                      @title='Mark read'
                      @class='markRead'
                      @onClick={{fn @controller.markRead post}}
                    >
                      Mark read{{paperIcon 'done'}}
                    </PaperButton>
                  {{else}}
                    <PaperButton
                      @aria-label='Mark unread'
                      @title='Mark unread'
                      @class='markUnread'
                      @onClick={{fn @controller.markUnread post}}
                    >
                      Mark unread{{paperIcon 'autorenew'}}
                    </PaperButton>
                  {{/if}}
                  {{#if (eq @controller.session.currentUser.id post.poster.id)}}
                    <PaperButton
                      @iconButton={{true}}
                      @aria-label='Edit post'
                      @title='Edit post'
                      @class='edit'
                      @onClick={{fn @controller.editPost post}}
                    >
                      {{paperIcon 'mode edit'}}
                    </PaperButton>
                    {{#if (eq @controller.deletingPost post)}}
                      Delete this post?
                      <PaperButton
                        @class='delete-confirm'
                        @warn={{true}}
                        @aria-label='Delete post'
                        @title='Delete post'
                        @onClick={{@controller.deletePost}}
                      >
                        Yes
                      </PaperButton>
                      <PaperButton
                        @class='delete-cancel'
                        @aria-label='Don’t delete report'
                        @title='Don’t delete report'
                        @onClick={{fn @controller.maybeDeletePost null}}
                      >
                        No
                      </PaperButton>
                    {{else}}
                      <PaperButton
                        @iconButton={{true}}
                        @aria-label='Delete post'
                        @title='Delete post'
                        @class='delete'
                        @onClick={{fn @controller.maybeDeletePost post}}
                      >
                        {{paperIcon 'delete'}}
                      </PaperButton>
                    {{/if}}
                  {{/if}}
                </row.cell>
              </body.row>
            {{/unless}}
          {{/each}}
        </table.body>
      </PaperDataTable>
    </PaperContent>

    {{#if @controller.editingPost}}
      <PaperDialog
        @clickOutsideToClose={{true}}
        @fullscreen={{true}}
        @onClose={{@cancelPost}}
      >
        <PaperForm @onSubmit={{@controller.savePost}}>
          <PaperDialogContent>
            <h2 class='md-title'>
              {{if @controller.editingPost.isNew 'New' 'Edit'}}
              post
            </h2>
            <div class='layout layout-sm-column content'>
              <MobiledocEditor
                @mobiledoc={{@controller.editingPost.bodyJson}}
                @autofocus={{true}}
                @on-change={{@controller.updatePostBody}}
                as |editor|
              >
                <MobiledocToolbar @editor={{editor}} />
              </MobiledocEditor>
              {{#if @controller.editingPost.validationErrors.body}}
                <div class='md-input-messages-animation md-auto-hide'>
                  {{#each
                    @controller.editingPost.validationErrors.body
                    as |error|
                  }}
                    <div
                      class='paper-input-error ng-enter ng-enter-active md-input-message-animation'
                    >
                      {{error}}
                    </div>
                  {{/each}}
                </div>
              {{/if}}
            </div>
          </PaperDialogContent>
          <PaperDialogActions @class='layout-row'>
            <PaperButton @class='cancel' @onClick={{@controller.cancelPost}}>
              Cancel
            </PaperButton>
            <PaperButton
              @class='submit'
              @primary={{true}}
              @onClick={{@controller.savePost}}
            >
              Save
            </PaperButton>
          </PaperDialogActions>
        </PaperForm>
      </PaperDialog>
    {{/if}}
  </template>,
);

class MobiledocRenderer extends Component {
  <template>
    <section {{renderMobiledoc @mobiledoc}}></section>
  </template>
}

let renderMobiledoc = modifier((element, [mobiledoc]) => {
  if (!mobiledoc) {
    element.innerHTML = '';
    return;
  }

  let renderer = new DOMRenderer({ dom: document, cards: [], atoms: [] });
  let { result, teardown } = renderer.render(mobiledoc);
  element.innerHTML = '';
  element.appendChild(result);

  return teardown;
});
