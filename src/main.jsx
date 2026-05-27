
import React, { useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const VERSION = "V2.7 人生歲月核心版";
const STARTING_CASH = 5000;
const START_AGE_MONTHS = 18 * 12;
const MAX_AGE_MONTHS = 100 * 12;
const TARGET_TOTAL = 100;

const animals = ["🐱", "🐶", "🦊", "🐼", "🐧", "🐸", "🦁", "🐰"];
const careers = ["學院", "農墾", "企業", "航海", "月球探險", "電影明星", "從政", "開礦"];

const outerBoard = [
  { id: "start", name: "發薪日", type: "payday", icon: "💰" },
  { id: "family-1", name: "家庭事件", type: "family", icon: "🏠" },
  { id: "chance-1", name: "機會", type: "chance", icon: "🎴" },
  { id: "career-academy", name: "學院入口", type: "careerEntry", career: "學院", icon: "🎓", fee: 1000, requirement: "無；已有學院經驗可免入門費" },
  { id: "family-2", name: "家庭事件", type: "family", icon: "👨‍👩‍👧" },
  { id: "career-farm", name: "農墾入口", type: "careerEntry", career: "農墾", icon: "🌾", fee: 800, requirement: "無；已有農墾經驗可免入門費" },
  { id: "chance-2", name: "機會", type: "chance", icon: "🎴" },
  { id: "career-business", name: "企業入口", type: "careerEntry", career: "企業", icon: "💼", fee: 1200, requirement: "無；已有企業經驗可免入門費" },
  { id: "family-3", name: "家庭事件", type: "family", icon: "❤️" },
  { id: "career-sail", name: "航海入口", type: "careerEntry", career: "航海", icon: "⚓", fee: 1500, requirement: "無；已有航海經驗可免入門費" },
  { id: "chance-3", name: "機會", type: "chance", icon: "🎴" },
  { id: "career-moon", name: "月球探險入口", type: "careerEntry", career: "月球探險", icon: "🚀", fee: 2000, requirement: "需有任一職業經驗；已有月球探險經驗可免入門費" },
  { id: "family-4", name: "家庭事件", type: "family", icon: "🏡" },
  { id: "career-movie", name: "電影明星入口", type: "careerEntry", career: "電影明星", icon: "🎬", fee: 1200, requirement: "無；已有電影明星經驗可免入門費" },
  { id: "chance-4", name: "機會", type: "chance", icon: "🎴" },
  { id: "career-politics", name: "從政入口", type: "careerEntry", career: "從政", icon: "🏛️", fee: 1500, requirement: "名譽不低於 -5；已有從政經驗可免入門費" },
  { id: "family-5", name: "家庭事件", type: "family", icon: "🧓" },
  { id: "career-mine", name: "開礦入口", type: "careerEntry", career: "開礦", icon: "⛏️", fee: 1500, requirement: "無；已有開礦經驗可免入門費" },
  { id: "chance-5", name: "機會", type: "chance", icon: "🎴" },
  { id: "family-6", name: "家庭事件", type: "family", icon: "🍲" },
];

const careerBoards = Object.fromEntries(careers.map((career, idx) => [career, Array.from({length: 12 + (idx % 4)}, (_, i) => ({
  id: `${career}-${i+1}`,
  name: `${career}第${i+1}站`,
  type: i === 0 ? "careerStart" : i === 11 + (idx % 4) ? "careerExit" : "careerEvent",
  career,
  icon: ["🎓","🌾","💼","⚓","🚀","🎬","🏛️","⛏️"][idx]
}))]));

const familyEvents = [
  { title: "家庭聚餐", desc: "家人圍坐一桌，你想起人生不只有工作。", cash: -500, happiness: 4, reputation: 0, important: true },
  { title: "家人支持", desc: "家人在低潮時給了你一句鼓勵。", cash: 0, happiness: 5, reputation: 0, important: true },
  { title: "長輩生病", desc: "你花時間陪伴與照顧長輩。", cash: -1000, happiness: -2, reputation: 2, important: true },
  { title: "家庭衝突", desc: "價值觀不同帶來爭執，讓你感到疲憊。", cash: 0, happiness: -4, reputation: 0, important: false },
  { title: "孩子的笑聲", desc: "平凡的日常裡，你重新感受到生活的溫度。", cash: -500, happiness: 6, reputation: 0, important: true },
  { title: "伴侶的理解", desc: "有人理解你的選擇，讓你更堅定。", cash: 0, happiness: 4, reputation: 1, important: true },
  { title: "親友借錢", desc: "親友遇到困難向你開口，你選擇伸出援手。", cash: -1000, happiness: 1, reputation: 2, important: false },
  { title: "家族旅行", desc: "短暫離開壓力，你與重要的人留下回憶。", cash: -1500, happiness: 7, reputation: 0, important: true },
];

const chanceEvents = [
  { title: "貴人指路", desc: "一位貴人替你指出新的方向。", cash: 500, happiness: 1, reputation: 1, card: "機會卡", important: true },
  { title: "小額投資成功", desc: "你做了一筆謹慎投資，得到些微回報。", cash: 1000, happiness: 0, reputation: 0, important: false },
  { title: "意外支出", desc: "生活總有意外，你不得不支付一筆開銷。", cash: -1000, happiness: -1, reputation: 0, important: false },
  { title: "地方表揚", desc: "你的努力被看見，開始受到更多人注意。", cash: 0, happiness: 1, reputation: 3, important: true },
  { title: "稀有機會：人生轉折", desc: "命運給了你一次罕見的轉向機會。", cash: 1000, happiness: 3, reputation: 3, rare: true, important: true },
];

const careerEvents = {
  學院: [
    { title: "研究突破", desc: "你在研究中看見新的可能。", cash: 0, happiness: 2, reputation: 3, important: true },
    { title: "升等壓力", desc: "漫長的審查讓你感到疲憊。", cash: 0, happiness: -3, reputation: 1 },
  ],
  農墾: [
    { title: "豐收", desc: "土地回應了你的耐心。", cash: 1000, happiness: 4, reputation: 1, important: true },
    { title: "天候不穩", desc: "風雨打亂了耕作節奏。", cash: -1000, happiness: -2, reputation: 0 },
  ],
  企業: [
    { title: "專案成功", desc: "你帶領團隊完成關鍵任務。", cash: 1000, happiness: 0, reputation: 2, important: true },
    { title: "加班連夜", desc: "財務有成長，生活卻被工作占滿。", cash: 1000, happiness: -3, reputation: 1 },
  ],
  航海: [
    { title: "遠洋貿易", desc: "你從遠方帶回新的見聞與收益。", cash: 1500, happiness: 1, reputation: 1, important: true },
    { title: "海上風暴", desc: "風浪提醒你人生的不可預測。", cash: -1000, happiness: -2, reputation: 1 },
  ],
  月球探險: [
    { title: "太空任務成功", desc: "你短暫離開地球，名聲傳回人間。", cash: 1000, happiness: 2, reputation: 5, important: true },
    { title: "孤獨航程", desc: "偉大的冒險也伴隨難以言說的孤寂。", cash: 0, happiness: -4, reputation: 2 },
  ],
  電影明星: [
    { title: "新片上映", desc: "聚光燈照向你，觀眾記住了你的名字。", cash: 1000, happiness: 1, reputation: 4, important: true },
    { title: "緋聞風波", desc: "名聲帶來掌聲，也帶來壓力。", cash: 0, happiness: -3, reputation: -2, important: true },
  ],
  從政: [
    { title: "政策獲得支持", desc: "你的理念開始影響更多人。", cash: 0, happiness: 1, reputation: 5, important: true },
    { title: "輿論攻擊", desc: "站上舞台，也意味著承受批評。", cash: 0, happiness: -3, reputation: -3 },
  ],
  開礦: [
    { title: "挖到礦脈", desc: "地下的資源帶來可觀收益。", cash: 1500, happiness: 0, reputation: 1, important: true },
    { title: "工安事故", desc: "高收益的背後，也有沉重代價。", cash: -1000, happiness: -3, reputation: -1, important: true },
  ],
};

const achievementPools = {
  學院: [
    { title: "教師", tier: 1, prefix: "教師", desc: "你開始陪伴他人成長。", salaryRaise: 500, rep: 1, effects: ["教育事件較容易帶來名譽"], risks: ["升等壓力仍會影響快樂"] },
    { title: "教授", tier: 2, prefix: "教授", desc: "你在知識領域逐漸站穩位置。", salaryRaise: 1000, rep: 2, effects: ["學院事件名譽收益提升"], risks: ["研究壓力增加"] },
    { title: "名譽博士", tier: 3, suffix: "名譽博士", desc: "你的一生被學術共同體記住。", salaryRaise: 1500, rep: 4, effects: ["可觸發傳承事件"], risks: ["晚年責任增加"] },
  ],
  農墾: [
    { title: "有機農夫", tier: 1, suffix: "有機農夫", desc: "你開始享受平穩的土地節奏。", salaryRaise: 300, happy: 2, effects: ["家庭事件快樂收益提升"], risks: [] },
    { title: "農場主", tier: 2, suffix: "農場主", desc: "你把土地經營成安身立命之處。", salaryRaise: 800, happy: 2, effects: ["農墾事件較穩定"], risks: ["天候風險仍存在"] },
    { title: "地方職人", tier: 3, prefix: "地方職人", desc: "你成為地方生活智慧的象徵。", salaryRaise: 1000, rep: 3, happy: 3, effects: ["地方事件加成"], risks: [] },
  ],
  企業: [
    { title: "職員", tier: 1, suffix: "職員", desc: "你開始理解組織與市場的規則。", salaryRaise: 500, effects: ["企業事件現金收益略提升"], risks: ["加班事件增加"] },
    { title: "經理人", tier: 2, suffix: "經理人", desc: "你開始帶領團隊，也承擔更多壓力。", salaryRaise: 1000, rep: 1, effects: ["企業事件收益提升"], risks: ["快樂損失可能增加"] },
    { title: "財團領袖", tier: 3, prefix: "財團領袖", desc: "你開始影響市場與他人的人生。", salaryRaise: 1500, rep: 3, effects: ["投資與企業稀有事件提升"], risks: ["家庭事件壓力增加"] },
  ],
  航海: [
    { title: "水手", tier: 1, suffix: "水手", desc: "你踏上離岸的旅程。", salaryRaise: 500, happy: 1, effects: ["航海事件收益略提升"], risks: ["風暴仍危險"] },
    { title: "船長", tier: 2, prefix: "船長", desc: "你開始掌舵自己的方向。", salaryRaise: 1000, rep: 2, effects: ["航海風險略降低"], risks: [] },
    { title: "提督", tier: 3, prefix: "提督", desc: "你把遠方化為人生版圖。", salaryRaise: 1500, rep: 4, effects: ["國際事件加成"], risks: ["長期離家影響家庭"] },
  ],
  月球探險: [
    { title: "太空研究員", tier: 1, suffix: "太空研究員", desc: "你開始仰望地球之外的遠方。", salaryRaise: 500, rep: 2, effects: ["月球事件成功率略提升"], risks: ["孤獨事件增加"] },
    { title: "太空人", tier: 2, prefix: "太空人", desc: "你親身踏上未知領域。", salaryRaise: 1000, rep: 4, effects: ["月球稀有事件提升"], risks: ["快樂波動較大"] },
    { title: "月球英雄", tier: 3, prefix: "月球英雄", desc: "你的名字成為人類冒險的註腳。", salaryRaise: 1500, rep: 6, effects: ["傳奇事件觸發率提升"], risks: ["孤獨感加深"] },
  ],
  電影明星: [
    { title: "演員", tier: 1, suffix: "演員", desc: "你開始站在鏡頭前。", salaryRaise: 500, rep: 2, effects: ["娛樂事件名譽收益提升"], risks: ["評價影響心情"] },
    { title: "明星", tier: 2, prefix: "明星", desc: "聚光燈開始追著你走。", salaryRaise: 1000, rep: 4, effects: ["代言事件機率提升"], risks: ["緋聞風險增加"] },
    { title: "娛樂教父", tier: 3, prefix: "娛樂教父", desc: "你不只是明星，也開始定義舞台。", salaryRaise: 1500, rep: 5, effects: ["娛樂事件加成"], risks: ["輿論事件更劇烈"] },
  ],
  從政: [
    { title: "議員", tier: 1, prefix: "議員", desc: "你開始在公共事務中發聲。", salaryRaise: 500, rep: 2, effects: ["政治事件名譽收益提升"], risks: ["輿論攻擊機率提升"] },
    { title: "市長", tier: 2, prefix: "市長", desc: "你開始承擔一座城市的期待。", salaryRaise: 1000, rep: 4, effects: ["社會事件加成"], risks: ["醜聞影響更大"] },
    { title: "政治明星", tier: 3, prefix: "政治明星", desc: "你的選擇開始改變公共想像。", salaryRaise: 1500, rep: 6, effects: ["政治稀有事件提升"], risks: ["名譽波動巨大"] },
  ],
  開礦: [
    { title: "礦工", tier: 1, suffix: "礦工", desc: "你在黑暗中尋找資源。", salaryRaise: 500, effects: ["開礦收益略提升"], risks: ["工安風險"] },
    { title: "礦場主", tier: 2, suffix: "礦場主", desc: "你開始掌握地下的財富。", salaryRaise: 1000, rep: 1, effects: ["開礦收益提升"], risks: ["健康與家庭壓力"] },
    { title: "資源大亨", tier: 3, suffix: "資源大亨", desc: "資源與風險都聚集到你身上。", salaryRaise: 1500, rep: 3, effects: ["高收益事件提升"], risks: ["負面事件代價更高"] },
  ],
};

function ageText(ageMonths){
  const years=Math.floor(ageMonths/12); const m=ageMonths%12;
  return `${years}歲${m ? m + "個月" : ""}`;
}
function stageOf(ageMonths){
  const y=Math.floor(ageMonths/12);
  if(y<30) return "🌱 弱冠之年";
  if(y<40) return "🔥 而立之年";
  if(y<50) return "🌊 不惑之年";
  if(y<60) return "🍂 知天命";
  if(y<70) return "🌙 耳順之年";
  if(y<80) return "☀ 古稀之年";
  if(y<90) return "🌌 杖朝之年";
  return "📖 期頤之年";
}
function uid(){ return `HP-AUTO-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${Math.random().toString(36).slice(2,6).toUpperCase()}`; }
function money(n){ return `${n<0?'-':''}$${Math.abs(n).toLocaleString()}`; }
function clampWealthCash(cash){ return Math.floor(cash / 1000); }

function createPlayer(name, animal, target){
  const maxKey = target.wealth === target.happiness && target.happiness === target.reputation ? "balance" : Object.entries(target).sort((a,b)=>b[1]-a[1])[0][0];
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36), name, animal,
    cash: STARTING_CASH, salary: 1000, happiness: 0, reputation: 0, ageMonths: START_AGE_MONTHS,
    target, trait: maxKey, outerPos: 0, career: null, careerPos: 0, titles: [], equippedTitleId: null,
    careerCounts: Object.fromEntries(careers.map(c=>[c,0])), chanceCards: [], experienceCards: [], retired: false, bankrupt: false,
    lifeLog: [{ageMonths: START_AGE_MONTHS, title: "踏上人生道路", desc: `帶著${money(STARTING_CASH)}，開始追尋自己的幸福。`, type:"start", important:true}],
  };
}

function applyEffect(player, effect){
  const p={...player};
  if(effect.cash) p.cash += Math.round(effect.cash / 2); // V2.7 財富取得與支出影響減半，降低財富膨脹
  if(effect.happiness) p.happiness += effect.happiness;
  if(effect.reputation) p.reputation += effect.reputation;
  if(effect.salaryRaise) p.salary += effect.salaryRaise;
  if(p.cash <= 0){
    p.bankrupt = true;
    p.lifeLog = [...p.lifeLog, {ageMonths:p.ageMonths, title:"宣告破產", desc:"金錢歸零，人生進入低谷。", type:"bankrupt", important:true}];
  }
  return p;
}

function eventByTrait(list, trait){
  const weighted=[];
  for(const e of list){
    let w=1;
    if(e.rare){
      if(trait === "wealth" && (e.cash||0)>0) w=3;
      if(trait === "happiness" && (e.happiness||0)>0) w=3;
      if(trait === "reputation" && (e.reputation||0)>0) w=3;
      if(trait === "balance") w=2;
    }
    for(let i=0;i<w;i++) weighted.push(e);
  }
  return weighted[Math.floor(Math.random()*weighted.length)];
}

function App(){
  const [screen,setScreen]=useState("setup");
  const [playerCount,setPlayerCount]=useState(1);
  const [setupPlayers,setSetupPlayers]=useState([{name:"阿牛", animal:"🐸", target:{wealth:34,happiness:33,reputation:33}}]);
  const [players,setPlayers]=useState([]);
  const [turn,setTurn]=useState(0);
  const [logs,setLogs]=useState([`歡迎來到《幸福人 Classic》${VERSION}`]);
  const [modal,setModal]=useState(null);
  const [dice,setDice]=useState(null);
  const [moving,setMoving]=useState(false);
  const [gameOver,setGameOver]=useState(false);
  const [autobiography,setAutobiography]=useState("");

  const current=players[turn];
  const boardTile = current ? outerBoard[current.outerPos] : null;
  const wealthScore = current ? clampWealthCash(current.cash) : 0;

  useEffect(()=>{
    setSetupPlayers(prev=>Array.from({length:playerCount},(_,i)=>prev[i]||{name:`玩家${i+1}`, animal:animals[i%animals.length], target:{wealth:34,happiness:33,reputation:33}}));
  },[playerCount]);

  function addLog(msg){ setLogs(prev=>[msg,...prev].slice(0,80)); }
  function updateCurrent(fn){ setPlayers(prev=>prev.map((p,i)=>i===turn?fn(p):p)); }

  function targetSum(t){ return Number(t.wealth||0)+Number(t.happiness||0)+Number(t.reputation||0); }
  function canStart(){ return setupPlayers.every(p=>p.name.trim() && targetSum(p.target)===TARGET_TOTAL); }

  function startGame(){
    if(!canStart()){ setModal({title:"幸福目標尚未完成", desc:"每位玩家的財富、快樂、名譽目標總和必須剛好等於100。"}); return; }
    setPlayers(setupPlayers.map(p=>createPlayer(p.name.trim(), p.animal, p.target)));
    setScreen("game");
  }

  async function rollDice(){
    if(moving || gameOver) return;
    const p=current;
    const count = p.career ? 1 : 2;
    const result = Array.from({length:count},()=>1+Math.floor(Math.random()*6));
    const total = result.reduce((a,b)=>a+b,0);
    setDice({result,total,count});
    addLog(`${p.animal} ${displayName(p)} 擲出 ${result.join("+")} = ${total}`);
    await moveSteps(total);
  }

  function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
  async function moveSteps(steps){
    setMoving(true);
    for(let s=0;s<steps;s++){
      setPlayers(prev=>prev.map((p,i)=>{
        if(i!==turn) return p;
        let np={...p, ageMonths:p.ageMonths+1};
        if(np.career){
          const len=careerBoards[np.career].length;
          np.careerPos=(np.careerPos+1)%len;
        }else{
          const old=np.outerPos;
          np.outerPos=(np.outerPos+1)%outerBoard.length;
          if(np.outerPos < old || np.outerPos===0){
            np.cash += np.salary;
            np.lifeLog=[...np.lifeLog,{ageMonths:np.ageMonths,title:"經過發薪日",desc:`領取薪水${money(np.salary)}。`,type:"payday",important:false}];
          }
        }
        return np;
      }));
      await wait(220);
    }
    setMoving(false);
    setTimeout(()=>resolveLanding(),50);
  }

  function resolveLanding(){
    const p=players[turn];
    if(!p) return;
    if(p.ageMonths >= MAX_AGE_MONTHS){ endByAge(p); return; }
    if(p.career){
      const tile=careerBoards[p.career][p.careerPos];
      if(tile.type==="careerExit") return completeCareer(p.career);
      const ev=eventByTrait(careerEvents[p.career] || [], p.trait);
      applyEvent(ev, p.career);
      return;
    }
    const tile=outerBoard[p.outerPos];
    if(tile.type==="family") return applyEvent(eventByTrait(familyEvents, p.trait), "家庭");
    if(tile.type==="chance") return applyEvent(eventByTrait(chanceEvents, p.trait), "機會");
    if(tile.type==="careerEntry"){
      const hasExp=(p.careerCounts[tile.career]||0)>0;
      const fee=hasExp?0:tile.fee;
      setModal({
        title:`${tile.icon} ${tile.career}道路入口`,
        desc:`入門費：${fee===0?'已有經驗，免入門費':money(fee)}\n資格：${tile.requirement}`,
        actions:[
          {label:"進入職業道路", onClick:()=>enterCareer(tile.career, fee)},
          {label:"略過", onClick:()=>{setModal(null); nextTurn();}}
        ]
      });
      return;
    }
    setModal({title:`抵達 ${tile.name}`, desc:"這一天沒有特別事件，但人生仍向前走了一個月。", actions:[{label:"確認", onClick:()=>{setModal(null); nextTurn();}}]});
  }

  function applyEvent(ev, source){
    updateCurrent(p=>{
      let np=applyEffect(p, ev);
      const age=np.ageMonths;
      const logItem={ageMonths:age,title:ev.title,desc:ev.desc,type:source,important:!!ev.important || !!ev.rare};
      np.lifeLog=[...np.lifeLog, logItem];
      return np;
    });
    setModal({
      title:`${source}｜${ev.title}`,
      desc:`${ev.desc}\n\n${effectText(ev)}`,
      actions:[{label:"確認", onClick:()=>{setModal(null); checkOrNext();}}]
    });
  }

  function effectText(ev){
    const arr=[];
    if(ev.cash) arr.push(`金錢變化：${money(Math.round(ev.cash/2))}（V2.7財富影響減半）`);
    if(ev.happiness) arr.push(`快樂 ${ev.happiness>0?'+':''}${ev.happiness}`);
    if(ev.reputation) arr.push(`名譽 ${ev.reputation>0?'+':''}${ev.reputation}`);
    return arr.length?arr.join("｜"):"沒有直接數值變化。";
  }

  function enterCareer(career, fee){
    let allowed=true, reason="";
    const p=current;
    if(career==="月球探險" && Object.values(p.careerCounts).reduce((a,b)=>a+b,0)<=0){ allowed=false; reason="月球探險需要至少一項職業經驗。"; }
    if(career==="從政" && p.reputation < -5){ allowed=false; reason="名譽過低，目前不適合從政。"; }
    if(p.cash - fee <= 0){ allowed=false; reason="現金不足，支付後將破產。"; }
    if(!allowed){ setModal({title:"無法進入", desc:reason, actions:[{label:"確認", onClick:()=>{setModal(null); nextTurn();}}]}); return; }
    updateCurrent(p=>({...applyEffect(p,{cash:-fee}), career, careerPos:0, lifeLog:[...p.lifeLog,{ageMonths:p.ageMonths,title:`進入${career}道路`,desc:`選擇投入${career}人生道路。`,type:"career",important:true}]}));
    addLog(`${displayName(p)} 進入 ${career} 道路`);
    setModal(null);
  }

  function completeCareer(career){
    const p=current;
    const nextCount=(p.careerCounts[career]||0)+1;
    const tier=Math.min(nextCount,3);
    const choices=(achievementPools[career]||[]).filter(a=>a.tier===tier);
    setModal({
      title:`完成${career}道路`,
      desc:`這是你第 ${nextCount} 次完成${career}道路。請選擇一項人生成就。\n（選擇前不顯示稀有度，選完後才揭曉。）`,
      custom: <div className="achievementChoices">{choices.map((a,idx)=><button key={idx} onClick={()=>chooseAchievement(career,a,nextCount)}><b>{a.title}</b><span>{a.desc}</span></button>)}</div>
    });
  }

  function chooseAchievement(career,a,nextCount){
    const title={...a,id:Math.random().toString(36).slice(2),career};
    updateCurrent(p=>{
      let np={...p};
      np.careerCounts={...np.careerCounts,[career]:nextCount};
      np.titles=[...np.titles,title];
      np.equippedTitleId=title.id;
      np.career=null; np.careerPos=0;
      np=applyEffect(np,{salaryRaise:a.salaryRaise,reputation:a.rep||0,happiness:a.happy||0});
      np.lifeLog=[...np.lifeLog,{ageMonths:np.ageMonths,title:`獲得頭銜：${a.title}`,desc:`${a.desc}${a.salaryRaise?` 並加薪 ${a.salaryRaise}。`:""}`,type:"title",important:true}];
      return np;
    });
    setModal({title:`獲得頭銜：${a.title}`, desc:`${a.desc}\n\n階級：${a.tier===1?'初階':a.tier===2?'二階':'傳奇'}\n${a.salaryRaise?`加薪 ${a.salaryRaise}`:""}\n${a.effects?.length?`效果：${a.effects.join('、')}`:""}`, actions:[{label:"確認", onClick:()=>{setModal(null); checkOrNext();}}]});
  }

  function checkWin(p){
    const wealth=clampWealthCash(p.cash);
    return wealth >= p.target.wealth && p.happiness >= p.target.happiness && p.reputation >= p.target.reputation;
  }
  function checkOrNext(){
    const p=players[turn];
    if(p && checkWin(p)){ endGame(p,"達成幸福目標"); return; }
    if(p && p.ageMonths>=MAX_AGE_MONTHS){ endByAge(p); return; }
    nextTurn();
  }
  function nextTurn(){ setTurn(t=>(t+1)%players.length); }
  function endByAge(p){ endGame(p,"走到生命盡頭"); }
  function endGame(p, reason){ setGameOver(true); const text=generateAutobiography(p, reason); setAutobiography(text); setModal({title:`${p.animal} ${displayName(p)}｜人生結算`, desc:`${reason}。可以產出人生自傳。`, actions:[{label:"查看人生自傳", onClick:()=>setScreen("autobiography")}]}); }

  function displayName(p){
    const t=p.titles.find(x=>x.id===p.equippedTitleId);
    if(!t) return p.name;
    if(t.prefix) return `${t.prefix}${p.name}`;
    if(t.suffix) return `${p.name}${t.suffix}`;
    return `${t.title}${p.name}`;
  }

  function generateAutobiography(p, reason){
    const id=uid();
    const grouped={};
    for(const item of p.lifeLog.filter(x=>x.important)){
      const st=stageOf(item.ageMonths);
      grouped[st]=grouped[st]||[];
      grouped[st].push(item);
    }
    const finalWealth=clampWealthCash(p.cash);
    const tendency=p.trait==="wealth"?"財富導向":p.trait==="happiness"?"快樂導向":p.trait==="reputation"?"名譽導向":"平衡導向";
    const lines=[];
    lines.push(`《${displayName(p)}的一生》`);
    lines.push(`人生自傳編號：${id}`);
    lines.push(`生成版本：幸福人 Classic ${VERSION}`);
    lines.push(`生成時間：${new Date().toLocaleString()}`);
    lines.push("");
    lines.push(`18歲時，${p.name}帶著${money(STARTING_CASH)}踏上人生道路。那時的幸福目標是：財富${p.target.wealth}、快樂${p.target.happiness}、名譽${p.target.reputation}，呈現出「${tendency}」的人生特質。`);
    lines.push("");
    const order=["🌱 弱冠之年","🔥 而立之年","🌊 不惑之年","🍂 知天命","🌙 耳順之年","☀ 古稀之年","🌌 杖朝之年","📖 期頤之年"];
    for(const st of order){
      if(!grouped[st]) continue;
      lines.push(`【${st}】`);
      grouped[st].slice(0,8).forEach(e=>lines.push(`${ageText(e.ageMonths)}，${e.title}。${e.desc}`));
      lines.push("");
    }
    lines.push(`最終人生：財富${finalWealth}、快樂${p.happiness}、名譽${p.reputation}。`);
    lines.push(`結局：${reason}。`);
    lines.push("");
    lines.push("本自傳由《幸福人 Classic》人生自傳系統生成。敘事模板、事件文本、系統設計與遊戲內容為原創智慧財產；未經授權不得重製、改作或商業使用。");
    return lines.join("\n");
  }

  function downloadTxt(){
    const blob=new Blob([autobiography],{type:"text/plain;charset=utf-8"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob); a.download=`幸福人_人生自傳_${Date.now()}.txt`; a.click(); URL.revokeObjectURL(a.href);
  }

  function titleInfo(t){
    setModal({title:`頭銜資訊｜${t.title}`, desc:`${t.desc}\n\n階級：${t.tier===1?'初階':t.tier===2?'二階':'傳奇'}\n來源：${t.career}\n${t.salaryRaise?`加薪 ${t.salaryRaise}`:""}\n${t.effects?.length?`效果：${t.effects.join('、')}`:""}\n${t.risks?.length?`風險：${t.risks.join('、')}`:"風險：無明顯風險"}`});
  }

  if(screen==="setup") return <div className="app setup"><h1>幸福人 Classic <span>{VERSION}</span></h1><div className="setupPanel"><label>玩家人數 <select value={playerCount} onChange={e=>setPlayerCount(Number(e.target.value))}>{[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></label>{setupPlayers.map((p,i)=>{const sum=targetSum(p.target); return <div className="setupCard" key={i}><div className="row"><input value={p.name} onChange={e=>setSetupPlayers(arr=>arr.map((x,j)=>j===i?{...x,name:e.target.value}:x))}/><select value={p.animal} onChange={e=>setSetupPlayers(arr=>arr.map((x,j)=>j===i?{...x,animal:e.target.value}:x))}>{animals.map(a=><option key={a}>{a}</option>)}</select></div><div className="targetGrid">{[["wealth","財富"],["happiness","快樂"],["reputation","名譽"]].map(([k,label])=><label key={k}>{label}<input type="number" value={p.target[k]} onChange={e=>setSetupPlayers(arr=>arr.map((x,j)=>j===i?{...x,target:{...x.target,[k]:Number(e.target.value)}}:x))}/></label>)}</div><div className={sum===100?"ok hint":"bad hint"}>目標總和：{sum}／100　{sum<100?`尚缺 ${100-sum}`:sum>100?`超出 ${sum-100}`:"可以開始"}</div></div>})}<button className="primary" onClick={startGame}>開始人生</button></div>{modal&&<Modal modal={modal} close={()=>setModal(null)}/>}</div>;

  if(screen==="autobiography") return <div className="app"><h1>人生自傳</h1><pre className="autobio">{autobiography}</pre><div className="row"><button className="primary" onClick={downloadTxt}>下載人生自傳 .txt</button><button onClick={()=>setScreen("game")}>返回遊戲</button></div></div>;

  return <div className="app"><header><h1>幸福人 Classic <span>{VERSION}</span></h1><div className="topLog"><b>Recent Log</b>{logs.slice(0,3).map((l,i)=><p key={i}>{l}</p>)}</div></header><main className="gameLayout"><section className="boardWrap"><div className="outerBoard">{outerBoard.map((tile,i)=><div key={tile.id} className={`tile pos${i} ${boardTile?.id===tile.id?'active':''}`}><span>{i}</span><b>{tile.icon}</b><small>{tile.name}</small><div className="tokens">{players.filter(p=>!p.career&&p.outerPos===i).map(p=><em key={p.id}>{p.animal}</em>)}</div></div>)}<div className="centerStage"><div className="turnBox"><h2>{current?.animal} {current&&displayName(current)}</h2><p>{current&&ageText(current.ageMonths)}｜{current&&stageOf(current.ageMonths)}</p><div className="dice">{dice?dice.total:"🎲"}</div><button className="primary" disabled={moving||gameOver} onClick={rollDice}>{moving?"移動中":"擲骰"}</button><p>{current?.career?`目前在${current.career}內圈，使用單骰。`:"外圈人生道路，使用雙骰。"}</p></div><div className="wallet"><h3>人生皮夾</h3><p>現金：{current&&money(current.cash)}</p><p>薪水：{current&&money(current.salary)}</p><p>財富：{wealthScore}｜快樂：{current?.happiness}｜名譽：{current?.reputation}</p><p>目標：{current?.target.wealth}/{current?.target.happiness}/{current?.target.reputation}</p><h4>頭銜</h4><div className="titles">{current?.titles.length?current.titles.map(t=><button key={t.id} className={t.id===current.equippedTitleId?'equipped':''} onClick={()=>titleInfo(t)}>{t.title}</button>):<span>尚無頭銜</span>}</div></div></div></div></section><aside className="players">{players.map((p,i)=><div key={p.id} className={`playerCard ${i===turn?'current':''}`}><b>{p.animal} {displayName(p)}</b><p>{ageText(p.ageMonths)}</p><p>現金 {money(p.cash)}｜快樂 {p.happiness}｜名譽 {p.reputation}</p><p>{p.career?`正在${p.career}`:`外圈 ${p.outerPos}`}</p></div>)}</aside></main>{modal&&<Modal modal={modal} close={()=>setModal(null)}/>}</div>;
}

function Modal({modal,close}){ return <div className="modalBackdrop"><div className="modal"><h2>{modal.title}</h2>{modal.desc&&<p className="modalDesc">{modal.desc}</p>}{modal.custom}{modal.actions?<div className="modalActions">{modal.actions.map((a,i)=><button key={i} className={i===0?'primary':''} onClick={a.onClick}>{a.label}</button>)}</div>:<button className="primary" onClick={close}>確認</button>}</div></div> }

createRoot(document.getElementById("root")).render(<App />);
