const dreamForm = document.querySelector("#dreamForm");
const dreamInput = document.querySelector("#dreamInput");
const memoCounter = document.querySelector("#memoCounter");
const wordCount = document.querySelector("#wordCount");
const emptyState = document.querySelector("#emptyState");
const resultCard = document.querySelector("#resultCard");
const moodTag = document.querySelector("#moodTag");
const themeTag = document.querySelector("#themeTag");
const summaryTitle = document.querySelector("#summaryTitle");
const summaryText = document.querySelector("#summaryText");
const fortuneSummaryText = document.querySelector("#fortuneSummaryText");
const symbolList = document.querySelector("#symbolList");
const emotionText = document.querySelector("#emotionText");
const questionText = document.querySelector("#questionText");
const actionText = document.querySelector("#actionText");
const copyButton = document.querySelector("#copyButton");
const saveDreamButton = document.querySelector("#saveDreamButton");
const historyList = document.querySelector("#historyList");
const savedList = document.querySelector("#savedList");
const clearHistoryButton = document.querySelector("#clearHistoryButton");
const clearSavedButton = document.querySelector("#clearSavedButton");
const resetButton = document.querySelector("#resetButton");
const submitButton = document.querySelector("#submitButton");
const prevStepButton = document.querySelector("#prevStepButton");
const nextStepButton = document.querySelector("#nextStepButton");
const stepTitle = document.querySelector("#stepTitle");
const stepMeterFill = document.querySelector("#stepMeterFill");
const engineTag = document.querySelector("#engineTag");
const placeCategoryOptions = document.querySelector("#placeCategoryOptions");
const placeOptions = document.querySelector("#placeOptions");
const targetCategoryOptions = document.querySelector("#targetCategoryOptions");
const targetDetailOptions = document.querySelector("#targetDetailOptions");
const actionCategoryOptions = document.querySelector("#actionCategoryOptions");
const actionOptions = document.querySelector("#actionOptions");
const lifeTopicCategoryOptions = document.querySelector("#lifeTopicCategoryOptions");
const lifeTopicOptions = document.querySelector("#lifeTopicOptions");
const selectedSummary = document.querySelector("#selectedSummary");
const selectionReview = document.querySelector("#selectionReview");
const realitySection = document.querySelector("#realitySection");
const realityText = document.querySelector("#realityText");
const memoNote = document.querySelector("#memoNote");
const memoText = document.querySelector("#memoText");
const saveHistoryInput = document.querySelector("#saveHistoryInput");

const STORAGE_KEY = "dream-note-history";
const SAVED_STORAGE_KEY = "dream-note-saved";
const OPTION_PREFIX = "dream-option:";
const stepLabels = ["장소", "감정", "대상", "사건", "현실", "확인"];
let currentStep = 0;
let currentResult = null;

const optionLimits = {
  place: 2,
  placeCategory: 2,
  targetCategory: 3,
  targetDetail: 3,
  actionCategory: 3,
  action: 3,
  lifeTopicCategory: 2,
  lifeTopic: 2,
};

const optionGroups = {
  placeCategory: [
    { id: "daily_place", label: "일상 공간" },
    { id: "transition_place", label: "이동/전환 공간" },
    { id: "nature_place", label: "자연 공간" },
    { id: "uneasy_place", label: "낯선/불안한 공간" },
    { id: "special_place", label: "특별한 장소" },
  ],
  place: [
    { id: "home", category: "daily_place", label: "집/방", theme: "안정", meaning: "익숙한 공간은 나의 경계, 안정감, 사적인 마음을 비추는 단서입니다." },
    { id: "school", category: "daily_place", label: "학교/시험장", theme: "자기확인", meaning: "평가받는 느낌이나 배우는 중인 과제가 마음에 남아 있을 수 있습니다." },
    { id: "work", category: "daily_place", label: "회사/직장", theme: "책임", meaning: "성과 압박, 역할 부담, 인정 욕구처럼 현실의 책임감과 연결될 수 있습니다." },
    { id: "bathroom", category: "daily_place", label: "화장실", theme: "정리", meaning: "화장실은 감정이나 부담을 비워내고 싶은 마음과 연결될 수 있습니다." },
    { id: "cafe", category: "daily_place", label: "식당/카페", theme: "충전", meaning: "식당과 카페는 에너지, 교류, 돌봄과 만족의 필요를 보여줍니다." },
    { id: "street", category: "transition_place", label: "길/거리", theme: "전환", meaning: "길은 선택의 방향, 이동 중인 상태, 다음 단계로 가려는 마음을 보여줍니다." },
    { id: "station", category: "transition_place", label: "역/터미널", theme: "전환", meaning: "역과 터미널은 기다림, 출발, 아직 정해지지 않은 방향을 상징합니다." },
    { id: "airport", category: "transition_place", label: "공항/비행기", theme: "전환", meaning: "공항과 비행기는 큰 변화, 멀리 가고 싶은 마음, 새로운 가능성과 연결됩니다." },
    { id: "bridge", category: "transition_place", label: "다리", theme: "전환", meaning: "다리는 한 상태에서 다른 상태로 건너가는 변화의 단서입니다." },
    { id: "water_place", category: "nature_place", label: "바다/강/호수", theme: "회복", meaning: "물가의 장면은 감정의 흐름, 회복, 마음을 정리하고 싶은 욕구를 보여줍니다." },
    { id: "forest", category: "nature_place", label: "숲/산", theme: "탐색", meaning: "숲과 산은 혼자만의 탐색, 성장, 아직 정리되지 않은 생각을 상징할 수 있습니다." },
    { id: "sky", category: "nature_place", label: "하늘", theme: "전환", meaning: "하늘은 시야가 넓어지는 감각, 자유, 가능성을 보여줍니다." },
    { id: "unknown_place", category: "uneasy_place", label: "낯선 공간", theme: "불안", meaning: "낯선 공간은 새로운 상황에 대한 긴장감이나 아직 적응 중인 마음을 보여줍니다." },
    { id: "dark_place", category: "uneasy_place", label: "어두운 공간", theme: "불안", meaning: "어두운 공간은 말로 정리되지 않은 걱정이나 숨겨둔 감정을 비출 수 있습니다." },
    { id: "high_place", category: "uneasy_place", label: "높은 곳/계단", theme: "불안", meaning: "높은 곳과 계단은 통제감이 흔들리거나 실수에 대한 걱정과 이어질 수 있습니다." },
    { id: "underground", category: "uneasy_place", label: "지하/터널", theme: "불안", meaning: "지하와 터널은 아직 밖으로 나오지 못한 생각이나 통과 중인 시간을 상징합니다." },
    { id: "hospital", category: "special_place", label: "병원", theme: "회복", meaning: "병원은 회복이 필요한 부분, 돌봄, 몸과 마음의 신호를 살피라는 단서입니다." },
    { id: "event_hall", category: "special_place", label: "결혼식장/행사장", theme: "관계", meaning: "행사장은 관계, 약속, 사람들 앞에서의 역할을 의식하는 마음과 닿아 있습니다." },
    { id: "funeral_place", category: "special_place", label: "장례식장", theme: "상실", meaning: "장례식장은 끝맺음, 정리, 보내줘야 할 감정을 떠올리게 합니다." },
    { id: "stage_place", category: "special_place", label: "무대/공연장", theme: "자기확인", meaning: "무대는 보여지는 나, 평가, 인정받고 싶은 마음을 상징합니다." },
  ],
  targetCategory: [
    { id: "people", label: "사람" },
    { id: "animal", label: "동물" },
    { id: "object", label: "물건" },
    { id: "nature", label: "자연/상징" },
  ],
  targetDetail: [
    { id: "family", category: "people", label: "가족", theme: "관계", meaning: "가족은 가까운 책임감, 돌봄, 오래된 감정 패턴을 떠올리게 하는 단서입니다." },
    { id: "friend", category: "people", label: "친구", theme: "관계", meaning: "친구는 소통, 소속감, 편하게 기대고 싶은 마음과 연결됩니다." },
    { id: "lover", category: "people", label: "연인", theme: "관계", meaning: "연인은 친밀감, 기대, 확인받고 싶은 마음을 보여줄 수 있습니다." },
    { id: "ex", category: "people", label: "전 연인", theme: "상실", meaning: "전 연인은 지나간 관계, 정리되지 않은 감정, 반복되는 관계 패턴을 비출 수 있습니다." },
    { id: "coworker", category: "people", label: "직장 동료", theme: "책임", meaning: "직장 동료는 협업, 비교, 평가받는 감각과 연결될 수 있습니다." },
    { id: "boss_teacher", category: "people", label: "상사/선생님", theme: "자기확인", meaning: "상사나 선생님은 기준, 평가, 인정받고 싶은 마음을 상징합니다." },
    { id: "stranger", category: "people", label: "낯선 사람", theme: "탐색", meaning: "낯선 사람은 아직 익숙하지 않은 내 모습이나 새로운 관계의 가능성을 나타낼 수 있습니다." },
    { id: "crowd", category: "people", label: "많은 사람", theme: "자기확인", meaning: "많은 사람은 시선, 소속감, 사회적 평가에 대한 감각과 연결됩니다." },
    { id: "child", category: "people", label: "어린아이", theme: "성장", meaning: "어린아이는 보호받고 싶은 마음이나 새롭게 자라나는 가능성을 보여줍니다." },
    { id: "cat", category: "animal", label: "고양이", theme: "탐색", meaning: "고양이는 독립성, 조심스러운 거리감, 내 마음의 섬세한 감각을 상징할 수 있습니다." },
    { id: "dog", category: "animal", label: "강아지", theme: "관계", meaning: "강아지는 신뢰, 애정, 보호받거나 돌보고 싶은 마음을 보여줍니다." },
    { id: "snake", category: "animal", label: "뱀", theme: "불안", meaning: "뱀은 경계심, 변화, 쉽게 말하기 어려운 긴장감을 상징할 수 있습니다." },
    { id: "bird", category: "animal", label: "새", theme: "전환", meaning: "새는 자유, 이동, 더 멀리 보고 싶은 마음과 연결됩니다." },
    { id: "horse", category: "animal", label: "말", theme: "성장", meaning: "말은 추진력, 본능적인 에너지, 앞으로 나아가려는 힘을 보여줍니다." },
    { id: "lion", category: "animal", label: "사자/호랑이", theme: "불안", meaning: "사자나 호랑이는 강한 힘, 압도감, 마주하기 부담스러운 대상을 나타낼 수 있습니다." },
    { id: "fish", category: "animal", label: "물고기", theme: "회복", meaning: "물고기는 감정 깊은 곳의 움직임, 가능성, 잡히지 않는 생각을 상징합니다." },
    { id: "bug", category: "animal", label: "벌레", theme: "불안", meaning: "벌레는 작지만 신경 쓰이는 문제, 불편한 감각, 미뤄둔 걱정과 연결될 수 있습니다." },
    { id: "wallet", category: "object", label: "지갑", theme: "풍요", meaning: "지갑은 안정감, 자원, 내가 가진 가치에 대한 감각을 보여줍니다." },
    { id: "money", category: "object", label: "돈/동전", theme: "풍요", meaning: "돈과 동전은 자원, 인정, 현실적인 불안이나 기대를 나타냅니다." },
    { id: "phone", category: "object", label: "휴대폰", theme: "관계", meaning: "휴대폰은 연락, 기다리는 답, 말하지 못한 문장과 연결됩니다." },
    { id: "key", category: "object", label: "열쇠", theme: "전환", meaning: "열쇠는 닫힌 상황을 열 방법, 선택권, 해결의 실마리를 상징합니다." },
    { id: "bag", category: "object", label: "가방", theme: "책임", meaning: "가방은 내가 들고 있는 책임, 준비물, 감당해야 할 짐을 나타냅니다." },
    { id: "shoes", category: "object", label: "신발", theme: "전환", meaning: "신발은 이동의 준비, 현실에서 앞으로 나아가는 방식과 연결됩니다." },
    { id: "clothes", category: "object", label: "옷", theme: "자기확인", meaning: "옷은 보여지는 나, 역할, 타인의 시선을 의식하는 마음을 보여줍니다." },
    { id: "clock", category: "object", label: "시계", theme: "불안", meaning: "시계는 시간 압박, 늦을까 봐 걱정하는 마음, 마감에 대한 긴장을 나타냅니다." },
    { id: "ring", category: "object", label: "반지", theme: "관계", meaning: "반지는 약속, 관계의 결속, 책임감을 상징할 수 있습니다." },
    { id: "gift", category: "object", label: "선물", theme: "풍요", meaning: "선물은 기대, 인정, 내가 받거나 주고 싶은 마음을 보여줍니다." },
    { id: "lottery", category: "object", label: "복권", theme: "풍요", meaning: "복권은 우연한 기회, 기대감, 현실을 바꾸고 싶은 욕구와 연결됩니다." },
    { id: "mirror", category: "object", label: "거울", theme: "자기확인", meaning: "거울은 나를 어떻게 보고 있는지, 인정받고 싶은 모습과 연결됩니다." },
    { id: "photo", category: "object", label: "사진", theme: "상실", meaning: "사진은 기억, 그리움, 지나간 장면을 붙잡고 싶은 마음을 나타낼 수 있습니다." },
    { id: "water", category: "nature", label: "물", theme: "회복", meaning: "물은 감정의 흐름, 회복, 마음속에 올라오는 감각을 보여줍니다." },
    { id: "rain", category: "nature", label: "비", theme: "회복", meaning: "비는 정화, 슬픔, 조용히 마음을 씻어내고 싶은 흐름을 상징합니다." },
    { id: "fire", category: "nature", label: "불", theme: "성취", meaning: "불은 강한 에너지, 분노, 열정, 빠르게 타오르는 감정을 나타냅니다." },
    { id: "light", category: "nature", label: "빛", theme: "전환", meaning: "빛은 깨달음, 희망, 막힌 상황 속에서 보이는 가능성을 상징합니다." },
    { id: "darkness", category: "nature", label: "어둠", theme: "불안", meaning: "어둠은 아직 말로 정리되지 않은 불안이나 숨겨둔 생각을 비출 수 있습니다." },
    { id: "wind", category: "nature", label: "바람", theme: "전환", meaning: "바람은 변화의 기운, 흔들림, 가볍게 움직이고 싶은 마음과 연결됩니다." },
    { id: "snow", category: "nature", label: "눈", theme: "정리", meaning: "눈은 덮어두고 싶은 감정, 차분함, 잠시 멈춤의 필요를 나타냅니다." },
    { id: "lightning", category: "nature", label: "번개", theme: "불안", meaning: "번개는 갑작스러운 깨달음, 충격, 예기치 못한 변화에 대한 긴장을 상징합니다." },
    { id: "flower_tree", category: "nature", label: "꽃/나무", theme: "성장", meaning: "꽃과 나무는 성장, 회복, 천천히 자라나는 가능성을 보여줍니다." },
    { id: "door", category: "nature", label: "문", theme: "전환", meaning: "문은 새로운 단계, 선택의 입구, 열거나 닫고 싶은 마음을 상징합니다." },
    { id: "window", category: "nature", label: "창문", theme: "전환", meaning: "창문은 바깥을 바라보는 시선, 가능성, 거리 두고 보고 싶은 마음을 보여줍니다." },
  ],
  actionCategory: [
    { id: "move_search", label: "이동/탐색" },
    { id: "avoid_fear", label: "회피/불안" },
    { id: "relation_talk", label: "관계/소통" },
    { id: "eval_result", label: "평가/성과" },
    { id: "loss_change", label: "상실/변화" },
    { id: "recover_daily", label: "회복/일상" },
  ],
  action: [
    { id: "waiting", category: "move_search", label: "기다림", theme: "전환", meaning: "기다림은 아직 때가 오지 않았거나 결정을 앞둔 상태를 나타냅니다." },
    { id: "lost", category: "move_search", label: "길을 잃음", theme: "불안", meaning: "길을 잃는 장면은 방향감각이 흔들리거나 선택이 어려운 상태를 나타냅니다." },
    { id: "find_item", category: "move_search", label: "무언가를 찾음", theme: "탐색", meaning: "찾는 행동은 답, 기회, 잃어버린 감각을 되찾고 싶은 마음을 나타냅니다." },
    { id: "driving", category: "move_search", label: "운전함", theme: "전환", meaning: "운전은 삶의 방향을 내가 통제하고 싶은 마음과 연결됩니다." },
    { id: "not_arrive", category: "move_search", label: "도착하지 못함", theme: "불안", meaning: "도착하지 못하는 꿈은 목표에 다가가지 못하는 답답함이나 지연감을 나타냅니다." },
    { id: "flying", category: "move_search", label: "날아감", theme: "전환", meaning: "날아가는 장면은 자유, 해방감, 더 넓은 가능성에 대한 욕구를 보여줍니다." },
    { id: "running", category: "avoid_fear", label: "도망침", theme: "불안", meaning: "도망침은 피하고 싶은 문제나 마주하기 부담스러운 감정을 보여줍니다." },
    { id: "chased", category: "avoid_fear", label: "쫓김", theme: "불안", meaning: "쫓기는 장면은 압박감, 마감, 해결하지 못한 걱정과 연결됩니다." },
    { id: "hiding", category: "avoid_fear", label: "숨음", theme: "불안", meaning: "숨는 행동은 잠시 피하고 싶은 감정이나 보호받고 싶은 마음을 나타냅니다." },
    { id: "falling", category: "avoid_fear", label: "떨어질 뻔함", theme: "불안", meaning: "떨어질 뻔한 장면은 통제감이 흔들리거나 실수에 대한 걱정을 나타냅니다." },
    { id: "late", category: "avoid_fear", label: "늦음/지각", theme: "불안", meaning: "늦는 꿈은 기회를 놓칠까 봐 걱정하거나 시간 압박을 느끼는 상태를 보여줍니다." },
    { id: "meeting", category: "relation_talk", label: "누군가를 만남", theme: "관계", meaning: "만남은 연결되고 싶은 마음, 풀고 싶은 관계, 새로운 접점을 보여줍니다." },
    { id: "fight", category: "relation_talk", label: "싸움/말다툼", theme: "관계", meaning: "싸움은 말하지 못한 감정이나 관계 속 긴장이 꿈에서 드러난 모습일 수 있습니다." },
    { id: "farewell", category: "relation_talk", label: "이별함", theme: "상실", meaning: "이별은 끝맺음, 정리, 마음의 거리를 다시 확인하는 과정과 연결됩니다." },
    { id: "no_contact", category: "relation_talk", label: "연락이 안 됨", theme: "관계", meaning: "연락이 안 되는 꿈은 기다리는 답, 끊긴 대화, 확인받고 싶은 마음과 연결됩니다." },
    { id: "exam", category: "eval_result", label: "시험을 봄", theme: "자기확인", meaning: "시험은 평가받는 부담, 준비 상태에 대한 걱정을 상징합니다." },
    { id: "presentation", category: "eval_result", label: "발표함", theme: "자기확인", meaning: "발표는 보여지는 나, 인정받고 싶은 마음, 시선에 대한 긴장과 연결됩니다." },
    { id: "crowd_stand", category: "eval_result", label: "많은 사람 앞에 섬", theme: "자기확인", meaning: "많은 사람 앞에 서는 장면은 시선과 평가를 강하게 의식하는 마음을 보여줍니다." },
    { id: "lose_item", category: "loss_change", label: "잃어버림", theme: "상실", meaning: "무언가를 잃어버리는 꿈은 안정감, 관계, 자원에 대한 불안을 보여줄 수 있습니다." },
    { id: "broken", category: "loss_change", label: "무언가가 망가짐", theme: "상실", meaning: "망가지는 장면은 관계, 계획, 자신감의 균열을 상징할 수 있습니다." },
    { id: "funeral", category: "loss_change", label: "죽음/장례", theme: "상실", meaning: "죽음과 장례는 실제 예고라기보다 끝맺음과 변화의 상징으로 보는 편이 안전합니다." },
    { id: "open_door", category: "loss_change", label: "문을 열음", theme: "전환", meaning: "문을 여는 행동은 새로운 선택, 가능성, 다음 단계로 들어가려는 마음을 보여줍니다." },
    { id: "eating", category: "recover_daily", label: "먹음", theme: "충전", meaning: "먹는 장면은 에너지, 돌봄, 만족감 또는 결핍감을 보여줍니다." },
    { id: "crying", category: "recover_daily", label: "울음", theme: "회복", meaning: "우는 장면은 눌러둔 감정이 풀리려는 회복의 신호일 수 있습니다." },
    { id: "laughing", category: "recover_daily", label: "웃음", theme: "회복", meaning: "웃음은 긴장이 풀리거나 마음이 가벼워지고 싶은 욕구와 연결됩니다." },
    { id: "cleaning", category: "recover_daily", label: "청소함", theme: "정리", meaning: "청소는 정리하고 싶은 마음, 새롭게 시작하기 전 비워내는 과정을 보여줍니다." },
    { id: "gift_receive", category: "recover_daily", label: "선물을 받음", theme: "풍요", meaning: "선물을 받는 꿈은 인정, 기대, 뜻밖의 기회와 연결될 수 있습니다." },
    { id: "wedding", category: "recover_daily", label: "결혼", theme: "관계", meaning: "결혼은 약속, 책임, 관계의 결속을 상징합니다." },
    { id: "birth", category: "recover_daily", label: "임신/출산", theme: "성장", meaning: "임신과 출산은 새롭게 자라나는 가능성이나 계획을 보여줍니다." },
  ],
  lifeTopicCategory: [
    { id: "relation_life", label: "관계" },
    { id: "achievement_life", label: "일/성취" },
    { id: "stability_life", label: "생활/안정" },
    { id: "inner_life", label: "마음/자기이해" },
    { id: "future_life", label: "변화/미래" },
    { id: "recovery_life", label: "회복/정리" },
  ],
  lifeTopic: [
    { id: "relationship", category: "relation_life", label: "관계 고민", theme: "관계", meaning: "관계 고민이 함께 있다면 꿈은 거리감, 말하지 못한 감정, 연결 욕구를 더 강하게 비출 수 있습니다." },
    { id: "family_issue", category: "relation_life", label: "가족 문제", theme: "관계", meaning: "가족 문제는 오래된 감정과 책임감을 꿈속 관계 장면으로 드러낼 수 있습니다." },
    { id: "love_breakup", category: "relation_life", label: "연애/이별", theme: "상실", meaning: "연애와 이별은 친밀감, 그리움, 정리되지 않은 마음을 더 선명하게 만듭니다." },
    { id: "loneliness", category: "relation_life", label: "외로움", theme: "관계", meaning: "외로움은 누군가를 찾거나 연락을 기다리는 꿈으로 나타날 수 있습니다." },
    { id: "work_study", category: "achievement_life", label: "일/공부 스트레스", theme: "책임", meaning: "일이나 공부 스트레스는 평가, 성과, 준비 상태에 대한 부담을 키울 수 있습니다." },
    { id: "recognition", category: "achievement_life", label: "인정받고 싶음", theme: "자기확인", meaning: "인정받고 싶은 마음은 발표, 무대, 시험, 많은 사람의 시선으로 표현될 수 있습니다." },
    { id: "responsibility", category: "achievement_life", label: "책임감", theme: "책임", meaning: "책임감은 가방, 회사, 지각, 도착하지 못함 같은 부담의 장면과 연결됩니다." },
    { id: "money_worry", category: "stability_life", label: "돈/생활 걱정", theme: "풍요", meaning: "돈과 생활 걱정은 안정감과 자원에 대한 감각을 꿈속 상징으로 끌어올릴 수 있습니다." },
    { id: "health", category: "stability_life", label: "건강 걱정", theme: "회복", meaning: "건강 걱정은 몸과 마음이 쉬어야 한다는 신호로 나타날 수 있습니다." },
    { id: "self_worth", category: "inner_life", label: "자존감", theme: "자기확인", meaning: "자존감 이슈는 거울, 시험, 사람들의 시선처럼 나를 확인하는 장면과 연결됩니다." },
    { id: "anxiety_topic", category: "inner_life", label: "불안", theme: "불안", meaning: "불안이라는 현실 주제는 꿈속 압박과 회피 장면을 더 선명하게 만듭니다." },
    { id: "stuck_topic", category: "inner_life", label: "답답함", theme: "정리", meaning: "답답함은 막힌 흐름, 말하지 못한 감정, 정리되지 않은 선택과 연결됩니다." },
    { id: "future_choice", category: "future_life", label: "미래 선택", theme: "전환", meaning: "미래 선택은 길, 문, 이동 장면과 함께 방향 전환의 메시지를 강하게 만듭니다." },
    { id: "career", category: "future_life", label: "이직/진로", theme: "전환", meaning: "이직이나 진로 고민은 새로운 단계로 가고 싶은 마음과 두려움을 함께 보여줍니다." },
    { id: "new_start", category: "future_life", label: "새로운 시작", theme: "성장", meaning: "새로운 시작은 문, 아이, 빛, 이동 장면과 함께 가능성의 신호가 됩니다." },
    { id: "need_rest", category: "recovery_life", label: "쉬고 싶음", theme: "회복", meaning: "쉬고 싶은 마음은 물, 잠, 병원, 청소처럼 회복과 정리의 상징을 강화합니다." },
    { id: "cleanup", category: "recovery_life", label: "정리하고 싶은 일", theme: "정리", meaning: "정리하고 싶은 일이 있다면 꿈은 끝맺음, 청소, 이별, 문을 닫는 장면으로 나타날 수 있습니다." },
  ],
};

const moodMeanings = {
  평온함: "평온함은 지금의 마음이 비교적 안정적으로 상황을 바라보고 있음을 보여줍니다.",
  불안함: "불안함은 아직 정리되지 않은 걱정이나 선택의 부담이 남아 있다는 신호일 수 있습니다.",
  기쁨: "기쁨은 회복력, 기대감, 최근의 작은 성취를 더 인정해도 좋다는 신호입니다.",
  그리움: "그리움은 잃어버린 것만이 아니라 아직 소중히 여기는 대상을 알려줍니다.",
  혼란스러움: "혼란스러움은 여러 욕구가 동시에 말하고 있어 분류와 정리가 필요하다는 뜻일 수 있습니다.",
  무서움: "무서움은 마음이 위험이나 부담을 크게 감지하고 있다는 신호일 수 있습니다.",
  답답함: "답답함은 표현하지 못한 말이나 흐름이 막힌 상황과 연결될 수 있습니다.",
  설렘: "설렘은 새로운 가능성이나 기대감이 살아 있다는 신호입니다.",
};

const comboRules = [
  {
    ids: ["school", "exam"],
    mood: ["불안함", "혼란스러움", "무서움"],
    title: "평가받는 부담이 드러난 꿈",
    theme: "자기확인",
    summary: "학교와 시험의 단서는 준비 상태를 확인받고 싶은 마음, 혹은 실수할까 봐 긴장하는 마음을 보여줍니다.",
    question: "요즘 내가 가장 평가받는다고 느끼는 일은 무엇인가요?",
    action: "완벽하게 준비하려 하기보다, 오늘 확인할 수 있는 작은 기준 하나만 정해보세요.",
  },
  {
    ids: ["wallet", "lose_item"],
    title: "안정감이 흔들리는 꿈",
    theme: "풍요",
    summary: "지갑을 잃어버리는 조합은 돈 자체보다 안정감, 자원, 내가 가진 가치가 흔들리는 느낌과 연결됩니다.",
    question: "요즘 나를 불안하게 만드는 현실적인 걱정은 무엇인가요?",
    action: "걱정되는 지출이나 해야 할 일을 한 줄로 적어 실제 크기를 확인해보세요.",
  },
  {
    ids: ["money", "lose_item"],
    title: "자원에 대한 걱정이 드러난 꿈",
    theme: "풍요",
    summary: "돈을 잃어버리는 단서는 인정, 안정, 생활 자원에 대한 불안이 꿈속에서 상징적으로 나타난 모습일 수 있습니다.",
    question: "요즘 부족하다고 느끼는 자원은 시간, 돈, 애정 중 무엇인가요?",
    action: "오늘 당장 조절할 수 있는 작은 자원 하나를 정리해보세요.",
  },
  {
    ids: ["station", "waiting"],
    title: "출발을 기다리는 꿈",
    theme: "전환",
    summary: "역과 기다림의 조합은 아직 움직일 때를 기다리거나, 선택을 앞두고 마음이 멈춰 있는 상태를 보여줍니다.",
    question: "나는 무엇이 준비되면 움직일 수 있다고 느끼나요?",
    action: "기다림을 줄이기 위해 오늘 확인할 수 있는 정보 하나를 찾아보세요.",
  },
  {
    ids: ["door", "light"],
    title: "새로운 가능성이 열리는 꿈",
    theme: "전환",
    summary: "문과 빛은 막힌 상황 속에서도 다음 단계로 들어갈 실마리가 보인다는 긍정적인 조합입니다.",
    question: "지금 내 앞에서 조금씩 열리고 있는 가능성은 무엇인가요?",
    action: "작지만 기대되는 선택 하나를 오늘 일정에 넣어보세요.",
  },
  {
    ids: ["family", "그리움"],
    title: "가까운 관계가 마음에 남은 꿈",
    theme: "관계",
    summary: "가족과 그리움의 조합은 오래된 애정, 책임감, 아직 말하지 못한 마음을 돌아보게 합니다.",
    question: "가족에게 말하지 못하고 남겨둔 감정이 있나요?",
    action: "바로 연락하지 않아도 좋으니 전하고 싶은 말을 짧게 적어보세요.",
  },
  {
    ids: ["high_place", "falling"],
    title: "통제감이 흔들리는 꿈",
    theme: "불안",
    summary: "높은 곳과 떨어질 뻔한 장면은 실수할까 봐 긴장하거나, 상황을 온전히 통제하기 어렵다는 감각을 보여줍니다.",
    question: "요즘 내가 놓칠까 봐 가장 걱정하는 것은 무엇인가요?",
    action: "불안을 줄이기 위해 확인 가능한 체크리스트 하나를 만들어보세요.",
  },
  {
    ids: ["water_place", "rain"],
    title: "마음이 정리될 시간을 요청하는 꿈",
    theme: "회복",
    summary: "물가와 비는 감정이 흘러가고 정리되기를 바라는 회복의 단서로 읽을 수 있습니다.",
    question: "최근 충분히 쉬지 못한 감정은 무엇인가요?",
    action: "잠들기 전 오늘의 감정을 세 단어로 적어보세요.",
  },
  {
    ids: ["work", "presentation"],
    title: "보여지는 나를 의식하는 꿈",
    theme: "책임",
    summary: "회사와 발표의 조합은 성과, 시선, 인정받고 싶은 마음이 강하게 작동하고 있음을 보여줍니다.",
    question: "요즘 일에서 가장 인정받고 싶은 부분은 무엇인가요?",
    action: "오늘 한 일 중 결과가 작더라도 의미 있었던 부분을 기록해보세요.",
  },
  {
    ids: ["child", "설렘"],
    title: "새로운 가능성이 자라나는 꿈",
    theme: "성장",
    summary: "어린아이와 설렘의 조합은 아직 작지만 키워보고 싶은 계획이나 관계가 마음 안에 있다는 뜻일 수 있습니다.",
    question: "아직 작지만 계속 키워보고 싶은 일은 무엇인가요?",
    action: "그 가능성을 오늘 10분만 돌볼 방법을 정해보세요.",
  },
  {
    ids: ["dark_place", "hiding"],
    title: "마주하기 어려운 감정을 피하는 꿈",
    theme: "불안",
    summary: "어두운 공간과 숨는 행동은 아직 말로 꺼내기 어려운 걱정이나 보호받고 싶은 마음을 보여줍니다.",
    question: "지금 내가 잠시 피하고 싶은 감정은 무엇인가요?",
    action: "그 감정을 해결하려 하지 말고 이름만 붙여 적어보세요.",
  },
  {
    ids: ["phone", "no_contact"],
    title: "기다리는 답이 남아 있는 꿈",
    theme: "관계",
    summary: "휴대폰과 연락이 안 되는 장면은 누군가의 답, 확인, 이어지고 싶은 대화에 대한 마음을 보여줍니다.",
    question: "나는 지금 누구에게 어떤 답을 기다리고 있나요?",
    action: "기다리는 말과 내가 먼저 할 수 있는 말을 구분해 적어보세요.",
  },
];

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
    keywords: ["동물", "새", "고양이", "강아지", "반려견", "말", "뱀"],
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
  무서움: "무서움은 마음이 위험이나 부담을 크게 감지하고 있다는 신호일 수 있어요. 꿈의 장면보다 무엇을 피하고 싶었는지 살펴보세요.",
  답답함: "답답함은 표현하지 못한 말, 막힌 일정, 선택의 지연처럼 흐름이 막힌 감각과 연결될 수 있습니다.",
  설렘: "설렘은 새로운 가능성이나 기대감이 살아 있다는 신호입니다. 아직 작더라도 마음이 향하는 방향을 살펴보세요.",
};

const toneLabels = {
  balanced: "기본형",
  short: "짧게",
  detail: "자세히",
  comfort: "위로형",
  practical: "현실 조언형",
};

const engineLabels = {
  keyword: "키워드 해석",
  ai: "AI 해석",
};

function buildSummary({ clippedDream, selectedTheme, selectedSymbols, mood, tone }) {
  const firstMeaning = selectedSymbols[0].meaning;
  const clueSummary = clippedDream.replace(/\s+/g, ", ");

  if (tone === "short") {
    return `선택한 단서는 ${selectedTheme.name}과 관련이 깊어 보여요. 핵심은 ${selectedSymbols[0].symbol}입니다.`;
  }

  if (tone === "detail") {
    return `선택한 단서 ${clueSummary}는 ${selectedTheme.name}의 흐름을 품고 있어요. ${firstMeaning} 특히 ${mood}이라는 감정이 함께 남았다면, 꿈의 장면보다 그 감정이 현실에서 어디와 연결되는지 보는 것이 좋습니다.`;
  }

  if (tone === "comfort") {
    return `선택한 단서는 ${selectedTheme.name}의 흐름을 품고 있어요. ${firstMeaning} 불편한 장면이 있었더라도 마음이 스스로를 이해하려고 보내는 신호로 받아들여도 괜찮습니다.`;
  }

  if (tone === "practical") {
    return `선택한 단서는 ${selectedTheme.name}의 흐름을 보여줍니다. ${firstMeaning} 지금은 의미를 오래 붙잡기보다 현실에서 바로 조정할 수 있는 작은 행동을 정하는 편이 도움이 됩니다.`;
  }

  return `선택한 단서는 ${selectedTheme.name}의 흐름을 품고 있어요. ${firstMeaning}`;
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

function isSavedResult(result) {
  const id = getResultId(result);
  return Boolean(id) && getSavedDreams().some((item) => getResultId(item) === id);
}

function updateSaveButton(result = currentResult) {
  if (!result) {
    saveDreamButton.disabled = true;
    saveDreamButton.textContent = "꿈 일기장에 저장";
    return;
  }

  const saved = isSavedResult(result);
  saveDreamButton.disabled = saved;
  saveDreamButton.textContent = saved ? "저장됨" : "꿈 일기장에 저장";
}

function getAllOptions() {
  return [
    ...optionGroups.place,
    ...optionGroups.targetDetail,
    ...optionGroups.action,
    ...optionGroups.lifeTopic,
  ];
}

function getOptionById(id) {
  return getAllOptions().find((option) => option.id === id);
}

function createChip(option, name, type) {
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.name = name;
  input.value = option.id;
  input.dataset.type = type;
  label.append(input, option.label);
  return label;
}

function renderOptionList(container, options, name, type) {
  container.innerHTML = "";
  options.forEach((option) => {
    container.append(createChip(option, name, type));
  });
}

function renderTargetDetails() {
  const selectedCategories = getCheckedValues("targetCategory");
  const detailOptions = optionGroups.targetDetail.filter((option) => selectedCategories.includes(option.category));
  const selectedDetails = new Set(getCheckedValues("targetDetail"));
  renderOptionList(targetDetailOptions, detailOptions, "targetDetail", "targetDetail");

  targetDetailOptions.querySelectorAll("input").forEach((input) => {
    input.checked = selectedDetails.has(input.value);
    input.addEventListener("change", () => enforceLimit("targetDetail"));
  });

  enforceLimit("targetDetail");
}

function renderNestedDetails(categoryName, detailName, detailContainer, detailOptions) {
  const selectedCategories = getCheckedValues(categoryName);
  const visibleOptions = detailOptions.filter((option) => selectedCategories.includes(option.category));
  const selectedDetails = new Set(getCheckedValues(detailName));
  renderOptionList(detailContainer, visibleOptions, detailName, detailName);

  detailContainer.querySelectorAll("input").forEach((input) => {
    input.checked = selectedDetails.has(input.value);
    input.addEventListener("change", () => enforceLimit(detailName));
  });

  enforceLimit(detailName);
}

function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}

function getStepPanels() {
  return [...document.querySelectorAll(".step-panel")];
}

function renderStep() {
  const panels = getStepPanels();
  const maxStep = panels.length - 1;

  currentStep = Math.min(Math.max(currentStep, 0), maxStep);

  panels.forEach((panel, index) => {
    panel.classList.toggle("active", index === currentStep);
  });

  stepTitle.innerHTML = `${stepLabels[currentStep]} <small>${currentStep + 1}/${panels.length}</small>`;
  stepMeterFill.style.width = `${((currentStep + 1) / panels.length) * 100}%`;

  prevStepButton.disabled = currentStep === 0;
  nextStepButton.classList.toggle("hidden", currentStep === maxStep);
  submitButton.classList.toggle("hidden", currentStep !== maxStep);
}

function setLimitText(type, message, isWarning = false) {
  const target = document.querySelector(`#${type}Count`);

  if (!target) {
    return;
  }

  target.textContent = message;
  target.classList.toggle("warning", isWarning);
}

function enforceLimit(type) {
  const limit = optionLimits[type];
  const inputs = [...document.querySelectorAll(`input[name="${type}"]`)];
  const checked = inputs.filter((input) => input.checked);
  const isAtLimit = checked.length >= limit;

  inputs.forEach((input) => {
    input.disabled = !input.checked && isAtLimit;
  });

  const labels = {
    placeCategory: "장소 큰 분류",
    place: "장소",
    targetCategory: "큰 분류",
    targetDetail: "세부 대상",
    actionCategory: "행동 큰 분류",
    action: "행동/사건",
    lifeTopicCategory: "현실 주제 큰 분류",
    lifeTopic: "현실 주제",
  };

  setLimitText(type, `${labels[type]} ${checked.length}/${limit}`, isAtLimit);
  updateCount();
}

function renderChoiceUi() {
  renderOptionList(placeCategoryOptions, optionGroups.placeCategory, "placeCategory", "placeCategory");
  renderOptionList(targetCategoryOptions, optionGroups.targetCategory, "targetCategory", "targetCategory");
  renderOptionList(actionCategoryOptions, optionGroups.actionCategory, "actionCategory", "actionCategory");
  renderOptionList(lifeTopicCategoryOptions, optionGroups.lifeTopicCategory, "lifeTopicCategory", "lifeTopicCategory");
  renderNestedDetails("placeCategory", "place", placeOptions, optionGroups.place);
  renderTargetDetails();
  renderNestedDetails("actionCategory", "action", actionOptions, optionGroups.action);
  renderNestedDetails("lifeTopicCategory", "lifeTopic", lifeTopicOptions, optionGroups.lifeTopic);

  ["placeCategory", "targetCategory", "actionCategory", "lifeTopicCategory"].forEach((type) => {
    document.querySelectorAll(`input[name="${type}"]`).forEach((input) => {
      input.addEventListener("change", () => {
        enforceLimit(type);

        if (type === "targetCategory") {
          renderTargetDetails();
        }

        if (type === "placeCategory") {
          renderNestedDetails("placeCategory", "place", placeOptions, optionGroups.place);
        }

        if (type === "actionCategory") {
          renderNestedDetails("actionCategory", "action", actionOptions, optionGroups.action);
        }

        if (type === "lifeTopicCategory") {
          renderNestedDetails("lifeTopicCategory", "lifeTopic", lifeTopicOptions, optionGroups.lifeTopic);
        }
      });
    });
    enforceLimit(type);
  });
}

function getSelectedOptions() {
  const ids = [
    ...getCheckedValues("place"),
    ...getCheckedValues("targetDetail"),
    ...getCheckedValues("action"),
    ...getCheckedValues("lifeTopic"),
  ];

  return ids.map(getOptionById).filter(Boolean);
}

function getSelectedLabelsByGroup(groupName) {
  return getSelectedByGroup(getSelectedOptions(), groupName).map((option) => option.label);
}

function renderSelectionReview() {
  const rows = [
    ["장소", getSelectedLabelsByGroup("place")],
    ["감정", [new FormData(dreamForm).get("mood")].filter(Boolean)],
    ["대상", getSelectedLabelsByGroup("targetDetail")],
    ["사건", getSelectedLabelsByGroup("action")],
    ["현실", getSelectedLabelsByGroup("lifeTopic")],
  ];

  selectionReview.innerHTML = "";
  rows.forEach(([label, values]) => {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    p.append(strong, values.length ? values.join(", ") : "선택 안 함");
    selectionReview.append(p);
  });
}

function getSelectedCategoryLabels() {
  const categories = getCheckedValues("targetCategory");
  return optionGroups.targetCategory
    .filter((category) => categories.includes(category.id))
    .map((category) => category.label);
}

function findComboRule(selectedOptions, mood) {
  const ids = new Set([...selectedOptions.map((option) => option.id), mood]);

  return comboRules.find((rule) => {
    const moodMatches = !rule.mood || rule.mood.includes(mood);
    return moodMatches && rule.ids.every((id) => ids.has(id));
  });
}

function getTopTheme(selectedOptions) {
  const counts = selectedOptions.reduce((acc, option) => {
    acc[option.theme] = (acc[option.theme] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "전환";
}

function getThemeQuestion(theme) {
  const questions = {
    관계: "이 꿈이 떠올리게 한 사람이나 관계는 무엇인가요?",
    불안: "요즘 마음 한쪽에서 계속 신경 쓰이는 일은 무엇인가요?",
    전환: "지금 내가 앞두고 있는 선택이나 변화는 무엇인가요?",
    회복: "최근 충분히 돌보지 못한 감정이나 몸의 신호는 무엇인가요?",
    자기확인: "요즘 내가 가장 인정받고 싶은 부분은 무엇인가요?",
    풍요: "지금 나에게 가장 부족하다고 느껴지는 자원은 무엇인가요?",
    상실: "내려놓아야 하지만 아직 붙잡고 있는 것은 무엇인가요?",
    성장: "아직 작지만 계속 키워보고 싶은 가능성은 무엇인가요?",
    책임: "지금 내가 혼자 너무 많이 짊어진 역할은 무엇인가요?",
    정리: "정리하고 나면 마음이 가벼워질 일은 무엇인가요?",
  };

  return questions[theme] || "이 꿈이 지금의 나에게 묻는 것은 무엇인가요?";
}

function getThemeAction(theme) {
  const actions = {
    관계: "바로 말하지 않아도 좋으니, 전하고 싶은 문장을 한 줄 적어보세요.",
    불안: "걱정을 해결 가능한 것과 지금은 기다릴 일로 나눠 적어보세요.",
    전환: "오늘 할 수 있는 가장 작은 첫 단계를 하나 정해보세요.",
    회복: "잠들기 전 오늘의 감정을 세 단어로 적어보세요.",
    자기확인: "오늘 잘한 일 하나를 구체적으로 기록해두세요.",
    풍요: "내가 가진 자원과 부족하다고 느끼는 자원을 각각 하나씩 적어보세요.",
    상실: "끝난 일과 아직 남은 일을 두 칸으로 나눠 정리해보세요.",
    성장: "키워보고 싶은 가능성을 오늘 10분만 돌볼 방법을 정해보세요.",
    책임: "오늘 꼭 내가 하지 않아도 되는 일을 하나 덜어내보세요.",
    정리: "작은 공간이나 메모 하나를 정리하며 마음을 가볍게 만들어보세요.",
  };

  return actions[theme] || "오늘 떠오르는 감정을 짧게 기록해보세요.";
}

function getStableIndex(seed, length) {
  if (!length) {
    return 0;
  }

  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 100000;
  }

  return hash % length;
}

function pickVariant(seed, variants) {
  return variants[getStableIndex(seed, variants.length)];
}

function buildDailyFortune(theme, mood, action, seed) {
  const fortunes = {
    관계: [
      "오늘은 사람 사이의 말투와 거리감이 운을 좌우하기 쉬운 날입니다.",
      "오늘은 먼저 다가가기보다 상대의 반응을 차분히 살피면 관계운이 부드러워집니다.",
      "오늘은 작은 배려나 짧은 안부가 생각보다 좋은 흐름을 만들 수 있습니다.",
    ],
    불안: [
      "오늘은 서두르기보다 확인하고 정리할수록 흐름이 안정되는 날입니다.",
      "오늘은 걱정이 커지기 전에 할 수 있는 일과 기다릴 일을 나누면 운이 가벼워집니다.",
      "오늘은 큰 결정보다 작은 확인 하나가 마음의 균형을 잡아줍니다.",
    ],
    전환: [
      "오늘은 작은 선택 하나가 다음 방향을 열어주는 날입니다.",
      "오늘은 평소 미뤄둔 결정을 아주 작게 움직여보기 좋은 날입니다.",
      "오늘은 새로운 흐름이 갑자기 오기보다 작은 준비에서 시작됩니다.",
    ],
    회복: [
      "오늘은 무리해서 밀어붙이기보다 컨디션을 회복할수록 운이 살아나는 날입니다.",
      "오늘은 쉬는 시간을 아깝게 여기지 않을수록 마음의 흐름이 좋아집니다.",
      "오늘은 몸과 마음의 신호를 빨리 알아차리는 것이 가장 좋은 선택입니다.",
    ],
    자기확인: [
      "오늘은 결과보다 내가 해낸 과정을 인정할 때 기운이 좋아지는 날입니다.",
      "오늘은 남의 평가보다 내 기준을 한 번 더 확인하면 중심이 잡힙니다.",
      "오늘은 스스로를 인정하는 태도가 자신감의 흐름을 이어줍니다.",
    ],
    풍요: [
      "오늘은 돈이나 자원 문제를 크게 키우기보다 작은 균형을 맞추면 좋은 날입니다.",
      "오늘은 가진 것과 필요한 것을 구분하면 현실운이 차분히 정리됩니다.",
      "오늘은 충동적인 선택보다 작게 아끼고 작게 채우는 흐름이 좋습니다.",
    ],
    상실: [
      "오늘은 붙잡고 있던 생각을 조금 내려놓을수록 마음의 운이 가벼워지는 날입니다.",
      "오늘은 끝난 일과 남은 일을 구분하면 감정의 흐름이 정리됩니다.",
      "오늘은 과거를 억지로 밀어내기보다 조용히 정리하는 쪽이 좋습니다.",
    ],
    성장: [
      "오늘은 아직 작은 가능성을 꾸준히 돌보면 좋은 기운이 붙는 날입니다.",
      "오늘은 크게 시작하지 않아도 작은 시도가 다음 기회를 부릅니다.",
      "오늘은 배우거나 익히는 일에 시간을 조금 쓰면 운이 살아납니다.",
    ],
    책임: [
      "오늘은 모든 일을 혼자 떠안기보다 역할을 나누면 흐름이 좋아지는 날입니다.",
      "오늘은 해야 할 일을 줄 세우면 부담보다 해결감이 커집니다.",
      "오늘은 책임을 다하되 내 몫이 아닌 것까지 안지 않는 게 좋습니다.",
    ],
    정리: [
      "오늘은 주변이나 생각을 정돈할수록 막힌 기운이 풀리는 날입니다.",
      "오늘은 작은 정리 하나가 마음의 답답함을 줄여주는 날입니다.",
      "오늘은 복잡한 일을 단순하게 나누면 흐름이 훨씬 가벼워집니다.",
    ],
  };
  const moodNotes = {
    평온함: ["차분한 판단이 잘 맞는 편이에요.", "오늘의 안정감은 꽤 좋은 기준이 됩니다."],
    불안함: ["불안이 올라와도 급하게 결론내리지 않는 것이 좋아요.", "확인한 만큼 마음이 가벼워질 수 있습니다."],
    기쁨: ["좋은 기분을 작게라도 표현하면 운이 더 부드럽게 이어집니다.", "기쁜 흐름을 혼자 넘기지 말고 작게 나눠보세요."],
    그리움: ["과거의 감정보다 지금 할 수 있는 연결에 초점을 맞춰보세요.", "그리운 마음은 무리하지 않는 방식으로 다루면 좋습니다."],
    혼란스러움: ["선택지를 줄일수록 오늘의 흐름이 또렷해집니다.", "복잡한 생각은 한 가지 기준으로 정리해보세요."],
    무서움: ["크게 움직이기보다 안전한 선택부터 확인하는 게 좋습니다.", "겁나는 마음을 무시하지 말고 천천히 살피는 편이 좋습니다."],
    답답함: ["막힌 일을 억지로 밀기보다 한 가지부터 풀어보세요.", "작은 출구 하나만 찾아도 답답함이 줄어듭니다."],
    설렘: ["새로운 기대를 현실적인 작은 행동으로 옮기기 좋은 날입니다.", "설레는 마음은 작게 실행할 때 더 좋은 운으로 이어집니다."],
  };
  const fortune = pickVariant(`${seed}:fortune:${theme}`, fortunes[theme] || ["오늘은 꿈이 남긴 단서를 따라 마음의 방향을 살피기 좋은 날입니다."]);
  const moodNote = pickVariant(`${seed}:mood:${mood}`, moodNotes[mood] || [""]);

  return `${fortune} ${moodNote} ${action}`;
}

function buildFortuneSummary(theme, mood, seed) {
  const summaries = {
    관계: ["말투와 거리감이 중요한 날", "작은 안부가 흐름을 바꾸는 날", "관계의 온도를 천천히 맞추는 날"],
    불안: ["서두르기보다 확인이 중요한 날", "걱정을 작게 나눌수록 편해지는 날", "큰 결정 전 점검이 필요한 날"],
    전환: ["작은 선택이 방향을 여는 날", "미뤄둔 첫 단계를 시작하기 좋은 날", "새 흐름을 준비하기 좋은 날"],
    회복: ["무리보다 회복이 우선인 날", "쉬어갈수록 마음이 정리되는 날", "컨디션을 챙기면 운이 살아나는 날"],
    자기확인: ["내 기준을 믿어도 좋은 날", "작은 성취를 인정하면 좋은 날", "평가보다 과정이 중요한 날"],
    풍요: ["작은 균형이 현실운을 돕는 날", "가진 것과 필요한 것을 구분할 날", "충동보다 차분한 선택이 좋은 날"],
    상실: ["내려놓을수록 가벼워지는 날", "끝난 일과 남은 일을 나눠볼 날", "조용한 정리가 필요한 날"],
    성장: ["작은 가능성을 키우기 좋은 날", "배움과 시도가 운을 여는 날", "천천히 자라는 흐름이 좋은 날"],
    책임: ["혼자 안기보다 나누면 좋은 날", "일의 순서를 세우면 편해지는 날", "내 몫을 분명히 하면 좋은 날"],
    정리: ["정리할수록 막힌 흐름이 풀리는 날", "복잡한 일을 단순하게 나눌 날", "작은 정돈이 마음을 가볍게 하는 날"],
  };
  const moodPrefix = {
    평온함: "차분하게",
    불안함: "확인하며",
    기쁨: "가볍게",
    그리움: "무리하지 않고",
    혼란스러움: "단순하게",
    무서움: "안전하게",
    답답함: "하나씩",
    설렘: "작게 시작하며",
  };
  const summary = pickVariant(`${seed}:fortune-line:${theme}`, summaries[theme] || ["마음의 방향을 살피기 좋은 날"]);

  return `${moodPrefix[mood] || "천천히"} ${summary}`;
}

function getSelectedByGroup(selectedOptions, groupName) {
  return selectedOptions.filter((option) => optionGroups[groupName].includes(option));
}

function labelsOf(options) {
  return options.map((option) => option.label).join(", ");
}

function hasFinalConsonant(text) {
  const charCode = text.trim().charCodeAt(text.trim().length - 1);

  if (charCode < 0xac00 || charCode > 0xd7a3) {
    return false;
  }

  return (charCode - 0xac00) % 28 !== 0;
}

function withSubjectParticle(text) {
  return `${text}${hasFinalConsonant(text) ? "이" : "가"}`;
}

function buildVariedSummary({ rule, coreScene, theme, mood, seed }) {
  if (rule?.summary) {
    const connectors = [
      `${rule.summary} 특히 ${mood}이 남았다면, 오늘은 그 장면이 건드린 현실의 감각을 천천히 살펴보는 것이 좋습니다.`,
      `${rule.summary} 이 조합은 단순한 예고라기보다, 지금 마음이 중요하게 붙잡고 있는 신호에 가깝습니다.`,
      `${rule.summary} 꿈이 보여준 장면을 현실의 부담이나 기대와 나란히 놓고 보면 더 자연스럽게 읽힙니다.`,
    ];

    return pickVariant(`${seed}:rule-summary`, connectors);
  }

  const scene = coreScene || "선택한 장면";
  const summaries = [
    `${scene}이 함께 묶이면서 이 꿈은 ${theme}의 흐름을 보여줍니다. 특히 ${mood}이 남았다면, 사건 자체보다 그 장면이 남긴 감정과 현실의 반복되는 부담을 살펴보는 것이 좋습니다.`,
    `${scene}은 서로 따로 떨어진 단서라기보다 하나의 마음 흐름으로 이어집니다. 이 꿈은 ${theme}이라는 주제를 통해 지금 내가 무엇을 의식하고 있는지 보여줍니다.`,
    `${scene}이 인상적으로 남았다면, 이 꿈은 ${theme}와 관련된 마음의 방향을 정리하려는 신호로 볼 수 있습니다. 오늘은 꿈의 분위기보다 그 뒤에 남은 감정을 기준으로 읽어보세요.`,
    `${scene}이 동시에 나타난 것은 마음이 ${theme}에 관한 문제를 여러 이미지로 풀어내고 있다는 뜻에 가깝습니다. 꿈을 예언처럼 보기보다 지금의 상태를 비춰주는 거울처럼 보면 좋습니다.`,
  ];

  return pickVariant(`${seed}:summary:${theme}:${mood}`, summaries);
}

function buildKeywordResult({ selectedOptions, mood, tone, memo }) {
  const safeTone = toneLabels[tone] ? tone : "balanced";
  const rule = findComboRule(selectedOptions, mood);
  const theme = rule?.theme || getTopTheme(selectedOptions);
  const places = getSelectedByGroup(selectedOptions, "place");
  const targets = getSelectedByGroup(selectedOptions, "targetDetail");
  const actions = getSelectedByGroup(selectedOptions, "action");
  const lifeTopics = getSelectedByGroup(selectedOptions, "lifeTopic");
  const nonLifeOptions = selectedOptions.filter((option) => !optionGroups.lifeTopic.includes(option));
  const coreScene = [
    places.length ? `${labelsOf(places)}이라는 장소` : "",
    targets.length ? `${withSubjectParticle(labelsOf(targets))} 등장한 점` : "",
    actions.length ? `${labelsOf(actions)} 상황` : "",
  ].filter(Boolean).join(", ");
  const title = rule?.title || `${theme}의 단서를 보여주는 꿈`;
  const reality = lifeTopics.length
    ? `${labelsOf(lifeTopics)} 주제가 함께 선택되어 있어요. 이 꿈은 현실의 상황을 바로 예언한다기보다, 지금 신경 쓰고 있는 문제를 마음이 어떤 이미지로 정리하고 있는지 보여주는 쪽에 가깝습니다. ${lifeTopics.map((option) => option.meaning).join(" ")}`
    : "";
  const selectedLabels = selectedOptions.map((option) => option.label).join(", ");
  const importantOptions = nonLifeOptions.length ? nonLifeOptions : selectedOptions;
  const seed = `${selectedOptions.map((option) => option.id).join("|")}:${mood}:${memo.length}`;
  const summary = buildVariedSummary({ rule, coreScene, theme, mood, seed });
  const fortuneSummary = buildFortuneSummary(theme, mood, seed);

  return {
    createdAt: new Date().toISOString(),
    dream: selectedLabels,
    memo,
    selectedLabels,
    targetCategories: getSelectedCategoryLabels(),
    mood,
    tone: safeTone,
    toneLabel: toneLabels[safeTone],
    engine: "keyword",
    engineLabel: engineLabels.keyword,
    theme,
    title,
    summary,
    fortuneSummary,
    reality,
    symbols: importantOptions.slice(0, 4).map((option) => ({
      label: option.label,
      meaning: option.meaning,
    })),
    emotion: `${moodMeanings[mood] || moodInterpretations[mood]} ${coreScene || selectedLabels || "꿈의 장면"}이 이 감정을 더 선명하게 만들어줍니다.`,
    question: rule?.question || getThemeQuestion(theme),
    action: buildDailyFortune(theme, mood, rule?.action || getThemeAction(theme), seed),
  };
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
    engine: "keyword",
    engineLabel: engineLabels.keyword,
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

function normalizeAiResult(interpretation, text, mood, tone) {
  const safeTone = toneLabels[tone] ? tone : "balanced";
  const symbols = Array.isArray(interpretation.symbols) ? interpretation.symbols : [];

  return {
    createdAt: new Date().toISOString(),
    dream: text.replace(/\s+/g, " ").trim(),
    mood,
    tone: safeTone,
    toneLabel: toneLabels[safeTone],
    engine: "ai",
    engineLabel: engineLabels.ai,
    theme: String(interpretation.theme || "AI 해석").slice(0, 20),
    title: String(interpretation.title || "꿈이 전하는 마음의 단서").slice(0, 80),
    summary: String(interpretation.summary || "꿈의 장면과 감정을 바탕으로 해석을 정리했습니다."),
    symbols: symbols.slice(0, 4).map((item) => ({
      label: String(item?.label || "꿈속 단서").slice(0, 40),
      meaning: String(item?.meaning || "이 장면이 남긴 감정을 살펴보세요."),
    })),
    emotion: String(interpretation.emotion || moodInterpretations[mood]),
    question: String(interpretation.question || "이 꿈이 지금의 나에게 묻는 것은 무엇일까요?"),
    action: String(interpretation.action || "오늘 떠오르는 감정을 짧게 기록해보세요."),
  };
}

async function requestAiInterpretation(text, mood, tone) {
  const response = await fetch("/.netlify/functions/interpret-dream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dream: text, mood, tone }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || "AI 해석 요청에 실패했습니다.");
  }

  return normalizeAiResult(payload.interpretation, text, mood, tone);
}

function renderResult(result) {
  currentResult = result;
  emptyState.classList.add("hidden");
  resultCard.classList.remove("hidden");
  copyButton.disabled = false;
  updateSaveButton(result);

  moodTag.textContent = result.mood;
  themeTag.textContent = result.theme;
  engineTag.textContent = result.engineLabel || engineLabels[result.engine] || engineLabels.keyword;
  summaryTitle.textContent = result.title;
  summaryText.textContent = result.summary;
  fortuneSummaryText.textContent = result.fortuneSummary || `${result.mood} 마음을 살피기 좋은 날`;
  emotionText.textContent = result.emotion;
  questionText.textContent = result.question;
  actionText.textContent = result.action;
  selectedSummary.innerHTML = "";
  String(result.selectedLabels || result.dream || "")
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean)
    .forEach((label) => {
      const chip = document.createElement("span");
      chip.textContent = label;
      selectedSummary.append(chip);
    });
  realitySection.classList.toggle("hidden", !result.reality);
  realityText.textContent = result.reality || "";
  memoNote.classList.toggle("hidden", !result.memo);
  memoText.textContent = result.memo || "";

  symbolList.innerHTML = "";
  result.symbols.forEach(({ symbol, label, meaning }) => {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = `${label || symbol}: `;
    li.append(strong, meaning);
    symbolList.append(li);
  });

  copyButton.dataset.copy = [
    `꿈해몽 노트`,
    ``,
    `오늘의 흐름: ${fortuneSummaryText.textContent}`,
    `꿈의 주제: ${result.title}`,
    `남은 감정: ${result.mood}`,
    ``,
    `[종합 해석]`,
    result.summary,
    ``,
    `[지금 던져볼 질문]`,
    result.question,
    ``,
    `[오늘의 작은 행동]`,
    result.action,
    ``,
    `선택한 단서: ${result.selectedLabels || result.dream || ""}`,
  ].join("\n");
}

function scrollToResult() {
  resultCard.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function restoreResultToForm(item) {
  renderResult(item);
  dreamInput.value = item.memo || "";
  restoreSelections(item.selectedOptionIds || []);
  updateCount();
  const moodInput = document.querySelector(`input[name="mood"][value="${item.mood}"]`);
  if (moodInput) {
    moodInput.checked = true;
  }
  currentStep = 5;
  renderStep();
}

function createDreamCard(item, options = {}) {
  const wrapper = document.createElement("article");
  wrapper.className = options.className || "history-item";

  const button = document.createElement("button");
  button.type = "button";
  button.addEventListener("click", () => {
    restoreResultToForm(item);
  });

  const date = document.createElement("span");
  date.className = "history-date";
  date.textContent = new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(item.savedAt || item.createdAt));

  const title = document.createElement("strong");
  title.textContent = item.title;

  const meta = document.createElement("span");
  meta.className = "history-meta";

  const mood = document.createElement("span");
  mood.textContent = item.mood || "감정";

  const flow = document.createElement("span");
  flow.textContent = item.fortuneSummary || item.theme || "오늘의 흐름";

  meta.append(mood, flow);

  const preview = document.createElement("span");
  preview.className = "history-preview";
  preview.textContent = item.memo || item.selectedLabels || item.dream;

  button.append(date, title, meta, preview);
  wrapper.append(button);

  if (options.onDelete) {
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-saved-button";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", () => options.onDelete(item));
    wrapper.append(deleteButton);
  }

  return wrapper;
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
    historyList.append(createDreamCard(item));
  });
}

function renderSavedDreams() {
  if (!savedList) {
    return;
  }

  const saved = getSavedDreams();
  savedList.innerHTML = "";

  if (!saved.length) {
    const empty = document.createElement("p");
    empty.className = "history-empty";
    empty.textContent = "아직 꿈 일기장에 저장된 꿈이 없습니다.";
    savedList.append(empty);
    return;
  }

  saved.forEach((item) => {
    savedList.append(createDreamCard(item, {
      className: "history-item saved-item",
      onDelete: (target) => {
        setSavedDreams(getSavedDreams().filter((dream) => getResultId(dream) !== getResultId(target)));
        renderSavedDreams();
        updateSaveButton();
      },
    }));
  });
}

function updateCount() {
  const selectedCount = getSelectedOptions().length;
  const memoLength = dreamInput.value.trim().length;
  wordCount.textContent = `선택 ${selectedCount}개 · 메모 ${memoLength}자`;
  memoCounter.textContent = `${dreamInput.value.length}/250`;
  renderSelectionReview();
}

function restoreSelections(ids) {
  document.querySelectorAll('input[type="checkbox"][data-type]').forEach((input) => {
    input.checked = false;
  });

  const idSet = new Set(ids);

  [
    ["place", "placeCategory"],
    ["targetDetail", "targetCategory"],
    ["action", "actionCategory"],
    ["lifeTopic", "lifeTopicCategory"],
  ].forEach(([detailGroup, categoryGroup]) => {
    optionGroups[detailGroup].forEach((option) => {
      if (idSet.has(option.id)) {
        const categoryInput = document.querySelector(`input[name="${categoryGroup}"][value="${option.category}"]`);
        if (categoryInput) {
          categoryInput.checked = true;
        }
      }
    });
  });

  renderNestedDetails("placeCategory", "place", placeOptions, optionGroups.place);
  renderTargetDetails();
  renderNestedDetails("actionCategory", "action", actionOptions, optionGroups.action);
  renderNestedDetails("lifeTopicCategory", "lifeTopic", lifeTopicOptions, optionGroups.lifeTopic);

  ids.forEach((id) => {
    const option = getOptionById(id);

    if (!option) {
      return;
    }

    const name = optionGroups.place.includes(option)
      ? "place"
      : optionGroups.action.includes(option)
        ? "action"
        : optionGroups.lifeTopic.includes(option)
          ? "lifeTopic"
          : "targetDetail";
    const input = document.querySelector(`input[name="${name}"][value="${id}"]`);

    if (input) {
      input.checked = true;
    }
  });

  ["placeCategory", "place", "targetCategory", "targetDetail", "actionCategory", "action", "lifeTopicCategory", "lifeTopic"].forEach(enforceLimit);
}

dreamInput.addEventListener("input", updateCount);
document.querySelectorAll('input[name="mood"]').forEach((input) => {
  input.addEventListener("change", updateCount);
});

dreamForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(dreamForm);
  const memo = dreamInput.value.trim();
  const selectedOptions = getSelectedOptions();
  const text = selectedOptions.map((option) => option.label).join(", ");
  const mood = formData.get("mood");
  const tone = "balanced";

  if (selectedOptions.length < 2) {
    wordCount.textContent = "장소, 대상, 행동, 현실 주제 중 2개 이상 선택해주세요.";
    wordCount.style.color = "var(--warning)";
    return;
  }

  wordCount.style.color = "";
  submitButton.disabled = true;
  submitButton.textContent = "해석 정리 중...";

  const result = buildKeywordResult({ selectedOptions, mood, tone, memo });

  submitButton.disabled = false;
  submitButton.textContent = "해석하기";

  result.memo = memo;
  result.selectedOptionIds = selectedOptions.map((option) => option.id);
  result.dream = text;
  renderResult(result);
  scrollToResult();
  if (saveHistoryInput.checked) {
    setHistory([result, ...getHistory()]);
    renderHistory();
  }
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.copy);
    copyButton.textContent = "복사됨";
    setTimeout(() => {
      copyButton.textContent = "결과 복사";
    }, 1400);
  } catch {
    copyButton.textContent = "복사 실패";
  }
});

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
});

saveDreamButton.addEventListener("click", () => {
  if (!currentResult || isSavedResult(currentResult)) {
    updateSaveButton();
    return;
  }

  const savedItem = {
    ...currentResult,
    savedAt: new Date().toISOString(),
  };
  setSavedDreams([savedItem, ...getSavedDreams()]);
  renderSavedDreams();
  updateSaveButton(savedItem);
});

if (clearSavedButton) {
  clearSavedButton.addEventListener("click", () => {
    localStorage.removeItem(SAVED_STORAGE_KEY);
    renderSavedDreams();
    updateSaveButton();
  });
}

prevStepButton.addEventListener("click", () => {
  currentStep -= 1;
  renderStep();
});

nextStepButton.addEventListener("click", () => {
  currentStep += 1;
  renderStep();
});

resetButton.addEventListener("click", () => {
  dreamForm.reset();
  restoreSelections([]);
  document.querySelector('input[name="mood"][value="평온함"]').checked = true;
  saveHistoryInput.checked = true;
  dreamInput.value = "";
  currentStep = 0;
  renderStep();
  updateCount();
});

renderChoiceUi();
renderStep();
updateCount();
renderHistory();
renderSavedDreams();
updateSaveButton();
