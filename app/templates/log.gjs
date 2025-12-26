import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import momentFormat from 'ember-moment/helpers/moment-format';
import eq from 'ember-truth-helpers/helpers/eq';
import MobiledocEditor from 'ember-mobiledoc-editor/components/mobiledoc-editor/component';
import MobiledocToolbar from 'ember-mobiledoc-editor/components/mobiledoc-toolbar/component';
import { fn } from '@ember/helper';
import DOMRenderer from 'ember-mobiledoc-dom-renderer';
import { modifier } from 'ember-modifier';
import { on } from '@ember/modifier';
import {
  HdsButton,
  HdsButtonSet,
  HdsForm,
  HdsModal,
  HdsTable,
} from '@hashicorp/design-system-components/components';

export default RouteTemplate(
  <template>
    <div data-test-log-page>
      <ToolbarHeader @title='Log'>
        <HdsButton
          type='button'
          @icon='plus'
          @text='New post'
          @size='small'
          data-test-log-new-post
          {{on 'click' @controller.newPost}}
        />
      </ToolbarHeader>

      <HdsTable data-test-log-table>
        <:head as |Head|>
          <Head.Tr>
            <Head.Th class='meta-column'>Meta</Head.Th>
            <Head.Th class='content-column'>Content</Head.Th>
            <Head.Th class='actions-column'>
              {{#if @controller.anyUnread}}
                <HdsButton
                  type='button'
                  @text='Mark all read'
                  @icon='check'
                  @color='secondary'
                  data-test-log-mark-all-read
                  {{on 'click' @controller.markAllRead}}
                />
              {{/if}}
            </Head.Th>
          </Head.Tr>
        </:head>

        <:body as |Body|>
          {{#each @controller.sortedPosts as |post|}}
            {{#unless post.isNew}}
              <Body.Tr data-test-log-post-row>
                <Body.Td class='meta'>
                  <div class='date' data-test-log-post-date>
                    {{momentFormat post.insertedAt 'ddd MMM D YYYY h:mma'}}
                  </div>
                  <div class='poster' data-test-log-post-poster>
                    {{post.poster.email}}
                  </div>
                </Body.Td>

                <Body.Td
                  class='log-content'
                  {{renderMobiledoc post.bodyJson}}
                  data-test-log-post-content
                />

                <Body.Td class='controls'>
                  <HdsButtonSet>
                    {{#if post.unread}}
                      <HdsButton
                        type='button'
                        @text='Mark read'
                        @icon='check'
                        @color='secondary'
                        data-test-log-post-mark-read
                        {{on 'click' (fn @controller.markRead post)}}
                      />
                    {{else}}
                      <HdsButton
                        type='button'
                        @text='Mark unread'
                        @icon='reload'
                        @color='secondary'
                        data-test-log-post-mark-unread
                        {{on 'click' (fn @controller.markUnread post)}}
                      />
                    {{/if}}

                    {{#if
                      (eq @controller.session.currentUser.id post.poster.id)
                    }}
                      <HdsButton
                        type='button'
                        @text='Edit'
                        @icon='edit'
                        @isIconOnly={{true}}
                        @color='secondary'
                        @size='small'
                        data-test-log-post-edit
                        {{on 'click' (fn @controller.editPost post)}}
                      />

                      {{#if (eq @controller.deletingPost post)}}
                        <span data-test-log-post-delete-confirmation>
                          Delete this post?
                        </span>
                        <HdsButton
                          type='button'
                          @text='Yes'
                          @color='critical'
                          data-test-log-post-delete-confirm
                          {{on 'click' @controller.deletePost}}
                        />
                        <HdsButton
                          type='button'
                          @text='No'
                          @color='secondary'
                          data-test-log-post-delete-cancel
                          {{on 'click' (fn @controller.maybeDeletePost null)}}
                        />
                      {{else}}
                        <HdsButton
                          type='button'
                          @text='Delete'
                          @icon='trash'
                          @isIconOnly={{true}}
                          @color='secondary'
                          @size='small'
                          data-test-log-post-delete
                          {{on 'click' (fn @controller.maybeDeletePost post)}}
                        />
                      {{/if}}
                    {{/if}}
                  </HdsButtonSet>
                </Body.Td>
              </Body.Tr>
            {{/unless}}
          {{/each}}
        </:body>
      </HdsTable>

      {{#if @controller.editingPost}}
        <HdsModal
          @color='neutral'
          @size='large'
          @onClose={{@controller.cancelPost}}
          data-test-log-modal
          as |Modal|
        >
          <Modal.Header>
            {{if @controller.editingPost.isNew 'New' 'Edit'}}
            post
          </Modal.Header>

          <Modal.Body>
            <HdsForm
              id='log-form'
              data-test-log-form
              {{on 'submit' @controller.savePost}}
              as |Form|
            >
              <Form.Section>
                <div class='layout layout-sm-column content'>
                  <MobiledocEditor
                    @mobiledoc={{@controller.editingPost.bodyJson}}
                    @autofocus={{true}}
                    @on-change={{@controller.updatePostBody}}
                    as |editor|
                  >
                    <MobiledocToolbar @editor={{editor}} />
                  </MobiledocEditor>
                </div>

                {{#if @controller.editingPost.validationErrors.body}}
                  <div data-test-log-form-error>
                    {{#each
                      @controller.editingPost.validationErrors.body
                      as |error|
                    }}
                      <div>{{error}}</div>
                    {{/each}}
                  </div>
                {{/if}}
              </Form.Section>
            </HdsForm>
          </Modal.Body>

          <Modal.Footer as |Footer|>
            <HdsButtonSet>
              <HdsButton
                type='submit'
                form='log-form'
                @color='primary'
                @text='Save'
                data-test-log-form-save
              />
              <HdsButton
                type='button'
                @color='secondary'
                @text='Cancel'
                data-test-log-form-cancel
                {{on 'click' Footer.close}}
              />
            </HdsButtonSet>
          </Modal.Footer>
        </HdsModal>
      {{/if}}
    </div>
  </template>,
);

const renderMobiledoc = modifier((element, [mobiledoc]) => {
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
