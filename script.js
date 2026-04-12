// ============================================
// YEAR PROGRESS CALCULATOR
// ============================================

(function () {
  'use strict';

  const MONTHS_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const DAYS_ID = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
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
   * Format date in Indonesian
   */
  function formatDateID(date) {
    const day = DAYS_ID[date.getDay()];
    const d = date.getDate();
    const month = MONTHS_ID[date.getMonth()];
    const year = date.getFullYear();
    return `${day}, ${d} ${month} ${year}`;
  }

  /**
   * Format time
   */
  function formatTime(date) {
    return date.toLocaleTimeString('id-ID', {
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
      `Tahun ${year} ${isLeapYear(year) ? 'adalah tahun kabisat (366 hari)' : 'bukan tahun kabisat (365 hari)'}.`,
      `Masih ada ${weeksLeft} minggu tersisa di tahun ${year}.`,
      `Kamu sudah melewati ${dayOfYear} dari ${totalDays} hari tahun ini.`,
      `${remaining} hari lagi menuju tahun ${year + 1}! 🎉`,
      `Jika tahun ini adalah baterai, masih tersisa ${(100 - percent).toFixed(1)}% daya.`,
      `Tahun ini sudah berjalan selama ${Math.floor(dayOfYear * 24)} jam.`,
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
    daysPassed: document.getElementById('days-passed'),
    daysRemaining: document.getElementById('days-remaining'),
    currentDay: document.getElementById('current-day'),
    totalDays: document.getElementById('total-days'),
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
    els.subText.textContent = `Hari ke-${dayOfYear} dari ${totalDaysInYear} hari di tahun ${year}`;

    // Animate progress bar (only if changed significantly)
    if (Math.abs(percent - lastPercent) > 0.001 || lastPercent === -1) {
      els.progressFill.style.width = percent + '%';
      lastPercent = percent;
    }

    // Update stats
    els.daysPassed.textContent = dayOfYear;
    els.daysRemaining.textContent = remaining;
    els.currentDay.textContent = dayOfYear;
    els.totalDays.textContent = totalDaysInYear;

    // Update date/time
    els.currentDateText.textContent = formatDateID(now);
    els.currentTimeText.textContent = formatTime(now);

    // Update fun fact (changes daily)
    els.funFactText.textContent = getFunFact(percent, dayOfYear, totalDaysInYear, year);

    // Update page title
    document.title = `${percentRounded.toFixed(1)}% — Progress Bar ${year}`;
  }

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  function animateCounters() {
    const now = new Date();
    const year = now.getFullYear();
    const totalDaysInYear = getTotalDays(year);
    const dayOfYear = getDayOfYear(now);
    const remaining = totalDaysInYear - dayOfYear;

    const targets = [
      { el: els.daysPassed, target: dayOfYear },
      { el: els.daysRemaining, target: remaining },
      { el: els.currentDay, target: dayOfYear },
      { el: els.totalDays, target: totalDaysInYear },
    ];

    targets.forEach(({ el, target }) => {
      let current = 0;
      const duration = 1200;
      const steps = 40;
      const increment = target / steps;
      const stepMs = duration / steps;

      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(counter);
        }
        el.textContent = Math.round(current);
      }, stepMs);
    });
  }

  // ============================================
  // INITIALIZE
  // ============================================
  function init() {
    // Initial update
    update();

    // Animate counters on load
    animateCounters();

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
