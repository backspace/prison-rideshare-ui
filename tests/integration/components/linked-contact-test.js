import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | linked contact', function(hooks) {
  setupRenderingTest(hooks);

  test('it just renders the string when nothing is detected', async function(assert) {
    this.set('value', 'hello');
    await render(hbs`{{linked-contact contact=value}}`);
    assert.equal(this.$('span')[0].innerHTML.trim(), 'hello');
  });

  test('it extracts a phone number', async function(assert) {
    this.set('value', 'hello 212-986-8227 what');
    await render(hbs`{{linked-contact contact=value}}`);
    assert.equal(
      this.$('span')[0].innerHTML.trim(),
      `hello <a href="tel:212-986-8227">212-986-8227</a> what`
    );
  });

  test('it extracts a phone number without dashes', async function(assert) {
    this.set('value', 'hello 2129868227 what');
    await render(hbs`{{linked-contact contact=value}}`);
    assert.equal(
      this.$('span')[0].innerHTML.trim(),
      `hello <a href="tel:2129868227">2129868227</a> what`
    );
  });

  test('it extracts a phone number with spaces', async function(assert) {
    this.set('value', 'hello 212 986 8227 what');
    await render(hbs`{{linked-contact contact=value}}`);
    assert.equal(
      this.$('span')[0].innerHTML.trim(),
      `hello <a href="tel:212 986 8227">212 986 8227</a> what`
    );
  });

  test('it extracts a phone number with brackets', async function(assert) {
    this.set('value', 'hello (212) 986 8227 what');
    await render(hbs`{{linked-contact contact=value}}`);
    assert.equal(
      this.$('span')[0].innerHTML.trim(),
      `hello <a href="tel:(212) 986 8227">(212) 986 8227</a> what`
    );
  });

  test('it ignores an undefined contact value', async function(assert) {
    await render(hbs`{{linked-contact}}`);
    assert.equal(this.$('span')[0].innerHTML.trim(), '');
  });
});
