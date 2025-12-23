import { HdsCardContainer } from '@hashicorp/design-system-components/components';

const CalendarAboutComponent = <template>
  <HdsCardContainer @background='neutral-secondary'>
    <div>
      <p>
        Let us know in advance when you can take people to visit their loved
        ones. Click a time slot below to commit. If you can’t commit anymore,
        click the slot again.
      </p>
      <p>
        Use the button above to access a form to change your communication
        preferences.
      </p>

      <p class='subscription'>
        You can subscribe to a live-updating calendar that shows what times
        you’ve committed to as well as rides assigned to you. On Apple
        platforms, tap
        <a href={{@webcalUrl}}>here</a>
        to subscribe; on other platforms, you’ll have to copy
        <a href={{@httpUrl}} data-test-calendar-subscription>this URL</a>
        into a calendar subscription field. Please be careful with these links,
        as they show contact information for riders. If they’re ever exposed,
        let us know and we can change the secret token.
      </p>
    </div>
  </HdsCardContainer>
</template>;

export default CalendarAboutComponent;
