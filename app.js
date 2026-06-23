const dreamForm = document.querySelector("#dreamForm");
const dreamInput = document.querySelector("#dreamInput");
const wordCount = document.querySelector("#wordCount");
const emptyState = document.querySelector("#emptyState");
const resultCard = document.querySelector("#resultCard");
const moodTag = document.querySelector("#moodTag");
const themeTag = document.querySelector("#themeTag");
const summaryTitle = document.querySelector("#summaryTitle");
const summaryText = document.querySelector("#summaryText");
const symbolList = document.querySelector("#symbolList");
const emotionText = document.querySelector("#emotionText");
const questionText = document.querySelector("#questionText");
const actionText = document.querySelector("#actionText");
const copyButton = document.querySelector("#copyButton");
const historyList = document.querySelector("#historyList");
const clearHistoryButton = document.querySelector("#clearHistoryButton");

const STORAGE_KEY = "dream-note-history";

const symbolBank = [
  {
    keywords: ["물", "바다", "강", "비", "수영", "호수", "눈물"],
    symbol: "물",
    meaning: "감정이 표면 위로 올라오는 신호일 수 있어요. 흐름을 막기보다 이름 붙여보면 좋습니다.",
  },
  {
    keywords: ["집", "방", "문", "창문", "아파트", "고향"],
    symbol: "집",
    meaning: "나의 경계, 안정감, 사적인 마음을 비추는 장면으로 읽을 수 있어요.",
  },
  {
    keywords: ["학교", "시험", "교실", "선생님", "숙제"],
    symbol: "학교",
    meaning: "평가받는 느낌이나 배우는 중인 과제가 꿈의 언어로 나타났을 가능성이 있습니다.",
  },
  {
    keywords: ["기차", "버스", "차", "비행기", "역", "공항", "길"],
    symbol: "이동",
    meaning: "삶의 방향 전환, 기다림, 선택의 타이밍을 생각하게 하는 상징이에요.",
  },
  {
    keywords: ["사람", "친구", "가족", "연인", "엄마", "아빠", "동료"],
    symbol: "인물",
    meaning: "그 사람이 실제 인물이라기보다 내 안의 역할, 욕구, 관계 패턴을 보여줄 수 있습니다.",
  },
  {
    keywords: ["동물", "새", "고양이", "개", "말", "뱀"],
    symbol: "생명체",
    meaning: "본능, 보호받고 싶은 마음, 또는 말로 설명하기 어려운 감각이 움직이고 있을 수 있어요.",
  },
  {
    keywords: ["불", "촛불", "태양", "빛", "번개"],
    symbol: "빛과 불",
    meaning: "활력, 깨달음, 급한 감정처럼 에너지가 강한 주제를 품고 있습니다.",
  },
  {
    keywords: ["어둠", "밤", "그림자", "지하", "터널"],
    symbol: "어둠",
    meaning: "아직 말로 정리되지 않은 불안이나 숨겨둔 생각을 조심스럽게 바라보라는 초대일 수 있어요.",
  },
];

const themeBank = [
  {
    name: "전환",
    keywords: ["길", "역", "공항", "문", "이사", "떠나", "기차", "버스", "비행기"],
    title: "새로운 방향을 준비하는 꿈",
    question: "지금 미루고 있는 선택이 있다면, 사실 가장 두려운 부분은 무엇인가요?",
    action: "오늘 할 일 하나를 아주 작게 쪼개서 첫 단계만 실행해보세요.",
  },
  {
    name: "회복",
    keywords: ["물", "비", "잠", "침대", "씻", "치유", "병원"],
    title: "마음이 정리될 시간을 요청하는 꿈",
    question: "최근에 충분히 쉬지 못한 감정은 무엇인가요?",
    action: "잠들기 전 5분 동안 오늘의 감정을 세 단어로 적어보세요.",
  },
  {
    name: "관계",
    keywords: ["친구", "가족", "연인", "동료", "말", "싸움", "만남", "이별"],
    title: "관계 속 마음의 거리를 살피는 꿈",
    question: "누군가에게 말하지 못하고 삼킨 문장이 있나요?",
    action: "바로 보내지 않아도 좋으니, 그 사람에게 쓰는 짧은 편지를 적어보세요.",
  },
  {
    name: "자기확인",
    keywords: ["거울", "시험", "학교", "무대", "발표", "옷", "이름"],
    title: "나를 어떻게 보여주고 싶은지 묻는 꿈",
    question: "요즘 내가 가장 인정받고 싶은 부분은 무엇인가요?",
    action: "오늘 잘한 일 하나를 구체적으로 기록해두세요.",
  },
];

const moodInterpretations = {
  평온함: "꿈의 정서는 비교적 안정적입니다. 상황을 조용히 관찰하며 다음 단계를 준비하는 마음이 커 보여요.",
  불안함: "불안은 위험 신호라기보다 아직 정리되지 않은 정보가 많다는 표시일 수 있어요. 속도를 낮추면 단서가 보입니다.",
  기쁨: "즐거운 감정은 회복력과 기대감이 살아 있다는 신호입니다. 최근의 작은 성취를 더 크게 인정해도 좋겠어요.",
  그리움: "그리움은 잃어버린 것만이 아니라 아직 소중히 여기는 것을 알려줍니다. 마음이 향하는 대상을 살펴보세요.",
  혼란스러움: "혼란은 여러 욕구가 동시에 말하고 있다는 뜻일 수 있습니다. 한 번에 결론 내리기보다 분류가 먼저입니다.",
};

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function setHistory(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 6)));
}

function scoreByKeywords(text, items) {
  return items
    .map((item) => ({
      ...item,
      score: item.keywords.filter((keyword) => text.includes(keyword)).length,
    }))
    .sort((a, b) => b.score - a.score);
}

function interpretDream(text, mood) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const symbols = scoreByKeywords(normalized, symbolBank)
    .filter((item) => item.score > 0)
    .slice(0, 3);
  const fallbackSymbols = [
    {
      symbol: "분위기",
      meaning: "구체적인 사물보다 전체 분위기가 중요한 꿈입니다. 장면이 남긴 감각부터 살펴보세요.",
    },
    {
      symbol: "반복되는 장면",
      meaning: "꿈에서 오래 머문 장면은 현재 마음이 붙잡고 있는 주제일 가능성이 큽니다.",
    },
  ];
  const selectedSymbols = symbols.length ? symbols : fallbackSymbols;
  const theme = scoreByKeywords(normalized, themeBank)[0];
  const selectedTheme = theme.score > 0 ? theme : themeBank[0];
  const clippedDream = normalized.length > 120 ? `${normalized.slice(0, 120)}...` : normalized;

  return {
    createdAt: new Date().toISOString(),
    dream: normalized,
    mood,
    theme: selectedTheme.name,
    title: selectedTheme.title,
    summary:
      `"${clippedDream}" 이 꿈은 ${selectedTheme.name}의 흐름을 품고 있어요. ${selectedSymbols[0].meaning}`,
    symbols: selectedSymbols.map(({ symbol, meaning }) => ({ symbol, meaning })),
    emotion: moodInterpretations[mood],
    question: selectedTheme.question,
    action: selectedTheme.action,
  };
}

function renderResult(result) {
  emptyState.classList.add("hidden");
  resultCard.classList.remove("hidden");
  copyButton.disabled = false;

  moodTag.textContent = result.mood;
  themeTag.textContent = result.theme;
  summaryTitle.textContent = result.title;
  summaryText.textContent = result.summary;
  emotionText.textContent = result.emotion;
  questionText.textContent = result.question;
  actionText.textContent = result.action;

  symbolList.innerHTML = "";
  result.symbols.forEach(({ symbol, meaning }) => {
    const li = document.createElement("li");
    li.textContent = `${symbol}: ${meaning}`;
    symbolList.append(li);
  });

  copyButton.dataset.copy = [
    `꿈해몽 노트 - ${result.title}`,
    `감정: ${result.mood}`,
    `테마: ${result.theme}`,
    result.summary,
    `질문: ${result.question}`,
    `작은 행동: ${result.action}`,
  ].join("\n");
}

function renderHistory() {
  const history = getHistory();
  historyList.innerHTML = "";

  if (!history.length) {
    const empty = document.createElement("p");
    empty.className = "history-empty";
    empty.textContent = "아직 저장된 꿈 기록이 없습니다.";
    historyList.append(empty);
    return;
  }

  history.forEach((item, index) => {
    const wrapper = document.createElement("article");
    wrapper.className = "history-item";

    const button = document.createElement("button");
    button.type = "button";
    button.addEventListener("click", () => {
      renderResult(item);
      dreamInput.value = item.dream;
      updateCount();
      document.querySelector(`input[name="mood"][value="${item.mood}"]`).checked = true;
    });

    const date = document.createElement("span");
    date.className = "history-date";
    date.textContent = new Intl.DateTimeFormat("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(item.createdAt));

    const title = document.createElement("strong");
    title.textContent = item.title;

    const preview = document.createElement("span");
    preview.className = "history-preview";
    preview.textContent = item.dream;

    button.append(date, title, preview);
    wrapper.append(button);
    historyList.append(wrapper);
  });
}

function updateCount() {
  wordCount.textContent = `${dreamInput.value.trim().length}자`;
}

dreamInput.addEventListener("input", updateCount);

dreamForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = dreamInput.value.trim();
  const mood = new FormData(dreamForm).get("mood");

  if (text.length < 8) {
    dreamInput.focus();
    wordCount.textContent = "조금만 더 자세히 적어주세요.";
    wordCount.style.color = "var(--warning)";
    return;
  }

  wordCount.style.color = "";
  const result = interpretDream(text, mood);
  renderResult(result);
  setHistory([result, ...getHistory()]);
  renderHistory();
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.copy);
    copyButton.textContent = "복사됨";
    setTimeout(() => {
      copyButton.textContent = "복사";
    }, 1400);
  } catch {
    copyButton.textContent = "복사 실패";
  }
});

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
});

updateCount();
renderHistory();
