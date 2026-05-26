import React, { useMemo, useState } from 'react'

const OUTER_CELLS = [
  { id: 0, label: '起點／發薪日', type: 'pay', arrow: '→' },
  { id: 1, label: '一般', type: 'normal', arrow: '→' },
  { id: 2, label: '機會', type: 'chance', arrow: '→' },
  { id: 3, label: '學院入口', type: 'entry', career: 'academy', arrow: '→' },
  { id: 4, label: '一般', type: 'normal', arrow: '→' },
  { id: 5, label: '工作', type: 'work', arrow: '→' },
  { id: 6, label: '機會', type: 'chance', arrow: '→' },
  { id: 7, label: '企業入口', type: 'entry', career: 'enterprise', arrow: '→' },
  { id: 8, label: '社交', type: 'social', arrow: '→' },
  { id: 9, label: '投資', type: 'invest', arrow: '↓' },
  { id: 10, label: '機會', type: 'chance', arrow: '↓' },
  { id: 11, label: '農墾入口', type: 'entry', career: 'farming', arrow: '↓' },
  { id: 12, label: '家庭', type: 'family', arrow: '↓' },
  { id: 13, label: '政治入口', type: 'entry', career: 'politics', arrow: '↓' },
  { id: 14, label: '機會', type: 'chance', arrow: '↓' },
  { id: 15, label: '休閒', type: 'leisure', arrow: '↓' },
  { id: 16, label: '一般', type: 'normal', arrow: '←' },
  { id: 17, label: '進修', type: 'study', arrow: '←' },
  { id: 18, label: '機會', type: 'chance', arrow: '←' },
  { id: 19, label: '航海入口', type: 'entry', career: 'sailing', arrow: '←' },
  { id: 20, label: '創業', type: 'startup', arrow: '←' },
  { id: 21, label: '電影明星入口', type: 'entry', career: 'movie', arrow: '←' },
  { id: 22, label: '機會', type: 'chance', arrow: '←' },
  { id: 23, label: '健康', type: 'health', arrow: '←' },
  { id: 24, label: '一般', type: 'normal', arrow: '←' },
  { id: 25, label: '開礦入口', type: 'entry', career: 'mining', arrow: '↑' },
  { id: 26, label: '機會', type: 'chance', arrow: '↑' },
  { id: 27, label: '月球探險入口', type: 'entry', career: 'moon', arrow: '↑' },
  { id: 28, label: '一般', type: 'normal', arrow: '↑' },
  { id: 29, label: '買房', type: 'house', arrow: '↑' },
  { id: 30, label: '機會', type: 'chance', arrow: '↑' },
  { id: 31, label: '公益', type: 'charity', arrow: '↗' },
]

const CAREERS = {
  academy: {
    name: '學院', icon: '🎓', entry: 3, exit: 5,
    cells: ['入學', '修課', '報告', '考試', '研究', '發表', '延畢危機', '畢業'],
    events: [
      ['拿到獎學金，口袋 +3000', 3000],
      ['報告加碼，壓力太大，口袋 -1000', -1000],
      ['順利發表，聲望提升，口袋 +1500', 1500],
      ['延畢危機，先繳學雜費，口袋 -2000', -2000],
    ],
  },
  enterprise: {
    name: '企業', icon: '💼', entry: 7, exit: 9,
    cells: ['面試', '新人訓練', 'KPI', '加班', '升遷', '分紅', '裁員風暴', '轉職'],
    events: [
      ['通過面試，口袋 +2000', 2000],
      ['加班爆肝，口袋 -1000', -1000],
      ['升遷成功，口袋 +4000', 4000],
      ['裁員風暴，口袋 -3000', -3000],
    ],
  },
  farming: {
    name: '農墾', icon: '🌾', entry: 11, exit: 12,
    cells: ['租地', '播種', '灌溉', '除草', '收成', '市集', '天災', '品牌化'],
    events: [
      ['豐收，口袋 +3500', 3500],
      ['農機維修，口袋 -1500', -1500],
      ['地方市集熱賣，口袋 +2500', 2500],
      ['豪雨災損，口袋 -2500', -2500],
    ],
  },
  politics: {
    name: '政治', icon: '🏛️', entry: 13, exit: 15,
    cells: ['參選', '拜票', '政見', '辯論', '民調', '造勢', '爆料', '當選'],
    events: [
      ['民調上升，募款 +3000', 3000],
      ['文宣支出，口袋 -2000', -2000],
      ['政見打中民心，口袋 +2000', 2000],
      ['被爆料，危機處理 -3000', -3000],
    ],
  },
  sailing: {
    name: '航海', icon: '⛵', entry: 19, exit: 20,
    cells: ['登船', '補給', '遠洋', '貿易', '暴風雨', '新港口', '海盜', '返航'],
    events: [
      ['貿易成功，口袋 +4000', 4000],
      ['補給不足，口袋 -1500', -1500],
      ['發現新港口，口袋 +2500', 2500],
      ['遇到暴風雨，修船 -3000', -3000],
    ],
  },
  movie: {
    name: '電影明星', icon: '🎬', entry: 21, exit: 23,
    cells: ['試鏡', '配角', '通告', '爆紅', '代言', '粉絲會', '負評', '頒獎'],
    events: [
      ['試鏡成功，口袋 +2000', 2000],
      ['形象包裝費，口袋 -1500', -1500],
      ['代言收入，口袋 +5000', 5000],
      ['負面新聞公關費，口袋 -3000', -3000],
    ],
  },
  mining: {
    name: '開礦', icon: '⛏️', entry: 25, exit: 28,
    cells: ['探勘', '開採', '礦車', '熔煉', '稀有礦', '工安', '買設備', '出貨'],
    events: [
      ['挖到稀有礦，口袋 +6000', 6000],
      ['設備升級，口袋 -3000', -3000],
      ['出貨成功，口袋 +3500', 3500],
      ['工安事故，口袋 -4000', -4000],
    ],
  },
  moon: {
    name: '月球探險', icon: '🌕', entry: 27, exit: 31,
    cells: ['訓練', '發射', '軌道', '登月', '採樣', '基地', '缺氧', '返地球'],
    events: [
      ['登月任務成功，口袋 +8000', 8000],
      ['太空裝維修，口袋 -3000', -3000],
      ['採樣發現新資源，口袋 +5000', 5000],
      ['氧氣不足緊急處置，口袋 -4500', -4500],
    ],
  },
}

const PLAYERS_INIT = [
  { id: 0, name: '玩家A', emoji: '😀', cash: 10000, outerPos: 0, track: 'outer', career: null, innerPos: 0, retireTickets: 1, vacation: 0, bankrupt: false },
  { id: 1, name: '玩家B', emoji: '😎', cash: 10000, outerPos: 0, track: 'outer', career: null, innerPos: 0, retireTickets: 1, vacation: 0, bankrupt: false },
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function clampCash(n) {
  return Math.max(n, 0)
}

function typeClass(type) {
  if (type === 'entry') return 'entry'
  if (type === 'chance') return 'chance'
  if (['work', 'invest', 'startup', 'pay'].includes(type)) return 'good'
  if (['family', 'health', 'leisure'].includes(type)) return 'pink'
  return 'normal'
}

export default function App() {
  const [players, setPlayers] = useState(PLAYERS_INIT)
  const [turn, setTurn] = useState(0)
  const [dice, setDice] = useState('--')
  const [message, setMessage] = useState('請擲骰開始人生旅程。外圈使用兩顆骰子；進入職業內圈後改用一顆骰子。')
  const [pendingEntry, setPendingEntry] = useState(null)
  const [logs, setLogs] = useState(['V1.7：八大內圈、單骰、入口選擇、退休度假與破產功能已加入。'])

  const current = players[turn]
  const diceMode = current.track === 'outer' ? 'two' : 'one'

  const playerAtOuter = useMemo(() => {
    const map = {}
    players.forEach(p => {
      if (p.track === 'outer' && !p.bankrupt) {
        map[p.outerPos] = [...(map[p.outerPos] || []), p]
      }
    })
    return map
  }, [players])

  function log(text) {
    setLogs(prev => [text, ...prev].slice(0, 10))
  }

  function nextTurn(newPlayers = players) {
    let next = (turn + 1) % newPlayers.length
    for (let i = 0; i < newPlayers.length; i++) {
      const p = newPlayers[next]
      if (!p.bankrupt) break
      next = (next + 1) % newPlayers.length
    }
    setTurn(next)
  }

  function applyOuterEffect(player, cell) {
    let delta = 0
    let text = ''
    switch (cell.type) {
      case 'pay': delta = 5000; text = '經過發薪日，薪水入袋 +5000'; break
      case 'work': delta = 2500; text = '工作順利，口袋 +2500'; break
      case 'invest': delta = Math.random() > 0.45 ? 3000 : -2000; text = delta > 0 ? '投資獲利，口袋 +3000' : '投資失利，口袋 -2000'; break
      case 'startup': delta = Math.random() > 0.5 ? 5000 : -3000; text = delta > 0 ? '創業接到大單，口袋 +5000' : '創業燒錢，口袋 -3000'; break
      case 'house': delta = -3000; text = '買房頭期款壓力，口袋 -3000'; break
      case 'charity': delta = -1000; text = '投入公益，口袋 -1000，但幸福感提升'; break
      case 'chance': delta = pick([2000, 1500, -1000, -2000]); text = delta > 0 ? `機會降臨，口袋 +${delta}` : `突發狀況，口袋 ${delta}`; break
      case 'family': delta = -1000; text = '家庭支出，口袋 -1000'; break
      case 'health': delta = -1500; text = '健康檢查與休養，口袋 -1500'; break
      case 'leisure': delta = -800; text = '休閒放鬆，口袋 -800'; break
      case 'study': delta = -1200; text = '進修投資自己，口袋 -1200'; break
      case 'social': delta = 1000; text = '社交拓展人脈，口袋 +1000'; break
      default: text = '一般格，平安度過。'
    }
    return { ...player, cash: clampCash(player.cash + delta), effectText: text }
  }

  function rollDice() {
    if (pendingEntry) return
    if (current.bankrupt) return nextTurn()

    if (current.vacation > 0) {
      const updated = players.map(p => p.id === current.id ? { ...p, vacation: p.vacation - 1 } : p)
      setPlayers(updated)
      setDice('休')
      setMessage(`${current.name} 正在度假，本回合休息。`)
      log(`${current.name} 度假休息 1 回合。`)
      nextTurn(updated)
      return
    }

    const d1 = Math.ceil(Math.random() * 6)
    const d2 = diceMode === 'two' ? Math.ceil(Math.random() * 6) : 0
    const total = d1 + d2
    setDice(String(total).padStart(2, '0'))

    let updatedPlayers = [...players]
    let p = { ...current }

    if (p.track === 'outer') {
      const old = p.outerPos
      const crossedPay = old + total >= OUTER_CELLS.length
      p.outerPos = (old + total) % OUTER_CELLS.length
      if (crossedPay) p.cash += 5000
      const cell = OUTER_CELLS[p.outerPos]
      const base = `${p.name} 擲出 ${total}，從 ${old} 走到 ${p.outerPos}｜${cell.label}。`

      if (cell.type === 'entry') {
        updatedPlayers = updatedPlayers.map(x => x.id === p.id ? p : x)
        setPlayers(updatedPlayers)
        setPendingEntry({ playerId: p.id, careerKey: cell.career })
        const career = CAREERS[cell.career]
        const extra = crossedPay ? '途中經過發薪日，口袋 +5000。' : ''
        setMessage(`${base}\n${extra}是否進入「${career.name}」職業道路？進入後改用一顆骰子，走到終點後從外圈 ${career.exit} 號格返回。`)
        log(`${base} 等待選擇是否進入 ${career.name}。`)
        return
      }

      p = applyOuterEffect(p, cell)
      if (crossedPay && cell.type !== 'pay') p.effectText = `途中經過發薪日，口袋 +5000。${p.effectText}`
      updatedPlayers = updatedPlayers.map(x => x.id === p.id ? p : x)
      setPlayers(updatedPlayers)
      setMessage(`${base}\n${p.effectText}`)
      log(`${base} ${p.effectText}`)
      nextTurn(updatedPlayers)
      return
    }

    const career = CAREERS[p.career]
    const oldInner = p.innerPos
    p.innerPos += total
    if (p.innerPos >= career.cells.length) {
      p.track = 'outer'
      p.outerPos = career.exit
      p.career = null
      p.innerPos = 0
      p.cash += 3000
      updatedPlayers = updatedPlayers.map(x => x.id === p.id ? p : x)
      setPlayers(updatedPlayers)
      setMessage(`${p.name} 在「${career.name}」內圈擲出 ${total}，完成道路並從外圈 ${career.exit} 號格返回。\n完成職業歷程獎勵 +3000。`)
      log(`${p.name} 完成 ${career.name} 道路，回到外圈 ${career.exit}。`)
      nextTurn(updatedPlayers)
      return
    }

    const event = pick(career.events)
    p.cash = clampCash(p.cash + event[1])
    updatedPlayers = updatedPlayers.map(x => x.id === p.id ? p : x)
    setPlayers(updatedPlayers)
    setMessage(`${p.name} 在「${career.name}」內圈擲出 ${total}，從第 ${oldInner + 1} 格走到第 ${p.innerPos + 1} 格｜${career.cells[p.innerPos]}。\n${event[0]}`)
    log(`${p.name}｜${career.name}｜${career.cells[p.innerPos]}：${event[0]}`)
    nextTurn(updatedPlayers)
  }

  function enterCareer() {
    if (!pendingEntry) return
    const career = CAREERS[pendingEntry.careerKey]
    const updated = players.map(p => p.id === pendingEntry.playerId ? { ...p, track: 'career', career: pendingEntry.careerKey, innerPos: 0 } : p)
    setPlayers(updated)
    setPendingEntry(null)
    setMessage(`${current.name} 進入「${career.name}」道路。下一回合開始使用一顆骰子。`)
    log(`${current.name} 進入 ${career.name} 內圈。`)
    nextTurn(updated)
  }

  function skipCareer() {
    if (!pendingEntry) return
    const career = CAREERS[pendingEntry.careerKey]
    setPendingEntry(null)
    setMessage(`${current.name} 放棄進入「${career.name}」，留在外圈繼續人生主線。`)
    log(`${current.name} 放棄進入 ${career.name}。`)
    nextTurn(players)
  }

  function useVacation() {
    if (current.retireTickets <= 0 || current.bankrupt) return
    const updated = players.map(p => p.id === current.id ? { ...p, retireTickets: p.retireTickets - 1, vacation: 1 } : p)
    setPlayers(updated)
    setMessage(`${current.name} 使用退休權去度假：下次輪到他時休息一回合。`)
    setDice('假')
    log(`${current.name} 使用退休權去度假。`)
  }

  function declareBankruptcy() {
    if (current.bankrupt) return
    const updated = players.map(p => p.id === current.id ? { ...p, cash: 0, bankrupt: true, track: 'outer', career: null, innerPos: 0 } : p)
    setPlayers(updated)
    setMessage(`${current.name} 宣告破產，資產歸零並退出本局。`)
    setDice('破')
    log(`${current.name} 宣告破產，退出本局。`)
    nextTurn(updated)
  }

  function resetGame() {
    setPlayers(PLAYERS_INIT)
    setTurn(0)
    setDice('--')
    setPendingEntry(null)
    setMessage('遊戲已重置。請擲骰開始人生旅程。')
    setLogs(['遊戲已重置。'])
  }

  return (
    <div className="app">
      <style>{CSS}</style>
      <header className="topbar">
        <div>
          <h1>幸福人小遊戲 <span>V1.7</span></h1>
          <p>外圈雙骰｜職業內圈單骰｜入口選擇｜專屬事件池</p>
        </div>
        <button className="ghost" onClick={resetGame}>重新開始</button>
      </header>

      <main className="layout">
        <section className="board">
          {OUTER_CELLS.map((cell) => (
            <div key={cell.id} className={`cell cell-${cell.id} ${typeClass(cell.type)}`}>
              <b>{cell.id}</b>
              <strong>{cell.label}</strong>
              <span className="arrow">{cell.arrow}</span>
              <div className="tokens">
                {(playerAtOuter[cell.id] || []).map(p => <span key={p.id}>{p.emoji}</span>)}
              </div>
            </div>
          ))}

          <div className="centerPanel">
            <div className="diceBox">
              <small>{diceMode === 'two' ? '外圈雙骰 2–12' : '內圈單骰 1–6'}</small>
              <div className="diceNum">{dice}</div>
              <button disabled={!!pendingEntry || current.bankrupt} onClick={rollDice}>擲骰子</button>
            </div>
            <div className="messageBox">
              <h2>目前行動：{current.emoji} {current.name}</h2>
              <p>{message}</p>
              {pendingEntry && (
                <div className="choiceRow">
                  <button onClick={enterCareer}>進入 {CAREERS[pendingEntry.careerKey].name}</button>
                  <button className="secondary" onClick={skipCareer}>留在外圈</button>
                </div>
              )}
              <div className="actionRow">
                <button className="secondary" disabled={current.retireTickets <= 0 || current.bankrupt} onClick={useVacation}>使用退休權去度假</button>
                <button className="danger" disabled={current.bankrupt} onClick={declareBankruptcy}>宣告破產</button>
              </div>
            </div>
            <div className="careerGrid">
              {Object.entries(CAREERS).map(([key, c]) => (
                <div key={key} className={`career ${players.some(p => p.career === key) ? 'active' : ''}`}>
                  <h3>{c.icon} {c.name}</h3>
                  <div className="miniCells">
                    {c.cells.map((x, i) => <span key={x}>{i + 1}.{x}</span>)}
                  </div>
                  <small>入口 {c.entry} → 出口 {c.exit}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="side">
          <h2>玩家口袋</h2>
          {players.map((p, idx) => (
            <div key={p.id} className={`player ${idx === turn ? 'now' : ''} ${p.bankrupt ? 'dead' : ''}`}>
              <div><b>{p.emoji} {p.name}</b><small>{p.track === 'outer' ? `外圈 ${p.outerPos}` : `${CAREERS[p.career].name} ${p.innerPos + 1}`}</small></div>
              <strong>${p.cash.toLocaleString()}</strong>
              <small>退休權：{p.retireTickets}　{p.vacation ? '度假中' : ''}{p.bankrupt ? '已破產' : ''}</small>
            </div>
          ))}

          <h2>最近紀錄</h2>
          <div className="logs">
            {logs.map((l, i) => <p key={i}>{l}</p>)}
          </div>
        </aside>
      </main>
    </div>
  )
}

const CSS = `
*{box-sizing:border-box} body{margin:0;background:#efe4d2;color:#241b16;font-family:system-ui,-apple-system,'Noto Sans TC','Microsoft JhengHei',sans-serif}.app{padding:16px}.topbar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:12px}.topbar h1{margin:0;font-size:28px}.topbar h1 span{font-size:16px;background:#241b16;color:white;border-radius:999px;padding:3px 10px}.topbar p{margin:4px 0 0;color:#6f6255}.layout{display:grid;grid-template-columns:minmax(900px,1fr) 320px;gap:14px}.board{position:relative;height:820px;background:#f7eedf;border:5px solid #2d231d;border-radius:24px}.cell{position:absolute;width:132px;height:92px;border:3px solid #2d231d;border-radius:14px;background:#fffdf8;padding:8px;box-shadow:0 1px 0 rgba(0,0,0,.1)}.cell b{display:block;color:#777;font-size:16px}.cell strong{font-size:18px;line-height:1.1}.arrow{position:absolute;right:10px;bottom:6px;color:#8a8177;font-weight:900}.tokens{position:absolute;left:8px;bottom:6px;display:flex;gap:2px}.chance{background:#ffe0a3}.entry{background:#d9ecff}.good{background:#e5f4dc}.pink{background:#f7dce8}.normal{background:#fffdf8}.cell-0{left:16px;top:16px}.cell-1{left:156px;top:16px}.cell-2{left:296px;top:16px}.cell-3{left:436px;top:16px}.cell-4{left:576px;top:16px}.cell-5{left:716px;top:16px}.cell-6{left:856px;top:16px}.cell-7{left:996px;top:16px}.cell-8{left:1136px;top:16px}.cell-9{right:16px;top:16px}.cell-10{right:16px;top:116px}.cell-11{right:16px;top:216px}.cell-12{right:16px;top:316px}.cell-13{right:16px;top:416px}.cell-14{right:16px;top:516px}.cell-15{right:16px;top:616px}.cell-16{right:16px;bottom:16px}.cell-17{right:156px;bottom:16px}.cell-18{right:296px;bottom:16px}.cell-19{right:436px;bottom:16px}.cell-20{right:576px;bottom:16px}.cell-21{right:716px;bottom:16px}.cell-22{right:856px;bottom:16px}.cell-23{right:996px;bottom:16px}.cell-24{right:1136px;bottom:16px}.cell-25{left:16px;bottom:16px}.cell-26{left:16px;bottom:116px}.cell-27{left:16px;bottom:216px}.cell-28{left:16px;bottom:316px}.cell-29{left:16px;bottom:416px}.cell-30{left:16px;bottom:516px}.cell-31{left:16px;bottom:616px}.centerPanel{position:absolute;left:300px;right:300px;top:138px;bottom:138px;border:3px dashed #2d231d;border-radius:22px;background:rgba(255,250,240,.72);padding:22px;display:grid;grid-template-columns:210px 1fr;grid-template-rows:auto 1fr;gap:16px}.diceBox{background:white;border:3px solid #2d231d;border-radius:20px;text-align:center;padding:14px}.diceBox small{font-weight:700;color:#6e6258}.diceNum{font-size:78px;font-weight:900;line-height:1;margin:6px 0 12px;font-variant-numeric:tabular-nums}.messageBox{background:white;border:3px solid #2d231d;border-radius:20px;padding:16px;white-space:pre-line}.messageBox h2{margin:0 0 8px}.messageBox p{min-height:70px;margin:0 0 12px;font-size:17px;line-height:1.45}.careerGrid{grid-column:1/3;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;overflow:auto}.career{background:#fff;border:2px solid #2d231d;border-radius:14px;padding:8px}.career.active{outline:5px solid #ffcc4d}.career h3{margin:0 0 6px;font-size:16px}.miniCells{display:grid;grid-template-columns:1fr 1fr;gap:4px}.miniCells span{font-size:12px;border:1px solid #ddd;border-radius:999px;padding:2px 5px;background:#fafafa}.career small{display:block;margin-top:5px;color:#786d63;font-weight:700}.side{background:#fff8ee;border:3px solid #2d231d;border-radius:20px;padding:14px;height:820px;overflow:auto}.side h2{margin:8px 0 10px}.player{border:2px solid #ddd;border-radius:14px;padding:10px;margin-bottom:10px;background:white}.player.now{border-color:#2d231d;box-shadow:0 0 0 4px #ffe0a3}.player.dead{opacity:.45}.player div{display:flex;justify-content:space-between;gap:8px}.player small{display:block;color:#6f6255;margin-top:4px}.logs p{margin:0 0 8px;padding:8px;border-radius:10px;background:#f4efe8;border:1px solid #e0d4c4;font-size:14px;line-height:1.35}button{border:0;background:#2d231d;color:white;border-radius:999px;padding:11px 18px;font-weight:800;cursor:pointer}button:disabled{opacity:.4;cursor:not-allowed}.ghost,.secondary{background:white;color:#2d231d;border:2px solid #2d231d}.danger{background:#b73333}.choiceRow,.actionRow{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}@media(max-width:1200px){.layout{grid-template-columns:1fr}.side{height:auto}.board{overflow:auto}.centerPanel{left:180px;right:180px}.cell{width:120px}}
`
