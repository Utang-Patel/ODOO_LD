/**
 * Date Utility Functions for GlobeTrotter
 */

// Format single date (e.g., '2026-09-12' -> '12 Sep 2026')
export const formatSingleDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Format date range (e.g., '2026-09-12', '2026-09-20' -> '12 Sep 2026 – 20 Sep 2026')
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  const startStr = formatSingleDate(startDate);
  const endStr = formatSingleDate(endDate);
  return `${startStr} – ${endStr}`;
};

// Calculate trip duration in calendar days inclusive (e.g., Sep 12 to Sep 20 = 9 days)
export const calculateTripDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Count inclusive of both start and end day
};

// Determine trip status based on current date
export const getTripStatus = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Upcoming';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  if (today < start) {
    return 'Upcoming';
  } else if (today >= start && today <= end) {
    return 'Ongoing';
  } else {
    return 'Completed';
  }
};
