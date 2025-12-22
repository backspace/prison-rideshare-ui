import { component } from '@ember/component/helper';
import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import Header from 'prison-rideshare-ui/components/app-frame/header';
import Sidebar from 'prison-rideshare-ui/components/app-frame/sidebar';
import Main from 'prison-rideshare-ui/components/app-frame/main';

// See docs/helios-overrides.md
export default class AppFrameComponent extends Component {
  <template>
    <div class='app-frame' ...attributes>
      {{yield (hash Header=Header Sidebar=Sidebar Main=Main)}}
    </div>
  </template>
}
