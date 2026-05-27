
import React, { useMemo, useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const VERSION = "V2.9 頭銜池與人生流派版";
const STARTING_CASH = 5000;
const START_AGE_MONTHS = 18 * 12;
const MAX_AGE_MONTHS = 100 * 12;
const TARGET_TOTAL = 100;
const SUPPORTER_CODE = "HAPPY-COIN-2026";
const COIN_SOUND = "/sounds/coin.mp3";
const CAREER_BGM = "/sounds/career.mp3";
const MAIN_BGM = "/bgm.wav";

const animals = ["🐱", "🐶", "🦊", "🐼", "🐧", "🐸", "🦁", "🐰"];
const careers = ["學院", "農墾", "企業", "航海", "月球探險", "電影明星", "從政", "開礦"];

const releaseNotes = [
  {version:"V2.9 頭銜池與人生流派版", theme:"讓八大職業真正形成不同人生流派，完成職業後從頭銜池隨機抽出三個選項。", items:["每個職業依階層建立頭銜池", "完成職業時由同階頭銜池隨機抽出三個選項", "頭銜稀有度選擇前隱藏，選完後揭曉", "頭銜效果改為百分比加成為主", "特殊頭銜可同時帶來正向加成與反向代價", "裝備頭銜會影響事件收益與稀有事件機率", "頭銜資訊卡顯示人生格言、加成、風險與敘事傾向"]},
  {version:"V2.84 頭銜選擇與手機皮夾修正版", theme:"修正職業完成選頭銜流程，讓手機多人遊戲也能操作頭銜。", items:["職業完成時預設選取第一個頭銜，未選也不會卡流程", "頭銜選取後才可按確認取得頭銜", "選中的頭銜以粗框與高亮顯示", "手機版新增玩家皮夾／頭銜視窗", "玩家卡可直接開啟頭銜列表並切換目前頭銜"]},
  {version:"V2.83 職業差異與人生結算修正版", theme:"讓八大職業有更清楚的人生差異，並修正人生結算視窗無法關閉。", items:["人生結算視窗新增返回、重新開始與查看自傳按鈕", "調慢快樂與名譽累積速度", "八大職業加入更明確的門檻與風險報酬差異", "高風險職業如開礦、月球探險成本提高但報酬也提高", "職業事件依道路定位重新平衡"]},
  {version:"V2.82 響應式UI與人生岔路版", theme:"讓介面更適合不同載具，並開始紀錄人生岔路。", items:["新增 Release Notes 更新日誌入口", "頭銜區改為可捲動人生徽章，不再壓到地圖", "新增職業入口略過紀錄，作為未來人生小說素材", "移除右上／右下地圖缺口面板，回到完整回字型視覺", "優化手機與平板顯示"]},
  {version:"V2.81 人生結局與支持系統版", theme:"讓人生結局更完整。", items:["新增人生結局支持區", "支援 support_qr.jpg", "新增贊助支持與回饋作者按鈕", "頭銜資訊卡與裝備概念導入"]},
  {version:"V2.8 音效沉浸與職業修正版", theme:"讓職業道路與音效系統穩定。", items:["修正職業內圈卡死", "職業完成後可取得頭銜", "支援職業音樂切換", "支援金幣雨音效與支持者序號"]},
  {version:"V2.7 人生歲月核心版", theme:"加入有限人生與自傳雛形。", items:["每走一步等於一個月", "18歲開始，100歲進入人生結算", "幸福目標改為100制", "起始資金改為5000", "家庭事件取代平凡的一天", "人生自傳與唯一編號雛形"]},
  {version:"V2.6 平衡與職業入口修正版", theme:"修正職業入口狀態錯亂與人生數值。", items:["修正不同職業入口顯示錯誤", "允許快樂與名譽為負數", "職業頭銜改為加薪與長期效果", "幸福目標100制規劃"]},
  {version:"V2.5 頭銜進階版", theme:"讓頭銜成為人生身份。", items:["同職業第二次完成進入二階頭銜", "第三次完成進入傳奇頭銜", "頭銜不只是裝飾，開始具有事件影響"]},
  {version:"V2.4 中央人生舞台版", theme:"改善主畫面操作區。", items:["中央人生舞台UI", "人生皮夾", "事件視窗優化", "外圈與內圈顯示改善"]},
  {version:"V2.0 Alpha 八大職業版", theme:"建立外圈與八大內圈架構。", items:["回字型人生道路", "八大職業內圈", "外圈雙骰與內圈單骰", "玩家口袋與職業經驗"]},
  {version:"V1.x 原型階段", theme:"建立幸福人電子桌遊基礎。", items:["玩家建立", "動物棋子", "秘密幸福目標", "擲骰前進", "機會卡與自動記帳"]},
];

const outerBoard = [
  { id: "start", name: "發薪日", type: "payday", icon: "💰" },
  { id: "family-1", name: "家庭事件", type: "family", icon: "🏠" },
  { id: "chance-1", name: "機會", type: "chance", icon: "🎴" },
  { id: "career-academy", name: "學院入口", type: "careerEntry", career: "學院", icon: "🎓", fee: 1200, requirement: "建議名譽3以上；已有學院經驗可免入門費" },
  { id: "family-2", name: "家庭事件", type: "family", icon: "👨‍👩‍👧" },
  { id: "career-farm", name: "農墾入口", type: "careerEntry", career: "農墾", icon: "🌾", fee: 500, requirement: "無特殊門檻；已有農墾經驗可免入門費" },
  { id: "chance-2", name: "機會", type: "chance", icon: "🎴" },
  { id: "career-business", name: "企業入口", type: "careerEntry", career: "企業", icon: "💼", fee: 2000, requirement: "現金10000以上較容易進入；已有企業經驗可免入門費" },
  { id: "family-3", name: "家庭事件", type: "family", icon: "❤️" },
  { id: "career-sail", name: "航海入口", type: "careerEntry", career: "航海", icon: "⚓", fee: 1800, requirement: "快樂5以上較適合長程冒險；已有航海經驗可免入門費" },
  { id: "chance-3", name: "機會", type: "chance", icon: "🎴" },
  { id: "career-moon", name: "月球探險入口", type: "careerEntry", career: "月球探險", icon: "🚀", fee: 12000, requirement: "需有任一職業經驗、名譽25以上或持有學院／航海頭銜；高成本高風險" },
  { id: "family-4", name: "家庭事件", type: "family", icon: "🏡" },
  { id: "career-movie", name: "電影明星入口", type: "careerEntry", career: "電影明星", icon: "🎬", fee: 1800, requirement: "快樂8以上或名譽5以上較適合；已有電影明星經驗可免入門費" },
  { id: "chance-4", name: "機會", type: "chance", icon: "🎴" },
  { id: "career-politics", name: "從政入口", type: "careerEntry", career: "從政", icon: "🏛️", fee: 2500, requirement: "名譽20以上，或持有學院／公共頭銜；已有從政經驗可免入門費" },
  { id: "family-5", name: "家庭事件", type: "family", icon: "🧓" },
  { id: "career-mine", name: "開礦入口", type: "careerEntry", career: "開礦", icon: "⛏️", fee: 15000, requirement: "現金20000以上或企業二階頭銜；高投入高報酬" },
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
  { title: "家庭聚餐", desc: "家人圍坐一桌，你想起人生不只有工作。", cash: -500, happiness: 2, reputation: 0, important: true },
  { title: "家人支持", desc: "家人在低潮時給了你一句鼓勵。", cash: 0, happiness: 3, reputation: 0, important: true },
  { title: "長輩生病", desc: "你花時間陪伴與照顧長輩。", cash: -1500, happiness: -1, reputation: 1, important: true },
  { title: "家庭衝突", desc: "價值觀不同帶來爭執，讓你感到疲憊。", cash: 0, happiness: -2, reputation: 0, important: false },
  { title: "孩子的笑聲", desc: "平凡的日常裡，你重新感受到生活的溫度。", cash: -500, happiness: 3, reputation: 0, important: true },
  { title: "伴侶的理解", desc: "有人理解你的選擇，讓你更堅定。", cash: 0, happiness: 2, reputation: 1, important: true },
  { title: "親友借錢", desc: "親友遇到困難向你開口，你選擇伸出援手。", cash: -1000, happiness: 1, reputation: 1, important: false },
  { title: "家族旅行", desc: "短暫離開壓力，你與重要的人留下回憶。", cash: -1500, happiness: 4, reputation: 0, important: true },
];

familyEvents.forEach(e=>e.type="family");

const chanceEvents = [
  { title: "貴人指路", desc: "一位貴人替你指出新的方向。", cash: 500, happiness: 1, reputation: 1, card: "機會卡", important: true },
  { title: "小額投資成功", desc: "你做了一筆謹慎投資，得到些微回報。", cash: 1000, happiness: 0, reputation: 0, important: false },
  { title: "意外支出", desc: "生活總有意外，你不得不支付一筆開銷。", cash: -1000, happiness: -1, reputation: 0, important: false },
  { title: "地方表揚", desc: "你的努力被看見，開始受到更多人注意。", cash: 0, happiness: 1, reputation: 2, important: true },
  { title: "稀有機會：人生轉折", desc: "命運給了你一次罕見的轉向機會。", cash: 1000, happiness: 2, reputation: 2, rare: true, important: true },
];

const careerEvents = {
  學院: [
    { title: "研究突破", desc: "你在研究中看見新的可能。", cash: 0, happiness: 1, reputation: 2, important: true },
    { title: "升等壓力", desc: "漫長的審查讓你感到疲憊。", cash: 0, happiness: -1, reputation: 1 },
  ],
  農墾: [
    { title: "豐收", desc: "土地回應了你的耐心。", cash: 800, happiness: 2, reputation: 1, important: true },
    { title: "天候不穩", desc: "風雨打亂了耕作節奏。", cash: -1000, happiness: -1, reputation: 0 },
  ],
  企業: [
    { title: "專案成功", desc: "你帶領團隊完成關鍵任務。", cash: 2500, happiness: -1, reputation: 1, important: true },
    { title: "加班連夜", desc: "財務有成長，生活卻被工作占滿。", cash: 2000, happiness: -2, reputation: 1 },
  ],
  航海: [
    { title: "遠洋貿易", desc: "你從遠方帶回新的見聞與收益。", cash: 2500, happiness: 0, reputation: 1, important: true },
    { title: "海上風暴", desc: "風浪提醒你人生的不可預測。", cash: -1500, happiness: -1, reputation: 1 },
  ],
  月球探險: [
    { title: "太空任務成功", desc: "你短暫離開地球，名聲傳回人間。", cash: 5000, happiness: 0, reputation: 4, important: true },
    { title: "孤獨航程", desc: "偉大的冒險也伴隨難以言說的孤寂。", cash: 0, happiness: -2, reputation: 2 },
  ],
  電影明星: [
    { title: "新片上映", desc: "聚光燈照向你，觀眾記住了你的名字。", cash: 1800, happiness: 2, reputation: 2, important: true },
    { title: "緋聞風波", desc: "名聲帶來掌聲，也帶來壓力。", cash: 0, happiness: -1, reputation: -2, important: true },
  ],
  從政: [
    { title: "政策獲得支持", desc: "你的理念開始影響更多人。", cash: 0, happiness: 0, reputation: 3, important: true },
    { title: "輿論攻擊", desc: "站上舞台，也意味著承受批評。", cash: 0, happiness: -1, reputation: -3 },
  ],
  開礦: [
    { title: "挖到礦脈", desc: "地下的資源帶來可觀收益。", cash: 6000, happiness: -1, reputation: 1, important: true },
    { title: "工安事故", desc: "高收益的背後，也有沉重代價。", cash: -3500, happiness: -2, reputation: -1, important: true },
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


const titlePools = {
  學院: {
    1: [
      {title:"教育學位", prefix:"教師", rarity:"普通", desc:"你開始陪伴他人成長。", motto:"教育是把一個人的光，慢慢交到另一個人手上。", salaryRaise:500, modifiers:{reputationGainPct:8, rareEventPct:2}, effects:["名譽收益 +8%", "教育相關稀有事件 +2%"], risks:["升等壓力仍會影響快樂"], narrative:"傳承、學習、陪伴"},
      {title:"商學學位", suffix:"商學士", rarity:"普通", desc:"你開始理解市場與財務運作。", motto:"理解財富，不等於被財富支配。", salaryRaise:700, modifiers:{cashGainPct:8}, effects:["金錢收益 +8%"], risks:["容易被市場波動牽動"]},
      {title:"科學學位", prefix:"研究員", rarity:"普通", desc:"你投入未知領域的探索。", motto:"未知並不可怕，可怕的是停止提問。", salaryRaise:500, modifiers:{reputationGainPct:10, rareEventPct:3}, effects:["名譽收益 +10%", "探索類稀有事件 +3%"], risks:["研究壓力增加"]},
      {title:"藝術學位", suffix:"藝術學士", rarity:"普通", desc:"你相信人生不只有金錢。", motto:"美不是逃避現實，而是讓現實仍值得承受。", salaryRaise:300, modifiers:{happinessGainPct:12}, effects:["快樂收益 +12%"], risks:["財富收益較不穩定"]},
      {title:"社會觀察者", prefix:"觀察者", rarity:"稀有", desc:"你開始用更敏銳的眼光理解人群。", motto:"看見世界的人，也更容易看見自己的責任。", salaryRaise:500, modifiers:{reputationGainPct:15, rareEventPct:5}, effects:["名譽收益 +15%", "稀有事件 +5%"], risks:["快樂損失 +5%"], narrative:"觀察、責任、公共性"},
    ],
    2: [
      {title:"教授", prefix:"教授", rarity:"稀有", desc:"你在知識領域逐漸站穩位置。", motto:"真正的學問，是讓人有能力重新理解人生。", salaryRaise:1000, modifiers:{reputationGainPct:22, rareEventPct:6}, effects:["名譽收益 +22%", "學院稀有事件 +6%"], risks:["壓力事件 +8%"], narrative:"知識、聲望、壓力"},
      {title:"教育改革者", prefix:"教育改革者", rarity:"稀有", desc:"你試著讓制度變得更接近人的需要。", motto:"改變教育，就是改變未來被看見的方式。", salaryRaise:800, modifiers:{reputationGainPct:25, happinessGainPct:8}, effects:["名譽收益 +25%", "快樂收益 +8%"], risks:["爭議事件 +10%"], narrative:"改革、理想、阻力"},
      {title:"學術策展人", suffix:"學術策展人", rarity:"普通", desc:"你開始把知識轉譯給更多人。", motto:"知識若不能抵達人心，就仍在路上。", salaryRaise:900, modifiers:{reputationGainPct:18, cashGainPct:5}, effects:["名譽收益 +18%", "金錢收益 +5%"], risks:[]},
      {title:"公共知識份子", prefix:"公共", rarity:"稀有", desc:"你的聲音開始進入公共討論。", motto:"說出真話的人，有時也要承受真話的重量。", salaryRaise:900, modifiers:{reputationGainPct:30, rareEventPct:7, happinessLossPct:8}, effects:["名譽收益 +30%", "公共稀有事件 +7%"], risks:["快樂損失 +8%"]},
      {title:"研究主持人", suffix:"研究主持人", rarity:"普通", desc:"你學會帶領團隊面對未知。", motto:"一個人的研究是探索，一群人的研究是道路。", salaryRaise:1000, modifiers:{cashGainPct:10, reputationGainPct:15}, effects:["金錢收益 +10%", "名譽收益 +15%"], risks:["壓力事件增加"]},
    ],
    3: [
      {title:"名譽博士", suffix:"名譽博士", rarity:"傳奇", desc:"你的一生被學術共同體記住。", motto:"人的肉身會離開，但思想仍會替他繼續說話。", salaryRaise:1500, modifiers:{reputationGainPct:45, rareEventPct:12}, effects:["名譽收益 +45%", "傳承事件 +12%"], risks:["家庭正向事件 -10%"], narrative:"傳承、聲望、孤高"},
      {title:"時代導師", prefix:"時代導師", rarity:"傳奇", desc:"你不只教育學生，也影響了一個時代。", motto:"能被後來的人記得，不是因為你走得多遠，而是你曾照亮多少路。", salaryRaise:1200, modifiers:{reputationGainPct:50, happinessGainPct:15, rareEventPct:10}, effects:["名譽收益 +50%", "快樂收益 +15%", "傳奇事件 +10%"], risks:["金錢收益 -10%"], narrative:"照亮、傳承、溫柔"},
      {title:"知識燈塔", prefix:"知識燈塔", rarity:"稀有", desc:"你成為他人迷惘時的方向。", motto:"最深的知識，最後會變成一種溫柔。", salaryRaise:1200, modifiers:{reputationGainPct:38, happinessGainPct:12}, effects:["名譽收益 +38%", "快樂收益 +12%"], risks:[]},
      {title:"孤高學者", prefix:"孤高", rarity:"隱藏", desc:"你把人生大半交給知識，也因此與世界保持距離。", motto:"站在高處的人，看得更遠，也更常獨自面對風。", salaryRaise:1300, modifiers:{reputationGainPct:60, happinessGainPct:-20, familyPositivePct:-20}, effects:["名譽收益 +60%"], risks:["快樂收益 -20%", "家庭正向事件 -20%"], narrative:"孤獨、學問、距離"},
      {title:"終身學習者", suffix:"終身學習者", rarity:"稀有", desc:"你始終保有重新開始的能力。", motto:"只要仍願意學習，人生就還沒有真正老去。", salaryRaise:900, modifiers:{happinessGainPct:25, rareEventPct:8}, effects:["快樂收益 +25%", "稀有事件 +8%"], risks:["財富收益 -5%"]},
    ],
  },
  農墾: {
    1: [
      {title:"有機農夫", suffix:"有機農夫", rarity:"普通", desc:"你開始享受平穩的土地節奏。", motto:"土地不會立刻回答，但它從不忘記人的耐心。", salaryRaise:300, modifiers:{happinessGainPct:15, familyPositivePct:8}, effects:["快樂收益 +15%", "家庭正向事件 +8%"], risks:[]},
      {title:"田園生活家", suffix:"田園生活家", rarity:"普通", desc:"你把日子過得緩慢而踏實。", motto:"有些幸福，不是抵達遠方，而是願意留下。", salaryRaise:200, modifiers:{happinessGainPct:18, cashGainPct:-5}, effects:["快樂收益 +18%"], risks:["金錢收益 -5%"]},
      {title:"農場學徒", suffix:"農場學徒", rarity:"普通", desc:"你從辛勞中學會謙卑。", motto:"每一次彎腰，都是和土地重新打招呼。", salaryRaise:400, modifiers:{happinessGainPct:10}, effects:["快樂收益 +10%"], risks:["天候風險仍存在"]},
      {title:"種子保存者", prefix:"種子", rarity:"稀有", desc:"你開始守護下一季的可能。", motto:"真正的希望，常常小到像一粒種子。", salaryRaise:300, modifiers:{happinessGainPct:18, reputationGainPct:8, rareEventPct:4}, effects:["快樂收益 +18%", "名譽收益 +8%", "稀有事件 +4%"], risks:[]},
      {title:"地方耕作者", prefix:"地方", rarity:"普通", desc:"你與地方的關係越來越深。", motto:"地方不是地圖上的點，而是有人記得你的地方。", salaryRaise:400, modifiers:{happinessGainPct:12, reputationGainPct:8}, effects:["快樂收益 +12%", "名譽收益 +8%"], risks:[]},
    ],
    2: [
      {title:"農場主", suffix:"農場主", rarity:"普通", desc:"你把土地經營成安身立命之處。", motto:"能讓一片土地活起來，就是一種安穩的成功。", salaryRaise:800, modifiers:{cashGainPct:10, happinessGainPct:18}, effects:["金錢收益 +10%", "快樂收益 +18%"], risks:["天災損失 +8%"]},
      {title:"慢活導師", prefix:"慢活", rarity:"稀有", desc:"你的生活方式開始影響他人。", motto:"慢不是落後，而是懂得把靈魂等回來。", salaryRaise:500, modifiers:{happinessGainPct:30, familyPositivePct:18, cashGainPct:-8}, effects:["快樂收益 +30%", "家庭正向事件 +18%"], risks:["金錢收益 -8%"]},
      {title:"地方職人", prefix:"地方職人", rarity:"稀有", desc:"你成為地方生活智慧的象徵。", motto:"最長久的名聲，常從一件小事做得夠久開始。", salaryRaise:700, modifiers:{happinessGainPct:18, reputationGainPct:22}, effects:["快樂收益 +18%", "名譽收益 +22%"], risks:[]},
      {title:"農業創新者", prefix:"農業創新", rarity:"稀有", desc:"你讓傳統與科技開始對話。", motto:"傳統不是不能改變，而是值得更好地延續。", salaryRaise:900, modifiers:{cashGainPct:18, reputationGainPct:15, rareEventPct:5}, effects:["金錢收益 +18%", "名譽收益 +15%", "稀有事件 +5%"], risks:["投資失敗風險 +5%"]},
      {title:"社區守護者", prefix:"社區", rarity:"普通", desc:"你把自己的日子和一群人的生活綁在一起。", motto:"幸福有時不是個人的，而是一整個地方一起慢慢變好。", salaryRaise:500, modifiers:{happinessGainPct:20, reputationGainPct:15}, effects:["快樂收益 +20%", "名譽收益 +15%"], risks:[]},
    ],
    3: [
      {title:"大地守護者", prefix:"大地守護者", rarity:"傳奇", desc:"你將人生留給土地與家人。", motto:"真正的幸福，往往藏在最平凡的日子裡。", salaryRaise:1000, modifiers:{happinessGainPct:55, familyPositivePct:40, cashGainPct:-15}, effects:["快樂收益 +55%", "家庭正向事件 +40%"], risks:["金錢收益 -15%"], narrative:"土地、家庭、溫暖"},
      {title:"豐收之人", prefix:"豐收", rarity:"稀有", desc:"你的人生逐漸開出溫柔的果實。", motto:"最好的收成，是回頭時發現自己沒有辜負生活。", salaryRaise:1200, modifiers:{happinessGainPct:40, cashGainPct:15}, effects:["快樂收益 +40%", "金錢收益 +15%"], risks:[]},
      {title:"地方傳奇", suffix:"地方傳奇", rarity:"傳奇", desc:"你成為地方故事裡不可缺少的人。", motto:"有些人的名字，不在遠方流傳，卻在家鄉深深留下。", salaryRaise:1000, modifiers:{reputationGainPct:40, happinessGainPct:25}, effects:["名譽收益 +40%", "快樂收益 +25%"], risks:[]},
      {title:"隱居智者", prefix:"隱居", rarity:"隱藏", desc:"你選擇遠離喧囂，保存內心平靜。", motto:"退後不是失敗，有時是為了把人生看得更清楚。", salaryRaise:300, modifiers:{happinessGainPct:65, reputationGainPct:-20, cashGainPct:-20}, effects:["快樂收益 +65%"], risks:["名譽收益 -20%", "金錢收益 -20%"], narrative:"隱居、平靜、放下"},
      {title:"四季詩人", suffix:"四季詩人", rarity:"稀有", desc:"你從四季中寫下人生。", motto:"春種秋收之間，人學會了等待，也學會了失去。", salaryRaise:500, modifiers:{happinessGainPct:45, rareEventPct:8}, effects:["快樂收益 +45%", "特殊人生事件 +8%"], risks:["財富收益 -8%"]},
    ],
  },
  企業: {
    1: [
      {title:"職員", suffix:"職員", rarity:"普通", desc:"你開始理解組織與市場的規則。", motto:"進入組織，是學會如何在規則中保留自己。", salaryRaise:500, modifiers:{cashGainPct:12, happinessLossPct:5}, effects:["金錢收益 +12%"], risks:["快樂損失 +5%"]},
      {title:"業務新星", prefix:"業務", rarity:"普通", desc:"你開始從人際互動中創造機會。", motto:"每一次成交之前，都先有一次理解。", salaryRaise:600, modifiers:{cashGainPct:15, reputationGainPct:5}, effects:["金錢收益 +15%", "名譽收益 +5%"], risks:[]},
      {title:"專案助理", suffix:"專案助理", rarity:"普通", desc:"你在混亂中學會推進事情。", motto:"人生很多進展，都來自願意把麻煩整理清楚的人。", salaryRaise:500, modifiers:{cashGainPct:10, reputationGainPct:8}, effects:["金錢收益 +10%", "名譽收益 +8%"], risks:["壓力事件增加"]},
      {title:"市場觀察者", prefix:"市場", rarity:"稀有", desc:"你開始看懂趨勢的流動。", motto:"看見浪潮的人，不一定能控制浪潮。", salaryRaise:700, modifiers:{cashGainPct:18, rareEventPct:4}, effects:["金錢收益 +18%", "稀有商業事件 +4%"], risks:["投資風險 +5%"]},
      {title:"管理實習生", suffix:"管理實習生", rarity:"普通", desc:"你開始學習帶領與協調。", motto:"管理不是命令，而是讓一群人願意走向同一個方向。", salaryRaise:500, modifiers:{reputationGainPct:8, cashGainPct:8}, effects:["名譽收益 +8%", "金錢收益 +8%"], risks:[]},
    ],
    2: [
      {title:"經理人", suffix:"經理人", rarity:"稀有", desc:"你開始帶領團隊，也承擔更多壓力。", motto:"升上去的不只是職位，還有你必須承受的重量。", salaryRaise:1000, modifiers:{cashGainPct:28, reputationGainPct:12, happinessLossPct:12}, effects:["金錢收益 +28%", "名譽收益 +12%"], risks:["快樂損失 +12%"]},
      {title:"創業家", prefix:"創業家", rarity:"稀有", desc:"你踏上高風險的人生道路。", motto:"創業不是追求自由，而是把不自由換成自己選擇的方向。", salaryRaise:800, modifiers:{cashGainPct:35, rareEventPct:8, happinessLossPct:10}, effects:["金錢收益 +35%", "創業稀有事件 +8%"], risks:["快樂損失 +10%"]},
      {title:"品牌操盤手", prefix:"品牌", rarity:"普通", desc:"你開始學會讓價值被看見。", motto:"被看見，也是一種被選擇的能力。", salaryRaise:900, modifiers:{cashGainPct:20, reputationGainPct:18}, effects:["金錢收益 +20%", "名譽收益 +18%"], risks:[]},
      {title:"投資經理", prefix:"投資", rarity:"稀有", desc:"你開始把判斷押在未來。", motto:"每一次投資，其實都是對未來的一次想像。", salaryRaise:1100, modifiers:{cashGainPct:32, rareEventPct:7}, effects:["金錢收益 +32%", "投資稀有事件 +7%"], risks:["負面金錢事件 +12%"]},
      {title:"企業改革者", prefix:"企業改革", rarity:"稀有", desc:"你試著改變組織運作的方式。", motto:"改革組織的人，總要先承受組織的反作用力。", salaryRaise:900, modifiers:{reputationGainPct:25, cashGainPct:15}, effects:["名譽收益 +25%", "金錢收益 +15%"], risks:["壓力事件 +15%"]},
    ],
    3: [
      {title:"金融巨鱷", prefix:"金融巨鱷", rarity:"傳奇", desc:"財富能改變世界，卻未必能填滿內心的空缺。", motto:"財富能改變世界，卻未必能填滿內心的空缺。", salaryRaise:1500, modifiers:{cashGainPct:70, rareEventPct:12, familyPositivePct:-25, happinessGainPct:-15}, effects:["金錢收益 +70%", "投資稀有事件 +12%"], risks:["家庭正向事件 -25%", "快樂收益 -15%"], narrative:"權力、成就、孤獨"},
      {title:"財團領袖", prefix:"財團領袖", rarity:"傳奇", desc:"你開始影響市場與他人的人生。", motto:"當一個人的決定足以影響許多人，他就不再只為自己而活。", salaryRaise:1600, modifiers:{cashGainPct:55, reputationGainPct:25, rareEventPct:10, happinessLossPct:15}, effects:["金錢收益 +55%", "名譽收益 +25%", "稀有事件 +10%"], risks:["快樂損失 +15%"]},
      {title:"獨角獸創辦人", prefix:"獨角獸", rarity:"傳奇", desc:"你把一個想法推向世界。", motto:"創造新世界的人，也常常失去原本熟悉的生活。", salaryRaise:1400, modifiers:{cashGainPct:60, reputationGainPct:35, rareEventPct:10}, effects:["金錢收益 +60%", "名譽收益 +35%"], risks:["負面壓力事件 +18%"]},
      {title:"孤獨王者", prefix:"孤獨王者", rarity:"隱藏", desc:"你擁有很多，卻越來越少被真正理解。", motto:"即使擁有一切，也可能只剩自己聽見自己的回音。", salaryRaise:1800, modifiers:{cashGainPct:85, reputationGainPct:35, happinessGainPct:-45, familyPositivePct:-40}, effects:["金錢收益 +85%", "名譽收益 +35%"], risks:["快樂收益 -45%", "家庭正向事件 -40%"], narrative:"財富、孤獨、代價"},
      {title:"長青企業家", prefix:"長青", rarity:"稀有", desc:"你讓事業不只追求速度，也追求長久。", motto:"真正難的不是成功，而是讓成功不要傷害生活。", salaryRaise:1300, modifiers:{cashGainPct:38, happinessGainPct:15, reputationGainPct:18}, effects:["金錢收益 +38%", "快樂收益 +15%", "名譽收益 +18%"], risks:[]},
    ],
  },
  電影明星: {
    1: [
      {title:"演員", suffix:"演員", rarity:"普通", desc:"你開始站在鏡頭前。", motto:"上台之前，先學會面對自己的不安。", salaryRaise:500, modifiers:{reputationGainPct:14, happinessGainPct:8}, effects:["名譽收益 +14%", "快樂收益 +8%"], risks:["評價影響心情"]},
      {title:"偶像", prefix:"偶像", rarity:"普通", desc:"你與支持者建立連結。", motto:"被喜歡是一種幸運，也是一種壓力。", salaryRaise:500, modifiers:{happinessGainPct:15, reputationGainPct:10}, effects:["快樂收益 +15%", "名譽收益 +10%"], risks:["輿論影響心情"]},
      {title:"配音員", suffix:"配音員", rarity:"普通", desc:"你用聲音讓故事有了靈魂。", motto:"有些人不在畫面裡，卻讓畫面被記住。", salaryRaise:400, modifiers:{happinessGainPct:12, reputationGainPct:8}, effects:["快樂收益 +12%", "名譽收益 +8%"], risks:[]},
      {title:"綜藝新人", suffix:"綜藝新人", rarity:"普通", desc:"你學會用幽默面對世界。", motto:"能讓人笑的人，自己也在學會不被生活擊倒。", salaryRaise:500, modifiers:{happinessGainPct:18}, effects:["快樂收益 +18%"], risks:["名譽波動"]},
      {title:"獨立導演", prefix:"獨立", rarity:"稀有", desc:"你開始用影像說自己的話。", motto:"真正想說的故事，常常一開始沒有人買票。", salaryRaise:400, modifiers:{reputationGainPct:18, rareEventPct:5, cashGainPct:-5}, effects:["名譽收益 +18%", "稀有事件 +5%"], risks:["金錢收益 -5%"]},
    ],
    2: [
      {title:"明星", prefix:"明星", rarity:"稀有", desc:"聚光燈開始追著你走。", motto:"當世界看見你時，你也可能逐漸失去真正的自己。", salaryRaise:1000, modifiers:{reputationGainPct:35, happinessGainPct:15, rareEventPct:8}, effects:["名譽收益 +35%", "快樂收益 +15%", "娛樂稀有事件 +8%"], risks:["緋聞風險增加"]},
      {title:"票房演員", prefix:"票房", rarity:"稀有", desc:"你的名字開始代表市場保證。", motto:"票房數字會被記住，但掌聲不一定能陪你回家。", salaryRaise:1200, modifiers:{cashGainPct:25, reputationGainPct:25}, effects:["金錢收益 +25%", "名譽收益 +25%"], risks:["快樂損失 +8%"]},
      {title:"國民偶像", prefix:"國民", rarity:"稀有", desc:"你成為許多人青春的一部分。", motto:"被眾人喜歡的人，也需要一個地方做回自己。", salaryRaise:900, modifiers:{happinessGainPct:25, reputationGainPct:30}, effects:["快樂收益 +25%", "名譽收益 +30%"], risks:["輿論事件 +12%"]},
      {title:"人氣主持人", suffix:"主持人", rarity:"普通", desc:"你開始掌握現場的節奏。", motto:"好的主持人不是讓自己發光，而是讓每個人被看見。", salaryRaise:900, modifiers:{happinessGainPct:20, reputationGainPct:18}, effects:["快樂收益 +20%", "名譽收益 +18%"], risks:[]},
      {title:"舞台製作人", suffix:"製作人", rarity:"普通", desc:"你從台前走向幕後，開始創造舞台。", motto:"不站在光裡的人，也能決定光照向哪裡。", salaryRaise:1000, modifiers:{cashGainPct:15, reputationGainPct:20}, effects:["金錢收益 +15%", "名譽收益 +20%"], risks:[]},
    ],
    3: [
      {title:"時代巨星", prefix:"時代巨星", rarity:"傳奇", desc:"你的名字成為一個時代的共同記憶。", motto:"當世界看見你時，你也可能逐漸失去真正的自己。", salaryRaise:1500, modifiers:{reputationGainPct:60, happinessGainPct:25, rareEventPct:12, happinessLossPct:18}, effects:["名譽收益 +60%", "快樂收益 +25%", "傳奇事件 +12%"], risks:["快樂損失 +18%", "負面輿論事件增加"], narrative:"光芒、壓力、孤獨"},
      {title:"娛樂教父", prefix:"娛樂教父", rarity:"傳奇", desc:"你不只是明星，也開始定義舞台。", motto:"能創造舞台的人，也承擔舞台崩塌時的聲音。", salaryRaise:1600, modifiers:{cashGainPct:35, reputationGainPct:50, rareEventPct:10}, effects:["金錢收益 +35%", "名譽收益 +50%"], risks:["輿論代價提高"]},
      {title:"銀幕傳奇", suffix:"銀幕傳奇", rarity:"傳奇", desc:"即使退下舞台，人們仍記得你的眼神。", motto:"真正的表演，是讓別人在你的故事裡看見自己。", salaryRaise:1300, modifiers:{reputationGainPct:55, happinessGainPct:20}, effects:["名譽收益 +55%", "快樂收益 +20%"], risks:[]},
      {title:"被遺忘的天才", prefix:"被遺忘的", rarity:"隱藏", desc:"你才華耀眼，卻未必被世界溫柔對待。", motto:"不是每一道光，都能照進正確的年代。", salaryRaise:500, modifiers:{happinessGainPct:-20, reputationGainPct:45, rareEventPct:15}, effects:["名譽收益 +45%", "特殊事件 +15%"], risks:["快樂收益 -20%"], narrative:"才華、錯位、遺憾"},
      {title:"溫柔影后", prefix:"溫柔", rarity:"稀有", desc:"你用作品陪伴了許多孤單的人。", motto:"最好的表演，是讓人相信自己仍值得被理解。", salaryRaise:1200, modifiers:{happinessGainPct:35, reputationGainPct:35}, effects:["快樂收益 +35%", "名譽收益 +35%"], risks:[]},
    ],
  },
  從政: {
    1: [
      {title:"議員", prefix:"議員", rarity:"普通", desc:"你開始在公共事務中發聲。", motto:"公共生活的第一步，是承認別人的人生也與你有關。", salaryRaise:500, modifiers:{reputationGainPct:18, rareEventPct:3}, effects:["名譽收益 +18%", "政治稀有事件 +3%"], risks:["輿論攻擊機率提升"]},
      {title:"公共改革者", prefix:"公共改革者", rarity:"稀有", desc:"你試著把理念變成制度。", motto:"改革從來不是讓所有人滿意，而是讓未來多一點可能。", salaryRaise:600, modifiers:{reputationGainPct:20, happinessGainPct:5, rareEventPct:5}, effects:["名譽收益 +20%", "快樂收益 +5%", "稀有事件 +5%"], risks:["壓力事件增加"]},
      {title:"社區代表", prefix:"社區", rarity:"普通", desc:"你從身邊的問題開始行動。", motto:"大政治有時從小巷口的一盞路燈開始。", salaryRaise:400, modifiers:{reputationGainPct:15, happinessGainPct:8}, effects:["名譽收益 +15%", "快樂收益 +8%"], risks:[]},
      {title:"青年參政者", prefix:"青年", rarity:"普通", desc:"你用年輕的聲音挑戰既有秩序。", motto:"年輕不是答案，但年輕仍有提問的權利。", salaryRaise:400, modifiers:{reputationGainPct:20}, effects:["名譽收益 +20%"], risks:["爭議事件 +8%"]},
      {title:"政策助理", suffix:"政策助理", rarity:"普通", desc:"你在幕後推動公共決策。", motto:"有些改變不在台前，卻從文件裡慢慢開始。", salaryRaise:500, modifiers:{reputationGainPct:12, cashGainPct:5}, effects:["名譽收益 +12%", "金錢收益 +5%"], risks:[]},
    ],
    2: [
      {title:"市長", prefix:"市長", rarity:"稀有", desc:"你開始承擔一座城市的期待。", motto:"治理不是站在高處，而是聽見許多低處的聲音。", salaryRaise:1000, modifiers:{reputationGainPct:38, rareEventPct:8, happinessLossPct:10}, effects:["名譽收益 +38%", "社會稀有事件 +8%"], risks:["快樂損失 +10%"]},
      {title:"改革先鋒", prefix:"改革", rarity:"稀有", desc:"你將理念推向更大的現場。", motto:"有些人選擇安穩，有些人選擇改變世界。", salaryRaise:800, modifiers:{reputationGainPct:42, rareEventPct:9}, effects:["名譽收益 +42%", "政治稀有事件 +9%"], risks:["爭議事件 +18%"]},
      {title:"民意領袖", prefix:"民意", rarity:"稀有", desc:"你的聲音開始影響群眾。", motto:"掌聲可以推你前進，也可能讓你忘記方向。", salaryRaise:900, modifiers:{reputationGainPct:35, happinessGainPct:-5}, effects:["名譽收益 +35%"], risks:["快樂收益 -5%"]},
      {title:"政策設計師", suffix:"政策設計師", rarity:"普通", desc:"你開始把價值轉化為制度。", motto:"制度是看不見的建築，會影響許多人如何生活。", salaryRaise:900, modifiers:{reputationGainPct:28, rareEventPct:5}, effects:["名譽收益 +28%", "稀有事件 +5%"], risks:[]},
      {title:"地方父母官", suffix:"父母官", rarity:"稀有", desc:"人們開始把生活期待交到你手上。", motto:"權力若不能照顧人，就只剩下形式。", salaryRaise:900, modifiers:{reputationGainPct:30, happinessGainPct:10}, effects:["名譽收益 +30%", "快樂收益 +10%"], risks:["家庭壓力增加"]},
    ],
    3: [
      {title:"改革先驅", prefix:"改革先驅", rarity:"傳奇", desc:"你選擇把人生投入改變世界。", motto:"有些人選擇安穩，有些人選擇改變世界。", salaryRaise:1500, modifiers:{reputationGainPct:70, rareEventPct:14, happinessLossPct:20}, effects:["名譽收益 +70%", "政治傳奇事件 +14%"], risks:["快樂損失 +20%", "爭議事件 +30%"], narrative:"理想、爭議、犧牲"},
      {title:"政治明星", prefix:"政治明星", rarity:"傳奇", desc:"你的名字開始代表一種時代情緒。", motto:"被群眾推上浪尖的人，也要學會在浪裡呼吸。", salaryRaise:1600, modifiers:{reputationGainPct:65, cashGainPct:15, rareEventPct:12}, effects:["名譽收益 +65%", "金錢收益 +15%"], risks:["名譽波動巨大"]},
      {title:"時代領袖", prefix:"時代領袖", rarity:"傳奇", desc:"你開始影響一整代人的公共想像。", motto:"真正的領導，不是走在所有人前面，而是讓更多人願意一起走。", salaryRaise:1500, modifiers:{reputationGainPct:75, happinessGainPct:10, rareEventPct:10}, effects:["名譽收益 +75%", "快樂收益 +10%"], risks:["家庭正向事件 -10%"]},
      {title:"失勢英雄", prefix:"失勢", rarity:"隱藏", desc:"你曾站得很高，也曾重重跌落。", motto:"跌落之後仍願意承認理想，才是真正困難的事。", salaryRaise:500, modifiers:{reputationGainPct:40, happinessGainPct:-25, rareEventPct:16}, effects:["名譽收益 +40%", "特殊事件 +16%"], risks:["快樂收益 -25%"], narrative:"跌落、理想、餘燼"},
      {title:"人民之聲", prefix:"人民之聲", rarity:"稀有", desc:"你成為許多人託付期待的聲音。", motto:"如果不能替沉默者說話，聲量就只是裝飾。", salaryRaise:1000, modifiers:{reputationGainPct:50, happinessGainPct:15}, effects:["名譽收益 +50%", "快樂收益 +15%"], risks:[]},
    ],
  },
  航海: {
    1: [
      {title:"水手", suffix:"水手", rarity:"普通", desc:"你踏上離岸的旅程。", motto:"離開陸地的人，才知道歸來有多珍貴。", salaryRaise:500, modifiers:{cashGainPct:12, happinessGainPct:5}, effects:["金錢收益 +12%", "快樂收益 +5%"], risks:["風暴仍危險"]},
      {title:"甲板青年", suffix:"甲板青年", rarity:"普通", desc:"你在風浪中學習耐心。", motto:"海不會因為你害怕就停止起伏。", salaryRaise:400, modifiers:{happinessGainPct:8, reputationGainPct:5}, effects:["快樂收益 +8%", "名譽收益 +5%"], risks:[]},
      {title:"海圖學徒", suffix:"海圖學徒", rarity:"普通", desc:"你開始學會讀懂方向。", motto:"真正的方向感，不只來自地圖，也來自心裡。", salaryRaise:400, modifiers:{rareEventPct:3, cashGainPct:8}, effects:["稀有事件 +3%", "金錢收益 +8%"], risks:[]},
      {title:"遠洋信使", prefix:"遠洋", rarity:"稀有", desc:"你把消息帶到遠方。", motto:"距離讓人孤單，也讓人看見世界很大。", salaryRaise:600, modifiers:{reputationGainPct:15, rareEventPct:4}, effects:["名譽收益 +15%", "稀有事件 +4%"], risks:["家庭正向事件 -5%"]},
      {title:"港口商人", suffix:"港口商人", rarity:"普通", desc:"你在港口學會交易與等待。", motto:"港口是離別，也是相遇。", salaryRaise:600, modifiers:{cashGainPct:15}, effects:["金錢收益 +15%"], risks:[]},
    ],
    2: [
      {title:"船長", prefix:"船長", rarity:"稀有", desc:"你開始掌舵自己的方向。", motto:"掌舵的人，不能只看風，也要看人心。", salaryRaise:1000, modifiers:{cashGainPct:25, reputationGainPct:20}, effects:["金錢收益 +25%", "名譽收益 +20%"], risks:[]},
      {title:"國際商人", prefix:"國際商人", rarity:"稀有", desc:"你建立跨地域人脈。", motto:"世界很大，但信任依然是最昂貴的貨幣。", salaryRaise:1100, modifiers:{cashGainPct:30, rareEventPct:6}, effects:["金錢收益 +30%", "國際稀有事件 +6%"], risks:["家庭正向事件 -10%"]},
      {title:"航線開拓者", prefix:"航線", rarity:"稀有", desc:"你走出別人沒有走過的航線。", motto:"不是所有新路都通往成功，但新路會改變看世界的方式。", salaryRaise:900, modifiers:{reputationGainPct:25, rareEventPct:8}, effects:["名譽收益 +25%", "稀有事件 +8%"], risks:["風險事件 +10%"]},
      {title:"海洋救援者", prefix:"海洋", rarity:"普通", desc:"你在危險中學會拯救他人。", motto:"風浪裡伸出的手，最容易被記住。", salaryRaise:700, modifiers:{reputationGainPct:25, happinessGainPct:10}, effects:["名譽收益 +25%", "快樂收益 +10%"], risks:[]},
      {title:"遠洋旅人", suffix:"遠洋旅人", rarity:"普通", desc:"你把人生交給遠方。", motto:"遠方不一定有答案，但會讓問題變得不同。", salaryRaise:800, modifiers:{happinessGainPct:20, cashGainPct:10}, effects:["快樂收益 +20%", "金錢收益 +10%"], risks:["家庭正向事件 -8%"]},
    ],
    3: [
      {title:"提督", prefix:"提督", rarity:"傳奇", desc:"你把遠方化為人生版圖。", motto:"真正的遠方，是讓你回來後不再一樣。", salaryRaise:1500, modifiers:{cashGainPct:42, reputationGainPct:45, rareEventPct:10}, effects:["金錢收益 +42%", "名譽收益 +45%", "國際事件 +10%"], risks:["家庭正向事件 -15%"]},
      {title:"世界航行家", prefix:"世界", rarity:"傳奇", desc:"你用一生確認世界的邊界。", motto:"世界盡頭不是終點，而是下一次出發的理由。", salaryRaise:1300, modifiers:{happinessGainPct:35, reputationGainPct:40, rareEventPct:12}, effects:["快樂收益 +35%", "名譽收益 +40%"], risks:["金錢收益 -5%"]},
      {title:"海上王者", prefix:"海上王者", rarity:"傳奇", desc:"你在海上建立自己的秩序。", motto:"風浪聽不懂命令，但會尊重真正理解它的人。", salaryRaise:1600, modifiers:{cashGainPct:55, reputationGainPct:30, happinessGainPct:-10}, effects:["金錢收益 +55%", "名譽收益 +30%"], risks:["快樂收益 -10%"]},
      {title:"漂泊靈魂", prefix:"漂泊", rarity:"隱藏", desc:"你看過許多地方，卻不一定找到歸屬。", motto:"走得越遠的人，有時越難回答自己屬於哪裡。", salaryRaise:800, modifiers:{happinessGainPct:-20, reputationGainPct:35, rareEventPct:15}, effects:["名譽收益 +35%", "特殊事件 +15%"], risks:["快樂收益 -20%", "家庭正向事件 -25%"], narrative:"遠方、漂泊、歸屬"},
      {title:"海洋守望者", prefix:"海洋守望", rarity:"稀有", desc:"你開始守護海與人的關係。", motto:"守望不是停留，而是願意為某些東西留下。", salaryRaise:1000, modifiers:{happinessGainPct:30, reputationGainPct:35}, effects:["快樂收益 +30%", "名譽收益 +35%"], risks:[]},
    ],
  },
  月球探險: {
    1: [
      {title:"太空研究員", suffix:"太空研究員", rarity:"普通", desc:"你開始仰望地球之外的遠方。", motto:"人類看向星空時，也在看見自己的渺小。", salaryRaise:500, modifiers:{reputationGainPct:18, rareEventPct:4}, effects:["名譽收益 +18%", "探索稀有事件 +4%"], risks:["孤獨事件增加"]},
      {title:"地面工程員", suffix:"地面工程員", rarity:"普通", desc:"你在地球上支持遙遠的任務。", motto:"不是每個英雄都在鏡頭裡。", salaryRaise:700, modifiers:{cashGainPct:10, reputationGainPct:12}, effects:["金錢收益 +10%", "名譽收益 +12%"], risks:[]},
      {title:"星圖學徒", suffix:"星圖學徒", rarity:"普通", desc:"你開始學習讀懂天空。", motto:"星星從不替人回答，但會讓人願意繼續問。", salaryRaise:400, modifiers:{happinessGainPct:8, rareEventPct:5}, effects:["快樂收益 +8%", "稀有事件 +5%"], risks:[]},
      {title:"航太新秀", prefix:"航太", rarity:"稀有", desc:"你的名字開始出現在任務名單上。", motto:"被選中不是終點，而是責任的開始。", salaryRaise:700, modifiers:{reputationGainPct:22, rareEventPct:6}, effects:["名譽收益 +22%", "稀有事件 +6%"], risks:["快樂損失 +5%"]},
      {title:"太空醫官", suffix:"太空醫官", rarity:"稀有", desc:"你學會在極端環境裡照顧生命。", motto:"越遠離地球，越明白生命本身的重量。", salaryRaise:700, modifiers:{reputationGainPct:18, happinessGainPct:8}, effects:["名譽收益 +18%", "快樂收益 +8%"], risks:[]},
    ],
    2: [
      {title:"太空人", prefix:"太空人", rarity:"稀有", desc:"你親身踏上未知領域。", motto:"看見地球全貌的人，再也很難只為自己而活。", salaryRaise:1000, modifiers:{reputationGainPct:45, rareEventPct:10, happinessLossPct:12}, effects:["名譽收益 +45%", "月球稀有事件 +10%"], risks:["快樂損失 +12%"]},
      {title:"月面先鋒", prefix:"月面先鋒", rarity:"稀有", desc:"你把不可能變成了履歷。", motto:"第一個腳印，永遠比想像中孤單。", salaryRaise:1000, modifiers:{reputationGainPct:40, happinessGainPct:8, rareEventPct:10}, effects:["名譽收益 +40%", "快樂收益 +8%", "傳奇事件 +10%"], risks:["孤獨事件增加"]},
      {title:"星際工程師", prefix:"星際", rarity:"普通", desc:"你讓夢想變得可以運作。", motto:"理想若要抵達遠方，需要有人替它擰緊每一顆螺絲。", salaryRaise:1100, modifiers:{cashGainPct:15, reputationGainPct:25}, effects:["金錢收益 +15%", "名譽收益 +25%"], risks:[]},
      {title:"太空任務長", suffix:"任務長", rarity:"稀有", desc:"你開始帶領極端任務。", motto:"越大的任務，越需要安靜的判斷。", salaryRaise:1200, modifiers:{reputationGainPct:35, rareEventPct:9}, effects:["名譽收益 +35%", "稀有事件 +9%"], risks:["壓力事件 +15%"]},
      {title:"宇宙研究員", prefix:"宇宙", rarity:"普通", desc:"你將探索變成長期志業。", motto:"宇宙不是答案，而是讓人類重新理解問題。", salaryRaise:900, modifiers:{reputationGainPct:30, happinessGainPct:5}, effects:["名譽收益 +30%", "快樂收益 +5%"], risks:[]},
    ],
    3: [
      {title:"月球英雄", prefix:"月球英雄", rarity:"傳奇", desc:"你的名字成為人類冒險的註腳。", motto:"人類真正的邊界，從來不在星空之外，而在人心之中。", salaryRaise:1500, modifiers:{reputationGainPct:85, rareEventPct:18, happinessGainPct:-10}, effects:["名譽收益 +85%", "傳奇事件 +18%"], risks:["快樂收益 -10%"], narrative:"理想、未知、孤獨"},
      {title:"星際拓荒者", prefix:"星際拓荒者", rarity:"傳奇", desc:"你把人生投向尚未命名的遠方。", motto:"真正的拓荒，是把人心帶到尚未抵達的地方。", salaryRaise:1400, modifiers:{reputationGainPct:75, rareEventPct:20, happinessLossPct:18}, effects:["名譽收益 +75%", "傳奇事件 +20%"], risks:["快樂損失 +18%"]},
      {title:"地球回望者", prefix:"地球回望", rarity:"稀有", desc:"你在太空中重新理解故鄉。", motto:"當地球變成窗外的一顆藍點，人反而更懂得珍惜近處。", salaryRaise:1000, modifiers:{happinessGainPct:35, reputationGainPct:45}, effects:["快樂收益 +35%", "名譽收益 +45%"], risks:[]},
      {title:"星際狂人", prefix:"星際狂人", rarity:"隱藏", desc:"你追逐星空，也逐漸遠離日常。", motto:"有些人不是走得太遠，而是再也回不到原本的世界。", salaryRaise:1600, modifiers:{reputationGainPct:95, rareEventPct:25, happinessGainPct:-35, familyPositivePct:-35}, effects:["名譽收益 +95%", "傳奇事件 +25%"], risks:["快樂收益 -35%", "家庭正向事件 -35%"], narrative:"狂熱、星空、失重"},
      {title:"宇宙詩人", prefix:"宇宙", rarity:"稀有", desc:"你把未知寫成可以被理解的故事。", motto:"星空很遠，但故事能把它帶回人間。", salaryRaise:900, modifiers:{happinessGainPct:30, reputationGainPct:50}, effects:["快樂收益 +30%", "名譽收益 +50%"], risks:["金錢收益 -5%"]},
    ],
  },
  開礦: {
    1: [
      {title:"礦工", suffix:"礦工", rarity:"普通", desc:"你在黑暗中尋找資源。", motto:"在地下工作的人，最知道光的珍貴。", salaryRaise:500, modifiers:{cashGainPct:18, happinessLossPct:5}, effects:["金錢收益 +18%"], risks:["快樂損失 +5%", "工安風險"]},
      {title:"探勘員", suffix:"探勘員", rarity:"普通", desc:"你開始判斷地下可能藏著什麼。", motto:"每一次探勘，都是在和不確定打交道。", salaryRaise:500, modifiers:{cashGainPct:15, rareEventPct:4}, effects:["金錢收益 +15%", "稀有事件 +4%"], risks:["負面金錢事件增加"]},
      {title:"礦場技師", suffix:"礦場技師", rarity:"普通", desc:"你用技術降低危險。", motto:"危險不會消失，但專業能讓人多一點活下去的機會。", salaryRaise:600, modifiers:{cashGainPct:12, reputationGainPct:8}, effects:["金錢收益 +12%", "名譽收益 +8%"], risks:[]},
      {title:"地下測繪者", suffix:"測繪者", rarity:"稀有", desc:"你看見別人看不見的地底脈絡。", motto:"真正的地圖，不只畫出道路，也畫出風險。", salaryRaise:600, modifiers:{cashGainPct:18, rareEventPct:5}, effects:["金錢收益 +18%", "稀有事件 +5%"], risks:[]},
      {title:"礦業學徒", suffix:"礦業學徒", rarity:"普通", desc:"你開始學會資源與代價的關係。", motto:"每一份資源，都不是從虛無中長出來的。", salaryRaise:400, modifiers:{cashGainPct:12}, effects:["金錢收益 +12%"], risks:["快樂損失 +4%"]},
    ],
    2: [
      {title:"礦場主", suffix:"礦場主", rarity:"稀有", desc:"你開始掌握地下的財富。", motto:"越接近財富，也越接近風險。", salaryRaise:1000, modifiers:{cashGainPct:40, reputationGainPct:10, happinessLossPct:12}, effects:["金錢收益 +40%", "名譽收益 +10%"], risks:["快樂損失 +12%"]},
      {title:"工程專家", suffix:"工程專家", rarity:"普通", desc:"你以專業解決危險難題。", motto:"專業不是讓危險消失，而是知道何時該停手。", salaryRaise:900, modifiers:{cashGainPct:22, reputationGainPct:20}, effects:["金錢收益 +22%", "名譽收益 +20%"], risks:[]},
      {title:"資源投資人", prefix:"資源", rarity:"稀有", desc:"你開始把礦脈變成投資版圖。", motto:"資源越珍貴，越容易讓人忘記界線。", salaryRaise:1100, modifiers:{cashGainPct:45, rareEventPct:7}, effects:["金錢收益 +45%", "稀有事件 +7%"], risks:["破產風險增加"]},
      {title:"安全督導", prefix:"安全", rarity:"普通", desc:"你把人的生命放在收益之前。", motto:"真正的收益，是所有人都能平安回家。", salaryRaise:700, modifiers:{reputationGainPct:25, happinessGainPct:8, cashGainPct:-5}, effects:["名譽收益 +25%", "快樂收益 +8%"], risks:["金錢收益 -5%"]},
      {title:"地下企業家", prefix:"地下", rarity:"稀有", desc:"你在灰色地帶看見機會。", motto:"不是所有機會都該抓住，有些機會會反過來抓住你。", salaryRaise:1200, modifiers:{cashGainPct:50, rareEventPct:8, reputationGainPct:-5}, effects:["金錢收益 +50%", "稀有事件 +8%"], risks:["名譽收益 -5%", "負面事件增加"]},
    ],
    3: [
      {title:"資源大亨", suffix:"資源大亨", rarity:"傳奇", desc:"資源與風險都聚集到你身上。", motto:"掌握資源的人，也被資源反過來掌握。", salaryRaise:1600, modifiers:{cashGainPct:80, reputationGainPct:25, happinessGainPct:-20}, effects:["金錢收益 +80%", "名譽收益 +25%"], risks:["快樂收益 -20%", "負面事件代價更高"], narrative:"暴富、風險、代價"},
      {title:"礦業王者", prefix:"礦業王者", rarity:"傳奇", desc:"你在高風險領域建立自己的王國。", motto:"王冠有時不是戴在頭上，而是壓在肩上。", salaryRaise:1700, modifiers:{cashGainPct:90, rareEventPct:12, happinessLossPct:25}, effects:["金錢收益 +90%", "高收益事件 +12%"], risks:["快樂損失 +25%"]},
      {title:"黑金傳奇", prefix:"黑金", rarity:"隱藏", desc:"你以驚人的速度累積財富，也留下許多陰影。", motto:"有些光亮，是從很深的黑暗裡挖出來的。", salaryRaise:1800, modifiers:{cashGainPct:110, reputationGainPct:-20, happinessGainPct:-35, rareEventPct:15}, effects:["金錢收益 +110%", "特殊高收益事件 +15%"], risks:["名譽收益 -20%", "快樂收益 -35%"], narrative:"黑暗、暴富、陰影"},
      {title:"永續礦業家", prefix:"永續", rarity:"稀有", desc:"你試著讓資源開採不只留下傷痕。", motto:"真正的開採，是知道什麼不能再挖。", salaryRaise:1200, modifiers:{cashGainPct:38, reputationGainPct:40, happinessGainPct:10}, effects:["金錢收益 +38%", "名譽收益 +40%", "快樂收益 +10%"], risks:[]},
      {title:"地底守門人", prefix:"地底", rarity:"稀有", desc:"你比誰都清楚地底的代價。", motto:"不是每一座山都該被打開。", salaryRaise:900, modifiers:{reputationGainPct:45, happinessGainPct:20, cashGainPct:-10}, effects:["名譽收益 +45%", "快樂收益 +20%"], risks:["金錢收益 -10%"]},
    ],
  },
};

function normalizeTitle(t, career, tier){
  const rarity=t.rarity || (tier===1?"普通":tier===2?"稀有":"傳奇");
  return { career, tier, rarity, effects:[], risks:[], modifiers:{}, ...t };
}
function sampleThreeTitles(career,tier){
  const pool=(titlePools[career]?.[tier] || titlePools[career]?.[1] || []).map(t=>normalizeTitle(t,career,tier));
  const weighted=[];
  const weights={普通:9, 稀有:4, 傳奇:2, 隱藏:1};
  for(const t of pool){
    const w=weights[t.rarity] || 3;
    for(let i=0;i<w;i++) weighted.push(t);
  }
  const selected=[];
  while(selected.length<3 && weighted.length){
    const pick=weighted[Math.floor(Math.random()*weighted.length)];
    if(!selected.some(x=>x.title===pick.title)) selected.push({...pick});
    for(let i=weighted.length-1;i>=0;i--) if(weighted[i].title===pick.title) weighted.splice(i,1);
  }
  return selected.length ? selected : pool.slice(0,3);
}
function getAchievementChoices(career,tier){
  return sampleThreeTitles(career,tier);
}
function equippedTitle(player){
  return (player?.titles || []).find(t=>t.id===player.equippedTitleId) || null;
}
function modsOf(player){
  return equippedTitle(player)?.modifiers || {};
}
function pct(v){ return (Number(v)||0)/100; }
function adjustedEffect(player, effect){
  const m=modsOf(player);
  let cash=effect.cash || 0;
  let happiness=effect.happiness || 0;
  let reputation=effect.reputation || 0;
  if(cash>0) cash = cash * (1+pct(m.cashGainPct));
  if(cash<0) cash = cash * (1+pct(m.cashLossPct));
  cash = Math.round(cash/2);
  if(happiness>0) happiness = Math.ceil(happiness * 0.65 * (1+pct(m.happinessGainPct)));
  if(happiness<0) happiness = Math.floor(happiness * (1+pct(m.happinessLossPct)));
  if(reputation>0) reputation = Math.ceil(reputation * 0.65 * (1+pct(m.reputationGainPct)));
  if(reputation<0) reputation = Math.floor(reputation * (1+pct(m.reputationLossPct)));
  return {cash,happiness,reputation,salaryRaise:effect.salaryRaise||0};
}
function titleEffectSummary(t){
  const m=t.modifiers || {};
  const rows=[];
  const labels={cashGainPct:"金錢收益", happinessGainPct:"快樂收益", reputationGainPct:"名譽收益", rareEventPct:"稀有事件", familyPositivePct:"家庭正向事件", cashLossPct:"金錢損失", happinessLossPct:"快樂損失", reputationLossPct:"名譽損失"};
  Object.entries(labels).forEach(([k,label])=>{
    if(m[k]) rows.push(`${label} ${m[k]>0?'+':''}${m[k]}%`);
  });
  return rows;
}
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
    target, trait: maxKey, outerPos: 0, career: null, careerPos: 0, careerProgress: 0, titles: [], equippedTitleId: null,
    careerCounts: Object.fromEntries(careers.map(c=>[c,0])), chanceCards: [], experienceCards: [], retired: false, bankrupt: false,
    lifeLog: [{ageMonths: START_AGE_MONTHS, title: "踏上人生道路", desc: `帶著${money(STARTING_CASH)}，開始追尋自己的幸福。`, type:"start", important:true}],
  };
}

function applyEffect(player, effect){
  const p={...player};
  const adj=adjustedEffect(player,effect);
  if(adj.cash) p.cash += adj.cash;
  if(adj.happiness) p.happiness += adj.happiness;
  if(adj.reputation) p.reputation += adj.reputation;
  if(adj.salaryRaise) p.salary += adj.salaryRaise;
  if(p.cash <= 0){
    p.bankrupt = true;
    p.lifeLog = [...p.lifeLog, {ageMonths:p.ageMonths, title:"宣告破產", desc:"金錢歸零，人生進入低谷。", type:"bankrupt", important:true}];
  }
  return p;
}

function eventByTrait(list, playerOrTrait){
  const player = typeof playerOrTrait === "object" ? playerOrTrait : null;
  const trait = player ? player.trait : playerOrTrait;
  const m = player ? modsOf(player) : {};
  const weighted=[];
  for(const e of list){
    let w=10;
    if(e.rare){
      w=8;
      if(trait === "wealth" && (e.cash||0)>0) w+=14;
      if(trait === "happiness" && (e.happiness||0)>0) w+=14;
      if(trait === "reputation" && (e.reputation||0)>0) w+=14;
      if(trait === "balance") w+=8;
      w += Math.max(0, Number(m.rareEventPct)||0);
    }
    if(e.happiness>0 && m.happinessGainPct) w+=Math.max(0, Math.round(m.happinessGainPct/5));
    if(e.reputation>0 && m.reputationGainPct) w+=Math.max(0, Math.round(m.reputationGainPct/5));
    if(e.cash>0 && m.cashGainPct) w+=Math.max(0, Math.round(m.cashGainPct/5));
    if((e.title||"").includes("家庭") || e.type==="family") w += Math.round((Number(m.familyPositivePct)||0)/5);
    for(let i=0;i<Math.max(1,Math.round(w));i++) weighted.push(e);
  }
  return weighted[Math.floor(Math.random()*weighted.length)] || list[0];
}

function hasCareerTitle(player, career){
  return (player.titles || []).some(t => t.career === career);
}
function careerGate(player, career){
  const cash = player.cash;
  const rep = player.reputation;
  const happy = player.happiness;
  const titles = player.titles || [];
  const hasAcademic = titles.some(t => t.career === "學院");
  const hasBusinessTier2 = titles.some(t => t.career === "企業" && t.tier >= 2);
  const hasPublic = titles.some(t => /公共|市長|議員|政治/.test(t.title || ""));
  const hasSail = titles.some(t => t.career === "航海");
  if((player.careerCounts?.[career] || 0) > 0) return {ok:true, reason:"已有相關職業經驗，可再次進入。"};
  if(career === "農墾") return {ok:true, reason:"農墾道路沒有特殊門檻。"};
  if(career === "學院") return rep >= 3 ? {ok:true, reason:"名譽足以支撐學院道路。"} : {ok:false, reason:"學院道路建議名譽至少3。"};
  if(career === "企業") return cash >= 10000 ? {ok:true, reason:"現金足以承擔企業道路的投入。"} : {ok:false, reason:"企業道路需要現金至少$10,000。"};
  if(career === "電影明星") return (happy >= 8 || rep >= 5) ? {ok:true, reason:"你已有足夠魅力或能見度。"} : {ok:false, reason:"電影明星道路需要快樂8以上或名譽5以上。"};
  if(career === "從政") return (rep >= 20 || hasAcademic || hasPublic) ? {ok:true, reason:"你具備公共領域的基礎。"} : {ok:false, reason:"從政道路需要名譽20以上，或持有學院／公共頭銜。"};
  if(career === "航海") return happy >= 5 ? {ok:true, reason:"你仍有足夠心力承受遠行。"} : {ok:false, reason:"航海道路需要快樂5以上，否則遠行太過沉重。"};
  if(career === "開礦") return (cash >= 20000 || hasBusinessTier2) ? {ok:true, reason:"你具備承擔高投入風險的條件。"} : {ok:false, reason:"開礦道路需要現金至少$20,000，或企業二階頭銜。"};
  if(career === "月球探險") return (cash >= 30000 && rep >= 25) || hasAcademic || hasSail ? {ok:true, reason:"你具備投入極端探索的基礎。"} : {ok:false, reason:"月球探險需要現金$30,000且名譽25以上，或持有學院／航海頭銜。"};
  return {ok:true, reason:"符合進入條件。"};
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
  const [music,setMusic]=useState(false);
  const [sfx,setSfx]=useState(true);
  const [supporter,setSupporter]=useState(()=>localStorage.getItem("supporterMode")==="true");
  const [supporterInput,setSupporterInput]=useState("");
  const [showCoinRain,setShowCoinRain]=useState(false);
  const mainAudioRef=useRef(null);
  const careerAudioRef=useRef(null);
  const playersRef=useRef(players);

  const current=players[turn];
  const boardTile = current ? outerBoard[current.outerPos] : null;
  const wealthScore = current ? clampWealthCash(current.cash) : 0;

  useEffect(()=>{ playersRef.current=players; },[players]);
  useEffect(()=>{
    const main=mainAudioRef.current; const career=careerAudioRef.current;
    if(!main || !career) return;
    main.loop=true; career.loop=true;
    const inCareer=!!current?.career;
    if(!music){ main.pause(); career.pause(); return; }
    if(inCareer){ main.pause(); career.play().catch(()=>{}); }
    else { career.pause(); main.play().catch(()=>{}); }
  },[music, current?.career]);

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

  function unlockSupporter(){
    if(supporterInput.trim() === SUPPORTER_CODE){
      localStorage.setItem("supporterMode","true");
      setSupporter(true);
      setSupporterInput("");
      setModal({title:"🌱 支持者模式已啟用", desc:"感謝你支持《幸福人》。發薪日將啟用金幣雨特效與音效。"});
    }else{
      setModal({title:"序號錯誤", desc:"請確認支持者序號是否輸入正確。"});
    }
  }

  function triggerCoinRain(){
    if(!supporter) return;
    setShowCoinRain(true);
    if(sfx){
      const audio=new Audio(COIN_SOUND);
      audio.volume=0.65;
      audio.play().catch(()=>{});
    }
    setTimeout(()=>setShowCoinRain(false),1800);
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
          np.careerProgress=(np.careerProgress||0)+1;
        }else{
          const old=np.outerPos;
          np.outerPos=(np.outerPos+1)%outerBoard.length;
          if(np.outerPos < old || np.outerPos===0){
            np.cash += np.salary;
            np.lifeLog=[...np.lifeLog,{ageMonths:np.ageMonths,title:"經過發薪日",desc:`領取薪水${money(np.salary)}。`,type:"payday",important:false}];
            setTimeout(()=>triggerCoinRain(), 80);
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
    const p=playersRef.current[turn];
    if(!p) return;
    if(p.ageMonths >= MAX_AGE_MONTHS){ endByAge(p); return; }
    if(p.career){
      const len=careerBoards[p.career].length;
      if((p.careerProgress||0) >= len) return completeCareer(p.career);
      const ev=eventByTrait(careerEvents[p.career] || [], p);
      applyEvent(ev, p.career);
      return;
    }
    const tile=outerBoard[p.outerPos];
    if(tile.type==="family") return applyEvent(eventByTrait(familyEvents, p), "家庭");
    if(tile.type==="chance") return applyEvent(eventByTrait(chanceEvents, p), "機會");
    if(tile.type==="careerEntry"){
      const hasExp=(p.careerCounts[tile.career]||0)>0;
      const fee=hasExp?0:tile.fee;
      const gate = careerGate(p, tile.career);
      setModal({
        title:`${tile.icon} ${tile.career}道路入口`,
        desc:`入門費：${fee===0?'已有經驗，免入門費':money(fee)}\n資格：${tile.requirement}\n目前判定：${gate.ok?'符合條件':'尚未符合'}｜${gate.reason}`,
        actions:[
          {label:"進入職業道路", onClick:()=>enterCareer(tile.career, fee)},
          {label:"略過", onClick:()=>skipCareer(tile.career)}
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

  function effectText(ev, player){
    const adj=adjustedEffect(player||current, ev);
    const arr=[];
    if(ev.cash) arr.push(`金錢變化：${money(adj.cash)}`);
    if(ev.happiness) arr.push(`快樂 ${adj.happiness>0?'+':''}${adj.happiness}`);
    if(ev.reputation) arr.push(`名譽 ${adj.reputation>0?'+':''}${adj.reputation}`);
    return arr.length?arr.join("｜"):"沒有直接數值變化。";
  }

  function skipCareer(career){
    updateCurrent(p=>({
      ...p,
      lifeLog:[...p.lifeLog,{
        ageMonths:p.ageMonths,
        title:`略過${career}道路`,
        desc:`曾經遇見進入${career}的機會，但那一次他選擇繼續走在人生外圈。`,
        type:"branch",
        important:true
      }]
    }));
    addLog(`${displayName(current)} 略過 ${career} 道路`);
    setModal(null);
    nextTurn();
  }

  function enterCareer(career, fee){
    const p=current;
    const gate = careerGate(p, career);
    let allowed=gate.ok, reason=gate.reason;
    if(p.cash - fee <= 0){ allowed=false; reason="現金不足，支付入門費後將破產。"; }
    if(!allowed){ setModal({title:"無法進入", desc:reason, actions:[{label:"確認", onClick:()=>{setModal(null); nextTurn();}}]}); return; }
    updateCurrent(p=>({...applyEffect(p,{cash:-fee}), career, careerPos:0, careerProgress:0, lifeLog:[...p.lifeLog,{ageMonths:p.ageMonths,title:`進入${career}道路`,desc:`選擇投入${career}人生道路。`,type:"career",important:true}]}));
    addLog(`${displayName(p)} 進入 ${career} 道路`);
    setModal(null);
  }

  function completeCareer(career){
    const p=current;
    const nextCount=(p.careerCounts[career]||0)+1;
    const tier=Math.min(nextCount,3);
    const choices=getAchievementChoices(career,tier);
    setModal({
      title:`完成${career}道路`,
      desc:`這是你第 ${nextCount} 次完成${career}道路。系統會從${career}第 ${tier} 階頭銜池中抽出三項供你選擇；選擇前不顯示稀有度，選完後才揭曉。若沒有特別選擇，系統已先預選第一項。`,
      custom: <AchievementPicker choices={choices} career={career} nextCount={nextCount} onConfirm={chooseAchievement} />
    });
  }

  function chooseAchievement(career,a,nextCount){
    const title={...a,id:Math.random().toString(36).slice(2),career};
    updateCurrent(p=>{
      let np={...p};
      np.careerCounts={...np.careerCounts,[career]:nextCount};
      np.titles=[...np.titles,title];
      np.equippedTitleId=title.id;
      np.career=null; np.careerPos=0; np.careerProgress=0;
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
  function restartGame(){ window.location.reload(); }
  function endGame(p, reason){
    setGameOver(true);
    const text=generateAutobiography(p, reason);
    setAutobiography(text);
    setModal({
      title:`${p.animal} ${displayName(p)}｜人生結算`,
      desc:`${reason}。你可以查看或下載人生自傳，也可以先返回畫面回顧這段人生。`,
      actions:[
        {label:"查看人生自傳", onClick:()=>{setModal(null); setScreen("autobiography");}},
        {label:"返回畫面", onClick:()=>setModal(null)},
        {label:"重新開始", onClick:restartGame}
      ]
    });
  }

  function displayName(p){
    const t=p.titles.find(x=>x.id===p.equippedTitleId);
    if(!t) return p.name;
    if(t.prefix) return `${t.prefix}${p.name}`;
    if(t.suffix) return `${p.name}${t.suffix}`;
    return `${t.title}${p.name}`;
  }

  function generateAutobiography(p, reason){
    const id=uid();
    const important = p.lifeLog.filter(x=>x.important);
    const grouped={};
    for(const item of important){
      const st=stageOf(item.ageMonths);
      grouped[st]=grouped[st]||[];
      grouped[st].push(item);
    }
    const finalWealth=clampWealthCash(p.cash);
    const tendency=p.trait==="wealth"?"財富導向":p.trait==="happiness"?"快樂導向":p.trait==="reputation"?"名譽導向":"平衡導向";
    const mainCareer = Object.entries(p.careerCounts||{}).sort((a,b)=>b[1]-a[1])[0]?.[0] || "人生";
    const finalTitle = p.titles.find(t=>t.id===p.equippedTitleId)?.title || "無名旅人";
    const hasBankrupt = p.lifeLog.some(x=>x.type==="bankrupt");
    const familyCount = p.lifeLog.filter(x=>x.type==="家庭").length;
    const titleCount = p.titles.length;
    const lines=[];
    lines.push(`《${displayName(p)}的一生》`);
    lines.push(`人生自傳編號：${id}`);
    lines.push(`生成版本：幸福人 Classic ${VERSION}`);
    lines.push(`生成時間：${new Date().toLocaleString()}`);
    lines.push("");
    lines.push(`18歲那年，${p.name}帶著${money(STARTING_CASH)}踏上人生道路。那時的他，替自己設定了三個幸福目標：財富${p.target.wealth}、快樂${p.target.happiness}、名譽${p.target.reputation}。從這些選擇裡，可以看見他偏向「${tendency}」的人生氣質。`);
    lines.push(`他並不知道未來會遇見多少機會，也不知道有些路走進去之後會改變自己，有些路則會在略過之後成為多年後想起的風景。`);
    lines.push("");
    const order=["🌱 弱冠之年","🔥 而立之年","🌊 不惑之年","🍂 知天命","🌙 耳順之年","☀ 古稀之年","🌌 杖朝之年","📖 期頤之年"];
    for(const st of order){
      const events=(grouped[st]||[]).slice(0,10);
      if(!events.length) continue;
      lines.push(`【${st}】`);
      const lead = st.includes("弱冠") ? "人生剛開始時，每一次選擇都像在替未來埋下伏筆。" : st.includes("而立") ? "到了而立之年，他開始看見自己選擇的方向，也開始承擔選擇帶來的重量。" : st.includes("不惑") ? "不惑之年並不代表沒有疑惑，而是開始懂得與疑惑同行。" : st.includes("知天命") ? "知天命之後，他逐漸明白，有些收穫來自努力，有些安排則來自人生本身。" : st.includes("耳順") ? "耳順之年，他對世界的聲音少了抵抗，多了一點理解。" : "人生走到後段，許多曾經重要的事，都慢慢化為可以回望的故事。";
      lines.push(lead);
      events.forEach(e=>{
        lines.push(`${ageText(e.ageMonths)}，${e.title}。${e.desc}`);
      });
      lines.push("");
    }
    lines.push(`回望這一生，${p.name}最常走近的是「${mainCareer}」這條道路；他一共取得了${titleCount}個人生頭銜，而最後掛在名字上的，是「${finalTitle}」。`);
    if(hasBankrupt) lines.push(`他也曾經歷金錢歸零的低谷。那不是人生的結束，而是讓他重新理解「失去」與「重新開始」的時刻。`);
    if(familyCount>0) lines.push(`在許多家庭事件裡，他被提醒：人生不只由成就構成，也由那些日常裡的牽掛、支持、衝突與陪伴所組成。`);
    lines.push(`最終，他的人生停在${ageText(p.ageMonths)}。結局的理由是：${reason}。此時他的財富為${finalWealth}，快樂為${p.happiness}，名譽為${p.reputation}。`);
    lines.push("");
    lines.push(`沒有人可以替另一個人的人生評級。${p.name}的一生也許有成功，也許有遺憾；也許有些路走得很深，有些路只是曾經路過。但正因為那些選擇、錯過與堅持，才使這段人生只屬於他自己。`);
    lines.push("");
    const motto = p.trait==="wealth" ? "人生箴言：真正重要的，往往不是最後擁有多少，而是你願意把擁有的東西，留給誰、用在哪裡。" : p.trait==="happiness" ? "人生箴言：幸福並不遙遠，它常常藏在那些平凡、細小，卻願意被珍惜的日子裡。" : p.trait==="reputation" ? "人生箴言：人終將老去，但曾經留下的影響，會在他人的記憶裡繼續前行。" : "人生箴言：人生不是單一答案，而是在有限歲月裡，學會讓不同的渴望彼此安放。";
    lines.push(motto);
    lines.push("");
    lines.push("本自傳由《幸福人 Classic》人生自傳系統生成。敘事模板、事件文本、系統設計與遊戲內容為原創智慧財產；未經授權不得重製、改作或商業使用。");
    return lines.join("\n");
  }

  function downloadTxt(){
    const blob=new Blob([autobiography],{type:"text/plain;charset=utf-8"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob); a.download=`幸福人_人生自傳_${Date.now()}.txt`; a.click(); URL.revokeObjectURL(a.href);
  }

  function titleInfo(t, ownerIndex=turn){
    const owner=players[ownerIndex] || current;
    const equipped = owner?.equippedTitleId === t.id;
    const canEquip = ownerIndex === turn && !gameOver;
    setModal({
      title:`頭銜資訊｜${t.title}`,
      desc:`${t.desc}\n\n階級：${t.tier===1?'初階':t.tier===2?'二階':'傳奇'}\n稀有度：${t.rarity || (t.tier===1?'普通':t.tier===2?'稀有':'傳奇')}\n來源：${t.career || '人生事件'}\n${t.salaryRaise?`實際效果：加薪 ${t.salaryRaise}`:"實際效果：依事件觸發而定"}\n${t.effects?.length?`加成：${t.effects.join('、')}`:"加成：無明顯加成"}\n${t.risks?.length?`風險：${t.risks.join('、')}`:"風險：無明顯風險"}\n\n${equipped?'目前裝備中。':canEquip?'你可以將此頭銜裝備為目前的人生身份。':'只能在該玩家回合切換頭銜。'}`,
      actions: equipped || !canEquip
        ? [{label:"確認", onClick:()=>setModal(null)}]
        : [
            {label:"裝備此頭銜", onClick:()=>equipTitle(t.id, ownerIndex)},
            {label:"先不切換", onClick:()=>setModal(null)}
          ]
    });
  }

  function equipTitle(titleId, ownerIndex=turn){
    let chosen=null;
    setPlayers(prev=>prev.map((p,i)=>{
      if(i!==ownerIndex) return p;
      chosen=(p.titles||[]).find(x=>x.id===titleId);
      return {...p, equippedTitleId:titleId, lifeLog:[...p.lifeLog,{ageMonths:p.ageMonths,title:"切換人生頭銜",desc:"他重新選擇了此刻想被世界看見的身份。",type:"title",important:false}]};
    }));
    const owner=players[ownerIndex];
    addLog(`${owner?.animal || ''} ${owner?.name || ''} 裝備頭銜：${chosen?.title || '新頭銜'}`);
    setModal(null);
  }

  function showPlayerWallet(ownerIndex){
    const p=players[ownerIndex];
    if(!p) return;
    const equipped=(p.titles||[]).find(t=>t.id===p.equippedTitleId);
    setModal({
      title:`${p.animal} ${displayName(p)}｜人生皮夾`,
      desc:`${ageText(p.ageMonths)}\n現金：${money(p.cash)}｜薪水：${money(p.salary)}\n財富：${clampWealthCash(p.cash)}｜快樂：${p.happiness}｜名譽：${p.reputation}\n目前頭銜：${equipped?equipped.title:'尚無頭銜'}`,
      custom:<div className="mobileWalletTitles">{(p.titles||[]).length?(p.titles.map(t=><button key={t.id} className={t.id===p.equippedTitleId?'equipped':''} onClick={()=>titleInfo(t, ownerIndex)}>{t.id===p.equippedTitleId?'✓ ':''}{t.title}<small>{t.tier===1?'初階':t.tier===2?'二階':'傳奇'}｜點擊查看</small></button>)):<p>尚未取得頭銜。</p>}</div>,
      actions:[{label:"關閉", onClick:()=>setModal(null)}]
    });
  }

  function showSupportModal(){
    setModal({
      title:"🌱 支持幸福人計畫",
      desc:"如果你喜歡這段人生旅程，歡迎贊助 100 元支持《幸福人》的持續開發。你的支持，將成為更多人生故事誕生的力量。",
      custom:<div className="supportModal"><img src="/support_qr.jpg" onError={e=>{e.currentTarget.style.display='none'}}/><p>贊助 100元支持幸福人開發</p></div>,
      actions:[{label:"謝謝，我知道了", onClick:()=>setModal(null)}]
    });
  }

  function showFeedbackModal(){
    setModal({
      title:"✉ 回饋作者",
      desc:"謝謝你願意回饋《幸福人》。目前可先透過你取得遊戲的管道，把建議、截圖或測試心得傳給作者。未來版本可再接正式表單或信箱。",
      actions:[{label:"確認", onClick:()=>setModal(null)}]
    });
  }


  function showReleaseNotes(){
    setModal({
      title:"📜 Release Notes｜幸福人 Classic",
      desc:"《幸福人》仍在持續成長中。以下保留主要版本歷程，方便玩家了解每一次人生系統的改變。",
      custom:<div className="releaseNotes">{releaseNotes.map((r,idx)=><section key={idx} className="releaseItem"><h3>{idx===0?'🌱 最新｜':''}{r.version}</h3><p>{r.theme}</p><ul>{r.items.map((it,i)=><li key={i}>{it}</li>)}</ul></section>)}<p className="releaseThanks">感謝每一位人生旅人的陪伴，《幸福人》仍在持續成長中。🌱</p></div>,
      actions:[{label:"關閉", onClick:()=>setModal(null)}]
    });
  }

  if(screen==="setup") return <div className="app setup"><h1>幸福人 Classic <span>{VERSION}</span></h1><div className="setupPanel"><label>玩家人數 <select value={playerCount} onChange={e=>setPlayerCount(Number(e.target.value))}>{[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></label>{setupPlayers.map((p,i)=>{const sum=targetSum(p.target); return <div className="setupCard" key={i}><div className="row"><input value={p.name} onChange={e=>setSetupPlayers(arr=>arr.map((x,j)=>j===i?{...x,name:e.target.value}:x))}/><select value={p.animal} onChange={e=>setSetupPlayers(arr=>arr.map((x,j)=>j===i?{...x,animal:e.target.value}:x))}>{animals.map(a=><option key={a}>{a}</option>)}</select></div><div className="targetGrid">{[["wealth","財富"],["happiness","快樂"],["reputation","名譽"]].map(([k,label])=><label key={k}>{label}<input type="range" min="0" max="100" value={p.target[k]} onChange={e=>setSetupPlayers(arr=>arr.map((x,j)=>j===i?{...x,target:{...x.target,[k]:Number(e.target.value)}}:x))}/><input type="number" min="0" max="100" value={p.target[k]} onChange={e=>setSetupPlayers(arr=>arr.map((x,j)=>j===i?{...x,target:{...x.target,[k]:Number(e.target.value)}}:x))}/></label>)}</div><div className={sum===100?"ok hint":"bad hint"}>目標總和：{sum}／100　{sum<100?`尚缺 ${100-sum}`:sum>100?`超出 ${sum-100}`:"可以開始"}</div></div>})}<button className="primary" onClick={startGame}>開始人生</button><button onClick={showReleaseNotes}>📜 更新日誌</button></div>{modal&&<Modal modal={modal} close={()=>setModal(null)}/>}</div>;

  if(screen==="autobiography") return <div className="app endingPage"><h1>📖 人生結局</h1><pre className="autobio">{autobiography}</pre><div className="endingActions"><button className="primary" onClick={downloadTxt}>下載人生自傳 .txt</button><button onClick={showSupportModal}>💖 贊助支持</button><button onClick={showFeedbackModal}>✉ 回饋作者</button><button onClick={()=>setScreen("game")}>返回遊戲</button></div><section className="supportPanel"><div><h2>🌱 支持幸福人計畫</h2><p>如果你喜歡這段人生旅程，歡迎贊助 100 元支持《幸福人》的持續開發。</p><p>你的支持，將成為更多人生故事誕生的力量。</p></div><img src="/support_qr.jpg" onError={e=>{e.currentTarget.style.display='none'}} alt="支持幸福人 QR Code"/></section>{modal&&<Modal modal={modal} close={()=>setModal(null)}/>}</div>;

  return <div className="app"><audio ref={mainAudioRef} src={MAIN_BGM}/><audio ref={careerAudioRef} src={CAREER_BGM}/>{showCoinRain&&<CoinRain/>}<header><h1>幸福人 Classic <span>{VERSION}</span></h1><div className="topActions"><button onClick={showReleaseNotes}>📜 更新日誌</button><button onClick={()=>setMusic(!music)}>{music?'🔊 音樂開':'🔇 音樂關'}</button><button onClick={()=>setSfx(!sfx)}>{sfx?'🔔 音效開':'🔕 音效關'}</button><div className="supporterBox"><input placeholder="支持者序號" value={supporterInput} onChange={e=>setSupporterInput(e.target.value)}/><button onClick={unlockSupporter}>{supporter?'🌟 已啟用':'啟用特效'}</button></div></div><div className="topLog"><b>Recent Log</b>{logs.slice(0,3).map((l,i)=><p key={i}>{l}</p>)}</div></header><main className="gameLayout"><section className="boardWrap"><div className="outerBoard">{outerBoard.map((tile,i)=><div key={tile.id} className={`tile pos${i} ${boardTile?.id===tile.id?'active':''}`}><span>{i}</span><b>{tile.icon}</b><small>{tile.name}</small><div className="tokens">{players.filter(p=>!p.career&&p.outerPos===i).map(p=><em key={p.id}>{p.animal}</em>)}</div></div>)}<div className="centerStage"><div className="turnBox"><h2>{current?.animal} {current&&displayName(current)}</h2><p>{current&&ageText(current.ageMonths)}｜{current&&stageOf(current.ageMonths)}</p><div className="dice">{dice?dice.total:"🎲"}</div><button className="primary" disabled={moving||gameOver} onClick={rollDice}>{moving?"移動中":"擲骰"}</button><p>{current?.career?`目前在${current.career}內圈，使用單骰。進度 ${(current.careerProgress||0)}/${careerBoards[current.career].length}`:"外圈人生道路，使用雙骰。"}</p></div><div className="wallet"><h3>人生皮夾</h3><p>現金：{current&&money(current.cash)}</p><p>薪水：{current&&money(current.salary)}</p><p>財富：{wealthScore}｜快樂：{current?.happiness}｜名譽：{current?.reputation}</p><p>目標：{current?.target.wealth}/{current?.target.happiness}/{current?.target.reputation}</p><h4>頭銜</h4><div className="titles">{current?.titles.length?current.titles.map(t=><button key={t.id} title="點擊查看頭銜屬性或裝備" className={t.id===current.equippedTitleId?'equipped':''} onClick={()=>titleInfo(t)}>{t.id===current.equippedTitleId?'✓ ':''}{t.title}<small>{t.tier===1?'初階':t.tier===2?'二階':'傳奇'}</small></button>):<span>尚無頭銜</span>}</div></div></div></div></section><aside className="players">{players.map((p,i)=><div key={p.id} className={`playerCard ${i===turn?'current':''}`}><b>{p.animal} {displayName(p)}</b><p>{ageText(p.ageMonths)}</p><p>現金 {money(p.cash)}｜快樂 {p.happiness}｜名譽 {p.reputation}</p><p>{p.career?`正在${p.career}｜進度 ${(p.careerProgress||0)}/${careerBoards[p.career].length}`:`外圈 ${p.outerPos}`}</p><button className="walletOpenBtn" onClick={()=>showPlayerWallet(i)}>查看人生皮夾／頭銜</button></div>)}</aside></main>{modal&&<Modal modal={modal} close={()=>setModal(null)}/>}</div>;
}

function CoinRain(){
  const coins=useMemo(()=>Array.from({length:36},(_,i)=>({id:i,left:Math.random()*100,delay:Math.random()*0.6,duration:1.1+Math.random()*0.9,size:22+Math.random()*18,spin:Math.random()>0.5?1:-1})),[]);
  return <div className="coinRain" aria-hidden="true"><div className="salaryToast">💰 發薪日！</div>{coins.map(c=><span key={c.id} style={{left:`${c.left}%`,animationDelay:`${c.delay}s`,animationDuration:`${c.duration}s`,fontSize:`${c.size}px`,['--spin']:c.spin}}>🪙</span>)}</div>
}

function AchievementPicker({choices, career, nextCount, onConfirm}){
  const [selected,setSelected]=useState(0);
  const selectedChoice=choices[selected] || choices[0];
  return <div className="achievementPicker">
    <div className="achievementChoices">
      {choices.map((a,idx)=><button type="button" key={idx} className={idx===selected?'selected':''} onClick={()=>setSelected(idx)} aria-pressed={idx===selected}>
        <b>{idx===selected?'✓ ':''}{a.title}</b>
        <span>{a.desc}</span>
      </button>)}
    </div>
    <div className="modalActions achievementConfirm">
      <button className="primary" onClick={()=>onConfirm(career, selectedChoice, nextCount)}>確認取得頭銜</button>
    </div>
  </div>
}

function Modal({modal,close}){ return <div className="modalBackdrop"><div className="modal"><h2>{modal.title}</h2>{modal.desc&&<p className="modalDesc">{modal.desc}</p>}{modal.custom}{modal.actions?<div className="modalActions">{modal.actions.map((a,i)=><button key={i} className={i===0?'primary':''} onClick={a.onClick}>{a.label}</button>)}</div>:<button className="primary" onClick={close}>確認</button>}</div></div> }

createRoot(document.getElementById("root")).render(<App />);
