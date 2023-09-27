import Application from 'prison-rideshare-ui/app';
import config from 'prison-rideshare-ui/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
