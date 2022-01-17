import dayjs from 'dayjs';

export const getCurrentDate = () => dayjs().startOf('day').format();
