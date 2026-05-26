import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const ANIMALS = ['🐱','🐶','🦊','🐼','🐧','🐸','🦁','🐰','🐵','🐯','🐻','🐨'];
const CAREERS = ['學院','農墾','企業','航海','月球探險','電影明星','從政','開礦'];
const careerMeta = {
  學院: { icon:'🎓', fee: 1000, color:'#fff7d6', style:'honor' },
  農墾: { icon:'🌾', fee: 1000, color:'#ecffd9', style:'happy' },
  企業: { icon:'🏢', fee: 2000, color:'#e6f4ff', style:'money' },
  航海: { icon:'⚓', fee: 2000, color:'#e7fbff', style:'risk' },
  月球探險: { icon:'🌙', fee: 3000, color:'#eeeaff', style:'risk' },
  電影明星: { icon:'🎬', fee: 2000, color:'#ffe9f2', style:'honor' },
  從政: { icon:'🏛️', fee: 2000, color:'#fff1df', style:'honor' },
  開礦: { icon:'⛏️', fee: 2000, color:'#f5eee6', style:'money' }
};

const outerBoard = [
  {label:'發薪日', type:'start'}, {label:'一般', type:'normal'}, {label:'機會', type:'chance'}, {label:'學院入口', type:'careerEntry', career:'學院'}, {label:'社交', type:'social'}, {label:'農墾入口', type:'careerEntry', career:'農墾'}, {label:'機會', type:'chance'}, {label:'投資', type:'money'},
  {label:'企業入口', type:'careerEntry', career:'企業'}, {label:'一般', type:'normal'}, {label:'航海入口', type:'careerEntry', career:'航海'}, {label:'家庭', type:'happy'}, {label:'機會', type:'chance'}, {label:'月球入口', type:'careerEntry', career:'月球探險'}, {label:'健康', type:'happy'}, {label:'電影入口', type:'careerEntry', career:'電影明星'},
  {label:'一般', type:'normal'}, {label:'從政入口', type:'careerEntry', career:'從政'}, {label:'機會', type:'chance'}, {label:'開礦入口', type:'careerEntry', career:'開礦'}, {label:'買房', type:'money'}, {label:'旅行', type:'happy'}, {label:'退休規劃', type:'retire'}, {label:'機會', type:'chance'},
  {label:'公益', type:'honor'}, {label:'一般', type:'normal'}, {label:'進修', type:'honor'}, {label:'加薪', type:'salary'}
];

const careerBoards = Object.fromEntries(CAREERS.map((c, ci)=>[c, Array.from({length: 12 + (ci % 4)}, (_,i)=>({
  label: i===0?'入口': i===11+(ci%4)?'出口': `${c}${i}`,
  type: i===0?'careerStart': i===11+(ci%4)?'careerExit': ['gain','risk','chance','gain','normal'][i%5]
}))]));

const chanceDeckBase = [
  {title:'貴人指路', text:'可保留。使用後可直接前往任一職業入口。', sell:1000, kind:'gotoCareer'},
  {title:'意外獎金', text:'立刻獲得 $3000。', sell:0, instant:{cash:3000}},
  {title:'稅金補繳', text:'立刻支付 $2000。', sell:0, instant:{cash:-2000}},
  {title:'受邀演講', text:'名譽 +3。', sell:0, instant:{honor:3}},
  {title:'家庭聚會', text:'快樂 +3。', sell:0, instant:{happy:3}},
  {title:'職涯捷徑', text:'可保留。使用後前往自己曾有經驗的職業入口，免入門費。', sell:1000, kind:'experiencedCareer'}
];
const expDeckBase = [
  {title:'經驗卡：穩健前進', text:'取代擲骰，前進 3 格。', steps:3},
  {title:'經驗卡：精準時機', text:'取代擲骰，前進 5 格。', steps:5},
  {title:'經驗卡：臨門一腳', text:'取代擲骰，前進 1 格。', steps:1},
  {title:'經驗卡：大步人生', text:'取代擲骰，前進 6 格。', steps:6}
];

function mkPlayer(i){return {id:crypto.randomUUID(), name:`玩家${i+1}`, animal:ANIMALS[i], cash:1000, salary:1000, wealth:1, happy:0, honor:0, target:{wealth:20,happy:20,honor:20}, targetLocked:false, route:'outer', pos:0, career:null, careerPos:0, careerExp:{}, completedCareers:[], retirementRights:0, pocket:{chance:[], exp:[]}, bankrupt:0};}
function clamp(n){return Math.max(0,n)}
function applyDelta(p,d={}){ const np={...p}; if(d.cash) np.cash += d.cash; if(d.happy) np.happy=clamp(np.happy+d.happy); if(d.honor) np.honor=clamp(np.honor+d.honor); np.wealth=Math.floor(Math.max(0,np.cash)/1000); if(d.salary) np.salary=clamp(np.salary+d.salary); return np; }
function roll(n){ return Array.from({length:n},()=>1+Math.floor(Math.random()*6)); }
function sum(a){return a.reduce((x,y)=>x+y,0)}
function cellClass(t){ return 'cell '+(t==='chance'?'chance':t==='careerEntry'?'entry':t==='start'?'start':t==='retire'?'retire':''); }
function checkWin(p){ return p.wealth>=p.target.wealth && p.happy>=p.target.happy && p.honor>=p.target.honor; }
function shuffle(arr){ return [...arr].sort(()=>Math.random()-.5); }

function App(){
  const [stage,setStage]=useState('setup');
  const [players,setPlayers]=useState(()=>[mkPlayer(0)]);
  const [current,setCurrent]=useState(0);
  const [log,setLog]=useState(['歡迎來到幸福人 Classic 2.0 Alpha']);
  const [dice,setDice]=useState([]);
  const [moving,setMoving]=useState(false);
  const [prompt,setPrompt]=useState(null);
  const [winner,setWinner]=useState(null);
  const [music,setMusic]=useState(false);
  const audioRef=useRef(null);

  useEffect(()=>{ const saved=localStorage.getItem('happy-person-v2'); if(saved){ try{const s=JSON.parse(saved); if(s.players) {setPlayers(s.players);setCurrent(s.current||0);setStage(s.stage||'setup');setLog(s.log||[]);setWinner(s.winner||null)}}catch{} }},[]);
  useEffect(()=>{ localStorage.setItem('happy-person-v2',JSON.stringify({players,current,stage,log,winner}));},[players,current,stage,log,winner]);
  useEffect(()=>{ if(audioRef.current){ audioRef.current.loop=true; music?audioRef.current.play().catch(()=>{}):audioRef.current.pause();}},[music]);
  const cp=players[current];
  const addLog=(m)=>setLog(l=>[m,...l].slice(0,10));
  const setCount=(n)=>setPlayers(Array.from({length:n},(_,i)=>players[i]||mkPlayer(i)));
  const updatePlayer=(idx, fn)=>setPlayers(ps=>ps.map((p,i)=>i===idx?fn(p):p));
  const startGame=()=>{ if(players.some(p=>!p.targetLocked)){ alert('請先鎖定每位玩家的幸福目標'); return;} setStage('game'); addLog('遊戲開始：外圈雙骰，內圈單骰。'); };
  const reset=()=>{ if(confirm('確定重新開始？目前進度會清除。')){localStorage.removeItem('happy-person-v2'); location.reload();}};
  const nextTurn=()=>{ setCurrent(i=>(i+1)%players.length); setDice([]); setPrompt(null); };
  const payday=(idx)=> updatePlayer(idx,p=>applyDelta(p,{cash:p.salary}));
  const processCell=(idx)=>{
    let p=players[idx];
    if(p.route==='outer'){
      const cell=outerBoard[p.pos];
      addLog(`${p.animal} ${p.name} 抵達「${cell.label}」。`);
      if(cell.type==='chance') return drawChance(idx);
      if(cell.type==='careerEntry') return setPrompt({type:'careerEntry', career:cell.career});
      if(cell.type==='money') updatePlayer(idx,p=>applyDelta(p,{cash:2000}));
      if(cell.type==='happy') updatePlayer(idx,p=>applyDelta(p,{happy:2}));
      if(cell.type==='honor') updatePlayer(idx,p=>applyDelta(p,{honor:2}));
      if(cell.type==='salary') updatePlayer(idx,p=>applyDelta(p,{salary:1000,cash:1000}));
      if(cell.type==='retire') setPrompt({type:'retire'});
      setTimeout(()=>afterAction(idx),50);
    } else {
      const ccell=careerBoards[p.career][p.careerPos];
      addLog(`${p.animal} ${p.name} 在「${p.career}」內圈抵達「${ccell.label}」。`);
      if(ccell.type==='chance') return drawChance(idx);
      if(ccell.type==='gain') updatePlayer(idx,p=>careerGain(p));
      if(ccell.type==='risk') updatePlayer(idx,p=>careerRisk(p));
      if(ccell.type==='careerExit') return completeCareer(idx);
      setTimeout(()=>afterAction(idx),50);
    }
  };
  const afterAction=(idx)=> setTimeout(()=>{
    const p=players[idx];
    const real=players[idx];
    if(checkWin(real)){ setWinner(real); setStage('end'); addLog(`${real.name} 達成幸福目標，遊戲結束！`); return; }
    nextTurn();
  },150);
  const careerGain=(p)=>{ const style=careerMeta[p.career]?.style; if(style==='money') return applyDelta(p,{cash:3000}); if(style==='happy') return applyDelta(p,{happy:3,cash:1000}); if(style==='honor') return applyDelta(p,{honor:3,cash:1000}); return applyDelta(p,{cash:3000,honor:1,happy:-1}); };
  const careerRisk=(p)=>{ const style=careerMeta[p.career]?.style; if(style==='risk') return applyDelta(p,{cash:-2000,happy:-2,honor:2}); return applyDelta(p,{cash:-1000,happy:-1}); };
  const moveSteps=async(idx, steps)=>{
    setMoving(true); setPrompt(null);
    for(let s=0;s<steps;s++){
      await new Promise(r=>setTimeout(r,300));
      setPlayers(ps=>ps.map((p,i)=>{
        if(i!==idx) return p;
        if(p.route==='outer'){
          const next=(p.pos+1)%outerBoard.length;
          let np={...p,pos:next};
          if(next===0){ np=applyDelta(np,{cash:np.salary}); setTimeout(()=>addLog(`${np.name} 經過發薪日，領取薪水 $${np.salary}。`),0); }
          return np;
        } else {
          const len=careerBoards[p.career].length;
          return {...p, careerPos: Math.min(p.careerPos+1, len-1)};
        }
      }));
    }
    setMoving(false); setTimeout(()=>processCell(idx),50);
  };
  const doRoll=()=>{ if(moving||prompt) return; const n=cp.route==='outer'?2:1; const d=roll(n); setDice(d); addLog(`${cp.name} 擲出 ${d.join(' + ')} = ${sum(d)}。`); moveSteps(current,sum(d)); };
  const drawChance=(idx)=>{ const card=shuffle(chanceDeckBase)[0]; addLog(`${players[idx].name} 抽到機會卡：「${card.title}」。`); if(card.instant){ updatePlayer(idx,p=>applyDelta(p,card.instant)); setTimeout(()=>afterAction(idx),100); } else { updatePlayer(idx,p=>({...p,pocket:{...p.pocket,chance:[...p.pocket.chance,card]}})); setTimeout(()=>afterAction(idx),100); } };
  const drawExp=(idx)=>{ const card=shuffle(expDeckBase)[0]; updatePlayer(idx,p=>({...p,pocket:{...p.pocket,exp:[...p.pocket.exp,card]}})); addLog(`${players[idx].name} 獲得經驗卡：「${card.title}」。`); };
  const enterCareer=(career)=>{ updatePlayer(current,p=>{ const has=(p.careerExp[career]||0)>0; const fee=has?0:careerMeta[career].fee; let np=applyDelta(p,{cash:-fee}); return {...np,route:'career',career,careerPos:0};}); addLog(`${cp.name} 進入「${career}」內圈。${(cp.careerExp[career]||0)>0?'已有經驗，免入門費。':'支付入門費。'}`); setPrompt(null); setTimeout(()=>nextTurn(),100); };
  const completeCareer=(idx)=>{ updatePlayer(idx,p=>{ const count=(p.careerExp[p.career]||0)+1; let np={...p, careerExp:{...p.careerExp,[p.career]:count}, completedCareers:[...p.completedCareers,p.career], route:'outer', career:null, careerPos:0, pos:(p.pos+1)%outerBoard.length}; if(count<=3) setTimeout(()=>drawExp(idx),0); if(count===3) np.retirementRights=(np.retirementRights||0)+1; return np;}); addLog(`${players[idx].name} 完成一次職業道路，返回外圈。`); setTimeout(()=>afterAction(idx),150); };
  const useExp=(cardIndex)=>{ const card=cp.pocket.exp[cardIndex]; updatePlayer(current,p=>({...p,pocket:{...p.pocket,exp:p.pocket.exp.filter((_,i)=>i!==cardIndex)}})); addLog(`${cp.name} 使用「${card.title}」，前進 ${card.steps} 格。`); moveSteps(current,card.steps); };
  const sellChance=(i)=>{ const card=cp.pocket.chance[i]; updatePlayer(current,p=>applyDelta({...p,pocket:{...p.pocket,chance:p.pocket.chance.filter((_,idx)=>idx!==i)}},{cash:card.sell||1000})); addLog(`${cp.name} 出售機會卡「${card.title}」。`); };
  const useChance=(i, career=null)=>{ const card=cp.pocket.chance[i]; if(card.kind==='experiencedCareer' && !career){ setPrompt({type:'chooseExperiencedCareer', cardIndex:i}); return; } if(card.kind==='gotoCareer' && !career){ setPrompt({type:'chooseCareer', cardIndex:i}); return; } updatePlayer(current,p=>({...p, pos: outerBoard.findIndex(c=>c.career===career), pocket:{...p.pocket,chance:p.pocket.chance.filter((_,idx)=>idx!==i)}})); addLog(`${cp.name} 使用機會卡前往「${career}入口」。`); setPrompt({type:'careerEntry',career}); };
  const declareBankrupt=()=>{ updatePlayer(current,p=>({...mkPlayer(current), id:p.id, name:p.name, animal:p.animal, target:p.target, targetLocked:true, bankrupt:(p.bankrupt||0)+1})); addLog(`${cp.name} 宣告破產，重新領取 $1000。`); nextTurn(); };
  const retireVacation=()=>{ if(cp.retirementRights<=0) return alert('尚無退休權'); updatePlayer(current,p=>applyDelta({...p,retirementRights:p.retirementRights-1,pos:21},{happy:6,cash:p.salary})); addLog(`${cp.name} 使用退休權前往日月潭渡假，快樂 +6。`); setPrompt(null); setTimeout(()=>afterAction(current),100); };

  return <div className="app">
    <audio ref={audioRef} src="/bgm.wav" />
    <header><h1>幸福人 Classic <span>2.0 Alpha</span></h1><div><button onClick={()=>setMusic(!music)}>{music?'🔊 音樂開':'🔇 音樂關'}</button><button onClick={reset}>重新開始</button></div></header>
    {stage==='setup' && <Setup players={players} setPlayers={setPlayers} setCount={setCount} updatePlayer={updatePlayer} startGame={startGame}/>} 
    {stage==='game' && <main className="game"><section className="left"><Recent log={log}/><Board players={players}/><CareerMaps players={players}/></section><aside><TurnPanel cp={cp} dice={dice} moving={moving} doRoll={doRoll} useExp={useExp} useChance={useChance} sellChance={sellChance} declareBankrupt={declareBankrupt} retireVacation={retireVacation}/><Players players={players} current={current}/></aside></main>}
    {stage==='end' && <End winner={winner} players={players} reset={reset}/>} 
    {prompt && <Prompt prompt={prompt} cp={cp} enterCareer={enterCareer} setPrompt={setPrompt} nextTurn={nextTurn} useChance={useChance} retireVacation={retireVacation}/>} 
  </div>
}
function Setup({players,setPlayers,setCount,updatePlayer,startGame}){return <div className="setup card"><h2>建立玩家</h2><label>玩家人數 <select value={players.length} onChange={e=>setCount(+e.target.value)}>{[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></label><div className="setupGrid">{players.map((p,i)=><div className="playerSetup" key={p.id}><input value={p.name} onChange={e=>updatePlayer(i,p=>({...p,name:e.target.value}))}/><div className="animals">{ANIMALS.slice(0,8).map(a=><button className={p.animal===a?'sel':''} onClick={()=>updatePlayer(i,p=>({...p,animal:a}))}>{a}</button>)}</div><Target p={p} update={(t)=>updatePlayer(i,p=>({...p,target:t}))}/><button onClick={()=>updatePlayer(i,p=>({...p,targetLocked:!p.targetLocked}))}>{p.targetLocked?'已鎖定目標':'鎖定幸福目標'}</button></div>)}</div><button className="primary" onClick={startGame}>開始遊戲</button></div>}
function Target({p,update}){ const total=p.target.wealth+p.target.happy+p.target.honor; const set=(k,v)=>update({...p.target,[k]:+v}); return <div className="target"><b>幸福目標：{total}/60</b><label>財富 <input disabled={p.targetLocked} type="number" value={p.target.wealth} onChange={e=>set('wealth',e.target.value)}/></label><label>快樂 <input disabled={p.targetLocked} type="number" value={p.target.happy} onChange={e=>set('happy',e.target.value)}/></label><label>名譽 <input disabled={p.targetLocked} type="number" value={p.target.honor} onChange={e=>set('honor',e.target.value)}/></label></div>}
function Recent({log}){return <div className="recent"><b>最近紀錄</b>{log.map((l,i)=><p key={i}>{l}</p>)}</div>}
function Board({players}){ const slots = Array.from({length:49},()=>null); const coords=[]; for(let c=0;c<8;c++) coords.push([0,c]); for(let r=1;r<6;r++) coords.push([r,7]); for(let c=6;c>=0;c--) coords.push([5,c]); for(let r=4;r>=1;r--) coords.push([r,0]); // 26, extend mapped proportion
 return <div className="outerBoard">{outerBoard.map((cell,i)=><div key={i} className={cellClass(cell.type)} style={{gridColumn:coords[i%coords.length][1]+1,gridRow:coords[i%coords.length][0]+1}}><small>{i}</small><b>{cell.label}</b><div className="tokens">{players.filter(p=>p.route==='outer'&&p.pos===i).map(p=><span>{p.animal}</span>)}</div></div>)}</div>}
function CareerMaps({players}){return <div className="careerWrap">{CAREERS.map(c=><div className="careerMap" style={{background:careerMeta[c].color}}><b>{careerMeta[c].icon} {c}</b><div className="miniCells">{careerBoards[c].map((cell,i)=><span className={cell.type}>{i}<em>{players.filter(p=>p.route==='career'&&p.career===c&&p.careerPos===i).map(p=>p.animal).join('')}</em></span>)}</div></div>)}</div>}
function TurnPanel({cp,dice,moving,doRoll,useExp,useChance,sellChance,declareBankrupt,retireVacation}){return <div className="card turn"><h2>目前回合：{cp.animal} {cp.name}</h2><div className="dice">{dice.length?dice.map(d=><span>{['⚀','⚁','⚂','⚃','⚄','⚅'][d-1]}</span>):'等待擲骰'}</div><p>{cp.route==='outer'?'外圈：雙骰':'內圈：單骰'} {moving?'｜棋子移動中':''}</p><button className="primary" disabled={moving} onClick={doRoll}>擲骰前進</button><button onClick={retireVacation}>使用退休權去度假</button><button onClick={declareBankrupt}>宣告破產</button><h3>人生口袋</h3><p>現金 ${cp.cash}｜薪水 ${cp.salary}</p><p>財富 {cp.wealth}｜快樂 {cp.happy}｜名譽 {cp.honor}</p><b>經驗卡</b>{cp.pocket.exp.length===0?<p>無</p>:cp.pocket.exp.map((c,i)=><div className="item"><span>{c.title}</span><button disabled={moving} onClick={()=>useExp(i)}>使用</button></div>)}<b>機會卡</b>{cp.pocket.chance.length===0?<p>無</p>:cp.pocket.chance.map((c,i)=><div className="item"><span>{c.title}</span><button disabled={moving} onClick={()=>useChance(i)}>使用</button><button onClick={()=>sellChance(i)}>出售</button></div>)}</div>}
function Players({players,current}){return <div className="players">{players.map((p,i)=><div className={'miniPlayer '+(i===current?'active':'')}><b>{p.animal} {p.name}</b><p>${p.cash}｜財{p.wealth} 快{p.happy} 名{p.honor}</p><p>{p.route==='outer'?'外圈':'內圈：'+p.career}</p><p>經驗：{Object.entries(p.careerExp).map(([k,v])=>`${k}×${v}`).join('、')||'無'}</p></div>)}</div>}
function Prompt({prompt,cp,enterCareer,setPrompt,nextTurn,useChance,retireVacation}){ const experienced=Object.keys(cp.careerExp).filter(k=>cp.careerExp[k]>0); return <div className="modal"><div className="modalBox"><h2>路口選擇</h2>{prompt.type==='careerEntry'&&<><p>是否進入「{prompt.career}」職業道路？</p><button className="primary" onClick={()=>enterCareer(prompt.career)}>進入</button><button onClick={()=>{setPrompt(null);nextTurn();}}>略過</button></>}{prompt.type==='chooseCareer'&&<>{CAREERS.map(c=><button onClick={()=>useChance(prompt.cardIndex,c)}>{c}</button>)}</>}{prompt.type==='chooseExperiencedCareer'&&<>{experienced.length?experienced.map(c=><button onClick={()=>useChance(prompt.cardIndex,c)}>{c}</button>):<p>尚無職業經驗，不能使用此卡。</p>}<button onClick={()=>setPrompt(null)}>取消</button></>}{prompt.type==='retire'&&<><p>可使用退休權去度假。</p><button onClick={retireVacation}>使用</button><button onClick={()=>{setPrompt(null);nextTurn();}}>略過</button></>}</div></div>}
function End({winner,players,reset}){return <div className="end card"><h1>🏆 幸福人產生</h1><h2>{winner?.animal} {winner?.name} 達成預定幸福目標</h2>{players.map(p=><div className="result"><b>{p.animal} {p.name}</b><p>目標：財富{p.target.wealth} 快樂{p.target.happy} 名譽{p.target.honor}</p><p>結果：財富{p.wealth} 快樂{p.happy} 名譽{p.honor}</p></div>)}<button onClick={reset}>重新開始</button></div>}
createRoot(document.getElementById('root')).render(<App/>);
