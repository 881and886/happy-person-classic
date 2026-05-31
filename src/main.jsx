
import React, { useMemo, useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const VERSION = "V3.8A 三維事件平衡版";
const STARTING_CASH = 5000;
const START_AGE_MONTHS = 18 * 12;
const MAX_AGE_MONTHS = 100 * 12;
const TARGET_TOTAL = 100;
const SUPPORTER_CODE = "HAPPY-COIN-2026";
const STAR_SUPPORTER_CODE = "HAPPY-STAR-2026";
const COIN_SOUND = "/sounds/coin.mp3";
const STAR_SOUND = "/sounds/star-rain.mp3";
const CAREER_BGM = "/sounds/career.mp3";
const MAIN_BGM = "/bgm.wav";

const FEEDBACK_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfadUBnuJv4SXEo6QoalzRqGDX5V-KulWz7x6rBWLcq_PZcUw/viewform";
const FEEDBACK_ENTRIES = {
  systemInfo: "entry.129605564",
  playerName: "entry.1106737648",
  lifeId: "entry.1205632976",
  gameVersion: "entry.211790992",
  lifeType: "entry.1709456881",
  mainTitle: "entry.232703430",
  achievementAge: "entry.990235420",
  wealth: "entry.1022010614",
  happiness: "entry.261787525",
  fame: "entry.1463652126",
  favoritePart: "entry.445014700",
  improvement: "entry.1936442200",
  mostImpressiveCareer: "entry.908418579",
  mostImpressiveTitle: "entry.1452324522",
  playAgain: "entry.619547856",
  messageToAuthor: "entry.1581778550",
  messageToNextPlayer: "entry.1575234988",
  extraNote: "entry.1224188089"
};

const animals = ["🐱", "🐶", "🦊", "🐼", "🐧", "🐸", "🦁", "🐰"];
const careers = ["學院", "農墾", "企業", "航海", "月球探險", "電影明星", "從政", "開礦"];

const releaseNotes = [
  {version:"V3.8A 三維事件平衡版", theme:"導入600筆三維屬性事件資料庫，改以財富、快樂、名譽各自判斷正向、負向或中性。", items:["正式導入新版600筆職業內圈事件資料，每職業75筆：普通50、稀有20、傳奇5", "事件欄位改採三維屬性：財富、快樂、名譽可分別為正向、負向或中性", "普通事件只影響一種數值，稀有事件影響一至二種，傳奇事件影響二至三種", "事件結果不再依靠語意硬拗或隨機感悟，而是直接使用人工校正後的影響值", "保留流星雨、經典頭銜、24格職業內圈與V3.7系列相容機制"]},

  {version:"V3.7.2 事件語意與人生感悟修正版", theme:"修正職業事件內容與結果方向不一致的問題，新增事件語意校正與人生感悟結語。", items:["新增事件語意校正器，避免冷藏庫故障、被雪藏、差評等負面事件仍給出不合理的全正向結果", "建立核心事件錨點：助學金、獎金、補助、贊助等事件會保證出現合理金錢收益", "重大犧牲／災難事件改為財富與快樂承受代價、名譽可能上升的壯烈結果", "事件結果不只看關鍵字，改採順境、逆境成長、成功代價、重大挫折、壯烈犧牲等類型平衡", "新增人生感悟結語，讓壞事也可能因成長、看清自己或獲得社群支持而帶來合理正向收穫", "結果顯示改為財富／快樂／名譽方向更清楚，降低玩家出戲感" ]},

  {version:"V3.7.1 頭銜收藏冊相容性修正版", theme:"修正 V3.6 舊頭銜升級後被新版240頭銜系統忽略的問題。", items:["新增經典頭銜 Legacy 分類，保留 V3.6 以前已取得但不在新版240頭銜中的收藏", "頭銜集卡冊改為顯示現代頭銜進度、經典頭銜數量與總收藏數", "舊頭銜不再被刪除或覆蓋，將以📜經典頭銜形式保存", "曾擁有舊頭銜的玩家可獲得限定紀念頭銜：幸福人先驅者", "幸福人先驅者為舊版本參與者紀念，不列入新版240頭銜池" ]},

  {version:"V3.7 頭銜宇宙與職業事件整合版", theme:"導入240頭銜、595事件、24格職業內圈、事業轉折點與流星雨演出。", items:["八大職業正式導入240個頭銜，每職業30個：普通15、二階8、菁英4、命運3", "頭銜屬性改為加成倍率，1點等於5%收益加成", "職業內圈統一改為24格，第24格為完成職業，經過或停留皆可觸發", "第1次完成職業只抽普通；第2次開放二階；第3次開放菁英；第4次以上開放命運頭銜", "導入595筆職業事件，統一分類為普通、稀有、傳奇、命運", "事業轉折點正式定案：可選擇回到職業起點重新出發", "命運頭銜提升稀有／傳奇事件機率", "流星雨之夜加入選項、流星雨特效與 star-rain.mp3 音效"]},

  {version:"V3.6 支持者序號與彈窗修正版", theme:"修正彈窗截斷、頭銜選擇頁與頭銜語意分類，並加入命運流星支持者序號。", items:["所有主要對話框改為固定標題與可滑動內容，避免文字被吃掉", "頭銜選擇頁移除重複確認按鈕，確認取得頭銜成為唯一流程按鈕", "職業完成畫面顯示第幾次完成，收藏進度修正為職業總頭銜數", "已收藏標記由勾勾改為📚，避免與已選擇混淆", "頭銜效果依語意與數值方向重新分類，修正快樂損失等負向效果跑到正向效果的問題", "新增 HAPPY-STAR-2026 命運流星序號，啟用後提升稀有事件、傳奇頭銜與深層人生的潛在可能性，但不直接顯示數值", "Google Form 回饋作者功能保留自動帶入人生資料" ]},
  {version:"V3.5 頭銜集卡冊與回饋作者版", theme:"重構頭銜收藏冊、統一頭銜資訊格式，並加入 Google Form 回饋作者自動帶入功能。", items:["頭銜收藏冊改為職業分頁集卡冊，避免清單過長", "收藏冊標題列與關閉按鈕固定，手機操作更順", "職業完成選頭銜時顯示已收藏／新頭銜提示與該職業收藏進度", "頭銜資訊卡統一為人生描述、固定效果、正向效果、人生代價、人生格言", "修正頭銜效果重複顯示與加成／代價混在一起的問題", "回饋作者按鈕連接 Google Form，並自動帶入玩家名稱、人生編號、版本、人生類型、主要頭銜與最終數值", "人生小說與頭銜深度命名持續同步為初階／二階／菁英" ]},
  {version:"V3.4 人生藏書館版", theme:"新增人生小說收藏與藏書館，並統一職業深度命名。", items:["新增人生藏書館，可收藏並重讀曾經活過的人生", "人生小說收藏上限20本，第21本需選擇覆蓋既有藏書", "結局頁新增收藏這段人生按鈕", "職業深度命名由初階／二階／傳奇改為初階／二階／菁英", "已取得頭銜、收藏冊與人生小說同步使用菁英命名", "人生小說持續強化留白、回望與不完美人生的敘事" ]},
  {version:"V3.3 手機操作與地圖視覺平衡版", theme:"針對手機直式操作與地圖視覺重心進行調整。", items:["手機版擲骰按鈕移到玩家名稱右側，減少被人生皮夾遮擋", "骰出數字框縮小，保留可讀性但降低高度占用", "大圈地圖上下排重新置中，改善右上與右下空洞感", "中央資訊框改為更緊湊的手機顯示", "保留 V3.2 頭銜稀有框與人生卡外框效果"]},
  {version:"V3.2 頭銜稀有度與人生收藏版", theme:"頭銜系統正式進入三階稀有度、星級框與人生流派化，並加入頭銜收藏冊雛形。", items:["頭銜稀有度採三階制：普通、稀有、傳奇", "頭銜卡加入棕框／銀框／金框與1～3星角標", "傳奇頭銜加入金色微呼吸與淡流光動畫", "目前裝備頭銜會同步改變玩家人生卡外框", "頭銜列表與頭銜資訊卡同步顯示稀有度與百分比效果", "完成職業時有機會觸發深層人生頭銜", "人生小說與頭銜人格同步微調", "結局頁按鈕由返回遊戲改為重玩一次" ]},
  {version:"V3.1 響應式地圖與頭銜操作修正版", theme:"修正不同載具上的棋盤適配、頭銜查看返回流程、新頭銜裝備選擇與 iOS 金幣顯示。", items:["全載具響應式棋盤適配，避免中央資訊超出地圖", "頭銜資訊卡新增返回頭銜列表流程", "取得新頭銜後不再自動替換，改由玩家決定是否裝備", "iOS 金幣雨改用 CSS 金幣，不再依賴 emoji 顏色", "保留 V3.0 人生小說系統並修正操作體驗"]},
  {version:"V3.0 人生小說正式版", theme:"把人生結局從簡短自傳提升為多模板敘事小說，讓每段人生都能被回望、被記住。", items:["新增20種人生氛圍模板判定", "人生小說改為先揭示達成目標，再倒敘回顧生命旅程", "依初始目標、最終結果、頭銜、家庭、岔路與低谷組合不同敘事", "加入錯過職業道路、人生低潮、家庭片段與頭銜人格的故事化描述", "人生箴言改為依人生型態與頭銜變化", "移除人生評級概念，保留不完美與遺憾的真實感"]},
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

const careerIcons = { 學院:"🎓", 農墾:"🌾", 企業:"💼", 航海:"⚓", 月球探險:"🚀", 電影明星:"🎬", 從政:"🏛️", 開礦:"⛏️" };
function shuffledCareerBoard(career){
  const base=[
    ...Array.from({length:15},(_,i)=>({type:"careerEvent", eventLevel:"普通", label:"普通事件"})),
    ...Array.from({length:5},(_,i)=>({type:"careerEvent", eventLevel:"稀有", label:"稀有事件"})),
    ...Array.from({length:2},(_,i)=>({type:"careerEvent", eventLevel:"傳奇", label:"傳奇事件"})),
    {type:"careerTurn", eventLevel:"轉折", label:"事業轉折點"}
  ];
  for(let i=base.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [base[i],base[j]]=[base[j],base[i]]; }
  return [...base, {type:"careerComplete", eventLevel:"完成", label:"完成職業"}].map((tile,i)=>({
    id:`${career}-${i+1}`,
    name:i===23?`${career}完成職業`:`${career}${tile.label}`,
    career,
    icon:i===23?"🏆":tile.type==="careerTurn"?"🔄":careerIcons[career],
    ...tile
  }));
}
const careerBoards = Object.fromEntries(careers.map(career => [career, shuffledCareerBoard(career)]));

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
  "學院": [
    {
      "id": "v38-學院-1",
      "title": "深夜的靈感爆發",
      "desc": "深夜的靈感爆發。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-2",
      "title": "跨越世代的忘年交",
      "desc": "跨越世代的忘年交。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 460,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "23,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-3",
      "title": "學生的小小心意",
      "desc": "學生的小小心意。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 440,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "22,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-4",
      "title": "圖書館的隱藏夾頁",
      "desc": "圖書館的隱藏夾頁。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "18,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-5",
      "title": "讀書會的靈魂共鳴",
      "desc": "讀書會的靈魂共鳴。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-6",
      "title": "完美的公開演示",
      "desc": "完美的公開演示。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-7",
      "title": "校園電台的邀約",
      "desc": "校園電台的邀約。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 300,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "15,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-8",
      "title": "被認可的嚴謹筆記",
      "desc": "被認可的嚴謹筆記。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 420,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "21,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-9",
      "title": "助學金的及時雨",
      "desc": "助學金的及時雨。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 300,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "15,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-10",
      "title": "點亮他人的微光",
      "desc": "點亮他人的微光。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-11",
      "title": "學術期刊的首發",
      "desc": "學術期刊的首發。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-12",
      "title": "思辨的完勝時刻",
      "desc": "思辨的完勝時刻。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 580,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "29,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-13",
      "title": "知識的無邊界探索",
      "desc": "知識的無邊界探索。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-14",
      "title": "老校工的贈禮",
      "desc": "老校工的贈禮。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 400,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "20,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-15",
      "title": "旁聽席上的驚喜",
      "desc": "旁聽席上的驚喜。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-16",
      "title": "學術研討會的小火花",
      "desc": "學術研討會的小火花。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-17",
      "title": "深夜白板的彩蛋",
      "desc": "深夜白板的彩蛋。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 420,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "21,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-18",
      "title": "校園櫻花樹下的體悟",
      "desc": "校園櫻花樹下的體悟。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-19",
      "title": "被引用的小小驕傲",
      "desc": "被引用的小小驕傲。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 540,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "27,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-20",
      "title": "學術社群的意見領袖",
      "desc": "學術社群的意見領袖。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 520,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "26,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-21",
      "title": "二手書裡的溫暖留字",
      "desc": "二手書裡的溫暖留字。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-22",
      "title": "解開歷史的謎題",
      "desc": "解開歷史的謎題。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 580,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "29,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-23",
      "title": "打破常規的跨界課",
      "desc": "打破常規的跨界課。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-24",
      "title": "學術偶像的回信",
      "desc": "學術偶像的回信。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-25",
      "title": "教育紀錄片的採訪",
      "desc": "教育紀錄片的採訪。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-26",
      "title": "論文數據的自我修正",
      "desc": "論文數據的自我修正。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-27",
      "title": "意外的教具創新",
      "desc": "意外的教具創新。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-28",
      "title": "社群網絡的搭建",
      "desc": "社群網絡的搭建。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-29",
      "title": "學術報告的完美句點",
      "desc": "學術報告的完美句點。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 440,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "22,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-30",
      "title": "校友回娘家的驚喜",
      "desc": "校友回娘家的驚喜。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-31",
      "title": "與老友的學術競賽",
      "desc": "與老友的學術競賽。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "18,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-32",
      "title": "終身學習的第一步",
      "desc": "終身學習的第一步。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-33",
      "title": "點擊量破萬的開源教材",
      "desc": "點擊量破萬的開源教材。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-34",
      "title": "研究室的除夕夜",
      "desc": "研究室的除夕夜。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 520,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "26,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-35",
      "title": "一次成功的質疑",
      "desc": "一次成功的質疑。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-36",
      "title": "象牙塔內的靈魂失重",
      "desc": "象牙塔內的靈魂失重。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-37",
      "title": "公共信任的全面破產",
      "desc": "公共信任的全面破產。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-38",
      "title": "實驗室深夜火災",
      "desc": "實驗室深夜火災。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-39",
      "title": "教學大樓的突發停電",
      "desc": "教學大樓的突發停電。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-40",
      "title": "被惡意舉報的學術不端",
      "desc": "被惡意舉報的學術不端。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": -220,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-11,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-41",
      "title": "被退稿的深夜打擊",
      "desc": "被退稿的深夜打擊。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-42",
      "title": "研究經費的被砍風暴",
      "desc": "研究經費的被砍風暴。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-43",
      "title": "匿名審稿人的刁難",
      "desc": "匿名審稿人的刁難。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-44",
      "title": "理念不合的學術爭吵",
      "desc": "理念不合的學術爭吵。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": -360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-18,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-45",
      "title": "被剽竊的專題創意",
      "desc": "被剽竊的專題創意。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": -300,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-15,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-46",
      "title": "期末系統的崩潰災難",
      "desc": "期末系統的崩潰災難。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-47",
      "title": "讀書會的理念決裂",
      "desc": "讀書會的理念決裂。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": -380,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-19,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-48",
      "title": "學術新人的講台恐懼",
      "desc": "學術新人的講台恐懼。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-49",
      "title": "被曲解的公開言論",
      "desc": "被曲解的公開言論。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": -200,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-10,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-50",
      "title": "學術門閥的聯手封殺",
      "desc": "學術門閥的聯手封殺。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-51",
      "title": "智慧燈塔的指引",
      "desc": "智慧燈塔的指引。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-52",
      "title": "跨域重組的勝利",
      "desc": "跨域重組的勝利。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "0,0,4",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-53",
      "title": "點石成金的學習指南",
      "desc": "點石成金的學習指南。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 3,
      "impactRaw": "0,3,3",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-54",
      "title": "頂級研究戰隊的誕生",
      "desc": "頂級研究戰隊的誕生。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 900,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "45,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-55",
      "title": "來自體制高牆的橄欖枝",
      "desc": "來自體制高牆的橄欖枝。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 660,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "33,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-56",
      "title": "萬世師表的世紀加冕",
      "desc": "萬世師表的世紀加冕。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-57",
      "title": "真理方程的終極破譯",
      "desc": "真理方程的終極破譯。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 840,
      "happiness": 0,
      "reputation": 3,
      "impactRaw": "42,0,3",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-58",
      "title": "知識火種的完美交棒",
      "desc": "知識火種的完美交棒。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 4,
      "impactRaw": "0,2,4",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-59",
      "title": "萬人空巷的公開課",
      "desc": "萬人空巷的公開課。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "0,0,4",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-60",
      "title": "教科書級別的命名",
      "desc": "教科書級別的命名。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 3,
      "impactRaw": "0,2,3",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-61",
      "title": "劃時代的理論修正",
      "desc": "劃時代的理論修正。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 600,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "30,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-62",
      "title": "桃李滿天下的隱退盛宴",
      "desc": "桃李滿天下的隱退盛宴。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-63",
      "title": "神經網絡的未來解碼",
      "desc": "神經網絡的未來解碼。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 680,
      "happiness": 0,
      "reputation": 3,
      "impactRaw": "34,0,3",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-64",
      "title": "顛覆體制的新教育法案",
      "desc": "顛覆體制的新教育法案。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "0,0,4",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-65",
      "title": "被偷走的終身頭銜",
      "desc": "被偷走的終身頭銜。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-66",
      "title": "體制改革的流產風暴",
      "desc": "體制改革的流產風暴。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "稀有",
      "cash": -480,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "-24,0,-2",
      "attributeProfile": "財富:負向,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-67",
      "title": "團隊核心骨幹的集體出走",
      "desc": "團隊核心骨幹的集體出走。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "稀有",
      "cash": -560,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-28,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-68",
      "title": "跨領域實驗的全面崩潰",
      "desc": "跨領域實驗的全面崩潰。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "稀有",
      "cash": -400,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-20,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-69",
      "title": "被精心設計的學術陷阱",
      "desc": "被精心設計的學術陷阱。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "0,0,-3",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-70",
      "title": "被惡意舉報的學術不端",
      "desc": "被惡意舉報的學術不端。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-71",
      "title": "走出象牙塔的勇氣",
      "desc": "走出象牙塔的勇氣。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 3,
      "reputation": 4,
      "impactRaw": "0,3,4",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-72",
      "title": "跨越世代的忘年交",
      "desc": "跨越世代的忘年交。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "傳奇",
      "cash": 1180,
      "happiness": 3,
      "reputation": 4,
      "impactRaw": "59,3,4",
      "attributeProfile": "財富:正向,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-73",
      "title": "學生的小小心意",
      "desc": "學生的小小心意。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "傳奇",
      "cash": 900,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "45,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-74",
      "title": "圖書館的隱藏夾頁",
      "desc": "圖書館的隱藏夾頁。你在學院生涯中獲得了重大的突破或溫暖的肯定。團隊協作或個人研究成果得到了教授、同儕和社會大眾的一致推崇，讓你在求知與教育的道路上更有信心，也為未來的小說人生鋪設了極高的起點與光彩。",
      "eventLevel": "傳奇",
      "cash": 920,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "46,0,4",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-學院-75",
      "title": "被剽竊的專題創意",
      "desc": "被剽竊的專題創意。你在象牙塔內遭遇了體制的僵化、學術的刁難或是人際關係的決裂。經費被砍、論文被退或者成果被剽竊的陰影籠罩著你，迫使你在嚴酷的現實與理想的邊緣做出痛苦的抉擇，職涯面臨巨大考驗。",
      "eventLevel": "傳奇",
      "cash": -880,
      "happiness": -5,
      "reputation": 0,
      "impactRaw": "-44,-5,0",
      "attributeProfile": "財富:負向,快樂:負向,名譽:中性",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    }
  ],
  "農墾": [
    {
      "id": "v38-農墾-76",
      "title": "破土而出的金色神蹟",
      "desc": "破土而出的金色神蹟。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-77",
      "title": "大地的慷慨餽贈",
      "desc": "大地的慷慨餽贈。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 380,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "19,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-78",
      "title": "第一台拖拉機的轟鳴",
      "desc": "第一台拖拉機的轟鳴。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-79",
      "title": "果園裡的深夜螢光",
      "desc": "果園裡的深夜螢光。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 600,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "30,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-80",
      "title": "老農夫的祕密手札",
      "desc": "老農夫的祕密手札。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-81",
      "title": "鄰里間的暖心臘八粥",
      "desc": "鄰里間的暖心臘八粥。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "18,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-82",
      "title": "新品種草莓的誕生",
      "desc": "新品種草莓的誕生。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-83",
      "title": "田埂上的小詩人",
      "desc": "田埂上的小詩人。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-84",
      "title": "社區集體的大聚餐",
      "desc": "社區集體的大聚餐。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-85",
      "title": "精準的避災預報",
      "desc": "精準的避災預報。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-86",
      "title": "土地肥力的祕密奇蹟",
      "desc": "土地肥力的祕密奇蹟。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-87",
      "title": "農業專家的公開點讚",
      "desc": "農業專家的公開點讚。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 540,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "27,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-88",
      "title": "大白鵝警衛隊的勝利",
      "desc": "大白鵝警衛隊的勝利。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-89",
      "title": "山泉水的完美引入",
      "desc": "山泉水的完美引入。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 440,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "22,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-90",
      "title": "農產市集的銷售冠軍",
      "desc": "農產市集的銷售冠軍。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 420,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "21,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-91",
      "title": "荒野小徑的奇遇",
      "desc": "荒野小徑的奇遇。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-92",
      "title": "老式水車的復活",
      "desc": "老式水車的復活。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 560,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "28,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-93",
      "title": "種子交換會的驚喜",
      "desc": "種子交換會的驚喜。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 460,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "23,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-94",
      "title": "第一筆海外訂單",
      "desc": "第一筆海外訂單。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-95",
      "title": "稻田裡的魚鴨交響樂",
      "desc": "稻田裡的魚鴨交響樂。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 580,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "29,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-96",
      "title": "泥土裡的傳家寶",
      "desc": "泥土裡的傳家寶。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-97",
      "title": "蜜蜂家族的集體定居",
      "desc": "蜜蜂家族的集體定居。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 300,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "15,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-98",
      "title": "夜宿荒野的星空體悟",
      "desc": "夜宿荒野的星空體悟。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 440,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "22,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-99",
      "title": "農場開放日的歡笑",
      "desc": "農場開放日的歡笑。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 560,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "28,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-100",
      "title": "自製風力抽水機成功",
      "desc": "自製風力抽水機成功。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-101",
      "title": "古老岩畫的發現",
      "desc": "古老岩畫的發現。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 540,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "27,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-102",
      "title": "竹筍大棚的雪中爆擊",
      "desc": "竹筍大棚的雪中爆擊。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 400,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "20,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-103",
      "title": "流浪貓組建的捕鼠隊",
      "desc": "流浪貓組建的捕鼠隊。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-104",
      "title": "蚯蚓大軍的泥土魔法",
      "desc": "蚯蚓大軍的泥土魔法。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-105",
      "title": "野生薄荷的商機",
      "desc": "野生薄荷的商機。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-106",
      "title": "萬物共生之歌",
      "desc": "萬物共生之歌。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-107",
      "title": "智慧大腦的科技務農",
      "desc": "智慧大腦的科技務農。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 420,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "21,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-108",
      "title": "綠色走廊的創生神蹟",
      "desc": "綠色走廊的創生神蹟。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-109",
      "title": "高端品牌的世紀誕生",
      "desc": "高端品牌的世紀誕生。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 320,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "16,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-110",
      "title": "火山灰土的空間魔術",
      "desc": "火山灰土的空間魔術。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-111",
      "title": "跨國種子巨頭的惡意訴訟",
      "desc": "跨國種子巨頭的惡意訴訟。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": -480,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-24,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-112",
      "title": "蝗蟲狂潮的滅頂災難",
      "desc": "蝗蟲狂潮的滅頂災難。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-113",
      "title": "致命植物病毒的擴散",
      "desc": "致命植物病毒的擴散。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-114",
      "title": "創生基地的資金斷鏈",
      "desc": "創生基地的資金斷鏈。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": -460,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-23,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-115",
      "title": "地下水層的化學污染",
      "desc": "地下水層的化學污染。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": -460,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-23,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-116",
      "title": "氣候極端異常的連擊",
      "desc": "氣候極端異常的連擊。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-117",
      "title": "親密夥伴的專利背叛",
      "desc": "親密夥伴的專利背叛。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-118",
      "title": "乾旱導致的地下水枯竭",
      "desc": "乾旱導致的地下水枯竭。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -2,
      "reputation": 0,
      "impactRaw": "0,-2,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-119",
      "title": "連綿陰雨引起的作物霉變",
      "desc": "連綿陰雨引起的作物霉變。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-120",
      "title": "化肥過量引發的土壤鹽鹼化",
      "desc": "化肥過量引發的土壤鹽鹼化。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-121",
      "title": "暖棚夜間加熱器停電",
      "desc": "暖棚夜間加熱器停電。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-122",
      "title": "罕見植物根瘤菌爆發",
      "desc": "罕見植物根瘤菌爆發。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-123",
      "title": "瘋狂野豬群的鐵網突破",
      "desc": "瘋狂野豬群的鐵網突破。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -2,
      "reputation": 0,
      "impactRaw": "0,-2,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-124",
      "title": "上游水庫的無預警洩洪",
      "desc": "上游水庫的無預警洩洪。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-125",
      "title": "鄰村惡意侵佔邊界土地",
      "desc": "鄰村惡意侵佔邊界土地。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "普通",
      "cash": -340,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-17,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-126",
      "title": "大地守護者的世紀防線",
      "desc": "大地守護者的世紀防線。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 880,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "44,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-127",
      "title": "全省共富的創生領航",
      "desc": "全省共富的創生領航。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 880,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "44,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-128",
      "title": "古茶樹的生命復活",
      "desc": "古茶樹的生命復活。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 720,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "36,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-129",
      "title": "綠色革命的救世之光",
      "desc": "綠色革命的救世之光。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 640,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "32,2,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-130",
      "title": "沙漠變綠洲的生命奇蹟",
      "desc": "沙漠變綠洲的生命奇蹟。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 880,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "44,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-131",
      "title": "創生領航員的跨界大捷",
      "desc": "創生領航員的跨界大捷。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "0,0,4",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-132",
      "title": "土地傳承者的靈魂歸宿",
      "desc": "土地傳承者的靈魂歸宿。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 680,
      "happiness": 0,
      "reputation": 3,
      "impactRaw": "34,0,3",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-133",
      "title": "百年農匠的世紀傳奇",
      "desc": "百年農匠的世紀傳奇。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 680,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "34,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-134",
      "title": "耐鹽鹼海之稻的誕生",
      "desc": "耐鹽鹼海之稻的誕生。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 800,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "40,2,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-135",
      "title": "新大陸的創生啟航",
      "desc": "新大陸的創生啟航。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 2,
      "impactRaw": "0,3,2",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-136",
      "title": "土地肥力的祕密奇蹟",
      "desc": "土地肥力的祕密奇蹟。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 3,
      "impactRaw": "0,0,3",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-137",
      "title": "農業專家的公開點讚",
      "desc": "農業專家的公開點讚。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 800,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "40,0,2",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-138",
      "title": "大白鵝警衛隊的勝利",
      "desc": "大白鵝警衛隊的勝利。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 860,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "43,2,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-139",
      "title": "山泉水的完美引入",
      "desc": "山泉水的完美引入。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "稀有",
      "cash": 680,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "34,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-140",
      "title": "化肥過量引發的土壤鹽鹼化",
      "desc": "化肥過量引發的土壤鹽鹼化。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -3,
      "reputation": 0,
      "impactRaw": "0,-3,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-141",
      "title": "暖棚夜間加熱器停電",
      "desc": "暖棚夜間加熱器停電。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "稀有",
      "cash": -520,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "-26,0,-2",
      "attributeProfile": "財富:負向,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-142",
      "title": "罕見植物根瘤菌爆發",
      "desc": "罕見植物根瘤菌爆發。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -3,
      "reputation": 0,
      "impactRaw": "0,-3,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-143",
      "title": "瘋狂野豬群的鐵網突破",
      "desc": "瘋狂野豬群的鐵網突破。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "0,0,-3",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-144",
      "title": "上游水庫的無預警洩洪",
      "desc": "上游水庫的無預警洩洪。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -3,
      "reputation": -3,
      "impactRaw": "0,-3,-3",
      "attributeProfile": "財富:中性,快樂:負向,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-145",
      "title": "鄰村惡意侵佔邊界土地",
      "desc": "鄰村惡意侵佔邊界土地。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "稀有",
      "cash": -440,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-22,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-146",
      "title": "破土而出的金色神蹟",
      "desc": "破土而出的金色神蹟。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "傳奇",
      "cash": 1160,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "58,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-147",
      "title": "大地的慷慨餽贈",
      "desc": "大地的慷慨餽贈。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "傳奇",
      "cash": 920,
      "happiness": 4,
      "reputation": 4,
      "impactRaw": "46,4,4",
      "attributeProfile": "財富:正向,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-148",
      "title": "第一台拖拉機的轟鳴",
      "desc": "第一台拖拉機的轟鳴。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 4,
      "reputation": 4,
      "impactRaw": "0,4,4",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-149",
      "title": "果園裡的深夜螢光",
      "desc": "果園裡的深夜螢光。大自然對你的辛勤耕耘給予了最豐厚的回報。無論是驚人的超級大豐收、新品種的成功培育，還是生態農業帶來的社會榮譽與創生商機，都讓你在這片土地上找到了與萬物共生共榮的深刻人生幸福感。",
      "eventLevel": "傳奇",
      "cash": 1140,
      "happiness": 0,
      "reputation": 5,
      "impactRaw": "57,0,5",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-農墾-150",
      "title": "鄰村惡意侵佔邊界土地",
      "desc": "鄰村惡意侵佔邊界土地。極端氣候突襲、病蟲害狂潮或者是商業體制的惡意訴訟，讓你的心血在短時間內化為烏有。乾旱、洪水與背叛輪番折磨著這片土地，你必須冒著巨大的風險進行緊急救治，在絕望的邊緣奮力保全核心作物。",
      "eventLevel": "傳奇",
      "cash": -700,
      "happiness": -4,
      "reputation": -3,
      "impactRaw": "-35,-4,-3",
      "attributeProfile": "財富:負向,快樂:負向,名譽:負向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    }
  ],
  "企業": [
    {
      "id": "v38-企業-151",
      "title": "風投巨頭的青睞",
      "desc": "風投巨頭的青睞。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "18,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-152",
      "title": "完美的市場狙擊",
      "desc": "完美的市場狙擊。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-153",
      "title": "面試官的破格錄取",
      "desc": "面試官的破格錄取。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-154",
      "title": "客服郵件帶來的百萬訂單",
      "desc": "客服郵件帶來的百萬訂單。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "18,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-155",
      "title": "會議室的驚艷發言",
      "desc": "會議室的驚艷發言。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-156",
      "title": "神隊友的完美補位",
      "desc": "神隊友的完美補位。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-157",
      "title": "病毒式傳播的創意行銷",
      "desc": "病毒式傳播的創意行銷。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-158",
      "title": "Ｋ線圖裡的金色呼吸",
      "desc": "Ｋ線圖裡的金色呼吸。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-159",
      "title": "秋風未動的商機直覺",
      "desc": "秋風未動的商機直覺。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-160",
      "title": "一塊錢的流程魔術",
      "desc": "一塊錢的流程魔術。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-161",
      "title": "緊閉大門後的握手",
      "desc": "緊閉大門後的握手。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 420,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "21,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-162",
      "title": "咖啡廳的和解奇蹟",
      "desc": "咖啡廳的和解奇蹟。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-163",
      "title": "對手底牌的精準預判",
      "desc": "對手底牌的精準預判。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "25,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-164",
      "title": "商務旅人的異國奇遇",
      "desc": "商務旅人的異國奇遇。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-165",
      "title": "產品推廣的超級爆擊",
      "desc": "產品推廣的超級爆擊。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-166",
      "title": "辦公桌上的神秘盆栽",
      "desc": "辦公桌上的神秘盆栽。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-167",
      "title": "財務審計的驚險排雷",
      "desc": "財務審計的驚險排雷。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-168",
      "title": "舊辦公椅裡的福報",
      "desc": "舊辦公椅裡的福報。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-169",
      "title": "完美的危機公關",
      "desc": "完美的危機公關。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-170",
      "title": "團隊凝聚力的最高光",
      "desc": "團隊凝聚力的最高光。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-171",
      "title": "被採納的荒謬創意",
      "desc": "被採納的荒謬創意。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-172",
      "title": "投資組合的完美避險",
      "desc": "投資組合的完美避險。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 560,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "28,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-173",
      "title": "海外分公司的破冰船",
      "desc": "海外分公司的破冰船。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-174",
      "title": "商業論壇的閃耀新星",
      "desc": "商業論壇的閃耀新星。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-175",
      "title": "深夜打卡鐘的溫柔",
      "desc": "深夜打卡鐘的溫柔。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-176",
      "title": "傳奇帝國的誕生",
      "desc": "傳奇帝國的誕生。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-177",
      "title": "粉絲經濟的奇蹟控盤",
      "desc": "粉絲經濟的奇蹟控盤。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-178",
      "title": "天使輪的資金狂潮",
      "desc": "天使輪的資金狂潮。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 560,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "28,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-179",
      "title": "偷天換日的商業戰役",
      "desc": "偷天換日的商業戰役。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-180",
      "title": "海外處女地的插旗大捷",
      "desc": "海外處女地的插旗大捷。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-181",
      "title": "精準抄底的獵手之王",
      "desc": "精準抄底的獵手之王。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-182",
      "title": "中流砥柱的危機救援",
      "desc": "中流砥柱的危機救援。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-183",
      "title": "夕陽產業的金色涅槃",
      "desc": "夕陽產業的金色涅槃。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-184",
      "title": "資本市場的金融魔術",
      "desc": "資本市場的金融魔術。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-185",
      "title": "企業領航員的世紀大捷",
      "desc": "企業領航員的世紀大捷。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-186",
      "title": "惡意收購的致命絞殺",
      "desc": "惡意收購的致命絞殺。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": -360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-18,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-187",
      "title": "合夥人的捲款背叛",
      "desc": "合夥人的捲款背叛。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-188",
      "title": "商業帝國的全面反壟斷調查",
      "desc": "商業帝國的全面反壟斷調查。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": -380,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-19,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-189",
      "title": "世紀金融海嘯的全面爆倉",
      "desc": "世紀金融海嘯的全面爆倉。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": -500,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-25,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-190",
      "title": "全球產品的致命設計缺陷",
      "desc": "全球產品的致命設計缺陷。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": -360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-18,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-191",
      "title": "稅務機關的全面合規徹查",
      "desc": "稅務機關的全面合規徹查。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -2,
      "reputation": 0,
      "impactRaw": "0,-2,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-192",
      "title": "惡意專利流氓的巨額索賠",
      "desc": "惡意專利流氓的巨額索賠。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-193",
      "title": "工廠深夜發生的火災損失",
      "desc": "工廠深夜發生的火災損失。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-194",
      "title": "公關形象的災難性崩潰",
      "desc": "公關形象的災難性崩潰。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-195",
      "title": "主要渠道商的集體聯合封殺",
      "desc": "主要渠道商的集體聯合封殺。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-196",
      "title": "被內部泄露的核心配方",
      "desc": "被內部泄露的核心配方。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": -420,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-21,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-197",
      "title": "核心服務器的深夜崩潰",
      "desc": "核心服務器的深夜崩潰。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-198",
      "title": "供應鏈的無預警斷裂",
      "desc": "供應鏈的無預警斷裂。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": -240,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-12,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-199",
      "title": "客戶群體的大規模食物中毒",
      "desc": "客戶群體的大規模食物中毒。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": -400,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-20,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-200",
      "title": "被惡意舉報的財務危機",
      "desc": "被惡意舉報的財務危機。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-201",
      "title": "富可敵國的金融帝國",
      "desc": "富可敵國的金融帝國。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-202",
      "title": "金錢帝國的建築大師",
      "desc": "金錢帝國的建築大師。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-203",
      "title": "超越時代的宇宙商路啟航",
      "desc": "超越時代的宇宙商路啟航。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 4,
      "impactRaw": "0,3,4",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-204",
      "title": "全球綠色標準的掌舵加冕",
      "desc": "全球綠色標準的掌舵加冕。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 4,
      "impactRaw": "0,2,4",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-205",
      "title": "哈佛商學院的傳奇教材",
      "desc": "哈佛商學院的傳奇教材。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 4,
      "impactRaw": "0,2,4",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-206",
      "title": "神隊友的完美補位",
      "desc": "神隊友的完美補位。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 3,
      "impactRaw": "0,2,3",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-207",
      "title": "病毒式傳播的創意行銷",
      "desc": "病毒式傳播的創意行銷。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 740,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "37,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-208",
      "title": "Ｋ線圖裡的金色呼吸",
      "desc": "Ｋ線圖裡的金色呼吸。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 680,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "34,2,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-209",
      "title": "秋風未動的商機直覺",
      "desc": "秋風未動的商機直覺。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-210",
      "title": "一塊錢的流程魔術",
      "desc": "一塊錢的流程魔術。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 860,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "43,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-211",
      "title": "緊閉大門後的握手",
      "desc": "緊閉大門後的握手。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 2,
      "impactRaw": "0,3,2",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-212",
      "title": "咖啡廳的和解奇蹟",
      "desc": "咖啡廳的和解奇蹟。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "0,3,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-213",
      "title": "對手底牌的精準預判",
      "desc": "對手底牌的精準預判。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 3,
      "impactRaw": "0,0,3",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-214",
      "title": "商務旅人的異國奇遇",
      "desc": "商務旅人的異國奇遇。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "稀有",
      "cash": 780,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "39,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-215",
      "title": "主要渠道商的集體聯合封殺",
      "desc": "主要渠道商的集體聯合封殺。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "稀有",
      "cash": -400,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "-20,0,-3",
      "attributeProfile": "財富:負向,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-216",
      "title": "被內部泄露的核心配方",
      "desc": "被內部泄露的核心配方。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -3,
      "reputation": -2,
      "impactRaw": "0,-3,-2",
      "attributeProfile": "財富:中性,快樂:負向,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-217",
      "title": "核心服務器的深夜崩潰",
      "desc": "核心服務器的深夜崩潰。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -3,
      "reputation": -2,
      "impactRaw": "0,-3,-2",
      "attributeProfile": "財富:中性,快樂:負向,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-218",
      "title": "供應鏈的無預警斷裂",
      "desc": "供應鏈的無預警斷裂。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "0,0,-3",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-219",
      "title": "客戶群體的大規模食物中毒",
      "desc": "客戶群體的大規模食物中毒。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "稀有",
      "cash": -660,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "-33,0,-2",
      "attributeProfile": "財富:負向,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-220",
      "title": "被惡意舉報的財務危機",
      "desc": "被惡意舉報的財務危機。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -3,
      "reputation": 0,
      "impactRaw": "0,-3,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-221",
      "title": "風投巨頭的青睞",
      "desc": "風投巨頭的青睞。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 4,
      "reputation": 4,
      "impactRaw": "0,4,4",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-222",
      "title": "完美的市場狙擊",
      "desc": "完美的市場狙擊。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "傳奇",
      "cash": 1060,
      "happiness": 4,
      "reputation": 5,
      "impactRaw": "53,4,5",
      "attributeProfile": "財富:正向,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-223",
      "title": "面試官的破格錄取",
      "desc": "面試官的破格錄取。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "傳奇",
      "cash": 920,
      "happiness": 4,
      "reputation": 0,
      "impactRaw": "46,4,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-224",
      "title": "客服郵件帶來的百萬訂單",
      "desc": "客服郵件帶來的百萬訂單。商業智慧與大膽抉擇讓你在商海中插上勝利的旗幟。投資巨頭的注資、市場營銷的爆紅、或者跨國併購的完美成功，讓公司的股價一飛沖天，你一步步建立起屬於自己的商業帝國，掌握資本底層脈絡。",
      "eventLevel": "傳奇",
      "cash": 920,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "46,0,4",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-企業-225",
      "title": "被惡意舉報的財務危機",
      "desc": "被惡意舉報的財務危機。金融海嘯、供應鏈斷裂、合夥人的捲款背叛或者反壟斷法庭的傳喚，讓你的企業帝國面臨滅頂之災。惡意做空與信譽公關危機輪番轟炸，稍有不慎便會面臨破產清算與資產徹底清零的下場。",
      "eventLevel": "傳奇",
      "cash": -720,
      "happiness": 0,
      "reputation": -4,
      "impactRaw": "-36,0,-4",
      "attributeProfile": "財富:負向,快樂:中性,名譽:負向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    }
  ],
  "從政": [
    {
      "id": "v38-從政-226",
      "title": "街坊鄰里的自發擁護",
      "desc": "街坊鄰里的自發擁護。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 380,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "19,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-227",
      "title": "破冰的歷史性法案",
      "desc": "破冰的歷史性法案。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-228",
      "title": "深夜路燈下的擁抱",
      "desc": "深夜路燈下的擁抱。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-229",
      "title": "政府績效考核的驚喜第一",
      "desc": "政府績效考核的驚喜第一。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-230",
      "title": "一杯清茶平息的百年宗族怨",
      "desc": "一杯清茶平息的百年宗族怨。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-231",
      "title": "捕捉時代痛點的萬字建議書",
      "desc": "捕捉時代痛點的萬字建議書。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-232",
      "title": "公民聯署的驚人狂瀾",
      "desc": "公民聯署的驚人狂瀾。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 480,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "24,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-233",
      "title": "陽光法案的幕後推手",
      "desc": "陽光法案的幕後推手。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 300,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "15,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-234",
      "title": "特定議題的媒體高光",
      "desc": "特定議題的媒體高光。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-235",
      "title": "社會觀察家的犀利排雷",
      "desc": "社會觀察家的犀利排雷。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-236",
      "title": "青年論壇的靈魂導師",
      "desc": "青年論壇的靈魂導師。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 440,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "22,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-237",
      "title": "公益項目的閉環神蹟",
      "desc": "公益項目的閉環神蹟。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 480,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "24,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-238",
      "title": "體制內的破格提拔",
      "desc": "體制內的破格提拔。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-239",
      "title": "初心不改的靈魂慰藉",
      "desc": "初心不改的靈魂慰藉。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-240",
      "title": "流浪動物保護法案的落地",
      "desc": "流浪動物保護法案的落地。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-241",
      "title": "一次完美的公共危機公關",
      "desc": "一次完美的公共危機公關。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-242",
      "title": "老街坊的無雙戰友",
      "desc": "老街坊的無雙戰友。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "25,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-243",
      "title": "政務大廳的微笑奇蹟",
      "desc": "政務大廳的微笑奇蹟。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 560,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "28,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-244",
      "title": "一次成功的國際友好城市締結",
      "desc": "一次成功的國際友好城市締結。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-245",
      "title": "深夜食堂的底層對話",
      "desc": "深夜食堂的底層對話。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-246",
      "title": "舉國沸騰的和平盛世",
      "desc": "舉國沸騰的和平盛世。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-247",
      "title": "造福桑梓的百億財政特批",
      "desc": "造福桑梓的百億財政特批。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-248",
      "title": "城市魔術師的綠色奇蹟",
      "desc": "城市魔術師的綠色奇蹟。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-249",
      "title": "諸侯一方的地方封疆大印",
      "desc": "諸侯一方的地方封疆大印。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-250",
      "title": "國家智庫的核心大腦",
      "desc": "國家智庫的核心大腦。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-251",
      "title": "政壇鐵面的世紀排雷",
      "desc": "政壇鐵面的世紀排雷。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-252",
      "title": "慈善領袖的信任高牆",
      "desc": "慈善領袖的信任高牆。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-253",
      "title": "體制內的高效風暴",
      "desc": "體制內的高效風暴。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-254",
      "title": "魅力領袖的靈魂演說",
      "desc": "魅力領袖的靈魂演說。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 460,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "23,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-255",
      "title": "大國博弈的治國大匠",
      "desc": "大國博弈的治國大匠。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-256",
      "title": "萬民愛戴的國家精神圖騰",
      "desc": "萬民愛戴的國家精神圖騰。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-257",
      "title": "一代名相的盛世加冕",
      "desc": "一代名相的盛世加冕。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-258",
      "title": "救世慈悲的諾貝爾和平獎",
      "desc": "救世慈悲的諾貝爾和平獎。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-259",
      "title": "民主奮鬥的無雙活歷史",
      "desc": "民主奮鬥的無雙活歷史。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 600,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "30,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-260",
      "title": "宇宙主權體系的奠基法典",
      "desc": "宇宙主權體系的奠基法典。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "普通",
      "cash": 520,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "26,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-261",
      "title": "反對派派系的聯手彈劾",
      "desc": "反對派派系的聯手彈劾。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-262",
      "title": "秘密政變的生死邊緣",
      "desc": "秘密政變的生死邊緣。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-263",
      "title": "核心幕僚的集體政治背叛",
      "desc": "核心幕僚的集體政治背叛。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-264",
      "title": "引發全國癱瘓的階級大罷工",
      "desc": "引發全國癱瘓的階級大罷工。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-265",
      "title": "被瘋狂刺殺的驚險瞬間",
      "desc": "被瘋狂刺殺的驚險瞬間。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": -360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-18,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-266",
      "title": "審計署發起的財務倒查",
      "desc": "審計署發起的財務倒查。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-267",
      "title": "媒體挖出多年前的言論污點",
      "desc": "媒體挖出多年前的言論污點。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -2,
      "reputation": 0,
      "impactRaw": "0,-2,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-268",
      "title": "政策失誤引發的街頭抗議狂潮",
      "desc": "政策失誤引發的街頭抗議狂潮。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-269",
      "title": "被上級無情奪走的政績成果",
      "desc": "被上級無情奪走的政績成果。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-270",
      "title": "核心選區的集體倒戈危機",
      "desc": "核心選區的集體倒戈危機。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -2,
      "reputation": 0,
      "impactRaw": "0,-2,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-271",
      "title": "被惡意設計的腐敗陷阱",
      "desc": "被惡意設計的腐敗陷阱。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": -320,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-16,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-272",
      "title": "大選前夕的抹黑風暴",
      "desc": "大選前夕的抹黑風暴。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": -260,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-13,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-273",
      "title": "派系鬥爭的替罪羊危機",
      "desc": "派系鬥爭的替罪羊危機。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-274",
      "title": "引資項目的村民集體暴動",
      "desc": "引資項目的村民集體暴動。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-275",
      "title": "跨國犯罪集團的私下恐嚇",
      "desc": "跨國犯罪集團的私下恐嚇。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-276",
      "title": "街坊鄰里的自發擁護",
      "desc": "街坊鄰里的自發擁護。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 4,
      "impactRaw": "0,3,4",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-277",
      "title": "破冰的歷史性法案",
      "desc": "破冰的歷史性法案。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 2,
      "impactRaw": "0,3,2",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-278",
      "title": "深夜路燈下的擁抱",
      "desc": "深夜路燈下的擁抱。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-279",
      "title": "政府績效考核的驚喜第一",
      "desc": "政府績效考核的驚喜第一。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 720,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "36,0,2",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-280",
      "title": "一杯清茶平息的百年宗族怨",
      "desc": "一杯清茶平息的百年宗族怨。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 2,
      "impactRaw": "0,2,2",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-281",
      "title": "捕捉時代痛點的萬字建議書",
      "desc": "捕捉時代痛點的萬字建議書。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 700,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "35,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-282",
      "title": "公民聯署的驚人狂瀾",
      "desc": "公民聯署的驚人狂瀾。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "0,0,4",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-283",
      "title": "陽光法案的幕後推手",
      "desc": "陽光法案的幕後推手。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-284",
      "title": "特定議題的媒體高光",
      "desc": "特定議題的媒體高光。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 3,
      "impactRaw": "0,0,3",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-285",
      "title": "社會觀察家的犀利排雷",
      "desc": "社會觀察家的犀利排雷。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 3,
      "impactRaw": "0,0,3",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-286",
      "title": "青年論壇的靈魂導師",
      "desc": "青年論壇的靈魂導師。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 780,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "39,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-287",
      "title": "公益項目的閉環神蹟",
      "desc": "公益項目的閉環神蹟。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 2,
      "impactRaw": "0,3,2",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-288",
      "title": "體制內的破格提拔",
      "desc": "體制內的破格提拔。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "0,3,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-289",
      "title": "初心不改的靈魂慰藉",
      "desc": "初心不改的靈魂慰藉。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "稀有",
      "cash": 840,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "42,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-290",
      "title": "核心選區的集體倒戈危機",
      "desc": "核心選區的集體倒戈危機。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "稀有",
      "cash": -620,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "-31,0,-3",
      "attributeProfile": "財富:負向,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-291",
      "title": "被惡意設計的腐敗陷阱",
      "desc": "被惡意設計的腐敗陷阱。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "稀有",
      "cash": -640,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "-32,0,-2",
      "attributeProfile": "財富:負向,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-292",
      "title": "大選前夕的抹黑風暴",
      "desc": "大選前夕的抹黑風暴。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-293",
      "title": "派系鬥爭的替罪羊危機",
      "desc": "派系鬥爭的替罪羊危機。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -2,
      "impactRaw": "0,-2,-2",
      "attributeProfile": "財富:中性,快樂:負向,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-294",
      "title": "引資項目的村民集體暴動",
      "desc": "引資項目的村民集體暴動。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "0,0,-3",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-295",
      "title": "跨國犯罪集團的私下恐嚇",
      "desc": "跨國犯罪集團的私下恐嚇。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "0,0,-3",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-296",
      "title": "街坊鄰里的自發擁護",
      "desc": "街坊鄰里的自發擁護。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "傳奇",
      "cash": 1040,
      "happiness": 3,
      "reputation": 4,
      "impactRaw": "52,3,4",
      "attributeProfile": "財富:正向,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-297",
      "title": "破冰的歷史性法案",
      "desc": "破冰的歷史性法案。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "傳奇",
      "cash": 1180,
      "happiness": 4,
      "reputation": 0,
      "impactRaw": "59,4,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-298",
      "title": "深夜路燈下的擁抱",
      "desc": "深夜路燈下的擁抱。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "傳奇",
      "cash": 1080,
      "happiness": 4,
      "reputation": 4,
      "impactRaw": "54,4,4",
      "attributeProfile": "財富:正向,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-299",
      "title": "政府績效考核的驚喜第一",
      "desc": "政府績效考核的驚喜第一。民意狂瀾與精妙的治國良策將你推上了權力的巔峰。基層選民的由衷擁護、歷史性福利法案的通過，或是外交談判上的縱橫捭闔，讓你成為了國家的脊梁，政壇滿意度高居不下，迎來了海量政治聲譽與榮光。",
      "eventLevel": "傳奇",
      "cash": 1160,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "58,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-從政-300",
      "title": "跨國犯罪集團的私下恐嚇",
      "desc": "跨國犯罪集團的私下恐嚇。政治抹黑、派系鬥爭、刺客的冷槍或者核心幕僚的集體背叛，讓你身處波譎雲詭的權力漩渦邊緣。官僚內耗與不信任危機如影隨形，稍微踩錯一步棋便可能面臨免職下台乃至牢獄之災。",
      "eventLevel": "傳奇",
      "cash": -820,
      "happiness": 0,
      "reputation": -4,
      "impactRaw": "-41,0,-4",
      "attributeProfile": "財富:負向,快樂:中性,名譽:負向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    }
  ],
  "電影明星": [
    {
      "id": "v38-電影明星-301",
      "title": "大導演的靈魂邀約",
      "desc": "大導演的靈魂邀約。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 320,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "16,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-302",
      "title": "背台詞的深夜高光",
      "desc": "背台詞的深夜高光。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 480,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "24,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-303",
      "title": "試鏡現場的掌聲",
      "desc": "試鏡現場的掌聲。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-304",
      "title": "廣告代言的及時雨",
      "desc": "廣告代言的及時雨。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-305",
      "title": "舞台劇的靈魂附體",
      "desc": "舞台劇的靈魂附體。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-306",
      "title": "獨立短片的小奇蹟",
      "desc": "獨立短片的小奇蹟。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-307",
      "title": "神級剪輯挽救神劇",
      "desc": "神級剪輯挽救神劇。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-308",
      "title": "社群破圈的真心話",
      "desc": "社群破圈的真心話。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-309",
      "title": "街頭抓拍的時尚焦點",
      "desc": "街頭抓拍的時尚焦點。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-310",
      "title": "短影音的流量神話",
      "desc": "短影音的流量神話。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-311",
      "title": "直播間的破紀錄打賞",
      "desc": "直播間的破紀錄打賞。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-312",
      "title": "精製生活的素顏出圈",
      "desc": "精製生活的素顏出圈。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 340,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "17,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-313",
      "title": "首個大牌彩妝的青睞",
      "desc": "首個大牌彩妝的青睞。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 300,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "15,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-314",
      "title": "歡樂開台的友情局",
      "desc": "歡樂開台的友情局。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-315",
      "title": "深夜電台的治癒聲音",
      "desc": "深夜電台的治癒聲音。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-316",
      "title": "劇組大鍋飯的溫暖",
      "desc": "劇組大鍋飯的溫暖。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 600,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "30,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-317",
      "title": "老戲骨的臨別贈言",
      "desc": "老戲骨的臨別贈言。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-318",
      "title": "片場的驚險救火",
      "desc": "片場的驚險救火。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-319",
      "title": "經典台詞的誕生",
      "desc": "經典台詞的誕生。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-320",
      "title": "綜藝節目的搞笑爆擊",
      "desc": "綜藝節目的搞笑爆擊。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-321",
      "title": "劇本改編的完美契合",
      "desc": "劇本改編的完美契合。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 600,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "30,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-322",
      "title": "現象級收視率的加冕",
      "desc": "現象級收視率的加冕。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-323",
      "title": "綜藝之王的全控場神蹟",
      "desc": "綜藝之王的全控場神蹟。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-324",
      "title": "怪物聲優的靈魂解碼",
      "desc": "怪物聲優的靈魂解碼。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-325",
      "title": "絕對自由的創作者宣言",
      "desc": "絕對自由的創作者宣言。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "25,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-326",
      "title": "發燒榜第一的紀錄保持者",
      "desc": "發燒榜第一的紀錄保持者。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-327",
      "title": "頂流帶貨女王的世紀神話",
      "desc": "頂流帶貨女王的世紀神話。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-328",
      "title": "時尚風向球的最高禮遇",
      "desc": "時尚風向球的最高禮遇。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-329",
      "title": "百花獎影帝的無雙加冕",
      "desc": "百花獎影帝的無雙加冕。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-330",
      "title": "光影雕刻師的藝術大捷",
      "desc": "光影雕刻師的藝術大捷。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-331",
      "title": "全球粉絲的世紀狂歡",
      "desc": "全球粉絲的世紀狂歡。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-332",
      "title": "世界電影史的不朽圖騰",
      "desc": "世界電影史的不朽圖騰。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-333",
      "title": "一代人的集體青春月光",
      "desc": "一代人的集體青春月光。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-334",
      "title": "全球傳媒帝國的金色加冕",
      "desc": "全球傳媒帝國的金色加冕。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-335",
      "title": "完美謝幕的曠世神作",
      "desc": "完美謝幕的曠世神作。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "普通",
      "cash": 520,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "26,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-336",
      "title": "致命的片場爆破意外",
      "desc": "致命的片場爆破意外。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-337",
      "title": "自媒體硬碟的惡意物理毀滅",
      "desc": "自媒體硬碟的惡意物理毀滅。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-338",
      "title": "被資本聯手做空的對賭協議",
      "desc": "被資本聯手做空的對賭協議。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": -380,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-19,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-339",
      "title": "直播間被惡意舉報到永久封禁",
      "desc": "直播間被惡意舉報到永久封禁。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -2,
      "reputation": 0,
      "impactRaw": "0,-2,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-340",
      "title": "傳媒大亨的資本鐵幕",
      "desc": "傳媒大亨的資本鐵幕。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-341",
      "title": "經紀公司的惡意雪藏打壓",
      "desc": "經紀公司的惡意雪藏打壓。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-342",
      "title": "狗仔隊長達半年的全天候偷拍",
      "desc": "狗仔隊長達半年的全天候偷拍。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": -500,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-25,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-343",
      "title": "瘋狂私生飯的深夜破門入室",
      "desc": "瘋狂私生飯的深夜破門入室。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-344",
      "title": "代言品牌突發爆雷的連帶責任",
      "desc": "代言品牌突發爆雷的連帶責任。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-345",
      "title": "片場耍大牌的虛假剪輯造謠",
      "desc": "片場耍大牌的虛假剪輯造謠。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -2,
      "reputation": 0,
      "impactRaw": "0,-2,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-346",
      "title": "被惡意洩露的私人行程",
      "desc": "被惡意洩露的私人行程。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-347",
      "title": "遭遇黑粉的現場潑水",
      "desc": "遭遇黑粉的現場潑水。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": -360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-18,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-348",
      "title": "合同陷阱的千萬索賠",
      "desc": "合同陷阱的千萬索賠。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": -220,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-11,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-349",
      "title": "被對手惡意買下的黑熱搜",
      "desc": "被對手惡意買下的黑熱搜。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": -420,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-21,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-350",
      "title": "心血之作的被強行下架",
      "desc": "心血之作的被強行下架。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-351",
      "title": "大導演的靈魂邀約",
      "desc": "大導演的靈魂邀約。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 2,
      "impactRaw": "0,3,2",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-352",
      "title": "背台詞的深夜高光",
      "desc": "背台詞的深夜高光。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 840,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "42,0,2",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-353",
      "title": "試鏡現場的掌聲",
      "desc": "試鏡現場的掌聲。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 760,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "38,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-354",
      "title": "廣告代言的及時雨",
      "desc": "廣告代言的及時雨。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 3,
      "impactRaw": "0,2,3",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-355",
      "title": "舞台劇的靈魂附體",
      "desc": "舞台劇的靈魂附體。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 3,
      "impactRaw": "0,2,3",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-356",
      "title": "獨立短片的小奇蹟",
      "desc": "獨立短片的小奇蹟。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 3,
      "impactRaw": "0,3,3",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-357",
      "title": "神級剪輯挽救神劇",
      "desc": "神級剪輯挽救神劇。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 840,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "42,0,2",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-358",
      "title": "社群破圈的真心話",
      "desc": "社群破圈的真心話。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 900,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "45,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-359",
      "title": "街頭抓拍的時尚焦點",
      "desc": "街頭抓拍的時尚焦點。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 900,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "45,0,2",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-360",
      "title": "短影音的流量神話",
      "desc": "短影音的流量神話。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "0,0,4",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-361",
      "title": "直播間的破紀錄打賞",
      "desc": "直播間的破紀錄打賞。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 660,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "33,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-362",
      "title": "精製生活的素顏出圈",
      "desc": "精製生活的素顏出圈。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-363",
      "title": "首個大牌彩妝的青睞",
      "desc": "首個大牌彩妝的青睞。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 640,
      "happiness": 0,
      "reputation": 3,
      "impactRaw": "32,0,3",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-364",
      "title": "歡樂開台的友情局",
      "desc": "歡樂開台的友情局。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 3,
      "impactRaw": "0,2,3",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-365",
      "title": "片場耍大牌的虛假剪輯造謠",
      "desc": "片場耍大牌的虛假剪輯造謠。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -3,
      "reputation": -3,
      "impactRaw": "0,-3,-3",
      "attributeProfile": "財富:中性,快樂:負向,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-366",
      "title": "被惡意洩露的私人行程",
      "desc": "被惡意洩露的私人行程。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-367",
      "title": "遭遇黑粉的現場潑水",
      "desc": "遭遇黑粉的現場潑水。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "0,0,-3",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-368",
      "title": "合同陷阱的千萬索賠",
      "desc": "合同陷阱的千萬索賠。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "稀有",
      "cash": -420,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "-21,0,-3",
      "attributeProfile": "財富:負向,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-369",
      "title": "被對手惡意買下的黑熱搜",
      "desc": "被對手惡意買下的黑熱搜。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "稀有",
      "cash": -500,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "-25,0,-3",
      "attributeProfile": "財富:負向,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-370",
      "title": "心血之作的被強行下架",
      "desc": "心血之作的被強行下架。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -3,
      "impactRaw": "0,-2,-3",
      "attributeProfile": "財富:中性,快樂:負向,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-371",
      "title": "大導演的靈魂邀約",
      "desc": "大導演的靈魂邀約。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 3,
      "reputation": 4,
      "impactRaw": "0,3,4",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-372",
      "title": "背台詞的深夜高光",
      "desc": "背台詞的深夜高光。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "傳奇",
      "cash": 1040,
      "happiness": 4,
      "reputation": 0,
      "impactRaw": "52,4,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-373",
      "title": "試鏡現場的掌聲",
      "desc": "試鏡現場的掌聲。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "傳奇",
      "cash": 1060,
      "happiness": 4,
      "reputation": 0,
      "impactRaw": "53,4,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-374",
      "title": "廣告代言的及時雨",
      "desc": "廣告代言的及時雨。水銀燈下，你是萬眾矚目的焦點。大導演的靈魂邀約、國際影展的桂冠，或者現象級短影音帶來的爆發性流量，讓你的商業價值與藝術聲譽達到了巔峰，你的一言一行定義了潮流，成為一代人永恆的白月光。",
      "eventLevel": "傳奇",
      "cash": 1080,
      "happiness": 3,
      "reputation": 4,
      "impactRaw": "54,3,4",
      "attributeProfile": "財富:正向,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-電影明星-375",
      "title": "心血之作的被強行下架",
      "desc": "心血之作的被強行下架。私生飯的騷擾、惡意黑熱搜的圍剿、霸王合同的陷阱或者是片場突發的爆破意外，讓你在璀璨光環背後承受著巨大的精神折磨。輿論反噬與資本鐵幕聯手雪藏，明星生涯面臨隨時隕落的窒息危險。",
      "eventLevel": "傳奇",
      "cash": -820,
      "happiness": -4,
      "reputation": -3,
      "impactRaw": "-41,-4,-3",
      "attributeProfile": "財富:負向,快樂:負向,名譽:負向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    }
  ],
  "航海": [
    {
      "id": "v38-航海-376",
      "title": "風暴後的極光航道",
      "desc": "風暴後的極光航道。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 540,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "27,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-377",
      "title": "漂流瓶裡的古老海圖",
      "desc": "漂流瓶裡的古老海圖。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-378",
      "title": "千里的眼精準救險",
      "desc": "千里的眼精準救險。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 540,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "27,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-379",
      "title": "舵盤上的鋼鐵華爾滋",
      "desc": "舵盤上的鋼鐵華爾滋。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-380",
      "title": "滿載而歸的金色漁獲",
      "desc": "滿載而歸的金色漁獲。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-381",
      "title": "桶匠的無雙淡水守護",
      "desc": "桶匠的無雙淡水守護。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-382",
      "title": "船長銀器的秘密讚許",
      "desc": "船長銀器的秘密讚許。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 540,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "27,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-383",
      "title": "鋼鐵意志的逆風狂飆",
      "desc": "鋼鐵意志的逆風狂飆。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-384",
      "title": "白刃戰的無雙戰神",
      "desc": "白刃戰的無雙戰神。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-385",
      "title": "首席砲術長的雷鳴咆哮",
      "desc": "首席砲術長的雷鳴咆哮。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-386",
      "title": "熔爐旁邊的船體鐵骨",
      "desc": "熔爐旁邊的船體鐵骨。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-387",
      "title": "海面上的神奇魔改修復",
      "desc": "海面上的神奇魔改修復。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-388",
      "title": "守財之犬的零霉變神話",
      "desc": "守財之犬的零霉變神話。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 420,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "21,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-389",
      "title": "黑夜之眼的深夜排雷",
      "desc": "黑夜之眼的深夜排雷。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-390",
      "title": "海上天使的抗病奇蹟",
      "desc": "海上天使的抗病奇蹟。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-391",
      "title": "鐵血紀律的無雙控盤",
      "desc": "鐵血紀律的無雙控盤。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-392",
      "title": "無縫接管的逆天改命",
      "desc": "無縫接管的逆天改命。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-393",
      "title": "星辰退去的活羅盤神蹟",
      "desc": "星辰退去的活羅盤神蹟。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-394",
      "title": "海上開顱的奇蹟生還",
      "desc": "海上開顱的奇蹟生還。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 520,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "26,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-395",
      "title": "齊射爆擊的毀滅狂飆",
      "desc": "齊射爆擊的毀滅狂飆。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-396",
      "title": "商路壟斷的金色泉眼",
      "desc": "商路壟斷的金色泉眼。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 480,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "24,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-397",
      "title": "魔改戰艦的不沉神話",
      "desc": "魔改戰艦的不沉神話。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-398",
      "title": "軍火大管家的完美沙盤",
      "desc": "軍火大管家的完美沙盤。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 420,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "21,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-399",
      "title": "骷髏旗下的蔚藍主宰",
      "desc": "骷髏旗下的蔚藍主宰。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 520,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "26,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-400",
      "title": "奉天討賊的皇家合法私掠",
      "desc": "奉天討賊的皇家合法私掠。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-401",
      "title": "七海冠以我之姓氏",
      "desc": "七海冠以我之姓氏。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 460,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "23,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-402",
      "title": "不沉之艦的永生神話",
      "desc": "不沉之艦的永生神話。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-403",
      "title": "世界盡頭的瀑布拓荒",
      "desc": "世界盡頭的瀑布拓荒。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-404",
      "title": "皇家海軍元帥的終身加冕",
      "desc": "皇家海軍元帥的終身加冕。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 580,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "29,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-405",
      "title": "深海意志代言人的世紀神蹟",
      "desc": "深海意志代言人的世紀神蹟。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 380,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "19,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-406",
      "title": "風暴後的極光航道",
      "desc": "風暴後的極光航道。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 540,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "27,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-407",
      "title": "漂流瓶裡的古老海圖",
      "desc": "漂流瓶裡的古老海圖。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-408",
      "title": "千里的眼精準救險",
      "desc": "千里的眼精準救險。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 540,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "27,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-409",
      "title": "舵盤上的鋼鐵華爾滋",
      "desc": "舵盤上的鋼鐵華爾滋。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 460,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "23,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-410",
      "title": "滿載而歸的金色漁獲",
      "desc": "滿載而歸的金色漁獲。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-411",
      "title": "皇家海軍的終極絞殺陷阱",
      "desc": "皇家海軍的終極絞殺陷阱。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-412",
      "title": "深海巨獸的致命復仇狂飆",
      "desc": "深海巨獸的致命復仇狂飆。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-413",
      "title": "船團貿易的致命黑死病風暴",
      "desc": "船團貿易的致命黑死病風暴。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-414",
      "title": "水手長皮鞭下的集體大叛變",
      "desc": "水手長皮鞭下的集體大叛變。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-415",
      "title": "觸礁引發的底層貨艙全面進水",
      "desc": "觸礁引發的底層貨艙全面進水。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": -360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-18,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-416",
      "title": "無風帶引起的極度淡水枯竭",
      "desc": "無風帶引起的極度淡水枯竭。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -2,
      "reputation": 0,
      "impactRaw": "0,-2,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-417",
      "title": "海盜快艇的深夜狼群式圍攻",
      "desc": "海盜快艇的深夜狼群式圍攻。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-418",
      "title": "遭遇古老海妖的靈魂歌聲精神崩潰",
      "desc": "遭遇古老海妖的靈魂歌聲精神崩潰。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-419",
      "title": "船上大副私通敵國的通敵罪證",
      "desc": "船上大副私通敵國的通敵罪證。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-420",
      "title": "海關執法隊的惡意扣船強行沒收",
      "desc": "海關執法隊的惡意扣船強行沒收。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-421",
      "title": "羅盤磁極的深夜逆轉",
      "desc": "羅盤磁極的深夜逆轉。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-422",
      "title": "副大腦的嚴苛紀律風暴",
      "desc": "副大腦的嚴苛紀律風暴。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-423",
      "title": "海嘯過後的絕望大迷航",
      "desc": "海嘯過後的絕望大迷航。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": -420,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-21,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-424",
      "title": "私掠許可證的皇家背叛",
      "desc": "私掠許可證的皇家背叛。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": -480,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-24,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-425",
      "title": "海溝深處的幽閉瘋狂",
      "desc": "海溝深處的幽閉瘋狂。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-426",
      "title": "風暴後的極光航道",
      "desc": "風暴後的極光航道。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 740,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "37,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-427",
      "title": "漂流瓶裡的古老海圖",
      "desc": "漂流瓶裡的古老海圖。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "0,3,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-428",
      "title": "千里的眼精準救險",
      "desc": "千里的眼精準救險。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 3,
      "impactRaw": "0,2,3",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-429",
      "title": "舵盤上的鋼鐵華爾滋",
      "desc": "舵盤上的鋼鐵華爾滋。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "0,3,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-430",
      "title": "滿載而歸的金色漁獲",
      "desc": "滿載而歸的金色漁獲。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 720,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "36,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-431",
      "title": "桶匠的無雙淡水守護",
      "desc": "桶匠的無雙淡水守護。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 660,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "33,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-432",
      "title": "船長銀器的秘密讚許",
      "desc": "船長銀器的秘密讚許。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 760,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "38,2,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-433",
      "title": "鋼鐵意志的逆風狂飆",
      "desc": "鋼鐵意志的逆風狂飆。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-434",
      "title": "白刃戰的無雙戰神",
      "desc": "白刃戰的無雙戰神。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "0,0,4",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-435",
      "title": "首席砲術長的雷鳴咆哮",
      "desc": "首席砲術長的雷鳴咆哮。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 800,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "40,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-436",
      "title": "熔爐旁邊的船體鐵骨",
      "desc": "熔爐旁邊的船體鐵骨。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 720,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "36,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-437",
      "title": "海面上的神奇魔改修復",
      "desc": "海面上的神奇魔改修復。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-438",
      "title": "守財之犬的零霉變神話",
      "desc": "守財之犬的零霉變神話。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 800,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "40,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-439",
      "title": "黑夜之眼的深夜排雷",
      "desc": "黑夜之眼的深夜排雷。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-440",
      "title": "海關執法隊的惡意扣船強行沒收",
      "desc": "海關執法隊的惡意扣船強行沒收。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "稀有",
      "cash": -540,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "-27,0,-3",
      "attributeProfile": "財富:負向,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-441",
      "title": "羅盤磁極的深夜逆轉",
      "desc": "羅盤磁極的深夜逆轉。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "0,0,-3",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-442",
      "title": "副大腦的嚴苛紀律風暴",
      "desc": "副大腦的嚴苛紀律風暴。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "稀有",
      "cash": -480,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-24,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-443",
      "title": "海嘯過後的絕望大迷航",
      "desc": "海嘯過後的絕望大迷航。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-444",
      "title": "私掠許可證的皇家背叛",
      "desc": "私掠許可證的皇家背叛。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "稀有",
      "cash": -540,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-27,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-445",
      "title": "海溝深處的幽閉瘋狂",
      "desc": "海溝深處的幽閉瘋狂。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "稀有",
      "cash": -440,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-22,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-446",
      "title": "風暴後的極光航道",
      "desc": "風暴後的極光航道。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "傳奇",
      "cash": 1200,
      "happiness": 0,
      "reputation": 5,
      "impactRaw": "60,0,5",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-447",
      "title": "漂流瓶裡的古老海圖",
      "desc": "漂流瓶裡的古老海圖。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "傳奇",
      "cash": 1040,
      "happiness": 3,
      "reputation": 5,
      "impactRaw": "52,3,5",
      "attributeProfile": "財富:正向,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-448",
      "title": "千里的眼精準救險",
      "desc": "千里的眼精準救險。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "傳奇",
      "cash": 1200,
      "happiness": 4,
      "reputation": 5,
      "impactRaw": "60,4,5",
      "attributeProfile": "財富:正向,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-449",
      "title": "舵盤上的鋼鐵華爾滋",
      "desc": "舵盤上的鋼鐵華爾滋。海風帶領著你駛向地圖的邊緣。古老海圖的發現、領航鯨群的奇遇，或是帶領魔改戰艦橫掃七海的海戰大捷，讓你贏得了海洋的承認。戰艦鳴炮，海浪退去，你的旗幟成為蔚藍大洋上唯一的最高法律與不沉傳奇。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 3,
      "reputation": 4,
      "impactRaw": "0,3,4",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-航海-450",
      "title": "海溝深處的幽閉瘋狂",
      "desc": "海溝深處的幽閉瘋狂。百慕達的極磁迷航、深海巨獸的瘋狂復仇、敗血病的集體爆發或者大副率領的深夜武裝叛變，讓孤懸海外的飛船或戰艦瞬間淪為人間地獄。在沒有陸地的無盡深淵上，你必須用皮鞭與長刀捍衛最後的指揮權。",
      "eventLevel": "傳奇",
      "cash": -860,
      "happiness": -4,
      "reputation": -3,
      "impactRaw": "-43,-4,-3",
      "attributeProfile": "財富:負向,快樂:負向,名譽:負向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    }
  ],
  "月球探險": [
    {
      "id": "v38-月球探險-451",
      "title": "永恆地星的絕美日出",
      "desc": "永恆地星的絕美日出。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-452",
      "title": "低重力特技漫步",
      "desc": "低重力特技漫步。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-453",
      "title": "微重力垃圾變廢為寶",
      "desc": "微重力垃圾變廢為寶。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "18,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-454",
      "title": "生命管道的生死三十秒",
      "desc": "生命管道的生死三十秒。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-455",
      "title": "太空卡路里的精準神話",
      "desc": "太空卡路里的精準神話。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-456",
      "title": "穿過三十八萬公里的聲音",
      "desc": "穿過三十八萬公里的聲音。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 560,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "28,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-457",
      "title": "心靈監測的深夜溫柔",
      "desc": "心靈監測的深夜溫柔。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-458",
      "title": "陰影深谷的萬年冰川",
      "desc": "陰影深谷的萬年冰川。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-459",
      "title": "一鎬敲出純淨氦三金礦",
      "desc": "一鎬敲出純淨氦三金礦。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-460",
      "title": "星空守望者的隕石排雷",
      "desc": "星空守望者的隕石排雷。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-461",
      "title": "真空漫步的生死焊接",
      "desc": "真空漫步的生死焊接。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-462",
      "title": "月壤第一朵土豆花",
      "desc": "月壤第一朵土豆花。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-463",
      "title": "脈衝星的宇宙交響樂",
      "desc": "脈衝星的宇宙交響樂。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-464",
      "title": "鋼鐵閘門的生命守護",
      "desc": "鋼鐵閘門的生命守護。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 340,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "17,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-465",
      "title": "星海天使的輻射抗體",
      "desc": "星海天使的輻射抗體。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 340,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "17,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-466",
      "title": "月面基地的巨型升級加冕",
      "desc": "月面基地的巨型升級加冕。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-467",
      "title": "軌道幾何學的星海改命",
      "desc": "軌道幾何學的星海改命。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-468",
      "title": "數字先知的太陽風暴排雷",
      "desc": "數字先知的太陽風暴排雷。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 320,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "16,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-469",
      "title": "古老冰層裡的史前地外生命",
      "desc": "古老冰層裡的史前地外生命。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-470",
      "title": "太空開顱的海星神蹟",
      "desc": "太空開顱的海星神蹟。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-471",
      "title": "直面虛無的鋼鐵心智",
      "desc": "直面虛無的鋼鐵心智。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-472",
      "title": "異星遭遇的至高外交宣言",
      "desc": "異星遭遇的至高外交宣言。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-473",
      "title": "地月貿易的金色天平",
      "desc": "地月貿易的金色天平。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-474",
      "title": "星際獵手的小行星套索",
      "desc": "星際獵手的小行星套索。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-475",
      "title": "未知威脅的月背武裝大捷",
      "desc": "未知威脅的月背武裝大捷。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-476",
      "title": "地月雙星的至高主權王座",
      "desc": "地月雙星的至高主權王座。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-477",
      "title": "穿越黑洞事件視界的不朽傳奇",
      "desc": "穿越黑洞事件視界的不朽傳奇。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 600,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "30,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-478",
      "title": "室女座超星系團的火種啟航",
      "desc": "室女座超星系團的火種啟航。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "18,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-479",
      "title": "月球背面主權都市的獨立加冕",
      "desc": "月球背面主權都市的獨立加冕。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-480",
      "title": "第三類接觸的宇宙和平使者",
      "desc": "第三類接觸的宇宙和平使者。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 460,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "23,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-481",
      "title": "永恆地星的絕美日出",
      "desc": "永恆地星的絕美日出。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-482",
      "title": "低重力特技漫步",
      "desc": "低重力特技漫步。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-483",
      "title": "微重力垃圾變廢為寶",
      "desc": "微重力垃圾變廢為寶。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-484",
      "title": "生命管道的生死三十秒",
      "desc": "生命管道的生死三十秒。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 400,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "20,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-485",
      "title": "太空卡路里的精準神話",
      "desc": "太空卡路里的精準神話。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-486",
      "title": "外星微生物的基地大感染",
      "desc": "外星微生物的基地大感染。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-487",
      "title": "星際貿易的世紀大爆倉",
      "desc": "星際貿易的世紀大爆倉。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": -400,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-20,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-488",
      "title": "小行星牽引的軌道失控災難",
      "desc": "小行星牽引的軌道失控災難。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": -260,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-13,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-489",
      "title": "太陽耀斑引發的強烈艙外射線灼傷",
      "desc": "太陽耀斑引發的強烈艙外射線灼傷。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": -420,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-21,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-490",
      "title": "月面車在永夜陰影區的意外翻車",
      "desc": "月面車在永夜陰影區的意外翻車。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-491",
      "title": "生命維持系統主機的AI代碼叛變",
      "desc": "生命維持系統主機的AI代碼叛變。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": -380,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-19,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-492",
      "title": "地球總部意外切斷了所有的後續經費支援",
      "desc": "地球總部意外切斷了所有的後續經費支援。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-493",
      "title": "未知地外高頻雜音引發的全體精神錯亂",
      "desc": "未知地外高頻雜音引發的全體精神錯亂。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-494",
      "title": "基地氣壓泵在睡眠週期的突發停擺",
      "desc": "基地氣壓泵在睡眠週期的突發停擺。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": -280,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-14,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-495",
      "title": "太空艙內因極度孤獨爆發的流血衝突",
      "desc": "太空艙內因極度孤獨爆發的流血衝突。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-496",
      "title": "氣閘艙的突發大洩漏",
      "desc": "氣閘艙的突發大洩漏。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-497",
      "title": "地月通訊的歷史性大中斷",
      "desc": "地月通訊的歷史性大中斷。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": -420,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-21,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-498",
      "title": "低重力骨質疏鬆的職涯判決",
      "desc": "低重力骨質疏鬆的職涯判決。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": -480,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-24,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-499",
      "title": "微重力核反應堆的融毀危機",
      "desc": "微重力核反應堆的融毀危機。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-500",
      "title": "星艦大副的宇宙幽閉集體瘋狂",
      "desc": "星艦大副的宇宙幽閉集體瘋狂。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-501",
      "title": "永恆地星的絕美日出",
      "desc": "永恆地星的絕美日出。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 3,
      "impactRaw": "0,3,3",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-502",
      "title": "低重力特技漫步",
      "desc": "低重力特技漫步。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-503",
      "title": "微重力垃圾變廢為寶",
      "desc": "微重力垃圾變廢為寶。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 780,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "39,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-504",
      "title": "生命管道的生死三十秒",
      "desc": "生命管道的生死三十秒。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 840,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "42,0,4",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-505",
      "title": "太空卡路里的精準神話",
      "desc": "太空卡路里的精準神話。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 720,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "36,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-506",
      "title": "穿過三十八萬公里的聲音",
      "desc": "穿過三十八萬公里的聲音。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 760,
      "happiness": 0,
      "reputation": 3,
      "impactRaw": "38,0,3",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-507",
      "title": "心靈監測的深夜溫柔",
      "desc": "心靈監測的深夜溫柔。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 900,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "45,0,4",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-508",
      "title": "陰影深谷的萬年冰川",
      "desc": "陰影深谷的萬年冰川。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 840,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "42,0,4",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-509",
      "title": "一鎬敲出純淨氦三金礦",
      "desc": "一鎬敲出純淨氦三金礦。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "0,0,4",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-510",
      "title": "星空守望者的隕石排雷",
      "desc": "星空守望者的隕石排雷。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 620,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "31,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-511",
      "title": "真空漫步的生死焊接",
      "desc": "真空漫步的生死焊接。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-512",
      "title": "月壤第一朵土豆花",
      "desc": "月壤第一朵土豆花。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 4,
      "impactRaw": "0,3,4",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-513",
      "title": "脈衝星的宇宙交響樂",
      "desc": "脈衝星的宇宙交響樂。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 840,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "42,2,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-514",
      "title": "鋼鐵閘門的生命守護",
      "desc": "鋼鐵閘門的生命守護。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "稀有",
      "cash": 820,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "41,2,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-515",
      "title": "太空艙內因極度孤獨爆發的流血衝突",
      "desc": "太空艙內因極度孤獨爆發的流血衝突。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "稀有",
      "cash": -440,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "-22,0,-2",
      "attributeProfile": "財富:負向,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-516",
      "title": "氣閘艙的突發大洩漏",
      "desc": "氣閘艙的突發大洩漏。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": 0,
      "impactRaw": "0,-2,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-517",
      "title": "地月通訊的歷史性大中斷",
      "desc": "地月通訊的歷史性大中斷。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "稀有",
      "cash": -600,
      "happiness": -3,
      "reputation": 0,
      "impactRaw": "-30,-3,0",
      "attributeProfile": "財富:負向,快樂:負向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-518",
      "title": "低重力骨質疏鬆的職涯判決",
      "desc": "低重力骨質疏鬆的職涯判決。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "0,0,-3",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-519",
      "title": "微重力核反應堆的融毀危機",
      "desc": "微重力核反應堆的融毀危機。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "稀有",
      "cash": -560,
      "happiness": -3,
      "reputation": 0,
      "impactRaw": "-28,-3,0",
      "attributeProfile": "財富:負向,快樂:負向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-520",
      "title": "星艦大副的宇宙幽閉集體瘋狂",
      "desc": "星艦大副的宇宙幽閉集體瘋狂。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -3,
      "reputation": 0,
      "impactRaw": "0,-3,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-521",
      "title": "永恆地星的絕美日出",
      "desc": "永恆地星的絕美日出。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "傳奇",
      "cash": 940,
      "happiness": 0,
      "reputation": 4,
      "impactRaw": "47,0,4",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-522",
      "title": "低重力特技漫步",
      "desc": "低重力特技漫步。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "傳奇",
      "cash": 1100,
      "happiness": 3,
      "reputation": 5,
      "impactRaw": "55,3,5",
      "attributeProfile": "財富:正向,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-523",
      "title": "微重力垃圾變廢為寶",
      "desc": "微重力垃圾變廢為寶。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 4,
      "reputation": 5,
      "impactRaw": "0,4,5",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-524",
      "title": "生命管道的生死三十秒",
      "desc": "生命管道的生死三十秒。邁向星辰，是人類文明最壯麗的史詩。低重力下的特技漫步、月壤中開出的希望綠芽，或是宇宙深處未知高等文明的友好接觸，讓你在月球背面建起百萬都市，代表地球守望整片璀璨銀河，點燃永不熄滅的火種。",
      "eventLevel": "傳奇",
      "cash": 1080,
      "happiness": 4,
      "reputation": 0,
      "impactRaw": "54,4,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-月球探險-525",
      "title": "星艦大副的宇宙幽閉集體瘋狂",
      "desc": "星艦大副的宇宙幽閉集體瘋狂。核反應堆融毀危機、流星群對氣閘艙的穿透、外星厭氧微生物的大面積感染或者地月通訊的百年大中斷，讓封閉的月球基地危在旦夕。面對零下一百八十度的死寂真空與宇宙射線，你必須在絕境中手動鎖死閘門。",
      "eventLevel": "傳奇",
      "cash": -820,
      "happiness": -5,
      "reputation": -4,
      "impactRaw": "-41,-5,-4",
      "attributeProfile": "財富:負向,快樂:負向,名譽:負向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    }
  ],
  "開礦": [
    {
      "id": "v38-開礦-526",
      "title": "一鎬敲出個聚寶盆",
      "desc": "一鎬敲出個聚寶盆。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-527",
      "title": "分揀台上的血鑽石逆襲",
      "desc": "分揀台上的血鑽石逆襲。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-528",
      "title": "礦坑塌方中的神級直覺",
      "desc": "礦坑塌方中的神級直覺。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-529",
      "title": "鑿岩工的極致速度爆擊",
      "desc": "鑿岩工的極致速度爆擊。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-530",
      "title": "黑暗深處的不滅微光",
      "desc": "黑暗深處的不滅微光。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-531",
      "title": "測繪助手的神奇3D迷宮重構",
      "desc": "測繪助手的神奇3D迷宮重構。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 580,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "29,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-532",
      "title": "淘金盤裡的黃金狂熱",
      "desc": "淘金盤裡的黃金狂熱。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "25,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-533",
      "title": "荒野跋涉的神秘富鐵礦",
      "desc": "荒野跋涉的神秘富鐵礦。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-534",
      "title": "邊境營地的酒館威懾",
      "desc": "邊境營地的酒館威懾。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-535",
      "title": "黑麵包與熱湯的福報",
      "desc": "黑麵包與熱湯的福報。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 440,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "22,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-536",
      "title": "樣本化驗的稀土大爆擊",
      "desc": "樣本化驗的稀土大爆擊。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-537",
      "title": "野外草藥的神奇止血魔法",
      "desc": "野外草藥的神奇止血魔法。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-538",
      "title": "老礦工的終身護身符",
      "desc": "老礦工的終身護身符。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-539",
      "title": "運輸車隊的極限雪地漂移",
      "desc": "運輸車隊的極限雪地漂移。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-540",
      "title": "地底水晶洞的深夜邂逅",
      "desc": "地底水晶洞的深夜邂逅。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-541",
      "title": "遠古地心的璀璨餽贈",
      "desc": "遠古地心的璀璨餽贈。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-542",
      "title": "地心文明的金色奠基",
      "desc": "地心文明的金色奠基。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-543",
      "title": "爆破藝術家的驚天一炸",
      "desc": "爆破藝術家的驚天一炸。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "25,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-544",
      "title": "資源調查官的世紀大重組",
      "desc": "資源調查官的世紀大重組。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 540,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "27,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-545",
      "title": "萬人鐵路小鎮的奠基神話",
      "desc": "萬人鐵路小鎮的奠基神話。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-546",
      "title": "全球有色金屬的定價鐵幕",
      "desc": "全球有色金屬的定價鐵幕。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-547",
      "title": "劃時代的地下流體採礦法",
      "desc": "劃時代的地下流體採礦法。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-548",
      "title": "世界級超大型富礦的加冕",
      "desc": "世界級超大型富礦的加冕。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 1,
      "impactRaw": "0,0,1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-549",
      "title": "地心結晶天堂的金色大捷",
      "desc": "地心結晶天堂的金色大捷。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-550",
      "title": "地底輕便鋼軌鋪設法",
      "desc": "地底輕便鋼軌鋪設法。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-551",
      "title": "全球資源安全的晴雨表",
      "desc": "全球資源安全的晴雨表。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 340,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "17,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-552",
      "title": "金權之巔的歷史性加冕",
      "desc": "金權之巔的歷史性加冕。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-553",
      "title": "地心生態都市的避難所神話",
      "desc": "地心生態都市的避難所神話。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-554",
      "title": "藍光超能礦物的能源革命",
      "desc": "藍光超能礦物的能源革命。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 340,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "17,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-555",
      "title": "星際採礦船隊的金色凱旋",
      "desc": "星際採礦船隊的金色凱旋。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-556",
      "title": "一鎬敲出個聚寶盆",
      "desc": "一鎬敲出個聚寶盆。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-557",
      "title": "分揀台上的血鑽石逆襲",
      "desc": "分揀台上的血鑽石逆襲。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 520,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "26,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-558",
      "title": "礦坑塌方中的神級直覺",
      "desc": "礦坑塌方中的神級直覺。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-559",
      "title": "鑿岩工的極致速度爆擊",
      "desc": "鑿岩工的極致速度爆擊。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "25,0,0",
      "attributeProfile": "財富:正向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-560",
      "title": "黑暗深處的不滅微光",
      "desc": "黑暗深處的不滅微光。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 0,
      "impactRaw": "0,1,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-561",
      "title": "鐵血托拉斯的全球壟斷絞殺",
      "desc": "鐵血托拉斯的全球壟斷絞殺。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": -420,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-21,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-562",
      "title": "深井千米鑽頭的熔毀大災難",
      "desc": "深井千米鑽頭的熔毀大災難。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": -460,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-23,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-563",
      "title": "爆破藥庫的深夜連連大爆炸",
      "desc": "爆破藥庫的深夜連連大爆炸。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -2,
      "reputation": 0,
      "impactRaw": "0,-2,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-564",
      "title": "國際礦業大鱷的惡意金融做空",
      "desc": "國際礦業大鱷的惡意金融做空。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-565",
      "title": "萬人鐵路小鎮的致命瘟疫爆發",
      "desc": "萬人鐵路小鎮的致命瘟疫爆發。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-566",
      "title": "地底鑽掘機遭遇硬岩的軸承徹底斷裂",
      "desc": "地底鑽掘機遭遇硬岩的軸承徹底斷裂。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -2,
      "impactRaw": "0,0,-2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-567",
      "title": "地下坑道因通風不良引發的集體塵肺病病變",
      "desc": "地下坑道因通風不良引發的集體塵肺病病變。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-568",
      "title": "廢石堆積場突發的巨型大泥石流滑坡",
      "desc": "廢石堆積場突發的巨型大泥石流滑坡。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": -400,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-20,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-569",
      "title": "礦主惡意拖欠全營地長達半年的工資利潤",
      "desc": "礦主惡意拖欠全營地長達半年的工資利潤。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": -400,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-20,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-570",
      "title": "探勘隊在荒無人煙的戈壁深處徹底迷失缺水",
      "desc": "探勘隊在荒無人煙的戈壁深處徹底迷失缺水。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-571",
      "title": "瓦斯濃度的無預警飆升",
      "desc": "瓦斯濃度的無預警飆升。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": -240,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-12,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-572",
      "title": "地下暗河的瘋狂透水風暴",
      "desc": "地下暗河的瘋狂透水風暴。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -2,
      "reputation": 0,
      "impactRaw": "0,-2,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-573",
      "title": "邊境營地的武裝悍匪劫掠",
      "desc": "邊境營地的武裝悍匪劫掠。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 0,
      "impactRaw": "0,-1,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-574",
      "title": "高溫地熱斷層的致命遭遇",
      "desc": "高溫地熱斷層的致命遭遇。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": -1,
      "impactRaw": "0,0,-1",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-575",
      "title": "採礦許可證的無預警作廢",
      "desc": "採礦許可證的無預警作廢。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "普通",
      "cash": -360,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-18,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": false,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-576",
      "title": "一鎬敲出個聚寶盆",
      "desc": "一鎬敲出個聚寶盆。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 820,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "41,3,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-577",
      "title": "分揀台上的血鑽石逆襲",
      "desc": "分揀台上的血鑽石逆襲。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 2,
      "impactRaw": "0,3,2",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-578",
      "title": "礦坑塌方中的神級直覺",
      "desc": "礦坑塌方中的神級直覺。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "impactRaw": "0,0,2",
      "attributeProfile": "財富:中性,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-579",
      "title": "鑿岩工的極致速度爆擊",
      "desc": "鑿岩工的極致速度爆擊。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 820,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "41,2,0",
      "attributeProfile": "財富:正向,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-580",
      "title": "黑暗深處的不滅微光",
      "desc": "黑暗深處的不滅微光。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-581",
      "title": "測繪助手的神奇3D迷宮重構",
      "desc": "測繪助手的神奇3D迷宮重構。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "0,3,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-582",
      "title": "淘金盤裡的黃金狂熱",
      "desc": "淘金盤裡的黃金狂熱。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-583",
      "title": "荒野跋涉的神秘富鐵礦",
      "desc": "荒野跋涉的神秘富鐵礦。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 3,
      "reputation": 0,
      "impactRaw": "0,3,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-584",
      "title": "邊境營地的酒館威懾",
      "desc": "邊境營地的酒館威懾。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-585",
      "title": "黑麵包與熱湯的福報",
      "desc": "黑麵包與熱湯的福報。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 3,
      "impactRaw": "0,2,3",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-586",
      "title": "樣本化驗的稀土大爆擊",
      "desc": "樣本化驗的稀土大爆擊。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-587",
      "title": "野外草藥的神奇止血魔法",
      "desc": "野外草藥的神奇止血魔法。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 2,
      "reputation": 0,
      "impactRaw": "0,2,0",
      "attributeProfile": "財富:中性,快樂:正向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-588",
      "title": "老礦工的終身護身符",
      "desc": "老礦工的終身護身符。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 620,
      "happiness": 0,
      "reputation": 3,
      "impactRaw": "31,0,3",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-589",
      "title": "運輸車隊的極限雪地漂移",
      "desc": "運輸車隊的極限雪地漂移。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "稀有",
      "cash": 900,
      "happiness": 0,
      "reputation": 3,
      "impactRaw": "45,0,3",
      "attributeProfile": "財富:正向,快樂:中性,名譽:正向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-590",
      "title": "探勘隊在荒無人煙的戈壁深處徹底迷失缺水",
      "desc": "探勘隊在荒無人煙的戈壁深處徹底迷失缺水。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "稀有",
      "cash": -700,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-35,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-591",
      "title": "瓦斯濃度的無預警飆升",
      "desc": "瓦斯濃度的無預警飆升。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "稀有",
      "cash": -440,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "-22,0,-3",
      "attributeProfile": "財富:負向,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-592",
      "title": "地下暗河的瘋狂透水風暴",
      "desc": "地下暗河的瘋狂透水風暴。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "稀有",
      "cash": -640,
      "happiness": -3,
      "reputation": 0,
      "impactRaw": "-32,-3,0",
      "attributeProfile": "財富:負向,快樂:負向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-593",
      "title": "邊境營地的武裝悍匪劫掠",
      "desc": "邊境營地的武裝悍匪劫掠。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": 0,
      "impactRaw": "0,-2,0",
      "attributeProfile": "財富:中性,快樂:負向,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-594",
      "title": "高溫地熱斷層的致命遭遇",
      "desc": "高溫地熱斷層的致命遭遇。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "稀有",
      "cash": -400,
      "happiness": 0,
      "reputation": 0,
      "impactRaw": "-20,0,0",
      "attributeProfile": "財富:負向,快樂:中性,名譽:中性",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-595",
      "title": "採礦許可證的無預警作廢",
      "desc": "採礦許可證的無預警作廢。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": -3,
      "impactRaw": "0,0,-3",
      "attributeProfile": "財富:中性,快樂:中性,名譽:負向",
      "rare": true,
      "important": false,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-596",
      "title": "一鎬敲出個聚寶盆",
      "desc": "一鎬敲出個聚寶盆。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 3,
      "reputation": 5,
      "impactRaw": "0,3,5",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-597",
      "title": "分揀台上的血鑽石逆襲",
      "desc": "分揀台上的血鑽石逆襲。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 3,
      "reputation": 4,
      "impactRaw": "0,3,4",
      "attributeProfile": "財富:中性,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-598",
      "title": "礦坑塌方中的神級直覺",
      "desc": "礦坑塌方中的神級直覺。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "傳奇",
      "cash": 1200,
      "happiness": 3,
      "reputation": 5,
      "impactRaw": "60,3,5",
      "attributeProfile": "財富:正向,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-599",
      "title": "鑿岩工的極致速度爆擊",
      "desc": "鑿岩工的極致速度爆擊。鐵鎬與炸藥，在地心深處鑿出財富的金色泉眼。一十字鎬敲出的純淨金剛石斷層、地心超能礦物的發明，或是將蠻荒礦區營地改造成萬人都市，讓你掌控了全球期貨定價權，成為隻手遮天的鐵血資源霸主與金權之王。",
      "eventLevel": "傳奇",
      "cash": 940,
      "happiness": 4,
      "reputation": 4,
      "impactRaw": "47,4,4",
      "attributeProfile": "財富:正向,快樂:正向,名譽:正向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    },
    {
      "id": "v38-開礦-600",
      "title": "採礦許可證的無預警作廢",
      "desc": "採礦許可證的無預警作廢。地下暗河突然決堤透水、瓦斯爆炸突襲、爆破藥庫的連環大爆炸或者國際金融大鱷的惡意期貨做空，讓千米深井瞬間淪為吞噬生命的魔窟。在暗無天日的地下迷宮中，你必須聽懂岩層的哭泣，帶領兄弟們死裡逃生。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": -5,
      "reputation": -4,
      "impactRaw": "0,-5,-4",
      "attributeProfile": "財富:中性,快樂:負向,名譽:負向",
      "rare": true,
      "important": true,
      "manualImpact": true,
      "_normalizedOutcome": true
    }
  ]
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
  "學院": {
    "1": [
      {
        "title": "課堂觀察員",
        "rarity": "普通",
        "desc": "下一次學院事件中獲得情報機率提高",
        "motto": "我坐在後排，看著知識在空氣中流動。",
        "modifiers": {
          "happinessGainPct": 5,
          "reputationGainPct": 5
        },
        "effects": [
          "快樂收益 +5%",
          "名譽收益 +5%",
          "下一次學院事件中獲得情報機率提高"
        ],
        "risks": [],
        "narrative": "靜默的觀察者"
      },
      {
        "title": "筆記整理員",
        "rarity": "普通",
        "desc": "可將「精準筆記」分享給其他玩家換取微量財富",
        "motto": "字跡也許會模糊，但思維的邏輯不會。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "可將「精準筆記」分享給其他玩家換取微量財富"
        ],
        "risks": [],
        "narrative": "條理清晰"
      },
      {
        "title": "學習旅人",
        "rarity": "普通",
        "desc": "移動到不同學院場景時不消耗額外行動力",
        "motto": "知識沒有邊界，我的腳步也是。",
        "modifiers": {
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "快樂收益 +15%",
          "名譽收益 +5%",
          "移動到不同學院場景時不消耗額外行動力"
        ],
        "risks": [],
        "narrative": "行萬里路"
      },
      {
        "title": "讀書會成員",
        "rarity": "普通",
        "desc": "觸發「思辨事件」時，有額外選項",
        "motto": "在文字的微光裡，我們點燃彼此的思想。",
        "modifiers": {
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "快樂收益 +10%",
          "名譽收益 +10%",
          "觸發「思辨事件」時，有額外選項"
        ],
        "risks": [],
        "narrative": "靈魂共鳴"
      },
      {
        "title": "研究助理",
        "rarity": "普通",
        "desc": "執行學術研究時，金錢消耗減少 10%",
        "motto": "教授的咖啡與無盡的數據，就是我的青春。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 5,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +5%",
          "名譽收益 +10%",
          "執行學術研究時，金錢消耗減少 10%"
        ],
        "risks": [],
        "narrative": "幕後功臣"
      },
      {
        "title": "提問探索者",
        "rarity": "普通",
        "desc": "向 NPC 提問時，必定獲得正面好感度",
        "motto": "標準答案是思想的終點，提問才是起點。",
        "modifiers": {
          "happinessGainPct": 10,
          "reputationGainPct": 15
        },
        "effects": [
          "快樂收益 +10%",
          "名譽收益 +15%",
          "向 NPC 提問時，必定獲得正面好感度"
        ],
        "risks": [],
        "narrative": "好奇心旺盛"
      },
      {
        "title": "知識分享人",
        "rarity": "普通",
        "desc": "每當協助他人，快樂與名譽同步微幅上升",
        "motto": "當知識被傳遞出去，它的價值才真正誕生。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 15,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +15%",
          "名譽收益 +10%",
          "每當協助他人，快樂與名譽同步微幅上升"
        ],
        "risks": [],
        "narrative": "樂善好施"
      },
      {
        "title": "社群參與者",
        "rarity": "普通",
        "desc": "校園活動中，結識高階 NPC 的機率提高",
        "motto": "我們在爭論中成長，在共識中前進。",
        "modifiers": {
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "快樂收益 +10%",
          "名譽收益 +10%",
          "校園活動中，結識高階 NPC 的機率提高"
        ],
        "risks": [],
        "narrative": "社交達人"
      },
      {
        "title": "專題實踐者",
        "rarity": "普通",
        "desc": "完成大型專案後，獲得額外財富獎勵",
        "motto": "把論文上的墨水，變成改造世界的工具。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 5,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +5%",
          "名譽收益 +10%",
          "完成大型專案後，獲得額外財富獎勵"
        ],
        "risks": [],
        "narrative": "知行合一"
      },
      {
        "title": "校園服務員",
        "rarity": "普通",
        "desc": "在校園內打工的收益提高 15%",
        "motto": "勞動讓我的雙腳踩在地上，讀書讓我的眼睛看著星空。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "在校園內打工的收益提高 15%"
        ],
        "risks": [],
        "narrative": "踏實苦幹"
      },
      {
        "title": "學習推廣員",
        "rarity": "普通",
        "desc": "提升周圍隊友的學習效率",
        "motto": "如果一盞燈能照亮黑暗，那我就去點燃更多燈。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 15,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +15%",
          "名譽收益 +10%",
          "提升周圍隊友的學習效率"
        ],
        "risks": [],
        "narrative": "燃燒自己"
      },
      {
        "title": "學術探索者",
        "rarity": "普通",
        "desc": "解鎖隱藏文獻庫的存取權限",
        "motto": "在古老的羊皮紙中，藏著未來的鑰匙。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 5,
          "reputationGainPct": 15
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +5%",
          "名譽收益 +15%",
          "解鎖隱藏文獻庫的存取權限"
        ],
        "risks": [],
        "narrative": "鑽研者"
      },
      {
        "title": "終身學習者",
        "rarity": "普通",
        "desc": "年齡大於 60 歲時，所有學院事件依然提供正面屬性",
        "motto": "只要還在思考，我就永遠年輕。",
        "modifiers": {
          "happinessGainPct": 20,
          "reputationGainPct": 10
        },
        "effects": [
          "快樂收益 +20%",
          "名譽收益 +10%",
          "年齡大於 60 歲時，所有學院事件依然提供正面屬性"
        ],
        "risks": [],
        "narrative": "活到老學到老"
      },
      {
        "title": "思辨實踐家",
        "rarity": "普通",
        "desc": "在面對道德兩難事件時，免受負面精神懲罰",
        "motto": "真理不會在妥協中誕生，它在交鋒中閃耀。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +20%",
          "在面對道德兩難事件時，免受負面精神懲罰"
        ],
        "risks": [],
        "narrative": "真理捍衛者"
      },
      {
        "title": "教育志工",
        "rarity": "普通",
        "desc": "大幅降低「孤獨值」，提升人生幸福感",
        "motto": "看著孩子們眼神閃爍的光芒，這就是我的薪水。",
        "modifiers": {
          "happinessGainPct": 20,
          "reputationGainPct": 15
        },
        "effects": [
          "快樂收益 +20%",
          "名譽收益 +15%",
          "大幅降低「孤獨值」，提升人生幸福感"
        ],
        "risks": [],
        "narrative": "無私奉獻"
      }
    ],
    "2": [
      {
        "title": "公共知識份子",
        "rarity": "稀有",
        "desc": "發表言論時影響力加倍，容易引發社會輿論",
        "motto": "走出象牙塔，用筆尖叩問這個時代的良心。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 15,
          "reputationGainPct": 30
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +15%",
          "名譽收益 +30%",
          "發表言論時影響力加倍，容易引發社會輿論"
        ],
        "risks": [],
        "narrative": "時代發聲者"
      },
      {
        "title": "教育倡議者",
        "rarity": "稀有",
        "desc": "推動教育法案時，成功率提高 20%",
        "motto": "每個人都該有平等的機會，去看看圍牆外的世界。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 10,
          "reputationGainPct": 30
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +10%",
          "名譽收益 +30%",
          "推動教育法案時，成功率提高 20%"
        ],
        "risks": [],
        "narrative": "打破階級"
      },
      {
        "title": "學術先鋒",
        "rarity": "稀有",
        "desc": "獲得高額外部研究贊助基金",
        "motto": "我不是在跟隨前人的腳步，我就是在開路。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 5,
          "reputationGainPct": 30
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +5%",
          "名譽收益 +30%",
          "獲得高額外部研究贊助基金"
        ],
        "risks": [],
        "narrative": "開拓者"
      },
      {
        "title": "跨域整合師",
        "rarity": "稀有",
        "desc": "可跨職業觸發其他行業的初階正面事件",
        "motto": "科學與藝術，從來都是同一個世界。",
        "modifiers": {
          "cashGainPct": 20,
          "happinessGainPct": 15,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +20%",
          "快樂收益 +15%",
          "名譽收益 +25%",
          "可跨職業觸發其他行業的初階正面事件"
        ],
        "risks": [],
        "narrative": "斜槓奇才"
      },
      {
        "title": "知識燈塔",
        "rarity": "稀有",
        "desc": "吸引優秀追隨者慕名而來，成為你的學生",
        "motto": "在迷茫的時代裡，我願做那座永不熄滅的燈塔。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 20,
          "reputationGainPct": 35
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +20%",
          "名譽收益 +35%",
          "吸引優秀追隨者慕名而來，成為你的學生"
        ],
        "risks": [],
        "narrative": "靈魂導師"
      },
      {
        "title": "學習設計師",
        "rarity": "稀有",
        "desc": "可為他人客製化學習路徑，並收取諮詢費",
        "motto": "教育不是填滿鴨子，而是點燃火把。",
        "modifiers": {
          "cashGainPct": 20,
          "happinessGainPct": 15,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +20%",
          "快樂收益 +15%",
          "名譽收益 +25%",
          "可為他人客製化學習路徑，並收取諮詢費"
        ],
        "risks": [],
        "narrative": "思維工程師"
      },
      {
        "title": "知識分析師",
        "rarity": "稀有",
        "desc": "能精準預測下一季度的商業與學術趨勢",
        "motto": "數據不會說謊，它只是在低語未來的秘密。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 5,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +5%",
          "名譽收益 +25%",
          "能精準預測下一季度的商業與學術趨勢"
        ],
        "risks": [],
        "narrative": "看透未來"
      },
      {
        "title": "研究策劃者",
        "rarity": "稀有",
        "desc": "能組建大型研究團隊，並享有團隊成果分潤",
        "motto": "英雄單打獨鬥的時代結束了，現在是群星閃耀的時間。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 10,
          "reputationGainPct": 30
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +10%",
          "名譽收益 +30%",
          "能組建大型研究團隊，並享有團隊成果分潤"
        ],
        "risks": [],
        "narrative": "幕後推手"
      }
    ],
    "3": [
      {
        "title": "時代導師",
        "rarity": "傳奇",
        "desc": "所有涉及公眾信任的事件判定，必定完美成功",
        "motto": "我的職責不是教給他們知識，而是喚醒他們的靈魂。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 20,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +20%",
          "名譽收益 +50%",
          "所有涉及公眾信任的事件判定，必定完美成功"
        ],
        "risks": [],
        "narrative": "萬世師表"
      },
      {
        "title": "制度改革家",
        "rarity": "傳奇",
        "desc": "重塑現有教育體制，免除一切制度性懲罰",
        "motto": "如果體制已經僵化，那就由我們來砸碎它。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 10,
          "reputationGainPct": 55
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +10%",
          "名譽收益 +55%",
          "重塑現有教育體制，免除一切制度性懲罰"
        ],
        "risks": [],
        "narrative": "體制破壞者"
      },
      {
        "title": "理論建構者",
        "rarity": "傳奇",
        "desc": "以你的名字命名一個新理論，名譽永久鎖定在高點",
        "motto": "肉體會腐朽，但經典的方程式將與宇宙同壽。",
        "modifiers": {
          "cashGainPct": 35,
          "happinessGainPct": 5,
          "reputationGainPct": 55
        },
        "effects": [
          "金錢收益 +35%",
          "快樂收益 +5%",
          "名譽收益 +55%",
          "以你的名字命名一個新理論，名譽永久鎖定在高點"
        ],
        "risks": [],
        "narrative": "名留青史"
      },
      {
        "title": "教育實踐家",
        "rarity": "傳奇",
        "desc": "親自創辦的學校成為聖地，快樂值獲得極大加成",
        "motto": "看著荒蕪的土地開出智慧的花，這就是我的實踐。",
        "modifiers": {
          "cashGainPct": 20,
          "happinessGainPct": 25,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +20%",
          "快樂收益 +25%",
          "名譽收益 +50%",
          "親自創辦的學校成為聖地，快樂值獲得極大加成"
        ],
        "risks": [],
        "narrative": "桃李滿天下"
      }
    ],
    "4": [
      {
        "title": "名譽教授",
        "rarity": "隱藏",
        "desc": "每年自動獲得高額退休金與無條件社會尊重",
        "motto": "講台上的粉筆灰落了四十年，如今已是滿頭華髮。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 25,
          "reputationGainPct": 75,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +25%",
          "名譽收益 +75%",
          "每年自動獲得高額退休金與無條件社會尊重"
        ],
        "risks": [],
        "narrative": "歲月沉澱",
        "unlock": {
          "careerCount": 4,
          "age": 55,
          "reputation": 70
        }
      },
      {
        "title": "教育改革者",
        "rarity": "隱藏",
        "desc": "全國教科書將印上你的肖像，徹底改變一代人",
        "motto": "我們贏了，未來的孩子們不用再為應試而哭泣。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 20,
          "reputationGainPct": 80,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +20%",
          "名譽收益 +80%",
          "全國教科書將印上你的肖像，徹底改變一代人"
        ],
        "risks": [],
        "narrative": "改變歷史",
        "unlock": {
          "careerCount": 4,
          "age": 50,
          "reputation": 60
        }
      },
      {
        "title": "知識傳承者",
        "rarity": "隱藏",
        "desc": "可將你的一項頂級技能無損遺傳給下一代角色",
        "motto": "我將火炬交給了你，請繼續把它傳下去。",
        "modifiers": {
          "cashGainPct": 20,
          "happinessGainPct": 30,
          "reputationGainPct": 75,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +20%",
          "快樂收益 +30%",
          "名譽收益 +75%",
          "可將你的一項頂級技能無損遺傳給下一代角色"
        ],
        "risks": [],
        "narrative": "薪火相傳",
        "unlock": {
          "careerCount": 4,
          "age": 60,
          "family": true
        }
      }
    ]
  },
  "農墾": {
    "1": [
      {
        "title": "農事學徒",
        "rarity": "普通",
        "desc": "農墾失敗時，遭受的財富損失減半",
        "motto": "泥土的味道很重，但我開始習慣了。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +5%",
          "農墾失敗時，遭受的財富損失減半"
        ],
        "risks": [],
        "narrative": "腳踏實地"
      },
      {
        "title": "田野觀察員",
        "rarity": "普通",
        "desc": "能準確預測下一回合的天氣變化",
        "motto": "風帶來的濕度，草呈現的顏色，都是大自然的語言。",
        "modifiers": {
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "快樂收益 +10%",
          "名譽收益 +5%",
          "能準確預測下一回合的天氣變化"
        ],
        "risks": [],
        "narrative": "自然之友"
      },
      {
        "title": "土壤照護員",
        "rarity": "普通",
        "desc": "作物生長速度提升 5%",
        "motto": "你怎麼對待土地，土地就會怎麼回報你。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 5,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +5%",
          "名譽收益 +5%",
          "作物生長速度提升 5%"
        ],
        "risks": [],
        "narrative": "大地之子"
      },
      {
        "title": "作物管理員",
        "rarity": "普通",
        "desc": "降低作物遭遇病蟲害的機率",
        "motto": "每一株幼苗，都像嗷嗷待哺的嬰兒。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "降低作物遭遇病蟲害的機率"
        ],
        "risks": [],
        "narrative": "細心呵護"
      },
      {
        "title": "果園助手",
        "rarity": "普通",
        "desc": "採收果實時，有機會額外獲得神祕特殊果實",
        "motto": "陽光曬過的橘子，吃一口就是夏天的味道。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "採收果實時，有機會額外獲得神祕特殊果實"
        ],
        "risks": [],
        "narrative": "豐收滋味"
      },
      {
        "title": "農村服務員",
        "rarity": "普通",
        "desc": "提升與當地村民的親密度與互助機率",
        "motto": "鄰里間的互相幫忙，比冰冷的機器更溫暖。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "提升與當地村民的親密度與互助機率"
        ],
        "risks": [],
        "narrative": "熱心鄉里"
      },
      {
        "title": "農機操作員",
        "rarity": "普通",
        "desc": "大規模開墾時的操作效率翻倍",
        "motto": "發動機的轟鳴，是我在荒野上的交響樂。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 5,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +5%",
          "名譽收益 +5%",
          "大規模開墾時的操作效率翻倍"
        ],
        "risks": [],
        "narrative": "機械狂熱"
      },
      {
        "title": "收穫分享人",
        "rarity": "普通",
        "desc": "分享作物時，有機率獲得罕見的人情回報",
        "motto": "餐桌上的笑聲，才是真正的收穫。",
        "modifiers": {
          "happinessGainPct": 20,
          "reputationGainPct": 10
        },
        "effects": [
          "快樂收益 +20%",
          "名譽收益 +10%",
          "分享作物時，有機率獲得罕見的人情回報"
        ],
        "risks": [],
        "narrative": "慷慨分享"
      },
      {
        "title": "農產推廣員",
        "rarity": "普通",
        "desc": "農產品出售價格提高 10%",
        "motto": "我要讓城裡人知道，什麼才是真正長在土裡的美味。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "農產品出售價格提高 10%"
        ],
        "risks": [],
        "narrative": "行銷能手"
      },
      {
        "title": "農村旅人",
        "rarity": "普通",
        "desc": "在不同村落間移動時，遭遇意外的機率降低",
        "motto": "走過無數條鄉間小路，每條路都有它的故事。",
        "modifiers": {
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "快樂收益 +15%",
          "名譽收益 +5%",
          "在不同村落間移動時，遭遇意外的機率降低"
        ],
        "risks": [],
        "narrative": "隨遇而安"
      },
      {
        "title": "種植實踐者",
        "rarity": "普通",
        "desc": "成功馴化野生植物的機率提高",
        "motto": "課本上說種不活，但我偏想試試看。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "成功馴化野生植物的機率提高"
        ],
        "risks": [],
        "narrative": "百折不撓"
      },
      {
        "title": "農業觀察家",
        "rarity": "普通",
        "desc": "撰寫的農墾日誌能換取微量名譽",
        "motto": "大地的四季輪轉，是一部寫不完的史詩。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 15
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +15%",
          "撰寫的農墾日誌能換取微量名譽"
        ],
        "risks": [],
        "narrative": "理性思考"
      },
      {
        "title": "社區耕作者",
        "rarity": "普通",
        "desc": "可發起社區集體耕作，分攤勞動風險",
        "motto": "一根筷子容易折斷，一捆莊稼能熬過寒冬。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 15,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +15%",
          "名譽收益 +10%",
          "可發起社區集體耕作，分攤勞動風險"
        ],
        "risks": [],
        "narrative": "團結協作"
      },
      {
        "title": "農田管理員",
        "rarity": "普通",
        "desc": "提升農場固定資產的折舊壽命",
        "motto": "巡視邊界與灌溉渠，是每天最安心的時刻。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "提升農場固定資產的折舊壽命"
        ],
        "risks": [],
        "narrative": "盡職盡責"
      },
      {
        "title": "土地守望者",
        "rarity": "普通",
        "desc": "當災害來臨時，能保全至少 30% 的核心作物",
        "motto": "只要我還站著，這片田就不會荒蕪。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 15
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +15%",
          "當災害來臨時，能保全至少 30% 的核心作物"
        ],
        "risks": [],
        "narrative": "堅毅不拔"
      }
    ],
    "2": [
      {
        "title": "永續耕耘者",
        "rarity": "稀有",
        "desc": "土地肥力永遠不會耗盡，實現良性循環",
        "motto": "我們不從子孫那裡繼承土地，而是向他們借用。",
        "modifiers": {
          "cashGainPct": 20,
          "happinessGainPct": 15,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +20%",
          "快樂收益 +15%",
          "名譽收益 +20%",
          "土地肥力永遠不會耗盡，實現良性循環"
        ],
        "risks": [],
        "narrative": "綠色環保"
      },
      {
        "title": "智慧農業師",
        "rarity": "稀有",
        "desc": "解鎖自動化灌溉系統，免除體力勞力消耗",
        "motto": "用數據算出生產力，用科技解放農夫的雙手。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 5,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +5%",
          "名譽收益 +20%",
          "解鎖自動化灌溉系統，免除體力勞力消耗"
        ],
        "risks": [],
        "narrative": "科技務農"
      },
      {
        "title": "農村推動者",
        "rarity": "稀有",
        "desc": "村落經濟繁榮，每年自動獲得村集體分紅",
        "motto": "一個人富不算富，全村人吃飽穿暖才算數。",
        "modifiers": {
          "cashGainPct": 20,
          "happinessGainPct": 20,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +20%",
          "快樂收益 +20%",
          "名譽收益 +25%",
          "村落經濟繁榮，每年自動獲得村集體分紅"
        ],
        "risks": [],
        "narrative": "共富領袖"
      },
      {
        "title": "生態耕作者",
        "rarity": "稀有",
        "desc": "完全不使用化學肥料，農產品具備高級有機標籤",
        "motto": "與昆蟲和解，與雜草共生，這是自然的智慧。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 20,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +20%",
          "名譽收益 +25%",
          "完全不使用化學肥料，農產品具備高級有機標籤"
        ],
        "risks": [],
        "narrative": "天人合一"
      },
      {
        "title": "農地規劃師",
        "rarity": "稀有",
        "desc": "土地利用率達到極致，農場可擴建上限提升",
        "motto": "每一寸土地，都有它最適合安放的種子。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 10,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +10%",
          "名譽收益 +20%",
          "土地利用率達到極致，農場可擴建上限提升"
        ],
        "risks": [],
        "narrative": "空間魔術師"
      },
      {
        "title": "農產策展人",
        "rarity": "稀有",
        "desc": "將農產品包裝成高端品牌，外銷利潤暴增 50%",
        "motto": "這不只是一袋米，這是這片土地的故事與靈魂。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 15,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +15%",
          "名譽收益 +25%",
          "將農產品包裝成高端品牌，外銷利潤暴增 50%"
        ],
        "risks": [],
        "narrative": "品牌推手"
      },
      {
        "title": "農業實驗家",
        "rarity": "稀有",
        "desc": "有機率培育出震驚學術界的新品種抗旱作物",
        "motto": "在實驗室與泥潭之間，我選擇兩者都要。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 5,
          "reputationGainPct": 30
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +5%",
          "名譽收益 +30%",
          "有機率培育出震驚學術界的新品種抗旱作物"
        ],
        "risks": [],
        "narrative": "基因解碼"
      },
      {
        "title": "地方創生者",
        "rarity": "稀有",
        "desc": "將沒落村落打造為觀光生態聖地，獲得政府補助",
        "motto": "留住年輕人，就是留住這片土地的根。",
        "modifiers": {
          "cashGainPct": 20,
          "happinessGainPct": 20,
          "reputationGainPct": 30
        },
        "effects": [
          "金錢收益 +20%",
          "快樂收益 +20%",
          "名譽收益 +30%",
          "將沒落村落打造為觀光生態聖地，獲得政府補助"
        ],
        "risks": [],
        "narrative": "文化復興"
      }
    ],
    "3": [
      {
        "title": "農業創新家",
        "rarity": "傳奇",
        "desc": "獲得國家農業科技特等獎，享有永久政策免稅",
        "motto": "顛覆數千年的傳統，我們重新定義了耕作。",
        "modifiers": {
          "cashGainPct": 35,
          "happinessGainPct": 15,
          "reputationGainPct": 45
        },
        "effects": [
          "金錢收益 +35%",
          "快樂收益 +15%",
          "名譽收益 +45%",
          "獲得國家農業科技特等獎，享有永久政策免稅"
        ],
        "risks": [],
        "narrative": "劃時代創新"
      },
      {
        "title": "大地守護者",
        "rarity": "傳奇",
        "desc": "在極端氣候災難中，你的農場是唯一不受影響的淨土",
        "motto": "萬物都在顫抖，但大地的核心依然平靜。",
        "modifiers": {
          "cashGainPct": 20,
          "happinessGainPct": 25,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +20%",
          "快樂收益 +25%",
          "名譽收益 +50%",
          "在極端氣候災難中，你的農場是唯一不受影響的淨土"
        ],
        "risks": [],
        "narrative": "與自然同行"
      },
      {
        "title": "創生領航員",
        "rarity": "傳奇",
        "desc": "帶領全國農業帶轉型，成為國家級經濟顧問",
        "motto": "從一片荒蕪到萬頃良田，我們走了整整一代人。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 20,
          "reputationGainPct": 55
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +20%",
          "名譽收益 +55%",
          "帶領全國農業帶轉型，成為國家級經濟顧問"
        ],
        "risks": [],
        "narrative": "宏觀戰略"
      },
      {
        "title": "生態領航員",
        "rarity": "傳奇",
        "desc": "成功恢復一片荒漠的生態環境，快樂極大提升",
        "motto": "當第一棵綠芽在沙漠深處破土，我知道我們贏了。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 25,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +25%",
          "名譽收益 +50%",
          "成功恢復一片荒漠的生態環境，快樂極大提升"
        ],
        "risks": [],
        "narrative": "生命奇蹟"
      }
    ],
    "4": [
      {
        "title": "百年農匠",
        "rarity": "隱藏",
        "desc": "家族農場成為歷史文化遺產，子孫後代繼承財富加成",
        "motto": "一百年來，我們家族只做了一件事：種好這顆糧食。",
        "modifiers": {
          "cashGainPct": 35,
          "happinessGainPct": 25,
          "reputationGainPct": 70,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +35%",
          "快樂收益 +25%",
          "名譽收益 +70%",
          "家族農場成為歷史文化遺產，子孫後代繼承財富加成"
        ],
        "risks": [],
        "narrative": "家族傳承",
        "unlock": {
          "careerCount": 4,
          "age": 60,
          "happiness": 60
        }
      },
      {
        "title": "土地傳承者",
        "rarity": "隱藏",
        "desc": "獲得終身土地榮譽勳章，死後小說結局觸發大地史詩",
        "motto": "我將歸於這片泥土，繼續看著春耕與秋收。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 30,
          "reputationGainPct": 70,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +30%",
          "名譽收益 +70%",
          "獲得終身土地榮譽勳章，死後小說結局觸發大地史詩"
        ],
        "risks": [],
        "narrative": "靈魂歸宿",
        "unlock": {
          "careerCount": 4,
          "age": 65,
          "family": true
        }
      },
      {
        "title": "綠色革命家",
        "rarity": "隱藏",
        "desc": "你的糧食產量翻倍技術，拯救了全球數億飢荒人口",
        "motto": "世界上不該再有任何一個孩子，因為飢餓而哭著入睡。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 20,
          "reputationGainPct": 80,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +20%",
          "名譽收益 +80%",
          "你的糧食產量翻倍技術，拯救了全球數億飢荒人口"
        ],
        "risks": [],
        "narrative": "救世傳奇",
        "unlock": {
          "careerCount": 4,
          "age": 55,
          "reputation": 70
        }
      }
    ]
  },
  "企業": {
    "1": [
      {
        "title": "職場新人",
        "rarity": "普通",
        "desc": "在企業事件中，有長輩 NPC 願意出面代為承擔失誤",
        "motto": "打卡鐘的聲音很響，我的心跳也是。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +5%",
          "在企業事件中，有長輩 NPC 願意出面代為承擔失誤"
        ],
        "risks": [],
        "narrative": "初生之犢"
      },
      {
        "title": "業務助理",
        "rarity": "普通",
        "desc": "處理繁瑣行政時，有機率額外獲得商界情報",
        "motto": "發票與報表堆裡，藏著商業世界的微小神經。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 5,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +5%",
          "名譽收益 +5%",
          "處理繁瑣行政時，有機率額外獲得商界情報"
        ],
        "risks": [],
        "narrative": "任勞任怨"
      },
      {
        "title": "客戶服務員",
        "rarity": "普通",
        "desc": "大幅提升情商（EQ），能安撫憤怒的客戶",
        "motto": "微笑是我的制服，也是我面對刁難的盾牌。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "大幅提升情商（EQ），能安撫憤怒的客戶"
        ],
        "risks": [],
        "narrative": "面帶微笑"
      },
      {
        "title": "專案成員",
        "rarity": "普通",
        "desc": "參與的專案成功率提高 10%",
        "motto": "在大齒輪裡當一個小齒輪，也要轉得足夠精準。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "參與的專案成功率提高 10%"
        ],
        "risks": [],
        "narrative": "團隊螺絲釘"
      },
      {
        "title": "團隊協作者",
        "rarity": "普通",
        "desc": "提升同團隊友的基礎工作效率",
        "motto": "沒有人是孤島，在商場上，我們是一隻手掌。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "提升同團隊友的基礎工作效率"
        ],
        "risks": [],
        "narrative": "神隊友"
      },
      {
        "title": "行銷實踐者",
        "rarity": "普通",
        "desc": "行銷活動爆擊率提高，能帶來短期的資金暴增",
        "motto": "把平凡的產品包裝成渴望，這就是魔術。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "行銷活動爆擊率提高，能帶來短期的資金暴增"
        ],
        "risks": [],
        "narrative": "創意無限"
      },
      {
        "title": "商業分析員",
        "rarity": "普通",
        "desc": "降低投資虧損的風險",
        "motto": "在密密麻麻的 K 線圖裡，我尋找金錢的呼吸聲。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 5,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +5%",
          "名譽收益 +5%",
          "降低投資虧損的風險"
        ],
        "risks": [],
        "narrative": "理性冷靜"
      },
      {
        "title": "市場觀察員",
        "rarity": "普通",
        "desc": "能提前一回合察覺市場景氣轉折點",
        "motto": "秋風未動蟬先覺，市場的風向總在細微處改變。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "能提前一回合察覺市場景氣轉折點"
        ],
        "risks": [],
        "narrative": "敏銳嗅覺"
      },
      {
        "title": "營運支援員",
        "rarity": "普通",
        "desc": "降低公司日常營運成本 5%",
        "motto": "把每一條流程省下一塊錢，規模化後就是百萬財富。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "降低公司日常營運成本 5%"
        ],
        "risks": [],
        "narrative": "精打細算"
      },
      {
        "title": "商務開發員",
        "rarity": "普通",
        "desc": "成功簽署外部合作協議時，獲得額外獎金",
        "motto": "我的工作就是敲開那些緊閉的門，並握住對手的手。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 5,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +5%",
          "名譽收益 +10%",
          "成功簽署外部合作協議時，獲得額外獎金"
        ],
        "risks": [],
        "narrative": "破冰先鋒"
      },
      {
        "title": "流程優化師",
        "rarity": "普通",
        "desc": "縮短專案完成所需的冷卻回合",
        "motto": "世界上沒有完美的流程，只有不斷被壓榨的效率。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "縮短專案完成所需的冷卻回合"
        ],
        "risks": [],
        "narrative": "效率至上"
      },
      {
        "title": "部門協調員",
        "rarity": "普通",
        "desc": "消除跨部門溝通時產生的負面內耗事件",
        "motto": "吵架是解決不了問題的，不如坐下來喝杯咖啡。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "消除跨部門溝通時產生的負面內耗事件"
        ],
        "risks": [],
        "narrative": "職場和事佬"
      },
      {
        "title": "商業研究員",
        "rarity": "普通",
        "desc": "研究競爭對手時，能百分之百看穿其下步策略",
        "motto": "在對手出招前，他們的底牌早就躺在我的報告裡。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 5,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +5%",
          "名譽收益 +10%",
          "研究競爭對手時，能百分之百看穿其下步策略"
        ],
        "risks": [],
        "narrative": "知己知彼"
      },
      {
        "title": "商業旅人",
        "rarity": "普通",
        "desc": "在外地出差時，有機率觸發異國特殊商機",
        "motto": "機場的候機室，是我最常醒來的床。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "在外地出差時，有機率觸發異國特殊商機"
        ],
        "risks": [],
        "narrative": "四海為家"
      },
      {
        "title": "產品推廣員",
        "rarity": "普通",
        "desc": "單次產品銷售上限提高",
        "motto": "好產品自己會說話，而我是給它麥克風的人。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "單次產品銷售上限提高"
        ],
        "risks": [],
        "narrative": "超級推銷員"
      }
    ],
    "2": [
      {
        "title": "品牌經營者",
        "rarity": "稀有",
        "desc": "公司產品擁有粉絲效應，不再受惡意降價影響",
        "motto": "我們賣的不是產品，是一種生活方式與信仰。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 15,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +15%",
          "名譽收益 +20%",
          "公司產品擁有粉絲效應，不再受惡意降價影響"
        ],
        "risks": [],
        "narrative": "粉絲經濟"
      },
      {
        "title": "創業實踐家",
        "rarity": "稀有",
        "desc": "創辦新公司時，初始獲得的風險投資金額加倍",
        "motto": "與其在別人的船上當水手，不如自己造一艘船起航。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 10,
          "reputationGainPct": 15
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +10%",
          "名譽收益 +15%",
          "創辦新公司時，初始獲得的風險投資金額加倍"
        ],
        "risks": [],
        "narrative": "白手起家"
      },
      {
        "title": "商業策劃師",
        "rarity": "稀有",
        "desc": "策劃大型商業戰役，能吞併同級別競爭對手",
        "motto": "商場如戰場，每一枚硬幣都是我的士兵。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 10,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +10%",
          "名譽收益 +20%",
          "策劃大型商業戰役，能吞併同級別競爭對手"
        ],
        "risks": [],
        "narrative": "幕後軍師"
      },
      {
        "title": "市場開拓者",
        "rarity": "稀有",
        "desc": "成功解鎖全新的海外市場板塊",
        "motto": "地圖上的空白處，就是我們插上旗幟的地方。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 15,
          "reputationGainPct": 15
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +15%",
          "名譽收益 +15%",
          "成功解鎖全新的海外市場板塊"
        ],
        "risks": [],
        "narrative": "開疆闢土"
      },
      {
        "title": "投資分析師",
        "rarity": "稀有",
        "desc": "投資項目的回報率大幅上升",
        "motto": "別人的恐懼就是我的貪婪，財富只流向冷靜的頭腦。",
        "modifiers": {
          "cashGainPct": 35,
          "happinessGainPct": 5,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +35%",
          "快樂收益 +5%",
          "名譽收益 +20%",
          "投資項目的回報率大幅上升"
        ],
        "risks": [],
        "narrative": "金錢獵手"
      },
      {
        "title": "營運管理師",
        "rarity": "稀有",
        "desc": "公司在遭遇市場金融危機時，資產損失降低 50%",
        "motto": "穩健，是高槓桿時代裡最奢侈的豪華。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 10,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +10%",
          "名譽收益 +20%",
          "公司在遭遇市場金融危機時，資產損失降低 50%"
        ],
        "risks": [],
        "narrative": "中流砥柱"
      },
      {
        "title": "商業整合師",
        "rarity": "稀有",
        "desc": "收購其他夕陽產業，並將其資產重組獲利",
        "motto": "沒有垃圾產業，只有放錯地方的資源。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 15,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +15%",
          "名譽收益 +25%",
          "收購其他夕陽產業，並將其資產重組獲利"
        ],
        "risks": [],
        "narrative": "化腐朽為神奇"
      },
      {
        "title": "資本運營師",
        "rarity": "稀有",
        "desc": "解鎖股市與槓桿借貸功能，實現財富快速翻倍",
        "motto": "用別人的錢賺自己的錢，這才是資本的奧義。",
        "modifiers": {
          "cashGainPct": 40,
          "happinessGainPct": 5,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +40%",
          "快樂收益 +5%",
          "名譽收益 +20%",
          "解鎖股市與槓桿借貸功能，實現財富快速翻倍"
        ],
        "risks": [],
        "narrative": "槓桿大師"
      }
    ],
    "3": [
      {
        "title": "企業領航員",
        "rarity": "傳奇",
        "desc": "你的决策直接影響行業標準，每年獲得巨額股利",
        "motto": "當你站得足夠高，風就不是阻力，而是動力。",
        "modifiers": {
          "cashGainPct": 40,
          "happinessGainPct": 15,
          "reputationGainPct": 45
        },
        "effects": [
          "金錢收益 +40%",
          "快樂收益 +15%",
          "名譽收益 +45%",
          "你的决策直接影響行業標準，每年獲得巨額股利"
        ],
        "risks": [],
        "narrative": "掌舵者"
      },
      {
        "title": "創新企業家",
        "rarity": "傳奇",
        "desc": "開發出顛覆性產品，徹底改變大眾的生活習慣",
        "motto": "預測未來最好的方法，就是親手把它發明出來。",
        "modifiers": {
          "cashGainPct": 45,
          "happinessGainPct": 20,
          "reputationGainPct": 40
        },
        "effects": [
          "金錢收益 +45%",
          "快樂收益 +20%",
          "名譽收益 +40%",
          "開發出顛覆性產品，徹底改變大眾的生活習慣"
        ],
        "risks": [],
        "narrative": "改變世界"
      },
      {
        "title": "商業戰略家",
        "rarity": "傳奇",
        "desc": "在任何商業對決中，必定處於絕對不敗優勢",
        "motto": "真正的勝利，是在戰鬥開始前就已經注定的。",
        "modifiers": {
          "cashGainPct": 45,
          "happinessGainPct": 10,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +45%",
          "快樂收益 +10%",
          "名譽收益 +50%",
          "在任何商業對決中，必定處於絕對不敗優勢"
        ],
        "risks": [],
        "narrative": "不戰而勝"
      },
      {
        "title": "資本戰略家",
        "rarity": "傳奇",
        "desc": "能發起跨國惡意收購，掌控市場底層資金流向",
        "motto": "我不在乎誰當總統，我只在乎是誰在印鈔票。",
        "modifiers": {
          "cashGainPct": 55,
          "happinessGainPct": 5,
          "reputationGainPct": 45
        },
        "effects": [
          "金錢收益 +55%",
          "快樂收益 +5%",
          "名譽收益 +45%",
          "能發起跨國惡意收購，掌控市場底層資金流向"
        ],
        "risks": [],
        "narrative": "幕後黑手"
      }
    ],
    "4": [
      {
        "title": "產業巨擘",
        "rarity": "隱藏",
        "desc": "你的企業帝國「大到不能倒」，獲得國家級財政保護",
        "motto": "我們的員工數量，足以填滿一座一線城市。",
        "modifiers": {
          "cashGainPct": 60,
          "happinessGainPct": 20,
          "reputationGainPct": 70,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +60%",
          "快樂收益 +20%",
          "名譽收益 +70%",
          "你的企業帝國「大到不能倒」，獲得國家級財政保護"
        ],
        "risks": [],
        "narrative": "富可敵國",
        "unlock": {
          "careerCount": 4,
          "age": 45,
          "wealth": 90
        }
      },
      {
        "title": "商業傳奇",
        "rarity": "隱藏",
        "desc": "你的創業故事被編入哈佛商學院教材，名聲永流傳",
        "motto": "我從一間車庫開始，現在我的名字寫在摩天大樓頂端。",
        "modifiers": {
          "cashGainPct": 55,
          "happinessGainPct": 25,
          "reputationGainPct": 70,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +55%",
          "快樂收益 +25%",
          "名譽收益 +70%",
          "你的創業故事被編入哈佛商學院教材，名聲永流傳"
        ],
        "risks": [],
        "narrative": "白手起家傳奇",
        "unlock": {
          "careerCount": 4,
          "age": 55,
          "wealth": 80,
          "reputation": 60
        }
      },
      {
        "title": "財富建築師",
        "rarity": "隱藏",
        "desc": "解鎖終極金融工具，家族資產在遊戲結束後永久傳承",
        "motto": "金錢只是工具，我用它築起了一座不朽的金色城堡。",
        "modifiers": {
          "cashGainPct": 75,
          "happinessGainPct": 15,
          "reputationGainPct": 60,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +75%",
          "快樂收益 +15%",
          "名譽收益 +60%",
          "解鎖終極金融工具，家族資產在遊戲結束後永久傳承"
        ],
        "risks": [],
        "narrative": "金錢帝國",
        "unlock": {
          "careerCount": 4,
          "age": 50,
          "wealth": 100
        }
      }
    ]
  },
  "從政": {
    "1": [
      {
        "title": "社區志工",
        "rarity": "普通",
        "desc": "基層好感度上升速度翻倍",
        "motto": "把社區的小事做好，就是最偉大的政治。",
        "modifiers": {
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "快樂收益 +10%",
          "名譽收益 +5%",
          "基層好感度上升速度翻倍"
        ],
        "risks": [],
        "narrative": "深耕基層"
      },
      {
        "title": "公共服務員",
        "rarity": "普通",
        "desc": "處理政務事件時，出錯率降到最低",
        "motto": "在公文的流轉中，我看到的是無數家庭的生計。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "處理政務事件時，出錯率降到最低"
        ],
        "risks": [],
        "narrative": "盡忠職守"
      },
      {
        "title": "村里協助員",
        "rarity": "普通",
        "desc": "在地方糾紛事件中，能快速平息民眾不滿",
        "motto": "坐下來喝碗茶，天大的恩怨也能在村口解決。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "在地方糾紛事件中，能快速平息民眾不滿"
        ],
        "risks": [],
        "narrative": "地方和事佬"
      },
      {
        "title": "民意傾聽者",
        "rarity": "普通",
        "desc": "能精準捕捉基層大眾的核心需求與痛點",
        "motto": "我的耳朵，永遠朝著那些發不出聲音的角落。",
        "modifiers": {
          "happinessGainPct": 15,
          "reputationGainPct": 10
        },
        "effects": [
          "快樂收益 +15%",
          "名譽收益 +10%",
          "能精準捕捉基層大眾的核心需求與痛點"
        ],
        "risks": [],
        "narrative": "苦民所苦"
      },
      {
        "title": "地方觀察員",
        "rarity": "普通",
        "desc": "提前一回合得知地方政策的變更動向",
        "motto": "站在田壟與街角，才能看清社會最真實的紋理。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "提前一回合得知地方政策的變更動向"
        ],
        "risks": [],
        "narrative": "體察民情"
      },
      {
        "title": "政策觀察員",
        "rarity": "普通",
        "desc": "提高撰寫政策評估報告的成功率",
        "motto": "一條法規的修改，能讓千人哭，也能讓萬人笑。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 5,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +5%",
          "名譽收益 +10%",
          "提高撰寫政策評估報告的成功率"
        ],
        "risks": [],
        "narrative": "理性政策"
      },
      {
        "title": "公民參與者",
        "rarity": "普通",
        "desc": "發起聯署或集會時，基礎響應人數加倍",
        "motto": "政治不是少數人的權力遊戲，是每個人生活的總和。",
        "modifiers": {
          "happinessGainPct": 15,
          "reputationGainPct": 10
        },
        "effects": [
          "快樂收益 +15%",
          "名譽收益 +10%",
          "發起聯署或集會時，基礎響應人數加倍"
        ],
        "risks": [],
        "narrative": "公民覺醒"
      },
      {
        "title": "議題關心者",
        "rarity": "普通",
        "desc": "在特定社會議題事件中，能獲得額外聲援",
        "motto": "如果每個人都選擇沉默，那黑暗將吞噬一切。",
        "modifiers": {
          "happinessGainPct": 10,
          "reputationGainPct": 15
        },
        "effects": [
          "快樂收益 +10%",
          "名譽收益 +15%",
          "在特定社會議題事件中，能獲得額外聲援"
        ],
        "risks": [],
        "narrative": "正義之心"
      },
      {
        "title": "公共倡議者",
        "rarity": "普通",
        "desc": "提升特定議題在媒體上的曝光機率",
        "motto": "我撕開喉嚨吶喊，只為了讓對的人聽到這份訴求。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 15
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +15%",
          "提升特定議題在媒體上的曝光機率"
        ],
        "risks": [],
        "narrative": "理念宣傳"
      },
      {
        "title": "社會觀察家",
        "rarity": "普通",
        "desc": "能免疫假新聞或政治抹黑事件的負面衝擊",
        "motto": "在喧囂的輿論漩渦中，保持冷徹的冷靜。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "能免疫假新聞或政治抹黑事件的負面衝擊"
        ],
        "risks": [],
        "narrative": "看透真相"
      },
      {
        "title": "公益行動者",
        "rarity": "普通",
        "desc": "大幅提升個人道德名譽，但不會獲得財富",
        "motto": "我的財富不在銀行帳戶，在人們感激的眼神裡。",
        "modifiers": {
          "happinessGainPct": 20,
          "reputationGainPct": 10
        },
        "effects": [
          "快樂收益 +20%",
          "名譽收益 +10%",
          "大幅提升個人道德名譽，但不會獲得財富"
        ],
        "risks": [],
        "narrative": "無私奉獻"
      },
      {
        "title": "青年參與者",
        "rarity": "普通",
        "desc": "獲得青年團體與學生勢力的無條件支持",
        "motto": "我們雖然年輕，但這並不代表我們不能改變歷史。",
        "modifiers": {
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "快樂收益 +15%",
          "名譽收益 +5%",
          "獲得青年團體與學生勢力的無條件支持"
        ],
        "risks": [],
        "narrative": "熱血青年"
      },
      {
        "title": "社會實踐者",
        "rarity": "普通",
        "desc": "將特定公益項目成功轉型為可持續營運的模式",
        "motto": "光有愛心是不夠的，我們需要制度與方法的支撐。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "將特定公益項目成功轉型為可持續營運的模式"
        ],
        "risks": [],
        "narrative": "知行合一"
      },
      {
        "title": "公共事務員",
        "rarity": "普通",
        "desc": "在政府體制內的晉升考核中，獲得微幅加成",
        "motto": "把繁雜的行政事務理順，是推動巨輪前進的底氣。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "在政府體制內的晉升考核中，獲得微幅加成"
        ],
        "risks": [],
        "narrative": "體制螺絲釘"
      },
      {
        "title": "理想追尋者",
        "rarity": "普通",
        "desc": "即使政界派系鬥爭失敗，快樂值也不會歸零",
        "motto": "權力會腐蝕人心，但我的理想永遠潔白如初。",
        "modifiers": {
          "happinessGainPct": 20,
          "reputationGainPct": 5
        },
        "effects": [
          "快樂收益 +20%",
          "名譽收益 +5%",
          "即使政界派系鬥爭失敗，快樂值也不會歸零"
        ],
        "risks": [],
        "narrative": "初心不改"
      }
    ],
    "2": [
      {
        "title": "地方倡議者",
        "rarity": "稀有",
        "desc": "成功爭取到地方建設預算，造福特定選區",
        "motto": "把中央的資源撥回鄉里，是我對這片土地的承諾。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 15,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +15%",
          "名譽收益 +25%",
          "成功爭取到地方建設預算，造福特定選區"
        ],
        "risks": [],
        "narrative": "造福桑梓"
      },
      {
        "title": "社區規劃師",
        "rarity": "稀有",
        "desc": "提升轄區內的經濟繁榮度，減少犯罪事件",
        "motto": "改造一座公園，點亮一盞路燈，城市就有了溫度。",
        "modifiers": {
          "cashGainPct": 20,
          "happinessGainPct": 15,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +20%",
          "快樂收益 +15%",
          "名譽收益 +20%",
          "提升轄區內的經濟繁榮度，減少犯罪事件"
        ],
        "risks": [],
        "narrative": "城市魔術師"
      },
      {
        "title": "鄉鎮推動者",
        "rarity": "稀有",
        "desc": "將沒落鄉鎮升格，獲得更高的行政權限",
        "motto": "我們要讓離鄉背鄉的年輕人，找到回家的路。",
        "modifiers": {
          "cashGainPct": 20,
          "happinessGainPct": 15,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +20%",
          "快樂收益 +15%",
          "名譽收益 +25%",
          "將沒落鄉鎮升格，獲得更高的行政權限"
        ],
        "risks": [],
        "narrative": "地方崛起"
      },
      {
        "title": "公民倡議者",
        "rarity": "稀有",
        "desc": "推動全國性法案成案，影響政策天平",
        "motto": "當百萬人的意志凝聚在一起，連高牆都必須低頭。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 20,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +20%",
          "名譽收益 +25%",
          "推動全國性法案成案，影響政策天平"
        ],
        "risks": [],
        "narrative": "民意狂瀾"
      },
      {
        "title": "政策研究員",
        "rarity": "稀有",
        "desc": "設計的政策藍圖被內閣採納，獲得智庫核心席位",
        "motto": "用數據與邏輯築起國家的骨架，這是幕僚的榮耀。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 5,
          "reputationGainPct": 30
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +5%",
          "名譽收益 +30%",
          "設計的政策藍圖被內閣採納，獲得智庫核心席位"
        ],
        "risks": [],
        "narrative": "國家智庫"
      },
      {
        "title": "公共監督者",
        "rarity": "稀有",
        "desc": "揭發腐敗事件時，獲得海量名譽並免受報復",
        "motto": "我的職責就是盯緊那隻握著公帑的手，不容一絲貪婪。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 10,
          "reputationGainPct": 35
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +10%",
          "名譽收益 +35%",
          "揭發腐敗事件時，獲得海量名譽並免受報復"
        ],
        "risks": [],
        "narrative": "政壇鐵面"
      },
      {
        "title": "社會推動者",
        "rarity": "稀有",
        "desc": "成功推動重大社會福利制度，降低底層貧窮率",
        "motto": "一個社會的文明程度，取決於它如何對待最弱勢的人。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 20,
          "reputationGainPct": 30
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +20%",
          "名譽收益 +30%",
          "成功推動重大社會福利制度，降低底層貧窮率"
        ],
        "risks": [],
        "narrative": "人道關懷"
      },
      {
        "title": "公益實踐家",
        "rarity": "稀有",
        "desc": "創辦全國性基金會，享有極高的社會道德話語權",
        "motto": "用透明與信任，搭起財富與苦難之間的橋樑。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 25,
          "reputationGainPct": 30
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +25%",
          "名譽收益 +30%",
          "創辦全國性基金會，享有極高的社會道德話語權"
        ],
        "risks": [],
        "narrative": "慈善領袖"
      }
    ],
    "3": [
      {
        "title": "地方領袖",
        "rarity": "傳奇",
        "desc": "在地方選舉中具有絕對統治力，必然當選",
        "motto": "在這片土地上，我的名字就是信任的代名詞。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 15,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +15%",
          "名譽收益 +50%",
          "在地方選舉中具有絕對統治力，必然當選"
        ],
        "risks": [],
        "narrative": "諸侯一方"
      },
      {
        "title": "制度改革家",
        "rarity": "傳奇",
        "desc": "徹底重組政府行政流程，免除一切官僚內耗",
        "motto": "砸碎疊床架屋的舊體制，給國家換一顆輕快的引擎。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 10,
          "reputationGainPct": 55
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +10%",
          "名譽收益 +55%",
          "徹底重組政府行政流程，免除一切官僚內耗"
        ],
        "risks": [],
        "narrative": "體制破壞者"
      },
      {
        "title": "時代代言人",
        "rarity": "傳奇",
        "desc": "大眾演說極具煽動性，能瞬間扭轉全國民調",
        "motto": "我站在這裡，代表的不是我自己，而是你們的渴望。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 20,
          "reputationGainPct": 55
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +20%",
          "名譽收益 +55%",
          "大眾演說極具煽動性，能瞬間扭轉全國民調"
        ],
        "risks": [],
        "narrative": "魅力領袖"
      },
      {
        "title": "公共治理家",
        "rarity": "傳奇",
        "desc": "出任核心部會首長，全面主導國家經濟或外交政策",
        "motto": "大國博弈如履薄冰，每一步棋都關乎億萬人的命運。",
        "modifiers": {
          "cashGainPct": 35,
          "happinessGainPct": 15,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +35%",
          "快樂收益 +15%",
          "名譽收益 +50%",
          "出任核心部會首長，全面主導國家經濟或外交政策"
        ],
        "risks": [],
        "narrative": "治國大匠"
      }
    ],
    "4": [
      {
        "title": "民意領袖",
        "rarity": "隱藏",
        "desc": "（命運）獲得全國不分黨派的共同推崇，成為國家精神象徵",
        "motto": "他的一生，就是這座島嶼民主奮鬥的活歷史。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 25,
          "reputationGainPct": 75,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +25%",
          "名譽收益 +75%",
          "（命運）獲得全國不分黨派的共同推崇，成為國家精神象徵"
        ],
        "risks": [],
        "narrative": "萬民愛戴",
        "unlock": {
          "careerCount": 4,
          "age": 35,
          "reputation": 70
        }
      },
      {
        "title": "國家改革者",
        "rarity": "隱藏",
        "desc": "（命運）成功發動全面體制改革，國家進入全新盛世",
        "motto": "當我簽下這份憲法修正案時，我知道歷史記住了這天。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 20,
          "reputationGainPct": 80,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +20%",
          "名譽收益 +80%",
          "（命運）成功發動全面體制改革，國家進入全新盛世"
        ],
        "risks": [],
        "narrative": "一代名相",
        "unlock": {
          "careerCount": 4,
          "age": 40,
          "reputation": 90
        }
      },
      {
        "title": "時代推手",
        "rarity": "隱藏",
        "desc": "（命運）你的政治決策避免了一場毀滅性戰爭，獲得諾貝爾和平獎",
        "motto": "把和平留給子孫，這是我政途生涯最後，也最重的勳章。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 25,
          "reputationGainPct": 80,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +25%",
          "名譽收益 +80%",
          "（命運）你的政治決策避免了一場毀滅性戰爭，獲得諾貝爾和平獎"
        ],
        "risks": [],
        "narrative": "救世慈悲",
        "unlock": {
          "careerCount": 4,
          "age": 55,
          "reputation": 80,
          "happiness": 60
        }
      }
    ]
  },
  "電影明星": {
    "1": [
      {
        "title": "新人演員",
        "rarity": "普通",
        "desc": "試鏡失敗時，快樂值跌幅減少",
        "motto": "台詞只有三句，但我對著鏡子練了整整三個通宵。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +5%",
          "試鏡失敗時，快樂值跌幅減少"
        ],
        "risks": [],
        "narrative": "初登銀幕"
      },
      {
        "title": "群眾演員",
        "rarity": "普通",
        "desc": "在背景中也能發光，有機率被大導演一眼相中",
        "motto": "沒有小角色，只有小演員。在鏡頭邊緣，我也在演繹人生。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 5,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +5%",
          "名譽收益 +5%",
          "在背景中也能發光，有機率被大導演一眼相中"
        ],
        "risks": [],
        "narrative": "龍套之王"
      },
      {
        "title": "配角演員",
        "rarity": "普通",
        "desc": "提升主角演員的演出爆擊率，並獲得名譽分成",
        "motto": "綠葉若是足夠鮮豔，也能襯托出整片森林的春天。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "提升主角演員的演出爆擊率，並獲得名譽分成"
        ],
        "risks": [],
        "narrative": "黃金綠葉"
      },
      {
        "title": "广告模特兒",
        "rarity": "普通",
        "desc": "接演商業廣告時，獲得雙倍的資金回報",
        "motto": "在閃光燈下展現完美的十六齒微笑，這是一場精準的視覺販賣。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "接演商業廣告時，獲得雙倍的資金回報"
        ],
        "risks": [],
        "narrative": "時尚面孔"
      },
      {
        "title": "舞台表演者",
        "rarity": "普通",
        "desc": "現場演出時，能瞬間感染台下所有觀眾",
        "motto": "當大幕升起，呼吸著劇場的塵埃，我知道我屬於舞台。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "現場演出時，能瞬間感染台下所有觀眾"
        ],
        "risks": [],
        "narrative": "靈魂獻給劇場"
      },
      {
        "title": "內容創作者",
        "rarity": "普通",
        "desc": "獨立製作短片時，成本降低 20%",
        "motto": "一台手機，一個劇本，世界就是我的片場。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "獨立製作短片時，成本降低 20%"
        ],
        "risks": [],
        "narrative": "獨立創作"
      },
      {
        "title": "影音剪輯師",
        "rarity": "普通",
        "desc": "後期製作事件中，必定能化腐朽為神奇",
        "motto": "電影是在剪接室裡被第二次發明的，我就是時間的魔法師。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 5,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +5%",
          "名譽收益 +10%",
          "後期製作事件中，必定能化腐朽為神奇"
        ],
        "risks": [],
        "narrative": "幕後剪刀手"
      },
      {
        "title": "社群經營者",
        "rarity": "普通",
        "desc": "社群粉絲增長速度穩定提升",
        "motto": "隔著冰冷的螢幕，我用文字與兩百萬個孤獨的靈魂握手。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "社群粉絲增長速度穩定提升"
        ],
        "risks": [],
        "narrative": "社群達人"
      },
      {
        "title": "影片拍攝者",
        "rarity": "普通",
        "desc": "捕捉畫面能力極佳，大幅提高影片過審機率",
        "motto": "鏡頭是我的眼睛，負責記錄這個時代快要遺忘的淚水。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "捕捉畫面能力極佳，大幅提高影片過審機率"
        ],
        "risks": [],
        "narrative": "紀實之眼"
      },
      {
        "title": "短影音創作者",
        "rarity": "普通",
        "desc": "有機率觸發「病毒式傳播」事件，瞬間獲得百萬流量",
        "motto": "抓緊黃金三秒鐘，在快節奏的時代裡狠狠烙下我的名字。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "有機率觸發「病毒式傳播」事件，瞬間獲得百萬流量"
        ],
        "risks": [],
        "narrative": "流量密碼"
      },
      {
        "title": "直播新秀",
        "rarity": "普通",
        "desc": "直播打賞的金額獲得 20% 加成",
        "motto": "家人們，感謝屏幕前的跑車！今晚我們不醉不歸！",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "直播打賞的金額獲得 20% 加成"
        ],
        "risks": [],
        "narrative": "感謝老鐵"
      },
      {
        "title": "網路分享家",
        "rarity": "普通",
        "desc": "分享日常穿搭或生活，大幅降低自身的「壓力值」",
        "motto": "把生活過成一首詩，然後隨手分享給需要溫暖的人。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 20,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +20%",
          "名譽收益 +5%",
          "分享日常穿搭或生活，大幅降低自身的「壓力值」"
        ],
        "risks": [],
        "narrative": "精緻生活"
      },
      {
        "title": "社群新星",
        "rarity": "普通",
        "desc": "首次獲得廠商贊助，解鎖商業代言功能",
        "motto": "從今天起，我的名字開始具備了可以變現的商業價值。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 15,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +15%",
          "名譽收益 +10%",
          "首次獲得廠商贊助，解鎖商業代言功能"
        ],
        "risks": [],
        "narrative": "潛力股"
      },
      {
        "title": "遊戲實況主",
        "rarity": "普通",
        "desc": "玩遊戲時快樂值極大化，且能吸引特定年輕受眾",
        "motto": "輸贏不重要，重要的是在虛擬世界裡，我們曾並肩作戰。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 20,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +20%",
          "名譽收益 +5%",
          "玩遊戲時快樂值極大化，且能吸引特定年輕受眾"
        ],
        "risks": [],
        "narrative": "歡樂開台"
      },
      {
        "title": "Podcast主持人",
        "rarity": "普通",
        "desc": "聲音極具磁性，深夜節目能安撫人心並換取名譽",
        "motto": "閉上眼睛，在這個寂靜的夜裡，讓我的聲音陪你走一段路。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 15,
          "reputationGainPct": 15
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +15%",
          "名譽收益 +15%",
          "聲音極具磁性，深夜節目能安撫人心並換取名譽"
        ],
        "risks": [],
        "narrative": "溫柔呢喃"
      }
    ],
    "2": [
      {
        "title": "人氣演員",
        "rarity": "稀有",
        "desc": "接演影集時，收視率必定高居不下",
        "motto": "街上的人開始叫得出我角色的名字，這就是最棒的片酬。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 15,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +15%",
          "名譽收益 +25%",
          "接演影集時，收視率必定高居不下"
        ],
        "risks": [],
        "narrative": "家喻戶曉"
      },
      {
        "title": "節目主持人",
        "rarity": "稀有",
        "desc": "主持大型綜藝，擁有操控現場氣氛的絕對權限",
        "motto": "控場是我的天賦，掌聲與笑聲都在我的節拍器裡。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 20,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +20%",
          "名譽收益 +20%",
          "主持大型綜藝，擁有操控現場氣氛的絕對權限"
        ],
        "risks": [],
        "narrative": "綜藝之王"
      },
      {
        "title": "配音演員",
        "rarity": "稀有",
        "desc": "用聲音演繹多個角色，一人可拿多份片酬",
        "motto": "我的臉孔藏在幕後，但我的聲音能讓紙片人有了靈魂。",
        "modifiers": {
          "cashGainPct": 20,
          "happinessGainPct": 10,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +20%",
          "快樂收益 +10%",
          "名譽收益 +25%",
          "用聲音演繹多個角色，一人可拿多份片酬"
        ],
        "risks": [],
        "narrative": "怪物聲優"
      },
      {
        "title": "個人自媒體",
        "rarity": "稀有",
        "desc": "不依賴經紀公司，所有的利潤完全不被抽成",
        "motto": "我自己就是公司，自己就是品牌，不再聽從任何資本的擺佈。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 20,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +20%",
          "名譽收益 +20%",
          "不依賴經紀公司，所有的利潤完全不被抽成"
        ],
        "risks": [],
        "narrative": "絕對自由"
      },
      {
        "title": "百萬觀看創作者",
        "rarity": "稀有",
        "desc": "發布的每支影片必定登上熱門發燒榜",
        "motto": "百萬觀看只是數字，背後是百萬次靈魂的短暫停留。",
        "modifiers": {
          "cashGainPct": 35,
          "happinessGainPct": 15,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +35%",
          "快樂收益 +15%",
          "名譽收益 +20%",
          "發布的每支影片必定登上熱門發燒榜"
        ],
        "risks": [],
        "narrative": "頂流創作者"
      },
      {
        "title": "獨立製片人",
        "rarity": "稀有",
        "desc": "完全掌控電影的最終剪輯權與藝術走向",
        "motto": "我不要資本的指手畫腳，我要拍出真正純粹的電影。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 10,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +10%",
          "名譽收益 +25%",
          "完全掌控電影的最終剪輯權與藝術走向"
        ],
        "risks": [],
        "narrative": "藝術堅持"
      },
      {
        "title": "網路紅人",
        "rarity": "稀有",
        "desc": "一言一行皆能引發時尚潮流，帶貨能力極強",
        "motto": "衣服穿在我身上，它就不是一件衣服，它叫作潮流趨勢。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 20,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +20%",
          "名譽收益 +25%",
          "一言一行皆能引發時尚潮流，帶貨能力極強"
        ],
        "risks": [],
        "narrative": "時尚風向球"
      },
      {
        "title": "人氣直播主",
        "rarity": "稀有",
        "desc": "單場直播電商成交額破千萬，獲得高額分潤",
        "motto": "三、二、一，上連結！今晚我們再次刷新了行業紀錄。",
        "modifiers": {
          "cashGainPct": 35,
          "happinessGainPct": 20,
          "reputationGainPct": 15
        },
        "effects": [
          "金錢收益 +35%",
          "快樂收益 +20%",
          "名譽收益 +15%",
          "單場直播電商成交額破千萬，獲得高額分潤"
        ],
        "risks": [],
        "narrative": "帶貨女王"
      }
    ],
    "3": [
      {
        "title": "超人氣演員",
        "rarity": "傳奇",
        "desc": "不論劇本好壞，票房基本盤皆能完美保底",
        "motto": "只要海報上有我的名字，觀眾就會心甘情願地排隊買票。",
        "modifiers": {
          "cashGainPct": 40,
          "happinessGainPct": 20,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +40%",
          "快樂收益 +20%",
          "名譽收益 +50%",
          "不論劇本好壞，票房基本盤皆能完美保底"
        ],
        "risks": [],
        "narrative": "票房靈丹"
      },
      {
        "title": "傳奇導演",
        "rarity": "傳奇",
        "desc": "作品獲得國際三大影展肯定的機率極高",
        "motto": "電影是每秒二十四格的真理。我用光影，在黑暗中雕刻時間。",
        "modifiers": {
          "cashGainPct": 45,
          "happinessGainPct": 15,
          "reputationGainPct": 55
        },
        "effects": [
          "金錢收益 +45%",
          "快樂收益 +15%",
          "名譽收益 +55%",
          "作品獲得國際三大影展肯定的機率極高"
        ],
        "risks": [],
        "narrative": "光影大師"
      },
      {
        "title": "時代代言人",
        "rarity": "傳奇",
        "desc": "成為全球頂奢品牌終身代言人，財富與名譽鎖定",
        "motto": "美會隨歲月流逝，但風格永存。而我，定義了這個時代的風格。",
        "modifiers": {
          "cashGainPct": 35,
          "happinessGainPct": 20,
          "reputationGainPct": 55
        },
        "effects": [
          "金錢收益 +35%",
          "快樂收益 +20%",
          "名譽收益 +55%",
          "成為全球頂奢品牌終身代言人，財富與名譽鎖定"
        ],
        "risks": [],
        "narrative": "人間絕色"
      },
      {
        "title": "娛樂領航員",
        "rarity": "傳奇",
        "desc": "創辦跨國娛樂帝國，掌握娛樂圈半數藝人的生殺大權",
        "motto": "偶像是我批量製造的商品，流量是我股掌間的玩物。",
        "modifiers": {
          "cashGainPct": 50,
          "happinessGainPct": 15,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +50%",
          "快樂收益 +15%",
          "名譽收益 +50%",
          "創辦跨國娛樂帝國，掌握娛樂圈半數藝人的生殺大權"
        ],
        "risks": [],
        "narrative": "傳媒大亨"
      }
    ],
    "4": [
      {
        "title": "國際巨星",
        "rarity": "隱藏",
        "desc": "（命運）在好萊塢星光大道留下手印，全球粉絲無數",
        "motto": "無論在東京、巴黎還是紐約，我的名字都不需要翻譯。",
        "modifiers": {
          "cashGainPct": 55,
          "happinessGainPct": 25,
          "reputationGainPct": 75,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +55%",
          "快樂收益 +25%",
          "名譽收益 +75%",
          "（命運）在好萊塢星光大道留下手印，全球粉絲無數"
        ],
        "risks": [],
        "narrative": "巨星永恆",
        "unlock": {
          "careerCount": 4,
          "age": 35,
          "reputation": 85
        }
      },
      {
        "title": "影壇傳奇",
        "rarity": "隱藏",
        "desc": "（命運）獲得終身成就獎，被寫入世界電影史教科書",
        "motto": "水銀燈熄滅了，膠捲拉到了盡頭，但我已在銀幕上獲得了永生。",
        "modifiers": {
          "cashGainPct": 50,
          "happinessGainPct": 25,
          "reputationGainPct": 80,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +50%",
          "快樂收益 +25%",
          "名譽收益 +80%",
          "（命運）獲得終身成就獎，被寫入世界電影史教科書"
        ],
        "risks": [],
        "narrative": "不朽傳奇",
        "unlock": {
          "careerCount": 4,
          "age": 50,
          "reputation": 90
        }
      },
      {
        "title": "時代偶像",
        "rarity": "隱藏",
        "desc": "（命運）你成為一代人的集體青春記憶，老去時依然受到全民呵護",
        "motto": "多年以後，他們看著我眼角的皺紋，依然會想起青春的模樣。",
        "modifiers": {
          "cashGainPct": 45,
          "happinessGainPct": 30,
          "reputationGainPct": 75,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +45%",
          "快樂收益 +30%",
          "名譽收益 +75%",
          "（命運）你成為一代人的集體青春記憶，老去時依然受到全民呵護"
        ],
        "risks": [],
        "narrative": "永恆的白月光",
        "unlock": {
          "careerCount": 4,
          "age": 45,
          "reputation": 80,
          "happiness": 70
        }
      }
    ]
  },
  "航海": {
    "1": [
      {
        "title": "見習水手",
        "rarity": "普通",
        "desc": "出海時免受暈船等負面健康狀態干擾",
        "motto": "海水很鹹，甲板很硬，但這就是男兒的起點。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +5%",
          "出海時免受暈船等負面健康狀態干擾"
        ],
        "risks": [],
        "narrative": "初次出海"
      },
      {
        "title": "甲板雜工",
        "rarity": "普通",
        "desc": "清洗甲板時，有機率撿到隨浪漂來的漂流瓶（地圖碎片）",
        "motto": "擦乾淨每一寸木板，海風會帶走所有的疲憊。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 5,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +5%",
          "名譽收益 +5%",
          "清洗甲板時，有機率撿到隨浪漂來的漂流瓶（地圖碎片）"
        ],
        "risks": [],
        "narrative": "踏實苦幹"
      },
      {
        "title": "瞭望員",
        "rarity": "普通",
        "desc": "提前兩回合預警前方的礁石或海盜船",
        "motto": "在桅杆的最高處，我是整艘船最先看到黎明的人。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "提前兩回合預警前方的礁石或海盜船"
        ],
        "risks": [],
        "narrative": "千里的眼"
      },
      {
        "title": "操舵手",
        "rarity": "普通",
        "desc": "暴風雨中船隻受損率降低 20%",
        "motto": "舵盤在我的掌心，海浪再大，也休想讓我偏離航線一度。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "暴風雨中船隻受損率降低 20%"
        ],
        "risks": [],
        "narrative": "穩定航向"
      },
      {
        "title": "補網工",
        "rarity": "普通",
        "desc": "捕魚事件中的漁獲量提升 15%",
        "motto": "把網補得結結實實，明天大海就會裝滿我們的艙底。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "捕魚事件中的漁獲量提升 15%"
        ],
        "risks": [],
        "narrative": "後勤保障"
      },
      {
        "title": "桶匠",
        "rarity": "普通",
        "desc": "淡水與食物的保存期限延長二個回合",
        "motto": "我造的木桶滴水不漏，它是我們在海上的生命保險。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "淡水與食物的保存期限延長二個回合"
        ],
        "risks": [],
        "narrative": "淡水守護者"
      },
      {
        "title": "船務侍從",
        "rarity": "普通",
        "desc": "提升船長與高級幹部對你的好感度",
        "motto": "擦亮船長的銀器，聽他們聊著那些老掉牙的冒險故事。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 15
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +15%",
          "提升船長與高級幹部對你的好感度"
        ],
        "risks": [],
        "narrative": "善解人意"
      },
      {
        "title": "划手",
        "rarity": "普通",
        "desc": "逆風航行時，船隻前進速度不變",
        "motto": "雙手磨出老繭，汗水滴入木板，我們是戰艦的底層心臟。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +5%",
          "逆風航行時，船隻前進速度不變"
        ],
        "risks": [],
        "narrative": "鋼鐵意志"
      },
      {
        "title": "資深水手",
        "rarity": "普通",
        "desc": "在登船白刃戰中，戰鬥力大幅提升",
        "motto": "老手從不畏懼風浪，更不畏懼冰冷的鋼刀。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "在登船白刃戰中，戰鬥力大幅提升"
        ],
        "risks": [],
        "narrative": "身經百戰"
      },
      {
        "title": "火砲裝填手",
        "rarity": "普通",
        "desc": "海戰時火砲冷卻時間縮短一回合",
        "motto": "火藥的味道讓人瘋狂，點火，把敵艦送進海底！",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 5,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +5%",
          "名譽收益 +5%",
          "海戰時火砲冷卻時間縮短一回合"
        ],
        "risks": [],
        "narrative": "硝煙洗禮"
      },
      {
        "title": "鐵匠助手",
        "rarity": "普通",
        "desc": "修補船隻錨鍊與裝甲的費用減半",
        "motto": "熔爐的火永不熄滅，鐵錘落下，我們重塑船隻的骨骼。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "修補船隻錨鍊與裝甲的費用減半"
        ],
        "risks": [],
        "narrative": "匠人精神"
      },
      {
        "title": "木匠助理",
        "rarity": "普通",
        "desc": "船體受損後，可在海面上進行緊急維修",
        "motto": "只要手裡還有木板與釘子，這艘船就永遠不會沉沒。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "船體受損後，可在海面上進行緊急維修"
        ],
        "risks": [],
        "narrative": "戰地維修"
      },
      {
        "title": "艙庫看守",
        "rarity": "普通",
        "desc": "船上貨物遭遇老鼠或潮濕霉變的機率降為零",
        "motto": "鎖匙在我的腰間，艙底的每一箱香料，都跟我的命一樣重。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 5,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +5%",
          "名譽收益 +5%",
          "船上貨物遭遇老鼠或潮濕霉變的機率降為零"
        ],
        "risks": [],
        "narrative": "守財之犬"
      },
      {
        "title": "夜巡員",
        "rarity": "普通",
        "desc": "防止遭遇夜間海盜偷襲或水手密謀叛變",
        "motto": "提著油燈走過黑暗的走廊，整艘船的夢境由我守護。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "防止遭遇夜間海盜偷襲或水手密謀叛變"
        ],
        "risks": [],
        "narrative": "黑夜之眼"
      },
      {
        "title": "隨船醫護",
        "rarity": "普通",
        "desc": "船員因壞血病或傳染病死亡的機率降低 50%",
        "motto": "在沒有陸地的汪洋上，我用朗姆酒與手術刀跟死神搶人。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 15,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +15%",
          "名譽收益 +10%",
          "船員因壞血病或傳染病死亡的機率降低 50%"
        ],
        "risks": [],
        "narrative": "海上天使"
      }
    ],
    "2": [
      {
        "title": "水手長",
        "rarity": "稀有",
        "desc": "執行船長命令時，水手叛變機率降為零",
        "motto": "當我的皮鞭與怒吼響起，哪怕是地獄，這幫惡棍也得跟著我衝。",
        "modifiers": {
          "cashGainPct": 20,
          "happinessGainPct": 15,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +20%",
          "快樂收益 +15%",
          "名譽收益 +20%",
          "執行船長命令時，水手叛變機率降為零"
        ],
        "risks": [],
        "narrative": "鐵血紀律"
      },
      {
        "title": "大副",
        "rarity": "稀有",
        "desc": "當船長失蹤或死亡時，能無縫接管指揮權且不降士氣",
        "motto": "我是船長的影子，也是這艘船最冷靜的副大腦。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 10,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +10%",
          "名譽收益 +20%",
          "當船長失蹤或死亡時，能無縫接管指揮權且不降士氣"
        ],
        "risks": [],
        "narrative": "二把手"
      },
      {
        "title": "首席領航員",
        "rarity": "稀有",
        "desc": "即使在無星的黑夜或濃霧中，也絕不迷失方向",
        "motto": "海圖畫在我的腦海裡，星辰退去，洋流也會帶我回家。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 10,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +10%",
          "名譽收益 +25%",
          "即使在無星的黑夜或濃霧中，也絕不迷失方向"
        ],
        "risks": [],
        "narrative": "活羅盤"
      },
      {
        "title": "隨船軍醫",
        "rarity": "稀有",
        "desc": "完美治癒高級幹部的重傷，獲得終身忠誠",
        "motto": "截肢需要三秒，止血需要一針。活下去，你就能看到陸地。",
        "modifiers": {
          "cashGainPct": 20,
          "happinessGainPct": 20,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +20%",
          "快樂收益 +20%",
          "名譽收益 +25%",
          "完美治癒高級幹部的重傷，獲得終身忠誠"
        ],
        "risks": [],
        "narrative": "神醫妙手"
      },
      {
        "title": "首席砲術長",
        "rarity": "稀有",
        "desc": "海戰時齊射爆擊率大幅提升，可瞬間擊沉敵艦",
        "motto": "算好提前量與波浪起伏，放！讓大海吞噬他們！",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 5,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +5%",
          "名譽收益 +25%",
          "海戰時齊射爆擊率大幅提升，可瞬間擊沉敵艦"
        ],
        "risks": [],
        "narrative": "毀滅火力"
      },
      {
        "title": "船團補給官",
        "rarity": "稀有",
        "desc": "在各大港口買賣補給品的價差利潤翻倍",
        "motto": "低價買進淡水，高價賣出絲綢。商路就是我的提款機。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 10,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +10%",
          "名譽收益 +20%",
          "在各大港口買賣補給品的價差利潤翻倍"
        ],
        "risks": [],
        "narrative": "商戰奇才"
      },
      {
        "title": "行船木匠",
        "rarity": "稀有",
        "desc": "可對船隻進行魔改，提升極速與防禦上限",
        "motto": "給我足夠的橡木，我能把一艘走私船改成無敵戰艦。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 15,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +15%",
          "名譽收益 +20%",
          "可對船隻進行魔改，提升極速與防禦上限"
        ],
        "risks": [],
        "narrative": "造船大師"
      },
      {
        "title": "軍械官",
        "rarity": "稀有",
        "desc": "船員的遠程武器威力提升 15%",
        "motto": "槍支擦拭乾淨，彈藥保持乾燥，勝利屬於準備充分的人。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 10,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +10%",
          "名譽收益 +25%",
          "船員的遠程武器威力提升 15%"
        ],
        "risks": [],
        "narrative": "軍火庫管家"
      }
    ],
    "3": [
      {
        "title": "傳奇船長",
        "rarity": "傳奇",
        "desc": "旗幟升起時，周圍敵艦士氣瞬間崩潰",
        "motto": "風暴聽我號令，大海是我的座駕。升起骷髏旗！",
        "modifiers": {
          "cashGainPct": 40,
          "happinessGainPct": 20,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +40%",
          "快樂收益 +20%",
          "名譽收益 +50%",
          "旗幟升起時，周圍敵艦士氣瞬間崩潰"
        ],
        "risks": [],
        "narrative": "海上霸主"
      },
      {
        "title": "私掠總督",
        "rarity": "傳奇",
        "desc": "獲得帝國官方背書，劫掠敵國商船視為合法且不扣名譽",
        "motto": "奉女皇之命合法搶劫，我是紳士，也是惡棍。",
        "modifiers": {
          "cashGainPct": 45,
          "happinessGainPct": 15,
          "reputationGainPct": 45
        },
        "effects": [
          "金錢收益 +45%",
          "快樂收益 +15%",
          "名譽收益 +45%",
          "獲得帝國官方背書，劫掠敵國商船視為合法且不扣名譽"
        ],
        "risks": [],
        "narrative": "皇家海盜"
      },
      {
        "title": "風暴引導者",
        "rarity": "傳奇",
        "desc": "能主動駛入暴風雨以甩掉追兵，且船隻不受損",
        "motto": "凡人畏懼瘋狂的巨浪，而我，在巨浪的刀尖上跳舞。",
        "modifiers": {
          "cashGainPct": 40,
          "happinessGainPct": 20,
          "reputationGainPct": 55
        },
        "effects": [
          "金錢收益 +40%",
          "快樂收益 +20%",
          "名譽收益 +55%",
          "能主動駛入暴風雨以甩掉追兵，且船隻不受損"
        ],
        "risks": [],
        "narrative": "征服自然"
      },
      {
        "title": "深海獵手",
        "rarity": "傳奇",
        "desc": "成功捕獲傳說中海怪（如北海巨妖），獲得神話級素材",
        "motto": "海怪的觸手成了我的戰利品，大海深處再無秘密。",
        "modifiers": {
          "cashGainPct": 45,
          "happinessGainPct": 15,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +45%",
          "快樂收益 +15%",
          "名譽收益 +50%",
          "成功捕獲傳說中海怪（如北海巨妖），獲得神話級素材"
        ],
        "risks": [],
        "narrative": "弒神之刃"
      }
    ],
    "4": [
      {
        "title": "七海霸主",
        "rarity": "隱藏",
        "desc": "（命運）統治所有海域，各大帝國海軍見到你的旗幟必須鳴炮致敬",
        "motto": "從日出之海到日落之處，七大洋皆冠以我之姓氏。",
        "modifiers": {
          "cashGainPct": 55,
          "happinessGainPct": 25,
          "reputationGainPct": 75,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +55%",
          "快樂收益 +25%",
          "名譽收益 +75%",
          "（命運）統治所有海域，各大帝國海軍見到你的旗幟必須鳴炮致敬"
        ],
        "risks": [],
        "narrative": "至高王座",
        "unlock": {
          "careerCount": 4,
          "age": 55,
          "reputation": 80
        }
      },
      {
        "title": "幽靈船首",
        "rarity": "隱藏",
        "desc": "（命運）死後靈魂與不沉之艦融合，永遠航行在傳說的迷霧中",
        "motto": "肉體沉入海底，但我和這艘船將永生於水手的噩夢與傳奇中。",
        "modifiers": {
          "cashGainPct": 50,
          "happinessGainPct": 25,
          "reputationGainPct": 80,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +50%",
          "快樂收益 +25%",
          "名譽收益 +80%",
          "（命運）死後靈魂與不沉之艦融合，永遠航行在傳說的迷霧中"
        ],
        "risks": [],
        "narrative": "不散之魂",
        "unlock": {
          "careerCount": 4,
          "age": 60,
          "happiness": 50
        }
      },
      {
        "title": "破界拓荒者",
        "rarity": "隱藏",
        "desc": "（命運）穿過世界盡頭的瀑布，發現了通往新世界的全新航道",
        "motto": "地圖在這裡畫上了句點，但我的航程，才剛剛開始。",
        "modifiers": {
          "cashGainPct": 45,
          "happinessGainPct": 30,
          "reputationGainPct": 75,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +45%",
          "快樂收益 +30%",
          "名譽收益 +75%",
          "（命運）穿過世界盡頭的瀑布，發現了通往新世界的全新航道"
        ],
        "risks": [],
        "narrative": "超越神話",
        "unlock": {
          "careerCount": 4,
          "age": 50,
          "reputation": 90
        }
      }
    ]
  },
  "月球探險": {
    "1": [
      {
        "title": "見習宇航員",
        "rarity": "普通",
        "desc": "在低重力環境下移動時，免除摔傷等負面意外",
        "motto": "踩在月球塵埃上的第一步，輕飄飄的，像個不真實的夢。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +5%",
          "在低重力環境下移動時，免除摔傷等負面意外"
        ],
        "risks": [],
        "narrative": "太空第一步"
      },
      {
        "title": "艙區清潔員",
        "rarity": "普通",
        "desc": "微重力垃圾處理效率極高，有機率回收廢棄高科技零件",
        "motto": "在封閉的太空艙裡，乾淨的空氣與無菌的環境比金子還貴。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "微重力垃圾處理效率極高，有機率回收廢棄高科技零件"
        ],
        "risks": [],
        "narrative": "太空清道夫"
      },
      {
        "title": "維護技工",
        "rarity": "普通",
        "desc": "基地氣閘或管道洩漏事件的修復速度提升 30%",
        "motto": "這顆螺絲鬆了，我們全艙的人都得去見上帝。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 5,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +5%",
          "名譽收益 +5%",
          "基地氣閘或管道洩漏事件的修復速度提升 30%"
        ],
        "risks": [],
        "narrative": "生命守護者"
      },
      {
        "title": "物資盤點員",
        "rarity": "普通",
        "desc": "精準控管合成食物與氧氣罐，消耗速度降低 10%",
        "motto": "卡路里、水、氧氣。在月球，這三個數字決定你的死期。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "精準控管合成食物與氧氣罐，消耗速度降低 10%"
        ],
        "risks": [],
        "narrative": "生存會計"
      },
      {
        "title": "通訊接線生",
        "rarity": "普通",
        "desc": "與地球總部通訊時，信號干擾機率降為零",
        "motto": "穿過三十八萬公里的電波，那是來自故鄉地星的呢喃。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "與地球總部通訊時，信號干擾機率降為零"
        ],
        "risks": [],
        "narrative": "宇宙調頻"
      },
      {
        "title": "生保監控員",
        "rarity": "普通",
        "desc": "隊友的精神壓力值上升速度減緩",
        "motto": "看著螢幕上的心跳頻率，我要確保每個人都活得像個正常人。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "隊友的精神壓力值上升速度減緩"
        ],
        "risks": [],
        "narrative": "心靈監測"
      },
      {
        "title": "無人機操縱手",
        "rarity": "普通",
        "desc": "探測未知月面陰影區時，免除設備失聯風險",
        "motto": "我的視線透過遙控鏡頭，延伸到那些數十億年未見陽光的深谷。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 5,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +5%",
          "名譽收益 +5%",
          "探測未知月面陰影區時，免除設備失聯風險"
        ],
        "risks": [],
        "narrative": "遠程之眼"
      },
      {
        "title": "採掘礦工",
        "rarity": "普通",
        "desc": "採集氦-3等稀有太空能源的產量提升 20%",
        "motto": "每一鎬下去，敲碎的都是能點亮地球一整座城市的能量。",
        "modifiers": {
          "cashGainPct": 15,
          "happinessGainPct": 5,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +15%",
          "快樂收益 +5%",
          "名譽收益 +5%",
          "採集氦-3等稀有太空能源的產量提升 20%"
        ],
        "risks": [],
        "narrative": "星際淘金"
      },
      {
        "title": "重力適應員",
        "rarity": "普通",
        "desc": "從地球到月球的轉換期不需消耗適應回合",
        "motto": "我的骨骼習慣了輕盈，血液學會了在失重中奔流。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "從地球到月球的轉換期不需消耗適應回合"
        ],
        "risks": [],
        "narrative": "超越引力"
      },
      {
        "title": "初級觀測員",
        "rarity": "普通",
        "desc": "發現小行星撞擊預警的機率提高",
        "motto": "望遠鏡裡的一粒微塵，可能就是毀滅月球基地的隕石。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "發現小行星撞擊預警的機率提高"
        ],
        "risks": [],
        "narrative": "星空守望"
      },
      {
        "title": "外殼焊接工",
        "rarity": "普通",
        "desc": "遭遇微隕石撞擊後，艙外太空漫步維修效率加倍",
        "motto": "隔著薄薄的防護服，背後是零下一百八十度的虛無深淵。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "遭遇微隕石撞擊後，艙外太空漫步維修效率加倍"
        ],
        "risks": [],
        "narrative": "生死線焊接"
      },
      {
        "title": "溫室培育員",
        "rarity": "普通",
        "desc": "月面基地培植出新鮮蔬菜的成功率提高",
        "motto": "在灰白的月壤中開出第一朵土豆花，這是地球生命的頑強。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "月面基地培植出新鮮蔬菜的成功率提高"
        ],
        "risks": [],
        "narrative": "月面農夫"
      },
      {
        "title": "資料速記員",
        "rarity": "普通",
        "desc": "記錄科學實驗數據時，免除一切人為誤差",
        "motto": "將星空的每一次脈衝、每一次輻射，化為冰冷而神聖的代碼。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "記錄科學實驗數據時，免除一切人為誤差"
        ],
        "risks": [],
        "narrative": "宇宙書記"
      },
      {
        "title": "艙門安全衛士",
        "rarity": "普通",
        "desc": "在減壓或氣壓艙緊急事件中，能保全全艙人員安全",
        "motto": "守住這道閘門，就是守住生命與地獄之間唯一的防線。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "在減壓或氣壓艙緊急事件中，能保全全艙人員安全"
        ],
        "risks": [],
        "narrative": "鋼鐵之門"
      },
      {
        "title": "隨艦護理師",
        "rarity": "普通",
        "desc": "治癒「宇宙射線輻射病」的成功率大幅提升",
        "motto": "用抗輻射劑與溫柔的安慰，撫平太空人在群星間的孤獨恐懼。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 15,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +15%",
          "名譽收益 +10%",
          "治癒「宇宙射線輻射病」的成功率大幅提升"
        ],
        "risks": [],
        "narrative": "星海守護"
      }
    ],
    "2": [
      {
        "title": "首席工程師",
        "rarity": "稀有",
        "desc": "解鎖月面基地的升級藍圖，基地防禦與產能極大化",
        "motto": "只要給我足夠的鈦合金，我能在月球背面蓋起一座城市。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 10,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +10%",
          "名譽收益 +20%",
          "解鎖月面基地的升級藍圖，基地防禦與產能極大化"
        ],
        "risks": [],
        "narrative": "基地造物主"
      },
      {
        "title": "星際領航員",
        "rarity": "稀有",
        "desc": "計算地月轉移軌道時，燃料消耗降低 30%",
        "motto": "宇宙不是混亂的，它是由精密的引力幾何學編織而成的網。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 10,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +10%",
          "名譽收益 +25%",
          "計算地月轉移軌道時，燃料消耗降低 30%"
        ],
        "risks": [],
        "narrative": "軌道巫師"
      },
      {
        "title": "軌道計算師",
        "rarity": "稀有",
        "desc": "能精準預測日冕拋射（太陽風暴）的精確時間",
        "motto": "算錯一個小數點，整條飛船就會在太陽的怒火中蒸發。",
        "modifiers": {
          "cashGainPct": 35,
          "happinessGainPct": 5,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +35%",
          "快樂收益 +5%",
          "名譽收益 +20%",
          "能精準預測日冕拋射（太陽風暴）的精確時間"
        ],
        "risks": [],
        "narrative": "數字先知"
      },
      {
        "title": "外星生態學家",
        "rarity": "稀有",
        "desc": "研究月球古老冰層時，有機率發現地外微生命痕跡",
        "motto": "生命是宇宙的本能，即使在最荒涼的死星，它也在低語。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 15,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +15%",
          "名譽收益 +25%",
          "研究月球古老冰層時，有機率發現地外微生命痕跡"
        ],
        "risks": [],
        "narrative": "生命尋覓者"
      },
      {
        "title": "隨艦御醫",
        "rarity": "稀有",
        "desc": "完美執行低重力開顱或心臟手術，全隊生存率暴增",
        "motto": "在太空中，噴濺的血液不會往下流，我的手必須比激光更穩。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 20,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +20%",
          "名譽收益 +25%",
          "完美執行低重力開顱或心臟手術，全隊生存率暴增"
        ],
        "risks": [],
        "narrative": "星海神醫"
      },
      {
        "title": "星艦大副",
        "rarity": "稀有",
        "desc": "當遭遇宇宙未知異象時，能強行穩定船員混亂狀態",
        "motto": "直面虛無吧，諸位！我們是人類探向黑暗的最前鋒。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 15,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +15%",
          "名譽收益 +20%",
          "當遭遇宇宙未知異象時，能強行穩定船員混亂狀態"
        ],
        "risks": [],
        "narrative": "鋼鐵心智"
      },
      {
        "title": "安全戰術官",
        "rarity": "稀有",
        "desc": "在應對外星未知威脅或基地叛亂事件時，勝率提高 40%",
        "motto": "不論是宇宙輻射還是人心異變，我的槍口永遠保持冰冷。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 10,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +10%",
          "名譽收益 +25%",
          "在應對外星未知威脅或基地叛亂事件時，勝率提高 40%"
        ],
        "risks": [],
        "narrative": "星際衛士"
      },
      {
        "title": "資源協調官",
        "rarity": "稀有",
        "desc": "地月貿易事件中，物資兌換利潤提升 30%",
        "motto": "把月球的礦產高價倒回地球，再把地球的水源低價運來。",
        "modifiers": {
          "cashGainPct": 35,
          "happinessGainPct": 10,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +35%",
          "快樂收益 +10%",
          "名譽收益 +20%",
          "地月貿易事件中，物資兌換利潤提升 30%"
        ],
        "risks": [],
        "narrative": "星際倒爺"
      }
    ],
    "3": [
      {
        "title": "探險隊星艦船長",
        "rarity": "傳奇",
        "desc": "指揮深空探索任務時，必定發現全新資源星球",
        "motto": "我的目標不是月球，月球只是我們駛向無盡深空的港口。",
        "modifiers": {
          "cashGainPct": 45,
          "happinessGainPct": 20,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +45%",
          "快樂收益 +20%",
          "名譽收益 +50%",
          "指揮深空探索任務時，必定發現全新資源星球"
        ],
        "risks": [],
        "narrative": "星艦指揮官"
      },
      {
        "title": "先鋒拓荒者",
        "rarity": "傳奇",
        "desc": "親手建立人類第一個自給自足的永久月面都市",
        "motto": "我們在這裡點燃了第一盞不滅的燈火，此處從此叫作第二故鄉。",
        "modifiers": {
          "cashGainPct": 45,
          "happinessGainPct": 15,
          "reputationGainPct": 55
        },
        "effects": [
          "金錢收益 +45%",
          "快樂收益 +15%",
          "名譽收益 +55%",
          "親手建立人類第一個自給自足的永久月面都市"
        ],
        "risks": [],
        "narrative": "新世界之父"
      },
      {
        "title": "深空獵星手",
        "rarity": "傳奇",
        "desc": "捕獲富含稀有金屬的近地小行星，財富獲得天文數字級加成",
        "motto": "套索已經拋出，那顆價值連城的小行星，現在歸我們了。",
        "modifiers": {
          "cashGainPct": 55,
          "happinessGainPct": 10,
          "reputationGainPct": 45
        },
        "effects": [
          "金錢收益 +55%",
          "快樂收益 +10%",
          "名譽收益 +45%",
          "捕獲富含稀有金屬的近地小行星，財富獲得天文數字級加成"
        ],
        "risks": [],
        "narrative": "行星捕手"
      },
      {
        "title": "異星遭遇特使",
        "rarity": "傳奇",
        "desc": "在遭遇地外未知文明信號時，獲得絕對的外交豁免權",
        "motto": "我們帶著和平而來，如果可以，我們希望能共享這片星空。",
        "modifiers": {
          "cashGainPct": 40,
          "happinessGainPct": 20,
          "reputationGainPct": 55
        },
        "effects": [
          "金錢收益 +40%",
          "快樂收益 +20%",
          "名譽收益 +55%",
          "在遭遇地外未知文明信號時，獲得絕對的外交豁免權"
        ],
        "risks": [],
        "narrative": "第三類接觸"
      }
    ],
    "4": [
      {
        "title": "銀河開拓總督",
        "rarity": "隱藏",
        "desc": "（命運）代表人類行使對整個月球與近地軌道的最高統治權",
        "motto": "地星在夜空中閃爍，而我，是執掌這片銀白王座的最高總督。",
        "modifiers": {
          "cashGainPct": 55,
          "happinessGainPct": 25,
          "reputationGainPct": 75,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +55%",
          "快樂收益 +25%",
          "名譽收益 +75%",
          "（命運）代表人類行使對整個月球與近地軌道的最高統治權"
        ],
        "risks": [],
        "narrative": "星海主宰",
        "unlock": {
          "careerCount": 4,
          "age": 55,
          "wealth": 80,
          "reputation": 80
        }
      },
      {
        "title": "黑洞穿越者",
        "rarity": "隱藏",
        "desc": "（命運）自願駛入黑洞事件視界，將高維度物理數據傳回地球",
        "motto": "我越過了時間的終點。這裡很美，告訴我的女兒，我愛她。",
        "modifiers": {
          "cashGainPct": 50,
          "happinessGainPct": 20,
          "reputationGainPct": 85,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +50%",
          "快樂收益 +20%",
          "名譽收益 +85%",
          "（命運）自願駛入黑洞事件視界，將高維度物理數據傳回地球"
        ],
        "risks": [],
        "narrative": "超越維度",
        "unlock": {
          "careerCount": 4,
          "age": 60,
          "happiness": 70
        }
      },
      {
        "title": "星系播種者",
        "rarity": "隱藏",
        "desc": "（命運）帶著人類最後的基因庫駛向室女座超星系團，延續文明",
        "motto": "地球或許會毀滅，但我們的種子，將在百萬光年外重新發芽。",
        "modifiers": {
          "cashGainPct": 45,
          "happinessGainPct": 30,
          "reputationGainPct": 75,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +45%",
          "快樂收益 +30%",
          "名譽收益 +75%",
          "（命運）帶著人類最後的基因庫駛向室女座超星系團，延續文明"
        ],
        "risks": [],
        "narrative": "火種永存",
        "unlock": {
          "careerCount": 4,
          "age": 65,
          "reputation": 90
        }
      }
    ]
  },
  "開礦": {
    "1": [
      {
        "title": "礦場學徒",
        "rarity": "普通",
        "desc": "發生礦坑塌方事件時，受傷機率降低 50%",
        "motto": "師父說，下井前先拜拜地頭蛇，眼睛要亮，耳朵要靈。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +5%",
          "發生礦坑塌方事件時，受傷機率降低 50%"
        ],
        "risks": [],
        "narrative": "坑道新手"
      },
      {
        "title": "礦坑搬運工",
        "rarity": "普通",
        "desc": "體力消耗速度減緩，體魄屬性增長速度加快",
        "motto": "背上的礦石很重，壓彎了脊樑，但能換來家裡的米糧。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +5%",
          "體力消耗速度減緩，體魄屬性增長速度加快"
        ],
        "risks": [],
        "narrative": "出賣勞力"
      },
      {
        "title": "礦石分揀員",
        "rarity": "普通",
        "desc": "在廢石堆中有機率驚喜篩選出高純度寶石",
        "motto": "亮晶晶的不一定是金子，但我的眼睛絕不會漏掉真傢伙。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "在廢石堆中有機率驚喜篩選出高純度寶石"
        ],
        "risks": [],
        "narrative": "火眼金睛"
      },
      {
        "title": "鑿岩工",
        "rarity": "普通",
        "desc": "單回合破岩進度提升 25%",
        "motto": "風鎬的震動震得骨頭發麻，但看著岩壁崩塌，真的很爽。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 5,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +5%",
          "名譽收益 +5%",
          "單回合破岩進度提升 25%"
        ],
        "risks": [],
        "narrative": "粉碎障礙"
      },
      {
        "title": "礦燈守護員",
        "rarity": "普通",
        "desc": "在黑暗坑道中，全隊免受「恐黑症」精神懲罰",
        "motto": "只要這盞燈還亮著，回家的路就沒被堵死。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "在黑暗坑道中，全隊免受「恐黑症」精神懲罰"
        ],
        "risks": [],
        "narrative": "黑暗微光"
      },
      {
        "title": "地質觀察員",
        "rarity": "普通",
        "desc": "提前一回合預測透水、瓦斯突出等礦難預兆",
        "motto": "岩層在哭泣，空氣的味道變了，快撤！要塌了！",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 10,
          "reputationGainPct": 10
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +10%",
          "名譽收益 +10%",
          "提前一回合預測透水、瓦斯突出等礦難預兆"
        ],
        "risks": [],
        "narrative": "災難預警"
      },
      {
        "title": "礦脈搜尋者",
        "rarity": "普通",
        "desc": "尋找到新礦坑的機率提高 15%",
        "motto": "跟著泥土的顏色與山勢的走向，財富就藏在下一個轉角。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "尋找到新礦坑的機率提高 15%"
        ],
        "risks": [],
        "narrative": "尋寶獵人"
      },
      {
        "title": "測繪助手",
        "rarity": "普通",
        "desc": "地下3D地圖繪製速度加快，不易迷路",
        "motto": "在暗無天日的迷宮裡，每一條線都是兄弟們的生命線。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "地下3D地圖繪製速度加快，不易迷路"
        ],
        "risks": [],
        "narrative": "精準測繪"
      },
      {
        "title": "野外勘查員",
        "rarity": "普通",
        "desc": "在惡劣荒野環境下的生存能力大幅提升",
        "motto": "喝過狼血，睡過雪地，只要地底下有礦，天涯海角我都去。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "在惡劣荒野環境下的生存能力大幅提升"
        ],
        "risks": [],
        "narrative": "荒野跋涉"
      },
      {
        "title": "樣本採集員",
        "rarity": "普通",
        "desc": "採集到的樣本化驗速度加倍",
        "motto": "敲下一塊岩石，標上經緯度，這是開啟財富之門的鑰匙。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "採集到的樣本化驗速度加倍"
        ],
        "risks": [],
        "narrative": "細緻入微"
      },
      {
        "title": "淘金客",
        "rarity": "普通",
        "desc": "在河流流域有機率觸發「黃金熱」爆擊事件，獲得暴利",
        "motto": "淘金盤裡泛起的那抹金黃，能讓人忘記所有的寒冷與飢餓。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 20
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +20%",
          "在河流流域有機率觸發「黃金熱」爆擊事件，獲得暴利"
        ],
        "risks": [],
        "narrative": "一夜暴富"
      },
      {
        "title": "邊境開拓者",
        "rarity": "普通",
        "desc": "在無法律管轄的地帶建立礦工營地，免受土匪騷擾",
        "motto": "這裡沒有法律，我手裡的獵槍與同伴的十字鎬就是法律。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "在無法律管轄的地帶建立礦工營地，免受土匪騷擾"
        ],
        "risks": [],
        "narrative": "無法地帶"
      },
      {
        "title": "補給運輸員",
        "rarity": "普通",
        "desc": "提升荒野運輸車隊的載重上限與安全係數",
        "motto": "路再爛，風雪再大，我也要把炸藥與黑麵包送到營地。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 10,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +10%",
          "名譽收益 +5%",
          "提升荒野運輸車隊的載重上限與安全係數"
        ],
        "risks": [],
        "narrative": "物資命脈"
      },
      {
        "title": "營地管理員",
        "rarity": "普通",
        "desc": "降低營地礦工的暴動機率，提升日常凝聚力",
        "motto": "管好食堂的肉和帳篷的火，大傢伙才會心甘情願為你賣命。",
        "modifiers": {
          "cashGainPct": 10,
          "happinessGainPct": 15,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +10%",
          "快樂收益 +15%",
          "名譽收益 +5%",
          "降低營地礦工的暴動機率，提升日常凝聚力"
        ],
        "risks": [],
        "narrative": "後勤大管家"
      },
      {
        "title": "荒野生存家",
        "rarity": "普通",
        "desc": "採礦受傷後，可利用野生草藥自行完全治癒",
        "motto": "大自然是殘酷的，但只要你懂它，它也是最慷慨的藥局。",
        "modifiers": {
          "cashGainPct": 5,
          "happinessGainPct": 20,
          "reputationGainPct": 5
        },
        "effects": [
          "金錢收益 +5%",
          "快樂收益 +20%",
          "名譽收益 +5%",
          "採礦受傷後，可利用野生草藥自行完全治癒"
        ],
        "risks": [],
        "narrative": "絕地求生"
      }
    ],
    "2": [
      {
        "title": "礦區監工",
        "rarity": "稀有",
        "desc": "大幅提升底層礦工的採掘產出，但微幅降低快樂值",
        "motto": "別偷懶！手腳給我動起來！今天完不成指標，誰也別想拿錢！",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 10,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +10%",
          "名譽收益 +20%",
          "大幅提升底層礦工的採掘產出，但微幅降低快樂值"
        ],
        "risks": [],
        "narrative": "鐵面監工"
      },
      {
        "title": "爆破技師",
        "rarity": "稀有",
        "desc": "解鎖進階炸藥，能瞬間炸開原本無法通過的堅硬岩層",
        "motto": "爆破是一門藝術，計量要準，引線要長，轟鳴過後就是財富。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 5,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +5%",
          "名譽收益 +20%",
          "解鎖進階炸藥，能瞬間炸開原本無法通過的堅硬岩層"
        ],
        "risks": [],
        "narrative": "藝術就是爆炸"
      },
      {
        "title": "深井工程師",
        "rarity": "稀有",
        "desc": "解鎖千米深井開採技術，開採出稀有稀土元素",
        "motto": "向地心前進！地表底下的秘密，遠比人類想像的還要沉重。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 10,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +10%",
          "名譽收益 +20%",
          "解鎖千米深井開採技術，開採出稀有稀土元素"
        ],
        "risks": [],
        "narrative": "地心鑽探者"
      },
      {
        "title": "地質分析師",
        "rarity": "稀有",
        "desc": "精準計算整座山體的礦藏總價值，絕不投資空殼礦",
        "motto": "給我幾粒碎石，我能為你還原整座山脈一億年前的秘密。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 5,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +5%",
          "名譽收益 +25%",
          "精準計算整座山體的礦藏總價值，絕不投資空殼礦"
        ],
        "risks": [],
        "narrative": "岩石讀心術"
      },
      {
        "title": "礦脈探勘家",
        "rarity": "稀有",
        "desc": "發現世界級超大型富礦的機率顯著提高",
        "motto": "我的腳步走過哪裡，那裡的地下就會翻湧出金色的血液。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 10,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +10%",
          "名譽收益 +25%",
          "發現世界級超大型富礦的機率顯著提高"
        ],
        "risks": [],
        "narrative": "點石成金"
      },
      {
        "title": "資源調查官",
        "rarity": "稀有",
        "desc": "代表官方或大財團重組地方礦業，獲得極高行政抽成",
        "motto": "礦產是國家的命脈，我的工作就是確保每一噸都納入體制。",
        "modifiers": {
          "cashGainPct": 25,
          "happinessGainPct": 10,
          "reputationGainPct": 30
        },
        "effects": [
          "金錢收益 +25%",
          "快樂收益 +10%",
          "名譽收益 +30%",
          "代表官方或大財團重組地方礦業，獲得極高行政抽成"
        ],
        "risks": [],
        "narrative": "資源巨頭"
      },
      {
        "title": "邊疆開發者",
        "rarity": "稀有",
        "desc": "將荒涼的礦區營地直接升格發展為萬人鐵路小鎮",
        "motto": "三年 plan，我讓這片只有狼嚎的荒原，亮起萬家燈火。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 15,
          "reputationGainPct": 20
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +15%",
          "名譽收益 +20%",
          "將荒涼的礦區營地直接升格發展為萬人鐵路小鎮"
        ],
        "risks": [],
        "narrative": "城鎮奠基人"
      },
      {
        "title": "資源經營者",
        "rarity": "稀有",
        "desc": "掌控本地礦產品的定價權，炒作期貨獲利",
        "motto": "現在市場缺銅，把庫存扣住。價格，由我們說了算。",
        "modifiers": {
          "cashGainPct": 30,
          "happinessGainPct": 15,
          "reputationGainPct": 25
        },
        "effects": [
          "金錢收益 +30%",
          "快樂收益 +15%",
          "名譽收益 +25%",
          "掌控本地礦產品的定價權，炒作期貨獲利"
        ],
        "risks": [],
        "narrative": "壟斷之手"
      }
    ],
    "3": [
      {
        "title": "礦業大師",
        "rarity": "傳奇",
        "desc": "發明全新採礦法，全球礦場產能永久提升 20%",
        "motto": "不要用蠻力去對抗地殼，要用物理與流體力學去引導它。",
        "modifiers": {
          "cashGainPct": 40,
          "happinessGainPct": 15,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +40%",
          "快樂收益 +15%",
          "名譽收益 +50%",
          "發明全新採礦法，全球礦場產能永久提升 20%"
        ],
        "risks": [],
        "narrative": "行業泰斗"
      },
      {
        "title": "地心探險家",
        "rarity": "傳奇",
        "desc": "成功深入地函邊緣，發現未知結晶地底空洞",
        "motto": "這裡不是地獄，這裡是一座由水晶與熔岩交織成的神聖殿堂。",
        "modifiers": {
          "cashGainPct": 45,
          "happinessGainPct": 20,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +45%",
          "快樂收益 +20%",
          "名譽收益 +50%",
          "成功深入地函邊緣，發現未知結晶地底空洞"
        ],
        "risks": [],
        "narrative": "黃金地底冒險"
      },
      {
        "title": "能源開拓者",
        "rarity": "傳奇",
        "desc": "開採出可替代石油的全新超能礦物，財富迎來大爆發",
        "motto": "這顆泛著藍光的礦石，將成為下一個世紀人類文明的燃料。",
        "modifiers": {
          "cashGainPct": 50,
          "happinessGainPct": 15,
          "reputationGainPct": 45
        },
        "effects": [
          "金錢收益 +50%",
          "快樂收益 +15%",
          "名譽收益 +45%",
          "開採出可替代石油的全新超能礦物，財富迎來大爆發"
        ],
        "risks": [],
        "narrative": "新能源之父"
      },
      {
        "title": "礦業霸主",
        "rarity": "傳奇",
        "desc": "發起國際礦業托拉斯，全面壟斷全球有色金屬供應",
        "motto": "從西伯利亞到非洲銅帶，全球的重工業都得看我的臉色。",
        "modifiers": {
          "cashGainPct": 55,
          "happinessGainPct": 10,
          "reputationGainPct": 50
        },
        "effects": [
          "金錢收益 +55%",
          "快樂收益 +10%",
          "名譽收益 +50%",
          "發起國際礦業托拉斯，全面壟斷全球有色金屬供應"
        ],
        "risks": [],
        "narrative": "鐵血寡頭"
      }
    ],
    "4": [
      {
        "title": "礦業之王",
        "rarity": "隱藏",
        "desc": "（命運）你的家族掌控全球最大的黃金與鑽石儲備，資產富可敵國",
        "motto": "國王們用金冠彰顯權力，而那些金子，全都是從我的礦裡挖出來的。",
        "modifiers": {
          "cashGainPct": 60,
          "happinessGainPct": 25,
          "reputationGainPct": 70,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +60%",
          "快樂收益 +25%",
          "名譽收益 +70%",
          "（命運）你的家族掌控全球最大的黃金與鑽石儲備，資產富可敵國"
        ],
        "risks": [],
        "narrative": "金權之巔",
        "unlock": {
          "careerCount": 4,
          "age": 50,
          "wealth": 90
        }
      },
      {
        "title": "地心開拓者",
        "rarity": "隱藏",
        "desc": "（命運）成功在地下五千米建立永續運作的地底生態城市",
        "motto": "地表已經不再安全，但地心深處，我們築起了人類文明的避難所。",
        "modifiers": {
          "cashGainPct": 50,
          "happinessGainPct": 20,
          "reputationGainPct": 80,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +50%",
          "快樂收益 +20%",
          "名譽收益 +80%",
          "（命運）成功在地下五千米建立永續運作的地底生態城市"
        ],
        "risks": [],
        "narrative": "地底諾亞",
        "unlock": {
          "careerCount": 4,
          "age": 55,
          "reputation": 80
        }
      },
      {
        "title": "資源霸主",
        "rarity": "隱藏",
        "desc": "（命運）你的名字等同於全球資源安全的晴雨表，一言可引發世界金融海嘯",
        "motto": "我彈一彈十字鎬上的灰塵，全球的期貨市場就要連續跌停三天。",
        "modifiers": {
          "cashGainPct": 55,
          "happinessGainPct": 25,
          "reputationGainPct": 75,
          "rareEventPct": 15,
          "legendaryEventPct": 15
        },
        "effects": [
          "金錢收益 +55%",
          "快樂收益 +25%",
          "名譽收益 +75%",
          "（命運）你的名字等同於全球資源安全的晴雨表，一言可引發世界金融海嘯"
        ],
        "risks": [],
        "narrative": "隻手遮天",
        "unlock": {
          "careerCount": 4,
          "age": 60,
          "wealth": 100,
          "reputation": 70
        }
      }
    ]
  }
};
function normalizeTitle(t, career, tier){
  const rarity=t.rarity || (tier===1?"普通":tier===2?"稀有":tier===3?"傳奇":"隱藏");
  return { career, tier, rarity, effects:[], risks:[], modifiers:{}, ...t };
}
function titleUnlocked(t, player, nextCount){
  if(!t?.unlock) return true;
  const u=t.unlock;
  const ageYears=Math.floor((player?.ageMonths||0)/12);
  const wealth=clampWealthCash(player?.cash||0);
  if((nextCount||0) < (u.careerCount||4)) return false;
  if(u.age && ageYears < u.age) return false;
  if(u.wealth && wealth < u.wealth) return false;
  if(u.happiness && (player?.happiness||0) < u.happiness) return false;
  if(u.reputation && (player?.reputation||0) < u.reputation) return false;
  if(u.family){
    const hasFamily=(player?.lifeLog||[]).some(x=>/家庭|家人|伴侶|孩子|長輩/.test((x.title||"")+(x.desc||"")));
    if(!hasFamily) return false;
  }
  return true;
}
function eligibleTitleTiers(nextCount){
  if(nextCount<=1) return [1];
  if(nextCount===2) return [1,2];
  if(nextCount===3) return [1,2,3];
  return [1,2,3,4];
}
function sampleThreeTitles(career,nextCount,player){
  const tiers=eligibleTitleTiers(nextCount);
  let pool=tiers.flatMap(tier=>(titlePools[career]?.[tier]||[]).map(t=>normalizeTitle(t,career,tier))).filter(t=>titleUnlocked(t,player,nextCount));
  if(!pool.length) pool=(titlePools[career]?.[1]||[]).map(t=>normalizeTitle(t,career,1));
  const weights={普通:65, 稀有:30, 傳奇:4, 隱藏:1};
  const owned=new Set([...(player?.titles||[])].filter(t=>t.career===career).map(t=>t.title));
  const weighted=[];
  for(const t of pool){
    let w=weights[t.rarity] || 10;
    if(!owned.has(t.title)) w*=3;
    for(let i=0;i<Math.max(1,Math.round(w));i++) weighted.push(t);
  }
  const selected=[];
  while(selected.length<3 && weighted.length){
    const pick=weighted[Math.floor(Math.random()*weighted.length)];
    if(!selected.some(x=>x.title===pick.title)) selected.push({...pick});
    for(let i=weighted.length-1;i>=0;i--) if(weighted[i].title===pick.title) weighted.splice(i,1);
  }
  return selected.length ? selected : pool.slice(0,3);
}
function getAchievementChoices(career,nextCount,player){
  return sampleThreeTitles(career,nextCount,player);
}
function equippedTitle(player){
  return (player?.titles || []).find(t=>t.id===player.equippedTitleId) || null;
}
function modsOf(player){
  const base={...(equippedTitle(player)?.modifiers || {})};
  try{
    const codex=JSON.parse(localStorage.getItem("titleCodex")||"[]");
    if((codex||[]).some(isFounderTitle)){
      base.legendaryEventPct=(Number(base.legendaryEventPct)||0)+5;
    }
  }catch(e){}
  const eq=equippedTitle(player);
  if(eq?.tier===4 || eq?.rarity==="隱藏"){
    base.rareEventPct=(Number(base.rareEventPct)||0)+10;
    base.legendaryEventPct=(Number(base.legendaryEventPct)||0)+10;
  }
  if(player?.starBlessing && player.starBlessing.untilAgeMonths >= (player.ageMonths||0)){
    if(player.starBlessing.kind==="wealth") base.cashGainPct=(Number(base.cashGainPct)||0)+20;
    if(player.starBlessing.kind==="happiness") base.happinessGainPct=(Number(base.happinessGainPct)||0)+20;
    if(player.starBlessing.kind==="reputation") base.reputationGainPct=(Number(base.reputationGainPct)||0)+20;
    base.rareEventPct=(Number(base.rareEventPct)||0)+10;
  }
  if(typeof localStorage !== "undefined" && localStorage.getItem("starMode")==="true"){
    base.rareEventPct=(Number(base.rareEventPct)||0)+12;
    base.familyPositivePct=(Number(base.familyPositivePct)||0)+4;
  }
  return base;
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
function splitTitleEffects(t){
  const m=t.modifiers || {};
  const positive=[];
  const cost=[];
  const seenPos=new Set();
  const seenCost=new Set();
  const rules={
    cashGainPct:{label:"金錢收益", semantic:"positive"},
    happinessGainPct:{label:"快樂收益", semantic:"positive"},
    reputationGainPct:{label:"名譽收益", semantic:"positive"},
    rareEventPct:{label:"稀有事件", semantic:"positive"},
    legendaryEventPct:{label:"傳奇事件", semantic:"positive"},
    familyPositivePct:{label:"家庭正向事件", semantic:"positive"},
    cashLossPct:{label:"金錢損失", semantic:"negative"},
    happinessLossPct:{label:"快樂損失", semantic:"negative"},
    reputationLossPct:{label:"名譽損失", semantic:"negative"},
    pressureEventPct:{label:"壓力事件", semantic:"negative"},
    negativeEventPct:{label:"負面事件", semantic:"negative"},
    bankruptcyRiskPct:{label:"破產風險", semantic:"negative"}
  };
  const pushUnique=(arr,seen,text)=>{ if(text && !seen.has(text)){ seen.add(text); arr.push(text); } };
  const isTextCost=(text)=>{
    const hasNegSemantic=/損失|風險|負面|壓力|失敗|下降|減少|衝突|破產|孤獨|代價|危機/.test(text);
    const hasPosSemantic=/收益|成功率|正向|加成|提升|增加|減免|保護|恢復|稀有事件|傳奇事件|特殊事件|機會/.test(text);
    const mnum=String(text).match(/([+＋\-－])\s*\d/);
    const sign=mnum ? (/[\-－]/.test(mnum[1]) ? -1 : 1) : 0;
    if(hasNegSemantic) return sign >= 0;   // 快樂損失 +8% = 代價；快樂損失 -8% = 正向
    if(hasPosSemantic) return sign < 0;    // 快樂收益 -8% = 代價；快樂收益 +8% = 正向
    return sign < 0;
  };
  Object.entries(rules).forEach(([k,meta])=>{
    const v=Number(m[k]||0);
    if(!v) return;
    const text=`${meta.label} ${v>0?'+':''}${v}%`;
    const isCost = meta.semantic === "negative" ? v > 0 : v < 0;
    if(isCost) pushUnique(cost,seenCost,text);
    else pushUnique(positive,seenPos,text);
  });
  [...(t.effects||[]), ...(t.risks||[])].forEach(text=>{
    if(!text) return;
    if(isTextCost(text)) pushUnique(cost,seenCost,text);
    else pushUnique(positive,seenPos,text);
  });
  return {positive,cost};
}
function titleEffectSummary(t){ return splitTitleEffects(t).positive; }

function displayRarity(rarity){
  if(rarity === "隱藏") return "隱藏";
  return rarity || "普通";
}
function rarityClass(rarity){
  const r=displayRarity(rarity);
  if(r==="隱藏") return "rarity-destiny";
  if(r==="傳奇") return "rarity-legendary";
  if(r==="稀有") return "rarity-rare";
  return "rarity-common";
}
function rarityStars(rarity){
  const r=displayRarity(rarity);
  if(r==="隱藏") return "🌠";
  if(r==="傳奇") return "⭐⭐⭐";
  if(r==="稀有") return "⭐⭐";
  return "⭐";
}
function titleTierText(t){ return t?.tier===1?"普通":t?.tier===2?"二階":t?.tier===3?"菁英":"命運"; }
function titleCardLabel(t){ return `${rarityStars(t?.rarity)} ${displayRarity(t?.rarity)}`; }

function titleKey(t){ return `${t?.career||""}-${t?.title||""}`; }
function playerHasTitle(player,t){ return (player?.titles||[]).some(x=>x.title===t.title && x.career===t.career); }
function codexHasTitle(codex,t){ return (codex||[]).some(x=>x.title===t.title && x.career===t.career); }
function inferLifeType(p){
  const vals=[['財富型人生',clampWealthCash(p?.cash||0)],['快樂型人生',p?.happiness||0],['名譽型人生',p?.reputation||0]];
  vals.sort((a,b)=>b[1]-a[1]);
  if(Math.abs(vals[0][1]-vals[2][1])<=12) return '平衡型人生';
  return vals[0][0];
}
function flattenTitlePools(){
  const out=[];
  Object.entries(titlePools).forEach(([career,tiers])=>{
    Object.entries(tiers).forEach(([tier,list])=>{
      (list||[]).forEach(t=>out.push(normalizeTitle(t,career,Number(tier))));
    });
  });
  return out;
}
function modernTitleKeySet(){ return new Set(flattenTitlePools().map(t=>`${t.career}-${t.title}`)); }
function isFounderTitle(x){ return (x?.title||"") === "幸福人先驅者"; }
function migrateLegacyCodexRecords(records=[]){
  const modernKeys=modernTitleKeySet();
  let foundLegacy=false;
  const normalized=(records||[]).filter(Boolean).map(x=>{
    const key=`${x.career||""}-${x.title||""}`;
    if(modernKeys.has(key) || isFounderTitle(x)) return x;
    foundLegacy=true;
    return {
      ...x,
      legacy:true,
      originalCareer:x.originalCareer || x.career || "經典",
      rarity:x.rarity || "經典",
      tier:x.tier || 0,
      motto:x.motto || "在世界尚未完成時，你已經開始探索。",
      desc:x.desc || "這是舊版本留下的經典頭銜，記錄著幸福人早期的人生痕跡。"
    };
  });
  if(foundLegacy && !normalized.some(isFounderTitle)){
    normalized.unshift({
      title:"幸福人先驅者",
      career:"經典",
      legacy:true,
      founder:true,
      rarity:"隱藏",
      tier:4,
      firstAge:"版本升級紀念",
      desc:"在《幸福人》世界尚未完成時，你已經開始探索。",
      motto:"在世界尚未完成時，你已經開始探索。",
      modifiers:{ legendaryEventPct:5 },
      unlockedAt:new Date().toISOString()
    });
  }
  const seen=new Set();
  return normalized.filter(x=>{
    const k=`${x.legacy?'legacy':'modern'}-${x.career||''}-${x.title||''}`;
    if(seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
function deepCareerTitle(career, player, nextCount){ return null; }
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
function syncNarrativeNaming(text=""){
  return String(text)
    .replace(/階級：傳奇/g,"階級：菁英")
    .replace(/第 3 階/g,"菁英階")
    .replace(/第3階/g,"菁英階")
    .replace(/第三次完成進入傳奇頭銜/g,"第三次完成進入菁英頭銜")
    .replace(/第三次完成[^，。]*傳奇/g, m=>m.replace(/傳奇/g,"菁英"));
}
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


function eventBaseCash(ev){
  const level = ev?.eventLevel || "普通";
  if(level === "傳奇" || level === "命運") return 1200;
  if(level === "稀有") return 700;
  return 350;
}
function hasAny(text, words){ return words.some(w=>text.includes(w)); }
function appendInsight(desc, insight){
  if(!insight || String(desc||"").includes("💭")) return desc || "";
  return `${desc}

💭 ${insight}`;
}
function normalizeEventOutcome(ev){
  if(!ev || ev._normalizedOutcome || ev.manualImpact) return ev;
  const text = `${ev.title||""} ${ev.desc||""}`;
  let cash = Number(ev.cash)||0;
  let happiness = Number(ev.happiness)||0;
  let reputation = Number(ev.reputation)||0;
  let insight = "";
  const base = eventBaseCash(ev);
  const catastrophicWords = ["全滅","沉沒","陣亡","死亡","殉國","覆滅","滅亡","自爆","罹難","犧牲","喪生"];
  const moneyGainWords = ["助學金","獎助學金","獎學金","獎金","補助","贊助","贊助人","投資款","融資","募資","分紅","票房大賣","豐收","大豐收","得標","合約","訂單","收益","獲利","收入","承包","中獎"];
  const moneyLossWords = ["故障","壞掉","腐爛","黑煙","罰款","賠償","失竊","偷走","虧損","倒閉","破產","維修","損失","燒毀","坍方","沉沒","爆炸","停擺","延誤","斷裂","洩漏","酸雨","侵蝕","投毒","污染","中毒","認證被","惡意","蓄意破壞","偷噴","焦黃","病斑","枯萎"];
  const reputationLossWords = ["投訴","惡評","差評","水軍","灌爆","炎上","醜聞","雪藏","封殺","罵聲","聯署","抱怨","爭議","失言","認證被","惡意投毒","造假","污染","抹黑"];
  const happinessLossWords = ["故障","壞掉","腐爛","惡臭","黑煙","受傷","疾病","生病","崩潰","失敗","錯過","失竊","壓力","孤獨","迷航","危機","事故","投訴","酸雨","侵蝕","投毒","惡意","污染","中毒","焦黃","病斑","枯萎"];
  const successWords = ["成功","突破","發現","得獎","獲獎","表揚","入選","獲選","受邀","掌聲","感謝","救援成功","逆轉","大賣","爆紅","完成"];
  const adversityWords = [...moneyLossWords, ...reputationLossWords, ...happinessLossWords, "拒絕", "被拒", "低潮", "失落", "雪藏"];
  const isCatastrophic = hasAny(text, catastrophicWords);
  const hasMoneyGain = hasAny(text, moneyGainWords);
  const hasMoneyLoss = hasAny(text, moneyLossWords);
  const hasRepLoss = hasAny(text, reputationLossWords);
  const hasHappyLoss = hasAny(text, happinessLossWords);
  const hasSuccess = hasAny(text, successWords);
  const hasAdversity = hasAny(text, adversityWords);
  const hasPreparation = /提前|防護|預警|監測|準備|保險|備援|防災|留存|備份/.test(text);
  if(/酸雨|侵蝕|病斑|焦黃|枯萎/.test(text) && !hasPreparation){
    cash = cash > 0 ? -Math.abs(cash) : (cash || -Math.round(base*0.8));
    happiness = happiness > 0 ? -Math.min(2, happiness) : (happiness || -1);
    insight = "天候與環境從不保證公平，這次損失提醒你：農業的韌性不只在土地，也在風險準備裡。";
  } else if(/投毒|惡意|蓄意破壞|偷噴|認證被/.test(text) && !/曝光|監視器|抓到|起訴|媒體|澄清|支持/.test(text)){
    cash = cash > 0 ? -Math.abs(cash) : (cash || -base);
    happiness = happiness > 0 ? -1 : (happiness || -1);
    reputation = reputation > 0 ? -Math.min(2, reputation) : (reputation || -1);
    insight = "這次打擊讓你明白，經營不只要面對自然，也要面對人心。真正的信任，需要時間重新證明。";
  } else if(/投毒|惡意|蓄意破壞|偷噴|認證被/.test(text)){
    cash = cash > 0 ? -Math.abs(cash) : (cash || -Math.round(base*0.8));
    happiness = Math.max(happiness, 1);
    reputation = Math.max(reputation, 2);
    insight = "事件曝光後，支持者反而更加看見你的堅持。你失去了一些作物，卻守住了誠信。";
  } else if(isCatastrophic){
    cash = cash > 0 ? -Math.abs(cash) : (cash || -base*2);
    happiness = happiness > 0 ? -Math.max(2, happiness) : (happiness || -3);
    reputation = Math.max(reputation, 3);
    insight = "這不是單純的勝利，而是一段被代價刻進歷史的壯烈記憶。你失去了許多，卻也讓名字被後人記住。";
  } else if(hasMoneyGain){
    if(cash <= 0) cash = base;
    if(happiness <= 0) happiness = Math.max(happiness, 1);
    insight = "這筆資源沒有讓人生從此無憂，卻像一場及時雨，讓你能繼續往前走。";
  } else if(hasAdversity){
    if(hasMoneyLoss && cash > 0) cash = -Math.abs(cash);
    if(hasMoneyLoss && cash === 0) cash = -Math.round(base*0.7);
    if(hasRepLoss && reputation > 0) reputation = -Math.abs(reputation);
    if(hasRepLoss && reputation === 0) reputation = -1;
    if(hasHappyLoss && happiness > 1) happiness = 1;
    if(happiness === 0 && (hasRepLoss || hasMoneyLoss)) happiness = 1;
    if(/雪藏|封殺|水軍|灌爆|差評|惡評/.test(text)){
      if(cash > 0) cash = -Math.abs(cash);
      if(reputation > 0) reputation = -Math.abs(reputation);
      happiness = Math.max(happiness, 1);
      insight = "你失去了一些外在掌聲，卻也第一次學會把別人的評價與自己的價值分開。";
    } else if(/投訴|惡臭|抱怨|聯署/.test(text)){
      insight = "這次尷尬讓你明白，專業不只在技術裡，也在和人好好溝通的能力裡。";
    } else if(/故障|壞掉|黑煙|維修|損失|腐爛/.test(text)){
      insight = "雖然付出了代價，但你也因此學會更早準備、更細心照看那些容易被忽略的環節。";
    } else {
      insight = "這不是一個順利的月份，但它讓你多了一點經驗，也多了一點重新站穩的能力。";
    }
  } else if(hasSuccess){
    if(cash < 0) cash = Math.abs(cash);
    if(happiness < 0) happiness = Math.abs(happiness) || 1;
    if(reputation < 0) reputation = Math.abs(reputation) || 1;
    insight = "順利不只是運氣，也來自先前那些沒被看見的準備。";
  }
  return {...ev, cash, happiness, reputation, desc: appendInsight(ev.desc, insight), _normalizedOutcome:true};
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
      if(e.eventLevel==="傳奇" || e.eventLevel==="命運") w += Math.max(0, Number(m.legendaryEventPct)||0);
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
  const [starSupporter,setStarSupporter]=useState(()=>localStorage.getItem("starMode")==="true");
  const [supporterInput,setSupporterInput]=useState("");
  const [showCoinRain,setShowCoinRain]=useState(false);
  const [showStarRain,setShowStarRain]=useState(false);
  const [titleCodex,setTitleCodex]=useState(()=>{ try{return JSON.parse(localStorage.getItem("titleCodex")||"[]");}catch(e){return [];} });
  const [lifeLibrary,setLifeLibrary]=useState(()=>{ try{return JSON.parse(localStorage.getItem("lifeLibrary")||"[]");}catch(e){return [];} });
  const [endingRecord,setEndingRecord]=useState(null);
  const mainAudioRef=useRef(null);
  const careerAudioRef=useRef(null);
  const playersRef=useRef(players);

  const current=players[turn];
  const boardTile = current ? outerBoard[current.outerPos] : null;
  const wealthScore = current ? clampWealthCash(current.cash) : 0;

  useEffect(()=>{ playersRef.current=players; },[players]);
  useEffect(()=>{
    setTitleCodex(prev=>{
      const cleaned=(prev||[]).map(x=>({...x, tierName:x.tier===3?"菁英":x.tierName, desc:syncNarrativeNaming(x.desc||""), motto:syncNarrativeNaming(x.motto||"")}));
      const next=migrateLegacyCodexRecords(cleaned);
      localStorage.setItem("titleCodex", JSON.stringify(next));
      return next;
    });
    setLifeLibrary(prev=>{
      const next=(prev||[]).map(x=>({...x, autobiography:syncNarrativeNaming(x.autobiography||""), motto:syncNarrativeNaming(x.motto||""), title:syncNarrativeNaming(x.title||"")}));
      localStorage.setItem("lifeLibrary", JSON.stringify(next));
      return next;
    });
  },[]);
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
  function unlockTitleRecord(title, player=current){
    if(!title) return;
    const record={ title:title.title, career:title.career, rarity:displayRarity(title.rarity), tier:title.tier, motto:title.motto, desc:title.desc, firstAge:player?ageText(player.ageMonths):"未知", unlockedAt:new Date().toISOString() };
    setTitleCodex(prev=>{
      const exists=prev.some(x=>x.title===record.title && x.career===record.career);
      const next=exists?prev.map(x=>x.title===record.title && x.career===record.career?{...x,...record}:x):[record,...prev];
      localStorage.setItem("titleCodex", JSON.stringify(next));
      return next;
    });
  }
  function updateCurrent(fn){ setPlayers(prev=>prev.map((p,i)=>i===turn?fn(p):p)); }

  function targetSum(t){ return Number(t.wealth||0)+Number(t.happiness||0)+Number(t.reputation||0); }
  function canStart(){ return setupPlayers.every(p=>p.name.trim() && targetSum(p.target)===TARGET_TOTAL); }

  function startGame(){
    if(!canStart()){ setModal({title:"幸福目標尚未完成", desc:"每位玩家的財富、快樂、名譽目標總和必須剛好等於100。"}); return; }
    setPlayers(setupPlayers.map(p=>createPlayer(p.name.trim(), p.animal, p.target)));
    setScreen("game");
  }

  function unlockSupporter(){
    const code=supporterInput.trim().toUpperCase();
    if(code === SUPPORTER_CODE){
      localStorage.setItem("supporterMode","true");
      setSupporter(true);
      setSupporterInput("");
      setModal({title:"🌱 支持者模式已啟用", desc:"感謝你支持《幸福人》。發薪日將啟用金幣雨特效與音效。"});
    }else if(code === STAR_SUPPORTER_CODE){
      localStorage.setItem("starMode","true");
      setStarSupporter(true);
      setSupporterInput("");
      setModal({title:"🌠 命運流星已啟用", desc:"有些願望不會立刻實現，但它會悄悄改變人生的可能性。往後的人生裡，你有機會遇見命運流星；稀有事件、特殊頭銜與深層人生的機會也會被夜空輕輕推動。"});
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

  function triggerStarEvent(testMode=false){
    setShowStarRain(true);
    if(sfx){
      const audio=new Audio(STAR_SOUND);
      audio.volume=0.75;
      audio.play().catch(()=>{});
    }
    setTimeout(()=>setShowStarRain(false),10500);
    const wishOptions=[
      {key:"wealth", label:"許下財富願望", text:"你希望未來的道路能多一點資源，讓重要的選擇不再只被金錢限制。", blessing:"財富運勢提升"},
      {key:"happiness", label:"許下快樂願望", text:"你希望在漫長的人生裡，仍保有感受美好與重新微笑的能力。", blessing:"快樂運勢提升"},
      {key:"reputation", label:"許下名譽願望", text:"你希望自己的努力能被看見，也希望留下值得被記住的痕跡。", blessing:"名譽運勢提升"}
    ];
    const chooseWish=(w)=>{
      updateCurrent(p=>({...p, starBlessing:{type:w.key, months:12, label:w.blessing}, lifeLog:[...p.lifeLog,{ageMonths:p.ageMonths,title:"流星雨之夜",desc:`${w.text} 那一晚之後，你感覺未來的道路多了一些可能。`,type:"star",important:true}]}));
      addLog(`🌠 ${displayName(current)} 獲得${w.blessing}`);
      setModal({title:`🌠 ${w.blessing}`, desc:`${w.text}

那顆流星似乎記住了你的願望。未來一段時間，相關的正向事件會更容易靠近你。`, actions:[{label:"確認", onClick:()=>{setModal(null); if(!testMode) nextTurn();}}]});
    };
    setModal({
      title:"🌠 流星雨之夜",
      desc:"一場難得的流星雨劃過夜空。你站在夜色裡，忽然覺得人生仍有許多尚未被打開的可能。",
      actions:wishOptions.map(w=>({label:w.label, onClick:()=>chooseWish(w)})).concat([{label:"只是靜靜看著", onClick:()=>{setModal({title:"🌠 靜望流星", desc:"你沒有許願，只是安靜地看著光從夜空落下。這一刻本身，已經足夠被記住。", actions:[{label:"確認", onClick:()=>{setModal(null); if(!testMode) nextTurn();}}]});}}])
    });
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
          const board=np.careerLayout || careerBoards[np.career];
          const len=board.length;
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
      const board=p.careerLayout || careerBoards[p.career];
      const len=board.length;
      if((p.careerProgress||0) >= len) return completeCareer(p.career);
      const tile=board[p.careerPos] || {};
      if(tile.type==="careerTurn") return careerTurningPoint(p.career);
      const pool=(careerEvents[p.career] || []).filter(e=>e.eventLevel===tile.eventLevel);
      const ev=eventByTrait(pool.length?pool:(careerEvents[p.career]||[]), p);
      applyEvent(ev, `${p.career}｜${tile.eventLevel||"事件"}`);
      return;
    }
    const tile=outerBoard[p.outerPos];
    if(tile.type==="family") return applyEvent(eventByTrait(familyEvents, p), "家庭");
    if(tile.type==="chance"){
      if(starSupporter && Math.random()<0.18) return triggerStarEvent();
      return applyEvent(eventByTrait(chanceEvents, p), "機會");
    }
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

  function careerTurningPoint(career){
    setModal({
      title:`🔄 ${career}事業轉折點`,
      desc:`你開始思考：這真的是我想走的人生嗎？

重新出發會回到本職業起點，重新經歷這段職業道路；繼續前進則維持目前方向。`,
      actions:[
        {label:"重新出發", onClick:()=>{updateCurrent(p=>({...p, careerPos:0, careerProgress:0, lifeLog:[...p.lifeLog,{ageMonths:p.ageMonths,title:`${career}事業轉折點`,desc:"他選擇回到職業起點，重新出發。",type:"careerTurn",important:true}]})); setModal(null); nextTurn();}},
        {label:"繼續前進", onClick:()=>{updateCurrent(p=>({...p, lifeLog:[...p.lifeLog,{ageMonths:p.ageMonths,title:`${career}事業轉折點`,desc:"他短暫動搖，最後仍選擇沿著原路繼續前進。",type:"careerTurn",important:true}]})); setModal(null); nextTurn();}}
      ]
    });
  }

  function applyEvent(ev, source){
    const resolvedEvent = normalizeEventOutcome(ev);
    updateCurrent(p=>{
      let np=applyEffect(p, resolvedEvent);
      const age=np.ageMonths;
      const logItem={ageMonths:age,title:resolvedEvent.title,desc:resolvedEvent.desc,type:source,important:!!resolvedEvent.important || !!resolvedEvent.rare};
      np.lifeLog=[...np.lifeLog, logItem];
      return np;
    });
    setModal({
      title:`${source}｜${resolvedEvent.title}`,
      desc:`${resolvedEvent.desc}

${effectText(resolvedEvent)}`,
      actions:[{label:"確認", onClick:()=>{setModal(null); checkOrNext();}}]
    });
  }

  function effectText(ev, player){
    const adj=adjustedEffect(player||current, ev);
    const arr=[];
    if(ev.cash) arr.push(`財富 ${adj.cash>0?'+':''}${money(adj.cash)}`);
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
    updateCurrent(p=>({...applyEffect(p,{cash:-fee}), career, careerPos:0, careerProgress:0, careerLayout:shuffledCareerBoard(career), lifeLog:[...p.lifeLog,{ageMonths:p.ageMonths,title:`進入${career}道路`,desc:`選擇投入${career}人生道路。`,type:"career",important:true}]}));
    addLog(`${displayName(p)} 進入 ${career} 道路`);
    setModal(null);
  }

  function completeCareer(career){
    const p=current;
    const nextCount=(p.careerCounts[career]||0)+1;
    const choices=getAchievementChoices(career,nextCount,p);
    setModal({
      title:`完成${career}道路（第${nextCount}次）`,
      desc:`你已完成第 ${nextCount} 次 ${career} 人生道路。請選擇一項人生頭銜，確認後才會正式結束本次職業道路。`,
      locked:true,
      custom: <AchievementPicker choices={choices} career={career} nextCount={nextCount} player={p} titleCodex={titleCodex} onConfirm={chooseAchievement} />
    });
  }

  function chooseAchievement(career,a,nextCount){
    const title={...a,id:Math.random().toString(36).slice(2),career, rarity:displayRarity(a.rarity)};
    const hadEquipped = !!current?.equippedTitleId;
    const deep = deepCareerTitle(career, current, nextCount);
    let deepAdded=null;
    updateCurrent(p=>{
      let np={...p};
      np.careerCounts={...np.careerCounts,[career]:nextCount};
      const alreadyDeep = deep && (np.titles||[]).some(t=>t.title===deep.title && t.career===deep.career);
      deepAdded = deep && !alreadyDeep ? {...deep,id:Math.random().toString(36).slice(2)} : null;
      np.titles=[...np.titles,title, ...(deepAdded?[deepAdded]:[])];
      if(!np.equippedTitleId) np.equippedTitleId=title.id;
      np.career=null; np.careerPos=0; np.careerProgress=0; np.careerLayout=null;
      np=applyEffect(np,{salaryRaise:a.salaryRaise,reputation:a.rep||0,happiness:a.happy||0});
      np.lifeLog=[...np.lifeLog,{ageMonths:np.ageMonths,title:`獲得頭銜：${a.title}`,desc:`${a.desc}${a.salaryRaise?` 並加薪 ${a.salaryRaise}。`:""}`,type:"title",important:true}];
      if(deepAdded){
        np.lifeLog=[...np.lifeLog,{ageMonths:np.ageMonths,title:`人生境界達成：${deepAdded.title}`,desc:`${deepAdded.desc}`,type:"deepTitle",important:true}];
      }
      return np;
    });
    unlockTitleRecord(title,current);
    if(deepAdded) setTimeout(()=>unlockTitleRecord(deepAdded,current),0);
    const detail=`${a.desc}

階級：${titleTierText(a)}
稀有度：${titleCardLabel(a)}
${a.salaryRaise?`加薪 ${a.salaryRaise}
`:""}${a.effects?.length?`效果：${a.effects.join('、')}
`:""}${a.risks?.length?`風險：${a.risks.join('、')}`:""}${deepAdded?`

🌟 人生境界達成：${deepAdded.title}
${deepAdded.desc}
${deepAdded.motto?`人生格言：${deepAdded.motto}`:""}`:""}`;
    if(!hadEquipped){
      setModal({title:`獲得頭銜：${a.title}`, desc:`${detail}

你目前尚未裝備任何頭銜，因此系統已先將此頭銜作為目前人生身份。`, actions:[{label:"確認", onClick:()=>{setModal(null); checkOrNext();}}]});
      return;
    }
    setModal({
      title:`獲得新頭銜：${a.title}`,
      desc:`${detail}

是否要將這個新頭銜裝備為目前的人生身份？若先不裝備，它仍會保留在你的人生皮夾中，之後可隨時切換。`,
      actions:[
        {label:"裝備新頭銜", onClick:()=>{ setPlayers(prev=>prev.map((p,i)=>i===turn?{...p,equippedTitleId:title.id}:p)); setModal(null); setTimeout(checkOrNext,0); }},
        {label:"先保留原頭銜", onClick:()=>{ setModal(null); checkOrNext(); }}
      ]
    });
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
    const text=syncNarrativeNaming(generateAutobiography(p, reason));
    setAutobiography(text);
    setEndingRecord(makeLifeBookRecord(p, reason, text));
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
    const important = (p.lifeLog || []).filter(x=>x.important);
    const finalWealth=clampWealthCash(p.cash);
    const finalValues={wealth:finalWealth,happiness:p.happiness,reputation:p.reputation};
    const finalTop = Object.entries(finalValues).sort((a,b)=>b[1]-a[1])[0]?.[0] || "balance";
    const targetTop = p.trait || "balance";
    const mainCareer = Object.entries(p.careerCounts||{}).sort((a,b)=>b[1]-a[1])[0]?.[0] || "人生";
    const equipped = p.titles.find(t=>t.id===p.equippedTitleId) || p.titles[p.titles.length-1];
    const finalTitle = equipped?.title || "人生旅人";
    const titleTone = equipped?.narrative || equipped?.desc || "選擇、前行、回望";
    const hasBankrupt = important.some(x=>x.type==="bankrupt");
    const skipped = important.filter(x=>x.type==="branch");
    const families = important.filter(x=>x.type==="family" || x.type==="家庭" || /家庭|家人|伴侶|孩子|長輩/.test(x.title+x.desc));
    const titleEvents = important.filter(x=>x.type==="title");
    const careerEventsDone = important.filter(x=>x.type==="career");
    const reached = reason.includes("達成");
    const high = Math.max(finalWealth,p.happiness,p.reputation);
    const low = Math.min(finalWealth,p.happiness,p.reputation);
    const titleNames=(p.titles||[]).map(t=>t.title).join("、") || "尚未留下明確頭銜";

    function pick(arr, seed=0){
      if(!arr.length) return "";
      const n = Math.abs((p.name||"幸福人").split('').reduce((a,c)=>a+c.charCodeAt(0),0) + p.ageMonths + seed + important.length*7 + (p.titles?.length||0)*13);
      return arr[n % arr.length];
    }
    function targetName(k){ return k==="wealth"?"財富":k==="happiness"?"快樂":k==="reputation"?"名譽":"平衡"; }
    function personPhrase(k){
      if(k==="wealth") return "逐漸掌握生活選擇權的人";
      if(k==="happiness") return "能夠笑著回望日常的人";
      if(k==="reputation") return "在世界留下痕跡的人";
      return "在不同渴望之間找到平衡的人";
    }
    function finalReachOpening(){
      if(reason.includes("達成")){
        if(targetTop==="wealth") return `${ageText(p.ageMonths)}時，${displayName(p)}終於達成了年輕時替自己立下的人生目標。他未必擁有完美的人生，卻在歲月裡一步步接近財富自由，也更明白財富真正的重量。`;
        if(targetTop==="happiness") return `${ageText(p.ageMonths)}時，${displayName(p)}終於抵達了自己曾經嚮往的幸福模樣。那不是毫無陰影的快樂，而是在經歷選擇、錯過與低潮之後，仍能笑看人生的從容。`;
        if(targetTop==="reputation") return `${ageText(p.ageMonths)}時，${displayName(p)}終於活成了一位被人記得的人。那些掌聲、責任與爭議交織在一起，讓他的名字不只屬於自己，也留在他人的生命裡。`;
        return `${ageText(p.ageMonths)}時，${displayName(p)}終於達成了他所理解的幸福。他沒有把人生押在單一答案上，而是在財富、快樂與名譽之間，慢慢找到能安放自己的位置。`;
      }
      return `${ageText(p.ageMonths)}時，${displayName(p)}走到了人生自然的終章。最初設定的目標未必全數完成，但一生的重量從來不只由達成與否決定，而是由走過的道路、錯過的機會與仍然珍惜的事物構成。`;
    }

    const archetypes = [
      {key:"warm", cond:()=>p.happiness>=finalWealth && families.length>=2, name:"溫暖而平凡的人生", mood:"溫暖、陪伴、日常"},
      {key:"wealth", cond:()=>finalWealth>=p.happiness && finalWealth>=p.reputation && targetTop==="wealth", name:"財富與責任的人生", mood:"成就、得失、責任"},
      {key:"fame", cond:()=>p.reputation>=finalWealth && p.reputation>=p.happiness && targetTop==="reputation", name:"留下痕跡的人生", mood:"影響、名聲、承擔"},
      {key:"happy", cond:()=>p.happiness>=40 && targetTop==="happiness", name:"笑看人生的人生", mood:"快樂、和解、珍惜"},
      {key:"legend", cond:()=>/英雄|傳奇|領袖|教父|博士|大亨|時代/.test(titleNames) || high>=120, name:"帶有傳奇色彩的人生", mood:"壯闊、代價、記憶"},
      {key:"regret", cond:()=>skipped.length>=2 || low<0, name:"帶著遺憾前行的人生", mood:"錯過、低潮、回望"},
      {key:"rise", cond:()=>hasBankrupt && finalWealth>20, name:"東山再起的人生", mood:"跌倒、重建、韌性"},
      {key:"wander", cond:()=>Object.values(p.careerCounts||{}).filter(v=>v>0).length>=3, name:"漂泊探索的人生", mood:"轉向、尋找、遠方"},
      {key:"balance", cond:()=>Math.abs(finalWealth-p.happiness)<20 && Math.abs(p.happiness-p.reputation)<20, name:"平衡而完整的人生", mood:"取捨、安放、理解"},
      {key:"unfinished", cond:()=>!reached, name:"未完成但真實的人生", mood:"未竟、留白、接受"},
      {key:"power", cond:()=>mainCareer==="從政", name:"公共舞台上的人生", mood:"理想、爭議、責任"},
      {key:"stars", cond:()=>mainCareer==="電影明星", name:"被世界注視的人生", mood:"光芒、壓力、孤獨"},
      {key:"earth", cond:()=>mainCareer==="農墾", name:"與土地同行的人生", mood:"土地、四季、家人"},
      {key:"academy", cond:()=>mainCareer==="學院", name:"以知識為路的人生", mood:"學習、傳承、思辨"},
      {key:"sea", cond:()=>mainCareer==="航海", name:"向遠方漂泊的人生", mood:"遠方、孤獨、見聞"},
      {key:"moon", cond:()=>mainCareer==="月球探險", name:"仰望星空的人生", mood:"理想、未知、孤獨"},
      {key:"mine", cond:()=>mainCareer==="開礦", name:"高風險與高報酬的人生", mood:"冒險、代價、資源"},
      {key:"business", cond:()=>mainCareer==="企業", name:"在市場中搏浪的人生", mood:"野心、壓力、成就"},
      {key:"solitary", cond:()=>p.happiness<10 && (finalWealth>80 || p.reputation>80), name:"擁有很多卻仍孤獨的人生", mood:"光亮、空缺、孤獨"},
      {key:"ordinary", cond:()=>true, name:"只屬於他自己的人生", mood:"選擇、錯過、堅持"},
    ];
    const archetype = archetypes.find(a=>a.cond()) || archetypes[archetypes.length-1];

    const grouped={};
    for(const item of important){
      const st=stageOf(item.ageMonths);
      grouped[st]=grouped[st]||[];
      grouped[st].push(item);
    }
    const stageOrder=["🌱 弱冠之年","🔥 而立之年","🌊 不惑之年","🍂 知天命","🌙 耳順之年","☀ 古稀之年","🌌 杖朝之年","📖 期頤之年"];
    const stageLeads={
      "🌱 弱冠之年":["年輕時的他，對未來仍有許多想像。那時的選擇多半倉促，卻也最接近心裡最初的渴望。","十八歲以後，人生像剛攤開的棋盤，每一步都不確定，卻每一步都開始留下痕跡。"],
      "🔥 而立之年":["到了而立之年，他開始知道，人生不是只有出發時的熱血，還有選擇之後必須承擔的重量。","三十歲前後，許多事不再只是嘗試，而逐漸變成方向。"],
      "🌊 不惑之年":["不惑之年並不是沒有疑惑，而是他開始懂得，有些問題不一定有標準答案。","走到中年，他開始重新衡量自己追求的東西，也開始看見某些曾被忽略的人與事。"],
      "🍂 知天命":["知天命之後，他慢慢明白，人生既有努力能改變的部分，也有只能學著接受的安排。","五十歲以後，許多得失不再那麼尖銳，卻更能看出選擇留下的紋路。"],
      "🌙 耳順之年":["耳順之年，他對世界少了一些急著反駁，多了一些願意理解。","六十歲以後，過去的掌聲與挫敗都慢慢沉澱，成為他看待人生的方式。"],
      "☀ 古稀之年":["古稀之年，許多遠方變成回憶，許多曾經放不下的事，也開始有了不同的形狀。","晚年的他不再急著證明自己，而是開始分辨，哪些東西真正值得留下。"],
      "🌌 杖朝之年":["人生走到更深處，回望比前進更常出現；那些曾經以為普通的日子，反而變得清晰。"],
      "📖 期頤之年":["最後的旅程裡，他像翻閱一本舊書，重新讀懂自己曾經走過的每一頁。"]
    };

    function eventSentence(e, idx){
      if(e.type==="branch") return `${ageText(e.ageMonths)}，他曾經站在${e.title.replace("略過","").replace("道路","")}的入口前。那條路並非沒有吸引力，只是當時的他選擇繼續往前；多年後想起，那也成為人生裡一條沒有走進去的岔路。`;
      if(e.type==="title") return `${ageText(e.ageMonths)}，${e.title}。這不只是身份的改變，也像是在他的名字旁邊，添上一道歲月留下的註解。${e.desc||""}`;
      if(e.type==="bankrupt") return `${ageText(e.ageMonths)}，他曾跌入金錢歸零的低谷。那段日子並不光彩，卻讓他知道，人有時必須先承認失去，才可能重新開始。`;
      if(/家庭|家人|伴侶|孩子|長輩/.test(e.title+e.desc)) return `${ageText(e.ageMonths)}，${e.title}。${e.desc} 這樣的片刻不一定會被外人記得，卻常常比成就更靠近一個人的心。`;
      if(e.type==="career") return `${ageText(e.ageMonths)}，他走向${e.title.replace("進入","").replace("道路","")}。那不是單純換一條路，而是把一段歲月交給另一種人生可能。`;
      return `${ageText(e.ageMonths)}，${e.title}。${e.desc}`;
    }

    const lines=[];
    lines.push(`《${displayName(p)}的一生》`);
    lines.push(`人生自傳編號：${id}`);
    lines.push(`生成版本：幸福人 Classic ${VERSION}`);
    lines.push(`生成時間：${new Date().toLocaleString()}`);
    lines.push("");
    lines.push(`【${archetype.name}】`);
    lines.push(finalReachOpening());
    lines.push(`如果要用一句話描述他後來活成的模樣，也許可以說：他成為了一位${personPhrase(finalTop)}。然而，這句話仍不足以概括全部。回頭看這些年，他的生命裡有選擇，也有錯過；有堅持，也有某些無法重新來過的時刻。`);
    lines.push(`年輕時，他替自己設定的目標是財富${p.target.wealth}、快樂${p.target.happiness}、名譽${p.target.reputation}。那組數字像是寫給未來自己的信，說明他最初相信什麼、渴望什麼，也暗示了他可能會為了什麼而努力。`);
    lines.push("");

    for(const st of stageOrder){
      const events=(grouped[st]||[]).slice(0,6);
      if(!events.length) continue;
      lines.push(`【${st}】`);
      lines.push(pick(stageLeads[st]||["這段歲月裡，他繼續往前，也繼續理解自己。"], st.length));
      events.forEach((e,i)=>lines.push(eventSentence(e,i)));
      if(events.length>=3){
        lines.push(pick([
          "那幾年看似只是日常累積，卻慢慢把他推向後來的自己。",
          "有些轉折當下並不明顯，回頭看時才知道，那些都是人生改變方向的聲音。",
          "他未必每一次都選得正確，但每一次選擇都讓人生多了一層紋理。"
        ], events.length));
      }
      lines.push("");
    }

    lines.push("【回望】");
    lines.push(`回望這一生，${p.name}最常走近的是「${mainCareer}」這條道路。這條路帶給他的，不只是數值上的變化，也塑造了他看待世界的方式。`);
    if(titleNames!=="尚未留下明確頭銜") lines.push(`他曾擁有過這些頭銜：${titleNames}。其中最後被他掛在名字上的，是「${finalTitle}」。這個頭銜的氣味，像是${titleTone}，也讓他晚年的回望多了一點特別的顏色。`);
    if(skipped.length){
      const sample=skipped.slice(0,3).map(x=>x.title.replace("略過","").replace("道路","")).join("、");
      lines.push(`他也曾經略過某些入口，例如${sample}。人生有時不是因為選了哪條路而被定義，也會因為沒有選擇哪條路而留下回音。那些未曾走進去的地方，並沒有消失，只是變成另一種想像。`);
    }
    if(hasBankrupt) lines.push("他曾經歷破產或低谷。那段經歷或許不適合被寫成榮耀，卻很適合被寫成真實。因為人不是在永遠順利的時候認識自己，而是在失去之後，才知道自己還能不能再次站起來。");
    if(families.length){
      lines.push(`家庭在他的人生裡出現了${families.length}次重要痕跡。有時是支持，有時是牽掛，有時也是責任。它們不像頭銜那樣耀眼，卻常在最安靜的地方，決定一個人是否真的感到幸福。`);
    } else {
      lines.push("在這段人生裡，家庭並不是最常被書寫的章節。也因此，到了某些安靜的時刻，他或許更能感受到，人生中沒有被選擇的關係，也會成為一種留白。");
    }
    lines.push(`最後的數值被系統記錄為：財富${finalWealth}、快樂${p.happiness}、名譽${p.reputation}。但這些數字只像書頁旁的頁碼，能幫人找到位置，卻不能替這本書下結論。`);
    lines.push("");

    lines.push("【人生的精華】");
    const essencePool={
      wealth:["他曾經相信，累積足夠多的財富，就能讓人生更自由。後來他慢慢明白，自由不只是擁有選擇，也包括知道自己願意為誰使用那些選擇。", "財富讓他走得更遠，也讓他看見更多人情的重量。到了最後，他不再只問自己擁有多少，而是問：這些擁有，是否曾讓某些重要的人過得更好。"],
      happiness:["他追求的幸福不是永遠快樂，而是在不完美的日子裡，仍能找到值得珍惜的片刻。那些笑聲、陪伴與微小的安心，最後成了他最願意帶走的東西。", "快樂對他而言，並不是逃離風雨，而是在風雨過後，仍願意為一頓飯、一句問候、一段陪伴而感到滿足。"],
      reputation:["他希望自己被世界看見，也希望自己的存在能留下某些影響。名譽帶來光，也帶來重量；但若那些影響曾讓別人的人生有一點不同，那就不是徒然。", "人終究會老去，名字也可能被時間沖淡。但他曾經做過的事，若能在他人的記憶裡繼續前行，就已經是一種留下。"],
      balance:["他的一生不是單一方向的勝利，而是在不同渴望之間反覆調整。也許正因如此，他的人生沒有被一個答案鎖住，而是保留了許多可能。", "他慢慢理解，人生不必把所有重量都放在同一件事上。能讓不同的渴望彼此安放，本身就是一種成熟。"]
    };
    lines.push(pick(essencePool[targetTop]||essencePool.balance, 31));
    lines.push("沒有人可以替另一個人的人生評級。" + `${p.name}的一生也許有成功，也許有遺憾；也許有些路走得很深，有些路只是曾經路過。但正因為那些選擇、錯過與堅持，才使這段人生只屬於他自己。`);
    lines.push("");
    const quoteByTitle = equipped?.motto;
    const quotePools={
      warm:["幸福不是把人生過得沒有裂痕，而是在裂痕之間，仍願意留下溫柔。","有些日子看起來平凡，卻在很久以後，成為一個人最想回去的地方。"],
      wealth:["真正重要的，往往不是最後擁有多少，而是你願意把擁有的東西，留給誰、用在哪裡。","財富能讓人走向遠方，但能不能回到心裡，仍要看自己如何使用它。"],
      fame:["人終將老去，但曾經留下的影響，會在他人的記憶裡繼續前行。","被世界看見是一種榮耀，也是一種責任；真正困難的是，在光裡仍記得自己。"],
      regret:["有些答案，或許直到人生最後也不一定能真正明白；但願意承認遺憾，本身也是一種誠實。","沒有走過的路不會消失，它們只是靜靜留在心裡，提醒人曾經有過選擇。"],
      legend:["人類真正的邊界，從來不只在遠方，也在每一次願意超越自己的時刻。","傳奇不是沒有代價，而是有人願意背著代價，仍把故事走完。"],
      ordinary:["有瑕疵的寶石，大家才會相信那是真實的寶石。","人生不是被磨成完美，而是在不完美中仍能折射出自己的光。"]
    };
    const quote = quoteByTitle || pick(quotePools[archetype.key] || quotePools[targetTop] || quotePools.ordinary, 77);
    lines.push("【人生留下的一句話】");
    lines.push(`「${quote.replace(/^「|」$/g,"")}」`);
    lines.push("");
    lines.push("本自傳由《幸福人 Classic》人生自傳系統生成。敘事模板、事件文本、系統設計與遊戲內容為原創智慧財產；未經授權不得重製、改作或商業使用。");
    return lines.join("\n");
  }

  function downloadTxt(){
    const blob=new Blob([autobiography],{type:"text/plain;charset=utf-8"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob); a.download=`幸福人_人生自傳_${Date.now()}.txt`; a.click(); URL.revokeObjectURL(a.href);
  }


  function makeLifeBookRecord(p, reason, text){
    const firstLine=(text.split("\n").find(Boolean)||`《${displayName(p)}的一生》`).replace(/[《》]/g,"");
    const mottoMatch=text.match(/【人生留下的一句話】\n「([^」]+)」/);
    const idMatch=text.match(/人生自傳編號：([^\n]+)/);
    const equipped=(p.titles||[]).find(t=>t.id===p.equippedTitleId) || p.titles?.[p.titles.length-1];
    return {
      id:idMatch?.[1] || uid(),
      title:firstLine,
      playerName:p.name,
      displayName:displayName(p),
      animal:p.animal,
      age:ageText(p.ageMonths),
      savedAt:new Date().toISOString(),
      mainTitle:equipped?.title || "人生旅人",
      mainCareer:Object.entries(p.careerCounts||{}).sort((a,b)=>b[1]-a[1])[0]?.[0] || "人生",
      wealth:clampWealthCash(p.cash),
      cash:p.cash,
      happiness:p.happiness,
      reputation:p.reputation,
      motto:mottoMatch?.[1] || "這段人生已被寫下。",
      reason,
      autobiography:syncNarrativeNaming(text)
    };
  }

  function saveLifeLibrary(next){
    const clean=(next||[]).slice(0,20).map(x=>({...x, autobiography:syncNarrativeNaming(x.autobiography||""), motto:syncNarrativeNaming(x.motto||"")}));
    setLifeLibrary(clean);
    localStorage.setItem("lifeLibrary", JSON.stringify(clean));
  }

  function collectCurrentLife(){
    if(!autobiography || !endingRecord){
      setModal({title:"尚無可收藏的人生", desc:"請先完成一段人生並產生人生小說。"});
      return;
    }
    const record={...endingRecord, autobiography:syncNarrativeNaming(autobiography), savedAt:new Date().toISOString()};
    if((lifeLibrary||[]).some(x=>x.id===record.id)){
      setModal({title:"這段人生已在藏書館", desc:"你已經收藏過這段人生。", actions:[{label:"開啟人生藏書館", onClick:showLifeLibrary},{label:"關閉", onClick:()=>setModal(null)}]});
      return;
    }
    if((lifeLibrary||[]).length<20){
      saveLifeLibrary([record,...lifeLibrary]);
      setModal({title:"📚 已收藏這段人生", desc:`《${record.title}》已放入人生藏書館。`, actions:[{label:"開啟人生藏書館", onClick:showLifeLibrary},{label:"關閉", onClick:()=>setModal(null)}]});
      return;
    }
    setModal({
      title:"📚 人生藏書館已滿",
      desc:"你目前已收藏20段人生。若想留下新的故事，請選擇一本人生回憶覆蓋。",
      custom:<div className="lifeLibrary overwriteList">{lifeLibrary.map((book,idx)=><button key={book.id||idx} className="lifeBook overwriteBook" onClick={()=>overwriteLifeBook(idx, record)}><b>{book.animal}《{book.title}》</b><small>{book.age}｜{book.mainTitle}</small><p>「{book.motto}」</p></button>)}</div>,
      actions:[{label:"先不收藏", onClick:()=>setModal(null)}]
    });
  }

  function overwriteLifeBook(index, record){
    const next=[...lifeLibrary];
    const old=next[index];
    next[index]=record;
    saveLifeLibrary(next);
    setModal({title:"📚 已放入新的人生", desc:`你放下了《${old?.title||"某段人生"}》，收藏了《${record.title}》。這段人生將在藏書館中等待再次被閱讀。`, actions:[{label:"開啟人生藏書館", onClick:showLifeLibrary},{label:"關閉", onClick:()=>setModal(null)}]});
  }

  function showLifeLibrary(){
    const books=lifeLibrary || [];
    setModal({
      title:"📚 人生藏書館",
      desc:`已收藏 ${books.length}/20 段人生。每一本，都是曾經活過的一種可能。`,
      custom:<div className="lifeLibrary">{books.length?books.map((book,idx)=><article key={book.id||idx} className="lifeBook"><div className="lifeBookCover"><span>{book.animal||"📖"}</span><b>《{book.title}》</b><small>{book.age}｜{book.mainTitle}</small></div><p>「{book.motto}」</p><div className="bookActions"><button onClick={()=>readLifeBook(book)}>重新閱讀</button><button onClick={()=>downloadBook(book)}>下載</button></div></article>):<p className="emptyShelf">藏書館還是空的。完成一段人生後，可以在結局頁收藏它。</p>}</div>,
      actions:[{label:"關閉", onClick:()=>setModal(null)}]
    });
  }

  function readLifeBook(book){
    setModal({
      title:`📖 《${book.title}》`,
      desc:`${book.animal||""} ${book.displayName||book.playerName||"人生旅人"}｜${book.age}｜${book.mainTitle}`,
      custom:<pre className="bookReader">{syncNarrativeNaming(book.autobiography||"")}</pre>,
      actions:[{label:"下載這本人生", onClick:()=>downloadBook(book)},{label:"返回藏書館", onClick:showLifeLibrary},{label:"關閉", onClick:()=>setModal(null)}]
    });
  }

  function downloadBook(book){
    const blob=new Blob([syncNarrativeNaming(book.autobiography||"")],{type:"text/plain;charset=utf-8"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download=`幸福人_人生藏書_${book.title||Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function titleInfo(t, ownerIndex=turn){
    const owner=players[ownerIndex] || current;
    const equipped = owner?.equippedTitleId === t.id;
    const canEquip = ownerIndex === turn && !gameOver;
    const backToList = () => showPlayerWallet(ownerIndex);
    const {positive, cost}=splitTitleEffects(t);
    const fixed=[];
    if(t.salaryRaise) fixed.push(`加薪 ${t.salaryRaise}`);
    if(t.rep) fixed.push(`名譽 ${t.rep>0?'+':''}${t.rep}`);
    if(t.happy) fixed.push(`快樂 ${t.happy>0?'+':''}${t.happy}`);
    setModal({
      title:`${rarityStars(t.rarity)} 頭銜資訊｜${t.title}`,
      desc:null,
      custom:<div className="titleDetail">
        <div className={`titleInfoFrame ${rarityClass(t.rarity)}`}><span className="starBadge">{rarityStars(t.rarity)}</span><b>{t.title}</b><small>{displayRarity(t.rarity)}｜{titleTierText(t)}｜{t.career || '人生事件'}</small></div>
        <section><h3>人生描述</h3><p>{t.desc || '這是一段逐漸成形的人生身份。'}</p></section>
        {fixed.length?<section><h3>固定效果</h3><ul>{fixed.map(x=><li key={x}>{x}</li>)}</ul></section>:null}
        <section><h3>正向效果</h3>{positive.length?<ul>{positive.map(x=><li key={x}>{x}</li>)}</ul>:<p>無明顯正向加成。</p>}</section>
        <section><h3>人生代價</h3>{cost.length?<ul>{cost.map(x=><li key={x}>{x}</li>)}</ul>:<p>無明顯代價。</p>}</section>
        {t.motto?<section className="mottoBlock"><h3>人生格言</h3><blockquote>{t.motto}</blockquote></section>:null}
        {t.narrative?<section><h3>人生小說傾向</h3><p>{t.narrative}</p></section>:null}
        <p className="equipHint">{equipped?'目前裝備中。':canEquip?'你可以將此頭銜裝備為目前的人生身份。':'只能在該玩家回合切換頭銜。'}</p>
      </div>,
      actions: equipped || !canEquip
        ? [
            {label:"返回頭銜列表", onClick:backToList},
            {label:"關閉", onClick:()=>setModal(null)}
          ]
        : [
            {label:"裝備此頭銜", onClick:()=>equipTitle(t.id, ownerIndex)},
            {label:"返回頭銜列表", onClick:backToList},
            {label:"關閉", onClick:()=>setModal(null)}
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
      custom:<div className="mobileWalletTitles">{(p.titles||[]).length?(p.titles.map(t=><button key={t.id} className={`${rarityClass(t.rarity)} ${t.id===p.equippedTitleId?'equipped':''}`} onClick={()=>titleInfo(t, ownerIndex)}><span className="starBadge">{rarityStars(t.rarity)}</span>{t.id===p.equippedTitleId?'✓ ':''}{t.title}<small>{titleTierText(t)}｜{displayRarity(t.rarity)}｜點擊查看</small></button>)):<p>尚未取得頭銜。</p>}</div>,
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

  function buildFeedbackUrl(){
    const p = endingRecord || (current ? makeLifeBookRecord(current, gameOver ? '人生結算' : '遊戲中回饋', autobiography || '') : null);
    const params = new URLSearchParams({usp:'pp_url'});
    if(p){
      params.set(FEEDBACK_ENTRIES.systemInfo, '000');
      params.set(FEEDBACK_ENTRIES.playerName, p.playerName || '');
      params.set(FEEDBACK_ENTRIES.lifeId, p.id || uid());
      params.set(FEEDBACK_ENTRIES.gameVersion, VERSION);
      params.set(FEEDBACK_ENTRIES.lifeType, p.lifeType || '尚未判定');
      params.set(FEEDBACK_ENTRIES.mainTitle, p.mainTitle || '尚無頭銜');
      params.set(FEEDBACK_ENTRIES.achievementAge, p.age || '');
      params.set(FEEDBACK_ENTRIES.wealth, String(p.wealth ?? ''));
      params.set(FEEDBACK_ENTRIES.happiness, String(p.happiness ?? ''));
      params.set(FEEDBACK_ENTRIES.fame, String(p.reputation ?? ''));
      params.set(FEEDBACK_ENTRIES.mostImpressiveTitle, p.mainTitle || '');
      params.set(FEEDBACK_ENTRIES.extraNote, `自動帶入：${p.playerName||''}｜${p.lifeType||''}｜${p.age||''}｜${p.mainTitle||''}`);
    }else{
      params.set(FEEDBACK_ENTRIES.systemInfo, '000');
      params.set(FEEDBACK_ENTRIES.gameVersion, VERSION);
    }
    return `${FEEDBACK_FORM_URL}?${params.toString()}`;
  }

  function openFeedbackForm(){
    window.open(buildFeedbackUrl(), '_blank', 'noopener,noreferrer');
  }

  function showFeedbackModal(){
    setModal({
      title:"💬 回饋作者",
      desc:"感謝你願意回饋《幸福人》。系統會自動帶入本次人生資料，你只需要填寫感受與建議。",
      custom:<div className="feedbackPreview"><p>將自動帶入：玩家名稱、人生編號、遊戲版本、人生類型、主要頭銜、達成年齡與三項數值。</p></div>,
      actions:[{label:"開啟回饋表單", onClick:openFeedbackForm},{label:"關閉", onClick:()=>setModal(null)}]
    });
  }


  function showTitleCodex(selectedCareer="全部"){
    const raw=titleCodex || [];
    const modernKeys=modernTitleKeySet();
    const unlocked=migrateLegacyCodexRecords(raw);
    if(JSON.stringify(raw)!==JSON.stringify(unlocked)){
      localStorage.setItem("titleCodex", JSON.stringify(unlocked));
      setTitleCodex(unlocked);
    }
    const isModernRec=(x)=>modernKeys.has(`${x.career}-${x.title}`);
    const modernRecords=unlocked.filter(isModernRec);
    const legacyRecords=unlocked.filter(x=>!isModernRec(x));
    const unlockedMap=new Map(modernRecords.map(x=>[`${x.career}-${x.title}`,x]));
    const all=flattenTitlePools();
    const groups=careers.map(c=>({career:c, titles:all.filter(t=>t.career===c), legacy:legacyRecords.filter(x=>(x.originalCareer||x.career)===c)}));
    const orphanLegacy=legacyRecords.filter(x=>!careers.includes(x.originalCareer||x.career));
    const total=all.length;
    const unlockedTotal=all.filter(t=>unlockedMap.has(`${t.career}-${t.title}`)).length;
    const visibleGroups=selectedCareer==="全部"?groups:groups.filter(g=>g.career===selectedCareer);
    const showOrphanLegacy=selectedCareer==="全部" && orphanLegacy.length>0;
    setModal({
      title:"🏆 頭銜集卡冊",
      desc:`現代頭銜 ${unlockedTotal}/${total}｜📜經典頭銜 ${legacyRecords.length}｜總收藏 ${unlockedTotal + legacyRecords.length}。舊版本頭銜會以經典頭銜保存，不會覆蓋新版240頭銜。`,
      custom:<div className="titleAlbum">
        <div className="albumTabs"><button className={selectedCareer==="全部"?'active':''} onClick={()=>showTitleCodex('全部')}>全部<small>{unlockedTotal}/{total}+📜{legacyRecords.length}</small></button>{careers.map(c=>{const g=groups.find(x=>x.career===c); const n=g.titles.filter(t=>unlockedMap.has(`${c}-${t.title}`)).length; const legacyN=g.legacy.length; return <button key={c} className={selectedCareer===c?'active':''} onClick={()=>showTitleCodex(c)}>{c}<small>{n}/{g.titles.length}{legacyN?`＋📜${legacyN}`:""}</small></button>})}</div>
        <div className="titleCodex paged">{visibleGroups.map(g=><section key={g.career} className="codexGroup"><h3>{g.career}｜現代頭銜 {g.titles.filter(t=>unlockedMap.has(`${g.career}-${t.title}`)).length}/{g.titles.length}{g.legacy.length?`｜📜經典 ${g.legacy.length}`:""}</h3>{g.legacy.length?<div className="codexLegacyList"><h4>📜 經典頭銜</h4><div className="codexGrid legacyGrid">{g.legacy.map(t=><div key={`legacy-${t.title}`} className="codexCard legacy"><span className="starBadge">📜</span><b>{t.title}</b><small>經典頭銜｜舊版本收藏</small><p>{t.motto || t.desc || "這是舊版本留下的經典頭銜，記錄著幸福人早期的人生痕跡。"}</p>{t.firstAge?<em>首次取得：{t.firstAge}</em>:null}</div>)}</div></div>:null}<div className="codexGrid">{g.titles.map(t=>{const rec=unlockedMap.get(`${g.career}-${t.title}`); const open=!!rec; return <div key={t.title} className={`codexCard ${open?rarityClass(t.rarity):"locked"}`}><span className="starBadge">{open?rarityStars(t.rarity):"？"}</span><b>{open?t.title:"？？？"}</b><small>{open?`${displayRarity(t.rarity)}｜${titleTierText(t)}`:"尚未理解的人生"}</small><p>{open?(t.motto || t.desc):"有人曾在這條道路上走得更深，留下了尚未被你理解的人生痕跡。"}</p>{open&&rec.firstAge?<em>首次取得：{rec.firstAge}</em>:null}</div>})}</div></section>)}{showOrphanLegacy?<section className="codexGroup legacyGroup"><h3>📜 其他經典頭銜｜{orphanLegacy.length}</h3><div className="codexGrid legacyGrid">{orphanLegacy.map(t=><div key={`orphan-${t.title}`} className="codexCard legacy"><span className="starBadge">{isFounderTitle(t)?"🏅":"📜"}</span><b>{t.title}</b><small>{isFounderTitle(t)?"限定紀念頭銜":"經典頭銜｜舊版本收藏"}</small><p>{t.motto || t.desc || "這是舊版本留下的經典頭銜，記錄著幸福人早期的人生痕跡。"}</p>{t.firstAge?<em>首次取得：{t.firstAge}</em>:null}</div>)}</div></section>:null}</div>
      </div>,
      actions:[{label:"關閉", onClick:()=>setModal(null)}]
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

  if(screen==="setup") return <div className="app setup"><h1>幸福人 Classic <span>{VERSION}</span></h1><div className="setupPanel"><label>玩家人數 <select value={playerCount} onChange={e=>setPlayerCount(Number(e.target.value))}>{[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></label>{setupPlayers.map((p,i)=>{const sum=targetSum(p.target); return <div className="setupCard" key={i}><div className="row"><input value={p.name} onChange={e=>setSetupPlayers(arr=>arr.map((x,j)=>j===i?{...x,name:e.target.value}:x))}/><select value={p.animal} onChange={e=>setSetupPlayers(arr=>arr.map((x,j)=>j===i?{...x,animal:e.target.value}:x))}>{animals.map(a=><option key={a}>{a}</option>)}</select></div><div className="targetGrid">{[["wealth","財富"],["happiness","快樂"],["reputation","名譽"]].map(([k,label])=><label key={k}>{label}<input type="range" min="0" max="100" value={p.target[k]} onChange={e=>setSetupPlayers(arr=>arr.map((x,j)=>j===i?{...x,target:{...x.target,[k]:Number(e.target.value)}}:x))}/><input type="number" min="0" max="100" value={p.target[k]} onChange={e=>setSetupPlayers(arr=>arr.map((x,j)=>j===i?{...x,target:{...x.target,[k]:Number(e.target.value)}}:x))}/></label>)}</div><div className={sum===100?"ok hint":"bad hint"}>目標總和：{sum}／100　{sum<100?`尚缺 ${100-sum}`:sum>100?`超出 ${sum-100}`:"可以開始"}</div></div>})}<button className="primary" onClick={startGame}>開始人生</button><button onClick={showReleaseNotes}>📜 更新日誌</button><button onClick={showTitleCodex}>🏆 頭銜收藏冊</button><button onClick={showLifeLibrary}>📚 人生藏書館</button></div>{modal&&<Modal modal={modal} close={()=>setModal(null)}/>}</div>;

  if(screen==="autobiography") return <div className="app endingPage"><h1>📖 人生結局</h1><pre className="autobio">{autobiography}</pre><div className="endingActions"><button className="primary" onClick={downloadTxt}>下載人生自傳 .txt</button><button onClick={collectCurrentLife}>📚 收藏這段人生</button><button onClick={showSupportModal}>💖 贊助支持</button><button onClick={showFeedbackModal}>💬 回饋作者</button><button onClick={restartGame}>🔄 重玩一次</button></div><section className="supportPanel"><div><h2>🌱 支持幸福人計畫</h2><p>如果你喜歡這段人生旅程，歡迎贊助 100 元支持《幸福人》的持續開發。</p><p>你的支持，將成為更多人生故事誕生的力量。</p></div><img src="/support_qr.jpg" onError={e=>{e.currentTarget.style.display='none'}} alt="支持幸福人 QR Code"/></section>{modal&&<Modal modal={modal} close={()=>setModal(null)}/>}</div>;

  return <div className="app"><audio ref={mainAudioRef} src={MAIN_BGM}/><audio ref={careerAudioRef} src={CAREER_BGM}/>{showCoinRain&&<CoinRain/>}{showStarRain&&<StarRain/>}<header><h1>幸福人 Classic <span>{VERSION}</span></h1><div className="topActions"><button onClick={showReleaseNotes}>📜 更新日誌</button><button onClick={showTitleCodex}>🏆 頭銜收藏冊</button><button onClick={showLifeLibrary}>📚 人生藏書館</button><button onClick={()=>setMusic(!music)}>{music?'🔊 音樂開':'🔇 音樂關'}</button><button onClick={()=>setSfx(!sfx)}>{sfx?'🔔 音效開':'🔕 音效關'}</button><button onClick={()=>triggerStarEvent(true)}>🧪 測試流星</button><div className="supporterBox"><input placeholder="支持者序號" value={supporterInput} onChange={e=>setSupporterInput(e.target.value)}/><button onClick={unlockSupporter}>{supporter||starSupporter?'🌟 已啟用':'啟用特效'}</button></div></div><div className="topLog"><b>Recent Log</b>{logs.slice(0,3).map((l,i)=><p key={i}>{l}</p>)}</div></header><main className="gameLayout"><section className="boardWrap"><div className="outerBoard">{outerBoard.map((tile,i)=><div key={tile.id} className={`tile pos${i} ${boardTile?.id===tile.id?'active':''}`}><span>{i}</span><b>{tile.icon}</b><small>{tile.name}</small><div className="tokens">{players.filter(p=>!p.career&&p.outerPos===i).map(p=><em key={p.id}>{p.animal}</em>)}</div></div>)}<div className="centerStage"><div className="turnBox compactTurn"><div className="turnHeader"><div><h2>{current?.animal} {current&&displayName(current)}</h2><p>{current&&ageText(current.ageMonths)}｜{current&&stageOf(current.ageMonths)}</p></div><button className="primary inlineRoll" disabled={moving||gameOver} onClick={rollDice}>{moving?"移動中":"擲骰"}</button></div><div className="dice">{dice?dice.total:"🎲"}</div><p>{current?.career?`目前在${current.career}內圈，使用單骰。進度 ${(current.careerProgress||0)}/${(current.careerLayout||careerBoards[current.career]).length}`:"外圈人生道路，使用雙骰。"}</p></div><div className="wallet"><h3>人生皮夾</h3><p>現金：{current&&money(current.cash)}</p><p>薪水：{current&&money(current.salary)}</p><p>財富：{wealthScore}｜快樂：{current?.happiness}｜名譽：{current?.reputation}</p><p>目標：{current?.target.wealth}/{current?.target.happiness}/{current?.target.reputation}</p><h4>頭銜</h4><div className="titles">{current?.titles.length?current.titles.map(t=><button key={t.id} title="點擊查看頭銜屬性或裝備" className={`${rarityClass(t.rarity)} ${t.id===current.equippedTitleId?'equipped':''}`} onClick={()=>titleInfo(t)}><span className="starBadge">{rarityStars(t.rarity)}</span>{t.id===current.equippedTitleId?'✓ ':''}{t.title}<small>{titleTierText(t)}｜{displayRarity(t.rarity)}</small></button>):<span>尚無頭銜</span>}</div></div></div></div></section><aside className="players">{players.map((p,i)=><div key={p.id} className={`playerCard ${rarityClass(equippedTitle(p)?.rarity)} ${i===turn?'current':''}`}><b>{p.animal} {displayName(p)}</b><p>{ageText(p.ageMonths)}</p><p>現金 {money(p.cash)}｜快樂 {p.happiness}｜名譽 {p.reputation}</p><p>{p.career?`正在${p.career}｜進度 ${(p.careerProgress||0)}/${(p.careerLayout||careerBoards[p.career]).length}`:`外圈 ${p.outerPos}`}</p><button className="walletOpenBtn" onClick={()=>showPlayerWallet(i)}>查看人生皮夾／頭銜</button></div>)}</aside></main>{modal&&<Modal modal={modal} close={()=>setModal(null)}/>}</div>;
}

function CoinRain(){
  const coins=useMemo(()=>Array.from({length:36},(_,i)=>({id:i,left:Math.random()*100,delay:Math.random()*0.6,duration:1.1+Math.random()*0.9,size:22+Math.random()*18,spin:Math.random()>0.5?1:-1})),[]);
  return <div className="coinRain" aria-hidden="true"><div className="salaryToast">💰 發薪日！</div>{coins.map(c=><span className="coinDisc" key={c.id} style={{left:`${c.left}%`,animationDelay:`${c.delay}s`,animationDuration:`${c.duration}s`,width:`${c.size}px`,height:`${c.size}px`,['--spin']:c.spin}} />)}</div>
}

function AchievementPicker({choices, career, nextCount, player, titleCodex, onConfirm}){
  const [selected,setSelected]=useState(0);
  const selectedChoice=choices[selected] || choices[0];
  const allCareerTitles=Object.values(titlePools[career]||{}).flat().map(t=>normalizeTitle(t,career,t.tier || 1));
  const totalKeys=new Set(allCareerTitles.map(t=>`${career}-${t.title}`));
  const ownedKeys=new Set([
    ...(titleCodex||[]).filter(x=>x.career===career).map(x=>`${career}-${x.title}`),
    ...(player?.titles||[]).filter(x=>x.career===career).map(x=>`${career}-${x.title}`)
  ].filter(k=>totalKeys.has(k)));
  const ownedInCareer=ownedKeys.size;
  const poolTotal=totalKeys.size || allCareerTitles.length || choices.length;
  return <div className="achievementPicker">
    <p className="collectionHint">{career}收藏進度：{ownedInCareer}/{poolTotal}。{poolTotal-ownedInCareer>0?`還差 ${poolTotal-ownedInCareer} 個頭銜。`:"已完成這條人生道路的頭銜收藏。"}</p>
    <div className="achievementChoices">
      {choices.map((a,idx)=>{const owned=playerHasTitle(player,a) || codexHasTitle(titleCodex,a); return <button type="button" key={idx} className={`${idx===selected?'selected':''} ${owned?'ownedChoice':'newChoice'}`} onClick={()=>setSelected(idx)} aria-pressed={idx===selected}>
        <b>{idx===selected?'✓ 已選擇｜':''}{a.title}</b>
        <span>{a.desc}</span>
        <em>{owned?'📚 已收藏':'🌟 首次解鎖'}</em>
      </button>})}
    </div>
    <div className="modalActions achievementConfirm">
      <button className="primary" onClick={()=>onConfirm(career, selectedChoice, nextCount)}>確認取得頭銜</button>
    </div>
  </div>
}




function StarRain(){
  const stars=useMemo(()=>Array.from({length:28},(_,i)=>({id:i,top:Math.random()*70,left:60+Math.random()*40,delay:Math.random()*1.2,duration:1.8+Math.random()*1.5,size:2+Math.random()*3})),[]);
  return <div className="starRain" aria-hidden="true"><div className="starToast">🌠 流星雨之夜</div>{stars.map(s=><span key={s.id} className="shootingStar" style={{top:`${s.top}%`,left:`${s.left}%`,animationDelay:`${s.delay}s`,animationDuration:`${s.duration}s`,['--starSize']:`${s.size}px`}} />)}</div>
}

function Modal({modal,close}){ return <div className="modalBackdrop"><div className={`modal ${modal.locked?"modalLocked":""}`}>{!modal.locked&&<button className="modalClose" onClick={close} aria-label="關閉">×</button>}<div className="modalHeader"><h2>{modal.title}</h2></div><div className="modalBody">{modal.desc&&<p className="modalDesc">{modal.desc}</p>}{modal.custom}</div>{modal.actions?<div className="modalActions">{modal.actions.map((a,i)=><button key={i} className={i===0?'primary':''} onClick={a.onClick}>{a.label}</button>)}</div>:modal.custom?null:<div className="modalActions"><button className="primary" onClick={close}>確認</button></div>}</div></div> }

createRoot(document.getElementById("root")).render(<App />);
