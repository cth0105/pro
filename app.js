const dreamForm = document.querySelector("#dreamForm");
const dreamInput = document.querySelector("#dreamInput");
const wordCount = document.querySelector("#wordCount");
const emptyState = document.querySelector("#emptyState");
const resultCard = document.querySelector("#resultCard");
const moodTag = document.querySelector("#moodTag");
const themeTag = document.querySelector("#themeTag");
const toneTag = document.querySelector("#toneTag");
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
    keywords: ["바다", "강물", "강가", "비", "수영", "호수", "눈물", "물속", "물가", "파도", "홍수", "폭포", "연못", "웅덩이"],
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
  {
    keywords: ["떨어", "추락", "낭떠러지", "계단", "높은 곳", "엘리베이터"],
    symbol: "불안정한 발걸음",
    meaning: "높은 곳, 계단, 떨어질 뻔한 장면은 통제감이 흔들리거나 실수에 대한 걱정이 몸의 감각으로 표현된 모습일 수 있습니다.",
  },
  {
    keywords: ["쫓", "도망", "숨", "괴물", "경찰", "누군가 따라"],
    symbol: "추격",
    meaning: "피하고 싶은 문제나 아직 마주하기 부담스러운 감정이 따라오는 모습으로 나타날 수 있어요.",
  },
  {
    keywords: ["죽", "장례", "무덤", "시체", "상복"],
    symbol: "죽음",
    meaning: "실제 죽음의 예고라기보다 끝맺음, 변화, 오래된 방식과의 이별을 상징하는 경우가 많습니다.",
  },
  {
    keywords: ["돈", "지갑", "동전", "복권", "금", "보석", "선물"],
    symbol: "돈과 가치",
    meaning: "자원, 인정, 자신이 가진 가치에 대한 기대나 걱정이 드러난 장면으로 볼 수 있습니다.",
  },
  {
    keywords: ["아기", "아이", "임신", "출산", "유모차"],
    symbol: "새로운 시작",
    meaning: "아직 작고 연약하지만 자라날 가능성이 있는 계획, 관계, 감정을 비추는 상징일 수 있어요.",
  },
  {
    keywords: ["결혼", "웨딩", "신부", "신랑", "반지", "예식"],
    symbol: "약속",
    meaning: "관계의 결속, 책임, 선택을 공식화하고 싶은 마음이 꿈의 장면으로 표현될 수 있습니다.",
  },
  {
    keywords: ["연예인", "유명", "무대", "카메라", "팬", "인터뷰"],
    symbol: "주목",
    meaning: "인정받고 싶은 마음, 보여지는 나의 모습, 사회적 평가에 대한 감각과 연결될 수 있어요.",
  },
  {
    keywords: ["음식", "밥", "빵", "고기", "과일", "먹", "식당"],
    symbol: "음식",
    meaning: "몸과 마음이 필요한 에너지, 돌봄, 만족감 또는 결핍감을 알려주는 소재일 수 있습니다.",
  },
  {
    keywords: ["핸드폰", "전화", "문자", "카톡", "연락", "메시지"],
    symbol: "연락",
    meaning: "전하고 싶은 말, 기다리는 답, 관계에서 끊기거나 이어지고 싶은 마음이 담겨 있을 수 있어요.",
  },
  {
    keywords: ["회사", "일", "상사", "회의", "프로젝트", "알바", "직장"],
    symbol: "일과 책임",
    meaning: "성과 압박, 역할 부담, 인정 욕구처럼 현실의 책임감이 꿈속 업무 장면으로 이어질 수 있습니다.",
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
    keywords: ["바다", "강물", "비", "잠", "침대", "씻", "치유", "병원"],
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
  {
    name: "불안",
    keywords: ["쫓", "도망", "숨", "떨어", "추락", "늦", "잃어버", "어둠", "괴물"],
    title: "마음이 압박을 알아차린 꿈",
    question: "지금 가장 피하고 싶지만 계속 마음에 걸리는 일은 무엇인가요?",
    action: "걱정을 해결 가능한 것과 지금은 기다릴 일로 나눠 적어보세요.",
  },
  {
    name: "성취",
    keywords: ["합격", "상", "성공", "무대", "발표", "돈", "금", "박수", "승진"],
    title: "인정받고 싶은 마음이 살아난 꿈",
    question: "최근 내가 노력했지만 충분히 인정하지 못한 성과는 무엇인가요?",
    action: "작은 성과 하나를 골라 왜 의미 있었는지 한 문장으로 적어보세요.",
  },
  {
    name: "상실",
    keywords: ["이별", "죽", "장례", "잃어버", "사라", "무덤", "헤어"],
    title: "끝맺음과 정리를 준비하는 꿈",
    question: "내려놓아야 하지만 아직 붙잡고 있는 생각이나 관계가 있나요?",
    action: "끝난 일과 아직 남은 일을 두 칸으로 나눠 정리해보세요.",
  },
  {
    name: "성장",
    keywords: ["아기", "아이", "임신", "출산", "식물", "나무", "씨앗", "새싹"],
    title: "새롭게 자라나는 가능성을 보여주는 꿈",
    question: "아직 작지만 계속 키워보고 싶은 계획은 무엇인가요?",
    action: "그 계획을 오늘 10분만 돌볼 방법을 하나 정해보세요.",
  },
  {
    name: "풍요",
    keywords: ["음식", "밥", "돈", "선물", "과일", "잔치", "보석", "복권"],
    title: "필요한 자원과 만족을 살피는 꿈",
    question: "요즘 나에게 가장 부족하다고 느껴지는 자원은 시간, 돈, 애정 중 무엇인가요?",
    action: "오늘 나를 채워주는 작은 보상 하나를 의식적으로 선택해보세요.",
  },
];

const moodInterpretations = {
  평온함: "꿈의 정서는 비교적 안정적입니다. 상황을 조용히 관찰하며 다음 단계를 준비하는 마음이 커 보여요.",
  불안함: "불안은 위험 신호라기보다 아직 정리되지 않은 정보가 많다는 표시일 수 있어요. 속도를 낮추면 단서가 보입니다.",
  기쁨: "즐거운 감정은 회복력과 기대감이 살아 있다는 신호입니다. 최근의 작은 성취를 더 크게 인정해도 좋겠어요.",
  그리움: "그리움은 잃어버린 것만이 아니라 아직 소중히 여기는 것을 알려줍니다. 마음이 향하는 대상을 살펴보세요.",
  혼란스러움: "혼란은 여러 욕구가 동시에 말하고 있다는 뜻일 수 있습니다. 한 번에 결론 내리기보다 분류가 먼저입니다.",
};

const toneLabels = {
  balanced: "기본형",
  short: "짧게",
  detail: "자세히",
  comfort: "위로형",
  practical: "현실 조언형",
};

function buildSummary({ clippedDream, selectedTheme, selectedSymbols, mood, tone }) {
  const firstMeaning = selectedSymbols[0].meaning;

  if (tone === "short") {
    return `"${clippedDream}" 이 꿈은 ${selectedTheme.name}과 관련이 깊어 보여요. 핵심은 ${selectedSymbols[0].symbol}입니다.`;
  }

  if (tone === "detail") {
    return `"${clippedDream}" 이 꿈은 ${selectedTheme.name}의 흐름을 품고 있어요. ${firstMeaning} 특히 ${mood}이라는 감정이 함께 남았다면, 꿈의 장면보다 그 감정이 현실에서 어디와 연결되는지 보는 것이 좋습니다.`;
  }

  if (tone === "comfort") {
    return `"${clippedDream}" 이 꿈은 ${selectedTheme.name}의 흐름을 품고 있어요. ${firstMeaning} 불편한 장면이 있었더라도 마음이 스스로를 이해하려고 보내는 신호로 받아들여도 괜찮습니다.`;
  }

  if (tone === "practical") {
    return `"${clippedDream}" 이 꿈은 ${selectedTheme.name}의 흐름을 보여줍니다. ${firstMeaning} 지금은 의미를 오래 붙잡기보다 현실에서 바로 조정할 수 있는 작은 행동을 정하는 편이 도움이 됩니다.`;
  }

  return `"${clippedDream}" 이 꿈은 ${selectedTheme.name}의 흐름을 품고 있어요. ${firstMeaning}`;
}

function tuneEmotionText(baseText, tone) {
  if (tone === "short") {
    return baseText;
  }

  if (tone === "detail") {
    return `${baseText} 꿈에서 강했던 감정은 현재 생활의 압력, 관계의 거리, 선택의 부담과 이어져 있을 수 있습니다.`;
  }

  if (tone === "comfort") {
    return `${baseText} 지금 당장 답을 찾지 못해도 괜찮아요. 우선 마음이 어떤 이름으로 자신을 표현했는지 알아차리는 것만으로도 충분합니다.`;
  }

  if (tone === "practical") {
    return `${baseText} 이 감정을 오늘의 일정, 대화, 해야 할 일 중 하나와 연결해보면 더 구체적인 단서가 보일 수 있습니다.`;
  }

  return baseText;
}

function tuneActionText(baseText, tone) {
  if (tone === "short") {
    return baseText;
  }

  if (tone === "detail") {
    return `${baseText} 가능하다면 꿈에서 가장 선명했던 장면, 그때의 감정, 현실에서 떠오르는 사건을 세 줄로 나눠 적어보세요.`;
  }

  if (tone === "comfort") {
    return `${baseText} 부담스럽다면 완벽하게 정리하려 하지 말고, 오늘 나를 조금 편하게 해주는 선택 하나만 해도 좋습니다.`;
  }

  if (tone === "practical") {
    return `${baseText} 실행 시간을 정해두면 더 좋습니다. 예를 들어 오늘 밤 10분처럼 작고 분명한 단위로 잡아보세요.`;
  }

  return baseText;
}

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

function cleanPhrase(value) {
  return value
    .replace(/[.,!?。！？，]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanDisplayWord(word) {
  const cleaned = cleanPhrase(word);

  if (/^(안에는|손에는)$/u.test(cleaned)) {
    return "";
  }

  if (cleaned.length <= 1) {
    return cleaned;
  }

  return cleaned.replace(/(에서는|에는|에서|으로|에게|부터|까지|처럼|이며|이고|였다|했다|했는데|있었고|있었는데|이라서|이라며|이라는|이었던|였던|을|를|이|가|과|와|에|만)$/u, "");
}

function looksLikeAction(word) {
  return /(찾고|내려가|올라가|다가|했고|했어요|있었|사라|불렀|남아|잃어|도망|기다리|봤|갔|왔)/u.test(word);
}

function extractUserPhrase(text, keyword) {
  const fragments = text
    .split(/[.!?。！？,，\n]/)
    .map((fragment) => fragment.trim())
    .filter(Boolean);
  const fragment = fragments.find((item) => item.includes(keyword)) || text;
  const words = fragment.split(/\s+/).filter(Boolean);
  const index = words.findIndex((word) => word.includes(keyword));

  if (index === -1) {
    return keyword;
  }

  const start = Math.max(0, index - 1);
  const phraseWords = words.slice(start, index + 1);
  const next = words[index + 1];
  const nextAfter = words[index + 2];

  if (next && !looksLikeAction(next)) {
    phraseWords.push(next);
  }

  if (next === "몇" && nextAfter) {
    phraseWords.push(nextAfter);
  }

  const phrase = phraseWords.map(cleanDisplayWord).filter(Boolean).join(" ");
  return cleanPhrase(phrase) || keyword;
}

function buildDisplayPhrase(matches) {
  const phrases = [];

  matches
    .sort((a, b) => a.index - b.index || b.keyword.length - a.keyword.length)
    .forEach((match) => {
      const phrase = cleanPhrase(match.phrase);
      const alreadyIncluded = phrases.some(
        (item) => {
          const itemWords = new Set(item.split(/\s+/));
          const phraseWords = phrase.split(/\s+/);
          const overlap = phraseWords.filter((word) => itemWords.has(word)).length;

          return item.includes(phrase) || phrase.includes(item) || overlap >= 1;
        },
      );

      if (phrase && !alreadyIncluded) {
        phrases.push(phrase);
      }
    });

  return phrases.slice(0, 2).join(" / ");
}

function scoreByKeywords(text, items) {
  return items
    .map((item) => {
      const matches = item.keywords
        .filter((keyword) => text.includes(keyword))
        .map((keyword) => ({
          keyword,
          index: text.indexOf(keyword),
          phrase: extractUserPhrase(text, keyword),
        }));

      return {
        ...item,
        matches,
        displayPhrase: buildDisplayPhrase(matches) || item.symbol || item.name,
        score: item.keywords.reduce((sum, keyword) => {
        if (!text.includes(keyword)) {
          return sum;
        }

        return sum + (keyword.length > 1 ? 2 : 1);
      }, 0),
      };
    })
    .sort((a, b) => b.score - a.score);
}

function interpretDream(text, mood, tone = "balanced") {
  const normalized = text.replace(/\s+/g, " ").trim();
  const symbols = scoreByKeywords(normalized, symbolBank)
    .filter((item) => item.score > 0)
    .slice(0, 3);
  const fallbackSymbols = [
    {
      symbol: "분위기",
      displayPhrase: "꿈의 전체 분위기",
      meaning: "구체적인 사물보다 전체 분위기가 중요한 꿈입니다. 장면이 남긴 감각부터 살펴보세요.",
    },
    {
      symbol: "반복되는 장면",
      displayPhrase: "반복해서 떠오른 장면",
      meaning: "꿈에서 오래 머문 장면은 현재 마음이 붙잡고 있는 주제일 가능성이 큽니다.",
    },
  ];
  const selectedSymbols = symbols.length ? symbols : fallbackSymbols;
  const theme = scoreByKeywords(normalized, themeBank)[0];
  const selectedTheme = theme.score > 0 ? theme : themeBank[0];
  const clippedDream = normalized.length > 120 ? `${normalized.slice(0, 120)}...` : normalized;
  const safeTone = toneLabels[tone] ? tone : "balanced";

  return {
    createdAt: new Date().toISOString(),
    dream: normalized,
    mood,
    tone: safeTone,
    toneLabel: toneLabels[safeTone],
    theme: selectedTheme.name,
    title: selectedTheme.title,
    summary: buildSummary({
      clippedDream,
      selectedTheme,
      selectedSymbols,
      mood,
      tone: safeTone,
    }),
    symbols: selectedSymbols.map(({ symbol, displayPhrase, meaning }) => ({
      symbol,
      label: displayPhrase || symbol,
      meaning,
    })),
    emotion: tuneEmotionText(moodInterpretations[mood], safeTone),
    question: selectedTheme.question,
    action: tuneActionText(selectedTheme.action, safeTone),
  };
}

function renderResult(result) {
  emptyState.classList.add("hidden");
  resultCard.classList.remove("hidden");
  copyButton.disabled = false;

  moodTag.textContent = result.mood;
  themeTag.textContent = result.theme;
  toneTag.textContent = result.toneLabel || toneLabels[result.tone] || toneLabels.balanced;
  summaryTitle.textContent = result.title;
  summaryText.textContent = result.summary;
  emotionText.textContent = result.emotion;
  questionText.textContent = result.question;
  actionText.textContent = result.action;

  symbolList.innerHTML = "";
  result.symbols.forEach(({ symbol, label, meaning }) => {
    const li = document.createElement("li");
    li.textContent = `${label || symbol}: ${meaning}`;
    symbolList.append(li);
  });

  copyButton.dataset.copy = [
    `꿈해몽 노트 - ${result.title}`,
    `감정: ${result.mood}`,
    `테마: ${result.theme}`,
    `해석 톤: ${toneTag.textContent}`,
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
      const toneInput = document.querySelector(`input[name="tone"][value="${item.tone || "balanced"}"]`);
      if (toneInput) {
        toneInput.checked = true;
      }
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
  const tone = new FormData(dreamForm).get("tone");

  if (text.length < 8) {
    dreamInput.focus();
    wordCount.textContent = "조금만 더 자세히 적어주세요.";
    wordCount.style.color = "var(--warning)";
    return;
  }

  wordCount.style.color = "";
  const result = interpretDream(text, mood, tone);
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
