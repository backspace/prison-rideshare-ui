export default function momentAddLocaleShortMeridiemFormat(moment) {
  moment.updateLocale('en', {
    meridiem(hours, minutes, isLower) {
      // Taken from https://github.com/moment/moment/blob/7785323888893428f08eb6d5dc5eb266d5bf2a11/src/lib/units/hour.js#L130
      if (hours > 11) {
        return isLower ? 'p' : 'P';
      } else {
        return isLower ? 'a' : 'A';
      }
    },
  });
}
