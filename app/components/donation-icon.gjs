/* eslint-disable ember/no-classic-classes, ember/no-classic-components */
import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import paperIcon from "ember-paper/_app_/components/paper-icon.js";

@classic
@tagName('')
export default class DonationIcon extends Component {<template>{{paperIcon "card giftcard" title="donation"}}
</template>}
