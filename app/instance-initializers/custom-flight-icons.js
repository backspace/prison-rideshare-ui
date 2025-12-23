import config from 'ember-get-config';
import customFlightIconSprite from 'prison-rideshare-ui/utils/custom-flight-icon-sprite';

const SPRITE_SELECTOR = '#custom-flight-icons-sprite';

function injectSprite(container, position) {
  if (!container || container.querySelector(SPRITE_SELECTOR)) {
    return;
  }

  container.insertAdjacentHTML(position, customFlightIconSprite);
}

export function initialize() {
  if (typeof window === 'undefined') {
    return;
  }

  const document = window.document;
  if (!document) {
    return;
  }

  if (config.environment === 'test') {
    const testingContainer = document.getElementById('ember-testing');
    injectSprite(testingContainer, 'afterbegin');
  } else {
    injectSprite(document.body, 'beforeend');
  }
}

export default {
  initialize,
};
