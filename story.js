// 『상사(相思): 청평사의 뱀』 — 시나리오 데이터
// 화자: nar(나레이션) seola(설아) mu(무영) mansin(오봉 만신) dok(도깨비 문지기) mul(물귀신) sagong(사공)
const STORY = {
  cast: {
    nar:    { name: "", color: "#e8dcc4" },
    seola:  { name: "설아", color: "#7fb3ff", portrait: "por_seola" },
    mu:     { name: "무영", color: "#b39dff", portrait: "por_mu" },
    mansin: { name: "오봉 만신", color: "#ff8a7a", portrait: "por_mansin" },
    dok:    { name: "문지기 도깨비", color: "#ffb347", portrait: "por_dok" },
    mul:    { name: "물귀신", color: "#9fd8ff", portrait: "por_mul" },
    sagong: { name: "사공", color: "#c9b79c" },
    sys:    { name: "", color: "#f3e3a3" }
  },

  // 오방(五方) 기술 — 귀멸의 '호흡' 대응
  techniques: [
    { id: "cheong", key: 1, name: "동방청제 · 바람베기", short: "청", color: "#2f6fe4", img: "cut_blue",  desc: "동쪽 나무의 기운. 바람을 갈라 원한을 흩뜨린다." },
    { id: "jeok",   key: 2, name: "남방적제 · 불씻김",   short: "적", color: "#e0342c", img: "cut_red",   desc: "남쪽 불의 기운. 부적을 태워 부정을 사른다." },
    { id: "hwang",  key: 3, name: "중앙황제 · 흙묶기",   short: "황", color: "#e8b53a", img: "cut_yellow",desc: "중앙 흙의 기운. 떠도는 혼을 땅에 붙든다." },
    { id: "baek",   key: 4, name: "서방백제 · 쇠울림",   short: "백", color: "#f2f2f2", img: "cut_white", desc: "서쪽 쇠의 기운. 방울 소리로 귀를 깨운다." },
    { id: "heuk",   key: 5, name: "북방흑제 · 물가둠",   short: "흑", color: "#6d5bd0", img: "cut_black", desc: "북쪽 물의 기운. 한을 물속에 가라앉힌다." }
  ],

  chapters: [
    // ───────────── 제1장 ─────────────
    {
      id: "ch1", title: "제1장", subtitle: "소양호 뱃길", bgm: "explore",
      scenes: [
        { type: "video", src: "cs01", bg: "bg_lake", caption: "물 아래에서, 누군가 나를 부르고 있었다." },
        { type: "dialog", bg: "bg_lake", lines: [
          { who: "nar", text: "물 아래에서, 누군가 나를 부르고 있었다. 천 년을 기다렸다고.", voice: "v01" },
          { who: "nar", text: "고려의 산, 오봉산. 원나라에서 바다를 건너온 공주는 그 산의 절, 청평사로 향하고 있었다.", voice: "v02" },
          { who: "sagong", text: "아가씨. 오봉산엔 뭐 하러 가시오. 요즘 그 산엔 들어간 사람은 있어도, 나온 사람은 없다던데.", voice: "v03" },
          { who: "seola", text: "……나온 사람이 되러 갑니다.", voice: "v04", pose: "calm" },
          { who: "nar", text: "그때, 배 밑으로 검은 그림자가 지나갔다. 물고기라 하기엔 너무 길고, 너무 슬픈 그림자였다.", voice: "v05" },
          { who: "mu", text: "찾았다. 이번 생에도…… 찾았다.", voice: "v06", fx: "shake" },
          { who: "seola", text: "윽……! 목이…… 뜨거워……", pose: "pain", fx: "shake" },
          { who: "nar", text: "공주의 목을 타고 검푸른 비늘이 올라왔다. 사람들은 그것을 신병(神病)이라 불렀다. 신이 내리기 전에 앓는 병.", voice: "v07" }
        ]},
        { type: "image", src: "kf_sinbyeong", caption: "선착장에서, 붉은 옷의 노인이 등불을 들고 다가왔다." },
        { type: "dialog", bg: "kf_sinbyeong", lines: [
          { who: "mansin", text: "네 몸에 뱀이 감겨 있구나. 사람의 한(恨)이 굳어 뱀이 된 것이다.", voice: "v08" },
          { who: "seola", text: "당신은…… 누구세요?", pose: "pain" },
          { who: "mansin", text: "오봉산 만신. 이 산의 굿을 맡은 사람이지. 뱀을 떼는 법은 둘뿐이다. 벼락으로 태우거나, 굿으로 풀거나.", voice: "v09" },
          { who: "seola", text: "……풀어주세요. 부탁드립니다.", voice: "v10", pose: "calm" },
          { who: "mansin", text: "내가 아니라, 네가 풀어야지. 신을 받아라. 내림굿이다.", voice: "v11" },
          { who: "nar", text: "그날 밤, 오봉산 굿당에서 장구 소리가 밤새 그치지 않았다.", voice: "v12" }
        ]},
        { type: "image", src: "kf_naerim", caption: "내림굿 — 신을 받는 밤" },
        { type: "dialog", bg: "kf_naerim", lines: [
          { who: "mansin", text: "잘 들어라. 굿은 싸움이 아니라 장단이다. 장구가 울릴 때 오방기를 흔들어라. 동은 청, 남은 적, 중앙은 황, 서는 백, 북은 흑.", voice: "v13" },
          { who: "mansin", text: "장단을 맞추면 한이 풀리고, 놓치면 네 신기(神氣)가 새어 나간다. 자, 원귀 하나가 굿당에 들어왔다. 저것으로 배워라.", voice: "v14" },
          { who: "sys", text: "【조작】 오방색 구슬이 판정선에 닿는 순간, 같은 색의 키(1~5) 또는 화면 버튼을 누르세요. 붉은 '원한' 구슬은 아무 키나 눌러 막아냅니다." }
        ]},
        { type: "battle", enemy: "wongwi", bg: "bg_gutdang", tutorial: true, bgm: "battle",
          lanes: ["cheong"], length: 24, bpm: 96, learn: "cheong" },
        { type: "dialog", bg: "bg_gutdang", lines: [
          { who: "sys", text: "오방 기술 습득 — 동방청제 · 바람베기" },
          { who: "mansin", text: "됐다. 이제 넌 공주가 아니라 무녀다. 산을 올라라. 구성폭포에서 아홉 물소리가 널 기다린다.", voice: "v15" },
          { who: "seola", text: "……가겠습니다.", pose: "calm" }
        ]}
      ]
    },

    // ───────────── 제2장 ─────────────
    {
      id: "ch2", title: "제2장", subtitle: "구성폭포 · 아홉 물소리", bgm: "explore",
      scenes: [
        { type: "video", src: "cs02", bg: "bg_falls", caption: "구성폭포. 아홉 가지 물소리가 나는 곳." },
        { type: "dialog", bg: "bg_falls", lines: [
          { who: "nar", text: "구성폭포. 물이 아홉 번 꺾여 떨어지며 아홉 가지 소리를 낸다는 곳. 그런데 그날 밤, 소리는 열 개였다.", voice: "v16" },
          { who: "nar", text: "열 번째 소리는, 우는 소리였다." },
          { who: "mul", text: "……너도…… 기다리다 죽었니……?", voice: "v17" },
          { who: "seola", text: "아니. 나는…… 기다리게 한 사람이야.", voice: "v18", pose: "calm" },
          { who: "mul", text: "그럼 너도 물에 들어와. 기다리게 한 사람은, 기다리는 게 어떤 건지 알아야 해……!", fx: "shake" },
          { who: "seola", text: "(장구 소리가 들린다. 만신이 산 아래서 굿을 시작한 거다.) ……가르쳐 줘. 대신 나도 너를 씻겨 줄게.", pose: "fierce" }
        ]},
        { type: "battle", enemy: "mul", bg: "bg_falls", bgm: "battle",
          lanes: ["cheong", "jeok"], length: 40, bpm: 112, learn: "jeok", keyframe: "kf_falls" },
        { type: "dialog", bg: "bg_falls", lines: [
          { who: "sys", text: "오방 기술 습득 — 남방적제 · 불씻김" },
          { who: "mul", text: "……고마워. 이제…… 소리가 하나만 들려.", voice: "v19" },
          { who: "nar", text: "물귀신은 물이 되어 폭포로 돌아갔다. 그날 이후 구성폭포의 물소리는 다시 아홉이 되었다.", voice: "v20" },
          { who: "seola", text: "(목의 비늘이 조금 옅어졌다. ……저 뱀도, 저렇게 울고 있는 걸까.)", pose: "calm" }
        ]}
      ]
    },

    // ───────────── 제3장 ─────────────
    {
      id: "ch3", title: "제3장", subtitle: "공주굴 · 그림자 없는 사람", bgm: "flashback",
      scenes: [
        { type: "dialog", bg: "bg_cave", lines: [
          { who: "nar", text: "폭포 옆, 바위 틈에 작은 굴이 있었다. 훗날 사람들이 공주굴이라 부르게 될 곳.", voice: "v21" },
          { who: "seola", text: "……이건.", pose: "calm" },
          { who: "nar", text: "바닥에 붉은 실팔찌 하나가 떨어져 있었다. 낡고, 해지고, 그러나 누군가 오래 만진 흔적이 있는." }
        ]},
        { type: "video", src: "cs03", bg: "kf_flashback", caption: "— 십 년 전, 원나라 대도(大都)의 연회 —" },
        { type: "dialog", bg: "kf_flashback", filter: "sepia", lines: [
          { who: "nar", text: "십 년 전, 원나라 황궁의 연회. 기둥 뒤에 한 사람이 서 있었다. 말직 관리. 이름을 불러 주는 사람이 없는 자리.", voice: "v22" },
          { who: "mu", text: "(저분이 웃으실 때, 나는 숨을 쉬지 못한다. 신분이…… 신분이 다르다. 말할 수 없다. 죽어도 말할 수 없다.)", voice: "v23" },
          { who: "nar", text: "그는 병을 얻었다. 의원은 상사병(相思病)이라 했다. 죽기 전, 그는 이렇게 맹세했다." },
          { who: "mu", text: "이 세상에서 이루지 못했다면…… 죽어서라도, 그녀 곁에 있겠다.", voice: "v24", fx: "shake" }
        ]},
        { type: "image", src: "kf_cave", caption: "촛불 하나. 팔찌 하나. 그리고, 뒤에 선 사람." },
        { type: "dialog", bg: "kf_cave", learn: "hwang", lines: [
          { who: "mu", text: "……그 팔찌, 제 것입니다. 공주마마.", voice: "v25" },
          { who: "seola", text: "너였구나. 뱀이 되어 내 몸을 감은 게. ……그 사람의 이름조차, 나는 몰랐어.", voice: "v26", pose: "calm" },
          { who: "mu", text: "무영(無影). 그림자 없는 자. 당신 곁에 설 자리가 없었으니, 그림자도 없었지요.", voice: "v27" },
          { who: "seola", text: "그래서 내 몸을 감았어? 그게 사랑이야?", voice: "v28", pose: "fierce" },
          { who: "mu", text: "……한(恨)입니다. 사랑이 갈 곳을 잃으면, 한이 됩니다. 그리고 한은…… 자기가 누구였는지 잊습니다.", voice: "v29" },
          { who: "nar", text: "그가 사라진 자리에 흙냄새가 남았다. 설아는 팔찌를 손목에 감았다. 이유는 스스로도 몰랐다.", voice: "v30" },
          { who: "sys", text: "오방 기술 습득 — 중앙황제 · 흙묶기 (한이 굳은 자리를 붙드는 힘)" }
        ]}
      ]
    },

    // ───────────── 제4장 ─────────────
    {
      id: "ch4", title: "제4장", subtitle: "회전문 · 돌아 나오는 문", bgm: "explore",
      scenes: [
        { type: "video", src: "cs04", bg: "bg_gate", caption: "회전문. 잘못 산 자는 이 문을 돌아 나온다." },
        { type: "dialog", bg: "bg_gate", lines: [
          { who: "nar", text: "청평사 회전문. 잘못 살아온 자는 이 문을 지나지 못하고 빙글 돌아 나온다고 했다. 윤회(輪廻)의 문.", voice: "v31" },
          { who: "dok", text: "크하핫! 여기까지 올라온 계집은 네가 처음이다! 난 이 문의 문지기! 니가 잘못 산 게 있으면, 문이 널 뱉어낸다!", voice: "v32", fx: "shake" },
          { who: "seola", text: "……잘못 산 것. 있어. 한 사람이 죽어 가는 걸, 나는 몰랐어.", pose: "calm" },
          { who: "dok", text: "몰랐다고 죄가 없는 건 아니지! 하지만 안다고 죄가 되는 것도 아니야! 그러니까 씨름 한 판 하자! 문이 정해줄 거다!", voice: "v33" }
        ]},
        { type: "battle", enemy: "dok", bg: "bg_gate", bgm: "battle",
          lanes: ["cheong", "jeok", "hwang"], length: 56, bpm: 128, learn: "baek", keyframe: "kf_gate" },
        { type: "dialog", bg: "bg_gate", lines: [
          { who: "sys", text: "오방 기술 습득 — 서방백제 · 쇠울림 / 북방흑제 · 물가둠" },
          { who: "dok", text: "허…… 네 걸음엔 후회는 있어도, 도망은 없구먼. 지나가라. 문이 널 뱉지 않는다.", voice: "v34" },
          { who: "mansin", text: "여기까지 왔구나.", voice: "v35" },
          { who: "seola", text: "만신님……!", pose: "calm" },
          { who: "mansin", text: "마지막이다. 영지(影池)에서 뱀이 기다린다. 벼락은 하늘이 내리는 것이고, 씻김은 사람이 하는 것이다.", voice: "v36" },
          { who: "mansin", text: "전설은 벼락을 택했다. 하지만 전설은 전설이고…… 네 굿은 네 것이다. 무엇을 택하든, 네가 택해라.", voice: "v37" },
          { who: "seola", text: "……네. 제가 택하겠습니다.", voice: "v38", pose: "fierce" }
        ]}
      ]
    },

    // ───────────── 제5장 ─────────────
    {
      id: "ch5", title: "제5장", subtitle: "영지 · 공주탑", bgm: "boss",
      scenes: [
        { type: "video", src: "cs05", bg: "kf_boss", caption: "영지. 오봉산이 비치는 연못. 그리고, 뱀." },
        { type: "dialog", bg: "kf_boss", lines: [
          { who: "nar", text: "영지. 오봉산 다섯 봉우리가 그대로 비치는 연못. 그 물 위로, 뱀이 몸을 일으켰다.", voice: "v39" },
          { who: "mu", text: "공주마마…… 왜 오셨습니까. 그냥 감겨 계시면 됐는데. 그러면 영원히 곁에……", voice: "v40" },
          { who: "seola", text: "무영. 네 이름을 부르러 왔어. 살아서 한 번도 못 들었을 이름을.", voice: "v41", pose: "fierce" },
          { who: "mu", text: "……부르지 마십시오. 한은 이름을 들으면…… 무너집니다……! 크아아아——!", voice: "v42", fx: "shake" }
        ]},
        { type: "battle", enemy: "snake1", bg: "kf_boss", bgm: "boss",
          lanes: ["cheong", "jeok", "hwang", "baek", "heuk"], length: 64, bpm: 136, keyframe: "kf_boss" },
        { type: "dialog", bg: "bg_ridge", lines: [
          { who: "nar", text: "하늘이 다섯 빛깔로 갈라졌다. 벼락이 한 점에 모이고 있었다. 전설이 말한 그 벼락이." , voice: "v43" },
          { who: "mu", text: "……보이십니까. 하늘이 저를 태우려 합니다. 그게 맞습니다. 그게…… 전설입니다.", voice: "v44" },
          { who: "seola", text: "(장구가 빨라진다. 만신이 마지막 장단을 치고 있다. ……지금이야.)", pose: "fierce" }
        ]},
        { type: "battle", enemy: "snake2", bg: "bg_ridge", bgm: "boss", phase2: true,
          lanes: ["cheong", "jeok", "hwang", "baek", "heuk"], length: 72, bpm: 150, keyframe: "kf_climax" },
        { type: "choice", bg: "kf_climax", prompt: "벼락이 떨어지기까지, 장구 세 박자. 설아는——",
          options: [
            { id: "lightning", label: "벼락을 부른다", sub: "전설의 결말. 뱀을 태운다." },
            { id: "ssitgim",   label: "씻김굿을 올린다", sub: "이름을 부르고, 한을 풀어준다." }
          ]}
      ]
    }
  ],

  endings: {
    lightning: {
      title: "결말 · 전설", bgm: "flashback",
      scenes: [
        { type: "video", src: "cs06a", bg: "kf_lightning", caption: "벼락이 떨어졌다." },
        { type: "dialog", bg: "kf_lightning", lines: [
          { who: "nar", text: "벼락이 떨어졌다. 뱀은 새까맣게 타서 연못에 가라앉았다. 비늘의 붉은 글씨가 하나씩 꺼졌다.", voice: "v45" },
          { who: "mu", text: "……고맙습니다. 이걸로…… 됐습니다……", voice: "v46" },
          { who: "seola", text: "……아니. 되지 않았어. 무영. 나는 네 이름을…… 아직 한 번도 제대로 부르지 못했어.", pose: "pain" },
          { who: "nar", text: "공주는 그 자리에 탑을 세웠다. 사람들은 공주탑이라 불렀다. 전설은 여기서 끝난다.", voice: "v47" },
          { who: "nar", text: "하지만 나는, 그 탑 앞에서 오래 울었다. 전설에는 적히지 않은 시간만큼.", voice: "v48" },
          { who: "sys", text: "— 결말 · 전설 —   회전문을 다시 돌아 나오면, 다른 선택이 기다립니다." }
        ]}
      ]
    },
    ssitgim: {
      title: "결말 · 해원(解冤)", bgm: "ending",
      scenes: [
        { type: "video", src: "cs06b", bg: "kf_ending", caption: "설아는 흰 베를 풀어 하늘에 띄웠다." },
        { type: "dialog", bg: "kf_ending", lines: [
          { who: "nar", text: "설아는 벼락 대신 흰 베를 풀었다. 씻김굿. 산 사람이 죽은 사람의 한을 씻어 보내는 굿.", voice: "v49" },
          { who: "seola", text: "무영. 무영. 무영. ……들려? 네 이름이야. 살아서 한 번도 못 들었을, 네 이름.", voice: "v50", pose: "calm" },
          { who: "nar", text: "벼락은 하늘로 돌아갔다. 뱀의 비늘이 흰 꽃잎이 되어 흩어졌다. 그 안에서, 사람 하나가 걸어 나왔다.", voice: "v51" },
          { who: "mu", text: "……이제야. 그림자가 생겼습니다. 당신이 저를 봐 주셔서.", voice: "v52" },
          { who: "seola", text: "잘 가. 다음 생엔…… 이름부터 말해. 기둥 뒤에 서 있지 말고.", voice: "v53", pose: "calm" },
          { who: "mu", text: "……예. 공주마마. 다음 생엔, 제일 먼저.", voice: "v54" },
          { who: "nar", text: "설아는 그 자리에 탑을 세웠다. 사람들은 공주탑이라 불렀다. 하지만 나는 안다.", voice: "v55" },
          { who: "nar", text: "그건 이름 없던 한 사람의, 이름이다.", voice: "v56" },
          { who: "sys", text: "— 결말 · 해원 —   청평사 가는 길, 회전문을 지나 영지 앞에 서면, 탑 하나가 있다." }
        ]}
      ]
    }
  },

  enemies: {
    wongwi: { name: "원귀", img: "en_wongwi", hp: 100, line: "……이름을…… 돌려줘……" },
    mul:    { name: "구성폭포의 물귀신", img: "en_mul", hp: 100, line: "물에 들어와……" },
    dok:    { name: "회전문 문지기 도깨비", img: "en_dok", hp: 100, line: "씨름이다!" },
    snake1: { name: "상사뱀 — 분노", img: "en_snake", hp: 100, line: "부르지 마십시오……!" },
    snake2: { name: "상사뱀 — 한의 절정", img: "en_snake", hp: 100, line: "……태워 주십시오……" }
  }
};

// 음성 대본 (TTS 생성용 인덱스)
const VOICE_LINES = {
  v01:["nar","물 아래에서, 누군가 나를 부르고 있었다. 천 년을 기다렸다고."],
  v02:["nar","고려의 산, 오봉산. 원나라에서 바다를 건너온 공주는 그 산의 절, 청평사로 향하고 있었다."],
  v03:["sagong","아가씨. 오봉산엔 뭐 하러 가시오. 요즘 그 산엔 들어간 사람은 있어도, 나온 사람은 없다던데."],
  v04:["seola","……나온 사람이 되러 갑니다."],
  v05:["nar","그때, 배 밑으로 검은 그림자가 지나갔다. 물고기라 하기엔 너무 길고, 너무 슬픈 그림자였다."],
  v06:["mu","찾았다. 이번 생에도…… 찾았다."],
  v07:["nar","공주의 목을 타고 검푸른 비늘이 올라왔다. 사람들은 그것을 신병이라 불렀다. 신이 내리기 전에 앓는 병."],
  v08:["mansin","네 몸에 뱀이 감겨 있구나. 사람의 한이 굳어 뱀이 된 것이다."],
  v09:["mansin","오봉산 만신. 이 산의 굿을 맡은 사람이지. 뱀을 떼는 법은 둘뿐이다. 벼락으로 태우거나, 굿으로 풀거나."],
  v10:["seola","……풀어주세요. 부탁드립니다."],
  v11:["mansin","내가 아니라, 네가 풀어야지. 신을 받아라. 내림굿이다."],
  v12:["nar","그날 밤, 오봉산 굿당에서 장구 소리가 밤새 그치지 않았다."],
  v13:["mansin","잘 들어라. 굿은 싸움이 아니라 장단이다. 장구가 울릴 때 오방기를 흔들어라. 동은 청, 남은 적, 중앙은 황, 서는 백, 북은 흑."],
  v14:["mansin","장단을 맞추면 한이 풀리고, 놓치면 네 신기가 새어 나간다. 자, 원귀 하나가 굿당에 들어왔다. 저것으로 배워라."],
  v15:["mansin","됐다. 이제 넌 공주가 아니라 무녀다. 산을 올라라. 구성폭포에서 아홉 물소리가 널 기다린다."],
  v16:["nar","구성폭포. 물이 아홉 번 꺾여 떨어지며 아홉 가지 소리를 낸다는 곳. 그런데 그날 밤, 소리는 열 개였다."],
  v17:["mul","……너도…… 기다리다 죽었니……?"],
  v18:["seola","아니. 나는…… 기다리게 한 사람이야."],
  v19:["mul","……고마워. 이제…… 소리가 하나만 들려."],
  v20:["nar","물귀신은 물이 되어 폭포로 돌아갔다. 그날 이후 구성폭포의 물소리는 다시 아홉이 되었다."],
  v21:["nar","폭포 옆, 바위 틈에 작은 굴이 있었다. 훗날 사람들이 공주굴이라 부르게 될 곳."],
  v22:["nar","십 년 전, 원나라 황궁의 연회. 기둥 뒤에 한 사람이 서 있었다. 말직 관리. 이름을 불러 주는 사람이 없는 자리."],
  v23:["mu","저분이 웃으실 때, 나는 숨을 쉬지 못한다. 신분이…… 신분이 다르다. 말할 수 없다. 죽어도 말할 수 없다."],
  v24:["mu","이 세상에서 이루지 못했다면…… 죽어서라도, 그녀 곁에 있겠다."],
  v25:["mu","……그 팔찌, 제 것입니다. 공주마마."],
  v26:["seola","너였구나. 뱀이 되어 내 몸을 감은 게. ……그 사람의 이름조차, 나는 몰랐어."],
  v27:["mu","무영. 그림자 없는 자. 당신 곁에 설 자리가 없었으니, 그림자도 없었지요."],
  v28:["seola","그래서 내 몸을 감았어? 그게 사랑이야?"],
  v29:["mu","……한입니다. 사랑이 갈 곳을 잃으면, 한이 됩니다. 그리고 한은…… 자기가 누구였는지 잊습니다."],
  v30:["nar","그가 사라진 자리에 흙냄새가 남았다. 설아는 팔찌를 손목에 감았다. 이유는 스스로도 몰랐다."],
  v31:["nar","청평사 회전문. 잘못 살아온 자는 이 문을 지나지 못하고 빙글 돌아 나온다고 했다. 윤회의 문."],
  v32:["dok","크하핫! 여기까지 올라온 계집은 네가 처음이다! 난 이 문의 문지기! 니가 잘못 산 게 있으면, 문이 널 뱉어낸다!"],
  v33:["dok","몰랐다고 죄가 없는 건 아니지! 하지만 안다고 죄가 되는 것도 아니야! 그러니까 씨름 한 판 하자! 문이 정해줄 거다!"],
  v34:["dok","허…… 네 걸음엔 후회는 있어도, 도망은 없구먼. 지나가라. 문이 널 뱉지 않는다."],
  v35:["mansin","여기까지 왔구나."],
  v36:["mansin","마지막이다. 영지에서 뱀이 기다린다. 벼락은 하늘이 내리는 것이고, 씻김은 사람이 하는 것이다."],
  v37:["mansin","전설은 벼락을 택했다. 하지만 전설은 전설이고…… 네 굿은 네 것이다. 무엇을 택하든, 네가 택해라."],
  v38:["seola","……네. 제가 택하겠습니다."],
  v39:["nar","영지. 오봉산 다섯 봉우리가 그대로 비치는 연못. 그 물 위로, 뱀이 몸을 일으켰다."],
  v40:["mu","공주마마…… 왜 오셨습니까. 그냥 감겨 계시면 됐는데. 그러면 영원히 곁에……"],
  v41:["seola","무영. 네 이름을 부르러 왔어. 살아서 한 번도 못 들었을 이름을."],
  v42:["mu","……부르지 마십시오. 한은 이름을 들으면…… 무너집니다……! 크아아아!"],
  v43:["nar","하늘이 다섯 빛깔로 갈라졌다. 벼락이 한 점에 모이고 있었다. 전설이 말한 그 벼락이."],
  v44:["mu","……보이십니까. 하늘이 저를 태우려 합니다. 그게 맞습니다. 그게…… 전설입니다."],
  v45:["nar","벼락이 떨어졌다. 뱀은 새까맣게 타서 연못에 가라앉았다. 비늘의 붉은 글씨가 하나씩 꺼졌다."],
  v46:["mu","……고맙습니다. 이걸로…… 됐습니다……"],
  v47:["nar","공주는 그 자리에 탑을 세웠다. 사람들은 공주탑이라 불렀다. 전설은 여기서 끝난다."],
  v48:["nar","하지만 나는, 그 탑 앞에서 오래 울었다. 전설에는 적히지 않은 시간만큼."],
  v49:["nar","설아는 벼락 대신 흰 베를 풀었다. 씻김굿. 산 사람이 죽은 사람의 한을 씻어 보내는 굿."],
  v50:["seola","무영. 무영. 무영. ……들려? 네 이름이야. 살아서 한 번도 못 들었을, 네 이름."],
  v51:["nar","벼락은 하늘로 돌아갔다. 뱀의 비늘이 흰 꽃잎이 되어 흩어졌다. 그 안에서, 사람 하나가 걸어 나왔다."],
  v52:["mu","……이제야. 그림자가 생겼습니다. 당신이 저를 봐 주셔서."],
  v53:["seola","잘 가. 다음 생엔…… 이름부터 말해. 기둥 뒤에 서 있지 말고."],
  v54:["mu","……예. 공주마마. 다음 생엔, 제일 먼저."],
  v55:["nar","설아는 그 자리에 탑을 세웠다. 사람들은 공주탑이라 불렀다. 하지만 나는 안다."],
  v56:["nar","그건 이름 없던 한 사람의, 이름이다."]
};
