import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const ANIMALS = ['🐱','🐶','🦊','🐼','🐧','🐸','🦁','🐰'];
const CAREERS = ['學院','農墾','企業','航海','月球探險','電影明星','從政','開礦'];
const META = {
  學院:{icon:'🎓',fee:1000,color:'#fff7d6'}, 農墾:{icon:'🌾',fee:1000,color:'#ecffd9'},
  企業:{icon:'🏢',fee:2000,color:'#e6f4ff'}, 航海:{icon:'⚓',fee:2000,color:'#e7fbff'},
  月球探險:{icon:'🌙',fee:3000,color:'#eeeaff'}, 電影明星:{icon:'🎬',fee:2000,color:'#ffe9f2'},
  從政:{icon:'🏛️',fee:2000,color:'#fff1df'}, 開礦:{icon:'⛏️',fee:2000,color:'#f5eee6'}
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
const careerBoards = Object.fromEntries(CAREERS.map((c,ci)=>[c,Array.from({length:12+(ci%4)},(_,i)=>({
  label:i===0?'入口':i===11+(ci%4)?'出口':['歷練','成果','風險','機會','轉折'][i%5],
  type:i===0?'careerStart':i===11+(ci%4)?'careerExit':['careerEvent','careerEvent','careerRisk','chance','careerEvent'][i%5]
}))]));
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
const ACHIEVEMENTS = {
  學院:[['商學學位','商學士','suffix',{salary:1000,honor:1},{type:'money',cash:1000},'薪水 +$1000，名譽 +1；金錢事件加成。'],['教育學位','教授','prefix',{happy:2,honor:2},{career:'學院',honor:1},'快樂 +2，名譽 +2；學院事件名譽加成。'],['科學學位','博士','suffix',{honor:4},{career:'月球探險',honor:1},'名譽 +4；月球事件名譽加成。']],
  農墾:[['有機農夫','有機農夫','prefix',{happy:4},{career:'農墾',happy:1},'快樂 +4；農墾事件快樂加成。'],['農場主','農場主','suffix',{cash:3000},{career:'農墾',cash:1000},'現金 +$3000；農墾收入加成。'],['地方職人','地方職人','prefix',{honor:3,happy:1},{type:'honor',honor:1},'名譽 +3，快樂 +1；名譽事件加成。']],
  企業:[['經理人','經理人','prefix',{salary:2000},{career:'企業',cash:1000},'薪水 +$2000；企業收益加成。'],['創業家','創業家','prefix',{cash:5000,happy:-1},{type:'money',cash:1000},'現金 +$5000，快樂 -1；金錢事件加成。'],['董事','董事','suffix',{cash:3000,honor:2},{career:'企業',honor:1},'現金 +$3000，名譽 +2；企業名譽加成。']],
  航海:[['船長','船長','prefix',{cash:3000,honor:2},{career:'航海',cash:1000},'現金 +$3000，名譽 +2；航海收入加成。'],['探險家','探險家','prefix',{happy:3,honor:1},{type:'chance',happy:1},'快樂 +3，名譽 +1；機會事件加成。'],['國際商人','國際商人','prefix',{salary:1000,cash:2000},{career:'航海',cash:1000},'薪水 +$1000，現金 +$2000。']],
  月球探險:[['太空人','太空人','prefix',{honor:5},{career:'月球探險',honor:1},'名譽 +5；月球名譽加成。'],['宇宙研究員','宇宙研究員','prefix',{honor:3,happy:1},{career:'月球探險',happy:1},'名譽 +3，快樂 +1。'],['月球英雄','月球英雄','prefix',{cash:3000,happy:2,honor:3},{career:'月球探險',cash:1000},'現金 +$3000，快樂 +2，名譽 +3。']],
  電影明星:[['巨星','巨星','prefix',{honor:5,cash:2000},{career:'電影明星',honor:1},'名譽 +5，現金 +$2000。'],['全民偶像','偶像','prefix',{happy:3,honor:2},{career:'電影明星',happy:1},'快樂 +3，名譽 +2。'],['娛樂教父','娛樂教父','prefix',{cash:5000},{career:'電影明星',cash:1000},'現金 +$5000；電影收入加成。']],
  從政:[['議員','議員','suffix',{honor:3},{career:'從政',honor:1},'名譽 +3；政治名譽加成。'],['市長','市長','prefix',{salary:2000,honor:2},{career:'從政',cash:1000},'薪水 +$2000，名譽 +2。'],['政治明星','政治明星','prefix',{honor:5,happy:-1},{career:'從政',honor:1},'名譽 +5，快樂 -1。']],
  開礦:[['礦場主','礦場主','suffix',{cash:5000},{career:'開礦',cash:1000},'現金 +$5000；開礦收入加成。'],['資源大亨','資源大亨','suffix',{cash:8000,happy:-1},{type:'money',cash:1000},'現金 +$8000，快樂 -1。'],['工程專家','工程專家','suffix',{salary:1000,honor:1},{career:'開礦',happy:1},'薪水 +$1000，名譽 +1。']]
};
const chanceDeck = [
  {title:'貴人指路',text:'可保留。使用後可直接前往任一職業入口。',sell:1000,kind:'gotoCareer'},
  {title:'職涯捷徑',text:'可保留。使用後前往自己曾有經驗的職業入口，免入門費。',sell:1200,kind:'experiencedCareer'},
  {title:'意外獎金',text:'立刻獲得 $3000。',instant:{cash:3000}}, {title:'稅金補繳',text:'立刻支付 $2000。',instant:{cash:-2000}},
  {title:'受邀演講',text:'名譽 +3。',instant:{honor:3}}, {title:'家庭聚會',text:'快樂 +3。',instant:{happy:3}}
];
const expDeck = [
  {title:'經驗卡：臨門一腳',text:'取代擲骰，前進 1 格。',steps:1}, {title:'經驗卡：穩健前進',text:'取代擲骰，前進 3 格。',steps:3},
  {title:'經驗卡：精準時機',text:'取代擲骰，前進 5 格。',steps:5}, {title:'經驗卡：大步人生',text:'取代擲骰，前進 6 格。',steps:6}
];

const coords = (()=>{const a=[];for(let c=0;c<9;c++)a.push([0,c]);for(let r=1;r<7;r++)a.push([r,8]);for(let c=7;c>=0;c--)a.push([6,c]);for(let r=5;r>=1;r--)a.push([r,0]);return a;})();
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const randId = () => Math.random().toString(36).slice(2,10);
const pick = a => a[Math.floor(Math.random()*a.length)];
const diceFace = n => ['⚀','⚁','⚂','⚃','⚄','⚅'][n-1] || '🎲';
const roll = n => Array.from({length:n},()=>1+Math.floor(Math.random()*6));
const total = a => a.reduce((s,n)=>s+n,0);
function mkPlayer(i){return {id:randId(),name:`玩家${i+1}`,animal:ANIMALS[i],cash:10000,salary:1000,wealth:10,happy:0,honor:0,target:{wealth:20,happy:20,honor:20},targetLocked:false,route:'outer',pos:0,career:null,careerPos:0,careerExp:{},titles:[],activeTitleId:null,retirementRights:0,pocket:{chance:[],exp:[]},bankrupt:0};}
function displayName(p){const t=(p.titles||[]).find(x=>x.id===p.activeTitleId); if(!t)return p.name; return t.position==='suffix'?`${p.name}${t.title}`:`${t.title}${p.name}`;}
function deltaText(d={}){const a=[]; if(d.cash)a.push(`現金 ${d.cash>0?'+':''}$${Math.abs(d.cash)}`); if(d.salary)a.push(`薪水 ${d.salary>0?'+':''}$${Math.abs(d.salary)}`); if(d.happy)a.push(`快樂 ${d.happy>0?'+':''}${d.happy}`); if(d.honor)a.push(`名譽 ${d.honor>0?'+':''}${d.honor}`); return a.join('、')||'沒有變化';}
function applyDelta(p,d={}){let np={...p}; if(d.cash)np.cash+=d.cash; if(d.salary)np.salary=Math.max(0,np.salary+d.salary); if(d.happy)np.happy=Math.max(0,np.happy+d.happy); if(d.honor)np.honor=Math.max(0,np.honor+d.honor); if(np.cash<=0){np={...np,cash:10000,wealth:10,happy:0,honor:0,bankrupt:(np.bankrupt||0)+1,pocket:{chance:[],exp:[]}};} else np.wealth=Math.floor(np.cash/1000); return np;}
function titleBoost(p,ctx){const t=(p.titles||[]).find(x=>x.id===p.activeTitleId); if(!t||!t.boost)return {}; if((t.boost.career&&t.boost.career===ctx.career)||(t.boost.type&&t.boost.type===ctx.type))return {cash:t.boost.cash||0,happy:t.boost.happy||0,honor:t.boost.honor||0}; return {};}
function checkWin(p){return p.wealth>=p.target.wealth&&p.happy>=p.target.happy&&p.honor>=p.target.honor;}
function cellClass(type){return 'cell '+(type==='chance'?'chance':type==='careerEntry'?'entry':type==='start'?'start':type==='retire'?'retire':'');}

function App(){
  const [stage,setStage]=useState('setup');
  const [players,setPlayers]=useState([mkPlayer(0)]);
  const [current,setCurrent]=useState(0);
  const [log,setLog]=useState(['歡迎來到幸福人 Classic V2.4']);
  const [dice,setDice]=useState([]);
  const [moving,setMoving]=useState(false);
  const [event,setEvent]=useState(null);
  const [prompt,setPrompt]=useState(null);
  const [winner,setWinner]=useState(null);
  const [music,setMusic]=useState(false);
  const audioRef=useRef(null);
  const cp=players[current];
  useEffect(()=>{const a=audioRef.current;if(!a)return; a.loop=true; if(music)a.play().catch(()=>{}); else a.pause();},[music]);
  useEffect(()=>{try{localStorage.setItem('hpc-v24-save',JSON.stringify({stage,players,current,log}))}catch{}},[stage,players,current,log]);
  const addLog = m => setLog(l=>[m,...l].slice(0,12));
  const updatePlayer = (idx,fn) => setPlayers(ps=>ps.map((p,i)=>i===idx?fn(p):p));
  const showEvent = (title,text,after=null) => setEvent({title,text,after});
  const nextTurn = () => setCurrent(c=>(c+1)%players.length);
  const confirmEvent = () => {const a=event?.after; setEvent(null); if(a==='end')return; if(a==='next')nextTurn();};
  const setCount = n => setPlayers(ps=>Array.from({length:n},(_,i)=>ps[i]||mkPlayer(i)));
  const reset = () => {localStorage.removeItem('hpc-v24-save'); setStage('setup'); setPlayers([mkPlayer(0)]); setCurrent(0); setLog(['歡迎來到幸福人 Classic V2.4']); setDice([]); setPrompt(null); setEvent(null); setWinner(null);};
  const startGame = () => {setStage('game'); addLog('遊戲開始。每位玩家開局獲得 $10,000。');};
  function applyAndCheck(idx,delta,ctx={}){let gotWin=false, bank=false; setPlayers(ps=>ps.map((p,i)=>{if(i!==idx)return p; const b=titleBoost(p,ctx); const np=applyDelta(p,{...delta,cash:(delta.cash||0)+(b.cash||0),happy:(delta.happy||0)+(b.happy||0),honor:(delta.honor||0)+(b.honor||0)}); if(np.bankrupt>(p.bankrupt||0))bank=true; if(checkWin(np)){gotWin=true; setWinner(np); setStage('end');} return np;})); if(bank)addLog(`${players[idx].name} 現金歸零，自動宣告破產並重領 $10,000。`); if(gotWin)addLog(`${players[idx].name} 達成幸福目標，遊戲結束。`);}
  async function animateMove(steps){setMoving(true); for(let s=0;s<steps;s++){await sleep(280); updatePlayer(current,p=>{ if(p.route==='outer'){const next=(p.pos+1)%outerBoard.length; if(next===0){addLog(`${p.name} 經過發薪日，領取薪水 $${p.salary}。`); return applyDelta({...p,pos:next},{cash:p.salary});} return {...p,pos:next}; } const len=careerBoards[p.career].length; return {...p,careerPos:Math.min(p.careerPos+1,len-1)}; });} await sleep(120); setMoving(false);}
  async function moveAndResolve(steps){await animateMove(steps); setTimeout(()=>resolveLanding(),80);}
  function doRoll(){if(moving||event||prompt)return; const ds=roll(cp.route==='outer'?2:1); setDice(ds); addLog(`${displayName(cp)} 擲出 ${total(ds)} 點。`); moveAndResolve(total(ds));}
  function useExp(i){const card=cp.pocket.exp[i]; if(!card)return; updatePlayer(current,p=>({...p,pocket:{...p.pocket,exp:p.pocket.exp.filter((_,idx)=>idx!==i)}})); setPrompt(null); setDice([card.steps]); addLog(`${displayName(cp)} 使用「${card.title}」，前進 ${card.steps} 格。`); moveAndResolve(card.steps);}
  function resolveLanding(){const p=players[current]; if(!p)return; if(p.route==='career'){const cell=careerBoards[p.career][p.careerPos]; if(cell.type==='careerExit'){completeCareer(p.career);return;} if(cell.type==='chance'){drawChance();return;} const ev=pick(careerEvents[p.career]); applyAndCheck(current,ev[2],{career:p.career}); addLog(`${displayName(p)} 在「${p.career}」內圈遇到：${ev[0]}。`); showEvent(`${META[p.career].icon} ${p.career}事件：${ev[0]}`,`${ev[1]}${Object.keys(titleBoost(p,{career:p.career})).length?'\n\n目前頭銜觸發了額外加成。':''}`,'next'); return;}
    const cell=outerBoard[p.pos]; if(cell.type==='careerEntry'){setPrompt({type:'careerEntry',career:cell.career});return;} if(cell.type==='chance'){drawChance();return;} if(cell.type==='retire'){setPrompt({type:'retire'});return;} let delta={}; let title='平凡的一天', text='沒有特別的事情發生。';
    if(cell.type==='salary'){delta={salary:1000}; title='加薪機會'; text='薪水 +$1000。'}
    if(cell.type==='money'){delta={cash:2000}; title=cell.label; text='現金 +$2000。'}
    if(cell.type==='happy'||cell.type==='social'){delta={happy:2}; title=cell.label; text='快樂 +2。'}
    if(cell.type==='honor'){delta={honor:2}; title=cell.label; text='名譽 +2。'}
    applyAndCheck(current,delta,{type:cell.type==='money'?'money':cell.type}); addLog(`${displayName(p)} 抵達「${cell.label}」。`); showEvent(title,text,'next');
  }
  function drawChance(){const card=pick(chanceDeck); if(card.instant){applyAndCheck(current,card.instant,{type:'chance'}); addLog(`${displayName(cp)} 抽到機會卡「${card.title}」，立即生效。`); showEvent(`機會卡：${card.title}`,card.text,'next');} else {updatePlayer(current,p=>({...p,pocket:{...p.pocket,chance:[...p.pocket.chance,card]}})); addLog(`${displayName(cp)} 獲得機會卡「${card.title}」。`); showEvent(`獲得機會卡：${card.title}`,`${card.text}\n\n這張卡已放入人生口袋，可在你的回合使用或出售。`,'next');}}
  function enterCareer(career){const fee=(cp.careerExp[career]||0)>0?0:META[career].fee; applyAndCheck(current,{cash:-fee}); updatePlayer(current,p=>({...p,route:'career',career,careerPos:0})); setPrompt(null); addLog(`${displayName(cp)} 進入「${career}」職業道路${fee?'，支付入門費 $'+fee:'，因已有經驗免入門費'}。`); showEvent(`${META[career].icon} 進入${career}內圈`,`接下來改用單骰前進。走完出口後可獲得經驗卡，並選擇一項人生成就。`,'next');}
  function completeCareer(career){const exp=pick(expDeck); updatePlayer(current,p=>({...p,route:'outer',career:null,careerPos:0,pos:outerBoard.findIndex(c=>c.career===career),careerExp:{...p.careerExp,[career]:(p.careerExp[career]||0)+1},pocket:{...p.pocket,exp:[...p.pocket.exp,exp]},retirementRights:(p.careerExp[career]||0)+1>=3?p.retirementRights+1:p.retirementRights})); addLog(`${displayName(cp)} 完成一次「${career}」職業道路，返回外圈。`); setPrompt({type:'achievement',career});}
  function chooseAchievement(raw){const [label,title,position,delta,boost,desc]=raw; const item={id:randId(),label,title,position,delta,boost,desc}; updatePlayer(current,p=>applyDelta({...p,titles:[...p.titles,item],activeTitleId:item.id},delta)); setPrompt(null); addLog(`${displayName(cp)} 選擇成就「${label}」，獲得頭銜「${title}」。`); showEvent('人生里程碑',`你獲得成就：${label}\n頭銜效果：${desc}\n${deltaText(delta)}`,'next');}
  function inspectCard(type,i){const card=type==='exp'?cp.pocket.exp[i]:cp.pocket.chance[i]; setPrompt({type:'cardInfo',cardType:type,cardIndex:i,card});}
  function useChance(i,career=null){const card=cp.pocket.chance[i]; if(!card)return; if(card.kind==='gotoCareer'&&!career)return setPrompt({type:'chooseCareer',cardIndex:i}); if(card.kind==='experiencedCareer'&&!career)return setPrompt({type:'chooseExperiencedCareer',cardIndex:i}); updatePlayer(current,p=>({...p,pos:outerBoard.findIndex(c=>c.career===career),pocket:{...p.pocket,chance:p.pocket.chance.filter((_,idx)=>idx!==i)}})); setPrompt(null); addLog(`${displayName(cp)} 使用機會卡前往「${career}入口」。`); setPrompt({type:'careerEntry',career});}
  function sellChance(i){const card=cp.pocket.chance[i]; setPrompt({type:'confirmSell',cardIndex:i,card});}
  function confirmSell(i){const card=cp.pocket.chance[i]; updatePlayer(current,p=>applyDelta({...p,pocket:{...p.pocket,chance:p.pocket.chance.filter((_,idx)=>idx!==i)}},{cash:card.sell||1000})); setPrompt(null); addLog(`${displayName(cp)} 出售「${card.title}」，獲得 $${card.sell||1000}。`);}
  function equipTitle(id){updatePlayer(current,p=>({...p,activeTitleId:id}));}
  function clearTitle(){updatePlayer(current,p=>({...p,activeTitleId:null}));}
  function declareBankrupt(){updatePlayer(current,p=>({...p,cash:10000,wealth:10,happy:0,honor:0,pocket:{chance:[],exp:[]},bankrupt:(p.bankrupt||0)+1})); addLog(`${displayName(cp)} 宣告破產，重領 $10,000。`); nextTurn();}
  function retireVacation(){if(cp.retirementRights<=0){showEvent('無法使用退休權','目前尚未取得退休權。完成同一職業三次可取得退休權。');return;} updatePlayer(current,p=>applyDelta({...p,retirementRights:p.retirementRights-1,pos:21},{happy:6,cash:p.salary})); setPrompt(null); addLog(`${displayName(cp)} 使用退休權前往日月潭渡假。`); showEvent('日月潭渡假','快樂 +6，並領取一次薪水。','next');}
  return <div className="app"><audio ref={audioRef} src="/bgm.wav"/><header><h1>幸福人 Classic <span>2.4 中央人生舞台版</span></h1><div><button onClick={()=>setMusic(!music)}>{music?'🔊 音樂開':'🔇 音樂關'}</button><button onClick={reset}>重新開始</button></div></header>{stage==='setup'&&<Setup players={players} setCount={setCount} updatePlayer={updatePlayer} startGame={startGame}/>} {stage==='game'&&<><Recent log={log}/><Board players={players} cp={cp} dice={dice} moving={moving} prompt={prompt} event={event} doRoll={doRoll} useExp={useExp} useChance={useChance} sellChance={sellChance} equipTitle={equipTitle} clearTitle={clearTitle} declareBankrupt={declareBankrupt} retireVacation={retireVacation} inspectCard={inspectCard}/><Players players={players} current={current}/></>} {stage==='end'&&<End winner={winner} players={players} reset={reset}/>} {prompt&&<Prompt prompt={prompt} cp={cp} enterCareer={enterCareer} setPrompt={setPrompt} nextTurn={nextTurn} useChance={useChance} retireVacation={retireVacation} confirmSell={confirmSell} chooseAchievement={chooseAchievement} useExp={useExp} sellChance={sellChance}/>} {event&&<EventModal event={event} confirm={confirmEvent}/>}</div>;
}
function Setup({players,setCount,updatePlayer,startGame}){return <div className="setup card"><h2>建立玩家</h2><label>玩家人數 <select value={players.length} onChange={e=>setCount(+e.target.value)}>{[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></label><div className="setupGrid">{players.map((p,i)=><div className="playerSetup" key={p.id}><input value={p.name} onChange={e=>updatePlayer(i,p=>({...p,name:e.target.value}))}/><div className="animals">{ANIMALS.map(a=><button key={a} className={p.animal===a?'sel':''} onClick={()=>updatePlayer(i,p=>({...p,animal:a}))}>{a}</button>)}</div><Target p={p} update={t=>updatePlayer(i,p=>({...p,target:t}))}/><button onClick={()=>updatePlayer(i,p=>({...p,targetLocked:!p.targetLocked}))}>{p.targetLocked?'已鎖定目標':'鎖定幸福目標'}</button></div>)}</div><button className="primary" onClick={startGame}>開始遊戲</button></div>}
function Target({p,update}){const t=p.target.wealth+p.target.happy+p.target.honor; const set=(k,v)=>update({...p.target,[k]:+v}); return <div className="target"><b>幸福目標：{t}/60</b><label>財富 <input disabled={p.targetLocked} type="number" value={p.target.wealth} onChange={e=>set('wealth',e.target.value)}/></label><label>快樂 <input disabled={p.targetLocked} type="number" value={p.target.happy} onChange={e=>set('happy',e.target.value)}/></label><label>名譽 <input disabled={p.targetLocked} type="number" value={p.target.honor} onChange={e=>set('honor',e.target.value)}/></label></div>}
function Recent({log}){return <div className="recent"><b>最近紀錄</b>{log.map((l,i)=><p key={i}>{l}</p>)}</div>}
function Board(props){const {players,cp}=props;return <div className="outerBoard">{outerBoard.map((cell,i)=><div key={i} className={cellClass(cell.type)+(cp.route==='outer'&&cp.pos===i?' currentCell':'')} style={{gridColumn:coords[i][1]+1,gridRow:coords[i][0]+1}}><small>{i}</small><b>{cell.label}</b><div className="tokens">{players.filter(p=>p.route==='outer'&&p.pos===i).map(p=><span key={p.id}>{p.animal}</span>)}</div></div>)}<div className="centerStage"><ControlPanel {...props}/><Wallet {...props}/></div></div>}
function ControlPanel({cp,dice,moving,prompt,event,doRoll,retireVacation,declareBankrupt}){return <section className="control card"><h2>目前回合：{cp.animal} {displayName(cp)}</h2><div className="bigDice">{dice.length?dice.map((d,i)=><span key={i}>{diceFace(d)}</span>):'等待擲骰'}</div><p className="mode">{cp.route==='outer'?'外圈：雙骰':'內圈：單骰'}{moving?'｜逐格移動中':''}</p>{cp.route==='career'&&<CareerStage player={cp}/>}<div className="actions"><button className="primary" disabled={moving||prompt||event} onClick={doRoll}>擲骰前進</button><button onClick={retireVacation}>使用退休權去度假</button><button onClick={declareBankrupt}>宣告破產</button></div></section>}
function CareerStage({player}){const cells=careerBoards[player.career]||[];return <div className="careerStage" style={{background:META[player.career].color}}><h3>{META[player.career].icon} {player.career}內圈</h3><div className="careerTrack">{cells.map((c,i)=><span key={i} className={(i===player.careerPos?'here ':'')+c.type}><em>{i}</em>{i===player.careerPos?player.animal:''}<small>{c.label}</small></span>)}</div></div>}
function Wallet({cp,useExp,useChance,sellChance,equipTitle,clearTitle,inspectCard,moving,prompt,event}){const locked=moving||prompt||event;return <section className="wallet card"><h3>人生皮夾</h3><div className="stats"><b>${cp.cash}</b><span>薪水 ${cp.salary}</span><span>財富 {cp.wealth}</span><span>快樂 {cp.happy}</span><span>名譽 {cp.honor}</span></div><h3>人生頭銜</h3><div className="titles"><button onClick={clearTitle} className={!cp.activeTitleId?'sel':''}>不掛頭銜</button>{cp.titles.map(t=><button key={t.id} className={cp.activeTitleId===t.id?'sel':''} onClick={()=>equipTitle(t.id)}>{t.position==='suffix'?cp.name+t.title:t.title+cp.name}</button>)}</div><h3>經驗卡</h3>{cp.pocket.exp.length===0?<p className="empty">無</p>:cp.pocket.exp.map((c,i)=><div className="item" key={i}><button className="cardTitle" onClick={()=>inspectCard('exp',i)}>{c.title}</button><button disabled={locked} onClick={()=>useExp(i)}>使用</button></div>)}<h3>機會卡</h3>{cp.pocket.chance.length===0?<p className="empty">無</p>:cp.pocket.chance.map((c,i)=><div className="item" key={i}><button className="cardTitle" onClick={()=>inspectCard('chance',i)}>{c.title}</button><button disabled={locked} onClick={()=>useChance(i)}>使用</button><button disabled={locked} onClick={()=>sellChance(i)}>出售</button></div>)}</section>}
function Players({players,current}){return <div className="players">{players.map((p,i)=><div key={p.id} className={'miniPlayer '+(i===current?'active':'')}><b>{p.animal} {displayName(p)}</b><p>${p.cash}｜財{p.wealth} 快{p.happy} 名{p.honor}</p><p>{p.route==='outer'?'外圈':'內圈：'+p.career}</p></div>)}</div>}
function EventModal({event,confirm}){return <div className="modal"><div className="modalBox eventBox"><h2>{event.title}</h2>{String(event.text).split('\n').map((t,i)=><p key={i}>{t}</p>)}<button className="primary" onClick={confirm}>確認</button></div></div>}
function Prompt({prompt,cp,enterCareer,setPrompt,nextTurn,useChance,retireVacation,confirmSell,chooseAchievement,useExp,sellChance}){const experienced=Object.keys(cp.careerExp).filter(k=>cp.careerExp[k]>0);return <div className="modal"><div className="modalBox"><h2>{prompt.type==='achievement'?'人生里程碑':prompt.type==='confirmSell'?'出售確認':prompt.type==='cardInfo'?'卡片說明':'路口選擇'}</h2>{prompt.type==='careerEntry'&&<><p>是否進入「{prompt.career}」職業道路？</p><div className="notice"><b>入門費：</b>{(cp.careerExp[prompt.career]||0)>0?'已有職業經驗，免入門費':`$${META[prompt.career].fee}`}<br/><b>資格：</b>無特殊資格限制。現金扣到 0 會自動破產。<br/><b>規則：</b>進入內圈後使用單骰，走完出口後取得經驗卡並選擇一項成就頭銜。</div><button className="primary" onClick={()=>enterCareer(prompt.career)}>進入</button><button onClick={()=>{setPrompt(null);nextTurn();}}>略過</button></>}{prompt.type==='chooseCareer'&&<>{CAREERS.map(c=><button key={c} onClick={()=>useChance(prompt.cardIndex,c)}>{META[c].icon} {c}</button>)}<button onClick={()=>setPrompt(null)}>取消</button></>}{prompt.type==='chooseExperiencedCareer'&&<>{experienced.length?experienced.map(c=><button key={c} onClick={()=>useChance(prompt.cardIndex,c)}>{META[c].icon} {c}</button>):<p>尚無職業經驗，不能使用此卡。</p>}<button onClick={()=>setPrompt(null)}>取消</button></>}{prompt.type==='retire'&&<><p>可使用退休權去度假。</p><button onClick={retireVacation}>使用</button><button onClick={()=>{setPrompt(null);nextTurn();}}>略過</button></>}{prompt.type==='cardInfo'&&<><p><b>{prompt.card.title}</b></p><div className="notice">{prompt.card.text}<br/>{prompt.cardType==='exp'?`效果：可取代擲骰，直接前進 ${prompt.card.steps} 格。`:`出售價值：$${prompt.card.sell||1000}`}</div>{prompt.cardType==='exp'?<button className="primary" onClick={()=>useExp(prompt.cardIndex)}>使用這張經驗卡</button>:<><button className="primary" onClick={()=>useChance(prompt.cardIndex)}>使用這張機會卡</button><button onClick={()=>sellChance(prompt.cardIndex)}>出售這張機會卡</button></>}<button onClick={()=>setPrompt(null)}>關閉</button></>}{prompt.type==='confirmSell'&&<><p>出售機會卡：<b>{prompt.card.title}</b></p><p>可售出金額：<b>${prompt.card.sell||1000}</b></p><button className="primary" onClick={()=>confirmSell(prompt.cardIndex)}>確認出售</button><button onClick={()=>setPrompt(null)}>取消</button></>}{prompt.type==='achievement'&&<><p>完成「{prompt.career}」職業道路，請選擇一項成就。成就會變成可裝備的人生頭銜。</p>{ACHIEVEMENTS[prompt.career].map((a,i)=><button key={i} className="achievementBtn" onClick={()=>chooseAchievement(a)}><b>{a[0]}</b><br/><span>{a[2]==='suffix'?cp.name+a[1]:a[1]+cp.name}</span><small>{a[5]}</small></button>)}</>}</div></div>}
function End({winner,players,reset}){return <div className="end card"><h1>🏆 幸福人產生</h1><h2>{winner?.animal} {winner?displayName(winner):''} 達成預定幸福目標</h2>{players.map(p=><div className="result" key={p.id}><b>{p.animal} {displayName(p)}</b><p>目標：財富{p.target.wealth} 快樂{p.target.happy} 名譽{p.target.honor}</p><p>結果：財富{p.wealth} 快樂{p.happy} 名譽{p.honor}</p></div>)}<button onClick={reset}>重新開始</button></div>}
createRoot(document.getElementById('root')).render(<App/>);
