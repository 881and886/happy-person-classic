import React, { useMemo, useState } from 'react';
import { Dice6, RotateCcw, Lock, Trophy, Sparkles } from 'lucide-react';

const ANIMALS = ['🐱','🐶','🦊','🐼','🐧','🐸','🦁','🐰','🐵','🐨','🐯','🐮'];

const BOARD = [
  '起點','一般','機會','求學','一般','工作','機會','社交','一般','投資',
  '機會','家庭','一般','升遷','機會','休閒','一般','進修','機會','創業',
  '一般','婚姻','機會','健康','一般','從政','機會','航海','一般','買房',
  '機會','公益','一般','加薪','機會','旅行','一般','退休規劃','機會','終點'
];

const CHANCE_CARDS = [
  { title: '保送大學', type: '職業捷徑', text: '你獲得進入大學道路的機會。', effects: { reputation: 4, happiness: 1 }, status: { education: '大學' } },
  { title: '受到地方人士賞識', type: '職業捷徑', text: '你開始累積從政人脈。', effects: { reputation: 6, happiness: -2 }, status: { career: '從政新人' } },
  { title: '遠洋工作機會', type: '職業捷徑', text: '你踏上航海職業道路。', effects: { wealth: 6, happiness: -1 }, status: { career: '航海人員' } },
  { title: '投資獲利', type: '財務事件', text: '你眼光精準，獲得一筆收益。', effects: { wealth: 8 } },
  { title: '補繳稅金', type: '財務事件', text: '收到稅務通知，必須補繳費用。', effects: { wealth: -6, happiness: -1 } },
  { title: '家庭旅遊', type: '成就加成', text: '難得與家人出遊，留下美好回憶。', effects: { happiness: 6, wealth: -2 } },
  { title: '社區表揚', type: '成就加成', text: '你長期協助地方事務，獲得公開表揚。', effects: { reputation: 5, happiness: 2 } },
  { title: '老同學邀請創業', type: '人生選擇', text: '你加入創業團隊，前途未卜但充滿可能。', effects: { wealth: 4, reputation: 2, happiness: -2 }, status: { career: '創業者' } },
  { title: '健康亮紅燈', type: '突發事件', text: '工作太忙導致身體不適，需要休養。', effects: { wealth: -3, happiness: -4 } },
  { title: '意外中獎', type: '財務事件', text: '你中了小獎，獲得意外之財。', effects: { wealth: 10, happiness: 2 } },
  { title: '升任課長', type: '成就加成', text: '你的努力被看見，職位提升。', effects: { wealth: 5, reputation: 4, happiness: -1 }, salary: 1, status: { career: '課長' } },
  { title: '找到興趣', type: '成就加成', text: '你找到真正喜歡的事，生活更有方向。', effects: { happiness: 7, wealth: -1 } },
  { title: '被倒會', type: '財務事件', text: '朋友會錢出問題，你損失一筆錢。', effects: { wealth: -8, happiness: -3 } },
  { title: '子女出生', type: '家庭事件', text: '家庭迎來新成員。', effects: { happiness: 5, wealth: -4 }, child: 1, status: { family: '有子女' } },
  { title: '媒體採訪', type: '成就加成', text: '你的故事受到媒體注意。', effects: { reputation: 8, happiness: 1 } },
  { title: '車禍維修', type: '突發事件', text: '突發交通事故，幸好人平安。', effects: { wealth: -5, happiness: -2 } },
  { title: '貴人相助', type: '機會', text: '關鍵時刻有人伸出援手。', effects: { wealth: 3, reputation: 3, happiness: 3 } },
  { title: '出國深造', type: '職業捷徑', text: '你獲得出國進修機會。', effects: { reputation: 5, happiness: 2, wealth: -4 }, status: { education: '海外進修' } },
  { title: '家庭爭執', type: '家庭事件', text: '家庭關係出現摩擦，需要時間修復。', effects: { happiness: -5, reputation: -1 } },
  { title: '長輩留下房產', type: '財務事件', text: '你繼承一筆資產，但也處理不少家務。', effects: { wealth: 12, happiness: -2 }, status: { asset: '房產' } },
];

const clamp = (value) => Math.max(0, value);
const blankPlayer = (id) => ({
  id,
  name: `玩家${id + 1}`,
  animal: ANIMALS[id],
  target: { wealth: 20, happiness: 20, reputation: 20 },
  targetLocked: false,
  position: 0,
  wealth: 0,
  happiness: 0,
  reputation: 0,
  career: '尚未就業',
  education: '高中以下',
  family: '單身',
  asset: '無',
  salaryLevel: 1,
  children: 0,
  history: [],
});

function applyCard(player, card) {
  const next = { ...player };
  next.wealth = clamp(next.wealth + (card.effects.wealth || 0));
  next.happiness = clamp(next.happiness + (card.effects.happiness || 0));
  next.reputation = clamp(next.reputation + (card.effects.reputation || 0));
  next.salaryLevel = clamp(next.salaryLevel + (card.salary || 0));
  next.children = clamp(next.children + (card.child || 0));
  if (card.status) Object.assign(next, card.status);
  next.history = [`${card.title}：${card.text}`, ...next.history].slice(0, 8);
  return next;
}

function isWinner(player) {
  return player.wealth >= player.target.wealth && player.happiness >= player.target.happiness && player.reputation >= player.target.reputation;
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState([blankPlayer(0), blankPlayer(1)]);
  const [current, setCurrent] = useState(0);
  const [lastRoll, setLastRoll] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [winner, setWinner] = useState(null);

  const currentPlayer = players[current];
  const allLocked = players.every((p) => p.targetLocked);

  function resetGame(count = playerCount) {
    const nextPlayers = Array.from({ length: count }, (_, i) => blankPlayer(i));
    setPlayers(nextPlayers);
    setCurrent(0);
    setLastRoll(null);
    setActiveCard(null);
    setWinner(null);
    setScreen('setup');
  }

  function updatePlayer(id, patch) {
    setPlayers((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p));
  }

  function updateTarget(id, key, value) {
    setPlayers((prev) => prev.map((p) => {
      if (p.id !== id || p.targetLocked) return p;
      const target = { ...p.target, [key]: Number(value) };
      return { ...p, target };
    }));
  }

  function lockTarget(id) {
    const p = players[id];
    const sum = p.target.wealth + p.target.happiness + p.target.reputation;
    if (sum !== 60) return alert('財富＋快樂＋名譽必須剛好等於 60 分。');
    updatePlayer(id, { targetLocked: true });
  }

  function startBoard() {
    if (!allLocked) return alert('所有玩家都要先鎖定幸福目標。');
    setScreen('game');
  }

  function drawChanceCard(player) {
    const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
    const updated = applyCard(player, card);
    setActiveCard(card);
    return updated;
  }

  function rollDice() {
    if (winner) return;
    const roll = Math.ceil(Math.random() * 6);
    setLastRoll(roll);
    setPlayers((prev) => {
      const next = [...prev];
      const p = { ...next[current] };
      const newPosition = (p.position + roll) % BOARD.length;
      p.position = newPosition;
      let updated = p;
      const tile = BOARD[newPosition];
      if (tile === '機會') updated = drawChanceCard(p);
      else {
        setActiveCard({ title: tile, type: '道路格', text: `你來到「${tile}」格，本回合沒有抽取機會卡。`, effects: {} });
      }
      next[current] = updated;
      if (isWinner(updated)) {
        setWinner(updated);
        setScreen('result');
      }
      return next;
    });
  }

  function nextTurn() {
    setActiveCard(null);
    setLastRoll(null);
    setCurrent((current + 1) % players.length);
  }

  const boardWithPlayers = useMemo(() => BOARD.map((tile, index) => ({
    tile,
    index,
    here: players.filter((p) => p.position === index),
  })), [players]);

  if (screen === 'home') return (
    <main className="page home">
      <section className="hero card">
        <div className="badge">Classic V1</div>
        <h1>幸福人</h1>
        <p>1～6 人純前端單機版。秘密設定人生目標，輪流擲骰前進，抽取機會卡，當有人達成自己的財富、快樂、名譽目標時，遊戲立即結束。</p>
        <button className="primary" onClick={() => resetGame(2)}>開始建立玩家</button>
      </section>
    </main>
  );

  if (screen === 'setup') return (
    <main className="page">
      <header className="topbar">
        <h2>建立玩家與秘密目標</h2>
        <button onClick={() => setScreen('home')}>返回首頁</button>
      </header>
      <section className="card controls">
        <label>玩家人數：
          <select value={playerCount} onChange={(e) => { const c = Number(e.target.value); setPlayerCount(c); resetGame(c); }}>
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} 人</option>)}
          </select>
        </label>
        <p>設定目標時請其他玩家轉頭，鎖定後遊戲中不會再顯示。</p>
      </section>
      <section className="setupGrid">
        {players.map((p) => {
          const sum = p.target.wealth + p.target.happiness + p.target.reputation;
          return <div className="card playerSetup" key={p.id}>
            <div className="avatarBig">{p.animal}</div>
            <input disabled={p.targetLocked} value={p.name} onChange={(e) => updatePlayer(p.id, { name: e.target.value })} />
            <select disabled={p.targetLocked} value={p.animal} onChange={(e) => updatePlayer(p.id, { animal: e.target.value })}>
              {ANIMALS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            {!p.targetLocked ? <>
              <label>財富目標 <input type="number" value={p.target.wealth} onChange={(e) => updateTarget(p.id, 'wealth', e.target.value)} /></label>
              <label>快樂目標 <input type="number" value={p.target.happiness} onChange={(e) => updateTarget(p.id, 'happiness', e.target.value)} /></label>
              <label>名譽目標 <input type="number" value={p.target.reputation} onChange={(e) => updateTarget(p.id, 'reputation', e.target.value)} /></label>
              <div className={sum === 60 ? 'sum ok' : 'sum'}>目前合計：{sum} / 60</div>
              <button className="primary" onClick={() => lockTarget(p.id)}><Lock size={16}/> 鎖定目標</button>
            </> : <div className="locked"><Lock size={18}/> 幸福目標已鎖定</div>}
          </div>
        })}
      </section>
      <button className="primary wide" disabled={!allLocked} onClick={startBoard}>全部完成，開始遊戲</button>
    </main>
  );

  if (screen === 'result') return (
    <main className="page">
      <section className="card result">
        <Trophy size={52}/>
        <h1>{winner?.animal} {winner?.name} 達成人生目標！</h1>
        <p>有人達標，遊戲立即結束。</p>
      </section>
      <section className="playersGrid">
        {players.map(p => <div className="card" key={p.id}>
          <h3>{p.animal} {p.name}</h3>
          <p className="reveal">原始目標：財富 {p.target.wealth}｜快樂 {p.target.happiness}｜名譽 {p.target.reputation}</p>
          <p>最終人生：財富 {p.wealth}｜快樂 {p.happiness}｜名譽 {p.reputation}</p>
          <p>職業：{p.career}｜學歷：{p.education}｜家庭：{p.family}</p>
        </div>)}
      </section>
      <button className="primary wide" onClick={() => resetGame(playerCount)}><RotateCcw size={16}/> 再玩一局</button>
    </main>
  );

  return (
    <main className="page gamePage">
      <header className="topbar">
        <h2>幸福人 Classic</h2>
        <button onClick={() => resetGame(playerCount)}><RotateCcw size={16}/> 重新開始</button>
      </header>
      <section className="gameLayout">
        <div className="board card">
          {boardWithPlayers.map(cell => <div key={cell.index} className={`tile ${cell.tile === '機會' ? 'chance' : ''}`}>
            <small>{cell.index}</small>
            <span>{cell.tile}</span>
            <div className="tokens">{cell.here.map(p => <b key={p.id}>{p.animal}</b>)}</div>
          </div>)}
        </div>
        <aside className="side">
          <section className="card turnCard">
            <h3>目前回合</h3>
            <div className="avatarBig">{currentPlayer.animal}</div>
            <h2>{currentPlayer.name}</h2>
            <button className="primary" onClick={rollDice}><Dice6 size={18}/> 擲骰</button>
            {lastRoll && <p>本次骰出：{lastRoll}</p>}
            {activeCard && <div className="chanceCard">
              <div className="badge">{activeCard.type}</div>
              <h3><Sparkles size={18}/> {activeCard.title}</h3>
              <p>{activeCard.text}</p>
            </div>}
            {activeCard && <button onClick={nextTurn}>換下一位玩家</button>}
          </section>
          <section className="playersGrid compact">
            {players.map((p, idx) => <div className={`card playerCard ${idx === current ? 'active' : ''}`} key={p.id}>
              <h3>{p.animal} {p.name}</h3>
              <p>位置：{BOARD[p.position]}</p>
              <p>財富 {p.wealth}｜快樂 {p.happiness}｜名譽 {p.reputation}</p>
              <p>職業：{p.career}｜薪級：{p.salaryLevel}</p>
              <p>學歷：{p.education}｜家庭：{p.family}｜子女：{p.children}</p>
              <p className="secret">幸福目標：已隱藏</p>
            </div>)}
          </section>
        </aside>
      </section>
    </main>
  );
}
