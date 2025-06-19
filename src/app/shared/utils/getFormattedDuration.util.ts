import * as moment from 'moment';

export function getFormattedDuration(
  startDateValue: Date,
  endDateValue: Date,
  currentlyWorking: boolean = false
): string {
  if (!startDateValue) {
    return '';
  }

  const startDate = new Date(startDateValue);
  const endDate = currentlyWorking ? new Date() : new Date(endDateValue);

  if (!endDateValue && !currentlyWorking) {
    return '';
  }

  const formattedStartDate = moment(startDate).format('MMM YYYY');

  const formattedEndDate = currentlyWorking
    ? 'Present'
    : moment(endDate).format('MMM YYYY');

  const diffInMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  const years = Math.floor(diffInMonths / 12);
  const months = diffInMonths % 12;

  let duration = '';
  if (years > 0) {
    duration += `${years} yr${years > 1 ? 's' : ''}`;
  }
  if (months > 0) {
    duration +=
      (years > 0 ? ', ' : '') + `${months} month${months > 1 ? 's' : ''}`;
  }

  return `${formattedStartDate} - ${formattedEndDate} · ${duration}`;
}
