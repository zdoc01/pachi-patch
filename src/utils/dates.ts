const getFormattedDate = (date: Date) => {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const timeSince = (date: Date) => {
  // @ts-ignore
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' year(s)';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' month(s)';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' day(s)';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hour(s)';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minute(s)';
  }
  return Math.floor(seconds) + ' seconds';
};

const sortByDateAsc = (a: Date | string, b: Date | string) => {
  const d1 = typeof a === 'string' ? new Date(a) : a;
  const d2 = typeof b === 'string' ? new Date(b) : b;

  if (d1.getTime() > d2.getTime()) {
    // sort A before B
    return -1;
  } else if (d1.getTime() < d2.getTime()) {
    // sort B before A
    return 1;
  }

  // do nothing
  return 0;
};

export { getFormattedDate, sortByDateAsc, timeSince };
