import * as moment from 'moment';

moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'seconds',
    m: '1 minute',
    mm: '%d minutes',
    h: '1 hour',
    hh: '%d hours',
    d: '1 day',
    dd: '%d days',
    M: '1 month',
    MM: '%d months',
    y: '1 year',
    yy: '%d years',
  },
});
export function formatPostDate(timestamp: any): string {
  let date: Date;

  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    return 'Invalid date';
  }

  return moment(date).fromNow();
}
