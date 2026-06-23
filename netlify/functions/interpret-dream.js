const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const MODEL = "gpt-4.1-mini";

const toneLabels = {
  balanced: "기본형",
  short: "짧게",
  detail: "자세히",
  comfort: "위로형",
  practical: "현실 조언형",
};

const moodLabels = ["평온함", "불안함", "기쁨", "그리움", "혼란스러움"];

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return response(405, { error: "POST 요청만 지원합니다." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response(500, { error: "OpenAI API 키가 서버에 설정되어 있지 않습니다." });
  }

  const body = safeJsonParse(event.body || "{}");
  const dream = String(body?.dream || "").trim();
  const mood = moodLabels.includes(body?.mood) ? body.mood : "혼란스러움";
  const tone = toneLabels[body?.tone] ? body.tone : "balanced";

  if (dream.length < 8) {
    return response(400, { error: "꿈 내용을 조금 더 자세히 입력해 주세요." });
  }

  if (dream.length > 1600) {
    return response(400, { error: "꿈 내용은 1600자 이하로 입력해 주세요." });
  }

  const prompt = [
    "당신은 한국어 꿈 해석 웹앱의 해석 엔진입니다.",
    "예언, 공포 조장, 의학적 진단처럼 단정적인 표현은 피하고 자기 성찰을 돕는 말투로 답하세요.",
    "사용자가 입력한 꿈속 표현을 주요 상징 label에 그대로 반영하세요.",
    "반드시 JSON만 출력하세요. 마크다운, 코드블록, 설명 문장은 쓰지 마세요.",
    "",
    `감정: ${mood}`,
    `해석 톤: ${toneLabels[tone]}`,
    `꿈 내용: ${dream}`,
    "",
    "JSON 스키마:",
    '{ "title": "짧은 제목", "theme": "짧은 테마", "summary": "핵심 요약 2~4문장", "symbols": [{ "label": "꿈속 실제 표현", "meaning": "해석 1~2문장" }], "emotion": "마음의 흐름 2~4문장", "question": "사용자가 오늘 던져볼 질문 1문장", "action": "오늘 할 수 있는 작은 행동 1~2문장" }',
  ].join("\n");

  try {
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        input: prompt,
        temperature: 0.8,
        max_output_tokens: 900,
      }),
    });

    const payload = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return response(openaiResponse.status, {
        error: payload?.error?.message || "OpenAI 응답을 가져오지 못했습니다.",
      });
    }

    const rawText = payload.output_text || "";
    const interpretation = safeJsonParse(rawText);

    if (!interpretation) {
      return response(502, { error: "AI 응답 형식을 해석하지 못했습니다." });
    }

    return response(200, { interpretation });
  } catch (error) {
    return response(500, { error: "AI 해석 중 오류가 발생했습니다." });
  }
};
