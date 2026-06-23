const SAVED_STORAGE_KEY = "dream-note-saved";
const savedJournalList = document.querySelector("#savedJournalList");
const clearSavedButton = document.querySelector("#clearSavedButton");

function getSavedDreams() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function setSavedDreams(items) {
  localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(items));
}

function getResultId(result) {
  return result?.createdAt || `${result?.title || ""}:${result?.selectedLabels || result?.dream || ""}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function makeSection(title, text) {
  const section = document.createElement("section");
  section.className = "journal-detail-section";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = text || "기록된 내용이 없습니다.";

  section.append(heading, paragraph);
  return section;
}

function renderSavedDreams() {
  const dreams = getSavedDreams();
  savedJournalList.innerHTML = "";

  if (!dreams.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state journal-empty";
    empty.innerHTML = "<strong>아직 저장된 꿈이 없습니다.</strong><span>해석 결과에서 ‘꿈 일기장에 저장’을 눌러 중요한 꿈을 보관해보세요.</span>";
    savedJournalList.append(empty);
    return;
  }

  dreams.forEach((dream) => {
    const details = document.createElement("details");
    details.className = "journal-entry";

    const summary = document.createElement("summary");

    const date = document.createElement("span");
    date.className = "history-date";
    date.textContent = formatDate(dream.savedAt || dream.createdAt);

    const title = document.createElement("strong");
    title.textContent = dream.title || "저장된 꿈";

    const meta = document.createElement("span");
    meta.className = "history-meta";
    [dream.mood || "감정", dream.fortuneSummary || dream.theme || "오늘의 흐름"].forEach((label) => {
      const chip = document.createElement("span");
      chip.textContent = label;
      meta.append(chip);
    });

    summary.append(date, title, meta);

    const body = document.createElement("div");
    body.className = "journal-entry-body";

    body.append(
      makeSection("오늘의 흐름", dream.fortuneSummary),
      makeSection("종합 해석", dream.summary),
      makeSection("마음의 흐름", dream.emotion),
      makeSection("지금 던져볼 질문", dream.question),
      makeSection("오늘의 작은 행동", dream.action),
      makeSection("선택한 단서", dream.selectedLabels || dream.dream),
    );

    const memoSection = document.createElement("section");
    memoSection.className = "journal-detail-section";

    const memoTitle = document.createElement("h3");
    memoTitle.textContent = "꿈 일기장 메모";

    const memoTextarea = document.createElement("textarea");
    memoTextarea.maxLength = 250;
    memoTextarea.value = dream.memo || "";
    memoTextarea.placeholder = "이 꿈을 다시 볼 때 떠올리고 싶은 메모를 적어보세요.";

    const memoMeta = document.createElement("div");
    memoMeta.className = "memo-meta";
    const memoHint = document.createElement("span");
    memoHint.textContent = "선택 사항 · 해석 미반영";
    const memoCount = document.createElement("span");
    memoCount.textContent = `${memoTextarea.value.length}/250`;
    memoMeta.append(memoHint, memoCount);

    memoTextarea.addEventListener("input", () => {
      memoCount.textContent = `${memoTextarea.value.length}/250`;
    });

    const actions = document.createElement("div");
    actions.className = "journal-entry-actions";

    const saveMemo = document.createElement("button");
    saveMemo.className = "primary-button";
    saveMemo.type = "button";
    saveMemo.textContent = "메모 저장";
    saveMemo.addEventListener("click", () => {
      const id = getResultId(dream);
      const nextDreams = getSavedDreams().map((item) => (
        getResultId(item) === id
          ? { ...item, memo: memoTextarea.value.trim(), updatedAt: new Date().toISOString() }
          : item
      ));
      setSavedDreams(nextDreams);
      saveMemo.textContent = "저장됨";
      setTimeout(() => {
        saveMemo.textContent = "메모 저장";
      }, 1300);
    });

    const deleteDream = document.createElement("button");
    deleteDream.className = "ghost-button";
    deleteDream.type = "button";
    deleteDream.textContent = "삭제";
    deleteDream.addEventListener("click", () => {
      setSavedDreams(getSavedDreams().filter((item) => getResultId(item) !== getResultId(dream)));
      renderSavedDreams();
    });

    actions.append(saveMemo, deleteDream);
    memoSection.append(memoTitle, memoTextarea, memoMeta, actions);
    body.append(memoSection);

    details.append(summary, body);
    savedJournalList.append(details);
  });
}

clearSavedButton.addEventListener("click", () => {
  localStorage.removeItem(SAVED_STORAGE_KEY);
  renderSavedDreams();
});

renderSavedDreams();
