// ============================================
// YEAR PROGRESS CALCULATOR
// ============================================

(function () {
  'use strict';

  const MONTHS_EN = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const DAYS_EN = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  /**
   * Check if a year is a leap year
   */
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /**
   * Get total days in a year
   */
  function getTotalDays(year) {
    return isLeapYear(year) ? 366 : 365;
  }

  /**
   * Get day of year (1-indexed)
   */
  function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  /**
   * Calculate precise year progress as a percentage (including time of day)
   */
  function getYearProgress(now) {
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    const totalMs = endOfYear - startOfYear;
    const elapsedMs = now - startOfYear;
    return (elapsedMs / totalMs) * 100;
  }

  /**
   * Format date in English
   */
  function formatDateEN(date) {
    const day = DAYS_EN[date.getDay()];
    const d = date.getDate();
    const month = MONTHS_EN[date.getMonth()];
    const year = date.getFullYear();
    return `${day}, ${month} ${d}, ${year}`;
  }

  /**
   * Format time
   */
  function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  /**
   * Get a fun fact based on current progress
   */
  function getFunFact(percent, dayOfYear, totalDays, year) {
    const remaining = totalDays - dayOfYear;
    const weeksLeft = Math.floor(remaining / 7);

    const facts = [
      `Year ${year} ${isLeapYear(year) ? 'is a leap year (366 days)' : 'is not a leap year (365 days)'}.`,
      `There are ${weeksLeft} weeks left in ${year}.`,
      `You've made it through ${dayOfYear} of ${totalDays} days this year.`,
      `${remaining} days left until ${year + 1}! 🎉`,
      `If this year were a battery, it would have ${(100 - percent).toFixed(1)}% power remaining.`,
      `This year has been running for ${Math.floor(dayOfYear * 24)} hours.`,
    ];

    // Pick a fact based on day (changes daily)
    return facts[dayOfYear % facts.length];
  }

  // ============================================
  // DOM ELEMENTS
  // ============================================
  const els = {
    yearText: document.getElementById('year-text'),
    headlineYear: document.getElementById('headline-year'),
    percentText: document.getElementById('percent-text'),
    subText: document.getElementById('sub-text'),
    progressFill: document.getElementById('progress-fill'),
    currentDateText: document.getElementById('current-date-text'),
    currentTimeText: document.getElementById('current-time-text'),
    funFactText: document.getElementById('fun-fact-text'),
  };

  // ============================================
  // UPDATE FUNCTION
  // ============================================
  let lastPercent = -1;

  function update() {
    const now = new Date();
    const year = now.getFullYear();
    const totalDaysInYear = getTotalDays(year);
    const dayOfYear = getDayOfYear(now);
    const percent = getYearProgress(now);
    const percentRounded = Math.round(percent * 100) / 100;
    const remaining = totalDaysInYear - dayOfYear;

    // Update year references
    els.yearText.textContent = year;
    els.headlineYear.textContent = year;

    // Update percentage
    els.percentText.textContent = percentRounded.toFixed(2) + '%';

    // Update sub text
    els.subText.textContent = `Day ${dayOfYear} of ${totalDaysInYear} days in ${year}`;

    // Animate progress bar (only if changed significantly)
    if (Math.abs(percent - lastPercent) > 0.001 || lastPercent === -1) {
      els.progressFill.style.width = percent + '%';
      lastPercent = percent;
    }

    // Update date/time
    els.currentDateText.textContent = formatDateEN(now);
    els.currentTimeText.textContent = formatTime(now);

    // Update fun fact (changes daily)
    els.funFactText.textContent = getFunFact(percent, dayOfYear, totalDaysInYear, year);

    // Update page title
    document.title = `${percentRounded.toFixed(1)}% — Progress Bar ${year}`;
  }

  // ============================================
  // INITIALIZE
  // ============================================
  function init() {
    // Initial update
    update();

    // Update every second
    setInterval(update, 1000);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
