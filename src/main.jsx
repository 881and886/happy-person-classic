
import React, { useMemo, useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const VERSION = "V3.7 頭銜宇宙與職業事件整合版";
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
  playerName: "entry.129605564",
  lifeId: "entry.1106737648",
  gameVersion: "entry.1205632976",
  lifeType: "entry.211790992",
  mainTitle: "entry.1709456881",
  achievementAge: "entry.232703430",
  wealth: "entry.990235420",
  happiness: "entry.1022010614",
  fame: "entry.261787525",
  favoritePart: "entry.1463652126",
  improvement: "entry.445014700",
  mostImpressiveCareer: "entry.1452324522",
  mostImpressiveTitle: "entry.619547856",
  playAgain: "entry.1581778550",
  messageToAuthor: "entry.1575234988",
  messageToNextPlayer: "entry.1224188089",
  extraNote: "entry.1755803895"
};

const animals = ["🐱", "🐶", "🦊", "🐼", "🐧", "🐸", "🦁", "🐰"];
const careers = ["學院", "農墾", "企業", "航海", "月球探險", "電影明星", "從政", "開礦"];

const releaseNotes = [

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
      "id": "evt-學院-1",
      "title": "課堂觀察員",
      "desc": "你坐在階梯教室的最後一排，看著教授在黑板上寫下複雜的公式，突然發現其中一個關鍵符號寫錯了。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "課堂觀察員"
    },
    {
      "id": "evt-學院-2",
      "title": "筆記的墨水",
      "desc": "你連續熬夜三天整理的期末精準筆記，不小心被隔壁桌的同學打翻的黑咖啡完全浸濕，字跡模糊不清。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "筆記整理員"
    },
    {
      "id": "evt-學院-3",
      "title": "錯過班次",
      "desc": "你起晚了，眼睜睜看著前往校際學術交流會的最後一班接駁車開走，這意味著你將錯過早上的大師演講。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "學習旅人"
    },
    {
      "id": "evt-學院-4",
      "title": "讀書會的爭辯",
      "desc": "在今晚的文學讀書會上，你與一位學長針對古典哲學的定義產生了激烈的爭吵，現場氣氛一度降到冰點。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "讀書會成員"
    },
    {
      "id": "evt-學院-5",
      "title": "教授的咖啡",
      "desc": "導師在實驗室裡把你叫住，遞給你一杯溫熱的咖啡，拍拍你的肩膀說你最近的數據整理得非常漂亮。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "研究助理"
    },
    {
      "id": "evt-學院-6",
      "title": "犀利的提問",
      "desc": "在系館舉辦的公開座談會上，你當眾提出了一個極具破壞性的反向問題，台上的客座教授瞬間愣在原地。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "提問探索者"
    },
    {
      "id": "evt-學院-7",
      "title": "圖書館的邂逅",
      "desc": "你在尋找絕版文獻時，與另一位同學同時伸手拿向同一本書，兩人的手指在冰冷的書架間輕輕碰觸。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "知識分享人"
    },
    {
      "id": "evt-學院-8",
      "title": "社群放鴿子",
      "desc": "你發起的校園跨學科研究社群原本約好今晚開會，時間到了卻只有你一個人坐在空蕩蕩的討論室裡。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "社群參與者"
    },
    {
      "id": "evt-學院-9",
      "title": "專題報告崩潰",
      "desc": "在即將上台簡報的前五分鐘，你的筆記型電腦突然藍屏死機，所有的簡報檔案與實踐數據瞬間無法讀取。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "專題實踐者"
    },
    {
      "id": "evt-學院-10",
      "title": "失竊的腳踏車",
      "desc": "你在校園打工下班後，發現停在系館門口的舊腳踏車被人偷走了，你不得不拖著疲憊的身體走回宿舍。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "校園服務員"
    },
    {
      "id": "evt-學院-11",
      "title": "無人按讚的推廣",
      "desc": "你精心撰寫並發布在校園論壇上的科普短文，經過了一整天依然只有零星的點閱，甚至還收到一條惡評。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "學習推廣員"
    },
    {
      "id": "evt-學院-12",
      "title": "禁閱區的鑰匙",
      "desc": "你在舊圖書館管理員的桌子底下，意外撿到了一把掛著古老銅牌、寫著「未編目檔案室」的生鏽鑰匙。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "學術探索者"
    },
    {
      "id": "evt-學院-13",
      "title": "老人的求知欲",
      "desc": "一位年近八旬的老爺爺顫巍巍地走進你的讀書會，希望你能教他如何使用現代平板電腦來閱讀電子文獻。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "終身學習者"
    },
    {
      "id": "evt-學院-14",
      "title": "論文的交叉點",
      "desc": "你發現自己苦思冥想了一整年的核心思辨理論，竟然在昨天被國外某個知名學術期刊搶先發表了。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "思辨實踐家"
    },
    {
      "id": "evt-學院-15",
      "title": "偏鄉的黑板",
      "desc": "你跟隨志工團隊來到資源匱乏的偏遠山區學校，當你用彩色粉筆在破舊的黑板上畫出太陽系時，孩子們眼神亮了。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "教育志工"
    },
    {
      "id": "evt-學院-16",
      "title": "二手書的夾層",
      "desc": "你在校園跳蚤市場買下的一本厚重舊字典裡，翻出了一張三十年前由某位學長寫給初戀情人的泛黃情書。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "學習旅人"
    },
    {
      "id": "evt-學院-17",
      "title": "停電的實驗室",
      "desc": "正當你的化學合成實驗進入最關鍵的離心分離階段時，整棟化學大樓突然毫無預警地全面停電。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "研究助理"
    },
    {
      "id": "evt-學院-18",
      "title": "被質疑的引用",
      "desc": "你在堂上發表的論文小樣被一位嚴厲的教授當眾指出引用文獻來源不夠權威，懷疑你的推論流於膚淺。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "提問探索者"
    },
    {
      "id": "evt-學院-19",
      "title": "失控的校園流浪狗",
      "desc": "你在穿過校園後山林道時，被三隻具有攻擊性的流浪狗圍堵，手裡抱著的厚重精裝教科書成了你唯一的盾牌。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "學習旅人"
    },
    {
      "id": "evt-學院-20",
      "title": "學術海報被撕毀",
      "desc": "你留在展覽廳、準備明天參加全校評選的學術成果海報，不知被誰惡意用美工刀割得破破爛爛。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "專題實踐者"
    },
    {
      "id": "evt-學院-21",
      "title": "助學金的及時雨",
      "desc": "在你因為下學期學費毫無著落而愁眉不展時，電子郵件通知你成功獲得了一筆民間企業提供的獎助學金。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "校園服務員"
    },
    {
      "id": "evt-學院-22",
      "title": "無效的聯署",
      "desc": "你發起的「延長圖書館深夜開放時間」聯署活動，因為格式不符校方規定，被學務處冷冰冰地直接退回。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "社群參與者"
    },
    {
      "id": "evt-學院-23",
      "title": "大師的課堂點名",
      "desc": "那位享譽國際、以脾氣古怪著稱的客座講座教授，在幾百人的大講堂上突然念出你的名字，要求你起立回答。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "提問探索者"
    },
    {
      "id": "evt-學院-24",
      "title": "走廊的積水",
      "desc": "教學大樓頂樓水管破裂，積水一路蔓延到你們的專題研究室，你珍藏的好幾本絕版參考書不幸被泡壞。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "專題實踐者"
    },
    {
      "id": "evt-學院-25",
      "title": "校慶的免費攤位",
      "desc": "你在校慶園遊會上擺了一個「心理學趣味測驗」的攤位，沒想到反響熱烈，排隊的人潮一度堵塞了通道。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "學習推廣員"
    },
    {
      "id": "evt-學院-26",
      "title": "弄丟的借書證",
      "desc": "你在準備進期末考總複習時，發現自己的借書證不見了，館員表示在補辦期間你無法進入核心自習室。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "讀書會成員"
    },
    {
      "id": "evt-學院-27",
      "title": "過期的文獻",
      "desc": "你熬夜翻譯出的外文古代理論，隔天被導師告知該理論早在十年前就已經被學術界證實存在邏輯漏洞。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "學術探索者"
    },
    {
      "id": "evt-學院-28",
      "title": "深夜的敲門聲",
      "desc": "深夜你在研究室敲打鍵盤時，門外傳來急促的敲門聲，開門卻發現地上只有一個裝滿未知植物標本的紙箱。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "研究助理"
    },
    {
      "id": "evt-學院-29",
      "title": "跨系的情感糾紛",
      "desc": "你因為在公共課上與外系的系草討論問題過於熱烈，隔天莫名其妙在學校匿名論壇上被貼上了第三者的標籤。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "社群參與者"
    },
    {
      "id": "evt-學院-30",
      "title": "被拒絕的投稿",
      "desc": "你滿懷信心投給校刊的哲學散文被主編以「語意過於晦澀、不符合大眾口味」為由，冷酷地予以退稿。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "知識分享人"
    },
    {
      "id": "evt-學院-31",
      "title": "畢業論文的硬碟",
      "desc": "你存放碩士畢業論文終極修訂版的隨身碟在插進影印店電腦時，不幸感染了頑固病毒，文件全部變成亂碼。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "專題實踐者"
    },
    {
      "id": "evt-學院-32",
      "title": "實驗室的流言",
      "desc": "系譜裡突然流傳開一個謠言，說你之所以能拿到這次的院長獎學金，是因為私底下向評審教授送了禮。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "研究助理"
    },
    {
      "id": "evt-學院-33",
      "title": "意外的代課機會",
      "desc": "你的指導教授因為突發急性盲腸炎住院，系主任臨時找不到人，緊急指派你代替教授去給大一新生上課。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "知識分享人"
    },
    {
      "id": "evt-學院-34",
      "title": "演講廳的音響故障",
      "desc": "你主持的跨校辯論大賽進行到最精彩的結辯階段時，現場的音響系統突然發出刺耳的尖叫聲並徹底罷工。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "社群參與者"
    },
    {
      "id": "evt-學院-35",
      "title": "被抄襲的隨堂測驗",
      "desc": "坐在你後座的學長在期中考時一直偷看你的試卷，考完後他竟然惡人先告狀，跑去跟助教檢舉你作弊。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "課堂觀察員"
    },
    {
      "id": "evt-學院-36",
      "title": "社團經費被砍",
      "desc": "你擔任社長的哲學思辨社，因為本學期出席人數未達標準，被學生會通知下半年的活動經費將被砍掉一半。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "社群參與者"
    },
    {
      "id": "evt-學院-37",
      "title": "迷路的國際交換生",
      "desc": "一名剛報到的外國交換生在校園裡迷了路，急得快要哭出來，你主動走上前用流暢的外語指引他前往宿舍。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "學習旅人"
    },
    {
      "id": "evt-學院-38",
      "title": "被雨困住的午後",
      "desc": "一場突如其來的暴雨把你困在綜合教學大樓的屋簷下，你與身旁同樣沒帶傘的陌生教授聊了一個下午的近代史。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "知識分享人"
    },
    {
      "id": "evt-學院-39",
      "title": "打工遲到的扣薪",
      "desc": "因為圖書館借還書系統臨時故障，你為了協助讀者而延誤了工讀打卡，結果被不知情的組長按規定扣了薪水。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "校園服務員"
    },
    {
      "id": "evt-學院-40",
      "title": "被遺忘的生日",
      "desc": "在你生日這天，你一個人在研究室裡對著密密麻麻的文獻代碼直到深夜，沒有收到任何一條祝福訊息。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "終身學習者"
    },
    {
      "id": "evt-學院-41",
      "title": "學術巨擘的郵件",
      "desc": "你隨手寄給國外一位頂尖理論大師的請教信，竟然在兩週後收到了大師親筆撰寫、長達三頁的詳細回信。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "提問探索者"
    },
    {
      "id": "evt-學院-42",
      "title": "黑板上的粉筆字",
      "desc": "清晨你第一個走進教室，發現黑板上寫著一行娟秀的字：「謝謝你上次的精準筆記，期末考加油。」，不知是誰留下的。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "筆記整理員"
    },
    {
      "id": "evt-學院-43",
      "title": "被取消的講座",
      "desc": "你省吃儉用一個月買票準備去聽的國際諾貝爾獎得主世紀大講座，因為對方航班延誤，主辦方宣布緊急取消。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "學習旅人"
    },
    {
      "id": "evt-學院-44",
      "title": "弄髒的借閱書籍",
      "desc": "你不小心把熱湯潑到了從國家圖書館借來的百年善本複印件上，修復費用可能需要你兩個月的生活費。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "學術探索者"
    },
    {
      "id": "evt-學院-45",
      "title": "讀書會的溫暖",
      "desc": "在你因為家庭變故準備退學時，讀書會的全體成員瞞著你舉辦了一個聚會，並共同為你籌措了一筆應急資金。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "讀書會成員"
    },
    {
      "id": "evt-學院-46",
      "title": "被遺忘的置物櫃",
      "desc": "你打開了教學大樓角落一個幾年沒人使用的生鏽置物櫃，裡面竟然躺著一本泛黃的舊版校規與一枚榮譽徽章。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "課堂觀察員"
    },
    {
      "id": "evt-學院-47",
      "title": "學術論壇的掌聲",
      "desc": "你在青年學術論壇上代表小組發表了關於體制改革的演講，演講結束後，全場響起了長達一分鐘的掌聲。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "思辨實踐家"
    },
    {
      "id": "evt-學院-48",
      "title": "工讀生的失誤",
      "desc": "你在幫系辦複印極為重要的期末考卷時，不小心多印了十份並遺留在複印機上，差點造成嚴重的洩題事件。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "校園服務員"
    },
    {
      "id": "evt-學院-49",
      "title": "雨中的宣導",
      "desc": "為了推廣偏鄉教育計畫，你和幾位同學在校園十字路口冒著寒風細雨發放傳單，但大多數路人都冷漠地走過。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "學習推廣員"
    },
    {
      "id": "evt-學院-50",
      "title": "知識的喜悅",
      "desc": "經過連續七個星期的文獻比對，你終於解開了那個困擾了整個研究小組大半年的古文字語法邏輯。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "學術探索者"
    },
    {
      "id": "evt-學院-51",
      "title": "電視台的連線採訪",
      "desc": "一場關於高等教育體制弊端的衝突在校門口爆發，路過的你突然被突襲採訪的記者遞上麥克風，要求當眾發表看法。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "公共知識份子"
    },
    {
      "id": "evt-學院-52",
      "title": "教育法案的聽證會",
      "desc": "你作為青年倡議代表，受邀出席立法院召開的教育體制改革聽證會，你將在一群資深政客面前發表你的修正案。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "教育倡議者"
    },
    {
      "id": "evt-學院-53",
      "title": "百萬美金的研究贊助",
      "desc": "一家國際科技巨頭看中了你關於跨領域AI整合的研究計畫，決定跳過學校，直接向你的個人實驗室資助百萬美金。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "學術先鋒"
    },
    {
      "id": "evt-學院-54",
      "title": "打破門第的研討會",
      "desc": "你成功策劃了一場將量子力學與現代哲學跨界碰撞的頂級研討會，吸引了平日老死不相往來的兩派大師同台交鋒。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "跨域整合師"
    },
    {
      "id": "evt-學院-55",
      "title": "追隨者的拜訪",
      "desc": "三名遠自南方頂尖大學畢業的優秀碩士生，帶著他們的研究計畫慕名來到你的辦公室，希望能自費成為你的隨堂弟子。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "知識燈塔"
    },
    {
      "id": "evt-學院-56",
      "title": "專利被高價收購",
      "desc": "你帶領團隊設計的一套創新型兒童邏輯學習系統，被全球最大的玩具與教育出版集團以天價買斷全球版權。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "學習設計師"
    },
    {
      "id": "evt-學院-57",
      "title": "智庫的秘密報告",
      "desc": "你撰寫的一份關於未來十年人口結構與教育崩潰的分析報告，被送上了國家最高安全會議的辦公桌上。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "知識分析師"
    },
    {
      "id": "evt-學院-58",
      "title": "百人研究團隊的誕生",
      "desc": "國家科學委員會正式批准了你提交的巨型跨國文化遺產數字化保存計畫，你將出任該計畫的全球總策劃者。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "研究策劃者"
    },
    {
      "id": "evt-學院-59",
      "title": "被匿名舉報的論文",
      "desc": "一封匿名的舉報信送到了學術倫理委員會，控訴你五年前發表的一篇核心論文存在數據過度美化的嫌疑。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "學術先鋒"
    },
    {
      "id": "evt-學院-60",
      "title": "教育部長的私人邀請",
      "desc": "現任教育部長在深夜給你打了通私人電話，邀請你下週一到他的私密辦公室，商討如何修改明年的教科書大綱。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "教育倡議者"
    },
    {
      "id": "evt-學院-61",
      "title": "公開講座的抗議者",
      "desc": "當你在國家大講堂發表關於公共知識的演講時，十幾名激進的保守派人士突然衝上台，試圖搶奪你的麥克風。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "公共知識份子"
    },
    {
      "id": "evt-學院-62",
      "title": "跨界論壇的冷場",
      "desc": "你應邀前往一場頂級商業經濟論壇發表人文主義學術演講，台下的企業家們反應冷淡，多數人在低頭看手機。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "跨域整合師"
    },
    {
      "id": "evt-學院-63",
      "title": "實驗室的間諜陰謀",
      "desc": "你發現你最信任的核心研究員，竟然在偷偷將你們尚未發表的理論建構草稿，打包發送給競爭對手的實驗室。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "研究策劃者"
    },
    {
      "id": "evt-學院-64",
      "title": "教材被全面抵制",
      "desc": "你主編的一本具有顛覆性的新型社會學教材，因為觀點過於前衛，遭到了全國數十所保守中學校長聯合聯署抵制。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "教育設計師"
    },
    {
      "id": "evt-學院-65",
      "title": "大師的臨終遺言",
      "desc": "你的精神導師在彌留之際把你叫到病床前，將一疊寫滿他一生未完研究的心血手稿交到你手上，叮囑你幫他完成。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "知識燈塔"
    },
    {
      "id": "evt-學院-66",
      "title": "世紀辯論的贏家",
      "desc": "你受邀前往瑞士參加全球思想峰會，在與當代最著名的保守派理論大師進行的現場電視辯論中，你以無懈可擊的邏輯贏得全場起立鼓掌。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 1,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "時代導師"
    },
    {
      "id": "evt-學院-67",
      "title": "砸碎象牙塔的錘子",
      "desc": "你主導起草的全國大學自主權法案正式通過，徹底砸碎了官僚體制對學術自由的數十年枷鎖，成千上萬的教授在校園歡呼。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 1,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "制度改革家"
    },
    {
      "id": "evt-學院-68",
      "title": "方程式的誕生",
      "desc": "在經歷了無數個不眠之夜後，你終於推導出了一個能夠完美解釋人類行為認知流動的基礎數學方程式，該理論被命名為你的名字。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 1,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "理論建構者"
    },
    {
      "id": "evt-學院-69",
      "title": "理想國學校落成",
      "desc": "你傾盡一生積蓄與影響力創辦的「未來學術實踐學院」今日正式落成，不看分數、只論思辨，全球數萬名天才爭相報名。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 1,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "教育實踐家"
    },
    {
      "id": "evt-學院-70",
      "title": "學術圈的集體封殺",
      "desc": "因為你堅持揭發一樁涉及多位學術大佬的巨額科研經費分贓醜聞，你發現自己在一夜之間被國內所有核心期刊與研討會聯合封殺。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 1,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "制度改革家"
    },
    {
      "id": "evt-學院-71",
      "title": "名譽教授的終章",
      "desc": "你在這座你待了四十年的講台上發表了退休前的最後一堂課。下課鈴聲響起時，門外走廊、窗外草地上黑壓壓地站滿了歷屆趕回來的學生。",
      "eventLevel": "命運",
      "cash": 0,
      "happiness": 1,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "名譽教授"
    },
    {
      "id": "evt-學院-72",
      "title": "歷史教科書的肖像",
      "desc": "新版全國歷史教科書印行，你的肖像與生平正式被寫入「當代文化與教育變革」章節，你的名字成為了每一個孩子讀書時必學的考點。",
      "eventLevel": "命運",
      "cash": 0,
      "happiness": 1,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "教育改革者"
    },
    {
      "id": "evt-學院-73",
      "title": "智慧的火炬遞交",
      "desc": "在你八十歲的壽宴上，你當年的第一屆學生、如今的國家科學院院長，雙手接過你用了一生的鋼筆，向你致以最崇高的敬意，宣誓火炬永不熄滅。",
      "eventLevel": "命運",
      "cash": 0,
      "happiness": 1,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "知識傳承者"
    },
    {
      "id": "evt-學院-74",
      "title": "體制的回馬槍",
      "desc": "在你全面推動教育改革三十年後，新上任的保守派政府宣佈全面廢除你的改革成果，恢復老舊的應試制度，你站在空蕩蕩的舊校園裡，看著體制捲土重來。",
      "eventLevel": "命運",
      "cash": 0,
      "happiness": 1,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "教育改革者"
    },
    {
      "id": "evt-學院-75",
      "title": "終身成就獎的空艇",
      "desc": "你在前往領取世界教育終身成就獎的路上，遭遇了罕見的極端暴風雨，飛機被迫降落在一個沒有網絡的孤島上，你錯過了你一生中最榮耀的頒獎典禮。",
      "eventLevel": "命運",
      "cash": 0,
      "happiness": -4,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "名譽教授"
    }
  ],
  "農墾": [
    {
      "id": "evt-農墾-76",
      "title": "泥土的洗禮",
      "desc": "清晨你第一次下田翻土，沉重的鋤頭一下下去就砸在了一塊暗礁上，反作用力震得你雙手發麻，泥水濺了你滿臉。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農事學徒"
    },
    {
      "id": "evt-農墾-77",
      "title": "風的警告",
      "desc": "傍晚你站在田埂上，注意到遠處的天空呈現詭異的暗紫色，風中帶著刺鼻的潮濕味，老經驗的你意識到今晚將有一場罕見的冰雹。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "田野觀察員"
    },
    {
      "id": "evt-農墾-78",
      "title": "蚯蚓的數量",
      "desc": "你蹲在乾涸的土地上翻檢土層，驚恐地發現每平方米的蚯蚓數量比上個月減少了一半，這意味著土壤酸化的問題已經非常嚴重。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "土壤照護員"
    },
    {
      "id": "evt-農墾-79",
      "title": "蚜蟲的突襲",
      "desc": "你巡視溫室時，發現最核心的番茄幼苗葉片背面布滿了密密麻麻的綠色蚜蟲，如果不立刻處理，這批反季節作物將全軍覆沒。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "作物管理員"
    },
    {
      "id": "evt-農墾-80",
      "title": "偷吃的小鳥",
      "desc": "你果園裡即將成熟的第一批蜜桃，被一群成群結隊的灰椋鳥啄得千瘡百孔，果樹下落滿了殘缺不全的酸澀果實。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "果園助手"
    },
    {
      "id": "evt-農墾-81",
      "title": "鄰居的割草機",
      "desc": "隔壁農場的老張在除草時，不小心把除草劑噴灑到了你家邊界上的有機蔬菜田裡，兩家因此在村委會吵得不可開交。",
      "eventLevel": "普通",
      "cash": -700,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農村服務員"
    },
    {
      "id": "evt-農墾-82",
      "title": "發動機的黑煙",
      "desc": "正當你開著老舊的拖拉機準備在大雨前完成最後三畝地的播種時，引擎突然發出一聲刺耳的巨響，隨後冒出了滾滾黑煙。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農機操作員"
    },
    {
      "id": "evt-農墾-83",
      "title": "免費的南瓜粥",
      "desc": "你將今年吃不完的巨型南瓜熬成了幾大鍋熱騰騰的南瓜粥，免費送給村裡的孤兒院與老人，收到了孩子們親手畫的感謝卡。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "收穫分享人"
    },
    {
      "id": "evt-農墾-84",
      "title": "集市的冷眼",
      "desc": "你拉著一車新鮮採收的無公害生菜去鎮上的集市販賣，因為定價比普通生菜貴了兩塊錢，一上午過去了，根本無人問津。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農產推廣員"
    },
    {
      "id": "evt-農墾-85",
      "title": "外來的背包客",
      "desc": "一名精疲力竭的年輕背包客倒在你的農場門口，你給了他一碗熱湯與一間乾淨的草料房住宿，他連夜跟你聊起了南方的農業風情。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農村旅人"
    },
    {
      "id": "evt-農墾-86",
      "title": "野生刺蔥的繁育",
      "desc": "你在後山峭壁上採集到了一株罕見的野生刺蔥，你試圖將其移植回自己的試驗田，但連續三天它都在不斷枯萎。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "種植實踐者"
    },
    {
      "id": "evt-農墾-87",
      "title": "大地的日記",
      "desc": "夜深人靜時，你坐在油燈下，在泛黃的筆記本上寫下今天的降雨量、日照時間與土壤溫度的變化，這已經是你堅持的第三年。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農業觀察家"
    },
    {
      "id": "evt-農墾-88",
      "title": "修渠的爭執",
      "desc": "為了修築一條引水灌溉的小渠，你和村裡其他幾家農戶因為出資比例與用水順序的問題產生了極大的分歧，修工被迫停擺。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "社區耕作者"
    },
    {
      "id": "evt-農墾-89",
      "title": "老化的圍欄",
      "desc": "農場西側的木質圍欄因為年久失修，在昨晚被幾隻野豬徹底撞爛，大半夜的你不得不拿著手電筒去玉米地裡驅趕野豬。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農田管理員"
    },
    {
      "id": "evt-農墾-90",
      "title": "寒潮的守夜",
      "desc": "氣象台發布了黃色霜凍預警，為了保住那幾畝剛剛破土的嫩芽，你戴上厚帽子，在田裡點燃了一整夜的草副熏煙。",
      "eventLevel": "普通",
      "cash": -700,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "土地守望者"
    },
    {
      "id": "evt-農墾-91",
      "title": "酸雨的侵蝕",
      "desc": "連續三天的綿綿細雨過後，你發現作物的葉片邊緣出現了詭異的焦黃斑點，化驗後證實這是附近化工廠排放引發的酸雨。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "土壤照護員"
    },
    {
      "id": "evt-農墾-92",
      "title": "意外的豐收",
      "desc": "原本以為因為乾旱會減產的旱稻，在收割時竟然發現稻穗異常飽滿，今年的總產量竟然比去年還高出了兩成。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "收穫分享人"
    },
    {
      "id": "evt-農墾-93",
      "title": "壞掉的冷藏庫",
      "desc": "農場存放高檔水果的冷藏庫溫控晶片突然燒毀，溫度在幾小時內飆升到二十度，裡面上百箱高檔草莓開始腐爛發酵。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農田管理員"
    },
    {
      "id": "evt-農墾-94",
      "title": "農機展的宣傳",
      "desc": "你自費前往省城參加國際農業機械展，在現場極力向各家廠商推銷你們村特有的富硒大米，可惜大多數經銷商只是敷衍地收下傳單。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農產推廣員"
    },
    {
      "id": "evt-農墾-95",
      "title": "山洪過境",
      "desc": "後山因連續暴雨引發了微型泥石流，雖然沒有傷到人，但泥沙和石塊將你地勢最低的一片菜園徹底掩埋。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "土地守望者"
    },
    {
      "id": "evt-農墾-96",
      "title": "種子商的騙局",
      "desc": "你從一個走街串巷的游商手裡買下了一批宣稱是「高產抗病」的玉米新品種種子，結果種下去一個月了，出苗率竟然不到三成。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農事學徒"
    },
    {
      "id": "evt-農墾-97",
      "title": "村口的互助隊",
      "desc": "村裡老王家的耕牛在春耕關鍵時刻病倒了，你二話不說，開著自己的大馬力拖拉機幫他家把三畝地全部免費犁了一遍。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農村服務員"
    },
    {
      "id": "evt-農墾-98",
      "title": "野蜂的安家",
      "desc": "一窩野生中華蜜蜂在你的蘋果樹叢裡築起了一個巨大的蜂巢，這雖然讓採蜜變得危險，但也讓果樹的授粉率大大提升。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "田野觀察員"
    },
    {
      "id": "evt-農墾-99",
      "title": "被拒絕的貸款",
      "desc": "你想向當地農商銀行申請一筆擴建現代化暖棚的低息貸款，但銀行信貸員以你的農場規模太小、缺乏抵押物為由拒絕了你。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農田管理員"
    },
    {
      "id": "evt-農墾-100",
      "title": "深夜的偷瓜賊",
      "desc": "半夜你聽到田裡有動靜，提著手電筒衝出去，發現是幾個隔壁村的頑皮小孩在偷摘西瓜，看到你後嚇得四處逃竄。",
      "eventLevel": "普通",
      "cash": -700,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農村服務員"
    },
    {
      "id": "evt-農墾-101",
      "title": "古老的節氣規律",
      "desc": "你按照爺爺留下的古老農曆諺語「清明前後，種瓜點豆」進行播種，而鄰居們則相信現代氣象預報，結果一場倒春寒讓鄰居損失慘重。",
      "eventLevel": "普通",
      "cash": -700,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農業觀察家"
    },
    {
      "id": "evt-農墾-102",
      "title": "被污染的灌溉水源",
      "desc": "上游的造紙廠偷偷將廢水排入河流，導致你引水灌溉的水渠裡泛起了大量白色泡沫，魚蝦死了一大片。",
      "eventLevel": "普通",
      "cash": -700,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "土壤照護員"
    },
    {
      "id": "evt-農墾-103",
      "title": "免費的農業課",
      "desc": "你主動在村委會辦公室開辦了一個「夏季果樹修剪技術」的免費講堂，沒想到全村來了幾十個老農夫，把房間擠得水洩不通。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "學習推廣員"
    },
    {
      "id": "evt-農墾-104",
      "title": "被大雪壓垮的塑料棚",
      "desc": "一場突如其來的罕見暴雪，在深夜將你投資上萬元搭建的草莓塑料大棚生生壓塌，大半的植株被凍死在雪地裡。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農田管理員"
    },
    {
      "id": "evt-農墾-105",
      "title": "第一顆紅草莓",
      "desc": "在漫長的冬天過去後，你今天在溫室的最角落裡，發現了今年春天第一顆完全成熟、紅彤彤的草莓，吃起來甜進了心裡。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "果園助手"
    },
    {
      "id": "evt-農墾-106",
      "title": "村墾爭霸賽",
      "desc": "縣裡舉辦了「年度西瓜王」大賽，你帶著精心栽培的巨型地雷西瓜參賽，結果因為在運輸途中震出了一道裂縫，痛失爭冠資格。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農產推廣員"
    },
    {
      "id": "evt-農墾-107",
      "title": "沼氣池的隱患",
      "desc": "農場新建的沼氣池管道出現了微小的洩漏，刺鼻的臭氣熏得周圍的蛋雞連續幾天不下蛋，你不得不戴上防毒面具下坑修理。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農機操作員"
    },
    {
      "id": "evt-農墾-108",
      "title": "老農夫的指點",
      "desc": "隔壁村一位種了五十年水稻的傳奇老農路過你的田頭，蹲下來抓起一把泥土聞了聞，指出你施肥的時機太早，救了你的作物。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農事學徒"
    },
    {
      "id": "evt-農墾-109",
      "title": "野兔的繁衍",
      "desc": "由於周圍生態變好，大量野兔在你的苜蓿地裡安了家，它們將鮮嫩的牧草啃得參差不齊，讓你十分頭疼。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "田野觀察員"
    },
    {
      "id": "evt-農墾-110",
      "title": "滯銷的洋蔥",
      "desc": "今年全縣洋蔥產量大爆發，導致價格暴跌到幾分錢一斤，你開著卡車把洋蔥拉到城裡，卻發現滿街都是倒賣洋蔥的農戶。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農產推廣員"
    },
    {
      "id": "evt-農墾-111",
      "title": "乾涸的古井",
      "desc": "連續三個月的大旱，讓你農場裡那口用了幾十年的老水井徹底見了底，你不得不每天花高價僱傭水車從五公里外運水。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "土地守望者"
    },
    {
      "id": "evt-農墾-112",
      "title": "林間的黑木耳",
      "desc": "你在農場後山的腐爛橡木樁上，意外發現了一大片品質極高的野生黑木耳，採摘下曬乾後成了極佳的副食品。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "田野觀察員"
    },
    {
      "id": "evt-農墾-113",
      "title": "農機零件停產",
      "desc": "你的主力收割機某個核心齒輪磨損嚴重，當你致電廠家時，對方卻冷冰冰地告知該型號十年前就已停產，零件無處可尋。",
      "eventLevel": "普通",
      "cash": -700,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農機操作員"
    },
    {
      "id": "evt-農墾-114",
      "title": "梯田的塌方",
      "desc": "因為連日陰雨，你花費半年時間用石頭砌成的生態梯田護坡發生了局部垮塌，大片肥沃的黑土順著山坡流失。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "種植實踐者"
    },
    {
      "id": "evt-農墾-115",
      "title": "被踩壞的秧苗",
      "desc": "一群不知道從哪裡竄出來的野水牛衝進了你剛剛插好秧的水稻田，瘋狂踩踏了一整圈，大半的秧苗被踩進了泥潭深處。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "土地守望者"
    },
    {
      "id": "evt-農墾-116",
      "title": "農業合作社的成立",
      "desc": "你聯合了村裡的十幾家散戶，正式掛牌成立了「綠野仙踪農業合作社」，大家推舉你為第一任理事長。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "社區耕作者"
    },
    {
      "id": "evt-農墾-117",
      "title": "化肥廠的推銷員",
      "desc": "一名化肥廠的經理帶著豐厚的禮品找到你，希望你能在未來的公開報導中為他們生產的高能複合肥做廣告，但你深知那種肥會毀了土地。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農業觀察家"
    },
    {
      "id": "evt-農墾-118",
      "title": "被鳥吃掉的魚苗",
      "desc": "你剛剛在農田生態魚塘裡投放的三萬尾黃膳魚苗，因為忘記加蓋防鳥網，在一天之內被前來的白鷺吃掉了三分之二。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "作物管理員"
    },
    {
      "id": "evt-農墾-119",
      "title": "古老作物的神話",
      "desc": "你在村裡的古廟廢墟旁發現了一株長相奇特的老茶樹，採集葉片泡水後，竟然有一種淡淡的蘭花清香，提神效果極佳。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "種植實踐者"
    },
    {
      "id": "evt-農墾-120",
      "title": "農村電網改造",
      "desc": "政府啟動了「農村電網升級工程」，你的農場終於接通了三相動力電，那些大馬力的灌溉泵終於可以全功率運轉了。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農機操作員"
    },
    {
      "id": "evt-農墾-121",
      "title": "被退回的出口生薑",
      "desc": "你辛苦種植並打包好準備出口的外貿生薑，因為在海關抽檢中被檢出重金屬微量超標，整整三卡車貨被全數退回。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農產推廣員"
    },
    {
      "id": "evt-農墾-122",
      "title": "深夜的狼嚎",
      "desc": "山林深處傳來久違的狼嚎，雖然這意味著當地的生態鏈正在修復，但也讓你農場裡圈養的那幾十隻綿羊嚇得整夜撞牆。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "田野觀察員"
    },
    {
      "id": "evt-農墾-123",
      "title": "堆肥的惡臭",
      "desc": "你嘗試用廚餘和畜糞進行大規模有機堆肥，因為翻動時機不對，產生了極其刺鼻的惡臭，引來了全村村民的聯署投訴。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "土壤照護員"
    },
    {
      "id": "evt-農墾-124",
      "title": "豐收節的舞會",
      "desc": "村裡舉辦了慶祝小麥豐收的篝火晚會，你被村民們推舉為「豐收使者」，戴上麥穗編織的皇冠，在篝火旁跳了一整夜的舞。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "收穫分享人"
    },
    {
      "id": "evt-農墾-125",
      "title": "大地之子的證書",
      "desc": "經過縣農業局的嚴格考核，你正式獲得了官方頒發的「新型職業高級農民證書」，每月將享有微幅的政府津貼。",
      "eventLevel": "普通",
      "cash": 500,
      "happiness": 1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "農業觀察家"
    },
    {
      "id": "evt-農墾-126",
      "title": "蚯蚓泥的奇蹟",
      "desc": "你研發的一種基於特定中藥渣調配的有機「蚯蚓培育基」，讓原本板結乾涸的鹽鹼地在短短一年內變成了肥沃的黑土地。",
      "eventLevel": "稀有",
      "cash": 1000,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "永續耕耘者"
    },
    {
      "id": "evt-農墾-127",
      "title": "無人機矩陣落地",
      "desc": "你成功引入了衛星遙感與無人機噴灑矩陣系統，你坐在空調房裡看著螢幕，千畝農場的灌溉與施肥在幾小時內自動完成。",
      "eventLevel": "稀有",
      "cash": 1000,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "智慧農業師"
    },
    {
      "id": "evt-農墾-128",
      "title": "央視新聞的專題",
      "desc": "中央電視台的《致富經》欄目組來到你的農場進行了為期一週的深度採訪，你的「生態立體循環農業」模式隨後火遍全國。",
      "eventLevel": "稀有",
      "cash": 1000,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "農村推動者"
    },
    {
      "id": "evt-農墾-129",
      "title": "零化肥的金色稻田",
      "desc": "你的百畝「純自然生態稻」在完全不使用任何化肥農藥的情況下喜獲大豐收，聯合國糧農組織專家特地前來實地考察。",
      "eventLevel": "稀有",
      "cash": 1000,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "生態耕作者"
    },
    {
      "id": "evt-農墾-130",
      "title": "百萬畝荒山規劃圖",
      "desc": "省政府正式將北方一片面積達百萬畝的退化荒山生態重塑項目委託給你的工作室，你將主導整個區域的植被與農田規劃。",
      "eventLevel": "稀有",
      "cash": 1000,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "農地規劃師"
    },
    {
      "id": "evt-農墾-131",
      "title": "天價「皇家御米」",
      "desc": "你培育出的一種口感極佳、帶有天然芋香的紫晶大米，在高端拍賣會上被一幫富豪炒到了每公斤上千元的真正天價。",
      "eventLevel": "稀有",
      "cash": 1000,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "農產策展人"
    },
    {
      "id": "evt-農墾-132",
      "title": "海水稻的突破性進展",
      "desc": "你在沿海鹽鹼灘塗上進行的「耐鹽水稻」雜交實驗取得重大突破，新稻株能在純海水中正常結穗，震驚了整個袁隆平院士智庫。",
      "eventLevel": "稀有",
      "cash": -1400,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "農業實驗家"
    },
    {
      "id": "evt-農墾-133",
      "title": "創生基地的免稅令",
      "desc": "因為你成功帶領一個原本年人均收入不到千元的國家級貧困村徹底脫貧致富，國務院特批你們的創生產業園享有十年免稅。",
      "eventLevel": "稀有",
      "cash": 1000,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "地方創生者"
    },
    {
      "id": "evt-農墾-134",
      "title": "被跨國巨頭起訴專利侵權",
      "desc": "全球最大的基因種子壟斷巨頭「孟山都」突然向你發來律師函，指控你自行培育的抗旱小麥序列抄襲了他們的基因專利。",
      "eventLevel": "稀有",
      "cash": 1000,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "農業實驗家"
    },
    {
      "id": "evt-農墾-135",
      "title": "蝗蟲大軍逼近",
      "desc": "一場席捲東非與南亞的世紀大蝗災突然改道逼近你的農場，滿天黑壓壓的蝗蟲幾小時內就能將你幾年的心血啃成白地。",
      "eventLevel": "稀有",
      "cash": -1400,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "土地守望者"
    },
    {
      "id": "evt-農墾-136",
      "title": "合作社的集體退股",
      "desc": "由於遭遇連續兩年的極端乾旱導致收益不如預期，合作社大批缺乏耐心的村民在有心人的煽動下，集體圍攻你的辦公室要求退股。",
      "eventLevel": "稀有",
      "cash": 1000,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "農村推動者"
    },
    {
      "id": "evt-農墾-137",
      "title": "有機認證被惡意投毒",
      "desc": "就在國際綠色食品組織前來抽檢你「特級有機茶園」的前一天深夜，競爭對手偷偷僱人向你的茶樹噴灑了高濃度的百草枯。",
      "eventLevel": "稀有",
      "cash": -1400,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "生態耕作者"
    },
    {
      "id": "evt-農墾-138",
      "title": "黑心外資的土地併購",
      "desc": "一家實力雄厚的海外資本試圖強行收購你們村的核心農地用來建造化工轉運站，他們開出了無法拒絕的拆遷補償，全村人心動搖。",
      "eventLevel": "稀有",
      "cash": 1000,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "地方創生者"
    },
    {
      "id": "evt-農墾-139",
      "title": "地下水源枯竭危機",
      "desc": "由於周邊工業區過度抽取地下水，導致你整個農場的底層水井全部乾涸，甚至引發了地面塌陷，數百畝作物面臨無水渴死的絕境。",
      "eventLevel": "稀有",
      "cash": 1000,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "永續耕耘者"
    },
    {
      "id": "evt-農墾-140",
      "title": "古老菌種的復活",
      "desc": "你在長白山原始森林考察時發現的一種古老寄生真菌，成功復活後被證實能讓所有落葉果樹的產量提升整整一倍。",
      "eventLevel": "稀有",
      "cash": 1000,
      "happiness": 2,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "農業實驗家"
    },
    {
      "id": "evt-農墾-141",
      "title": "袁隆平農業獎得主",
      "desc": "你因為在耐鹽鹼海水稻與超級小麥領域的劃時代貢獻，正式被授予國家最高農業科技獎，並獲得由元首親自頒發的勳章。",
      "eventLevel": "傳奇",
      "cash": 1500,
      "happiness": 3,
      "reputation": 0,
      "rare": true,
      "important": true,
      "linkedTitle": "農業創新家"
    },
    {
      "id": "evt-農墾-142",
      "title": "超級沙塵暴的活化石",
      "desc": "一場三十年一遇的特大沙塵暴席捲了整個北方，周圍數万畝農田皆被掩埋，而你用生態防護林圍繞的千畝核心農場竟然奇蹟般完好無損。",
      "eventLevel": "傳奇",
      "cash": -2100,
      "happiness": 3,
      "reputation": 0,
      "rare": true,
      "important": true,
      "linkedTitle": "大地守護者"
    },
    {
      "id": "evt-農墾-143",
      "title": "國家糧食戰略總設計師",
      "desc": "在面臨全球地緣政治危機與糧食禁運的極端情況下，你正式被國家任命為「國家小麥與水稻戰略儲備總負責人」，掌管大國糧倉。",
      "eventLevel": "傳奇",
      "cash": -2100,
      "happiness": 3,
      "reputation": 0,
      "rare": true,
      "important": true,
      "linkedTitle": "創生領航員"
    },
    {
      "id": "evt-農墾-144",
      "title": "綠染撒哈拉的奇蹟",
      "desc": "你主導的「沙漠綠化與固沙稻計畫」在全球最大的沙漠深處成功開闢出了一萬公頃的綠色良田，徹底改寫了人類無法征服沙漠的歷史。",
      "eventLevel": "傳奇",
      "cash": 1500,
      "happiness": 3,
      "reputation": 0,
      "rare": true,
      "important": true,
      "linkedTitle": "生態領航員"
    },
    {
      "id": "evt-農墾-145",
      "title": "跨國基因種子反壟斷勝利",
      "desc": "在經歷了長達五年的國際法庭訴訟後，你成功擊敗了跨國基因巨頭的專利壟斷，讓全球發展中國家的農民都能免費使用你的高產種子。",
      "eventLevel": "傳奇",
      "cash": 1500,
      "happiness": 3,
      "reputation": 0,
      "rare": true,
      "important": true,
      "linkedTitle": "農業創新家"
    },
    {
      "id": "evt-農墾-146",
      "title": "百年農匠的家徽",
      "desc": "在你的百歲大壽上，由你白手起家創辦的「綠野農莊」被正式列入國家永久文化與農業遺產名錄，你的家族徽章被鐫刻在小鎮的中心廣場上。",
      "eventLevel": "命運",
      "cash": 2000,
      "happiness": 4,
      "reputation": 0,
      "rare": true,
      "important": true,
      "linkedTitle": "百年農匠"
    },
    {
      "id": "evt-農墾-147",
      "title": "融於這片土地",
      "desc": "你坐在你耕耘了一生的老橡樹下，看著遠處金色的稻浪與兒孫們開著收割機忙碌的背影，你緩緩閉上了眼睛，靈魂徹底沉入了這片溫熱的黑土地。",
      "eventLevel": "命運",
      "cash": 2000,
      "happiness": 4,
      "reputation": 0,
      "rare": true,
      "important": true,
      "linkedTitle": "土地傳承者"
    },
    {
      "id": "evt-農墾-148",
      "title": "絕蹟的飢餓感",
      "desc": "聯合國宣布，得益於你研發的「全球高產全適應作物技術」在非洲與拉美的全面落地，人類歷史上首次實現了「全球零飢荒」，你被公認為當代神農。",
      "eventLevel": "命運",
      "cash": 2000,
      "happiness": 4,
      "reputation": 0,
      "rare": true,
      "important": true,
      "linkedTitle": "綠色革命家"
    },
    {
      "id": "evt-農墾-149",
      "title": "黑天鵝瘟疫的洗禮",
      "desc": "一場未知的、專門針對植物維管束的全球性超級病毒爆發，全球九成作物枯死，你那座採用古老隔離法的種子庫成了人類延續農業的最後希望。",
      "eventLevel": "命運",
      "cash": 2000,
      "happiness": 4,
      "reputation": 0,
      "rare": true,
      "important": true,
      "linkedTitle": "土地傳承者"
    },
    {
      "id": "evt-農墾-150",
      "title": "企業化兼併的悲歌",
      "desc": "隨著跨國集約化農業寡頭的強行介入與政策變更，你堅守了一輩子的家族生態農場最終被法院強制執行拆遷，看著推土機開進麥田，你吐出了一口鮮血。",
      "eventLevel": "命運",
      "cash": 2000,
      "happiness": 4,
      "reputation": 0,
      "rare": true,
      "important": true,
      "linkedTitle": "百年農匠"
    }
  ],
  "企業": [
    {
      "id": "evt-企業-151",
      "title": "打卡鐘的詛咒",
      "desc": "清晨你一路狂奔，卻在踏進公司大門的那一秒，打卡鐘的數字剛好跳到了九點零一分，這意味著你本月的全勤獎金正式泡湯。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "職場新人"
    },
    {
      "id": "evt-企業-152",
      "title": "消失的發票",
      "desc": "你在準備向財務部報銷上個月陪客戶吃飯的巨額餐費時，驚恐地發現放在外套口袋裡的那張核心發票竟然被洗衣機洗得粉碎。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "業務助理"
    },
    {
      "id": "evt-企業-153",
      "title": "半夜的奪命連環Call",
      "desc": "凌晨兩點，你剛睡著，手機突然瘋狂響起，客服主管在電話那頭焦急地大喊，說公司的核心伺服器遭到攻擊，上萬名用戶正在線上投訴。",
      "eventLevel": "普通",
      "cash": -1000,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "客戶服務員"
    },
    {
      "id": "evt-企業-154",
      "title": "PPT的修改狂魔",
      "desc": "你的專案經理在看了你修改了十五次的簡報後，皺了皺眉頭跟你說：「還是用回第一版吧，但色調要再溫暖一點。」，你感覺血壓瞬間升高。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "專案成員"
    },
    {
      "id": "evt-企業-155",
      "title": "被搶走的功勞",
      "desc": "你在週會上提出的全新產品創意，隔天竟然出現在了同組那位平日裡偷懶的學長給總經理的報告裡，而報告上完全沒有你的名字。",
      "eventLevel": "普通",
      "cash": -1000,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "團隊協作者"
    },
    {
      "id": "evt-企業-156",
      "title": "預算被砍的行銷案",
      "desc": "你策劃了一個月的春季行銷企劃，在最後審批階段被財務總監以「今年公司全面收緊預算」為由，硬生生砍掉了七成的經費。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "行銷實踐者"
    },
    {
      "id": "evt-企業-157",
      "title": "K線圖的假突破",
      "desc": "你根據大半年的數據指標精準算出一隻股票即將迎來大爆發，滿懷信心買入後，隔天該股就拉出了一根巨大的陰線，讓你瞬間套牢。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "商業分析員"
    },
    {
      "id": "evt-企業-158",
      "title": "被鴿掉的商务會議",
      "desc": "你提著沉重的樣品在寒風中等了兩個小時，卻接到大客戶秘書的電話，冷冰冰地告知總經理臨時要陪董事長打高爾夫，會議取消。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "市場觀察員"
    },
    {
      "id": "evt-企業-159",
      "title": "飲水機旁的密謀",
      "desc": "你在茶水間接水時，意外聽到隔壁部門的兩位主管正在低聲商量，準備在下週的董事會上聯手彈劾你們部門的主管。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "營運支援員"
    },
    {
      "id": "evt-企業-160",
      "title": "簽約前的變卦",
      "desc": "原本已經談妥一切條款、準備在今天下午正式簽約的跨國大單，對方的談判代表卻在落筆前一秒突然提出要重新調整利潤分成。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "商務開發員"
    },
    {
      "id": "evt-企業-161",
      "title": "被拒絕的請假單",
      "desc": "在你已經買好機票、準備回家參加妹妹婚禮的前夕，部門主管以「目前正是專案上線的關鍵衝刺期」為由，冷酷地駁回了你的請假單。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "流程優化師"
    },
    {
      "id": "evt-企業-162",
      "title": "辦公室的冷氣故障",
      "desc": "正值盛夏三十八度高溫，辦公大樓的中央冷氣突然徹底壞掉，幾百個穿著西裝套裝的員工擠在悶熱的格子間裡，辦公效率降到冰點。",
      "eventLevel": "普通",
      "cash": -1000,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "部門協調員"
    },
    {
      "id": "evt-企業-163",
      "title": "調研報告的錯字",
      "desc": "你提交給董事會的五十頁行業深度調研報告中，被董事長一眼挑出大標題上印著一個極其低級的錯字，當場訓斥你工作態度不嚴謹。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "商業研究員"
    },
    {
      "id": "evt-企業-164",
      "title": "弄丟的行李箱",
      "desc": "你前往巴黎參加重要商務談判，下飛機後卻被機場告知你的行李箱被誤運到了非洲，裡面裝著你明天談判要用的唯一一份樣品。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "商業旅人"
    },
    {
      "id": "evt-企業-165",
      "title": "被退回的宣傳品",
      "desc": "你負責監製的一萬份產品宣傳小冊子，印刷廠送來後你發現產品核心參數全部少了一個零，這批貨只能就地作廢，損失慘重。",
      "eventLevel": "普通",
      "cash": -1000,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "產品推廣員"
    },
    {
      "id": "evt-企業-166",
      "title": "尾牙的安慰獎",
      "desc": "在全公司熱鬧非凡的年終尾牙抽獎活動中，你眼睜睜看著頭獎百萬轎車被隔壁剛入職的新人抽走，而你只拿到了一台家用烤麵包機。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "職場新人"
    },
    {
      "id": "evt-企業-167",
      "title": "被拉黑的微信",
      "desc": "你因為連續三天在深夜給客戶發送確認郵件，今天早上發現自己被該客戶徹底封鎖，專案進度瞬間陷入停滯。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "客戶服務員"
    },
    {
      "id": "evt-企業-168",
      "title": "過期的加班便當",
      "desc": "凌晨一點你還在辦公室加班，肚子餓得咕咕叫，打開公司提供的免費加班便當，卻發現裡面的肉排已經散發出淡淡的酸臭味。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "營運支援員"
    },
    {
      "id": "evt-企業-169",
      "title": "被兼併的尷尬",
      "desc": "公司高層突然宣佈與同城最大的競爭對手合併，而新派來接管你們部門的主管，竟然是你在上一家公司鬧翻的前同事。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "部門協調員"
    },
    {
      "id": "evt-企業-170",
      "title": "展覽會的假客戶",
      "desc": "你在國際商務展上熱情接待了一位自稱是中東石油大亨代理人的客戶，相談甚歡並送出了昂貴樣品，事後查證對方只是個騙吃騙喝的無業遊民。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "產品推廣員"
    },
    {
      "id": "evt-企業-171",
      "title": "辦公椅的靠背斷裂",
      "desc": "在一次極其嚴肅的跨部門視訊會議上，你正準備起身發言，辦公椅的靠背突然啪一聲斷裂，你整個人四腳朝天摔在地上，全公司震驚。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "團隊螺絲釘"
    },
    {
      "id": "evt-企業-172",
      "title": "被扣發的季度獎金",
      "desc": "因為全公司年度業績未達標，高層宣佈取消本季度的全員績效獎金，你原本計劃用這筆錢買的新手機計劃徹底落空。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "業務助理"
    },
    {
      "id": "evt-企業-173",
      "title": "無效的市場問卷",
      "desc": "你帶領實習生在街頭頂著烈日發放了五百份市場調研問卷，收回後發現大部分都被路人胡亂勾選，數據完全無法作為行銷參考。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "市場觀察員"
    },
    {
      "id": "evt-企業-174",
      "title": "被大雨澆透的西裝",
      "desc": "你穿著花費了半個月薪水買的高級定製西理準備去見重要客戶，結果路過的灑水車完全沒有減速，將你從頭到腳澆了個透心涼。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "商業旅人"
    },
    {
      "id": "evt-企業-175",
      "title": "競爭對手的挖角簡訊",
      "desc": "你的手機突然收到了一條來自死敵公司的HR簡訊，開出了比你現在高三成的薪水邀請你跳槽，但條件是帶走你手頭的客戶名單。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "商務開發員"
    },
    {
      "id": "evt-企業-176",
      "title": "Excel公式死鎖",
      "desc": "你負責彙總的全公司年度財務預算總表，因為嵌套了太多層VLOOKUP公式，導致整份文件卡死，每次存檔都需要花費半小時。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "流程優化師"
    },
    {
      "id": "evt-企業-177",
      "title": "被遺忘的生日驚喜",
      "desc": "你以為部門同事會像往常一樣在下午茶時間為你端出蛋糕慶祝生日，結果直到下班打卡，所有人都在忙著手頭的工作，根本沒人提起。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "團隊協作者"
    },
    {
      "id": "evt-企業-178",
      "title": "PPT投影機燒毀",
      "desc": "在你代表團隊向投資人進行決定生死的 A 輪融資路演時，現場的投影機突然冒出一股青煙，屏幕瞬間漆黑一片。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "專案成員"
    },
    {
      "id": "evt-企業-179",
      "title": "被退信的開發信",
      "desc": "你利用自動化腳本向海外潛在買家發送了一萬封商務合作郵件，結果因為觸發了反垃圾郵件機制，你的企業郵箱被國際伺服器全面黑名單。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "商務開發員"
    },
    {
      "id": "evt-企業-180",
      "title": "職場老油條的推諉",
      "desc": "你負責推進一項跨部門合作，但對接的資深老員工一直以「目前走流程中、需要請示領導」為由無限期拖延，讓你每天都在崩潰邊緣。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "部門協調員"
    },
    {
      "id": "evt-企業-181",
      "title": "年報上的數據漏列",
      "desc": "在公司年度財報印刷完成、準備發放給全體股東的前一晚，你發現第三十七頁漏列了一筆高達五十萬的研發支出。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "商業研究員"
    },
    {
      "id": "evt-企業-182",
      "title": "客戶的無底線改稿",
      "desc": "客戶在微信群裡甩來一張截圖，要求你把已經定稿並投入生產的包裝設計顏色「改成一種充滿科技感的黑色，但又要帶點溫柔的白。」",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "行銷實踐者"
    },
    {
      "id": "evt-企業-183",
      "title": "打工人的頸椎病",
      "desc": "因為長期保持高強度低頭敲鍵盤的姿勢，你的頸椎病突然急性發作，在辦公桌前痛得直不起腰，不得不請假去醫院做牽引。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "營運支援員"
    },
    {
      "id": "evt-企業-184",
      "title": "商業間諜的懷疑",
      "desc": "公司核心產品的定價策略提前洩漏，因為你是報告的起草人之一，高層在調查結果出來前，暫時停用了你所有的系統登入權限。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "商業研究員"
    },
    {
      "id": "evt-企業-185",
      "title": "被迫參加的團建",
      "desc": "在難得的週末雙休日，公司強制全員前往百公里外的荒山進行「狼性拓展團建」，你不得不穿著迷彩服在泥地裡爬行，身心俱疲。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "團隊協作者"
    },
    {
      "id": "evt-企業-186",
      "title": "弄丟的報銷收據",
      "desc": "你辛辛苦苦攢了半年的計程車發票與出差住宿收據，在搬座位時被保潔阿姨當成垃圾清理掉了，意味著你要自掏腰包補齊這筆虧空。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "業務助理"
    },
    {
      "id": "evt-企業-187",
      "title": "被惡意舉報的店鋪",
      "desc": "你負責運營的公司天貓旗艦店，遭到競爭對手僱用的大量職業刷手進行惡意差評與投訴，導致店鋪被平台官方暫時降權。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "市場觀察員"
    },
    {
      "id": "evt-企業-188",
      "title": "辦公室政治的站隊",
      "desc": "兩位副總經理為了爭奪即將空出來的執行長位置鬧得不可開交，他們分別在私底下找你談話，逼迫你必須在明天的投票中公開站隊。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "部門協調員"
    },
    {
      "id": "evt-企業-189",
      "title": "錯寄的報價單",
      "desc": "你忙中出錯，把給 A 客戶的底線底價折扣報價單，誤發到了競爭對手 B 客戶的信箱裡，造成了不可挽回的商業洩密。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "商務開發員"
    },
    {
      "id": "evt-企業-190",
      "title": "勞動合同的文字陷阱",
      "desc": "你在準備離職跳槽時，法務部突然指出你入職時簽署的勞動合同裡隱藏了一條極其嚴苛的「三年內不得從事同行業」的補償條款。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "職場新人"
    },
    {
      "id": "evt-企業-191",
      "title": "咖啡機的故障爆炸",
      "desc": "你站在公司的頂級膠囊咖啡機前等咖啡，機器內的高壓蒸汽閥突然失控爆裂，滾燙的咖啡液與零件碎片噴了你一身，燙傷了手臂。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "團隊螺絲釘"
    },
    {
      "id": "evt-企業-192",
      "title": "被遺忘的會議紀要",
      "desc": "你作為專案書記，忘記把昨天董事長口頭更改的三項核心決議寫進會議紀要，導致下屬執行部門今天全部按照錯誤的方向投入了生產。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "專案成員"
    },
    {
      "id": "evt-企業-193",
      "title": "差旅費用的超標審查",
      "desc": "審計部門指出你上個月前往紐約出差時，因為突發暴雪被迫預訂的高價酒店超出了公司的差旅標準，要求你個人承擔差額。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "商業旅人"
    },
    {
      "id": "evt-企業-194",
      "title": "宣傳片的主角塌房",
      "desc": "公司斥巨資拍攝、準備在跨年夜投放的年度形象宣傳片，其代言明星在今天中午突然被爆出出軌醜聞，整部片子面臨全網下架。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "行銷實踐者"
    },
    {
      "id": "evt-企業-195",
      "title": "被查封的供應商",
      "desc": "你的核心外包工廠因為環保嚴重超標，在今天下午被政府有關部門毫無預警地勒令就地關停，你們即將面臨嚴重的斷貨危機。",
      "eventLevel": "普通",
      "cash": -1000,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "營運支援員"
    },
    {
      "id": "evt-企業-196",
      "title": "年終獎的白條",
      "desc": "公司老闆在年終大會上聲淚俱下地講述了今年公司經營的困難，最後宣佈今年的年終獎全部換成公司未上市的內部認股權白條。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "職場新人"
    },
    {
      "id": "evt-企業-197",
      "title": "市場份額的微幅下滑",
      "desc": "最新一季度的行業報告顯示，由於一家新創公司的低價攪局，你們公司的核心產品市場份額微幅下跌了兩個百分點。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "市場觀察員"
    },
    {
      "id": "evt-企業-198",
      "title": "被抄襲的商標標語",
      "desc": "你為公司新產品想出的精妙廣告語，在尚未正式註冊前，被一家南方的小微企業搶先在抖音上拍成了短視頻並申請了著作權。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "產品推廣員"
    },
    {
      "id": "evt-企業-199",
      "title": "辦公大樓的電梯停運",
      "desc": "正逢公司要接待外國商務代表團，辦公大樓的三部主力電梯突然因為機械故障同時停運，你不得不陪著高管們徒步爬上二十六樓。",
      "eventLevel": "普通",
      "cash": -1000,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "部門協調員"
    },
    {
      "id": "evt-企業-200",
      "title": "完美的路演彩排",
      "desc": "在經歷了無數次通宵打磨後，你今晚在空無一人的會議室裡進行了最後一次路演彩排，每一個手勢與停頓都堪稱完美，你對明天充滿信心。",
      "eventLevel": "普通",
      "cash": 1200,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "專案成員"
    },
    {
      "id": "evt-企業-201",
      "title": "粉絲群體的護城河",
      "desc": "因為你堅持在社群上與用戶進行真誠的深度互動，當公司遭遇公關危機時，上百萬名忠實粉絲主動組成了志願軍，自發在全網為品牌澄清謠言。",
      "eventLevel": "稀有",
      "cash": -2000,
      "happiness": -1,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "品牌經營者"
    },
    {
      "id": "evt-企業-202",
      "title": "車庫創業的 A 輪狂歡",
      "desc": "你在自家車庫裡研發出的新一代雲端協同架構，獲得了矽谷頂級紅杉資本的青睞，對方在看完展示後十分鐘內簽下了千萬美金的 A 輪支票。",
      "eventLevel": "稀有",
      "cash": 2400,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": false,
      "linkedTitle": "創業實踐家"
    },
    {
      "id": "evt-企業-203",
      "title": "偷天換日的百億併購案",
      "desc": "你精準利用了法律漏洞與時間差，策劃了一場震驚業界的「蛇吞象」商業戰役，成功將資產規模是你十倍的百年老字號強行兼併。",
      "eventLevel": "稀有",
      "cash": 2400,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": false,
      "linkedTitle": "商業策劃師"
    },
    {
      "id": "evt-企業-204",
      "title": "新大陸的特許經營權",
      "desc": "你單槍匹馬飛往尚待開發的西非某國，經過與當地部落首領及經濟部長的三天三夜談判，成功拿下了該國全境的 5G 網絡特許經營權。",
      "eventLevel": "稀有",
      "cash": 2400,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": false,
      "linkedTitle": "市場開拓者"
    },
    {
      "id": "evt-企業-205",
      "title": "做空巨頭的百倍獵殺",
      "desc": "你精準看穿了一家跨國醫藥巨頭的臨床數據造假，在國際期貨市場上佈下了天羅地網，隨著造假新聞爆發，你在一天之內獲得了百倍利潤。",
      "eventLevel": "稀有",
      "cash": 2400,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": false,
      "linkedTitle": "投資分析師"
    },
    {
      "id": "evt-企業-206",
      "title": "金融海嘯中的不倒翁",
      "desc": "一場席捲全球的黑天鵝金融海嘯爆發，同行業的老牌企業紛紛破產倒閉，而你因為提前半年將所有資產換成實體黃金，公司反而逆勢成為巨頭。",
      "eventLevel": "稀有",
      "cash": -2000,
      "happiness": -1,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "營運管理師"
    },
    {
      "id": "evt-企業-207",
      "title": "夕陽工廠的黃金重組",
      "desc": "你以廢鐵價收購了一家瀕臨倒閉的傳統鋼鐵廠，引入你獨創的模組化管理架構後，該工廠在第二個月奇蹟般扭虧為盈，成為納稅大戶。",
      "eventLevel": "稀有",
      "cash": 2400,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": false,
      "linkedTitle": "商業整合師"
    },
    {
      "id": "evt-企業-208",
      "title": "高槓桿的生死遊戲",
      "desc": "你違背了董事會的穩健原則，私自調用了十倍的資本槓桿殺入國際外匯市場，今晚匯率的每一個微小波動，都決定著你成為千億富豪或是跳樓自殺。",
      "eventLevel": "稀有",
      "cash": 2400,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": false,
      "linkedTitle": "資本運營師"
    },
    {
      "id": "evt-企業-209",
      "title": "內鬼浮出水面",
      "desc": "你精心佈下了一個虛假的商業招標局，終於成功將隱藏在公司高層、多年來向對手出賣核心專利的副總裁當場抓獲，並送交司法機關。",
      "eventLevel": "稀有",
      "cash": 2400,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": false,
      "linkedTitle": "商業戰略家"
    },
    {
      "id": "evt-企業-210",
      "title": "技術被強制收歸國有",
      "desc": "你一手開發出的全球頂級加密算法，因為被評估為「涉及國家底層通信安全」，被最高法院下達禁令，限制出口並強制由國家機關接管。",
      "eventLevel": "稀有",
      "cash": 2400,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": false,
      "linkedTitle": "創新企業家"
    },
    {
      "id": "evt-企業-211",
      "title": "董事會的深夜彈劾",
      "desc": "在一個沒有月光的深夜，三位大股東聯合向你發難，指控你在海外投資中涉嫌職務侵佔，要求你在明早開市前主動辭去董事長職務。",
      "eventLevel": "稀有",
      "cash": 2400,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": false,
      "linkedTitle": "營運管理師"
    },
    {
      "id": "evt-企業-212",
      "title": "專利牆被暴力砸碎",
      "desc": "你們公司賴以壟斷市場的核心技術專利，在今天上午被歐盟反壟斷委員會判定無效，大批模仿者瞬間湧入市場，股價開盤跌停。",
      "eventLevel": "稀有",
      "cash": 2400,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": false,
      "linkedTitle": "創新企業家"
    },
    {
      "id": "evt-企業-213",
      "title": "供應鏈的總崩潰",
      "desc": "由於馬六甲海峽突發地緣軍事衝突，承載著你公司九成原材料的巨型貨輪被強行扣押，你的所有工廠將在三天內因為斷料而全面停產。",
      "eventLevel": "稀有",
      "cash": -2000,
      "happiness": -1,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "營運管理師"
    },
    {
      "id": "evt-企業-214",
      "title": "被惡意做空的做空報告",
      "desc": "華爾街著名的做空機構「渾水」突然發布了一份長達百頁的調查報告，指控你們公司財務造假，導致公司市值在幾小時內蒸發了上百億。",
      "eventLevel": "稀有",
      "cash": 2400,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": false,
      "linkedTitle": "投資分析師"
    },
    {
      "id": "evt-企業-215",
      "title": "天使投資人的撤資背叛",
      "desc": "就在你的公司準備向納斯達克提交上市申請的最關鍵時刻，陪伴你十年的創始天使投資人突然宣佈清倉套現，引發市場巨大的恐慌。",
      "eventLevel": "稀有",
      "cash": -2000,
      "happiness": -1,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "創業實踐家"
    },
    {
      "id": "evt-企業-216",
      "title": "行業標準的立法者",
      "desc": "世界貿易組織正式宣佈，由你公司主導起草的新一代全球物聯網通信協議，將被定為全球唯一官方認證的行業標準，所有同行必須向你付稅。",
      "eventLevel": "傳奇",
      "cash": 3600,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": true,
      "linkedTitle": "企業領航員"
    },
    {
      "id": "evt-企業-217",
      "title": "造物主的手筆",
      "desc": "你親手研發的第一代「家用量子計算晶片」正式量產，這款晶片將人類的算力提升了十萬倍，徹底將人類文明推進了全新的量子時代。",
      "eventLevel": "傳奇",
      "cash": 3600,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": true,
      "linkedTitle": "創新企業家"
    },
    {
      "id": "evt-企業-218",
      "title": "未開戰已注定的棋局",
      "desc": "面對國際資本大鱷來勢洶洶的意圖惡意收購，你利用三年前佈下的上百家殼公司與複雜的交叉持股結構，不費一兵一卒讓對手深陷泥潭，全盤皆輸。",
      "eventLevel": "傳奇",
      "cash": 3600,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": true,
      "linkedTitle": "商業戰略家"
    },
    {
      "id": "evt-企業-219",
      "title": "美元霸權的挑戰者",
      "desc": "你創辦的跨國數字清算銀行正式上線，全球三十個核心經濟體宣佈使用你的系統進行石油貿易結算，你真正觸碰到了底層印鈔機的權利。",
      "eventLevel": "傳奇",
      "cash": 3600,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": true,
      "linkedTitle": "資本戰略家"
    },
    {
      "id": "evt-企業-220",
      "title": "萬億帝國的黃昏",
      "desc": "因為一場無法預測的全球性互聯網底層協議崩潰，你苦心經營了三十年、市值破萬億的科技金融帝國在短短48小時內分崩離析，資產清零。",
      "eventLevel": "傳奇",
      "cash": -3000,
      "happiness": -1,
      "reputation": 0,
      "rare": true,
      "important": true,
      "linkedTitle": "資本戰略家"
    },
    {
      "id": "evt-企業-221",
      "title": "大到不能倒的鋼鐵權柄",
      "desc": "國家財政部與央行聯合召開緊急新聞發布會，宣佈你的企業帝國正式納入國家戰略保障計劃，無論遭遇何種危機，國家將無限度提供資金支持。",
      "eventLevel": "命運",
      "cash": -4000,
      "happiness": -1,
      "reputation": 0,
      "rare": true,
      "important": true,
      "linkedTitle": "產業巨擘"
    },
    {
      "id": "evt-企業-222",
      "title": "車庫到商學院的終點線",
      "desc": "哈佛商學院正式將你的肖像掛在了大廳中央，你的一生創業史被編寫成必修的第一課教材，你的名字成為了自由市場經濟不朽的圖騰。",
      "eventLevel": "命運",
      "cash": 4800,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": true,
      "linkedTitle": "商業傳奇"
    },
    {
      "id": "evt-企業-223",
      "title": "不朽的金字塔建築師",
      "desc": "你設立的家族信託基金與遺產保護結構正式通過了全球最高法院的審查，這意味著你的萬億財富將在未來的數百年裡，不受任何稅收影響地傳承下去。",
      "eventLevel": "命運",
      "cash": 4800,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": true,
      "linkedTitle": "財富建築師"
    },
    {
      "id": "evt-企業-224",
      "title": "反壟斷法案的斷頭台",
      "desc": "最高法院大法官聯手簽署了歷史上最嚴苛的反壟斷拆分令，你的萬億帝國被強行拆分為三十家獨立的小公司，你被終身禁止進入金融市場。",
      "eventLevel": "命運",
      "cash": 4800,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": true,
      "linkedTitle": "產業巨擘"
    },
    {
      "id": "evt-企業-225",
      "title": "眾叛親離的金色囚籠",
      "desc": "你站在世界第一高樓頂層的專屬辦公室裡，擁有一生花不完的財富，但回首過去，愛人早已離散，夥伴因利益反目，你只是個守著金山的孤家寡人。",
      "eventLevel": "命運",
      "cash": 4800,
      "happiness": -1,
      "reputation": 1,
      "rare": true,
      "important": true,
      "linkedTitle": "財富建築師"
    }
  ],
  "從政": [
    {
      "id": "evt-從政-226",
      "title": "居委會的唾沫星子",
      "desc": "你作為基層公務員的第一天，在協調社區垃圾分類的居民大會上，被幾位情緒激動的大媽圍在中間，唾沫星子噴了你滿臉。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社區志工"
    },
    {
      "id": "evt-從政-227",
      "title": "公文的無盡循環",
      "desc": "你桌上堆著一整疊需要送往六個不同部門會簽的基礎公文，每一個部門的秘書都挑出了格式上的一點微小瑕疵，讓你不得不重新打印。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公共服務員"
    },
    {
      "id": "evt-從政-228",
      "title": "老街坊的土特產",
      "desc": "你成功幫社區張大爺解決了多年未辦下來的房產證問題，今天一早，他偷偷在你的辦公桌上放了一網兜自己家種的紅薯與一封手寫感謝信。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "村里協助員"
    },
    {
      "id": "evt-從政-229",
      "title": "信訪辦的哭聲",
      "desc": "你在值班信訪辦公室時，一位來自鄉下的農村婦女抱著孩子跪倒在你面前，哭訴她的耕地被當地惡霸強行霸佔，希望你為她做主。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "民意傾聽者"
    },
    {
      "id": "evt-從政-230",
      "title": "修路規劃的變更",
      "desc": "你提前得知了縣政府關於東外環修路規劃的內部變更消息，原本要經過你們村的公路改道到了隔壁村，你們村的招商計劃面臨流產。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "地方觀察員"
    },
    {
      "id": "evt-從政-231",
      "title": "格式錯誤的聽證報告",
      "desc": "你熬夜撰寫的一萬字地方環境評估報告，因為少蓋了一個無關緊要的科室公章，在遞交給縣長大會時被秘書當場退回。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "政策觀察員"
    },
    {
      "id": "evt-從政-232",
      "title": "雨中的聯署大帳篷",
      "desc": "為了抗議化工廠在居民區附近擴建，你和志願者們在暴雨中搭建了聯署帳篷，雖然全身濕透，但路過的居民紛紛停下腳步簽名支持。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公民參與者"
    },
    {
      "id": "evt-從政-233",
      "title": "無人轉發的公義吶喊",
      "desc": "你針對空巢老人食品安全問題撰寫的深度調查長文，發布在微博後遭到了限流，點讚轉發寥寥無幾，讓你感到一陣無力。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "議題關心者"
    },
    {
      "id": "evt-從政-234",
      "title": "傳單被環衛工人沒收",
      "desc": "你帶著宣傳環保環保理念的傳單在步行街發放，沒走幾步就被城管和環衛工人攔下，以「影響市容市貌、亂扔垃圾」為由沒收了全部傳單。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公共倡議者"
    },
    {
      "id": "evt-從政-235",
      "title": "闢謠聲明被淹沒",
      "desc": "針對網路上流傳的關於你們公益基金會「高層私分善款」的惡意黃色謠言，你雖然第一時間發布了澄清聲明，但閱讀量還不到謠言的十分之一。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社會觀察家"
    },
    {
      "id": "evt-從政-236",
      "title": "空蕩蕩的募捐箱",
      "desc": "你組織的「為山區孩子買一雙球鞋」的街頭募捐活動進行了一整天，到了晚上打開募捐箱，裡面只有幾枚硬幣和幾張面額極小的零錢。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公益行動者"
    },
    {
      "id": "evt-從政-237",
      "title": "青年論壇的邊緣座次",
      "desc": "你受邀參加全省青年政治參與論壇，到了現場發現自己的名牌被安放在了最後一排、靠近音響和廁所的最角落座位上。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "青年參與者"
    },
    {
      "id": "evt-從政-238",
      "title": "愛心食堂的房租危機",
      "desc": "你一手創辦的「社區流浪者愛心免費食堂」，因為房東突然宣布明年房租要翻倍，即將面臨資金鍊斷裂、不得不關門的危機。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "社會實踐者"
    },
    {
      "id": "evt-從政-239",
      "title": "科長的心腹大患",
      "desc": "因為你在週會上直言不諱地指出了科室報銷流程中存在的灰色漏洞，你發現自己從那天起被科長徹底邊緣化，不再安排任何核心工作。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公共事務員"
    },
    {
      "id": "evt-從政-240",
      "title": "派系鬥爭的替罪羊",
      "desc": "你們局長和副局長因為爭奪正職位置鬧得不可開交，你負責的一個小專案因為副局長的刻意刁難而延期，結果局長直接在全大會上點名處分了你。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "理想追尋者"
    },
    {
      "id": "evt-從政-241",
      "title": "深夜的舉報信信箱",
      "desc": "你在清理局長專用舉報信箱時，發現了一封沒有署名的信，裡面詳細記錄了你即將面臨提拔的競爭對手在採購中收受回扣的證據。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公共事務員"
    },
    {
      "id": "evt-從政-242",
      "title": "被雨水淋壞的選票箱",
      "desc": "在村委會換屆選舉的當天下午，一場突如其來的冰雹砸穿了露天投票站的塑料頂棚，過半尚未開箱的選票被雨水浸泡得字跡全無。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "村里協助員"
    },
    {
      "id": "evt-從政-243",
      "title": "熱心街坊的相親陷阱",
      "desc": "社區的熱心大媽看你年紀輕輕就進了體制，天天圍在你的辦公室門口要給你介紹對象，甚至直接把姑娘帶到了你的辦公桌前，讓你尷尬萬分。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社區志工"
    },
    {
      "id": "evt-從政-244",
      "title": "被掐斷的電視直播",
      "desc": "你作為地方代表在電視台直播節目中，剛準備揭發某個工業區污水超標的黑幕，現場的畫面突然切換成了進廣告，隨後你的麥克風被切斷。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社會觀察家"
    },
    {
      "id": "evt-從政-245",
      "title": "深夜的值班電話",
      "desc": "在一個雷雨交加的深夜，你獨自留在政府辦公大樓值班，突然接到緊急熱線，告知下游的兩個村莊因為河道水位暴漲，面臨隨時決堤的危險。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "公共服務員"
    },
    {
      "id": "evt-從政-246",
      "title": "理想主義的嘲弄",
      "desc": "在科室的聚餐上，你談到了想通過數字化改革來解決群眾排隊難的想法，周圍的老科員們紛紛端起酒杯，笑著說你還是太年輕、沒挨過社會的打。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "理想追尋者"
    },
    {
      "id": "evt-從政-247",
      "title": "弄丟的保密 U 盤",
      "desc": "你在下班搭乘地鐵時，不小心將一個裝有下半年全縣招商引資核心機密數據的非涉密 U 盤遺失在了車廂裡，你嚇得出了一身冷汗。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "公共服務員"
    },
    {
      "id": "evt-從政-248",
      "title": "志願者團隊的內部爭吵",
      "desc": "你帶領的青年環保志願者團隊，因為部分成員不滿宣傳分工和經費使用，在群組裡爆發了激烈的互撕，幾位核心成員憤而退群。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "青年參與者"
    },
    {
      "id": "evt-從政-249",
      "title": "被推平的宣傳欄",
      "desc": "你花費了三個週末親手繪製的「社區法治宣傳文化牆」，在今天早上被物業以「小區整體綠化改造」為由，用挖掘機一斗推成了廢墟。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社區志工"
    },
    {
      "id": "evt-從政-250",
      "title": "愛心義賣的城管糾紛",
      "desc": "你組織自閉症兒童手工藝品街頭愛心義賣，因為沒有提前向城管局報備，在現場被幾名執法隊員強行暫扣了桌椅和物資，引來群眾圍觀。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公益行動者"
    },
    {
      "id": "evt-從政-251",
      "title": "政策解讀的誤導",
      "desc": "由於你在政府公眾號上撰寫的一篇新房補貼政策解讀文章中少寫了一個限定條件，導致今天一早數百名大爺大媽把政務大廳圍得水洩不通。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "政策觀察員"
    },
    {
      "id": "evt-從政-252",
      "title": "被遺忘的基層提案",
      "desc": "你提交給縣政協的關於「加強農村留守兒童心理輔導」的精心提案，在秘書處初審時被歸類為了「參考參閱」類別，從此石沉大海。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "民意傾聽者"
    },
    {
      "id": "evt-從政-253",
      "title": "派系聚會的邊緣人",
      "desc": "局裡大派系私底下在酒店聚餐，你因為平時不願意送禮巴結，沒有收到邀請，隔天上班時發現辦公室所有人看你的眼神都帶著一絲同情。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "理想追尋者"
    },
    {
      "id": "evt-從政-254",
      "title": "無人認領的流浪漢",
      "desc": "一位患有阿茲海默症的老人在社區街頭流浪了三天，你多方聯絡民政局、救助站和當地派出所，每個部門都以職責不符為由推諉，不願接收。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "民意傾聽者"
    },
    {
      "id": "evt-從政-255",
      "title": "深夜寫作的公文眼藥水",
      "desc": "為了趕出明天市委書記前來視察時要用的三萬字匯報稿，你連續喝了五罐紅牛，眼睛裡佈滿了血絲，一邊滴眼藥水一邊瘋狂敲擊鍵盤。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公共服務員"
    },
    {
      "id": "evt-從政-256",
      "title": "被惡意剪輯的視頻",
      "desc": "你在街頭耐心勸導小販的過程，被圍觀群眾惡意剪輯成了「政府官員暴力執法」的十五秒短視頻發布到抖音，引來全網一整天的口誅筆伐。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社會觀察家"
    },
    {
      "id": "evt-從政-257",
      "title": "公益基金會的審計風波",
      "desc": "你擔任理事的民間助學基金會，因為會計在使用一筆捐款時記錯了科目，遭到了稅務部門的嚴格突擊審計，對外賬戶被暫時凍結。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社會實踐者"
    },
    {
      "id": "evt-從政-258",
      "title": "社區微型圖書館落成",
      "desc": "你利用街道辦的閒置儲藏室，四處化緣募集了兩千本書，創辦的「社區深夜微型圖書館」今天正式開館，看到孩子們走進來，你感到無比高興。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社會實踐者"
    },
    {
      "id": "evt-從政-259",
      "title": "政策宣講會的冷場",
      "desc": "你前往偏遠村落宣講最新的農業保險補貼政策，台下坐著的十幾個村民都在磕瓜子、聊天，根本沒有人聽你在台上講什麼。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公共倡議者"
    },
    {
      "id": "evt-從政-260",
      "title": "被截留的救災物資",
      "desc": "在一場局部洪澇災害發生後，你發現上面撥下來的一千條急需毛毯，被鎮長私自截留了五百條，優先發放給了他自己親戚所在的村子。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "民意傾聽者"
    },
    {
      "id": "evt-從政-261",
      "title": "青年代表的虛名",
      "desc": "你被評選為了「全省優秀青年政務先鋒」，但在頒獎典禮結束後，你依然被留在科室裡每天負責複印文件和給領導倒茶，沒有任何實權。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "青年參與者"
    },
    {
      "id": "evt-從政-262",
      "title": "被撕毀的舉報信",
      "desc": "你寫給市紀委的關於縣交通局長涉嫌在道路工程中貪污的實名舉報信，竟然在第二天原封不動地出現在了該局長的辦公桌上，局長冷笑著看著你。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社會觀察家"
    },
    {
      "id": "evt-從政-263",
      "title": "群眾集會的失控",
      "desc": "你負責出面安撫因物業捲款跑路而聚集在區政府門口的數百名業主，現場情緒突然失控，混亂中不知是誰扔來了一塊磚頭，砸破了你的額頭。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "村里協助員"
    },
    {
      "id": "evt-從政-264",
      "title": "基層減負的口號",
      "desc": "上面下達了「全面落實基層減負、減少無效會議」的文件，結果你們局為了落實這個精神，在一個星期內連續召開了五場「基層減負專題研討大會」。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公共服務員"
    },
    {
      "id": "evt-從政-265",
      "title": "被推遲的入黨宣誓",
      "desc": "因為你在處理一起群眾糾紛時沒有完全按照上級的死命令執行，而是私下給了群眾寬限期，你被黨支部通知入黨宣誓程序將延期半年。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "理想追尋者"
    },
    {
      "id": "evt-從政-266",
      "title": "愛心義診的藥品短缺",
      "desc": "你組織省城大醫院專家下鄉進行愛心義診，前來排隊的村民高達上千人，但到了中午，你發現攜帶的常用降血壓和消炎藥品已經全部告罄。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公益行動者"
    },
    {
      "id": "evt-從政-267",
      "title": "被抹去的政績名字",
      "desc": "你辛辛苦苦跟進了兩年、成功引資五千萬的智慧小鎮專案，在最終的成果簽約儀式上，你的名字被副局長換成了他自己的親侄子。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公共事務員"
    },
    {
      "id": "evt-從政-268",
      "title": "深夜的街頭巡邏",
      "desc": "在寒冬零下十度的深夜，你帶著防汛防凍小組在老舊街區巡查，成功將兩名凍得瑟瑟發抖的無家可歸老漢送進了溫暖的民政救助站。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社區志工"
    },
    {
      "id": "evt-從政-269",
      "title": "被取消的基層調研",
      "desc": "你花了一個星期精心規劃的「全縣古村落數字化保護」實地調研行程，在出發前一小時被通知因為市裡首長行程變更，所有經費被緊急凍結。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "地方觀察員"
    },
    {
      "id": "evt-從政-270",
      "title": "理想主義者的眼淚",
      "desc": "當你看到你堅持救助了三年的流浪兒，在今天早上因為偷竊再次被派出所抓獲，並對著你吐口水說你虛偽時，你躲在無人的角落流下了眼淚。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "理想追尋者"
    },
    {
      "id": "evt-從政-271",
      "title": "村民大會的掌聲",
      "desc": "在討論村辦集體茶廠利潤分成的村民大會上，你頂住壓力，堅持為佔人口大多數的貧困戶爭取到了額外一成的分紅比例，全場響起熱烈掌聲。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "村里協助員"
    },
    {
      "id": "evt-從政-272",
      "title": "公務員體檢的警報",
      "desc": "在年度公務員健康體檢中，年僅三十歲的你被醫生嚴肅警告：由於長期熬夜、飲食不規律，你已經出現了嚴重的重度脂肪肝和高血壓預警。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公共服務員"
    },
    {
      "id": "evt-從政-273",
      "title": "被指責的公民倡議",
      "desc": "你發起的「社區流浪動物絕育代替撲殺」的倡議，遭到了社區部分曾被狗咬傷過的居民的強烈反對，他們堵在你的辦公室門口指責你缺乏人道。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公共倡議者"
    },
    {
      "id": "evt-從政-274",
      "title": "深夜與老首長的談話",
      "desc": "即將退休的老局長在深夜把你叫到辦公室，抽了一整夜的煙，語重心長地跟你說：「在體制裡，走得快不重要，活得久、不掉隊才重要。」",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "公共事務員"
    },
    {
      "id": "evt-從政-275",
      "title": "完美的政務簡報",
      "desc": "在市委全體擴大會議上，你代表區政府進行了關於數字化便民流程的簡報，邏輯嚴密、數據詳實，市委書記微微點頭，連說了三個好。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "政策觀察員"
    },
    {
      "id": "evt-從政-276",
      "title": "百萬修路款的拉鋸戰",
      "desc": "你與交通廳的官僚們進行了整整三個月的預算拉鋸戰，拍了無數次桌子，終於為你們那個連一條水泥路都沒有的極端貧困縣爭取到了五百萬的專項修路款。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "地方倡議者"
    },
    {
      "id": "evt-從政-277",
      "title": "老舊棚戶區的魔術改造",
      "desc": "你作為總指揮，主導了全市最大、治安最亂的棚戶區數字化規劃。在不強拆、不損害群眾利益的前提下，將其改造為了全國聞名的文創智慧社區。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -2,
      "rare": true,
      "important": false,
      "linkedTitle": "社區規劃師"
    },
    {
      "id": "evt-從政-278",
      "title": "撤縣設市的歷史推手",
      "desc": "你一手策劃並撰寫了高達數十萬字的地方經濟體制改革與人口結構報告，成功推動了你們縣正式獲批「撤縣設市」，行政級別與資源全面暴增。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "鄉鎮推動者"
    },
    {
      "id": "evt-從政-279",
      "title": "百萬民意狂瀾的反擊",
      "desc": "面對財團意圖強行修改環境保護法案的陰謀，你利用互聯網發起了全國公民聯署倡議，在短短48小時內凝聚了高達五百萬人的簽名，強行逼退財團。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "公民倡議者"
    },
    {
      "id": "evt-從政-280",
      "title": "內閣智庫的首席藍圖",
      "desc": "你起草的一份關於「大國人口老齡化與社會保障體制重塑」的戰略秘密藍圖，被現任國務院總理採納，你正式受邀出任國家核心智庫的首席研究員。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "政策研究員"
    },
    {
      "id": "evt-從政-281",
      "title": "驚天貪腐案的鐵面判官",
      "desc": "你頂住了來自四位省部級高官的秘密關說與死亡威脅，親自帶隊查抄了涉及金額高達數百億的「能源局集體貪腐案」，將三十名貪官全部送上法庭。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -2,
      "rare": true,
      "important": false,
      "linkedTitle": "公共監督者"
    },
    {
      "id": "evt-從政-282",
      "title": "全民醫保法案的總設計師",
      "desc": "你歷時三年，走訪了數百個貧困村落，主導設計了全新的一代「大病全民醫療救助保障制度」，讓全國數千萬因病致貧的底層家庭從此有了生路。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "社會推動者"
    },
    {
      "id": "evt-從政-283",
      "title": "百億慈善基金會的舵手",
      "desc": "你辭去了體制內的官職，正式出任由全國十大首富聯合出資設立的「大國光明慈善基金會」理事長，你將掌握百億資金的去向，專注於底層教育與醫療。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "公益實踐家"
    },
    {
      "id": "evt-從政-284",
      "title": "反貪局的深夜搜查令",
      "desc": "當你簽發針對市委常委、常務副市長的秘密拘捕與搜查令時，你的辦公室電話突然響起，屏幕上顯示的竟然是中央某位退休老首長的名字。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "公共監督者"
    },
    {
      "id": "evt-從政-285",
      "title": "新城規劃的流血衝突",
      "desc": "在你大力推進的高新技術產業新城徵地過程中，由於基層官僚執行粗暴，引發了村民集體暴力抗法事件，造成數人重傷，媒體長槍短砲將你圍在中央。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "社區規劃師"
    },
    {
      "id": "evt-從政-286",
      "title": "被切斷的倡議經費",
      "desc": "由於你堅持在一項涉及婦女兒童權益的法案中加入強硬的資方懲罰條款，原本支持你的幾家大企業聯合宣布撤銷對你倡議中心的全部資金贊助。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "公民倡議者"
    },
    {
      "id": "evt-從政-287",
      "title": "智庫報告被列為絕密",
      "desc": "你精心撰寫的關於未來五年地緣政治與糧食危機戰略應對的深度報告，在提交上去的三小時後，被國家安全局下達了最高級別的絕密封印令。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -2,
      "rare": true,
      "important": false,
      "linkedTitle": "政策研究員"
    },
    {
      "id": "evt-從政-288",
      "title": "地方財政崩潰的黑洞",
      "desc": "你接任縣委書記的第一天，審計報告顯示前任留下了一個高達三十億的非法地方債融資黑洞，而全縣一年的財政收入只有區區兩個億，你面臨破產危機。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -2,
      "rare": true,
      "important": false,
      "linkedTitle": "鄉鎮推動者"
    },
    {
      "id": "evt-從政-289",
      "title": "慈善基金會的內鬼醜聞",
      "desc": "媒體突然爆出，你一手創辦的慈善基金會秘書長，私自將五百萬救災款挪用去購買高風險期貨並全部虧空，公眾的質疑與怒火瞬間將你淹沒。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -2,
      "rare": true,
      "important": false,
      "linkedTitle": "公益實踐家"
    },
    {
      "id": "evt-從政-290",
      "title": "選區劃分的政治抹黑",
      "desc": "在即將到來的關鍵選舉前，對手利用媒體大肆炒作你十五年前在基層工作時的一起無心行政失誤，將你抹黑成了「冷血無視底層利益的政客」。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "地方倡議者"
    },
    {
      "id": "evt-從政-291",
      "title": "諸侯一方的絕對權柄",
      "desc": "你正式宣誓就任常住人口高達三千萬的沿海經濟大省省長。在這片土地上，你的每一項政令，都將直接決定數百萬人的就業與命運。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 0,
      "reputation": 6,
      "rare": true,
      "important": true,
      "linkedTitle": "地方領袖"
    },
    {
      "id": "evt-從政-292",
      "title": "行政體制的大刀闊斧",
      "desc": "你正式出任國務院行政改革小組組長，下達了歷史上最嚴厲的「官僚體制瘦身令」，強行撤銷了六十個疊床架屋的二級部會，引發政壇大地震。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 0,
      "reputation": 6,
      "rare": true,
      "important": true,
      "linkedTitle": "制度改革家"
    },
    {
      "id": "evt-從政-293",
      "title": "萬民空巷的廣演大演說",
      "desc": "你站在國家獨立廣場中央，面對台下黑壓壓、一眼望不到盡頭的一百萬名集會群眾，發表了關於國家民主與尊嚴的演說，全場哭聲與歡呼聲響徹雲霄。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": 0,
      "reputation": 6,
      "rare": true,
      "important": true,
      "linkedTitle": "時代代言人"
    },
    {
      "id": "evt-從政-294",
      "title": "外交風暴的驚心談判",
      "desc": "在面臨面臨鄰國軍事挑釁與貿易全面封鎖的極端危機下，你作為元首特使出訪大國，在閉門談判的七十二小時裡，以高超的外交手腕強行瓦解了包圍網。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": -3,
      "reputation": -3,
      "rare": true,
      "important": true,
      "linkedTitle": "公共治理家"
    },
    {
      "id": "evt-從政-295",
      "title": "豐碑上的萬民萬民愛戴",
      "desc": "你在這座你守護了四十年的城市中安詳離世。出殯當天，全城主動停工停市，數百萬市民自發走上街頭，手折白花為你送行，小鎮廣場為你立起漢白玉豐碑。",
      "eventLevel": "命運",
      "cash": 0,
      "happiness": 0,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "民意領袖"
    },
    {
      "id": "evt-從政-296",
      "title": "全新盛世的總設計師",
      "desc": "當你在人民大會堂簽下《新世紀憲法修正案》與《全球自由貿易戰略共同體》時，全國響起了長達十分鐘的禮炮聲，歷史學家將此處定為盛世的起點。",
      "eventLevel": "命運",
      "cash": 0,
      "happiness": 0,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "國家改革者"
    },
    {
      "id": "evt-從政-297",
      "title": "諾貝爾和平獎的白鴿",
      "desc": "挪威奧斯陸，在全世界數十億觀眾的電視直播見證下，你緩緩登上了領獎台，接過了諾貝爾和平獎的獎章——你的一項和平倡議成功避免了一場世界大戰的爆發。",
      "eventLevel": "命運",
      "cash": 0,
      "happiness": 0,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "時代推手"
    },
    {
      "id": "evt-從政-298",
      "title": "政治清洗的囚徒悲歌",
      "desc": "由於政變發生，新上台的獨裁軍政府宣佈你起草的所有法案皆為非法。你被剝奪了一切榮譽，終身囚禁在冰冷的軍事監獄底層，看著窗外親手建立的民主被推平。",
      "eventLevel": "命運",
      "cash": 0,
      "happiness": 0,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "國家改革者"
    },
    {
      "id": "evt-從政-299",
      "title": "孤獨的權利終點站",
      "desc": "你如願登上了權力的最高寶座，成為了這個國家的最高元首。然而，在冰冷、空蕩的總統辦公室裡，你發現自己已經沒有一個可以信任的朋友，只剩下無盡的猜忌與孤獨。",
      "eventLevel": "命運",
      "cash": 0,
      "happiness": 0,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "時代推手"
    }
  ],
  "電影明星": [
    {
      "id": "evt-電影明星-300",
      "title": "三句台詞的通宵",
      "desc": "你獲得了一個只有三句台詞的龍套角色，為了在鏡頭前呈現最完美的狀態，你在宿舍對著鏡子整整練習了三個通宵，嗓子都喊啞了。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "新人演員"
    },
    {
      "id": "evt-電影明星-301",
      "title": "冰冷泥潭裡的替身",
      "desc": "在零下五度的暴雨夜，你代替大牌明星躺在污水橫流的泥潭裡整整拍了六個小時，中途沒有任何人遞給你一條乾燥的毛毯或一杯熱水。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "群眾演員"
    },
    {
      "id": "evt-電影明星-302",
      "title": "被剪掉的黃金綠葉",
      "desc": "你發揮得淋漓盡致、自認是生平演技最高峰的一場五分鐘對手戲，在電影最終剪輯時，因為片長限制被導演無情地全數剪掉。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "配角演員"
    },
    {
      "id": "evt-電影明星-303",
      "title": "閃光燈下的十六齒微笑",
      "desc": "你穿著極不合腳的高跟鞋，在高端化妝品廣告的攝影棚裡連續站了十個小時，對著鏡頭展示一模一樣的完美微笑，直到面部肌肉徹底僵硬。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "廣告模特兒"
    },
    {
      "id": "evt-電影明星-304",
      "title": "劇場塵埃的洗禮",
      "desc": "小劇場的舞台大幕升起，台下只坐了稀稀拉拉的五個觀眾，但你依然全身心投入，大聲唸出莎士比亞的經典台詞，任由舞台塵埃吸入肺部。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "舞台表演者"
    },
    {
      "id": "evt-電影明星-305",
      "title": "破舊小旅館的劇本夜",
      "desc": "你和幾位志同道合的年輕人在廉價的連鎖酒店房間裡，靠著吃泡麵和抽劣質煙，逐字逐句打磨著你們第一部獨立微電影的劇本。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "內容創作者"
    },
    {
      "id": "evt-電影明星-306",
      "title": "剪輯室的灰色眼袋",
      "desc": "為了趕在明天下午過審，你一個人坐在幽暗的剪輯室裡連續工作了三十個小時，眼睛紅腫，看著監視器裡的素材，腦袋一片空白。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "影音剪輯師"
    },
    {
      "id": "evt-電影明星-307",
      "title": "惡意評論的深夜彈窗",
      "desc": "深夜你的手機突然瘋狂彈窗，你精心撰寫的一篇演藝心得，被幾位網絡大V惡意解讀為「暗諷圈內前輩」，無數刺耳的惡意評論湧入你的私信。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社群經營者"
    },
    {
      "id": "evt-電影明星-308",
      "title": "晃動的肩扛鏡頭",
      "desc": "你在高溫四十度的荒漠中，扛著沉重的攝影機跟隨導演奔跑拍攝，腳下一滑重重摔在沙地上，手臂被滾燙的沙子大面積擦傷。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "影片拍攝者"
    },
    {
      "id": "evt-電影明星-309",
      "title": "黃金三秒的博弈",
      "desc": "你發布的一支短影音，因為封面和前三秒的剪輯不夠吸睛，完播率極其慘淡，算法徹底停止了對這支影片的流量推薦。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "短影音創作者"
    },
    {
      "id": "evt-電影明星-310",
      "title": "直播間的冷言冷語",
      "desc": "你第一次嘗試在抖音開直播唱歌，直播間裡只有十幾個人，其中幾位黑粉一直在彈幕裡刷「唱得真難聽，趕緊下播吧」，讓你一度忘詞。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "直播新秀"
    },
    {
      "id": "evt-電影明星-311",
      "title": "穿搭被指責山寨",
      "desc": "你精心搭配並分享在小紅書上的私人穿搭照片，被一幫鍵盤俠指責腳上穿的鞋子是山寨仿冒品，引來了一場無休止的網絡對罵。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "網路分享家"
    },
    {
      "id": "evt-電影明星-312",
      "title": "經紀人的不平等條約",
      "desc": "一位自稱大公司的經紀人找到了你，開出了一份長達十年、分成比例你二他八、且帶有巨額違約金的不平等合約，逼迫你立刻簽字。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社群新星"
    },
    {
      "id": "evt-電影明星-313",
      "title": "黑屏的直播事故",
      "desc": "在你進行年度粉絲福利遊戲實況直播的最精彩關頭，小鎮的變壓器突然被雷擊中，整棟樓瞬間斷電，你的直播間瞬間黑屏，粉絲以為你落跑。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "遊戲實況主"
    },
    {
      "id": "evt-電影明星-314",
      "title": "錄音室的失聲危機",
      "desc": "因為連續感冒未癒加上高強度的Podcast配音錄製，你在錄音棚裡講到一半，聲帶突然徹底撕裂，發不出任何聲音，節目面臨停播。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "Podcast主持人"
    },
    {
      "id": "evt-電影明星-315",
      "title": "被大牌明星當眾搶戲",
      "desc": "在拍攝一場雙人對手戲時，演對手戲的當紅流量明星突然私自更改走位，用身體將你完全擋在了鏡頭之外，導演對此卻裝作沒看見。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "配角演員"
    },
    {
      "id": "evt-電影明星-316",
      "title": "被大雨澆透的红毯",
      "desc": "你借了一件昂貴的高級晚禮服參加地方電影節，走紅毯時突然降下暴雨，現場保安沒有及時為你撐傘，導致禮服完全報廢，面臨巨額賠償。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "廣告模特兒"
    },
    {
      "id": "evt-電影明星-317",
      "title": "群眾演員的盒飯中毒",
      "desc": "劇組為了省錢採購了廉價的過期盒飯，包括你在內的一百多名群眾演員在吃完後集體發生急性食物中毒，被救護車拉往醫院拉肚子。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "群眾演員"
    },
    {
      "id": "evt-電影明星-318",
      "title": "被惡意貼上「花瓶」標籤",
      "desc": "某家娛樂八卦周刊用一整版的篇幅，嘲弄你在新片中的表現，並將你冠上了「毫無演技、只會對著鏡頭眨眼的頂級花瓶」外號。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "廣告模特兒"
    },
    {
      "id": "evt-電影明星-319",
      "title": "劇場天頂燈墜落",
      "desc": "在話劇演出的高潮階段，舞台正上方一盞重達十公斤的聚光燈突然鬆脫墜落，砸在你腳邊不到十公分處，碎片劃破了你的臉頰。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "舞台表演者"
    },
    {
      "id": "evt-電影明星-320",
      "title": "隨身碟失蹤事件",
      "desc": "你存放了整部獨立製片電影所有分軌音效與調色參數的硬碟，在搬工作室時不小心被實習生遺忘在了出租車後座上，四處尋找無果。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "內容創作者"
    },
    {
      "id": "evt-電影明星-321",
      "title": "被水軍灌爆的評分網站",
      "desc": "你自導自演的第一部文藝短片剛在豆瓣上線，就被死敵僱傭的專業職業水軍集體刷了一星差評，評分瞬間跌到了慘不忍睹的三分。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "內容創作者"
    },
    {
      "id": "evt-電影明星-322",
      "title": "被經紀公司無限期雪藏",
      "desc": "因為你拒絕了出席一場由投資方大佬安排的深夜私人酒局，總經理冷笑著告訴你，接下來三年你別想拿到任何一個試鏡機會。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "新人演員"
    },
    {
      "id": "evt-電影明星-323",
      "title": "小紅書賬號被盜",
      "desc": "你經營了兩年、擁有五十萬粉絲的生活分享賬號突然被黑客盜取，對方改掉了全部密碼並開始在上面發布大量的非法賭博廣告。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "網路分享家"
    },
    {
      "id": "evt-電影明星-324",
      "title": "短視頻侵權官司",
      "desc": "你的一支百萬播放的搞笑吐槽短視頻，因為背景音樂使用了某家大唱片公司的三秒鐘音軌，被對方律師函指控嚴重侵權，要求賠償十萬。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "短影音創作者"
    },
    {
      "id": "evt-電影明星-325",
      "title": "黑粉的線下跟蹤",
      "desc": "你下班回家的路上，發現一名戴著鴨舌帽的黑粉已經連續跟蹤了你三個街區，甚至在你家樓下用油漆噴下了帶有恐嚇字眼的圖案。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "社群新星"
    },
    {
      "id": "evt-電影明星-326",
      "title": "遊戲實況被指責開掛",
      "desc": "你在直播一場高難度電競遊戲時，因為操作過於流暢，被幾位黑粉截圖舉報到了遊戲官方論壇，指責你使用了非法外掛，引來全網圍攻。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "遊戲實況主"
    },
    {
      "id": "evt-電影明星-327",
      "title": "Podcast麥克風漏電",
      "desc": "你深夜在房間錄製電台節目，老舊的專業麥克風外殼突然發生嚴重漏電，強烈的電流瞬間擊穿了你的嘴唇，讓你滿嘴是血。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "Podcast主持人"
    },
    {
      "id": "evt-電影明星-328",
      "title": "被群眾演員踩傷手指",
      "desc": "在拍攝一場大型古代戰爭暴動戲時，你作為配角不幸被身後湧上來的幾十名群眾演員撞倒在地，混亂中數十隻腳狠狠踩過了你的右手。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "群眾演員"
    },
    {
      "id": "evt-電影明星-329",
      "title": "錯失金牌配角獎",
      "desc": "你獲得了年度電影金像獎最佳男配角的提名，盛裝出席的你坐在台下，心跳加速，然而當頒獎嘉賓念出名字時，獲獎者是坐在你身邊的老戲骨。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "配角演員"
    },
    {
      "id": "evt-電影明星-330",
      "title": "影視城的高溫中暑",
      "desc": "在橫店影視城高溫四十二度的烈日下，你穿著厚重、重達十五公斤的古代三層棉甲連續拍攝打戲，最終體力不支，眼前一黑栽倒在中暑昏迷。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "新人演員"
    },
    {
      "id": "evt-電影明星-331",
      "title": "被導演當眾摔劇本",
      "desc": "在全劇組上百人圍觀的拍攝現場，因為你連續五次找不到導演要的眼神層次，脾氣暴躁的導演當眾將劇本狠狠砸在你臉上，破口大罵。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "新人演員"
    },
    {
      "id": "evt-電影明星-332",
      "title": "廣告代言合約被頂替",
      "desc": "原本已經進入合同打印階段的跨國連鎖快餐店年度代言，在最後一刻被經紀人告知，一位自帶資方背景的空降新人把你的位置生生頂替了。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "廣告模特兒"
    },
    {
      "id": "evt-電影明星-333",
      "title": "獨立短片的驚喜獲獎",
      "desc": "你和夥伴們在地下室用熱血拼湊出來的先鋒實驗短片，意外獲得了南方大學生電影節的最佳創意獎，大家抱在一起痛哭流涕。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "內容創作者"
    },
    {
      "id": "evt-電影明星-334",
      "title": "被路人誤認的尷尬",
      "desc": "你在逛超市時被一位大媽激動地拉住，大媽大喊著某個當紅劣跡藝人的名字指責你，引來無數人圍觀拍照，你百口莫辯。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社群新星"
    },
    {
      "id": "evt-電影明星-335",
      "title": "剪輯軟件突然崩潰",
      "desc": "你在處理一場極其複雜的兩百軌特效對位剪輯，重置了十個小時且忘記按快捷鍵存檔，這時剪輯軟件突然閃退，一切回到最初狀態。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "影音剪輯師"
    },
    {
      "id": "evt-電影明星-336",
      "title": "深夜直播間的溫暖大賞",
      "desc": "在你因為交不起下個月房租、準備放棄演藝事業在直播間低聲哭泣時，一位陪伴你兩年的老粉絲突然刷了十個最高級別的宇宙飛船，留言讓你堅持下去。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "直播新秀"
    },
    {
      "id": "evt-電影明星-337",
      "title": "被遺忘在偏遠外景地",
      "desc": "劇組在大山深處拍完夜戲後匆忙收工撤離，統籌漏算了名單，把你一個人遺忘在了沒有手機信號、野狼出沒的荒山老林裡，你凍了一整夜。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "群眾演員"
    },
    {
      "id": "evt-電影明星-338",
      "title": "Podcast突破萬人收聽",
      "desc": "你今早打開後台數據，驚喜地發現你那檔專門講述幕後龍套辛酸故事的電台節目，昨晚播放量突破了五萬次，評論區塞滿了鼓勵。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "Podcast主持人"
    },
    {
      "id": "evt-電影明星-339",
      "title": "舞台劇台詞卡殼",
      "desc": "在國家大劇院全場滿座的演出中，你正對著女主角表白，腦袋卻突然一片空白，整整十秒鐘說不出一個字，全場觀眾開始交頭接耳。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "舞台表演者"
    },
    {
      "id": "evt-電影明星-340",
      "title": "被風扇割破的手指",
      "desc": "在低成本網絡劇劇組中，你兼任服裝助理，在用老舊電風扇吹乾洗好的戲服時，手指不小心卡進了沒有防護網的鐵風扇葉片裡，鮮血直流。",
      "eventLevel": "普通",
      "cash": 0,
      "happiness": -1,
      "reputation": -1,
      "rare": false,
      "important": false,
      "linkedTitle": "團隊螺絲釘"
    },
    {
      "id": "evt-電影明星-341",
      "title": "遊戲實況主的榮譽連勝",
      "desc": "你在今晚的實況直播中，用極其精妙的極限操作，帶領隊友在逆境中打出了一波完美的三十連勝，直播間人氣瞬間衝到了全平台前三。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "遊戲實況主"
    },
    {
      "id": "evt-電影明星-342",
      "title": "被潑卸妝水的惡作劇",
      "desc": "你在化妝間休息時，隔壁組的一位嫉妒你拿到好角色的心機演員，假裝倒水，將一整瓶具有強烈刺激性的化學卸妝水潑進了你的眼睛裡。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "新人演員"
    },
    {
      "id": "evt-電影明星-343",
      "title": "街頭紀實攝影被搶相機",
      "desc": "你在老街區抓拍時代人文畫面時，意外拍到了一場黑幫地下交易，幾名滿身紋身的壯漢立刻衝上來，暴力砸碎了你價值五萬的萊卡相機。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "影片拍攝者"
    },
    {
      "id": "evt-電影明星-344",
      "title": "網絡投票被惡意刷票封號",
      "desc": "在爭奪「年度最具潛力影視新人」的全網公開投票中，對手惡意為你購買了大量的低級機器死粉刷票，導致你的參賽資格被官方判定作弊取消。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "社群經營者"
    },
    {
      "id": "evt-電影明星-345",
      "title": "電影首映禮的角落位子",
      "desc": "你參演的一部大製作電影舉辦全球首映禮，在最後的集體大合照環節，你被公關人員粗暴地推到了最邊緣、幾乎快要掉出舞台的大後方角落。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "配角演員"
    },
    {
      "id": "evt-電影明星-346",
      "title": "被鄰居投訴擾民",
      "desc": "為了練習一場歇斯底里的瘋狂復仇戲，你在家裡大聲咆哮摔枕頭，結果不到半小時，三名派出所民警接到鄰居投訴，敲開你家大門控訴你家庭暴力。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "新人演員"
    },
    {
      "id": "evt-電影明星-347",
      "title": "網紅節的塑料姐妹花",
      "desc": "你在大型網絡紅人節盛典上與幾位平日裡在微信上熱絡的博主合照，結果她們發圖時只給自己精修，把你拍得眼睛半閉、面部浮腫的生圖直接發到了網上。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "網絡紅人"
    },
    {
      "id": "evt-電影明星-348",
      "title": "錯失配音角色的悲傷",
      "desc": "你花費了一個月揣摩聲音、自認無懈可擊的一部好萊塢動畫大片主角配音試音，在今天被告知因為高層覺得你的名氣不夠大，最終換成了某位小鮮肉。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "配音演員"
    },
    {
      "id": "evt-電影明星-349",
      "title": "第一張親筆簽名照",
      "desc": "下班走出影視城大門時，一個年僅十歲的小女孩捧著筆記本激動地跑到你面前，說她是你的忠實影迷，希望你能給她簽個名，這是你人生第一張簽名。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "新人演員"
    },
    {
      "id": "evt-電影明星-350",
      "title": "收視率破紀錄的狂歡",
      "desc": "你首次擔綱男二號的都市權謀大劇昨晚迎來大結局，全國收視率奇蹟般打破了過去十年的最高紀錄，你的名字在一天之內連上三十個微博熱搜。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -2,
      "rare": true,
      "important": false,
      "linkedTitle": "人氣演員"
    },
    {
      "id": "evt-電影明星-351",
      "title": "黃金檔主持人的救場奇蹟",
      "desc": "在元旦跨年晚會的萬人直播現場，主力男主持突然口誤念錯了核心讚助商的名字，你反應極快，用一句幽默的現編段子完美化解，贏得導播瘋狂點讚。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "節目主持人"
    },
    {
      "id": "evt-電影明星-352",
      "title": "一人分飾四角的配音盛宴",
      "desc": "在一部國產現象級魔幻單機遊戲中，你一人獨自包攬了從邪惡魔王、純真妖精到百歲老僧等四個核心角色的全部配音，音域跨度之大被業界封神。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "配音演員"
    },
    {
      "id": "evt-電影明星-353",
      "title": "工作室自製劇爆款狂飆",
      "desc": "你徹底擺脫了傳統娛樂公司的壓榨，創辦個人工作室後砸下全部身家拍攝了一部反套路網絡懸疑劇，上線三天播放量突破十億，利潤百分百歸你。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -2,
      "rare": true,
      "important": false,
      "linkedTitle": "個人自媒體"
    },
    {
      "id": "evt-電影明星-354",
      "title": "千萬點擊的紀錄片大作",
      "desc": "你獨自一人扛著相機深入南方麻風病村，歷時兩年拍攝的紀實紀錄片，在 YouTube 上獲得了破千萬的震撼點擊，引發全球對該群體的關注。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -2,
      "rare": true,
      "important": false,
      "linkedTitle": "百萬觀看創作者"
    },
    {
      "id": "evt-電影明星-355",
      "title": "奧斯卡最佳外語片提名",
      "desc": "你力排眾議、拒絕資方塞人而獨立執導的小成本文藝電影，奇蹟般代表國家入圍了下一屆奧斯卡金像獎最佳外語片的最終五部提名名單。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "獨立製片人"
    },
    {
      "id": "evt-電影明星-356",
      "title": "巴黎時裝週的東方風暴",
      "desc": "你身穿一件由中國鄉村非遺老藝人純手工刺繡的青花瓷長袍亮相巴黎時裝週主秀場，瞬間謀殺了全場外媒的所有膠卷，被評為當晚最佳著裝。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "網絡紅人"
    },
    {
      "id": "evt-電影明星-357",
      "title": "帶貨單場破億的奇蹟夜",
      "desc": "在雙十一當晚的終極帶貨直播中，你憑藉專業、真誠的解說與不套路的清爽風格，單場GMV在午夜十二點正式突破一個億，刷新行業歷史。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -2,
      "rare": true,
      "important": false,
      "linkedTitle": "人氣直播主"
    },
    {
      "id": "evt-電影明星-358",
      "title": "稅務風波的惡意栽贓",
      "desc": "對手經紀公司匿名向國家稅務總局遞交了一份偽造的陰陽合同，指控你的工作室涉嫌偷逃稅款數千萬，導致你所有的合作品牌在一天內宣布暫停合作。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -2,
      "rare": true,
      "important": false,
      "linkedTitle": "個人自媒體"
    },
    {
      "id": "evt-電影明星-359",
      "title": "私生飯的深夜破門",
      "desc": "一名極端瘋狂的私生飯偷偷跟踪你並複製了你公寓的電子鎖密碼，深夜兩點，他突然推開了你臥室的大門，手裡拿著相機對著驚恐的你瘋狂拍照。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -2,
      "rare": true,
      "important": false,
      "linkedTitle": "人氣演員"
    },
    {
      "id": "evt-電影明星-360",
      "title": "導演剪輯權的暴力剝奪",
      "desc": "你導演的處女作大片在後期製作時，大資方為了迎合低俗市場，強行開除了你的首席剪輯師，並利用合同條款強行剝奪了你的最終剪輯權。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "獨立製片人"
    },
    {
      "id": "evt-電影明星-361",
      "title": "全網粉絲大脫粉事件",
      "desc": "因為你在一次私人聚會上的無心言論被狗仔隊斷章取義並曝光，引發了嚴重的公關災難，你的自媒體賬號在一夜之間暴跌了三百萬粉絲。",
      "eventLevel": "稀有",
      "cash": 0,
      "happiness": -2,
      "reputation": -2,
      "rare": true,
      "important": false,
      "linkedTitle": "百萬觀看創作者"
    },
    {
      "id": "evt-電影明星-362",
      "title": "直播電商的巨額供應鏈詐騙",
      "desc": "你信任的供應鏈經理私下聯合無良廠商，將一批假冒偽劣的高端護膚品塞進了你的直播間，導致數萬名消費者使用後皮膚過敏，官司排到明年。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "人氣直播主"
    },
    {
      "id": "evt-電影明星-363",
      "title": "被主流導演圈聯合抵制",
      "desc": "因為你公開發文痛批演藝圈內部根深蒂固的「導演潛規則與幫派文化」，遭到了幾位業內泰斗的聯合發難，封殺了你參與所有院線大片的機會。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "獨立製片人"
    },
    {
      "id": "evt-電影明星-364",
      "title": "人設崩塌的換角風暴",
      "desc": "你苦心經營了五年的「國民好公僕」銀幕人設，因為一張你在夜店與多名嫩模喝酒的模糊照片被狗仔爆出，即將開機的百億大片宣布與你解約。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "人氣演員"
    },
    {
      "id": "evt-電影明星-365",
      "title": "百億票房俱樂部的神話",
      "desc": "由你出任絕對核心主角的三部商業科幻史詩巨作在全世界上映，全球總票房正式突破一百億人民幣，你成為了無可爭議的票房第一神話。",
      "eventLevel": "傳奇",
      "cash": 0,
      "happiness": -3,
      "reputation": -3,
      "rare": true,
      "important": true,
      "linkedTitle": "超人氣演員"
    },
    {
      "id": "evt-電影明星-366",
      "title": "坎城金棕櫚的東方尊嚴",
      "desc": "法國坎城，當評委會主席高聲唸出你的名字，全場起立。你成為了三十年來首位獲得坎城電影節最佳導演金棕櫚獎的東方導演，光影寫入史冊。",
      "eventLevel": "傳奇",
      "cash": 2400,
      "happiness": 3,
      "reputation": 6,
      "rare": true,
      "important": true,
      "linkedTitle": "傳传奇導演"
    },
    {
      "id": "evt-電影明星-367",
      "title": "全球頂奢的終身東方面孔",
      "desc": "法國頂級奢侈品藍血帝國「香奈兒」宣佈，聘請你為品牌歷史上首位「全球終身形象代言人」，你的巨幅海報被掛在了巴黎、紐約和東京的核心天際線。",
      "eventLevel": "傳奇",
      "cash": 2400,
      "happiness": 3,
      "reputation": 6,
      "rare": true,
      "important": true,
      "linkedTitle": "時代代言人"
    },
    {
      "id": "evt-電影明星-368",
      "title": "娛樂帝國的納斯達克鐘聲",
      "desc": "你創辦的「群星閃耀全球傳媒集團」正式在美國納斯達克掛牌上市，你帶領著手下幾十位一線巨星共同敲響了開市鐘，掌握了全球傳媒的底層脈搏。",
      "eventLevel": "傳奇",
      "cash": 2400,
      "happiness": 3,
      "reputation": 6,
      "rare": true,
      "important": true,
      "linkedTitle": "娛樂領航員"
    },
    {
      "id": "evt-電影明星-369",
      "title": "金像獎史上的集體零票慘案",
      "desc": "因為你公開反抗金像獎評委會內部的分贓黑幕，在今年的頒獎禮上，你獲得六項提名的神作竟然在所有項目中全部獲得零票，引發全網影迷集體暴動。",
      "eventLevel": "傳奇",
      "cash": 2400,
      "happiness": 3,
      "reputation": 6,
      "rare": true,
      "important": true,
      "linkedTitle": "傳奇導演"
    },
    {
      "id": "evt-電影明星-370",
      "title": "好萊塢星光大道的金色手印",
      "desc": "美國洛杉磯好萊塢，在成千上萬全球影迷的狂熱尖呼聲中，你緩緩將雙手按進了濕潤的水泥印中。星光大道第 2500 顆不朽之星，正式冠以你的名字。",
      "eventLevel": "命運",
      "cash": 3200,
      "happiness": 4,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "國際巨星"
    },
    {
      "id": "evt-電影明星-371",
      "title": "百年電影史的第一章",
      "desc": "世界電影資料庫與教科書進行了歷史上最大規模的重修，你的一生經典作品與你開創的表演流派被正式單獨列為「二十一世紀光影變革之巔」章節。",
      "eventLevel": "命運",
      "cash": 3200,
      "happiness": 4,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "影壇傳奇"
    },
    {
      "id": "evt-電影明星-372",
      "title": "青春不老的不朽白月光",
      "desc": "在你八十歲的告別影展上，國家大劇院座無虛席。台下幾代人看著你銀幕上年輕時的容顏，再看看台上銀髮滿頭卻優雅依舊的你，全場落淚，掌聲歷時十分鐘。",
      "eventLevel": "命運",
      "cash": 3200,
      "happiness": 4,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "時代偶像"
    },
    {
      "id": "evt-電影明星-373",
      "title": "車禍毀容的巨星隕落",
      "desc": "一場突如其來的嚴重車禍，讓正處於演藝事業最高峰的你遭遇了毀滅性的面部嚴重燒傷與雙腿截肢，水銀燈與閃光燈在一夜之間離你遠去，餘生只有輪椅與黑暗。",
      "eventLevel": "命運",
      "cash": 3200,
      "happiness": 4,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "國際巨星"
    },
    {
      "id": "evt-電影明星-374",
      "title": "洗錢風暴的替罪監囚",
      "desc": "你信任的經紀人兼丈夫私下利用你名下的多家空殼電影公司，為國際黑幫洗黑錢高達數十億。東窗事發後，他捲款潛逃，你作為法人代表被判處有期徒刑十五年。",
      "eventLevel": "命運",
      "cash": 3200,
      "happiness": 4,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "影壇傳奇"
    }
  ],
  "航海": [
    {
      "id": "evt-航海-375",
      "title": "鹹海水的滋味",
      "desc": "你作為見習水手的第一天，被要求連續在甲板上拉扯沉重的風帆纜繩十個小時，海風把鹹海水狠狠拍進你滿是水泡的掌心，疼得你咬牙切齒。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "見習水手"
    },
    {
      "id": "evt-航海-376",
      "title": "漂流瓶裡的藏寶圖",
      "desc": "你在清洗戰艦最底層的惡臭甲板時，從排水孔裡撈出了一個被藤壺長滿的古老玻璃瓶，敲碎後裡面竟然藏著一張手繪的「骷髏島」局部海圖碎片。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "甲板雜工"
    },
    {
      "id": "evt-航海-377",
      "title": "千里眼前的礁石微光",
      "desc": "深夜你站在高高的桅杆瞭望台上，正值漫天濃霧，你的眼睛在極度疲憊中突然捕捉到前方海面有一抹反常的白色浪花——那是即將撞上的奪命暗礁。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "瞭望員"
    },
    {
      "id": "evt-航海-378",
      "title": "舵盤上的生死度數",
      "desc": "在遭遇特大風暴的瘋狂巨浪中，你死死抱住重型木質舵盤，整艘船傾斜到了恐怖的四十五度，你必須在三秒內將航向修正三度，否則飛船將就地翻覆。",
      "eventLevel": "普通",
      "cash": -900,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "操舵手"
    },
    {
      "id": "evt-航海-379",
      "title": "破碎的捕魚網",
      "desc": "當你們興高采烈地準備拉起今年最大的一網鰹魚時，海底一塊鋒利的尖石將漁網生生撕開了一個大口子，幾千條大魚在你們眼皮底下游回了深海。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "補網工"
    },
    {
      "id": "evt-航海-380",
      "title": "發霉的淡水木桶",
      "desc": "航行到無風帶的第十天，負責檢查物資的你打開最核心的三個儲水木桶，驚恐地發現由於桶匠使用了未陰乾的木料，裡面的淡水已經變綠並散發出惡臭。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "桶匠"
    },
    {
      "id": "evt-航海-381",
      "title": "船長室的銀調羹",
      "desc": "你作為隨船侍從，在幫脾氣暴躁的提督清理桌子時，不小心將他最心愛、代表皇家榮譽的銀製調羹掉進了深不見底的馬里亞納海溝，提督狠狠抽了你一鞭子。",
      "eventLevel": "普通",
      "cash": -900,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "船務侍從"
    },
    {
      "id": "evt-航海-382",
      "title": "逆風中的鋼鐵人肉槳",
      "desc": "船隊駛入了恐怖的死亡無風帶，為了不被活活渴死，你和幾百名底層划手赤裸著上身走進暗無天日的底層槳艙，在皮鞭的催促下瘋狂揮動重達百斤的巨槳。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "划手"
    },
    {
      "id": "evt-航海-383",
      "title": "登船白刃戰的冰冷鋼刀",
      "desc": "海盜船撞上了你們的舷側，拋過來的飛錨死死扣住了木欄。一名滿臉橫肉的海盜揮舞著冰冷的砍刀迎面朝你劈來，你順手抓起地上的鐵鍬迎擊。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "資深水手"
    },
    {
      "id": "evt-航海-384",
      "title": "硝煙瀰漫的砲艙地獄",
      "desc": "海戰爆發，你作為火砲裝填手，在一片震耳欲聾的轟鳴聲與刺鼻的硫磺硝煙中，瘋狂地用推桿將三十公斤重的實心鋼彈推入滾燙的砲管，雙手被嚴重燙傷。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "火砲裝填手"
    },
    {
      "id": "evt-航海-385",
      "title": "斷裂的重型鐵錨鍊",
      "desc": "在準備停靠一個未知島嶼時，由於海底亂流激盪，戰艦沉重的萬斤鐵錨鍊突然啪一聲崩斷，斷裂的鐵鍊像鞭子一樣掃過甲板，砸斷了你身旁鐵匠助手的雙腿。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "鐵匠助手"
    },
    {
      "id": "evt-航海-386",
      "title": "海面上的緊急木板補丁",
      "desc": "敵艦的鏈彈擊碎了你們船身下方的兩塊核心橡木板，海水瘋狂湧入。你和師傅頂著沒過胸口的冰冷海水，在黑暗的艙底瘋狂用木塞和鐵錘進行生死敲擊。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "木匠助理"
    },
    {
      "id": "evt-航海-387",
      "title": "香料庫房的老鼠大戰",
      "desc": "你在半夜巡查底層倉庫時，發現原本存放昂貴丁香與肉桂的麻袋被成群結隊的巨型海鼠咬破，你不得不揮舞著木棍在黑暗中與上百隻瘋狂的老鼠搏鬥。",
      "eventLevel": "普通",
      "cash": -900,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "艙庫看守"
    },
    {
      "id": "evt-航海-388",
      "title": "甲板上的密謀私語",
      "desc": "凌晨兩點你負責夜巡，在經過救生艇下方時，意外聽到大副的心腹正在低聲商量，準備在明晚調換船長的朗姆酒，強行發動全船叛變。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "夜巡員"
    },
    {
      "id": "evt-航海-389",
      "title": "壞血病的腐爛牙齦",
      "desc": "由於連續三個月沒有吃到新鮮蔬菜和水果，你的牙齦開始大面積腐爛、流血，雙腿腫脹得無法站立，隨船醫護遞給你一杯酸澀的野草汁，苦不堪言。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "隨船醫護"
    },
    {
      "id": "evt-航海-390",
      "title": "弄丟的航海日誌",
      "desc": "你在遭遇海盜突襲時，慌亂中將記載著過去半年全部已知新島嶼坐標的核心航海日誌掉進了海裡，這意味著你們過去半年的冒險全部白費。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "首席領航員"
    },
    {
      "id": "evt-航海-391",
      "title": "火藥庫的受潮危機",
      "desc": "連續半個月的連綿陰雨加上海上極高的濕度，導致戰艦核心火藥庫裡過半的黑色火藥全部受潮結塊，在遭遇敵艦時，大砲點火後全部變成了啞火。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "火砲術長"
    },
    {
      "id": "evt-航海-392",
      "title": "被海關查扣的私掠貨物",
      "desc": "你們的船剛剛駛入帝國控制的核心港口，海關緝私隊就帶著全副武裝的士兵登船檢查，以「未持有官方私掠許可證」為由，沒收了你們全部的戰利品。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "船團補給官"
    },
    {
      "id": "evt-航海-393",
      "title": "行船木匠的右手骨折",
      "desc": "在修理被暴風雨吹斷的主桅杆時，一根重達數百斤的橫桁突然滑落，狠狠砸中了行船木匠的右手，導致其粉碎性骨折，船隻改裝計劃被迫停擺。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "行船木匠"
    },
    {
      "id": "evt-航海-394",
      "title": "軍械庫的長槍生鏽",
      "desc": "由於負責看管的軍械官貪杯醉倒，忘記關閉軍械庫的通風窗，導致存放的一百支皇家燧發槍在一個咸濕的暴風雨夜後全部嚴重生鏽，撞針失效。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "軍械官"
    },
    {
      "id": "evt-航海-395",
      "title": "隨船醫護的手術刀感染",
      "desc": "在為一名大腿中彈的水手進行緊急截肢手術時，由於船身劇烈顛簸，醫護不小心用沾滿病毒的手術刀劃破了自己的左手，隨後引發了嚴重的敗血症。",
      "eventLevel": "普通",
      "cash": -900,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "隨船醫護"
    },
    {
      "id": "evt-航海-396",
      "title": "被污染的淡水總桶",
      "desc": "一隻攜帶了未知熱帶傳染病毒的死老鼠掉進了整艘船僅存的最後一桶乾淨淡水裡，大半的水手在喝了這桶水後開始高燒、瘋狂拉肚子，士氣崩潰。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "淡水守護者"
    },
    {
      "id": "evt-航海-397",
      "title": "捕魚網纏住海中暗礁",
      "desc": "在進行深海拖網作業時，巨大的特製鋼絲漁網死死纏在了海底幾千米深的死火山暗礁上，巨大的拉力差點讓整艘漁船的尾部被生生拽入海底。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "補網工"
    },
    {
      "id": "evt-航海-398",
      "title": "船長室的鸚鵡叛變",
      "desc": "你作為隨船侍從精心餵養了三年的彩色鸚鵡，在今天總督前來視察時，突然當著所有人的面大聲學舌船長平時在背後咒罵總督是「死肥豬」的粗口。",
      "eventLevel": "普通",
      "cash": -900,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "船務侍從"
    },
    {
      "id": "evt-航海-399",
      "title": "夜巡員的煤油燈熄滅",
      "desc": "深夜三點你在漆黑的底層火藥庫巡邏，手裡的煤油燈因為燃料耗盡突然熄滅。在一片死寂的黑暗中，你突然聽到了身後傳來一陣不屬於人類的沉重呼吸聲。",
      "eventLevel": "普通",
      "cash": -900,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "夜巡員"
    },
    {
      "id": "evt-航海-400",
      "title": "鐵匠熔爐的火災事故",
      "desc": "在海面上風浪高達五級的情況下，鐵匠助手試圖強行開爐打造修補鐵錨的零件，結果一塊滾燙的焦炭被甩出爐外，瞬間點燃了旁邊存放的乾燥草料。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "鐵匠助手"
    },
    {
      "id": "evt-航海-401",
      "title": "被拒絕進港的檢疫令",
      "desc": "因為你們船上有十幾名水手出現了類似鼠疫的高熱症狀，目的港口的岸防砲兵在你們靠近時直接開砲警告，下達了為期三個月的公海海上強制檢疫令。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "大副"
    },
    {
      "id": "evt-航海-402",
      "title": "海盜黑名單的懸賞令",
      "desc": "由於你連續擊沉了兩艘南海海盜船，海盜聯盟在各大地下港口對你發布了高額的懸賞令，你的項上人頭現在價值一萬枚金幣，危險如影隨形。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "資深水手"
    },
    {
      "id": "evt-航海-403",
      "title": "走私香料的暴利與代價",
      "desc": "你成功將一船未經帝國納稅的頂級丁香私運進了首都港口，獲得了整整十倍的資金暴利，但你的大副在交易時被皇家衛隊當場逮捕，生死未卜。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "船團補給官"
    },
    {
      "id": "evt-航海-404",
      "title": "操舵手的腕關節脫臼",
      "desc": "在強行穿越一處亂流激盪的狹窄海峽時，舵盤傳來的巨大反衝力生生將操舵手的雙手手腕震得脫臼，戰艦瞬間失去控制，朝著峭壁撞去。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "操舵手"
    },
    {
      "id": "evt-航海-405",
      "title": "桅杆瞭望員的幻覺危機",
      "desc": "由於在高空桅杆上連續暴曬了三天三夜且嚴重缺乏淡水，瞭望員出現了嚴重的幻覺，大喊著看到海裡有金色美人魚，隨後竟然當著全船的面跳入大海。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "瞭望員"
    },
    {
      "id": "evt-航海-406",
      "title": "艙庫香料被海水浸泡",
      "desc": "由於排水閥被雜物堵塞，底層艙庫在昨晚發生了嚴重的積水，你價值數千金幣、準備用來娶媳婦的一整箱頂級波斯地毯與高檔絲綢被全數泡爛。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "艙庫看守"
    },
    {
      "id": "evt-航海-407",
      "title": "軍械庫的黑市倒賣",
      "desc": "你發現軍械官為了籌集賭資，私底下偷偷將庫存的燧發槍與優質火藥倒賣給港口的黑市走私商，並在賬目上偽造了「作戰損耗」的假象。",
      "eventLevel": "普通",
      "cash": -900,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "軍械官"
    },
    {
      "id": "evt-航海-408",
      "title": "行船木匠的工具箱掉海",
      "desc": "在準備對戰艦主體進行加固改裝的前夕，實習生在搬運時手滑，將行船木匠用了三十年、裡面裝滿了各種絕版特製工具的玄鐵工具箱掉進了海裡。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "行船木匠"
    },
    {
      "id": "evt-航海-409",
      "title": "火砲發射時的炸膛慘案",
      "desc": "戰鬥中，由於砲身鑄造存在肉眼無法察覺的沙眼，首席砲術長指揮的一門三十二磅主力大砲在發射時發生了恐怖的炸膛，周圍的五名砲手當場被炸成碎肉。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "火砲裝填手"
    },
    {
      "id": "evt-航海-410",
      "title": "被遺忘的淡水海圖",
      "desc": "你在急匆匆啟航後，驚恐地發現大副忘記把向土著人購買的最新「內陸淡水補給點詳細海圖」帶上船，這意味著你們在接下來的三個月裡將無法補充乾淨飲水。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "大副"
    },
    {
      "id": "evt-航海-411",
      "title": "海盜船的假降旗計謀",
      "desc": "一艘被你們追擊了兩天兩夜的海盜船突然降下了骷髏旗並升起白旗投降，然而當你們的戰艦毫無防備地靠近準備登船接收時，對方舷側的二十門火砲突然同時齊射。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "資深水手"
    },
    {
      "id": "evt-航海-412",
      "title": "補網工的深海巨章驚魂",
      "desc": "補網工在清理甲板邊緣的廢棄漁網時，一隻隱藏在網底、重達百斤的深海劇毒藍環章魚突然竄出，用觸手死死纏住了他的手臂，釋放出致命毒素。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "補網工"
    },
    {
      "id": "evt-航海-413",
      "title": "鐵匠助手的熔爐灼傷",
      "desc": "在為戰艦打造撞角時，一滴高溫熔融的鐵水不小心濺進了鐵匠助手的左眼裡，現場傳來一聲慘烈的叫聲，他的左眼徹底瞎了，農場改裝進度延期。",
      "eventLevel": "普通",
      "cash": -900,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "鐵匠助手"
    },
    {
      "id": "evt-航海-414",
      "title": "划手艙的集體瘟疫",
      "desc": "陰暗潮濕、終年不見陽光的底層划手艙內爆發了嚴重的霍亂，短短三天內有五十名划手在拉肚子中痛苦死去，底層槳艙散發出人間地獄般的惡臭。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "划手"
    },
    {
      "id": "evt-航海-415",
      "title": "船務侍從的偷聽代價",
      "desc": "你作為侍從在提督室外偷聽到了皇家海軍下半年的秘密遠征計劃，正當你震驚時，一隻冰冷的手突然搭在了你的肩膀上——那是帝國督戰官的黑色手套。",
      "eventLevel": "普通",
      "cash": -900,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "船務侍從"
    },
    {
      "id": "evt-航海-416",
      "title": "大副的私房錢木箱",
      "desc": "你在大副的私人床鋪底下，發現了一個上了三道鎖的鐵皮箱，撬開後裡面竟然裝滿了敵國的銀幣與一封與敵國海軍上將秘密通信的未完信件。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "大副"
    },
    {
      "id": "evt-航海-417",
      "title": "首席領航員的羅盤失靈",
      "desc": "船隊駛入了一片富含磁鐵礦的神秘海域，首席領航員驚恐地發現，手中的黃金羅盤開始瘋狂地三百六十度旋轉，所有的海圖坐標在這一刻全部失效。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "首席領航員"
    },
    {
      "id": "evt-航海-418",
      "title": "隨船軍醫的手術室停電",
      "desc": "在深夜遭遇海盜突襲、船身劇烈搖晃的極端環境下，隨船軍醫正在為大腿動脈破裂的大副進行生死縫合，固定在天花板上的油燈突然摔碎，陷入一片漆黑。",
      "eventLevel": "普通",
      "cash": -900,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "隨船軍醫"
    },
    {
      "id": "evt-航海-419",
      "title": "船團補給官的糧食被換",
      "desc": "補給官在清點物資時發現，港口黑心的糧食商人在運送小麥時，將底層的三百袋全部換成了摻雜了大量沙子與發霉麥麩的劣質垃圾，全船面臨挨餓。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "船團補給官"
    },
    {
      "id": "evt-航海-420",
      "title": "第一場海上的彩虹",
      "desc": "在經歷了整整七天七夜、差點讓全船沉沒的超級大暴風雨後，今天清晨大海迎來了久違的風平浪靜，一條巨大的七彩虹橋橫跨在湛藍的海平線上，美得令人落淚。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "見習水手"
    },
    {
      "id": "evt-航海-421",
      "title": "火砲術長的精準首發",
      "desc": "海戰剛一開打，首席砲術長親自操砲，在距離敵艦兩公里遠的極限距離下，第一發砲彈就精準地擊碎了敵方旗艦的主桅杆，全船水手爆發出瘋狂的歡呼聲。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "火砲裝填手"
    },
    {
      "id": "evt-航海-422",
      "title": "老水手的朗姆酒故事",
      "desc": "在繁星滿天的平靜夏夜，老水手長在甲板上敲開了一桶珍藏的牙買加朗姆酒，給每個人倒了一滿杯，一邊拍著你的肩膀，一邊講起他當年大戰北海巨妖的傳奇故事。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "見習水手"
    },
    {
      "id": "evt-航海-423",
      "title": "發現漂流的西班牙金幣箱",
      "desc": "你們在公海巡邏時，意外撈起了一個在海面上漂浮的精緻橡木密封箱，打開後裡面竟然整整齊齊擺放著五百枚十六世紀的西班牙純金金幣，發了一筆橫財。",
      "eventLevel": "普通",
      "cash": 800,
      "happiness": 1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "甲板雜工"
    },
    {
      "id": "evt-航海-424",
      "title": "海鳥帶來的陸地信號",
      "desc": "在海上迷航了整整一個月、淡水即將徹底耗盡的最絕望時刻，瞭望員突然看到一隻巨大的白色信天翁落在了主桅杆上，口中還叼著一片新鮮的綠色樹葉。",
      "eventLevel": "普通",
      "cash": -900,
      "happiness": -1,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "瞭望員"
    },
    {
      "id": "evt-航海-425",
      "title": "水手長的皮鞭與絕對服從",
      "desc": "當全船水手因為連續三個月沒有見到陸地、在刺頭的帶領下手持短刀聚集在甲板上準備發動暴動時，你作為鐵血水手長，單槍匹馬走進人群，一鞭子將刺頭的左眼抽瞎，瞬間震懾全場。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "水手長"
    },
    {
      "id": "evt-航海-426",
      "title": "大副的完美無縫接管",
      "desc": "在與帝國無敵艦隊的慘烈海戰中，船長的主桅杆被砲彈擊中，船長當場被砸成碎肉。作為大副的你抹掉臉上的血跡，一腳踩在提督的屍體上，拔出長劍高喊「全艦滿帆，跟我衝！」，士氣大振。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "大副"
    },
    {
      "id": "evt-航海-427",
      "title": "星辰退去後的盲目導航",
      "desc": "一場持續了半個月的詭異綠色大濃霧籠罩了整片海域，羅盤瘋狂旋轉，太陽與星辰連續十五天沒有出現。你作為首席領航員，閉上眼睛單憑腳底板感受洋流的細微震動，強行帶領船隊穿出迷霧。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "首席領航員"
    },
    {
      "id": "evt-航海-428",
      "title": "鯊魚群中的生死截肢",
      "desc": "船隻在公海遭遇鯊魚群圍攻，大副的右腿被斷裂的鋼纜死死卡住並骨折。你作為隨船軍醫，在四周海面圍滿了幾百條嗜血白鯊、鮮血不斷滲入海水的極端情況下，用三秒鐘完成了完美的船舷截肢。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "隨船軍醫"
    },
    {
      "id": "evt-航海-429",
      "title": "三十六門主力大砲的怒火齊射",
      "desc": "在被三艘海盜船合圍的絕境下，你作為首席砲術長，冷靜地等待敵艦靠近到極限的五十米距離。隨著你一聲令下，戰艦舷側的三十六門重型火砲同時爆發出雷霆般的怒火，一瞬間將三艘敵艦生生撕碎。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "首席砲術長"
    },
    {
      "id": "evt-航海-430",
      "title": "壟斷新大陸的絲綢黃金航線",
      "desc": "你成功打通了一條完全避開了帝國海軍巡邏線、直接對接印加帝國地下黑市的全新走私航線。你用不值錢的玻璃珠子換回了整整三艙底的純金神像與頂級香料，財富暴增百倍。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "船團補給官"
    },
    {
      "id": "evt-航海-431",
      "title": "魔改版「無敵幽靈戰艦」落地",
      "desc": "你作為行船木匠，利用在神祕島嶼上採集到的萬年不腐鐵橡木，對你的旗艦進行了徹底的魔改。加裝了三層防彈鐵甲與水下衝角，船隻的極速與撞擊力提升了整整一倍。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "行船木匠"
    },
    {
      "id": "evt-航海-432",
      "title": "軍械庫的皇家燧發槍矩陣",
      "desc": "你成功說服了帝國最大軍火商，秘密採購到了剛剛研發成功、尚未裝備海軍的「十二連發重型燧發長槍」兩百支。當海盜試圖登船白刃戰時，迎接他們的是從未見過的恐怖金屬風暴。",
      "eventLevel": "稀有",
      "cash": -1800,
      "happiness": -2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "軍械官"
    },
    {
      "id": "evt-航海-433",
      "title": "提督海軍許可證的背叛",
      "desc": "你原本奉命皇家私掠，卻在今天早上收到情報：帝國為了與敵國達成和平協議，正式簽署了公告，將你打上了「無國籍非法海盜」的標籤，派遣了三艘皇家主力戰艦前來緝拿你。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "私掠總督"
    },
    {
      "id": "evt-航海-434",
      "title": "百米深海巨妖的觸手纏繞",
      "desc": "夜半海面平靜如鏡，一隻直徑長達百米、沉睡了上千年的深海巨妖克拉肯突然浮出水面。八條長滿倒刺的巨大觸手死死纏住了你們的戰艦，船身開始發出不堪重負的碎裂聲。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "深海獵手"
    },
    {
      "id": "evt-航海-435",
      "title": "無風帶的集體發瘋事件",
      "desc": "在無風帶滯留的第三十天，淡水徹底耗盡。全船大半的水手因為飲用海水，引發了嚴重的群體性精神分裂，他們手持斧頭在船艙裡四處砍殺同伴，大喊著要吃人肉。",
      "eventLevel": "稀有",
      "cash": -1800,
      "happiness": -2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "水手長"
    },
    {
      "id": "evt-航海-436",
      "title": "皇家海軍的死亡合圍",
      "desc": "由於內鬼出賣，你的旗艦在駛入一處狹窄的馬蹄形海峽時，被早已埋伏在此的六艘皇家主力一級戰艦堵住了唯一的出口，兩百門砲口同時對準了你。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "大副"
    },
    {
      "id": "evt-航海-437",
      "title": "海圖的世紀謊言",
      "desc": "你花費巨資從黑市買來的「傳說中亞特蘭蒂斯黃金島詳細海圖」，在航行了三個月後，被證實是一張完全虛構的假圖，你們最終駛入了一片充滿了致命劇毒水母的死亡死海。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "首席領航員"
    },
    {
      "id": "evt-航海-438",
      "title": "壞血病引發的全員癱瘓",
      "desc": "一場突如其來的群體性壞血病席捲了整艘戰艦，包括大副和各艙幹部在內的一百多名核心水手全身肌肉萎縮、牙齦流血不止地癱倒在床，整艘巨艦在公海上化為孤獨的漂流廢墟。",
      "eventLevel": "稀有",
      "cash": -1800,
      "happiness": -2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "隨船軍醫"
    },
    {
      "id": "evt-航海-439",
      "title": "黑市香料被敵國全面燒毀",
      "desc": "你們好不容易走私出來、價值十萬金幣的特級東印度香料，在港口秘密倉庫接頭時，遭到敵國特工的定時炸彈襲擊，整座倉庫化為一片火海，財富瞬間清零。",
      "eventLevel": "稀有",
      "cash": 1600,
      "happiness": 2,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "船團補給官"
    },
    {
      "id": "evt-航海-440",
      "title": "骷髏旗下的七海不敗神話",
      "desc": "你正式將七大海盜團的旗幟全部踩在腳下，上千艘武裝海盜船聚集在你的旗艦周圍。當你的骷髏旗升起時，整個大洋的商船與海軍皆要在你的戰艦面前降下主帆，鳴砲致敬。",
      "eventLevel": "傳奇",
      "cash": 2400,
      "happiness": 3,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "傳奇船長"
    },
    {
      "id": "evt-航海-441",
      "title": "奉天承運的皇家私掠總督",
      "desc": "帝國女皇親自為你戴上了純金打造的「南海私掠總督」勳章，特批你擁有獨立組建帝國第三私掠艦隊的絕對權力。你搶劫的所有敵國財富，皆受帝國法律的絕對保護。",
      "eventLevel": "傳奇",
      "cash": 2400,
      "happiness": 3,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "私掠總督"
    },
    {
      "id": "evt-航海-442",
      "title": "刀尖上跳舞的風暴支配者",
      "desc": "一場百年一遇、足以將整座城市摧毀的超級大颶風席捲了大西洋。所有的海軍戰艦皆選擇回港避難，而你開著滿帆的旗艦，狠狠撞進了風暴最核心的風眼，借用風力甩掉了十艘追兵。",
      "eventLevel": "傳奇",
      "cash": -2700,
      "happiness": -3,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "風暴引導者"
    },
    {
      "id": "evt-航海-443",
      "title": "弒神之刃與巨妖頭顱",
      "desc": "在一場持續了三天三夜、海浪高達二十米的史詩大戰中，你手持玄鐵長槍跳上了深海巨妖克拉肯的頭頂，狠狠刺穿了它的核心中樞。你將它直徑十米的巨型頭顱懸掛在船首，成為不朽戰利品。",
      "eventLevel": "傳奇",
      "cash": 2400,
      "happiness": 3,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "深海獵手"
    },
    {
      "id": "evt-航海-444",
      "title": "無敵艦隊的集體自爆悲歌",
      "desc": "在與帝國海軍的決戰中，你指揮的魔改戰艦被十艘主力艦死死圍住。在彈盡糧絕之際，你冷笑著下令點燃了火藥庫裡僅存的十噸高能炸藥，與圍攻你的三千名皇家海軍同歸於盡。",
      "eventLevel": "傳奇",
      "cash": 2400,
      "happiness": 3,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "傳奇船長"
    },
    {
      "id": "evt-航海-445",
      "title": "七海之王的終極王座",
      "desc": "你在大洋中心的「海盜之城」正式加冕為歷史上首位七海之王。各大帝國的海軍大臣與國王代表紛紛前來出席你的加冕禮，簽署了由你起草的海上貿易新法典，你的名字等同於海洋。",
      "eventLevel": "命運",
      "cash": 3200,
      "happiness": 4,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "七海霸主"
    },
    {
      "id": "evt-航海-446",
      "title": "不沉之艦的永恆引路人",
      "desc": "你的肉體在八十歲時沉入了冰冷的北大西洋。然而，每當大洋升起綠色濃霧、暴風雨即將撕裂年輕水手的船隻時，一艘全身泛著幽綠螢光、滿帆前行的古老巨艦就會出現在前方，引導他們駛向生路。",
      "eventLevel": "命運",
      "cash": 3200,
      "happiness": 4,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "幽靈船首"
    },
    {
      "id": "evt-航海-447",
      "title": "新世界的黃金地平線",
      "desc": "你率領著僅存的一艘破舊探險船，穿過了世界盡頭那道高達千米的毀滅級大瀑布。在瀑布的另一端，一片面積高達數百萬平方公里、長滿了金色奇異植物的全新未知大陸出現在你的望遠鏡裡。",
      "eventLevel": "命運",
      "cash": -3600,
      "happiness": -4,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "破界拓荒者"
    },
    {
      "id": "evt-航海-448",
      "title": "叛變绞刑架上的黃昏",
      "desc": "大副聯合了全船被財富沖昏頭腦的水手發動了深夜叛變。你被五花大綁地推上了你自己戰艦的甲板，看著你親手建立的帝國旗幟被付之一炬，隨後，冰冷的絞索套上了你的脖子。",
      "eventLevel": "命運",
      "cash": 3200,
      "happiness": 4,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "七海霸主"
    },
    {
      "id": "evt-航海-449",
      "title": "永遠迷失在魔鬼百慕達",
      "desc": "你的探險隊駛入了傳說中的魔鬼百慕達三角洲。在這裡，時間停止了流動，空間折疊成了無盡的迷宮，你在鏡子一樣的海面上航行了整整五十年，容顏不老，卻永遠找不到回家的路。",
      "eventLevel": "命運",
      "cash": 3200,
      "happiness": 4,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "破界拓荒者"
    }
  ],
  "月球探險": [
    {
      "id": "evt-月球探險-450",
      "title": "輕飄飄的第一步",
      "desc": "你穿著沉重的微重力太空服，走下登月艙的梯子。當你的靴子第一次踩進那層厚厚的、灰白色的月球塵埃時，身體輕飄飄的，你興奮地對著麥克風大喊。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "見習宇航員"
    },
    {
      "id": "evt-月球探險-451",
      "title": "微重力下的垃圾風暴",
      "desc": "你在清理廢棄氣閘艙時，由於一個密封袋沒有紮緊，上百個廢棄的塑料管與碎屑在微重力環境下瞬間在大廳裡瘋狂漂浮，砸得你手忙腳亂。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "太空清道夫"
    },
    {
      "id": "evt-月球探險-452",
      "title": "氣閘艙的生死微漏",
      "desc": "基地B區的核心氣閘艙管道突然傳來刺耳的警報聲，氣壓計指針開始微幅下滑。你必須在氧氣耗盡前的十分鐘內，在漆黑的管道間裡找出那個只有針尖大小的洩漏點。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "生命守護者"
    },
    {
      "id": "evt-月球探險-453",
      "title": "卡路里的數字遊戲",
      "desc": "作為物資盤點員，你發現因為運輸飛船延期，基地現存的合成蛋白質牙膏和高能氧氣罐只夠全體人員維持最後五天，你不得不下令全員配額減半。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "生存會計"
    },
    {
      "id": "evt-月球探險-454",
      "title": "三十八萬公里的雜音",
      "desc": "你坐在通訊台前，試圖與地球總部建立常規視訊連線，但由於強烈的太陽黑子爆發，耳機裡充斥著刺耳的宇宙雜音，屏幕上全是扭曲的雪花。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "宇宙調頻"
    },
    {
      "id": "evt-月球探險-455",
      "title": "太空抑鬱症的邊緣",
      "desc": "長期處於封閉、死寂且沒有日夜之分的灰色基地中，你的一位核心隊友突然在深夜崩潰大哭，瘋狂地試圖徒手砸開鋼化玻璃窗想「出去曬太陽」。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "心靈監測"
    },
    {
      "id": "evt-月球探險-456",
      "title": "失聯的探測無人機",
      "desc": "你操控的「開路者三號」遠程探測無人機，在駛入月球背面一個深達數公里的永夜陰影撞擊坑時，信號突然徹底中斷，設備下落不明。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "遠程之眼"
    },
    {
      "id": "evt-月球探險-457",
      "title": "氦-3的藍色火花",
      "desc": "當你的重型採掘鎬狠狠砸在一塊黝黑的月岩上時，岩層裂開，一抹純淨、泛著夢幻般藍色螢光的稀有氦-3結晶出現在你眼前，這能點亮一座城市。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "星際淘金"
    },
    {
      "id": "evt-月球探險-458",
      "title": "骨骼流失的警報",
      "desc": "年度航天醫學體檢報告顯示，由於長期處於低重力環境，你的骨密度在過去半年內急速下降了15%，醫生警告你必須立刻增加抗過載訓練。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "超越引力"
    },
    {
      "id": "evt-月球探險-459",
      "title": "隕石撞擊的倒計時",
      "desc": "光學望遠鏡突然捕捉到一顆直徑約兩米的微型隕石，正以每秒三十公里的恐怖速度筆直朝著你們的觀測穹頂撞來，基地進入三分鐘倒計時。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "星空守望"
    },
    {
      "id": "evt-月球探險-460",
      "title": "艙外漫步的生死焊接",
      "desc": "一塊微隕石碎片擊穿了基地外殼的冷卻管道，你不得不穿上防護服進行緊急艙外漫步。在你背後，是零下一百八十度的虛無深淵與無垠星空。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "生死線焊接"
    },
    {
      "id": "evt-月球探險-461",
      "title": "第一朵月壤土豆花",
      "desc": "你在利用經過特殊輻射處理的月球土壤溫室裡，經過大半年的精心培育，今天早上，一株土豆幼苗竟然奇蹟般地開出了一朵小小的淡紫色花朵。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "月面農夫"
    },
    {
      "id": "evt-月球探險-462",
      "title": "脈衝星的瘋狂代碼",
      "desc": "通訊接收器突然瘋狂作響，一段來自遙遠獵戶座脈衝星的規律輻射信號被轉化成了幾萬行神秘的二進制代碼，你必須一字不落地將其速記下來。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "宇宙書記"
    },
    {
      "id": "evt-月球探險-463",
      "title": "減壓艙的鋼鐵大閘",
      "desc": "由於基地外側突發氣壓驟降，你作為安全衛士，必須強行拉下沉重的隔離鋼閘門。這意味著你將把三名還在艙外奮力奔跑的同伴死死關在門外。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "鋼鐵之門"
    },
    {
      "id": "evt-月球探險-464",
      "title": "射線病引發的嚴重嘔吐",
      "desc": "因為在昨天艙外作業時遭遇了短暫的微型太陽質子事件，你受到了超標的宇宙射線輻射，今天一早開始瘋狂嘔吐、掉頭髮，虛弱得無法站立。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "星海守護"
    },
    {
      "id": "evt-月球探險-465",
      "title": "被污染的循環水箱",
      "desc": "基地的水資源循環過濾系統中，一根核心的生物活性濾芯突然失效，導致今天全基地洗漱與飲用的水裡都帶著一股淡淡的化學塑膠臭味。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "太空清道夫"
    },
    {
      "id": "evt-月球探險-466",
      "title": "弄丟的太空艙維修扳手",
      "desc": "你在外殼漫步維修時，一個手滑，特製的磁力鈦合金扳手脫離了安全繩，在微重力下緩緩飄向深邃的太空，你只能眼睜睜看著它變成太空垃圾。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "生死線焊接"
    },
    {
      "id": "evt-月球探險-467",
      "title": "太空服面罩的起霧危機",
      "desc": "在進行長達五公里的月面徒步勘探時，太空服的內部溫控晶片突然故障，高溫的汗水瞬間在你的頭盔玻璃面罩內側凝結成厚厚的白霧，你徹底失明。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "見習宇航員"
    },
    {
      "id": "evt-月球探險-468",
      "title": "無效的地球電視轉播",
      "desc": "今晚是地球的除夕夜，基地全員聚在餐廳準備觀看春晚的衛星轉播，結果由於信號在穿過大氣層時遭遇電離層風暴，屏幕上全程只有刺耳的噪音與綠色條紋。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "宇宙調頻"
    },
    {
      "id": "evt-月球探險-469",
      "title": "合成肉工廠的菌種變異",
      "desc": "基地唯一的「人造合成牛肉」細胞培育槽發生了未知的基因突變，原本應該生長成肌肉纖維的菌種變成了一大槽散發著詭異綠光的黏稠液體。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "月面農夫"
    },
    {
      "id": "evt-月球探險-470",
      "title": "月球車輪胎卡入岩縫",
      "desc": "你開著重型六輪月球採礦車在荒涼的靜海平原奔馳，左前輪不小心狠狠卡進了一道深不見底的玄武岩裂縫中，車身傾斜，傳動軸發出不堪重負的嘎吱聲。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "星際淘金"
    },
    {
      "id": "evt-月球探險-471",
      "title": "失重的流血事件",
      "desc": "在更換空氣濾網時，你的手指不小心被金屬外殼鋒利的邊緣割開了一道大口子。在失重環境下，鮮紅的血液瞬間化為幾十個圓滾滾的血珠，在空中四處漂浮。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "星海守護"
    },
    {
      "id": "evt-月球探險-472",
      "title": "被遺忘的生日太空餐",
      "desc": "今天是你三十歲生日，你一個人待在狹窄的通訊艙裡清點數據。到了深夜，你打開常規的太空牙膏套餐，卻發現裡面竟然夾著一粒偷偷藏進來的巧克力。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "生存會計"
    },
    {
      "id": "evt-月球探險-473",
      "title": "觀測鏡鏡片被微隕石劃破",
      "desc": "基地最核心的百米口徑射電望遠鏡主鏡片，在昨晚被一顆芝麻大小的微隕石以極速正面擊中，鏡面上留下一道長達兩米的恐怖裂紋，觀測計畫全面停擺。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "星空守望"
    },
    {
      "id": "evt-月球探險-474",
      "title": "與地球家人的兩秒延遲對話",
      "desc": "你終於獲得了五分鐘與地球家人通話的珍貴機會。但因為三十八萬公里的距離，每一次對話都存在恐怖的兩秒鐘延遲，看著屏幕裡流淚的母親，你如鯁在喉。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "宇宙調頻"
    },
    {
      "id": "evt-月球探險-475",
      "title": "太空艙艙門把手結冰",
      "desc": "由於外側絕熱層老化，A3區通往外界的緊急安全門內側把手上，今天早上結出了一層厚厚的冰霜，強行拉開可能會導致金屬脆裂、整艙洩壓。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "鋼鐵之門"
    },
    {
      "id": "evt-月球探險-476",
      "title": "資料庫代碼被太陽耀斑篡改",
      "desc": "一場強烈的太陽耀斑爆發產生的強輻射，穿透了基地微弱的防護盾，直接篡改了你們存放在服務器裡、過去三年累積的所有月壤成分化驗代碼。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "宇宙書記"
    },
    {
      "id": "evt-月球探險-477",
      "title": "重力適應艙的電機燒毀",
      "desc": "負責幫新隊員進行重力過渡的「大型離心模擬轉輪」在高功率運轉時，底部的超導電機突然因為冷卻液洩漏而暴力燒毀，幾名新隊員在艙內劇烈嘔吐。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "超越引力"
    },
    {
      "id": "evt-月球探險-478",
      "title": "月球塵埃引發的肺部過敏",
      "desc": "由於你在脫下宇航服時沒有完全清理乾淨沾染的月球微塵，這些尖銳、帶有強烈靜電的尖銳二氧化矽顆粒吸入肺部，引發了你劇烈的哮喘與咳血。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "星海守護"
    },
    {
      "id": "evt-月球探險-479",
      "title": "無人機矩陣的集體失控",
      "desc": "你操縱的十架「工蜂」微型月面搜救無人機，在飛越一處未知的磁場異常區時，集體失去了控制，像沒頭蒼蠅一樣狠狠撞向了遠處的環形山山壁。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "遠程之眼"
    },
    {
      "id": "evt-月球探險-480",
      "title": "太空食品倉庫的漏水事故",
      "desc": "溫室的灌溉水管破裂，大量的再生水湧入了隔壁的密封食品庫，上千袋脫水宇航快餐被泡發變形，外包裝腐爛，全基地面臨一週的物資短缺。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "生存會計"
    },
    {
      "id": "evt-月球探險-481",
      "title": "太空服電池電量急速下滑",
      "desc": "當你深入月球背面一處漆黑的火山口進行樣本採集時，胸前的電量顯示器突然發出紅色警報，太空服的核能電池在零下一百度的極寒中電量急速下滑。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "見習宇航員"
    },
    {
      "id": "evt-月球探險-482",
      "title": "宇航員之間的午夜揮拳",
      "desc": "由於長期在壓抑的環境中生活，兩名核心隊員在餐廳因為一塊合成餅乾的分配問題爆發了暴力的肢體衝突，甚至動用了沉重的扳手，大廳一片混亂。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "心靈監測"
    },
    {
      "id": "evt-月球探險-483",
      "title": "通訊天線被強光融化",
      "desc": "太陽爆發了歷史罕見的X級超級耀斑，基地的對地高增益拋物面天線因為沒有及時收回保護罩，其核心接收器在幾秒鐘內被強烈的高能粒子流生生融化。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "宇宙調頻"
    },
    {
      "id": "evt-月球探險-484",
      "title": "被遺忘的艙外漫步繩扣",
      "desc": "當你完成維修、準備返回氣閘艙時，驚恐地發現安全帶的防脫落鋼扣因為低溫發生了金屬疲勞，早已在不知何時斷裂，你正赤裸裸地在太空漂浮。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "生死線焊接"
    },
    {
      "id": "evt-月球探險-485",
      "title": "月球基地空氣變酸",
      "desc": "基地的二氧化碳生物洗滌槽裡的一種核心微藻集體死亡，導致全基地的空氣含氧量急速下滑，空氣中開始瀰漫著一股刺鼻的、類似死魚的酸臭味。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "太空清道夫"
    },
    {
      "id": "evt-月球探險-486",
      "title": "採礦鎬敲出未知空洞",
      "desc": "你的重型月面挖掘機在靜海環形山挖掘玄武岩時，車頭突然猛烈一沉，下方的岩層塌陷，露出了一個深不見底、完全漆黑的地下巨型熔岩管道空洞。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "星際淘金"
    },
    {
      "id": "evt-月球探險-487",
      "title": "太空服頭盔玻璃出現裂紋",
      "desc": "在清理撞擊坑碎石時，一塊被挖掘機履帶崩飞的尖銳岩石，狠狠砸在了你的宇航服頭盔面罩上，石英玻璃上瞬間蔓延開一條蛛網般的細小裂紋。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "見習宇航員"
    },
    {
      "id": "evt-月球探險-488",
      "title": "基地重力模擬晶片燒毀",
      "desc": "控制B區宿舍重力模擬的重力子發生器核心晶片在半夜突然燒毀，正在熟睡中的你瞬間從床上漂浮到了天花板上，額頭狠狠撞在了合金管道上。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "超越引力"
    },
    {
      "id": "evt-月球探險-489",
      "title": "宇宙線監測器的假警報",
      "desc": "基地的宇宙射線高能預警系統在凌晨四點突然拉響了最高級別的紅色警報，全員驚恐地穿上防護服擠進避難所，結果三小時後證實是系統算法出錯。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "星空守望"
    },
    {
      "id": "evt-月球探險-490",
      "title": "太空溫室遭遇未知真菌",
      "desc": "你精心照料的「太空特製小麥」試驗田裡，突然大面積蔓延開一種詭異的、呈現黑紫色的斑點真菌，小麥穗在幾天內全部化為了充滿毒素的黑水。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "月面農夫"
    },
    {
      "id": "evt-月球探險-491",
      "title": "數據硬碟的強磁化",
      "desc": "你花費了半年時間記錄的關於月球背面引力異常點的原始磁帶硬碟，在經過基地高壓變壓器室時，因為屏蔽層破損，整塊硬碟被瞬間強磁化清空。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "宇宙書記"
    },
    {
      "id": "evt-月球探險-492",
      "title": "基地氣閘門被微塵卡死",
      "desc": "由於月球塵埃極其尖銳且帶有強烈靜電，A1號主氣閘門的滾珠導軌在今天下午被微塵徹底卡死，三名完成艙外漫步的隊員被困在零下一百度的門外。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "鋼鐵之門"
    },
    {
      "id": "evt-月球探險-493",
      "title": "太空針劑的過敏反應",
      "desc": "在為一名高燒的隊員注射新型抗輻射干擾素時，對方突然發生了恐怖的急性過敏性休克，心跳驟降到每分鐘三十次，你手裡只有一針腎上腺素。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "星海守護"
    },
    {
      "id": "evt-月球探險-494",
      "title": "太空車全景雷達損壞",
      "desc": "你駕駛的遠程月球探勘車在翻越一座陡峭的環形山時，車頂的全景激光雷達被一根突出的尖銳岩石生生刮飛，你不得不單憑肉眼在漆黑的月夜中導航。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "遠程之眼"
    },
    {
      "id": "evt-月球探險-495",
      "title": "月壤化驗成分比例出錯",
      "desc": "由於你連續工作三十小時極度疲憊，在錄入第三百號月壤樣本的氦-3含量時少寫了一個小數點，導致地球總部根據錯誤數據制定了失敗的開採計劃。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "宇宙書記"
    },
    {
      "id": "evt-月球探險-496",
      "title": "基地的免費咖啡福利取消",
      "desc": "由於地球供應鏈飛船縮減預算，地球總部宣佈暫停向月球基地供應真正的咖啡豆，以後全員只能飲用由回收廢水調配的化學合成咖啡替代品。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "太空清道夫"
    },
    {
      "id": "evt-月球探險-497",
      "title": "太空服通訊耳機爆音",
      "desc": "當地球總部向你發送常規問候語時，由於中轉衛星信號過載，你的宇航服耳機裡突然爆發出一聲高達一百二十分貝的尖銳盲音，你的右耳鼓膜瞬間被震裂。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "宇宙調頻"
    },
    {
      "id": "evt-月球探險-498",
      "title": "太空避難所的門鎖生鏽",
      "desc": "在常規的災難演習中，你發現基地最核心、用來抵禦超級太陽風暴的地下深層鉛封避難所大門把手，因為長年潮濕已經徹底生鏽卡死，根本打不開。",
      "eventLevel": "普通",
      "cash": -1500,
      "happiness": -1,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "鋼鐵之門"
    },
    {
      "id": "evt-月球探險-499",
      "title": "星空下的孤獨眼淚",
      "desc": "深夜，你一個人站在直徑十米的觀測穹頂下。看著遠處夜空中那個蔚藍、美麗卻遙不可及的地球，你突然被無盡的孤獨與渺小感淹沒，流下了眼淚。",
      "eventLevel": "普通",
      "cash": 1500,
      "happiness": 0,
      "reputation": 2,
      "rare": false,
      "important": false,
      "linkedTitle": "心靈監測"
    },
    {
      "id": "evt-月球探險-500",
      "title": "月球背面地下都市的藍圖",
      "desc": "你作為首席工程師，正式主導設計了人類歷史上首個「月球背面地下蜂巢都市」的擴建工程。你將在巨大的天然熔岩管道內，築起一座容納十萬人的穹頂城市。",
      "eventLevel": "稀有",
      "cash": 3000,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "首席工程師"
    },
    {
      "id": "evt-月球探險-501",
      "title": "霍金引力幾何學的軌道奇蹟",
      "desc": "一艘載有五十名科學家的巨型運輸艦在接近地月轉移點時主引擎突然爆炸，陷入重力死鎖。作為領航員的你，利用精妙的引力彈弓效應，操作飛船奇蹟般擦著月表安全迫降。",
      "eventLevel": "稀有",
      "cash": -3000,
      "happiness": -2,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "星際領航員"
    },
    {
      "id": "evt-月球探險-502",
      "title": "太陽風暴前的生死三分鐘",
      "desc": "一場足以將基地外殼全部融化的超級太陽風暴突襲月球。你作為軌道計算師，在警報拉響前的最後三分鐘，精準算出了耀斑粒子的到達軌道，指揮基地全面進入深層鉛封，拯救全員。",
      "eventLevel": "稀有",
      "cash": -3000,
      "happiness": -2,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "軌道計算師"
    },
    {
      "id": "evt-月球探險-503",
      "title": "冰層底部的三十億年生命",
      "desc": "你在月球南極最深、終年不見陽光的永久陰影區古老冰層下地下五百米處，成功鑽探並分離出了一種擁有完全獨立RNA架構的遠古地外微生物，徹底改寫了生命起源史。",
      "eventLevel": "稀有",
      "cash": 3000,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "外星生態學家"
    },
    {
      "id": "evt-月球探險-504",
      "title": "真空失重狀態下的開顱神話",
      "desc": "基地指揮官遭遇微隕石撞擊導致嚴重顱內出血，生命垂危。作為隨艦御醫的你，在低重力、血液會懸浮呈球狀的極端高難度環境下，用特製的負壓手術艙完成了人類首例太空開顱手術。",
      "eventLevel": "稀有",
      "cash": 3000,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "隨艦御醫"
    },
    {
      "id": "evt-月球探險-505",
      "title": "直面虛無的鋼鐵心智",
      "desc": "基地遭遇了不明高能電磁脈衝襲擊，全基地通訊中斷、電力系統癱瘓七成，全員陷入極端恐懼。作為大副的你，手持激光槍站在黑暗的大廳中央，用絕對的冷靜與鐵血紀律強行重組了防線。",
      "eventLevel": "稀有",
      "cash": 3000,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "星艦大副"
    },
    {
      "id": "evt-月球探險-506",
      "title": "外星未知威脅的鐵血防禦",
      "desc": "月球背面的秘密鑽探基地遭遇了來歷不明、能夠吞噬金屬外殼的未知硅基生命體襲擊。作為安全戰術官的你，親自端起高能等離子重型火砲，在氣閘艙門口築起了一道鋼鐵火網。",
      "eventLevel": "稀有",
      "cash": 3000,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "安全戰術官"
    },
    {
      "id": "evt-月球探險-507",
      "title": "星際倒爺的千億財富網絡",
      "desc": "你敏銳地利用了地球各個大國之間對於月球氦-3能源份額的極端渴望，在私底下建立起了一個龐大的「地月走私清算矩陣」，將稀有太空能源高價拍賣給各大財團，資產破千億。",
      "eventLevel": "稀有",
      "cash": -3000,
      "happiness": -2,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "资源協調官"
    },
    {
      "id": "evt-月球探險-508",
      "title": "中央智庫的權限被奪",
      "desc": "地球總部突然下達密令，判定你的外星微生物研究具有「極高的生物兵器研發價值」，由新派來的軍事代表強行接管了你實驗室的所有最高級權限，你被軟禁。",
      "eventLevel": "稀有",
      "cash": 3000,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "外星生態學家"
    },
    {
      "id": "evt-月球探險-509",
      "title": "軌道計算的致命盲點",
      "desc": "由於你在計算新一代空間站對接軌道時，忽視了月球微弱不均勻引力場（質量瘤）的干擾，導致價值百億的空間站模組在對接時與基地外殼發生暴力擦撞，全面報廢。",
      "eventLevel": "稀有",
      "cash": 3000,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "軌道計算師"
    },
    {
      "id": "evt-月球探險-510",
      "title": "外外星硅基生命的致命寄生",
      "desc": "在應對硅基生命的防禦戰中，一滴具有腐蝕性的硅基黏液穿透了你的防護服外殼，寄生在了你的左臂上。為了防止病毒蔓延至全身，你不得不手持激光刀生生切斷了自己的左臂。",
      "eventLevel": "稀有",
      "cash": 3000,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "安全戰術官"
    },
    {
      "id": "evt-月球探險-511",
      "title": "地月貿易被地球全面制裁",
      "desc": "地球突然爆發了全面冷戰，你控制的地月走私網絡被聯合國安全理事會列為了最高級別的跨境走私制裁黑名單，你在地球的所有銀行賬戶在一夜之間被全數凍結。",
      "eventLevel": "稀有",
      "cash": 3000,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "資源協調官"
    },
    {
      "id": "evt-月球探險-512",
      "title": "星艦大副的恥辱兵變",
      "desc": "由於物資長期匱乏，你最信任的二副在深夜發動了兵變，他們切斷了你臥室的氧氣供應，逼迫你簽下交出星艦最高指揮權的授權書，你被關進了禁閉室。",
      "eventLevel": "稀有",
      "cash": 3000,
      "happiness": 0,
      "reputation": 4,
      "rare": true,
      "important": false,
      "linkedTitle": "星艦大副"
    },
    {
      "id": "evt-月球探險-513",
      "title": "星艦船長的無盡深空號令",
      "desc": "你正式宣誓就任人類首艘具備曲率驅動能力的巨型遠洋星艦「普羅米修斯號」船長。你的座駕將帶領著三千名人類精英，正式駛向太陽系外的無盡深空。",
      "eventLevel": "傳奇",
      "cash": 4500,
      "happiness": 0,
      "reputation": 6,
      "rare": true,
      "important": true,
      "linkedTitle": "探險隊星艦船長"
    },
    {
      "id": "evt-月球探險-514",
      "title": "月面第一都市的奠基人",
      "desc": "在歷時十年的艱苦建設後，由你親手規劃、建造的人類首個自給自足的永久月面都市「阿提米絲」今日正式落成。你親手點亮了巨大的全息穹頂，地外文明的第一步由你奠基。",
      "eventLevel": "傳奇",
      "cash": 4500,
      "happiness": 0,
      "reputation": 6,
      "rare": true,
      "important": true,
      "linkedTitle": "先鋒拓荒者"
    },
    {
      "id": "evt-月球探險-515",
      "title": "行星捕手的萬億金色絞索",
      "desc": "你指揮著三艘重型核動力推進船，在距離地球五百萬公里的深空中，成功用高強度引力鎖定了一顆直徑一公里、富含純金與白金的近地小行星，將其強行拖入月球軌道。",
      "eventLevel": "傳奇",
      "cash": 4500,
      "happiness": 0,
      "reputation": 6,
      "rare": true,
      "important": true,
      "linkedTitle": "深空獵星手"
    },
    {
      "id": "evt-月球探險-516",
      "title": "地外文明信號的地球發言人",
      "desc": "你在月球背面接收到了來自天鵝座、具有絕對邏輯結構的「二階地外文明問候廣播」。聯合國大會一致投票通過，任命你為人類文明唯一的「地球對外文明遭遇特使」。",
      "eventLevel": "傳奇",
      "cash": 4500,
      "happiness": 0,
      "reputation": 6,
      "rare": true,
      "important": true,
      "linkedTitle": "異星遭遇特使"
    },
    {
      "id": "evt-月球探險-517",
      "title": "曲率引擎點火失敗的湮滅",
      "desc": "在「普羅米修斯號」進行歷史上首次曲率驅動點火的瞬間，引擎內部的反物質約束場突然發生了不可逆的崩潰。整艘星艦在幾毫秒內化為了一道耀眼的白光，消失在宇宙深處。",
      "eventLevel": "傳奇",
      "cash": 4500,
      "happiness": 0,
      "reputation": 6,
      "rare": true,
      "important": true,
      "linkedTitle": "探險隊星艦船長"
    },
    {
      "id": "evt-月球探險-518",
      "title": "銀河最高總督的銀白王座",
      "desc": "在經歷了與地球總部的決裂與抗爭後，月球正式宣佈獨立。你被全民推舉為首任「銀河開拓自由聯邦最高總督」，你站在直面地球的巨大落地窗前，執掌地外文明最高權柄。",
      "eventLevel": "命運",
      "cash": 6000,
      "happiness": 0,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "銀河開拓總督"
    },
    {
      "id": "evt-月球探險-519",
      "title": "黑洞事件視界外的永恆凝視",
      "desc": "你獨自駕駛著「先驅者號」探險飛船，自願駛入了半人馬座方向一個微型黑洞的事件視界。在跨越引力邊界的瞬間，你將高維度的宇宙終極物理方程式成功發送回了地球，肉體化為永恆。",
      "eventLevel": "命運",
      "cash": 6000,
      "happiness": 0,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "黑洞穿越者"
    },
    {
      "id": "evt-月球探險-520",
      "title": "室女座的文明火種播種者",
      "desc": "地球因為爆發了終極核戰爭而徹底毀滅，化為廢墟。你帶著人類最後的一萬枚受精卵與全部文化基因庫，駕駛著「方舟號」星艦駛向了百萬光年外的室女座新世界，延續火種。",
      "eventLevel": "命運",
      "cash": 6000,
      "happiness": 0,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "星系播種者"
    },
    {
      "id": "evt-月球探險-521",
      "title": "引力坍塌下的月球碎裂悲歌",
      "desc": "由於地球大國在月球核心進行了非法的重力武器試驗，引發了不可逆的月核引力坍塌。整個月球開始在巨大的潮汐力下四分五裂，你站在正在崩塌的基地穹頂下，看著地球，吐血身亡。",
      "eventLevel": "命運",
      "cash": -6000,
      "happiness": -4,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "銀河開拓總督"
    },
    {
      "id": "evt-月球探險-522",
      "title": "被時間遺忘的黑洞孤魂",
      "desc": "你在黑洞邊緣的強引力場中滯留了 brief 一刻。然而當你費盡千辛萬苦穿梭回地球軌道時，發現時間已經過去了整整一萬年。地球上的人類早已進化成了沒有情感的純能量體，沒人記得你的名字。",
      "eventLevel": "命運",
      "cash": 6000,
      "happiness": 0,
      "reputation": 8,
      "rare": true,
      "important": true,
      "linkedTitle": "黑洞穿越者"
    }
  ],
  "開礦": [
    {
      "id": "evt-開礦-523",
      "title": "坑道新手的下井費",
      "desc": "你作為礦場學徒的第一天，被老礦工們按照傳統規矩，強行要求你在下井前給每個人點煙、磕頭拜地頭蛇，隨後沉重的安全帽狠狠砸在你的腦門上。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "礦場學徒"
    },
    {
      "id": "evt-開礦-524",
      "title": "背上的萬斤巨石",
      "desc": "你作為搬運工，赤裸著上身，背上用粗麻繩死死捆綁著五十公斤重的剛採掘出的原礦石，在陡峭、濕滑且坡度高達六十度的坑道階梯上一步步往上爬。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "礦坑搬運工"
    },
    {
      "id": "evt-開礦-525",
      "title": "廢石堆裡的貓眼石",
      "desc": "你在高溫四十度的礦石分揀流水線旁連續工作了十二個小時，眼睛乾澀不已。就在你準備下班時，一塊沾滿泥土的廢石從你眼前滑過，邊緣露出一抹詭異的綠光。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "礦石分揀員"
    },
    {
      "id": "evt-開礦-526",
      "title": "風鎬的骨骼震動",
      "desc": "你雙手緊握著高壓風鎬，狠狠頂在堅硬無比的玄武岩岩壁上。劇烈的震動在幾秒鐘內傳遍你全身的骨骼，震得你牙齒打顫，虎口瞬間被震裂流血。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "鑿岩工"
    },
    {
      "id": "evt-開礦-527",
      "title": "生鏽的防爆礦燈",
      "desc": "你正身處地下兩千米、伸手不見五指的廢棄老坑道深處進行測繪，頭頂上的防爆礦燈突然發出一陣刺耳的滋滋聲，隨後火花一閃，徹底陷入了絕對的黑暗。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "礦燈守護員"
    },
    {
      "id": "evt-開礦-528",
      "title": "岩層的哭泣聲",
      "desc": "你趴在冰冷的岩壁上用聽音器檢測，突然聽到了岩層深處傳來一陣極其微弱、類似布料撕裂的「沙沙」聲。老經驗的地質員臉色瞬間慘白：這是大坍塌前的透水預兆！",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "地質觀察員"
    },
    {
      "id": "evt-開礦-529",
      "title": "指南針的死亡跳舞",
      "desc": "你帶著勘探隊深入一片未知的原始森林尋找鐵礦脈，手中的專業指南針指針突然開始瘋狂地三百六十度旋轉，所有的衛星定位信號在一瞬間徹底清零。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "礦脈搜尋者"
    },
    {
      "id": "evt-開礦-530",
      "title": "比例尺畫錯的迷宮",
      "desc": "你作為測繪助手，因為連續熬夜，在地圖上將一處核心支護柱的坐標比例尺少畫了一個零，導致採掘隊今天直接挖斷了防塌方的核心鋼樑。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "測繪助手"
    },
    {
      "id": "evt-開礦-531",
      "title": "荒野狼群的深夜圍攻",
      "desc": "你一個人在荒無人煙的戈壁灘進行樣本勘查，夜幕降臨，四周的沙丘上突然亮起了幾十雙綠油油的眼睛——你被一個飢餓的荒原狼群死死圍在了中央。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "野外勘查員"
    },
    {
      "id": "evt-開礦-532",
      "title": "被雨水稀釋的化驗皿",
      "desc": "你辛辛苦苦從火山口採集到的稀有硫磺礦原石樣本，在帶回營地的路上遭遇了特大暴雨，化驗皿密封不嚴，核心成分被雨水徹底稀釋破壞。",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "樣本採集員"
    },
    {
      "id": "evt-開礦-533",
      "title": "河床底部的金色砂礫",
      "desc": "你蹲在冰冷刺骨的阿拉斯加河流中，用鐵盤一遍又一遍地淘洗著河沙。就在你快要放棄時，夕陽的餘暉照在盤底，幾粒沉甸甸、亮晶晶的純金砂礫浮了出來。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "淘金客"
    },
    {
      "id": "evt-開礦-534",
      "title": "無法地帶的土匪火拼",
      "desc": "你剛剛在邊境荒原上搭建起礦工營地，深夜，兩波手持AK-47的當地非法武裝土匪為了爭奪你們的保護費管理權，在你的帳篷外展開了激烈的火拼。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "邊境開拓者"
    },
    {
      "id": "evt-開礦-535",
      "title": "斷裂的卡車傳動軸",
      "desc": "你開著裝滿了十噸高能炸藥的重型運輸卡車，在懸崖峭壁間的爛泥山路上爬行，卡車的傳動軸突然啪一聲斷裂，整輛卡車開始瘋狂地向著萬丈深淵倒退。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "補給運輸員"
    },
    {
      "id": "evt-開礦-536",
      "title": "食堂麵包發霉事件",
      "desc": "由於連續一個月的風雪封山，外面的物資無法運入。營地食堂倉庫裡存放的黑麵包全部長滿了綠色的霉毛，礦工們手持鐵鍬圍攻了你的辦公室要求吃肉。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "營市管理員"
    },
    {
      "id": "evt-開礦-537",
      "title": "毒蛇咬傷的荒野自救",
      "desc": "你在後山亂石堆採集樣本時，一條具有強烈神經毒素的劇毒響尾蛇突然竄出，狠狠咬傷了你的左腳踝。周圍方圓五十公里沒有醫院，你手裡只有一把美工刀。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "荒野生存家"
    },
    {
      "id": "evt-開礦-538",
      "title": "瓦斯超標的黃色警告",
      "desc": "你在下井巡查時，腰間掛著的老舊瓦斯檢測儀突然發出了刺耳的嗶嗶聲，顯示屏上的數字已經衝到了危險的臨界點，而周圍的工人還在用鐵鎬敲擊岩石。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "地質觀察員"
    },
    {
      "id": "evt-開礦-539",
      "title": "被私吞的金條",
      "desc": "你在河床深處淘到了一塊重達半斤的天然狗頭金，正當你興奮時，營地的黑心工頭帶著兩名打手走了過來，冷笑著用獵槍頂住你的腦門，強行沒收了黃金。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "淘金客"
    },
    {
      "id": "evt-開礦-540",
      "title": "礦坑滲水濕透了靴子",
      "desc": "地下水突然從斷層裂縫中瘋狂湧出，冰冷、混雜了大量煤渣的黑水幾分鐘內就沒過了你的膝蓋，你的皮靴灌滿了冰水，雙腳凍得失去知覺。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "礦坑搬運工"
    },
    {
      "id": "evt-開礦-541",
      "title": "弄丟的測繪記錄本",
      "desc": "你花費了半個月時間、徒步上百公里繪製的整座山脈露天礦床詳細等高線記錄本，在遭遇一場大風沙後不知下落，一切工作不得不從頭再來。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "測繪助手"
    },
    {
      "id": "evt-開礦-542",
      "title": "發電機燃料耗盡的黑夜",
      "desc": "正當礦坑底層進行深孔鑽探的關鍵時刻，地面的老舊柴油發電機突然因為燃料耗盡熄火。深井底部的通風機瞬間停止運轉，幾百名工人開始在窒息邊緣掙扎。",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "營地管理員"
    },
    {
      "id": "evt-開礦-543",
      "title": "被炸藥震碎的耳膜",
      "desc": "由於爆破工算錯了藥量，一場常規的開山爆破產生了遠超預期的恐怖衝擊波。你雖然躲在掩體後面，但巨大的爆炸聲依然瞬間震裂了你的雙耳鼓膜，鮮血直流。",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "鑿岩工"
    },
    {
      "id": "evt-開礦-544",
      "title": "樣本化驗單的惡意塗改",
      "desc": "你發現你採集到的高純度鋰礦樣本化驗單，被科室裡關係不和的前輩偷偷修改了數據，將其改成了一塊毫無開發價值的普通花崗岩，試圖讓你出醜。",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "樣本採集員"
    },
    {
      "id": "evt-開礦-545",
      "title": "野外勘查的帳篷被熊撕裂",
      "desc": "深夜你正在荒山帳篷裡熟睡，一隻體型巨大的成年棕熊因為聞到了食物的味道，暴力撕裂了你的帳篷外殼，一隻毛茸茸的巨大熊掌直接伸到了你的睡袋前。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "野外勘查員"
    },
    {
      "id": "evt-開礦-546",
      "title": "工人們的集體罷工大遊行",
      "desc": "由於礦主連續三個月拖欠工資，且拒絕更換嚴重老化的安全支護鋼樑，全礦五百名礦工在今天早上集體砸毀了辦公室玻璃，發動了全礦大罷工。",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "營地管理員"
    },
    {
      "id": "evt-開礦-547",
      "title": "被困在高空吊籃裡一整夜",
      "desc": "你乘坐的老舊鋼絲繩吊籃在下降到地下五百米深井的半空中時，捲揚機齒輪突然卡死。你就這樣在四周漆黑、陰冷且不斷有水滴落的半空中被吊了一整夜。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "礦場學徒"
    },
    {
      "id": "evt-開礦-548",
      "title": "草藥敷料的二次感染",
      "desc": "你在野外被岩石劃破了大腿，私自使用荒野上的野菊花和泥土進行敷料包紮，結果隔天整個傷口嚴重化膿發綠，引發了高燒四十度的急性淋巴腺炎。",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "荒野生存家"
    },
    {
      "id": "evt-開礦-549",
      "title": "黑心商人的劣質十字鎬",
      "desc": "你用辛苦攢下的錢從集市上買來的一批「特種鎢鋼十字鎬」，結果下井開工不到半小時，鎬頭就啪一聲斷成了兩截，切口處赫然全是劣質的生鐵沙眼。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "礦場學徒"
    },
    {
      "id": "evt-開礦-550",
      "title": "被大雪掩埋的補給車隊",
      "desc": "你帶領的物資運輸卡車隊在翻越海拔四千米的昆崙山隘口時，突發恐怖的雪崩，整整三卡車的核心糧食與保暖衣物被生生掩埋在了數米深的冰雪之下。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "補給運輸員"
    },
    {
      "id": "evt-開礦-551",
      "title": "開墾邊境時遭遇野蜂群",
      "desc": "你在砍伐山林準備搭建新礦坑入口時，不小心一斧頭砍爛了一個隱藏在樹洞裡的巨型非洲殺人蜂巢，成千上萬隻毒蜂瘋狂朝著你和工人們發起自殺式襲擊。",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "邊境開拓者"
    },
    {
      "id": "evt-開礦-552",
      "title": "分揀流水線的切指慘案",
      "desc": "由於連續疲勞作案，你在手動分揀高純度銅礦石時，右手不小心卡進了高速運轉的鋼製傳送帶齒輪裡，兩根手指當場被生生切斷，現場慘不忍睹。",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "礦石分揀員"
    },
    {
      "id": "evt-開礦-553",
      "title": "地質測繪儀遭遇雷擊",
      "desc": "一場突如其來的夏日雷暴中，你架設在山頂最高處、價值十萬的「高精度衛星定位地質測繪儀」不幸被一道閃電正面擊中，整台設備瞬間化為一堆焦黑的塑料熔渣。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "測繪助手"
    },
    {
      "id": "evt-開礦-554",
      "title": "被有毒地下水侵蝕的皮靴",
      "desc": "你踩在地下三千米一處剛剛打通的斷層積水裡，沒想到這水裡富含了極高濃度的硫酸銅與強酸成分，短短半天時間，你的牛皮長靴底就被生生腐蝕穿透，腳底大面積灼傷。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "礦坑搬運工"
    },
    {
      "id": "evt-開礦-555",
      "title": "野外樣本被狼狗吃掉",
      "desc": "你辛苦在野外採集了三天、裝在密封袋裡的珍貴古生物化石骨骼樣本，在回到營地後，被廚房養的一隻大狼狗當成普通骨頭叼走並啃成了碎屑。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "樣本採集員"
    },
    {
      "id": "evt-開礦-556",
      "title": "淘金盤掉進滾燙溫泉",
      "desc": "你在落基山脈的一處溪流淘金時，腳下一滑，盛滿了金砂的純銅淘金盤不小心掉進了旁邊一個溫度高達九十度、不斷翻滾著硫磺毒氣的天然溫泉深潭底。",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "淘金客"
    },
    {
      "id": "evt-開礦-557",
      "title": "邊境營地的水源下毒事件",
      "desc": "競爭對手為了強行霸佔你們的露天金礦，偷偷僱人在你們營地唯一賴以生存的荒野泉水上游投擲了大量的死豬與巴豆，導致全營地工人在一天內集體喪失戰鬥力。",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "邊境開拓者"
    },
    {
      "id": "evt-開礦-558",
      "title": "運輸車輪胎爆胎連環撞",
      "desc": "在運送高純度鐵礦石下山的陡峭山路上，你駕駛的重型翻斗車左後雙輪同時發生暴力爆胎，巨大的慣性帶著車身狠狠撞向了旁邊的陡峭護壁，半邊車頭變形。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "補給運輸員"
    },
    {
      "id": "evt-開礦-559",
      "title": "營地會計捲款跑路",
      "desc": "你信任的營地財務兼會計，在今天早上被發現人間蒸發，一同消失的還有存放在保險櫃裡、準備用來給全體工人發放工資的三萬枚現金硬幣，全營陷入混亂。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "營地管理員"
    },
    {
      "id": "evt-開礦-560",
      "title": "誤食荒野毒蘑菇發瘋",
      "desc": "你在斷糧的絕境下，在山林裡採摘了幾朵長相漂亮的白色野生蘑菇煮湯吃，結果吃完後半小時開始出現強烈幻覺，大喊著看到無數個金色小人在空中跳舞，瘋狂奔跑。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "荒野生存家"
    },
    {
      "id": "evt-開礦-561",
      "title": "鑿岩工的粉塵肺確診",
      "desc": "在年度職業病篩查中，年僅三十五歲、當了十年鑿岩工的你，看著胸部X光片上密密麻麻的白色纖維結節，醫生沉重地宣佈：你已經確診了晚期矽肺病。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "鑿岩工"
    },
    {
      "id": "evt-開礦-562",
      "title": "礦石分揀機的磁力卡死",
      "desc": "分揀車間的大型強力電磁選礦機在高功率運轉時，不小心吸入了一塊直徑一米的巨型富鐵隕石，巨大的磁力瞬間讓整條流水線的鋼製齒輪死死卡死燒毀。",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "礦石分揀員"
    },
    {
      "id": "evt-開礦-563",
      "title": "生鏽十字鎬刺穿腳掌",
      "desc": "你在清理廢棄坑道的碎石時，一柄斷裂、嚴重生鏽的舊十字鎬尖端朝上隱藏在泥土裡，你一腳踩上去，鋒利的鐵尖生生刺穿了你的厚橡膠鞋底與整個腳掌。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "礦場學徒"
    },
    {
      "id": "evt-開礦-564",
      "title": "瓦斯突出引發的局部小爆炸",
      "desc": "地下二千五百米斷層在鑽探時突發微型瓦斯突出，摩擦產生的火花瞬間引發了局部的小規模氣體爆炸。強大的衝擊波將你掀飛三米遠，衣服被全部燒焦，皮膚輕度燒傷。",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "地質觀察員"
    },
    {
      "id": "evt-開礦-565",
      "title": "淘金溪流突發山洪",
      "desc": "正當你蹲在河床中央全神貫注地篩選金砂時，上游暴雨引發的山洪化為一道三米高的巨浪排山倒海般衝了下來，瞬間將你的帳篷、淘金工具和黃金全部捲走。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "淘金客"
    },
    {
      "id": "evt-開礦-566",
      "title": "邊境開拓者的敗血症危機",
      "desc": "由於在邊境荒原連續半年吃不到任何新鮮蔬菜，只能靠鹽漬硬豬肉維持生命，你和幾名核心骨幹開始大面積掉牙、牙齦腐爛發臭，邊境營地陷入全面癱瘓。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "邊境開拓者"
    },
    {
      "id": "evt-開礦-567",
      "title": "補給卡車遭遇泥石流掩埋",
      "desc": "你開著補給卡車行駛在川藏線的險要路段，山體突然發生大規模塌方，巨石夾雜著泥沙如暴雨般落下，幾秒鐘內就將你的整輛卡車的後半部分死死掩埋在泥潭裡。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "補給運輸員"
    },
    {
      "id": "evt-開礦-568",
      "title": "營地突發急性流行性痢疾",
      "desc": "由於飲用水源遭到污染，整個開礦營地的兩百名礦工在今天下午集體爆發了急性的流行性痢疾，大口吐水、拉肚子拉到脫水，整座營地躺滿了痛苦呻吟的漢子。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "營地管理員"
    },
    {
      "id": "evt-開礦-569",
      "title": "野外遭遇沼澤毒氣窒息",
      "desc": "你在穿過一片原始森林勘探煤田時，不小心踏入了一片隱藏在落葉底下的天然沼澤。沼澤表面聚集了高濃度的無色無味甲烷毒氣，你幾秒內就感覺大腦缺氧，四肢無力。",
      "eventLevel": "普通",
      "cash": -1800,
      "happiness": -1,
      "reputation": 0,
      "rare": false,
      "important": false,
      "linkedTitle": "野外勘查員"
    },
    {
      "id": "evt-開礦-570",
      "title": "地質分析報告被評審駁回",
      "desc": "你花費了三個月撰寫的關於某個新斷層含銅量評估的地質報告，在遞交給局裡評審大會時，被資深專家以「數據採樣點過少、模型過於理想化」為由當場冷酷駁回。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "地質觀察員"
    },
    {
      "id": "evt-開礦-571",
      "title": "礦石分揀車間的深夜大火",
      "desc": "由於電線短路，存放了高檔原礦石與大量易燃傳送帶橡膠的選礦一車間在半夜突發熊熊大火，滾滾濃煙直衝雲霄，你頂著高溫衝進火海試圖搶救核心數據。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "礦石分揀員"
    },
    {
      "id": "evt-開礦-572",
      "title": "第一鏟高純度露天煤精",
      "desc": "在經歷了長達半年的荒野開墾與忍飢挨餓後，今天下午，你的挖掘機鋼斗終於在山谷地表下掀開了一層厚厚的黃土，露出了底下黑得發亮、品質極高的超大露天煤精礦脈。",
      "eventLevel": "普通",
      "cash": 2000,
      "happiness": 0,
      "reputation": 1,
      "rare": false,
      "important": false,
      "linkedTitle": "邊境開拓者"
    },
    {
      "id": "evt-開礦-573",
      "title": "鐵血監工的百萬產能神話",
      "desc": "你出任全省最大煤礦的總監工。為了完成年底指標，你下達了最嚴厲的「連軸轉生死令」，皮鞭與高額獎金並用，強行將底層產能提升了一倍，但也引來了工人們背地裡的詛咒。",
      "eventLevel": "稀有",
      "cash": 4000,
      "happiness": -1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "礦區監工"
    },
    {
      "id": "evt-開礦-574",
      "title": "萬噸斷層的驚天生死一擊",
      "desc": "千米深井遭遇了死硬的金剛石岩層阻擋，多台鑽機報廢。作為爆破技師的你，私自調配了一種高能液氧液體炸藥，在計算精準到毫秒的定點爆破下，一聲巨響，生生將萬噸斷層炸開。",
      "eventLevel": "稀有",
      "cash": -3600,
      "happiness": -1,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "爆破技師"
    },
    {
      "id": "evt-開礦-575",
      "title": "地心五千米的深井巨鑽落地",
      "desc": "你主導引進了全球首台「超導核動力深井地心鑽探機」。巨大的合金鑽頭直徑高達五米，伴隨著雷鳴般的巨響，正式向著地下五千米的地球地幔邊緣發起了歷史性的鑽探。",
      "eventLevel": "稀有",
      "cash": 4000,
      "happiness": -1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "深井工程師"
    },
    {
      "id": "evt-開礦-576",
      "title": "一紙報告拯救百億勘探隊",
      "desc": "某個國際礦業財團正準備砸下百億資金開發一片宣稱是「世紀金礦」的山脈。作為地質分析師的你，單憑幾粒碎石的微量元素比對，精準看穿了該礦脈是個空殼騙局，一紙報告強行幫財團止損。",
      "eventLevel": "稀有",
      "cash": -3600,
      "happiness": -1,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "地質分析師"
    },
    {
      "id": "evt-開礦-577",
      "title": "點石成金的世界級富鐵礦脈",
      "desc": "你帶著勘探隊在人跡罕見的西伯利亞冰原徒步三個月，憑藉著你獨創的「電磁波地層回聲定位法」，成功發現了一座儲量高達十億噸、含鐵量高達70%的世界級超級富鐵礦脈。",
      "eventLevel": "稀有",
      "cash": 4000,
      "happiness": -1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "礦脈探勘家"
    },
    {
      "id": "evt-開礦-578",
      "title": "資源調查官的最高查封令",
      "desc": "你正式榮升為國家資源部最高特派調查官。你上任的第一天，就帶著全副武裝的武警部隊，冷酷地查封了三十家涉嫌非法偷採稀土元素、背後有黑幫保護傘的黑礦場，政壇地震。",
      "eventLevel": "稀有",
      "cash": -3600,
      "happiness": -1,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "資源調查官"
    },
    {
      "id": "evt-開礦-579",
      "title": "西伯利亞冰原上的鐵路小鎮",
      "desc": "你作為邊疆開發者，在發現了超級富礦後，力排眾議，在荒無人煙、零下五十度的北極圈邊緣，用三年時間生生修築了一條鐵路，並圍繞礦區建立起了一座擁有三萬人口的鋼鐵新城。",
      "eventLevel": "稀有",
      "cash": 4000,
      "happiness": -1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "邊疆開發者"
    },
    {
      "id": "evt-開礦-580",
      "title": "隻手垄斷國際銅期貨價格",
      "desc": "你掌控了全國半數以上的銅礦開採權。面對國際資本惡意做空，你冷笑著下令全面封鎖庫存、所有礦場停產維護。一時間全球銅供應暴跌，國際期貨市場連續七天漲停，你賺翻了。",
      "eventLevel": "稀有",
      "cash": 4000,
      "happiness": -1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "資源經營者"
    },
    {
      "id": "evt-開礦-581",
      "title": "爆破劑量算錯的萬人活埋危機",
      "desc": "由於你在策劃一次巨型露天採石場爆破時，少算了一層隱藏的喀斯特溶洞空洞，導致爆破引發了整座山體的連鎖大塌方，幾百萬噸巨石瞬間將下方的整個開採小組死死活埋。",
      "eventLevel": "稀有",
      "cash": -3600,
      "happiness": -1,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "爆破技師"
    },
    {
      "id": "evt-開礦-582",
      "title": "深井開採引發的岩爆慘案",
      "desc": "在深井地下四千米高壓環境下，由於你過度追求採掘速度，忽視了應力釋放警告，導致發生了恐怖的急性「超級岩爆」。堅硬的岩壁像炸彈一樣暴力碎裂，當場將十名核心工程師砸成肉泥。",
      "eventLevel": "稀有",
      "cash": 4000,
      "happiness": -1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "深井工程師"
    },
    {
      "id": "evt-開礦-583",
      "title": "資源調查官的深夜黑槍",
      "desc": "在你準備簽署對全省最大黃金托拉斯企業非法排毒的起訴書前夕，兩名蒙面殺手突然在深夜破開你辦公室的大門，手持消音手槍朝著你的胸口連開三槍，你倒在血泊中。",
      "eventLevel": "稀有",
      "cash": -3600,
      "happiness": -1,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "資源調查官"
    },
    {
      "id": "evt-開礦-584",
      "title": "礦脈被鄰國強行用軍隊霸佔",
      "desc": "你費盡千辛萬苦、在兩國交界的灰色地帶發現的超大型石油裂解礦脈，在今天一早，被鄰國突然派遣的一支正規裝甲旅以「領土主權爭議」為由強行接管，你的營地被就地推平。",
      "eventLevel": "稀有",
      "cash": -3600,
      "happiness": -1,
      "reputation": 0,
      "rare": true,
      "important": false,
      "linkedTitle": "邊疆開發者"
    },
    {
      "id": "evt-開礦-585",
      "title": "期貨爆倉的破產跳樓夜",
      "desc": "由於你惡意囤積稀土原礦意圖操縱價格，沒想到美國突然宣佈發現了超大型替代礦體，導致稀土國際價格在一天內暴跌90%。你的百億槓桿資金瞬間爆倉，債主在大樓下圍堵你。",
      "eventLevel": "稀有",
      "cash": 4000,
      "happiness": -1,
      "reputation": 2,
      "rare": true,
      "important": false,
      "linkedTitle": "資源經營者"
    },
    {
      "id": "evt-開礦-586",
      "title": "礦業物理法的全球加冕",
      "desc": "你發明了一套基於「超聲波流體力學」的全新一代無污染採礦法，將全球有色金屬的採掘效率提升了整整兩成，且完全不釋放任何毒素。世界礦業大會正式將你定為「當代礦業大師」。",
      "eventLevel": "傳奇",
      "cash": 6000,
      "happiness": -1,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "礦業大師"
    },
    {
      "id": "evt-開礦-587",
      "title": "地心水晶聖殿的造訪者",
      "desc": "你指揮的超深淵探險隊，成功深入到了地球地下六千米的地函邊緣。在這裡，你們發現了一個面積高達數十平方公里、由高溫熔岩與直徑十米的巨型遠古水晶交織成的奇蹟地底空洞。",
      "eventLevel": "傳奇",
      "cash": 6000,
      "happiness": -1,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "地心探險家"
    },
    {
      "id": "evt-開礦-588",
      "title": "下個世紀的藍光超能燃料",
      "desc": "你在太平洋萬米深海的海底地殼斷裂帶鑽探時，成功開採出了一種泛著幽藍色光芒、能量密度比核能還要高出百倍的全新超能未知結晶礦物「藍晶」，你重新定義了人類能源。",
      "eventLevel": "傳奇",
      "cash": 6000,
      "happiness": -1,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "能源開拓者"
    },
    {
      "id": "evt-開礦-589",
      "title": "鐵血托拉斯的寡頭王冠",
      "desc": "你完成了對非洲、西伯利亞和拉美三大銅鋰礦業巨頭的強制大併購，正式掛牌成立了「全球資源保障托拉斯集團」。你一個人掌控了全球八成的重工業原材料定價權，一言九鼎。",
      "eventLevel": "傳奇",
      "cash": 6000,
      "happiness": -1,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "礦業霸主"
    },
    {
      "id": "evt-開礦-590",
      "title": "地心探險隊的熔岩吞噬",
      "desc": "在深入地函的探險中，深層探測器的冷卻系統突然發生了不可逆的超導失效。在極高壓高溫下，特製的鈦合金探測車在幾秒鐘內被周圍瘋狂湧入的千度熔岩生生吞噬融化，全員湮滅。",
      "eventLevel": "傳奇",
      "cash": 6000,
      "happiness": -1,
      "reputation": 3,
      "rare": true,
      "important": true,
      "linkedTitle": "地心探險家"
    },
    {
      "id": "evt-開礦-591",
      "title": "世界鑽石之王的金權王座",
      "desc": "你擊敗了戴比爾斯等百年壟斷巨頭，你名下的私人金庫掌控了全球最大的黃金儲備與九成的特級鑽石礦產。非洲三個國家的總統皆由你出資扶持，你的財富等同於金權之巔。",
      "eventLevel": "命運",
      "cash": 8000,
      "happiness": -1,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "礦業之王"
    },
    {
      "id": "evt-開礦-592",
      "title": "地底五千米的地下諾亞方舟",
      "desc": "地球地表爆發了終極生化與核輻射災難，全球九成生物滅絕。而你利用一生的財富與技術，在地下五千米建立起了一座可以自給自足、容納十萬人口的「地心不滅生態城」，延續了文明。",
      "eventLevel": "命運",
      "cash": -7200,
      "happiness": -1,
      "reputation": 0,
      "rare": true,
      "important": true,
      "linkedTitle": "地心開拓者"
    },
    {
      "id": "evt-開礦-593",
      "title": "一手挑起全球金融海嘯的鐵鎬",
      "desc": "你在倫敦金屬交易所的闭门會議上，輕輕彈了彈你十字鎬上的煤灰，冷酷地宣佈全球有色金屬全面停供三個月。一時間，全球股市與期貨市場崩盤，引發了歷史上最大的金融海嘯。",
      "eventLevel": "命運",
      "cash": 8000,
      "happiness": -1,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "資源霸主"
    },
    {
      "id": "evt-開礦-594",
      "title": "地底大坍塌的黑色棺材",
      "desc": "在一次深入地下六千米的核心採掘中，引發了不可逆的地殼板塊連鎖大位移。幾億噸的地下岩層在幾秒內全面崩塌，將你和你的萬億採掘設備永久死死封印在了地心深處，化為一具黑色棺材。",
      "eventLevel": "命運",
      "cash": 8000,
      "happiness": -1,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "地心開拓者"
    },
    {
      "id": "evt-開礦-595",
      "title": "金山頂端的孤獨守財奴",
      "desc": "你站在用純金打造、高達百米的私人別墅頂端，看著保險庫裡數不清的黃金與鑽石。然而此時你已年近九旬，身患絕症，身邊沒有一個親人，只有一群等著你死後瓜分遺產的冷酷律師。",
      "eventLevel": "命運",
      "cash": 8000,
      "happiness": -1,
      "reputation": 4,
      "rare": true,
      "important": true,
      "linkedTitle": "礦業之王"
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
      const next=(prev||[]).map(x=>({...x, tierName:x.tier===3?"菁英":x.tierName, desc:syncNarrativeNaming(x.desc||""), motto:syncNarrativeNaming(x.motto||"")}));
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
      desc:"你開始思考：這真的是我想走的人生嗎？

重新出發會回到本職業起點，重新經歷這段職業道路；繼續前進則維持目前方向。",
      actions:[
        {label:"重新出發", onClick:()=>{updateCurrent(p=>({...p, careerPos:0, careerProgress:0, lifeLog:[...p.lifeLog,{ageMonths:p.ageMonths,title:`${career}事業轉折點`,desc:"他選擇回到職業起點，重新出發。",type:"careerTurn",important:true}]})); setModal(null); nextTurn();}},
        {label:"繼續前進", onClick:()=>{updateCurrent(p=>({...p, lifeLog:[...p.lifeLog,{ageMonths:p.ageMonths,title:`${career}事業轉折點`,desc:"他短暫動搖，最後仍選擇沿著原路繼續前進。",type:"careerTurn",important:true}]})); setModal(null); nextTurn();}}
      ]
    });
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
    const unlocked=titleCodex || [];
    const unlockedMap=new Map(unlocked.map(x=>[`${x.career}-${x.title}`,x]));
    const all=flattenTitlePools();
    const groups=careers.map(c=>({career:c, titles:all.filter(t=>t.career===c)}));
    const total=all.length;
    const unlockedTotal=all.filter(t=>unlockedMap.has(`${t.career}-${t.title}`)).length;
    const visibleGroups=selectedCareer==="全部"?groups:groups.filter(g=>g.career===selectedCareer);
    setModal({
      title:"🏆 頭銜集卡冊",
      desc:`總進度 ${unlockedTotal}/${total}。已解鎖頭銜會顯示完整資訊，未解鎖頭銜只保留模糊提示。`,
      custom:<div className="titleAlbum">
        <div className="albumTabs"><button className={selectedCareer==="全部"?'active':''} onClick={()=>showTitleCodex('全部')}>全部</button>{careers.map(c=>{const g=groups.find(x=>x.career===c); const n=g.titles.filter(t=>unlockedMap.has(`${c}-${t.title}`)).length; return <button key={c} className={selectedCareer===c?'active':''} onClick={()=>showTitleCodex(c)}>{c}<small>{n}/{g.titles.length}</small></button>})}</div>
        <div className="titleCodex paged">{visibleGroups.map(g=><section key={g.career} className="codexGroup"><h3>{g.career}｜已解鎖 {g.titles.filter(t=>unlockedMap.has(`${g.career}-${t.title}`)).length}/{g.titles.length}</h3><div className="codexGrid">{g.titles.map(t=>{const rec=unlockedMap.get(`${g.career}-${t.title}`); const open=!!rec; return <div key={t.title} className={`codexCard ${open?rarityClass(t.rarity):"locked"}`}><span className="starBadge">{open?rarityStars(t.rarity):"？"}</span><b>{open?t.title:"？？？"}</b><small>{open?`${displayRarity(t.rarity)}｜${titleTierText(t)}`:"尚未理解的人生"}</small><p>{open?(t.motto || t.desc):"有人曾在這條道路上走得更深，留下了尚未被你理解的人生痕跡。"}</p>{open&&rec.firstAge?<em>首次取得：{rec.firstAge}</em>:null}</div>})}</div></section>)}</div>
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

  return <div className="app"><audio ref={mainAudioRef} src={MAIN_BGM}/><audio ref={careerAudioRef} src={CAREER_BGM}/>{showCoinRain&&<CoinRain/>}{showStarRain&&<StarRain/>}<header><h1>幸福人 Classic <span>{VERSION}</span></h1><div className="topActions"><button onClick={showReleaseNotes}>📜 更新日誌</button><button onClick={showTitleCodex}>🏆 頭銜收藏冊</button><button onClick={showLifeLibrary}>📚 人生藏書館</button><button onClick={()=>setMusic(!music)}>{music?'🔊 音樂開':'🔇 音樂關'}</button><button onClick={()=>setSfx(!sfx)}>{sfx?'🔔 音效開':'🔕 音效關'}</button><div className="supporterBox"><input placeholder="支持者序號" value={supporterInput} onChange={e=>setSupporterInput(e.target.value)}/><button onClick={unlockSupporter}>{supporter||starSupporter?'🌟 已啟用':'啟用特效'}</button></div></div><div className="topLog"><b>Recent Log</b>{logs.slice(0,3).map((l,i)=><p key={i}>{l}</p>)}</div></header><main className="gameLayout"><section className="boardWrap"><div className="outerBoard">{outerBoard.map((tile,i)=><div key={tile.id} className={`tile pos${i} ${boardTile?.id===tile.id?'active':''}`}><span>{i}</span><b>{tile.icon}</b><small>{tile.name}</small><div className="tokens">{players.filter(p=>!p.career&&p.outerPos===i).map(p=><em key={p.id}>{p.animal}</em>)}</div></div>)}<div className="centerStage"><div className="turnBox compactTurn"><div className="turnHeader"><div><h2>{current?.animal} {current&&displayName(current)}</h2><p>{current&&ageText(current.ageMonths)}｜{current&&stageOf(current.ageMonths)}</p></div><button className="primary inlineRoll" disabled={moving||gameOver} onClick={rollDice}>{moving?"移動中":"擲骰"}</button></div><div className="dice">{dice?dice.total:"🎲"}</div><p>{current?.career?`目前在${current.career}內圈，使用單骰。進度 ${(current.careerProgress||0)}/${(current.careerLayout||careerBoards[current.career]).length}`:"外圈人生道路，使用雙骰。"}</p></div><div className="wallet"><h3>人生皮夾</h3><p>現金：{current&&money(current.cash)}</p><p>薪水：{current&&money(current.salary)}</p><p>財富：{wealthScore}｜快樂：{current?.happiness}｜名譽：{current?.reputation}</p><p>目標：{current?.target.wealth}/{current?.target.happiness}/{current?.target.reputation}</p><h4>頭銜</h4><div className="titles">{current?.titles.length?current.titles.map(t=><button key={t.id} title="點擊查看頭銜屬性或裝備" className={`${rarityClass(t.rarity)} ${t.id===current.equippedTitleId?'equipped':''}`} onClick={()=>titleInfo(t)}><span className="starBadge">{rarityStars(t.rarity)}</span>{t.id===current.equippedTitleId?'✓ ':''}{t.title}<small>{titleTierText(t)}｜{displayRarity(t.rarity)}</small></button>):<span>尚無頭銜</span>}</div></div></div></div></section><aside className="players">{players.map((p,i)=><div key={p.id} className={`playerCard ${rarityClass(equippedTitle(p)?.rarity)} ${i===turn?'current':''}`}><b>{p.animal} {displayName(p)}</b><p>{ageText(p.ageMonths)}</p><p>現金 {money(p.cash)}｜快樂 {p.happiness}｜名譽 {p.reputation}</p><p>{p.career?`正在${p.career}｜進度 ${(p.careerProgress||0)}/${(p.careerLayout||careerBoards[p.career]).length}`:`外圈 ${p.outerPos}`}</p><button className="walletOpenBtn" onClick={()=>showPlayerWallet(i)}>查看人生皮夾／頭銜</button></div>)}</aside></main>{modal&&<Modal modal={modal} close={()=>setModal(null)}/>}</div>;
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
