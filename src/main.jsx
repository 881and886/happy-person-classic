import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const ANIMALS = ['🐱','🐶','🦊','🐼','🐧','🐸','🦁','🐰','🐵','🐯','🐻','🐨'];
const CAREERS = ['學院','農墾','企業','航海','月球探險','電影明星','從政','開礦'];
const ACHIEVEMENTS = {
  學院:[
    {id:'edu-business',label:'商學學位',title:'商學士',position:'suffix',delta:{salary:1000,honor:1},boost:{type:'money',cash:1000},desc:'薪水 +$1000，名譽 +1；投資與金錢事件偶爾加成。'},
    {id:'edu-professor',label:'教育學位',title:'教授',position:'prefix',delta:{happy:2,honor:2},boost:{career:'學院',honor:1},desc:'快樂 +2，名譽 +2；學院事件名譽加成。'},
    {id:'edu-science',label:'科學學位',title:'博士',position:'suffix',delta:{honor:4},boost:{career:'月球探險',honor:1},desc:'名譽 +4；月球探險事件名譽加成。'}
  ],
  農墾:[
    {id:'farm-organic',label:'有機農夫',title:'有機農夫',position:'prefix',delta:{happy:4},boost:{career:'農墾',happy:1},desc:'快樂 +4；農墾事件快樂加成。'},
    {id:'farm-owner',label:'農場主',title:'農場主',position:'suffix',delta:{cash:3000},boost:{career:'農墾',cash:1000},desc:'現金 +$3000；農墾事件收入加成。'},
    {id:'farm-master',label:'地方職人',title:'地方職人',position:'prefix',delta:{honor:3,happy:1},boost:{type:'honor',honor:1},desc:'名譽 +3，快樂 +1；公益與名譽事件加成。'}
  ],
  企業:[
    {id:'biz-manager',label:'經理人',title:'經理人',position:'prefix',delta:{salary:2000},boost:{career:'企業',cash:1000},desc:'薪水 +$2000；企業收益事件加成。'},
    {id:'biz-founder',label:'創業家',title:'創業家',position:'prefix',delta:{cash:5000,happy:-1},boost:{type:'money',cash:1000},desc:'現金 +$5000，快樂 -1；金錢事件加成。'},
    {id:'biz-director',label:'董事',title:'董事',position:'suffix',delta:{cash:3000,honor:2},boost:{career:'企業',honor:1},desc:'現金 +$3000，名譽 +2；企業事件名譽加成。'}
  ],
  航海:[
    {id:'sea-captain',label:'船長',title:'船長',position:'prefix',delta:{cash:3000,honor:2},boost:{career:'航海',cash:1000},desc:'現金 +$3000，名譽 +2；航海收入加成。'},
    {id:'sea-explorer',label:'探險家',title:'探險家',position:'prefix',delta:{happy:3,honor:1},boost:{type:'chance',happy:1},desc:'快樂 +3，名譽 +1；機會事件快樂加成。'},
    {id:'sea-merchant',label:'國際商人',title:'國際商人',position:'prefix',delta:{salary:1000,cash:2000},boost:{career:'航海',cash:1000},desc:'薪水 +$1000，現金 +$2000；航海事件收入加成。'}
  ],
  月球探險:[
    {id:'moon-astronaut',label:'太空人',title:'太空人',position:'prefix',delta:{honor:5},boost:{career:'月球探險',honor:1},desc:'名譽 +5；月球事件名譽加成。'},
    {id:'moon-scientist',label:'宇宙研究員',title:'宇宙研究員',position:'prefix',delta:{honor:3,happy:1},boost:{career:'月球探險',happy:1},desc:'名譽 +3，快樂 +1；月球事件快樂加成。'},
    {id:'moon-hero',label:'月球英雄',title:'月球英雄',position:'prefix',delta:{cash:3000,happy:2,honor:3},boost:{career:'月球探險',cash:1000},desc:'現金 +$3000，快樂 +2，名譽 +3；月球收益加成。'}
  ],
  電影明星:[
    {id:'movie-star',label:'巨星',title:'巨星',position:'prefix',delta:{honor:5,cash:2000},boost:{career:'電影明星',honor:1},desc:'名譽 +5，現金 +$2000；電影事件名譽加成。'},
    {id:'movie-idol',label:'全民偶像',title:'偶像',position:'prefix',delta:{happy:3,honor:2},boost:{career:'電影明星',happy:1},desc:'快樂 +3，名譽 +2；電影事件快樂加成。'},
    {id:'movie-producer',label:'娛樂教父',title:'娛樂教父',position:'prefix',delta:{cash:5000},boost:{career:'電影明星',cash:1000},desc:'現金 +$5000；電影事件收入加成。'}
  ],
  從政:[
    {id:'pol-councilor',label:'議員',title:'議員',position:'suffix',delta:{honor:3},boost:{career:'從政',honor:1},desc:'名譽 +3；政治事件名譽加成。'},
    {id:'pol-mayor',label:'市長',title:'市長',position:'prefix',delta:{salary:2000,honor:2},boost:{career:'從政',cash:1000},desc:'薪水 +$2000，名譽 +2；政治事件收入加成。'},
    {id:'pol-star',label:'政治明星',title:'政治明星',position:'prefix',delta:{honor:5,happy:-1},boost:{career:'從政',honor:1},desc:'名譽 +5，快樂 -1；政治事件名譽加成。'}
  ],
  開礦:[
    {id:'mine-owner',label:'礦場主',title:'礦場主',position:'suffix',delta:{cash:5000},boost:{career:'開礦',cash:1000},desc:'現金 +$5000；開礦事件收入加成。'},
    {id:'mine-tycoon',label:'資源大亨',title:'資源大亨',position:'suffix',delta:{cash:8000,happy:-1},boost:{type:'money',cash:1000},desc:'現金 +$8000，快樂 -1；金錢事件加成。'},
    {id:'mine-engineer',label:'工程專家',title:'工程專家',position:'suffix',delta:{salary:1000,honor:1},boost:{career:'開礦',happy:1},desc:'薪水 +$1000，名譽 +1；開礦事件快樂加成。'}
  ]
};
function displayName(p){const t=(p.titles||[]).find(x=>x.id===p.activeTitleId); if(!t)return p.name; return t.position==='suffix'?`${p.name}${t.title}`:`${t.title}${p.name}`;}
function titleBoost(p,context){const t=(p.titles||[]).find(x=>x.id===p.activeTitleId); if(!t||!t.boost)return {}; if((t.boost.career&&t.boost.career===context.career)||(t.boost.type&&t.boost.type===context.type)){return {cash:t.boost.cash||0,happy:t.boost.happy||0,honor:t.boost.honor||0};} return {};}
function deltaText(d={}){const a=[]; if(d.cash)a.push(`現金 ${d.cash>0?'+':''}$${Math.abs(d.cash)}`); if(d.salary)a.push(`薪水 ${d.salary>0?'+':''}$${Math.abs(d.salary)}`); if(d.happy)a.push(`快樂 ${d.happy>0?'+':''}${d.happy}`); if(d.honor)a.push(`名譽 ${d.honor>0?'+':''}${d.honor}`); return a.join('、')||'無額外加成';}
const careerMeta = {
  學院:{icon:'🎓',fee:1000,color:'#fff7d6',main:'honor'}, 農墾:{icon:'🌾',fee:1000,color:'#ecffd9',main:'happy'},
  企業:{icon:'🏢',fee:2000,color:'#e6f4ff',main:'money'}, 航海:{icon:'⚓',fee:2000,color:'#e7fbff',main:'risk'},
  月球探險:{icon:'🌙',fee:3000,color:'#eeeaff',main:'risk'}, 電影明星:{icon:'🎬',fee:2000,color:'#ffe9f2',main:'honor'},
  從政:{icon:'🏛️',fee:2000,color:'#fff1df',main:'honor'}, 開礦:{icon:'⛏️',fee:2000,color:'#f5eee6',main:'money'}
};
const outerBoard = [
  {label:'發薪日',type:'start'}, {label:'一般',type:'normal'}, {label:'機會',type:'chance'}, {label:'學院入口',type:'careerEntry',career:'學院'},
  {label:'社交',type:'social'}, {label:'農墾入口',type:'careerEntry',career:'農墾'}, {label:'機會',type:'chance'}, {label:'投資',type:'money'},
  {label:'企業入口',type:'careerEntry',career:'企業'}, {label:'一般',type:'normal'}, {label:'航海入口',type:'careerEntry',career:'航海'}, {label:'家庭',type:'happy'},
  {label:'機會',type:'chance'}, {label:'月球入口',type:'careerEntry',career:'月球探險'}, {label:'健康',type:'happy'}, {label:'電影入口',type:'careerEntry',career:'電影明星'},
  {label:'一般',type:'normal'}, {label:'從政入口',type:'careerEntry',career:'從政'}, {label:'機會',type:'chance'}, {label:'開礦入口',type:'careerEntry',career:'開礦'},
  {label:'買房',type:'money'}, {label:'旅行',type:'happy'}, {label:'退休規劃',type:'retire'}, {label:'機會',type:'chance'},
  {label:'公益',type:'honor'}, {label:'一般',type:'normal'}, {label:'進修',type:'honor'}, {label:'加薪',type:'salary'}
];
const careerEvents = {
  學院:[['發表研究成果','名譽 +3、快樂 +1',{honor:3,happy:1}],['審查沒過','快樂 -2',{happy:-2}],['指導學生得獎','名譽 +2、快樂 +2',{honor:2,happy:2}],['研究補助通過','現金 +2000',{cash:2000}]],
  農墾:[['豐收','現金 +3000、快樂 +2',{cash:3000,happy:2}],['颱風損失','現金 -2000、快樂 -1',{cash:-2000,happy:-1}],['有機轉型成功','名譽 +2、快樂 +2',{honor:2,happy:2}],['農忙過勞','快樂 -2',{happy:-2}]],
  企業:[['升任主管','薪水 +1000、名譽 +1',{salary:1000,honor:1}],['獎金入帳','現金 +4000',{cash:4000}],['加班爆炸','快樂 -2、現金 +1000',{happy:-2,cash:1000}],['市場下滑','現金 -2000',{cash:-2000}]],
  航海:[['遠洋貿易成功','現金 +5000、名譽 +1',{cash:5000,honor:1}],['遇到暴風雨','現金 -3000、快樂 -2',{cash:-3000,happy:-2}],['看見壯闊海景','快樂 +3',{happy:3}],['海外人脈','名譽 +2',{honor:2}]],
  月球探險:[['任務成功','名譽 +5、現金 +3000',{honor:5,cash:3000}],['設備故障','現金 -4000、快樂 -2',{cash:-4000,happy:-2}],['太空訓練突破','名譽 +3',{honor:3}],['孤獨航程','快樂 -3、名譽 +1',{happy:-3,honor:1}]],
  電影明星:[['電影大賣','名譽 +4、現金 +3000',{honor:4,cash:3000}],['緋聞風波','名譽 -1、快樂 -2',{honor:-1,happy:-2}],['粉絲見面會','快樂 +2、名譽 +2',{happy:2,honor:2}],['片約中斷','現金 -2000',{cash:-2000}]],
  從政:[['成功造勢','名譽 +4',{honor:4}],['輿論壓力','快樂 -2',{happy:-2}],['政策有成','名譽 +3、快樂 +1',{honor:3,happy:1}],['競選支出','現金 -3000、名譽 +1',{cash:-3000,honor:1}]],
  開礦:[['挖到礦脈','現金 +5000',{cash:5000}],['坑道事故','現金 -3000、快樂 -2',{cash:-3000,happy:-2}],['技術升級','現金 +2000、名譽 +1',{cash:2000,honor:1}],['環境爭議','名譽 -1',{honor:-1}]]
};
const careerBoards = Object.fromEntries(CAREERS.map((c,ci)=>[c,Array.from({length:12+(ci%4)},(_,i)=>({
  label:i===0?'入口':i===11+(ci%4)?'出口':['歷練','成果','風險','機會','轉折'][i%5],
  type:i===0?'careerStart':i===11+(ci%4)?'careerExit':['careerEvent','careerEvent','careerRisk','chance','careerEvent'][i%5]
}))]));
const chanceDeckBase = [
  {title:'貴人指路',text:'可保留。使用後可直接前往任一職業入口。',sell:1000,kind:'gotoCareer'},
  {title:'意外獎金',text:'立刻獲得 $3000。',sell:0,instant:{cash:3000}}, {title:'稅金補繳',text:'立刻支付 $2000。',sell:0,instant:{cash:-2000}},
  {title:'受邀演講',text:'名譽 +3。',sell:0,instant:{honor:3}}, {title:'家庭聚會',text:'快樂 +3。',sell:0,instant:{happy:3}},
  {title:'職涯捷徑',text:'可保留。使用後前往自己曾有經驗的職業入口，免入門費。',sell:1000,kind:'experiencedCareer'}
];
const expDeckBase = [
  {title:'經驗卡：穩健前進',text:'取代擲骰，前進 3 格。',steps:3}, {title:'經驗卡：精準時機',text:'取代擲骰，前進 5 格。',steps:5},
  {title:'經驗卡：臨門一腳',text:'取代擲骰，前進 1 格。',steps:1}, {title:'經驗卡：大步人生',text:'取代擲骰，前進 6 格。',steps:6}
];
function mkPlayer(i){return {id:crypto.randomUUID(),name:`玩家${i+1}`,animal:ANIMALS[i],cash:10000,salary:1000,wealth:10,happy:0,honor:0,target:{wealth:20,happy:20,honor:20},targetLocked:false,route:'outer',pos:0,career:null,careerPos:0,careerExp:{},titles:[],activeTitleId:null,retirementRights:0,pocket:{chance:[],exp:[]},bankrupt:0};}
const clamp=n=>Math.max(0,n); const roll=n=>Array.from({length:n},()=>1+Math.floor(Math.random()*6)); const sum=a=>a.reduce((x,y)=>x+y,0); const pick=a=>a[Math.floor(Math.random()*a.length)];
function applyDelta(p,d={}){let np={...p}; if(d.cash)np.cash+=d.cash; if(d.salary)np.salary=clamp(np.salary+d.salary); if(d.happy)np.happy=clamp(np.happy+d.happy); if(d.honor)np.honor=clamp(np.honor+d.honor); np.cash=Math.max(0,np.cash); np.wealth=Math.floor(np.cash/1000); return np;}
function checkWin(p){return p.wealth>=p.target.wealth&&p.happy>=p.target.happy&&p.honor>=p.target.honor;}
function cellClass(t){return 'cell '+(t==='chance'?'chance':t==='careerEntry'?'entry':t==='start'?'start':t==='retire'?'retire':'');}

function App(){
  const [stage,setStage]=useState('setup'),[players,setPlayers]=useState(()=>[mkPlayer(0)]),[current,setCurrent]=useState(0),[log,setLog]=useState(['歡迎來到幸福人 Classic 2.3']),[dice,setDice]=useState([]),[moving,setMoving]=useState(false),[prompt,setPrompt]=useState(null),[event,setEvent]=useState(null),[winner,setWinner]=useState(null),[music,setMusic]=useState(false); const audioRef=useRef(null); const cp=players[current];
  useEffect(()=>{const saved=localStorage.getItem('happy-person-v23'); if(saved){try{const s=JSON.parse(saved); if(s.players){setPlayers(s.players);setCurrent(s.current||0);setStage(s.stage||'setup');setLog(s.log||[]);setWinner(s.winner||null)}}catch{}}},[]);
  useEffect(()=>{localStorage.setItem('happy-person-v23',JSON.stringify({players,current,stage,log,winner}));},[players,current,stage,log,winner]);
  useEffect(()=>{if(audioRef.current){audioRef.current.loop=true; music?audioRef.current.play().catch(()=>{}):audioRef.current.pause();}},[music]);
  const addLog=m=>setLog(l=>[m,...l].slice(0,12)); const setCount=n=>setPlayers(Array.from({length:n},(_,i)=>players[i]||mkPlayer(i))); const updatePlayer=(idx,fn)=>setPlayers(ps=>ps.map((p,i)=>i===idx?fn(p):p));
  const startGame=()=>{if(players.some(p=>!p.targetLocked))return alert('請先鎖定每位玩家的幸福目標'); setStage('game'); addLog('遊戲開始：每位玩家先領取 $10,000；外圈雙骰，內圈單骰。');};
  const reset=()=>{if(confirm('確定重新開始？目前進度會清除。')){localStorage.removeItem('happy-person-v23');location.reload();}}; const nextTurn=()=>{setCurrent(i=>(i+1)%players.length);setDice([]);setPrompt(null);setEvent(null);};
  const bankruptReset=(p,idx)=>({...mkPlayer(idx),id:p.id,name:p.name,animal:p.animal,target:p.target,targetLocked:true,bankrupt:(p.bankrupt||0)+1});
  const finishTurn=()=>setTimeout(()=>{const p=players[current]; if(p&&p.cash<=0){setPlayers(ps=>ps.map((x,i)=>i===current?bankruptReset(x,i):x));addLog(`${p.name} 現金歸零，系統宣告破產，重新領取 $10,000。`);nextTurn();return;} if(p&&checkWin(p)){setWinner(p);setStage('end');addLog(`${p.name} 達成幸福目標，遊戲結束！`)}else nextTurn();},80);
  const showEvent=(title,text)=>setEvent({title,text});
  const confirmEvent=()=>{setEvent(null);finishTurn();};
  const processCell=idx=>{const p=players[idx]; if(!p)return; if(p.route==='outer'){const cell=outerBoard[p.pos]; addLog(`${p.animal} ${p.name} 抵達「${cell.label}」。`); if(cell.type==='chance')return drawChance(idx); if(cell.type==='careerEntry')return setPrompt({type:'careerEntry',career:cell.career}); if(cell.type==='money'){const b=titleBoost(p,{type:'money'});updatePlayer(idx,p=>applyDelta(p,{cash:2000,...b}));return showEvent('投資／資產機會',`你獲得 $2000。${Object.keys(b).length?'\n啟用頭銜觸發：'+deltaText(b):''}`)} if(cell.type==='happy'){updatePlayer(idx,p=>applyDelta(p,{happy:2}));return showEvent(cell.label,'快樂 +2。')} if(cell.type==='honor'){const b=titleBoost(p,{type:'honor'});updatePlayer(idx,p=>applyDelta(p,{honor:2,...b}));return showEvent(cell.label,`名譽 +2。${Object.keys(b).length?'\n啟用頭銜觸發：'+deltaText(b):''}`)} if(cell.type==='salary'){updatePlayer(idx,p=>applyDelta(p,{salary:1000,cash:1000}));return showEvent('加薪','薪水 +$1000，並立刻領取 $1000。')} if(cell.type==='retire')return setPrompt({type:'retire'}); return showEvent('平凡的一天','什麼事也沒有發生。');}
    const ccell=careerBoards[p.career][p.careerPos]; addLog(`${p.animal} ${p.name} 在「${p.career}」內圈抵達「${ccell.label}」。`); if(ccell.type==='chance')return drawChance(idx); if(ccell.type==='careerExit')return completeCareer(idx); if(ccell.type==='careerEvent'||ccell.type==='careerRisk'){const ev=pick(careerEvents[p.career]); const b=titleBoost(p,{career:p.career}); const delta={...ev[2],cash:(ev[2].cash||0)+(b.cash||0),happy:(ev[2].happy||0)+(b.happy||0),honor:(ev[2].honor||0)+(b.honor||0)}; updatePlayer(idx,p=>applyDelta(p,delta)); return showEvent(`${careerMeta[p.career].icon} ${p.career}事件：${ev[0]}`,`${ev[1]}${Object.keys(b).length?'\n啟用頭銜觸發：'+deltaText(b):''}`);} return showEvent(`${p.career}內圈`,'平穩累積職業經驗。');};
  const moveSteps=async(idx,steps)=>{setMoving(true);setPrompt(null);setEvent(null);for(let s=0;s<steps;s++){await new Promise(r=>setTimeout(r,280));setPlayers(ps=>ps.map((p,i)=>{if(i!==idx)return p; if(p.route==='outer'){const next=(p.pos+1)%outerBoard.length;let np={...p,pos:next}; if(next===0){np=applyDelta(np,{cash:np.salary});setTimeout(()=>addLog(`${np.name} 經過發薪日，領取薪水 $${np.salary}。`),0)} return np;} const len=careerBoards[p.career].length; return {...p,careerPos:Math.min(p.careerPos+1,len-1)};}));} setMoving(false); setTimeout(()=>processCell(idx),60);};
  const doRoll=()=>{if(moving||prompt||event)return; const n=cp.route==='outer'?2:1,d=roll(n); setDice(d); addLog(`${cp.name} 擲出 ${d.join(' + ')} = ${sum(d)}。`); moveSteps(current,sum(d));};
  const drawChance=idx=>{const card=pick(chanceDeckBase); addLog(`${players[idx].name} 抽到機會卡：「${card.title}」。`); if(card.instant){updatePlayer(idx,p=>applyDelta(p,card.instant));return showEvent(`機會卡：${card.title}`,card.text)} updatePlayer(idx,p=>({...p,pocket:{...p.pocket,chance:[...p.pocket.chance,card]}})); showEvent(`機會卡：${card.title}`,`${card.text}\n已放入玩家口袋。`);};
  const drawExp=idx=>{const card=pick(expDeckBase); updatePlayer(idx,p=>({...p,pocket:{...p.pocket,exp:[...p.pocket.exp,card]}})); addLog(`${players[idx].name} 獲得經驗卡：「${card.title}」。`);};
  const enterCareer=career=>{const fee=(cp.careerExp[career]||0)>0?0:careerMeta[career].fee; updatePlayer(current,p=>({...applyDelta(p,{cash:-fee}),route:'career',career,careerPos:0})); addLog(`${cp.name} 進入「${career}」內圈。${fee===0?'已有經驗，免入門費。':'支付入門費 $'+fee+'。'}`); setPrompt(null); showEvent(`${careerMeta[career].icon} 進入${career}道路`, fee===0?'已有職業經驗，本次免入門費。':'已支付入門費，下一回合開始在內圈單骰前進。');};
  const completeCareer=idx=>{const old=players[idx]; const career=old.career; updatePlayer(idx,p=>{const count=(p.careerExp[p.career]||0)+1;let np={...p,careerExp:{...p.careerExp,[p.career]:count},route:'outer',career:null,careerPos:0,pos:(p.pos+1)%outerBoard.length}; if(count===3)np.retirementRights=(np.retirementRights||0)+1; return np;}); if((old.careerExp[career]||0)<3)setTimeout(()=>drawExp(idx),0); addLog(`${displayName(old)} 完成一次「${career}」職業道路，返回外圈。`); setPrompt({type:'achievement',career});};
  const chooseAchievement=(ach)=>{updatePlayer(current,p=>{const already=(p.titles||[]).some(t=>t.id===ach.id); const titles=already?p.titles:[...(p.titles||[]),ach]; return applyDelta({...p,titles,activeTitleId:ach.id},ach.delta);}); addLog(`${cp.name} 獲得成就「${ach.label}」，並掛上頭銜「${ach.title}」。`); setPrompt(null); showEvent('人生里程碑',`獲得成就：${ach.label}
頭銜：${ach.title}
${ach.desc}
${deltaText(ach.delta)}`);};
  const equipTitle=(id)=>{updatePlayer(current,p=>({...p,activeTitleId:id})); const t=(cp.titles||[]).find(x=>x.id===id); addLog(`${cp.name} 切換頭銜為「${t?.title||'無'}」。`);};
  const clearTitle=()=>{updatePlayer(current,p=>({...p,activeTitleId:null})); addLog(`${cp.name} 取消目前頭銜。`);};
  const useExp=i=>{const card=cp.pocket.exp[i]; updatePlayer(current,p=>({...p,pocket:{...p.pocket,exp:p.pocket.exp.filter((_,idx)=>idx!==i)}})); addLog(`${cp.name} 使用「${card.title}」，前進 ${card.steps} 格。`); moveSteps(current,card.steps);};
  const inspectCard=(cardType,i)=>{const card=cardType==='exp'?cp.pocket.exp[i]:cp.pocket.chance[i]; setPrompt({type:'cardInfo',cardType,cardIndex:i,card});};
  const sellChance=i=>{const card=cp.pocket.chance[i]; setPrompt({type:'confirmSell',cardIndex:i,card});};
  const confirmSell=(i)=>{const card=cp.pocket.chance[i]; updatePlayer(current,p=>applyDelta({...p,pocket:{...p.pocket,chance:p.pocket.chance.filter((_,idx)=>idx!==i)}},{cash:card.sell||1000}));addLog(`${cp.name} 出售機會卡「${card.title}」，獲得 $${card.sell||1000}。`);setPrompt(null);};
  const useChance=(i,career=null)=>{const card=cp.pocket.chance[i]; if(card.kind==='experiencedCareer'&&!career)return setPrompt({type:'chooseExperiencedCareer',cardIndex:i}); if(card.kind==='gotoCareer'&&!career)return setPrompt({type:'chooseCareer',cardIndex:i}); updatePlayer(current,p=>({...p,pos:outerBoard.findIndex(c=>c.career===career),pocket:{...p.pocket,chance:p.pocket.chance.filter((_,idx)=>idx!==i)}}));addLog(`${cp.name} 使用機會卡前往「${career}入口」。`);setPrompt({type:'careerEntry',career});};
  const declareBankrupt=()=>{updatePlayer(current,p=>bankruptReset(p,current));addLog(`${cp.name} 宣告破產，重新領取 $10,000。`);nextTurn();};
  const retireVacation=()=>{if(cp.retirementRights<=0)return alert('尚無退休權');updatePlayer(current,p=>applyDelta({...p,retirementRights:p.retirementRights-1,pos:21},{happy:6,cash:p.salary}));addLog(`${cp.name} 使用退休權前往日月潭渡假。`);setPrompt(null);showEvent('日月潭渡假','快樂 +6，並領取一次薪水。');};
  return <div className="app"><audio ref={audioRef} src="/bgm.wav"/><header><h1>幸福人 Classic <span>2.3 口袋說明版</span></h1><div><button onClick={()=>setMusic(!music)}>{music?'🔊 音樂開':'🔇 音樂關'}</button><button onClick={reset}>重新開始</button></div></header>{stage==='setup'&&<Setup players={players} setCount={setCount} updatePlayer={updatePlayer} startGame={startGame}/>} {stage==='game'&&<main className="game"><section className="left"><Recent log={log}/><Board players={players}/><CareerMaps players={players}/></section><aside><TurnPanel cp={cp} dice={dice} moving={moving} locked={!!prompt||!!event} doRoll={doRoll} useExp={useExp} useChance={useChance} sellChance={sellChance} equipTitle={equipTitle} clearTitle={clearTitle} declareBankrupt={declareBankrupt} retireVacation={retireVacation} inspectCard={inspectCard}/><Players players={players} current={current}/></aside></main>} {stage==='end'&&<End winner={winner} players={players} reset={reset}/>} {prompt&&<Prompt prompt={prompt} cp={cp} enterCareer={enterCareer} setPrompt={setPrompt} nextTurn={nextTurn} useChance={useChance} retireVacation={retireVacation} confirmSell={confirmSell} chooseAchievement={chooseAchievement} useExp={useExp} sellChance={sellChance}/>} {event&&<EventModal event={event} confirm={confirmEvent}/>}</div>;
}
function Setup({players,setCount,updatePlayer,startGame}){return <div className="setup card"><h2>建立玩家</h2><label>玩家人數 <select value={players.length} onChange={e=>setCount(+e.target.value)}>{[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></label><div className="setupGrid">{players.map((p,i)=><div className="playerSetup" key={p.id}><input value={p.name} onChange={e=>updatePlayer(i,p=>({...p,name:e.target.value}))}/><div className="animals">{ANIMALS.slice(0,8).map(a=><button key={a} className={p.animal===a?'sel':''} onClick={()=>updatePlayer(i,p=>({...p,animal:a}))}>{a}</button>)}</div><Target p={p} update={t=>updatePlayer(i,p=>({...p,target:t}))}/><button onClick={()=>updatePlayer(i,p=>({...p,targetLocked:!p.targetLocked}))}>{p.targetLocked?'已鎖定目標':'鎖定幸福目標'}</button></div>)}</div><button className="primary" onClick={startGame}>開始遊戲</button></div>}
function Target({p,update}){const total=p.target.wealth+p.target.happy+p.target.honor,set=(k,v)=>update({...p.target,[k]:+v});return <div className="target"><b>幸福目標：{total}/60</b><label>財富 <input disabled={p.targetLocked} type="number" value={p.target.wealth} onChange={e=>set('wealth',e.target.value)}/></label><label>快樂 <input disabled={p.targetLocked} type="number" value={p.target.happy} onChange={e=>set('happy',e.target.value)}/></label><label>名譽 <input disabled={p.targetLocked} type="number" value={p.target.honor} onChange={e=>set('honor',e.target.value)}/></label></div>}
function Recent({log}){return <div className="recent"><b>最近紀錄</b>{log.map((l,i)=><p key={i}>{l}</p>)}</div>}
function Board({players}){const coords=[];for(let c=0;c<9;c++)coords.push([0,c]);for(let r=1;r<7;r++)coords.push([r,8]);for(let c=7;c>=0;c--)coords.push([6,c]);for(let r=5;r>=1;r--)coords.push([r,0]);return <div className="outerBoard">{outerBoard.map((cell,i)=><div key={i} className={cellClass(cell.type)} style={{gridColumn:coords[i][1]+1,gridRow:coords[i][0]+1}}><small>{i}</small><b>{cell.label}</b><div className="tokens">{players.filter(p=>p.route==='outer'&&p.pos===i).map(p=><span key={p.id}>{p.animal}</span>)}</div></div>)}</div>}
function CareerMaps({players}){return <div className="careerWrap">{CAREERS.map(c=><div key={c} className="careerMap" style={{background:careerMeta[c].color}}><b>{careerMeta[c].icon} {c}</b><div className="miniCells">{careerBoards[c].map((cell,i)=><span key={i} className={cell.type}>{i}<em>{players.filter(p=>p.route==='career'&&p.career===c&&p.careerPos===i).map(p=>p.animal).join('')}</em></span>)}</div></div>)}</div>}
function TurnPanel({cp,dice,moving,locked,doRoll,useExp,useChance,sellChance,equipTitle,clearTitle,declareBankrupt,retireVacation,inspectCard}){return <div className="card turn"><h2>目前回合：{cp.animal} {displayName(cp)}</h2><div className="dice">{dice.length?dice.map((d,i)=><span key={i}>{['⚀','⚁','⚂','⚃','⚄','⚅'][d-1]}</span>):'等待擲骰'}</div><p>{cp.route==='outer'?'外圈：雙骰':'內圈：單骰'} {moving?'｜棋子移動中':''}</p><button className="primary" disabled={moving||locked} onClick={doRoll}>擲骰前進</button><button onClick={retireVacation}>使用退休權去度假</button><button onClick={declareBankrupt}>宣告破產</button><h3>人生頭銜</h3>{(cp.titles||[]).length===0?<p>尚無頭銜。完成職業道路後可選擇成就。</p>:<div className="titles"><button onClick={clearTitle}>不掛頭銜</button>{cp.titles.map(t=><button key={t.id} className={cp.activeTitleId===t.id?'sel':''} onClick={()=>equipTitle(t.id)}>{t.position==='suffix'?cp.name+t.title:t.title+cp.name}</button>)}</div>}<h3>人生口袋</h3><p>現金 ${cp.cash}｜薪水 ${cp.salary}</p><p>財富 {cp.wealth}｜快樂 {cp.happy}｜名譽 {cp.honor}</p><b>經驗卡</b>{cp.pocket.exp.length===0?<p>無</p>:cp.pocket.exp.map((c,i)=><div className="item" key={i}><button className='cardTitle' onClick={()=>inspectCard('exp',i)}>{c.title}</button><button disabled={moving||locked} onClick={()=>useExp(i)}>使用</button></div>)}<b>機會卡</b>{cp.pocket.chance.length===0?<p>無</p>:cp.pocket.chance.map((c,i)=><div className="item" key={i}><button className='cardTitle' onClick={()=>inspectCard('chance',i)}>{c.title}</button><button disabled={moving||locked} onClick={()=>useChance(i)}>使用</button><button disabled={moving||locked} onClick={()=>sellChance(i)}>出售</button></div>)}</div>}
function Players({players,current}){return <div className="players">{players.map((p,i)=><div key={p.id} className={'miniPlayer '+(i===current?'active':'')}><b>{p.animal} {displayName(p)}</b><p>${p.cash}｜財{p.wealth} 快{p.happy} 名{p.honor}</p><p>{p.route==='outer'?'外圈':'內圈：'+p.career}</p><p>經驗：{Object.entries(p.careerExp).map(([k,v])=>`${k}×${v}`).join('、')||'無'}</p></div>)}</div>}
function EventModal({event,confirm}){return <div className="modal"><div className="modalBox eventBox"><h2>{event.title}</h2><p>{event.text}</p><button className="primary" onClick={confirm}>確認，下一位玩家</button></div></div>}
function Prompt({prompt,cp,enterCareer,setPrompt,nextTurn,useChance,retireVacation,confirmSell,chooseAchievement,useExp,sellChance}){const experienced=Object.keys(cp.careerExp).filter(k=>cp.careerExp[k]>0);return <div className="modal"><div className="modalBox"><h2>{prompt.type==='achievement'?'人生里程碑':prompt.type==='confirmSell'?'出售確認':'路口選擇'}</h2>{prompt.type==='careerEntry'&&<><p>是否進入「{prompt.career}」職業道路？</p><div className='notice'><b>入門費用：</b>{(cp.careerExp[prompt.career]||0)>0?'已有職業經驗，免入門費。':`$${careerMeta[prompt.career].fee}`}<br/><b>資格：</b>無特殊資格限制；若現金不足或扣款後歸零，系統會宣告破產。<br/><b>道路規則：</b>進入後改用單骰，走完出口可獲得經驗卡與成就頭銜。</div><button className="primary" onClick={()=>enterCareer(prompt.career)}>進入</button><button onClick={()=>{setPrompt(null);nextTurn();}}>略過</button></>}{prompt.type==='chooseCareer'&&<>{CAREERS.map(c=><button key={c} onClick={()=>useChance(prompt.cardIndex,c)}>{c}</button>)}</>}{prompt.type==='chooseExperiencedCareer'&&<>{experienced.length?experienced.map(c=><button key={c} onClick={()=>useChance(prompt.cardIndex,c)}>{c}</button>):<p>尚無職業經驗，不能使用此卡。</p>}<button onClick={()=>setPrompt(null)}>取消</button></>}{prompt.type==='retire'&&<><p>可使用退休權去度假。</p><button onClick={retireVacation}>使用</button><button onClick={()=>{setPrompt(null);nextTurn();}}>略過</button></>}{prompt.type==='cardInfo'&&<><p><b>{prompt.card.title}</b></p><div className='notice'>{prompt.card.text}<br/>{prompt.cardType==='exp'?`效果：可取代擲骰，直接前進 ${prompt.card.steps} 格。`:`出售價值：$${prompt.card.sell||1000}`}</div>{prompt.cardType==='exp'?<button className='primary' onClick={()=>useExp(prompt.cardIndex)}>使用這張經驗卡</button>:<><button className='primary' onClick={()=>useChance(prompt.cardIndex)}>使用這張機會卡</button><button onClick={()=>sellChance(prompt.cardIndex)}>出售這張機會卡</button></>}<button onClick={()=>setPrompt(null)}>關閉</button></>}{prompt.type==='confirmSell'&&<><p>出售機會卡：<b>{prompt.card.title}</b></p><p>可售出金額：<b>${prompt.card.sell||1000}</b></p><button className='primary' onClick={()=>confirmSell(prompt.cardIndex)}>確認出售</button><button onClick={()=>setPrompt(null)}>取消</button></>}{prompt.type==='achievement'&&<><p>完成「{prompt.career}」職業道路，請選擇一項成就。成就會變成可裝備的人生頭銜。</p>{ACHIEVEMENTS[prompt.career].map(a=><button key={a.id} className='achievementBtn' onClick={()=>chooseAchievement(a)}><b>{a.label}</b><br/><span>{a.position==='suffix'?cp.name+a.title:a.title+cp.name}</span><small>{a.desc}</small></button>)}</>}</div></div>}
function End({winner,players,reset}){return <div className="end card"><h1>🏆 幸福人產生</h1><h2>{winner?.animal} {winner?displayName(winner):''} 達成預定幸福目標</h2>{players.map(p=><div className="result" key={p.id}><b>{p.animal} {displayName(p)}</b><p>目標：財富{p.target.wealth} 快樂{p.target.happy} 名譽{p.target.honor}</p><p>結果：財富{p.wealth} 快樂{p.happy} 名譽{p.honor}</p></div>)}<button onClick={reset}>重新開始</button></div>}
createRoot(document.getElementById('root')).render(<App/>);
