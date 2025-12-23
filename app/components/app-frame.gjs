import { hash } from '@ember/helper';
import Header from 'prison-rideshare-ui/components/app-frame/header';
import Sidebar from 'prison-rideshare-ui/components/app-frame/sidebar';
import Main from 'prison-rideshare-ui/components/app-frame/main';

<template>
  {{! See docs/helios-overrides.md }}
  <div class='app-frame' ...attributes>
    {{yield (hash Header=Header Sidebar=Sidebar Main=Main)}}
  </div>
</template>
