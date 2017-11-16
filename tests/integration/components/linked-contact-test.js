import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('linked-contact', 'Integration | Component | linked contact', {
  integration: true
});

test('it just renders the string when nothing is detected', function(assert) {
  this.set('value', 'hello');
  this.render(hbs`{{linked-contact contact=value}}`);
  assert.equal(this.$('div')[0].innerHTML.trim(), 'hello');
});

test('it extracts a phone number', function(assert) {
  this.set('value', 'hello 212-986-8227 what');
  this.render(hbs`{{linked-contact contact=value}}`);
  assert.equal(this.$('div')[0].innerHTML.trim(), `hello <a href="tel:212-986-8227">212-986-8227</a> what`);
});

test('it extracts a phone number without dashes', function(assert) {
  this.set('value', 'hello 2129868227 what');
  this.render(hbs`{{linked-contact contact=value}}`);
  assert.equal(this.$('div')[0].innerHTML.trim(), `hello <a href="tel:2129868227">2129868227</a> what`);
});

test('it extracts a phone number with spaces', function(assert) {
  this.set('value', 'hello 212 986 8227 what');
  this.render(hbs`{{linked-contact contact=value}}`);
  assert.equal(this.$('div')[0].innerHTML.trim(), `hello <a href="tel:212 986 8227">212 986 8227</a> what`);
});

test('it extracts a phone number with brackets', function(assert) {
  this.set('value', 'hello (212) 986 8227 what');
  this.render(hbs`{{linked-contact contact=value}}`);
  assert.equal(this.$('div')[0].innerHTML.trim(), `hello <a href="tel:(212) 986 8227">(212) 986 8227</a> what`);
});

test('it ignores an undefined contact value', function(assert) {
  this.render(hbs`{{linked-contact}}`);
  assert.equal(this.$('div')[0].innerHTML.trim(), '');
});
