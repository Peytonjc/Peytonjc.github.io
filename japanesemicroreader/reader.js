(function () {
  "use strict";

  const STORAGE_KEY = "jmr-progress-v1";
  const VOCAB_VISIBILITY_KEY = "jmr-show-vocab";

  const topicEl = document.getElementById("topic");
  const textEl = document.getElementById("reading-text");
  const progressEl = document.getElementById("progress-text");
  const vocabListEl = document.getElementById("vocab-list");
  const vocabContainerEl = document.getElementById("vocab-container");
  const toggleVocabBtn = document.getElementById("toggle-vocab");

  if (!Array.isArray(MICRO_READINGS) || MICRO_READINGS.length === 0) {
    topicEl.textContent = "Unavailable";
    textEl.textContent = "読み物データがありません。";
    progressEl.textContent = "Progress unavailable";
    return;
  }

  const todayKey = getLocalDateKey(new Date());
  const reading = getReadingForDate(todayKey);

  renderReading(reading);
  const progress = loadProgress();
  const updatedProgress = markDayComplete(progress, todayKey, reading.id);
  saveProgress(updatedProgress);
  renderProgress(updatedProgress);

  const initialVocabVisible = localStorage.getItem(VOCAB_VISIBILITY_KEY) === "true";
  setVocabularyVisibility(initialVocabVisible);

  toggleVocabBtn.addEventListener("click", function () {
    const nextVisible = vocabContainerEl.hidden;
    setVocabularyVisibility(nextVisible);
    localStorage.setItem(VOCAB_VISIBILITY_KEY, String(nextVisible));
  });

  function getLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getReadingForDate(dateKey) {
    const parts = dateKey.split("-").map(Number);
    const utcMidnightMs = Date.UTC(parts[0], parts[1] - 1, parts[2]);
    const dayNumber = Math.floor(utcMidnightMs / 86400000);
    const index = ((dayNumber % MICRO_READINGS.length) + MICRO_READINGS.length) % MICRO_READINGS.length;
    return MICRO_READINGS[index];
  }

  function renderReading(item) {
    topicEl.textContent = item.topic;
    textEl.textContent = item.text;

    vocabListEl.innerHTML = "";
    item.key_vocab.forEach(function (entry) {
      const li = document.createElement("li");
      li.textContent = `${entry.word}（${entry.reading}）- ${entry.meaning}`;
      vocabListEl.appendChild(li);
    });
  }

  function loadProgress() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { readDays: {}, totalCompleted: 0 };
    }

    try {
      const parsed = JSON.parse(raw);
      const readDays = parsed && typeof parsed.readDays === "object" && parsed.readDays !== null ? parsed.readDays : {};
      const totalCompleted = Number.isInteger(parsed.totalCompleted) && parsed.totalCompleted >= 0 ? parsed.totalCompleted : 0;
      return { readDays: readDays, totalCompleted: totalCompleted };
    } catch (_error) {
      return { readDays: {}, totalCompleted: 0 };
    }
  }

  function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function markDayComplete(progress, dateKey, readingId) {
    if (progress.readDays[dateKey]) {
      return progress;
    }

    const nextReadDays = Object.assign({}, progress.readDays, { [dateKey]: readingId });
    return {
      readDays: nextReadDays,
      totalCompleted: progress.totalCompleted + 1
    };
  }

  function renderProgress(progress) {
    const dayCount = Object.keys(progress.readDays).length;
    progressEl.textContent = `Read days: ${dayCount} ・ Total completed: ${progress.totalCompleted}`;
  }

  function setVocabularyVisibility(isVisible) {
    vocabContainerEl.hidden = !isVisible;
    toggleVocabBtn.setAttribute("aria-expanded", String(isVisible));
    toggleVocabBtn.textContent = isVisible ? "Hide vocabulary" : "Show vocabulary";
  }
})();
