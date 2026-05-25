
import React, { useEffect, useRef, useState } from "react";
import { Briefcase, Coins, Heart, Trophy, RotateCcw, Dice5, WalletCards, GraduationCap } from "lucide-react";

const animals = ["🐱","🐶","🦊","🐼","🐧","🐸","🦁","🐰","🐵","🐯","🐨","🐻"];

const outerBoard = [
  { id:0, type:"start", name:"起點／發薪日" },
  { id:1, type:"normal", name:"一般" },
  { id:2, type:"chance", name:"機會" },
  { id:3, type:"careerEntry", name:"學院入口", career:"學院", fee:1000 },
  { id:4, type:"normal", name:"一般" },
  { id:5, type:"money", name:"工作" },
  { id:6, type:"chance", name:"機會" },
  { id:7, type:"careerEntry", name:"企業入口", career:"企業", fee:2000 },
  { id:8, type:"social", name:"社交" },
  { id:9, type:"money", name:"投資" },
  { id:10, type:"chance", name:"機會" },
  { id:11, type:"careerEntry", name:"農墾入口", career:"農墾", fee:1000 },
  { id:12, type:"family", name:"家庭" },
  { id:13, type:"careerEntry", name:"政治入口", career:"政治", fee:3000 },
  { id:14, type:"chance", name:"機會" },
  { id:15, type:"rest", name:"休閒" },
  { id:16, type:"normal", name:"一般" },
  { id:17, type:"study", name:"進修" },
  { id:18, type:"chance", name:"機會" },
  { id:19, type:"careerEntry", name:"航海入口", career:"航海", fee:2000 },
  { id:20, type:"business", name:"創業" },
  { id:21, type:"careerEntry", name:"電影明星入口", career:"電影明星", fee:3000 },
  { id:22, type:"chance", name:"機會" },
  { id:23, type:"health", name:"健康" },
  { id:24, type:"normal", name:"一般" },
  { id:25, type:"careerEntry", name:"開礦入口", career:"開礦", fee:2000 },
  { id:26, type:"chance", name:"機會" },
  { id:27, type:"careerEntry", name:"月球探險入口", career:"月球探險", fee:4000 },
  { id:28, type:"normal", name:"一般" },
  { id:29, type:"house", name:"買房" },
  { id:30, type:"chance", name:"機會" },
  { id:31, type:"charity", name:"公益" },
];

const careerRoutes = {
  "學院": [
    { name:"入學", money:-1000, happy:1, fame:1 },
    { name:"努力讀書", money:0, happy:-1, fame:2 },
    { name:"完成大學教育", money:0, happy:2, fame:3, graduate:true },
  ],
  "企業": [
    { name:"基層職員", money:1000, happy:-1, fame:1 },
    { name:"升任主管", money:2000, happy:-1, fame:2 },
    { name:"企業成功", money:4000, happy:1, fame:3 },
  ],
  "農墾": [
    { name:"開墾土地", money:-1000, happy:2, fame:1 },
    { name:"豐收", money:3000, happy:2, fame:1 },
    { name:"模範農家", money:2000, happy:3, fame:3 },
  ],
  "航海": [
    { name:"出航", money:1000, happy:1, fame:1 },
    { name:"遠洋貿易", money:3000, happy:-1, fame:2 },
    { name:"船長名聲", money:3000, happy:1, fame:4 },
  ],
  "電影明星": [
    { name:"試鏡", money:-1000, happy:1, fame:1 },
    { name:"走紅", money:3000, happy:2, fame:4 },
    { name:"巨星片約", money:5000, happy:-1, fame:5 },
  ],
  "政治": [
    { name:"地方服務", money:-1000, happy:1, fame:3 },
    { name:"選舉成功", money:-2000, happy:2, fame:5 },
    { name:"政壇要職", money:3000, happy:-1, fame:6 },
  ],
  "開礦": [
    { name:"探勘", money:-1000, happy:-1, fame:1 },
    { name:"發現礦脈", money:5000, happy:1, fame:3 },
    { name:"礦業大亨", money:6000, happy:0, fame:4 },
  ],
  "月球探險": [
    { name:"受訓", money:-2000, happy:1, fame:2 },
    { name:"登月任務", money:2000, happy:2, fame:6 },
    { name:"太空英雄", money:5000, happy:3, fame:8 },
  ],
};

const chanceDeck = [
  { title:"保送大學", text:"可移動到學院入口。若已有學院經驗，可免入門費。", targetCareer:"學院", sell:1000 },
  { title:"企業徵才", text:"可移動到企業入口。若已有企業經驗，可免入門費。", targetCareer:"企業", sell:1000 },
  { title:"地方人士賞識", text:"可移動到政治入口。若已有政治經驗，可免入門費。", targetCareer:"政治", sell:1500 },
  { title:"遠洋工作機會", text:"可移動到航海入口。若已有航海經驗，可免入門費。", targetCareer:"航海", sell:1000 },
  { title:"片商邀約", text:"可移動到電影明星入口。若已有電影明星經驗，可免入門費。", targetCareer:"電影明星", sell:1500 },
  { title:"礦區開發權", text:"可移動到開礦入口。若已有開礦經驗，可免入門費。", targetCareer:"開礦", sell:1000 },
  { title:"太空計畫招募", text:"可移動到月球探險入口。若已有月球探險經驗，可免入門費。", targetCareer:"月球探險", sell:2000 },
  { title:"意外獎金", text:"立刻獲得 $3,000。", money:3000, instant:true },
  { title:"稅金補繳", text:"立刻支付 $2,000。", money:-2000, instant:true },
  { title:"社區表揚", text:"名譽 +3。", fame:3, instant:true },
  { title:"家庭旅遊", text:"快樂 +4，現金 -$1,000。", happy:4, money:-1000, instant:true },
];

const expDeck = [
  { title:"穩健前進", text:"取代骰子，前進 1 步。", steps:1 },
  { title:"把握機會", text:"取代骰子，前進 2 步。", steps:2 },
  { title:"關鍵一步", text:"取代骰子，前進 3 步。", steps:3 },
  { title:"經驗判斷", text:"取代骰子，前進 4 步。", steps:4 },
  { title:"人生老手", text:"取代骰子，前進 5 步。", steps:5 },
  { title:"直覺選擇", text:"取代骰子，前進 6 步。", steps:6 },
];

const eventEffects = {
  normal: { text:"平凡的一天，沒有特別事件。", money:0, happy:0, fame:0 },
  money: { text:"工作收入進帳。", money:1000, happy:-1, fame:1 },
  social: { text:"與朋友聚會，心情變好。", money:-1000, happy:3, fame:1 },
  family: { text:"家庭支出增加，但幸福感提升。", money:-1000, happy:3, fame:0 },
  rest: { text:"充分休息，快樂提升。", money:0, happy:2, fame:0 },
  study: { text:"進修學習，名譽提升。", money:-1000, happy:0, fame:2 },
  business: { text:"創業小有成果。", money:3000, happy:-1, fame:2 },
  health: { text:"健康檢查與休養。", money:-1000, happy:1, fame:0 },
  house: { text:"購屋支出，但財富基礎增加。", money:-3000, happy:1, fame:1 },
  charity: { text:"參與公益服務。", money:-1000, happy:2, fame:3 },
};

function makePlayer(name, animal, target) {
  return {
    id: crypto.randomUUID(),
    name,
    animal,
    pos: 0,
    route: null,
    routeIndex: 0,
    cash: 1000,
    salary: 1000,
    happy: 0,
    fame: 0,
    target,
    careerExp: {},
    education: [],
    retireRights: 0,
    pocket: { chance: [], exp: [] },
    history: ["起步：取得本錢 $1,000"],
    bankruptcies: 0,
  };
}

function wealthScore(p) {
  return Math.floor(Math.max(0, p.cash) / 1000);
}
function isWinner(p) {
  return wealthScore(p) >= p.target.wealth && p.happy >= p.target.happy && p.fame >= p.target.fame;
}
function clamp(n) { return Math.max(0, n); }
function applyEffect(player, effect, note="") {
  const p = { ...player, pocket:{chance:[...player.pocket.chance], exp:[...player.pocket.exp]}, careerExp:{...player.careerExp}, education:[...player.education], history:[...player.history] };
  const money = effect.money || 0;
  p.cash += money;
  p.happy = clamp(p.happy + (effect.happy || 0));
  p.fame = clamp(p.fame + (effect.fame || 0));
  if (note || money || effect.happy || effect.fame) {
    p.history.unshift(`${note}${money ? ` 現金${money>0?"+":""}$${money.toLocaleString()}`:""}${effect.happy ? ` 快樂${effect.happy>0?"+":""}${effect.happy}`:""}${effect.fame ? ` 名譽${effect.fame>0?"+":""}${effect.fame}`:""}`);
  }
  return p;
}
function dice(n=1) {
  return Array.from({length:n},()=>Math.ceil(Math.random()*6));
}
function sleep(ms){ return new Promise(resolve=>setTimeout(resolve, ms)); }


function Board({players}) {
  const posMap = {};
  players.forEach(p => {
    if (!p.route) (posMap[p.pos] ||= []).push(p);
  });

  // 10x8 shell uses 32 cells around the edge
  const coords = [];
  for(let c=0;c<10;c++) coords.push([0,c]);
  for(let r=1;r<7;r++) coords.push([r,9]);
  for(let c=9;c>=0;c--) coords.push([7,c]);
  for(let r=6;r>=1;r--) coords.push([r,0]);
  const byCoord = new Map(coords.map((xy,i)=>[xy.join(","), outerBoard[i]]));

  return <div className="board-shell">
    {Array.from({length:8}).map((_,r)=>Array.from({length:10}).map((_,c)=>{
      const cell = byCoord.get(`${r},${c}`);
      if(!cell) {
        if(r===2 && c===2) return <div key={`${r}-${c}`} className="center-panel" style={{gridColumn:"3 / span 6", gridRow:"3 / span 4"}}>
          <div className="center-title">八大職業道路</div>
          <div className="career-grid">
            {Object.keys(careerRoutes).map(k=><div className="career-chip" key={k}><Briefcase size={14}/>{k}</div>)}
          </div>
          <div className="center-note">外圈擲 2 顆骰子｜職業道路擲 1 顆骰子｜經過起點自動發薪</div>
        </div>;
        if(r>=2 && r<=5 && c>=2 && c<=7) return null;
        return <div key={`${r}-${c}`} className="empty"></div>
      }
      return <div key={`${r}-${c}`} className={`board-cell ${cell.type}`}>
        <div className="cell-num">{cell.id}</div>
        <div className="cell-name">{cell.name}</div>
        <div className="tokens">{(posMap[cell.id]||[]).map(p=><span key={p.id} title={p.name}>{p.animal}</span>)}</div>
        <div className="arrow">{cell.id < 9 ? "→" : cell.id < 16 ? "↓" : cell.id < 25 ? "←" : cell.id < 31 ? "↑" : "↗"}</div>
      </div>
    }))}
  </div>
}

function Setup({onStart}) {
  const [count,setCount]=useState(2);
  const [players,setPlayers]=useState([{name:"阿牛",animal:"🐸",wealth:20,happy:20,fame:20}]);
  function adjustCount(n){
    setCount(n);
    setPlayers(prev=>Array.from({length:n},(_,i)=>prev[i] || {name:`玩家${i+1}`,animal:animals[i],wealth:20,happy:20,fame:20}));
  }
  function update(i,patch){ setPlayers(prev=>prev.map((p,idx)=>idx===i?{...p,...patch}:p));}
  function fixTarget(i, field, value){
    value=Math.max(0, Math.min(60, Number(value)||0));
    const p=players[i];
    const others = ["wealth","happy","fame"].filter(f=>f!==field);
    let remain=60-value;
    let first=Math.min(remain, p[others[0]]);
    let second=remain-first;
    update(i,{[field]:value,[others[0]]:first,[others[1]]:second});
  }
  return <div className="setup page">
    <h1>幸福人 Classic V1.1</h1>
    <p className="muted">原版規則校正版：回字型棋盤、發薪日、玩家口袋、機會卡與經驗卡。</p>
    <label>玩家人數：
      <select value={count} onChange={e=>adjustCount(Number(e.target.value))}>
        {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} 人</option>)}
      </select>
    </label>
    <div className="setup-list">
      {players.map((p,i)=><div className="setup-card" key={i}>
        <h3>玩家 {i+1}</h3>
        <input value={p.name} onChange={e=>update(i,{name:e.target.value})} />
        <div className="animal-list">{animals.map(a=><button className={p.animal===a?"selected":""} onClick={()=>update(i,{animal:a})} key={a}>{a}</button>)}</div>
        <div className="target-box">
          <strong>秘密幸福目標：財富＋快樂＋名譽＝60</strong>
          <label>財富 <input type="number" value={p.wealth} onChange={e=>fixTarget(i,"wealth",e.target.value)} /></label>
          <label>快樂 <input type="number" value={p.happy} onChange={e=>fixTarget(i,"happy",e.target.value)} /></label>
          <label>名譽 <input type="number" value={p.fame} onChange={e=>fixTarget(i,"fame",e.target.value)} /></label>
          <div className="sum">合計：{p.wealth+p.happy+p.fame}</div>
        </div>
      </div>)}
    </div>
    <button className="primary" onClick={()=>onStart(players.map(p=>makePlayer(p.name||"玩家",p.animal,{wealth:p.wealth,happy:p.happy,fame:p.fame})))}>鎖定目標並開始遊戲</button>
  </div>
}

function PlayerPanel({p,active}) {
  return <div className={`player-panel ${active?"active":""}`}>
    <div className="player-title"><span className="avatar">{p.animal}</span><b>{p.name}</b>{p.route && <em>職業道路：{p.route}</em>}</div>
    <div className="stats">
      <span><Coins size={15}/>現金 ${p.cash.toLocaleString()}</span>
      <span>財富 {wealthScore(p)}</span>
      <span><Heart size={15}/>快樂 {p.happy}</span>
      <span><Trophy size={15}/>名譽 {p.fame}</span>
    </div>
    <div className="small">薪水 ${p.salary.toLocaleString()}｜機會卡 {p.pocket.chance.length}｜經驗卡 {p.pocket.exp.length}｜退休權 {p.retireRights}</div>
    <div className="small">職業：{Object.entries(p.careerExp).map(([k,v])=>`${k}×${v}`).join("、") || "尚無"}</div>
  </div>
}

export default function App(){
  const [phase,setPhase]=useState("setup");
  const [players,setPlayers]=useState([]);
  const [turn,setTurn]=useState(0);
  const [message,setMessage]=useState("");
  const [winner,setWinner]=useState(null);
  const [lastDice,setLastDice]=useState([]);
  const [moving,setMoving]=useState(false);
  const [bgmOn,setBgmOn]=useState(false);
  const audioRef = useRef(null);

  useEffect(()=>{
    try {
      const saved = localStorage.getItem("happyPersonClassicSaveV12");
      if(saved){
        const data = JSON.parse(saved);
        if(data && data.phase && data.players){
          setPhase(data.phase);
          setPlayers(data.players);
          setTurn(data.turn || 0);
          setMessage(data.message || "已自動恢復上一局遊戲。若要重新開始，請按右上角重開。");
          setWinner(data.winner || null);
          setLastDice(data.lastDice || []);
        }
      }
    } catch (e) { console.warn("讀取存檔失敗", e); }
  },[]);

  useEffect(()=>{
    if(phase !== "setup"){
      localStorage.setItem("happyPersonClassicSaveV12", JSON.stringify({phase,players,turn,message,winner,lastDice}));
    }
  },[phase,players,turn,message,winner,lastDice]);

  useEffect(()=>{
    document.body.classList.add("no-pull-refresh");
    return ()=>document.body.classList.remove("no-pull-refresh");
  },[]);

  const current = players[turn];

  async function toggleBgm(){
    const audio = audioRef.current;
    if(!audio) return;
    try {
      audio.volume = 0.35;
      if(audio.paused){
        await audio.play();
        setBgmOn(true);
      } else {
        audio.pause();
        setBgmOn(false);
      }
    } catch (e) {
      setMessage("背景音樂無法播放：請確認 bgm.wav 已放在 public 資料夾，並再按一次音樂按鈕。");
    }
  }

  function resetGame(){
    if(confirm("確定要重開遊戲嗎？目前進度會清除。")){
      localStorage.removeItem("happyPersonClassicSaveV12");
      setPhase("setup"); setPlayers([]); setTurn(0); setMessage(""); setWinner(null); setLastDice([]); setMoving(false);
    }
  }

  function updateCurrent(newP){
    setPlayers(prev=>prev.map((p,i)=>i===turn?newP:p));
    if(isWinner(newP)) {
      setWinner(newP);
      setPhase("end");
    }
  }
  function nextTurn(){
    if(moving) return;
    setTurn(t=>(t+1)%players.length);
    setMessage("");
    setLastDice([]);
  }

  async function moveSteps(steps){
    if(moving || !current) return;
    setMoving(true);
    let p = {...current, pocket:{chance:[...current.pocket.chance], exp:[...current.pocket.exp]}, careerExp:{...current.careerExp}, education:[...current.education], history:[...current.history]};

    if(p.route){
      const route = careerRoutes[p.route];
      const maxIndex = route.length - 1;
      const actualSteps = Math.min(steps, maxIndex - p.routeIndex);
      for(let s=0; s<actualSteps; s++){
        p.routeIndex += 1;
        const preview = {...p, pocket:{chance:[...p.pocket.chance], exp:[...p.pocket.exp]}, careerExp:{...p.careerExp}, education:[...p.education], history:[...p.history]};
        setPlayers(prev=>prev.map((pl,i)=>i===turn?preview:pl));
        setMessage(`${p.name} 在「${p.route}」職業道路前進中：第 ${p.routeIndex + 1} 格／${route.length} 格`);
        await sleep(360);
      }
      for(let i=current.routeIndex+1;i<=p.routeIndex;i++){
        p = applyEffect(p, route[i], `職業道路「${p.route}」：${route[i].name}`);
      }
      if(p.routeIndex >= maxIndex){
        const c = p.route;
        p.careerExp[c] = (p.careerExp[c]||0)+1;
        if(c==="學院"){
          p.salary += 2000;
          if(!p.education.includes("大學學位")) p.education.push("大學學位");
          p.history.unshift("完成大學教育：加薪 $2,000，取得大學學位。");
        } else {
          const card = expDeck[Math.floor(Math.random()*expDeck.length)];
          p.pocket.exp.push(card);
          p.history.unshift(`完成${c}職業道路：取得經驗卡「${card.title}」。`);
        }
        if(p.careerExp[c] >= 3){
          p.retireRights += 1;
          p.history.unshift(`完成${c}三次以上：取得退休權一次。`);
        }
        p.route = null; p.routeIndex = 0;
      }
      setMessage(`${p.name} 在職業道路前進 ${steps} 步。`);
      setMoving(false);
      updateCurrent(p);
      return;
    }

    const oldPos = p.pos;
    let salaryCount = 0;
    for(let s=0; s<steps; s++){
      p.pos = (p.pos + 1) % outerBoard.length;
      if(p.pos === 0){
        salaryCount += 1;
        p.cash += p.salary;
        p.history.unshift(`經過起點／發薪日：領取薪水 $${p.salary.toLocaleString()}。`);
      }
      const preview = {...p, pocket:{chance:[...p.pocket.chance], exp:[...p.pocket.exp]}, careerExp:{...p.careerExp}, education:[...p.education], history:[...p.history]};
      setPlayers(prev=>prev.map((pl,i)=>i===turn?preview:pl));
      setMessage(`${p.name} 正在前進：${s+1}／${steps} 步`);
      await sleep(280);
    }

    const cell = outerBoard[p.pos];
    if(cell.type==="chance"){
      const card = chanceDeck[Math.floor(Math.random()*chanceDeck.length)];
      if(card.instant){
        p = applyEffect(p, card, `機會卡「${card.title}」：${card.text}`);
      } else {
        p.pocket.chance.push(card);
        p.history.unshift(`抽到機會卡「${card.title}」，已放入口袋。`);
      }
      setMessage(`${p.name} 抽到機會卡：${card.title}`);
    } else if(cell.type==="careerEntry") {
      setMessage(`${p.name} 抵達 ${cell.career} 入口，可選擇進入職業道路。`);
    } else if(eventEffects[cell.type]) {
      p = applyEffect(p, eventEffects[cell.type], `${cell.name}：${eventEffects[cell.type].text}`);
      setMessage(`${p.name} 抵達 ${cell.name}。${eventEffects[cell.type].text}`);
    } else {
      setMessage(`${p.name} 抵達 ${cell.name}。`);
    }
    setMoving(false);
    updateCurrent(p);
  }

  function roll(){
    if(moving) return;
    const n = current.route ? 1 : 2;
    const ds = dice(n);
    setLastDice(ds);
    moveSteps(ds.reduce((a,b)=>a+b,0));
  }

  function enterCareer(career, free=false){
    if(moving) return;
    let p={...current, pocket:{chance:[...current.pocket.chance], exp:[...current.pocket.exp]}, careerExp:{...current.careerExp}, education:[...current.education], history:[...current.history]};
    const cell = outerBoard[p.pos];
    const fee = cell.career===career ? cell.fee : 0;
    const hasExp = (p.careerExp[career]||0)>0;
    if(fee && !(free || hasExp)){
      if(p.cash < fee) { setMessage("現金不足，無法支付入門費。可考慮出售卡片或宣告破產。"); return; }
      p.cash -= fee;
      p.history.unshift(`支付${career}入門費 $${fee.toLocaleString()}。`);
    }
    p.route = career; p.routeIndex = 0;
    p = applyEffect(p, careerRoutes[career][0], `進入${career}道路：${careerRoutes[career][0].name}`);
    setMessage(`${p.name} 進入 ${career} 職業道路。`);
    updateCurrent(p);
  }

  function useChance(idx){
    if(moving) return;
    const card=current.pocket.chance[idx];
    let p={...current, pocket:{chance:[...current.pocket.chance], exp:[...current.pocket.exp]}, careerExp:{...current.careerExp}, education:[...current.education], history:[...current.history]};
    p.pocket.chance.splice(idx,1);
    if(card.targetCareer){
      const entry = outerBoard.find(c=>c.type==="careerEntry" && c.career===card.targetCareer);
      p.pos = entry.id;
      p.history.unshift(`使用機會卡「${card.title}」：移動至${card.targetCareer}入口。`);
      setPlayers(prev=>prev.map((pl,i)=>i===turn?p:pl));
      setMessage(`已移動到 ${card.targetCareer} 入口，可選擇進入職業道路。`);
    }
  }
  function sellChance(idx){
    if(moving) return;
    const card=current.pocket.chance[idx];
    let p={...current, pocket:{chance:[...current.pocket.chance], exp:[...current.pocket.exp]}, history:[...current.history]};
    p.pocket.chance.splice(idx,1);
    p.cash += card.sell || 1000;
    p.history.unshift(`出售機會卡「${card.title}」：+$${(card.sell||1000).toLocaleString()}。`);
    updateCurrent(p);
  }
  function useExp(idx){
    if(moving) return;
    const card=current.pocket.exp[idx];
    let p={...current, pocket:{chance:[...current.pocket.chance], exp:[...current.pocket.exp]}, history:[...current.history]};
    p.pocket.exp.splice(idx,1);
    setPlayers(prev=>prev.map((pl,i)=>i===turn?p:pl));
    setMessage(`使用經驗卡「${card.title}」，取代擲骰前進 ${card.steps} 步。`);
    setTimeout(()=>moveSteps(card.steps),0);
  }
  function bankrupt(){
    if(moving) return;
    let p = makePlayer(current.name,current.animal,current.target);
    p.bankruptcies = current.bankruptcies + 1;
    p.history.unshift(`宣告破產：繳回現金與卡片，重新領取本錢 $1,000。`);
    updateCurrent(p);
  }
  function retire(){
    if(moving) return;
    if(current.retireRights<=0){ setMessage("尚無退休權。"); return; }
    let p={...current, retireRights:current.retireRights-1, happy:current.happy+5, pos:15, route:null, history:[...current.history]};
    p.history.unshift("使用退休權：前往日月潭渡假，快樂 +5。");
    updateCurrent(p);
  }

  if(phase==="setup") return <Setup onStart={(ps)=>{localStorage.removeItem("happyPersonClassicSaveV12"); setPlayers(ps); setTurn(0); setMessage("遊戲開始。請輪流擲骰，最先達成秘密幸福目標者勝出。"); setPhase("game")}} />;
  if(phase==="end") return <div className="page end">
    <h1>🏆 幸福人產生！</h1>
    <h2>{winner.animal} {winner.name} 最先達成預定幸福目標</h2>
    <div className="reveal">
      <div>秘密目標：財富 {winner.target.wealth}｜快樂 {winner.target.happy}｜名譽 {winner.target.fame}</div>
      <div>最終結果：財富 {wealthScore(winner)}｜快樂 {winner.happy}｜名譽 {winner.fame}</div>
    </div>
    <h3>全體玩家揭曉</h3>
    {players.map(p=><PlayerPanel key={p.id} p={p} />)}
    <button className="primary" onClick={resetGame}><RotateCcw size={16}/>重新開始</button>
  </div>;

  const cell = outerBoard[current.pos];

  return <div className="game">
    <audio ref={audioRef} src="/bgm.wav" loop preload="auto" />
    <header>
      <h1>幸福人 Classic <span>V1.2 操作修正版</span></h1>
      <div className="header-actions">
        <button onClick={toggleBgm}>{bgmOn ? "暫停音樂" : "播放音樂"}</button>
        <button onClick={resetGame}><RotateCcw size={16}/>重開</button>
      </div>
    </header>
    <main>
      <section className="left">
        <Board players={players}/>
      </section>
      <aside className="right">
        <div className="log top-log">
          <h3>最近紀錄</h3>
          {message && <div className="message top-message">{message}</div>}
          {current.history.slice(0,8).map((h,i)=><p key={i}>{h}</p>)}
        </div>
        <div className="turn-card">
          <h2>目前回合：{current.animal} {current.name}</h2>
          <p>只能操作 <b>{current.name}</b> 的人生口袋。</p>
          <div className="dice-line">{moving ? "棋子移動中……" : lastDice.length?`骰子：${lastDice.join(" + ")} = ${lastDice.reduce((a,b)=>a+b,0)}`:"尚未擲骰"}</div>
          <button className="primary" disabled={moving} onClick={roll}><Dice5 size={18}/>{current.route ? "職業道路擲 1 顆骰子" : "外圈擲 2 顆骰子"}</button>
          <button disabled={moving} onClick={nextTurn}>結束回合，換下一位</button>
          <button disabled={moving} onClick={retire}>使用退休權去渡假</button>
          <button className="danger" disabled={moving} onClick={bankrupt}>宣告破產重開</button>
          {message && <div className="message">{message}</div>}
        </div>

        {cell.type==="careerEntry" && !current.route && <div className="action-box">
          <h3>{cell.career} 入口</h3>
          <p>入門費 ${cell.fee.toLocaleString()}；若已有該職業經驗，可免入門費。</p>
          <button disabled={moving} onClick={()=>enterCareer(cell.career)}>進入 {cell.career} 道路</button>
        </div>}

        <div className="wallet">
          <h3><WalletCards size={18}/> {current.name} 的人生口袋</h3>
          <div className="wallet-stats">
            <span>現金 ${current.cash.toLocaleString()}</span>
            <span>財富 {wealthScore(current)}</span>
            <span>快樂 {current.happy}</span>
            <span>名譽 {current.fame}</span>
          </div>
          <h4>機會卡</h4>
          {current.pocket.chance.length===0 && <p className="muted">目前沒有機會卡。</p>}
          {current.pocket.chance.map((card,i)=><div className="item-card" key={i}>
            <b>{card.title}</b><p>{card.text}</p>
            <button disabled={moving} onClick={()=>useChance(i)}>使用</button>
            <button disabled={moving} onClick={()=>sellChance(i)}>出售 ${card.sell?.toLocaleString()||"1,000"}</button>
          </div>)}
          <h4>經驗卡</h4>
          {current.pocket.exp.length===0 && <p className="muted">目前沒有經驗卡。</p>}
          {current.pocket.exp.map((card,i)=><div className="item-card exp" key={i}>
            <b>{card.title}</b><p>{card.text}</p>
            <button disabled={moving} onClick={()=>useExp(i)}>取代骰子</button>
          </div>)}
        </div>

        <div className="players">
          <h3>玩家紀錄卡</h3>
          {players.map((p,i)=><PlayerPanel key={p.id} p={p} active={i===turn}/>)}
        </div>
      </aside>
    </main>
  </div>
}
