import { useState, useEffect, useRef, useCallback } from "react";

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&display=swap');
:root {
  --bg:#07080C;--bg2:#0D0F18;--bg3:#12151F;
  --card:#161B28;--card2:#1C2236;--card3:#222840;
  --b:rgba(255,255,255,.055);--b2:rgba(255,255,255,.1);--b3:rgba(255,255,255,.15);
  --t:#EEF2FF;--t2:#8892AA;--t3:#4A5468;
  --v:#6366F1;--v2:#818CF8;--v3:#C7D2FE;--v4:rgba(99,102,241,.12);
  --n:#EC4899;--n2:#F472B6;
  --p:#10B981;--p2:#34D399;
  --f:#F59E0B;--f2:#FCD34D;
  --c:#06B6D4;--c2:#22D3EE;
  --r:#EF4444;--r2:#FCA5A5;
  --gv:linear-gradient(135deg,#6366F1,#8B5CF6);
  --gn:linear-gradient(135deg,#EC4899,#F43F5E);
  --gp:linear-gradient(135deg,#10B981,#06B6D4);
  --gf:linear-gradient(135deg,#F59E0B,#EF4444);
  --ga:linear-gradient(135deg,#6366F1,#EC4899);
  --gg:linear-gradient(135deg,#FFD700,#FFA500);
  --font:'DM Sans',sans-serif;
  --serif:'Instrument Serif',serif;
  --mono:'Space Mono',monospace;
  --ease:cubic-bezier(.34,1.2,.64,1);
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased}
html,body,#root{width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;overflow:hidden;font-family:var(--font);color:var(--t)}
.flow-device{width:393px;height:852px;background:var(--bg);border-radius:52px;position:relative;overflow:hidden;
  box-shadow:0 0 0 1px rgba(255,255,255,.08),0 0 0 10px #111,0 0 0 11px rgba(255,255,255,.04),0 80px 160px rgba(0,0,0,.9),0 0 120px rgba(99,102,241,.15);}
.island{position:absolute;top:14px;left:50%;transform:translateX(-50%);background:#000;border-radius:22px;z-index:300;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;overflow:hidden;transition:all .5s var(--ease);}
.island.sm{width:126px;height:36px;}.island.lg{width:350px;height:82px;}
.idot{width:10px;height:10px;border-radius:50%;background:var(--v);animation:idp 2.4s ease-in-out infinite;flex-shrink:0;}
@keyframes idp{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.4)}}
.itext{font-size:12px;color:rgba(255,255,255,.75);transition:opacity .3s .1s;white-space:nowrap;}.itext b{color:white;}
.sbody{flex:1;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;padding-top:38px;padding-bottom:84px;}.sbody::-webkit-scrollbar{display:none;}.sbody.nonav{padding-bottom:24px;padding-top:38px;}
.nav{position:absolute;bottom:0;left:0;right:0;height:84px;background:rgba(7,8,12,.97);backdrop-filter:blur(28px);border-top:1px solid var(--b);display:flex;align-items:center;justify-content:space-around;padding:0 4px 16px;z-index:100;}
.ni{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:5px 6px;border-radius:14px;transition:all .2s;position:relative;user-select:none;}
.ni.on{background:var(--v4);}.ni-i{font-size:20px;transition:transform .2s;}.ni.on .ni-i{transform:scale(1.15);}
.ni-l{font-size:9px;font-weight:600;color:var(--t3);transition:color .2s;letter-spacing:.3px;}.ni.on .ni-l{color:var(--v2);}
.nbadge{position:absolute;top:2px;right:4px;min-width:14px;height:14px;border-radius:7px;background:var(--n);font-size:8px;font-weight:700;color:white;display:flex;align-items:center;justify-content:center;padding:0 3px;border:2px solid var(--bg);}
.scr{position:absolute;inset:0;display:flex;flex-direction:column;transition:opacity .3s ease,transform .3s ease;}
.hdr{display:flex;align-items:center;gap:10px;padding:14px 20px 8px;}
.back-btn,.home-btn{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all .15s;font-size:17px;}
.back-btn{background:var(--card);border:1px solid var(--b2);color:var(--t);}.back-btn:active{transform:scale(.9);}
.home-btn{background:var(--v4);border:1px solid rgba(99,102,241,.3);color:var(--v2);}.home-btn:active{transform:scale(.88);}
.hdr-title{font-size:18px;font-weight:700;flex:1;}.hdr-serif{font-family:var(--serif);font-size:22px;}
.hdr-action{font-size:13px;font-weight:700;color:var(--v2);cursor:pointer;white-space:nowrap;}
.sh{display:flex;align-items:center;justify-content:space-between;padding:0 20px;margin-bottom:12px;}
.sh-t{font-size:12px;font-weight:700;color:var(--t2);letter-spacing:1.2px;text-transform:uppercase;}.sh-l{font-size:12px;font-weight:700;color:var(--v2);cursor:pointer;}
.pill{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;}
.pv{background:rgba(99,102,241,.14);color:var(--v2);}.pp{background:rgba(16,185,129,.12);color:var(--p2);}
.pn{background:rgba(236,72,153,.12);color:var(--n2);}.pf{background:rgba(245,158,11,.12);color:var(--f2);}
.pc{background:rgba(6,182,212,.12);color:var(--c2);}.pr{background:rgba(239,68,68,.12);color:var(--r2);}
.btn{width:100%;padding:16px;background:var(--gv);border:none;border-radius:20px;color:white;font-size:16px;font-weight:700;font-family:var(--font);cursor:pointer;box-shadow:0 8px 24px rgba(99,102,241,.3);transition:transform .15s,box-shadow .15s;}
.btn:active{transform:scale(.98);}.btn.outline{background:none;border:1px solid var(--b2);color:var(--t2);box-shadow:none;}
.btn.green{background:var(--gp);box-shadow:0 8px 24px rgba(16,185,129,.25);}.btn.pink{background:var(--gn);box-shadow:0 8px 24px rgba(236,72,153,.25);}
.btn.gold{background:var(--gg);box-shadow:0 8px 24px rgba(255,215,0,.25);color:#1a1a00;}
.btn.sm{padding:10px 20px;border-radius:14px;font-size:14px;width:auto;}
.ov-bg{position:absolute;inset:0;background:rgba(7,8,12,.88);backdrop-filter:blur(20px);z-index:250;display:flex;flex-direction:column;justify-content:flex-end;animation:ovin .25s ease;}
@keyframes ovin{from{opacity:0}to{opacity:1}}
.sheet{background:var(--bg2);border-radius:36px 36px 0 0;border-top:1px solid var(--b2);padding:24px 20px 36px;animation:shin .35s var(--ease);max-height:90vh;overflow-y:auto;}.sheet::-webkit-scrollbar{display:none;}
@keyframes shin{from{transform:translateY(100%)}to{transform:translateY(0)}}
.drag{width:40px;height:4px;background:var(--b2);border-radius:2px;margin:0 auto 20px;}
.sheet-title{font-size:22px;font-weight:700;font-family:var(--serif);margin-bottom:6px;}
.sheet-sub{font-size:13px;color:var(--t2);line-height:1.6;margin-bottom:20px;}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.orb-r1{position:absolute;inset:0;border-radius:50%;border:1px solid rgba(99,102,241,.25);animation:spin 22s linear infinite;}
.orb-r1::before{content:'';position:absolute;top:-3px;left:50%;width:6px;height:6px;border-radius:50%;background:var(--v2);box-shadow:0 0 12px var(--v),0 0 24px var(--v);}
.orb-r2{position:absolute;inset:12px;border-radius:50%;border:1px solid rgba(236,72,153,.15);animation:spin 16s linear infinite reverse;}
.orb-r2::before{content:'';position:absolute;bottom:-3px;right:30%;width:4px;height:4px;border-radius:50%;background:var(--n2);box-shadow:0 0 8px var(--n);}
.orb-r3{position:absolute;inset:24px;border-radius:50%;background:radial-gradient(circle at 40% 35%,rgba(99,102,241,.28),rgba(99,102,241,.06) 60%,transparent);}
.orb-outer{position:absolute;width:260px;height:260px;border-radius:50%;border:1px dashed rgba(99,102,241,.1);animation:spin 40s linear infinite;top:50%;left:50%;transform:translate(-50%,-50%);}
@keyframes msgin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.msg-in{animation:msgin .3s ease;}
@keyframes thk{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}
.td{width:6px;height:6px;border-radius:50%;background:var(--v2);animation:thk 1.2s infinite;}.td:nth-child(2){animation-delay:.2s;}.td:nth-child(3){animation-delay:.4s;}
@keyframes coinFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-8px) rotate(5deg)}}
@keyframes pulse{0%,100%{box-shadow:0 0 20px rgba(255,215,0,.3)}50%{box-shadow:0 0 40px rgba(255,215,0,.6),0 0 60px rgba(255,215,0,.2)}}
@keyframes walkPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes stepFill{from{width:0}to{width:var(--fill)}}
.hscroll{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;}.hscroll::-webkit-scrollbar{display:none;}
.chip{flex-shrink:0;padding:8px 14px;border:1px solid var(--b2);border-radius:16px;font-size:12px;font-weight:700;color:var(--t2);cursor:pointer;white-space:nowrap;background:var(--card);transition:all .15s;}
.chip:active,.chip:hover{border-color:var(--v);color:var(--v2);background:var(--v4);}
.tog{width:48px;height:26px;border-radius:13px;position:relative;cursor:pointer;flex-shrink:0;transition:background .2s;}
.tog::after{content:'';position:absolute;top:3px;width:20px;height:20px;border-radius:50%;background:white;transition:left .2s;}
.tog.on{background:var(--p);}.tog.on::after{left:25px;}.tog.off{background:var(--card3);}.tog.off::after{left:3px;}
@keyframes lpulse{0%,100%{opacity:1}50%{opacity:.3}}
.live-dot::before{content:'●';color:var(--r);animation:lpulse 1s infinite;margin-right:4px;}
@keyframes lvlup{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
@keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-12px)}}
@keyframes fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(900px) rotate(720deg);opacity:0}}
@keyframes bspin{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:var(--gg);box-shadow:0 0 12px rgba(255,215,0,.5);cursor:pointer;border:3px solid white;}
input[type=range]::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:var(--gg);box-shadow:0 0 12px rgba(255,215,0,.5);cursor:pointer;border:3px solid white;}
input::placeholder{color:var(--t3);opacity:1;}
input[type=text],input[type=number]{-webkit-appearance:none;appearance:none;}
`;

const ISLAND_MSGS = [
  <><b>₹8k stipend split 🎉</b></>,
  <><b>Round-up</b> +₹8 → Goa jar</>,
  <>Riya invested in <b>EV Smallcase</b></>,
  <><b>12 day streak</b> — keep going 🔥</>,
  <><b>5,200 steps</b> today 🚶</>,
];

const ORACLE_REPLIES = {
  save:{u:"Where can I save money? 💰",a:`Okay let's find your leaks 🔍<br><br><div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px;margin-top:6px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--t2)">🍕 Food delivery</span><span style="color:var(--r2);font-weight:700">₹4,820 · CUT ₹2k</span></div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--t2)">📺 Subscriptions</span><span style="color:var(--r2);font-weight:700">₹1,097 · CUT ₹700</span></div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--t2)">🚕 Uber rides</span><span style="color:var(--f2);font-weight:700">₹1,840 · CUT ₹500</span></div><div style="display:flex;justify-content:space-between"><span style="color:var(--t2)">☕ Coffee runs</span><span style="color:var(--f2);font-weight:700">₹960 · CUT ₹400</span></div></div><br>Total saveable: <b style="color:var(--p2)">₹3,600/month</b> 🤯<br>That's a Goa trip every 2 months. Auto-lock any?`},
  trip:{u:"How long to save for a trip? ✈️",a:`Let's plan it ✈️<br><br><div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px;margin-top:6px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--c2);font-weight:700">🏖️ Goa (₹8k)</span><span style="color:var(--p2)">3 weeks left</span></div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--v2);font-weight:700">🏔️ Manali (₹15k)</span><span>7 weeks</span></div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--n2);font-weight:700">🌏 Thailand (₹45k)</span><span>5 months</span></div><div style="display:flex;justify-content:space-between"><span style="color:var(--f2);font-weight:700">🇪🇺 Europe (₹2L)</span><span>14 months</span></div></div><br>At <b>₹2,500/week</b> savings. Create a jar for any trip?`},
  invest:{u:"Help me plan investments 📈",a:`Your investment game plan 📊<br><br><div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px;margin-top:6px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--t2)">Risk profile</span><span style="color:var(--f2);font-weight:700">Moderate-Aggressive</span></div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--t2)">Monthly investable</span><span style="color:var(--p2);font-weight:700">₹3,000</span></div></div><br><b style="color:var(--v2)">60%</b> → Nifty 50 ETF<br><b style="color:var(--n2)">30%</b> → Smallcase<br><b style="color:var(--f2)">10%</b> → Digital Gold<br><br>→ <b style="color:var(--p2)">₹4.2L in 5 years</b> 🚀`},
  spend:{u:"Show me spend insights 🔍",a:`November report card 📋<br><br><div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px;margin-top:6px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--t2)">Total spent</span><span style="color:var(--r2);font-weight:700">₹8,340</span></div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--t2)">vs last month</span><span style="color:var(--p2);font-weight:700">▼ ₹2,860 less 🎉</span></div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--t2)">Biggest splurge</span><span style="color:var(--r2);font-weight:700">Swiggy · ₹4,820</span></div><div style="display:flex;justify-content:space-between"><span style="color:var(--t2)">Savings rate</span><span style="color:var(--p2);font-weight:700">45% · Top 5% 🔥</span></div></div><br>Food delivery still <b>38%</b> of income. Challenge effect is working though — keep competing.`},
  sip:{u:"Plan my SIPs 📊",a:`SIP planner — wealth engine 🏗️<br><br><div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px;margin-top:6px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--v2)">Nifty 50 ETF</span><span>₹500/mo → <b style="color:var(--p2)">₹42k 5Y</b></span></div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--n2)">EV Smallcase</span><span>₹500/mo → <b style="color:var(--p2)">₹56k 5Y</b></span></div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--f2)">Digital Gold</span><span>₹200/mo → <b style="color:var(--p2)">₹15k 5Y</b></span></div><div style="display:flex;justify-content:space-between"><span style="color:var(--p2)">ELSS Tax Saver</span><span>₹500/mo → <b style="color:var(--p2)">₹48k 5Y</b></span></div></div><br>Total at ₹1,700/mo: <b style="color:var(--p2)">₹1.6L in 5 years</b>. Start new SIP?`},
  roast:{u:"🌶️ Roast my spending",a:`Oh you want this? 💀<br><br>₹4,820 on food delivery. <b>38% of income</b> going to other people cooking for you.<br><br>Spotify ₹119/mo — same <b>12 songs since September</b>. Peak choice.<br><br>One gym txn from August. <i>Just. The. One.</i> That ₹999 bought you one bicep curl and a selfie.<br><br>Good news? Portfolio up <b style="color:var(--p2)">12.4%</b>. Your money is smarter than you. 🤷`},
  budget:{u:"Make me a budget 💵",a:`Budget blueprint 📐<br><br><div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px;margin-top:6px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:var(--t2)">Income</span><span style="font-weight:700">₹8,000</span></div><div style="height:1px;background:rgba(255,255,255,.08);margin:4px 0 8px"></div><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="color:var(--p2)">🐷 Save (40%)</span><span style="font-weight:700">₹3,200</span></div><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="color:var(--v2)">📈 Invest (20%)</span><span style="font-weight:700">₹1,600</span></div><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="color:var(--c2)">🍕 Food (20%)</span><span style="font-weight:700">₹1,600</span></div><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="color:var(--f2)">🚕 Transport (10%)</span><span style="font-weight:700">₹800</span></div><div style="display:flex;justify-content:space-between"><span style="color:var(--n2)">🎯 Fun (10%)</span><span style="font-weight:700">₹800</span></div></div><br>The 40-20-20-10-10 rule. Auto-lock savings on payday?`},
};
const FALLBACK_REPLIES = [
  `Interesting 🌀<br><br>Your spending is <b>3x the category average</b> for your income bracket. But saving rate is <b style="color:var(--p2)">top 5%</b> among peers. Want a deep breakdown?`,
  `Based on your last 90 days — you're better at saving than spending wisely. The gap is <b style="color:var(--v2)">investment knowledge</b>. Want me to build a custom plan?`,
  `I've analyzed 847 profiles in your bracket. The ones ahead all did one thing: <b style="color:var(--p2)">automated savings before spending</b>. You're already doing that 💪`,
];

function Btn({children,onClick,className="",style={}}){return <button className={`btn ${className}`} style={style} onClick={onClick}>{children}</button>}

const TXNS = [
  {icon:"💼",bg:"rgba(16,185,129,.1)",name:"Internship Stipend",sub:"FinTech Startup · IMPS",amt:"+₹8,000",color:"var(--p2)",time:"09:14 AM",splittable:false},
  {icon:"🍕",bg:"rgba(244,114,182,.1)",name:"Swiggy — Domino's",sub:"Food · UPI",amt:"−₹342",color:"var(--r2)",time:"Yesterday",splittable:true},
  {icon:"📈",bg:"rgba(99,102,241,.1)",name:"SIP — Nifty 50",sub:"Auto-invest",amt:"−₹500",color:"var(--v2)",time:"Yesterday",splittable:false},
  {icon:"🎬",bg:"rgba(236,72,153,.1)",name:"PVR Cinemas",sub:"Entertainment · UPI",amt:"−₹780",color:"var(--r2)",time:"Nov 15",splittable:true},
  {icon:"🛒",bg:"rgba(245,158,11,.1)",name:"BigBasket Groceries",sub:"Groceries · Card",amt:"−₹1,240",color:"var(--r2)",time:"Nov 14",splittable:true},
  {icon:"⚡",bg:"rgba(245,158,11,.1)",name:"Challenge Reward",sub:"No-Spend Sunday Win 🏆",amt:"+50 XP",color:"var(--f2)",time:"Nov 13",splittable:false},
  {icon:"☕",bg:"rgba(16,185,129,.1)",name:"Third Wave Coffee",sub:"Food · UPI",amt:"−₹320",color:"var(--r2)",time:"Nov 12",splittable:true},
  {icon:"🚕",bg:"rgba(6,182,212,.1)",name:"Uber Ride",sub:"Transport · UPI",amt:"−₹185",color:"var(--r2)",time:"Nov 11",splittable:true},
  {icon:"📚",bg:"rgba(99,102,241,.1)",name:"Udemy Course",sub:"Learning · Card",amt:"−₹449",color:"var(--r2)",time:"Nov 10",splittable:false},
  {icon:"🍔",bg:"rgba(244,114,182,.1)",name:"Zomato — Burger King",sub:"Food · UPI",amt:"−₹562",color:"var(--r2)",time:"Nov 9",splittable:true},
];

const REWARDS_BRANDS = {
  shopping:[
    {name:"Comet Shoe",color:"#FF6B35",tagline:"Fresh kicks await"},
    {name:"BluOrange",color:"#2563EB",tagline:"Street meets style"},
    {name:"Gully Labs",color:"#7C3AED",tagline:"Lab-crafted fashion"},
    {name:"Urban Monkey",color:"#059669",tagline:"Bold. Unapologetic."},
  ],
  health:[
    {name:"CultFit",color:"#EF4444",tagline:"Train smarter",logo:"data:image/png;base64,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"},
    {name:"Cosmix Protein",color:"#EC4899",tagline:"Plant power blends",logo:"data:image/png;base64,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"},
    {name:"The Whole Truth",color:"#92400E",tagline:"No lies. Just bars.",logo:"data:image/png;base64,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"},
    {name:"Ultrahuman",color:"#1E293B",tagline:"Wearable metabolics",logo:"data:image/png;base64,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"},
  ],
  travel:[
    {name:"Airbnb",color:"#FF385C",tagline:"Stay anywhere"},
    {name:"Fora Travel",color:"#0EA5E9",tagline:"Curated escapes"},
    {name:"Decathlon",color:"#2563EB",tagline:"Gear up for less"},
    {name:"IndiaHikes",color:"#16A34A",tagline:"Trek the unknown"},
  ],
};

function BrandLogo({name,size=28}){
  const s=size;
  const logos={
    "Comet Shoe":<div style={{width:s,height:s,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:s*.35,fontFamily:"var(--mono)",color:"#FF6B35",letterSpacing:-1}}>☄️</div>,
    "BluOrange":<div style={{width:s,height:s,display:"flex",alignItems:"center",justifyContent:"center",gap:1}}><span style={{fontWeight:900,fontSize:s*.4,color:"#2563EB",fontFamily:"var(--mono)"}}>B</span><span style={{fontWeight:900,fontSize:s*.4,color:"#F97316",fontFamily:"var(--mono)"}}>O</span></div>,
    "Gully Labs":<div style={{width:s,height:s,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:s*.3,color:"#7C3AED",fontFamily:"var(--mono)",letterSpacing:-1,textTransform:"uppercase"}}>GL</div>,
    "Urban Monkey":<div style={{width:s,height:s,display:"flex",alignItems:"center",justifyContent:"center",fontSize:s*.65}}>🐵</div>,
    "CultFit":<div style={{width:s,height:s,borderRadius:4,background:"#EF4444",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:s*.28,color:"white",fontFamily:"var(--font)",letterSpacing:-.5}}>cult.</div>,
    "Cosmix Protein":<div style={{width:s,height:s,borderRadius:s/2,background:"linear-gradient(135deg,#EC4899,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:s*.24,color:"white",fontFamily:"var(--font)"}}>CX</div>,
    "The Whole Truth":<div style={{width:s,height:s,borderRadius:4,background:"#78350F",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:s*.25,color:"#FDE68A",fontFamily:"var(--mono)",letterSpacing:-.5}}>TWT</div>,
    "Ultrahuman":<div style={{width:s,height:s,borderRadius:s/2,border:"2px solid #94A3B8",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:s*.25,color:"#E2E8F0",fontFamily:"var(--mono)"}}>UH</div>,
    "Airbnb":<div style={{width:s,height:s,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width={s*.8} height={s*.8} viewBox="0 0 32 32"><path d="M16 4c-1.8 3.6-4.8 7.2-7.8 10.8C5.8 17.6 4 20 4 23a7.2 7.2 0 0012 5.4A7.2 7.2 0 0028 23c0-3-1.8-5.4-4.2-8.2C20.8 11.2 17.8 7.6 16 4z" fill="#FF385C"/></svg></div>,
    "Fora Travel":<div style={{width:s,height:s,borderRadius:s/2,background:"linear-gradient(135deg,#0EA5E9,#2563EB)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:s*.25,color:"white",fontFamily:"var(--font)"}}>FT</div>,
    "Decathlon":<div style={{width:s,height:s,borderRadius:s/2,background:"#0066CC",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width={s*.6} height={s*.6} viewBox="0 0 24 24"><path d="M4 12c0-5.5 3.6-10 8-10s8 4.5 8 10-3.6 10-8 10-8-4.5-8-10z" fill="none" stroke="white" strokeWidth="2"/><path d="M6 12h12" stroke="white" strokeWidth="1.5"/></svg></div>,
    "IndiaHikes":<div style={{width:s,height:s,borderRadius:4,background:"#16A34A",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width={s*.7} height={s*.7} viewBox="0 0 24 24"><path d="M2 22L9 6l5 8 3-5 5 13z" fill="white"/></svg></div>,
  };
  return logos[name]||<div style={{width:s,height:s,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:s*.35,fontFamily:"var(--mono)",color:"var(--t2)"}}>{name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>;
}

const LEADERBOARD = [
  {name:"Priya G.",steps:12400,avatar:"P",bg:"var(--gn)"},
  {name:"Aryan (You)",steps:10200,avatar:"A",bg:"var(--ga)",isYou:true},
  {name:"Riya S.",steps:9800,avatar:"R",bg:"var(--gv)"},
  {name:"Varun T.",steps:8400,avatar:"V",bg:"var(--gp)"},
  {name:"Karan M.",steps:7200,avatar:"K",bg:"#4A0080"},
  {name:"Sneha D.",steps:6800,avatar:"S",bg:"var(--gf)"},
  {name:"Rohit K.",steps:5400,avatar:"Ro",bg:"var(--gn)"},
  {name:"Meera P.",steps:4200,avatar:"M",bg:"var(--gv)"},
];

/* ─── SHARE OVERLAY ─── */
function IconWhatsApp(){return(
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
    <path d="M16.01 3C8.84 3 3.02 8.82 3.02 15.99c0 2.3.6 4.54 1.74 6.52L3 29l6.65-1.74A12.94 12.94 0 0016.01 29C23.18 29 29 23.18 29 16.01 29 8.82 23.18 3 16.01 3z" fill="#25D366"/>
    <path d="M23.06 19.26c-.37-.19-2.2-1.08-2.54-1.21-.34-.12-.59-.18-.84.19-.25.37-.96 1.21-1.18 1.46-.22.25-.43.28-.8.09-.37-.19-1.56-.58-2.97-1.84-1.1-.98-1.84-2.19-2.05-2.56-.22-.37-.02-.57.16-.75.17-.17.37-.43.56-.65.18-.22.25-.37.37-.62.12-.25.06-.47-.03-.65-.09-.19-.84-2.02-1.15-2.77-.3-.73-.61-.63-.84-.64h-.71c-.25 0-.65.09-.99.47-.34.37-1.3 1.27-1.3 3.1 0 1.83 1.33 3.6 1.52 3.84.19.25 2.62 4 6.35 5.61.89.38 1.58.61 2.12.78.89.28 1.7.24 2.34.15.71-.11 2.2-.9 2.51-1.77.31-.87.31-1.62.22-1.77-.09-.16-.34-.25-.71-.43z" fill="white"/>
  </svg>
)}
function IconInstagram(){return(
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
    <defs><linearGradient id="ig1" x1="2" y1="30" x2="30" y2="2"><stop offset="0%" stopColor="#feda75"/><stop offset="25%" stopColor="#fa7e1e"/><stop offset="50%" stopColor="#d62976"/><stop offset="75%" stopColor="#962fbf"/><stop offset="100%" stopColor="#4f5bd5"/></linearGradient></defs>
    <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#ig1)"/>
    <circle cx="16" cy="16" r="5.5" stroke="white" strokeWidth="2" fill="none"/>
    <circle cx="23" cy="9" r="1.5" fill="white"/>
    <rect x="5.5" y="5.5" width="21" height="21" rx="5.5" stroke="white" strokeWidth="2" fill="none"/>
  </svg>
)}
function IconX(){return(
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="14" fill="#000"/>
    <path d="M15.98 12.82L21.34 6.5h-1.27l-4.66 5.49L11.47 6.5H6.5l5.62 8.27L6.5 21.5h1.27l4.91-5.78 3.93 5.78H21.5l-5.52-8.68zm-1.74 2.04l-.57-.82L8.32 7.5h1.95l3.66 5.29.57.82 4.75 6.87h-1.95l-3.88-5.62z" fill="white"/>
  </svg>
)}
function IconMessages(){return(
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
    <rect x="2" y="2" width="28" height="28" rx="7" fill="#34C759"/>
    <path d="M16 8c-4.97 0-9 3.36-9 7.5 0 2.08 1.04 3.96 2.73 5.3L9 25l3.92-1.96c.98.28 2.02.46 3.08.46 4.97 0 9-3.36 9-7.5S20.97 8 16 8z" fill="white"/>
  </svg>
)}
function ShareOverlay({onClose, title="Share"}){
  const apps=[
    {name:"WhatsApp",Icon:IconWhatsApp,bg:"#25D366"},
    {name:"Instagram",Icon:IconInstagram,bg:"linear-gradient(135deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)"},
    {name:"X",Icon:IconX,bg:"#000000"},
    {name:"Messages",Icon:IconMessages,bg:"#34C759"},
  ];
  return(
    <div className="ov-bg" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()} style={{paddingBottom:44}}>
        <div className="drag"/>
        <div className="sheet-title">{title}</div>
        <div className="sheet-sub">Choose where to share</div>
        <div style={{display:"flex",justifyContent:"space-around",marginBottom:20}}>
          {apps.map(a=>(
            <div key={a.name} onClick={onClose} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer",transition:"transform .12s"}} onMouseDown={e=>e.currentTarget.style.transform="scale(.92)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              <div style={{width:58,height:58,borderRadius:16,background:"var(--card)",border:"1px solid var(--b2)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",boxShadow:`0 4px 16px ${typeof a.bg==="string"&&a.bg.startsWith("#")?a.bg+"33":"rgba(0,0,0,.3)"}`}}>
                <a.Icon/>
              </div>
              <span style={{fontSize:11,fontWeight:600,color:"var(--t2)"}}>{a.name}</span>
            </div>
          ))}
        </div>
        <Btn className="outline" onClick={onClose}>Cancel</Btn>
      </div>
    </div>
  );
}

/* ─── SPLIT OVERLAY ─── */
function SplitOverlay({onClose,txn,onShare}){
  const friends=[
    {name:"Priya",avatar:"P",bg:"var(--gn)"},
    {name:"Riya",avatar:"R",bg:"var(--gv)"},
    {name:"Varun",avatar:"V",bg:"var(--gp)"},
    {name:"Karan",avatar:"K",bg:"#4A0080"},
  ];
  const [selected,setSelected]=useState([0,1]);
  const amt=parseInt(txn?.amt?.replace(/[^0-9]/g,"")||"0");
  const splitAmt=Math.round(amt/(selected.length+1));
  return(
    <div className="ov-bg" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="drag"/>
        <div className="sheet-title">Split with Friends</div>
        <div className="sheet-sub">{txn?.name} · {txn?.amt}</div>
        <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
          {friends.map((f,i)=>(
            <div key={f.name} onClick={()=>setSelected(s=>s.includes(i)?s.filter(x=>x!==i):[...s,i])} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer"}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:f.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,border:selected.includes(i)?"3px solid var(--v)":"3px solid transparent",transition:"all .15s"}}>{f.avatar}</div>
              <span style={{fontSize:11,fontWeight:600,color:selected.includes(i)?"var(--v2)":"var(--t2)"}}>{f.name}</span>
            </div>
          ))}
        </div>
        <div style={{padding:16,background:"var(--card)",border:"1px solid var(--b)",borderRadius:20,marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:13,color:"var(--t2)"}}>Split between</span>
            <span style={{fontSize:13,fontWeight:700}}>{selected.length+1} people</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:13,color:"var(--t2)"}}>Each pays</span>
            <span style={{fontSize:18,fontWeight:700,color:"var(--p2)"}}>₹{splitAmt}</span>
          </div>
        </div>
        <Btn onClick={()=>{onClose();onShare?.();}}>Send Split Request →</Btn>
        <Btn className="outline" style={{marginTop:10}} onClick={onClose}>Cancel</Btn>
      </div>
    </div>
  );
}

/* ─── PULSE SCREEN ─── */
function ScreenPulse({nav,overlay,setOverlay}){
  const [splitTxn,setSplitTxn]=useState(null);
  return(
    <div className="sbody" style={{background:"radial-gradient(ellipse 80% 40% at 50% 0%,rgba(99,102,241,.18),transparent),var(--bg)"}}>
      {/* Logo + back area */}
      <div style={{padding:"4px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontFamily:"var(--serif)",fontSize:24,letterSpacing:3,background:"var(--gv)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>FLOW</div>
        <div onClick={()=>nav("profile")} style={{width:34,height:34,borderRadius:"50%",background:"var(--ga)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,cursor:"pointer"}}>A</div>
      </div>

      {/* ─── BIG ORB ─── */}
      <div onClick={()=>nav("oracle")} style={{position:"relative",width:"100%",height:340,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
        <div className="orb-outer"/>
        <div style={{width:230,height:230,borderRadius:"50%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div className="orb-r1"/><div className="orb-r2"/><div className="orb-r3"/>
          <div style={{fontFamily:"var(--serif)",fontSize:52,letterSpacing:-2,position:"relative",zIndex:1}}>₹24,800</div>
          <div style={{fontSize:13,color:"var(--t2)",fontWeight:500,position:"relative",zIndex:1,marginTop:4}}>Total Money Universe</div>
          <div style={{position:"relative",zIndex:1,marginTop:10}}><span className="pill pp" style={{fontSize:12,padding:"5px 14px"}}>▲ +₹8,000 today</span></div>
        </div>
        {/* Satellites — bigger */}
        {[
          {icon:"🐷",label:"Jars",val:"₹8.2k",color:"var(--p2)",bg:"rgba(16,185,129,.15)",border:"rgba(16,185,129,.3)",style:{top:10,left:14},tap:"jars"},
          {icon:"📈",label:"Invested",val:"₹6.6k",color:"var(--v2)",bg:"rgba(99,102,241,.15)",border:"rgba(99,102,241,.3)",style:{top:10,right:14},tap:"invested"},
          {icon:"💸",label:"Spendable",val:"₹6.8k",color:"var(--c2)",bg:"rgba(6,182,212,.15)",border:"rgba(6,182,212,.3)",style:{bottom:6,left:14},tap:null},
          {icon:"🔒",label:"Locked",val:"₹3.2k",color:"var(--f2)",bg:"rgba(245,158,11,.15)",border:"rgba(245,158,11,.3)",style:{bottom:6,right:14},tap:"locked"},
        ].map((s,i)=>(
          <div key={i} onClick={e=>{e.stopPropagation();if(s.tap)nav(s.tap);}} style={{position:"absolute",...s.style,cursor:s.tap?"pointer":"default"}}>
            <div style={{width:64,height:64,borderRadius:20,background:s.bg,border:`1.5px solid ${s.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0,boxShadow:`0 4px 16px ${s.border}`}}>{s.icon}</div>
            <div style={{fontSize:11,color:"var(--t2)",fontWeight:700,textAlign:"center",marginTop:4}}>{s.label}</div>
            <div style={{fontSize:15,fontWeight:700,color:s.color,textAlign:"center"}}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* ─── TRANSFER MONEY ─── */}
      <div onClick={()=>nav("transfer")} style={{margin:"0 20px 12px",padding:"14px 18px",background:"var(--card)",border:"1px solid var(--b2)",borderRadius:22,display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
        <div style={{width:44,height:44,borderRadius:16,background:"var(--gv)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(99,102,241,.35)"}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:700}}>Transfer Money</div>
          <div style={{fontSize:11,color:"var(--t2)",marginTop:2}}>UPI · IMPS · NEFT · RTGS</div>
        </div>
        <div style={{fontSize:18,color:"var(--t3)"}}>›</div>
      </div>

      {/* ─── VIBE STRIP ─── */}
      <div onClick={()=>nav("oracle")} style={{margin:"0 20px 12px",padding:"14px 16px",background:"var(--card)",border:"1px solid var(--b)",borderRadius:22,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
        <div style={{fontSize:24}}>😎</div>
        <div style={{flex:1,fontSize:13,color:"var(--t2)"}}><b style={{color:"var(--t)"}}>Flush today — stipend landed.</b> Oracle has 3 smart moves ready.</div>
        <div style={{padding:"7px 14px",background:"var(--gv)",borderRadius:14,fontSize:12,fontWeight:700,color:"white",whiteSpace:"nowrap"}}>Chat now</div>
      </div>

      {/* ─── LIFESTYLE BOOKMARKS ─── */}
      <div style={{margin:"0 20px 18px",padding:"14px 16px",background:"var(--card)",border:"1px solid var(--b)",borderRadius:22}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--t2)",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Your Lifestyle Bookmarks</div>
        <div style={{display:"flex",justifyContent:"space-around"}}>
          {[
            {name:"Zomato",src:"data:image/png;base64,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"},
            {name:"BookMyShow",src:"data:image/png;base64,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"},
            {name:"CultFit",src:"data:image/png;base64,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"},
            {name:"Amazon",src:"data:image/png;base64,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"},
          ].map(app=>(
            <div key={app.name} onClick={()=>{}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer"}}>
              <div style={{width:48,height:48,borderRadius:14,overflow:"hidden"}}><img src={app.src} width="48" height="48" style={{display:"block",objectFit:"cover"}}/></div>
              <span style={{fontSize:10,fontWeight:600,color:"var(--t2)"}}>{app.name}</span>
            </div>
          ))}
        </div>
      </div>

            {/* ─── SPEND ANALYSIS ─── */}
      <div className="sh"><span className="sh-t">This Month</span><span className="sh-l" onClick={()=>nav("analysis")}>Details →</span></div>
      <div style={{margin:"0 20px 20px",background:"linear-gradient(145deg,rgba(99,102,241,.08),rgba(236,72,153,.06))",border:"1px solid rgba(99,102,241,.15)",borderRadius:24,padding:18,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,background:"radial-gradient(circle,rgba(99,102,241,.12),transparent)",borderRadius:"50%"}}/>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
          <svg width="110" height="110" viewBox="0 0 110 110" style={{flexShrink:0}}>
            <circle cx="55" cy="55" r="42" fill="none" stroke="#1C2236" strokeWidth="14"/>
            <circle cx="55" cy="55" r="42" fill="none" stroke="#6366F1" strokeWidth="14" strokeDasharray="79 185" strokeDashoffset="24" strokeLinecap="round"/>
            <circle cx="55" cy="55" r="42" fill="none" stroke="#EC4899" strokeWidth="14" strokeDasharray="50 214" strokeDashoffset="-55" strokeLinecap="round"/>
            <circle cx="55" cy="55" r="42" fill="none" stroke="#F59E0B" strokeWidth="14" strokeDasharray="40 224" strokeDashoffset="-105" strokeLinecap="round"/>
            <circle cx="55" cy="55" r="42" fill="none" stroke="#10B981" strokeWidth="14" strokeDasharray="32 232" strokeDashoffset="-145" strokeLinecap="round"/>
            <text x="55" y="48" textAnchor="middle" fill="#34D399" fontSize="14" fontWeight="700" fontFamily="Space Mono">25%</text>
            <text x="55" y="60" textAnchor="middle" fill="#34D399" fontSize="8" fontWeight="600">lower ▼</text>
            <text x="55" y="72" textAnchor="middle" fill="#8892AA" fontSize="7">vs last month</text>
          </svg>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
            {[["#6366F1","Food","₹3,040","37%"],["#EC4899","Shopping","₹1,880","23%"],["#F59E0B","Transport","₹1,540","18%"],["#10B981","Learning","₹1,280","15%"],["#334155","Other","₹600","7%"]].map(([c,n,v,p])=>(
              <div key={n} style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:c,flexShrink:0,boxShadow:`0 0 6px ${c}44`}}/>
                <span style={{fontSize:12,color:"var(--t2)",flex:1}}>{n}</span>
                <span style={{fontSize:12,fontWeight:700}}>{v}</span>
                <span style={{fontSize:10,color:"var(--t3)",width:28,textAlign:"right"}}>{p}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <div style={{flex:1,padding:12,background:"rgba(16,185,129,.08)",borderRadius:16,textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:700,color:"var(--p2)"}}>₹6,660</div>
            <div style={{fontSize:10,color:"var(--t3)",marginTop:2}}>saved · 45% rate 🎉</div>
          </div>
          <div style={{flex:1,padding:12,background:"rgba(239,68,68,.08)",borderRadius:16,textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:700,color:"var(--r2)"}}>₹8,340</div>
            <div style={{fontSize:10,color:"var(--t3)",marginTop:2}}>spent · ▼ vs last mo</div>
          </div>
        </div>
      </div>

      {/* ─── TRANSACTIONS ─── */}
      <div className="sh"><span className="sh-t">Recent Transactions</span><span className="sh-l">See all</span></div>
      <div style={{padding:"0 20px 20px"}}>
        {TXNS.slice(0,5).map((tx,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid var(--b)",alignItems:"center"}}>
            <div style={{width:42,height:42,borderRadius:14,background:tx.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{tx.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:600}}>{tx.name}</div>
              <div style={{fontSize:11,color:"var(--t2)",marginTop:2}}>{tx.sub}</div>
              {tx.splittable && (
                <div onClick={()=>setSplitTxn(tx)} style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:5,padding:"3px 10px",borderRadius:10,background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.2)",cursor:"pointer",fontSize:11,fontWeight:700,color:"var(--v2)"}}>
                  ✂️ Split with friends
                </div>
              )}
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:15,fontWeight:700,color:tx.color}}>{tx.amt}</div>
              <div style={{fontSize:10,color:"var(--t3)",marginTop:2}}>{tx.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── ORACLE INSIGHTS (bottom) ─── */}
      <div className="sh"><span className="sh-t">Oracle Insights</span><span className="sh-l" onClick={()=>nav("oracle")}>Full chat →</span></div>
      <div style={{padding:"0 20px 24px",display:"flex",flexDirection:"column",gap:10}}>
        {[
          {type:"🔮 Prediction",text:"Food budget runs out by <b>Nov 22</b> at current Swiggy pace.",act:"Set food lock",bg:"rgba(99,102,241,.14)",bd:"rgba(99,102,241,.18)",tc:"var(--v2)",glyph:"🔮"},
          {type:"🎉 Milestone",text:"You hit <b>40% of your Goa goal</b>! Flights cheapest Dec 12.",act:"Book flight alert",bg:"rgba(16,185,129,.12)",bd:"rgba(16,185,129,.18)",tc:"var(--p2)",glyph:"✈️"},
          {type:"👥 Squad",text:"<b>4 friends</b> joined the No-Spend Weekend challenge.",act:"Join this weekend",bg:"rgba(236,72,153,.12)",bd:"rgba(236,72,153,.18)",tc:"var(--n2)",glyph:"⚡"},
        ].map((ins,i)=>(
          <div key={i} onClick={()=>nav("oracle")} style={{padding:15,borderRadius:20,cursor:"pointer",background:`linear-gradient(135deg,${ins.bg},rgba(0,0,0,0))`,border:`1px solid ${ins.bd}`,position:"relative",overflow:"hidden"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1.4,textTransform:"uppercase",marginBottom:7,color:ins.tc}}>{ins.type}</div>
            <div style={{fontSize:14,fontWeight:500,lineHeight:1.55,color:ins.tc}} dangerouslySetInnerHTML={{__html:ins.text}}/>
            <div style={{marginTop:9,fontSize:12,fontWeight:700,color:ins.tc}}>{ins.act} →</div>
            <div style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:38,opacity:.1}}>{ins.glyph}</div>
          </div>
        ))}
      </div>

      {/* Split overlay */}
      {splitTxn && <SplitOverlay txn={splitTxn} onClose={()=>setSplitTxn(null)} onShare={()=>setOverlay("share-split")}/>}
    </div>
  );
}

/* ─── ACCOUNT SERVICES ─── */
function ScreenServices({nav}){
  const [expanded,setExpanded]=useState({"acct":true,"products":false,"service":false,"digital":false});
  const toggle=k=>setExpanded(e=>({...e,[k]:!e[k]}));
  const sections=[
    {key:"acct",title:"Account Services",icon:"🏦",color:"#6366F1",items:[
      {icon:"📒",name:"Cheque Book",sub:"Request new cheque book",color:"#6366F1"},
      {icon:"📄",name:"Account Statement",sub:"Download PDF / Email",color:"#818CF8"},
      {icon:"💳",name:"Debit Card Services",sub:"Block, replace, set limits",color:"#A78BFA"},
      {icon:"✨",name:"Credit Card Request",sub:"Apply for a new credit card",color:"#C4B5FD"},
      {icon:"🔄",name:"Fund Transfer Limits",sub:"View & modify daily limits",color:"#6366F1"},
      {icon:"📱",name:"Manage Nominees",sub:"Add or update nominee",color:"#818CF8"},
    ]},
    {key:"products",title:"Additional Products",icon:"📦",color:"#10B981",items:[
      {icon:"💰",name:"Personal Loan",sub:"Pre-approved up to ₹5L",color:"#10B981",badge:"Pre-approved"},
      {icon:"🏠",name:"Home Loan",sub:"Rates starting 8.5% p.a.",color:"#34D399"},
      {icon:"🛡️",name:"Insurance",sub:"Life, health & motor",color:"#6EE7B7"},
      {icon:"📊",name:"Demat Account",sub:"Start investing in stocks",color:"#10B981"},
      {icon:"💎",name:"Fixed Deposit",sub:"Up to 7.5% p.a. returns",color:"#34D399"},
      {icon:"🪙",name:"Digital Gold",sub:"Buy 24K gold from ₹1",color:"#6EE7B7"},
    ]},
    {key:"service",title:"Service Requests",icon:"🔧",color:"#F59E0B",items:[
      {icon:"🚨",name:"Fraud & Dispute",sub:"Report unauthorized transaction",color:"#EF4444",badge:"Priority"},
      {icon:"✏️",name:"Name Change",sub:"Update name on account",color:"#F59E0B"},
      {icon:"📍",name:"Address Change",sub:"Update communication address",color:"#FBBF24"},
      {icon:"📞",name:"Mobile Number Update",sub:"Change registered mobile",color:"#F59E0B"},
      {icon:"📧",name:"Email Update",sub:"Change registered email",color:"#FBBF24"},
    ]},
    {key:"digital",title:"Digital & Security",icon:"🔒",color:"#06B6D4",items:[
      {icon:"🔑",name:"Change PIN",sub:"ATM & transaction PIN",color:"#06B6D4"},
      {icon:"🔐",name:"Enable/Disable UPI",sub:"Manage UPI access",color:"#22D3EE"},
      {icon:"📲",name:"Manage Devices",sub:"View logged-in devices",color:"#06B6D4"},
      {icon:"🌐",name:"Net Banking",sub:"Activate or reset password",color:"#22D3EE"},
    ]},
  ];
  return(
    <div className="sbody" style={{background:"var(--bg)"}}>
      {/* Header */}
      <div style={{padding:"6px 20px 16px"}}>
        <div style={{fontFamily:"var(--serif)",fontSize:26,marginBottom:2}}>Account</div>
        <div style={{fontSize:13,color:"var(--t2)"}}>Banking services & requests</div>
      </div>

      {/* Quick Actions */}
      <div className="hscroll" style={{padding:"0 20px",marginBottom:18}}>
        {[
          {icon:"📄",label:"Statement",color:"var(--v)"},
          {icon:"💳",label:"Card",color:"var(--n)"},
          {icon:"🚨",label:"Report Fraud",color:"var(--r)"},
          {icon:"🔑",label:"Reset PIN",color:"var(--c)"},
          {icon:"💰",label:"Loan",color:"var(--p)"},
        ].map(q=>(
          <div key={q.label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flexShrink:0,cursor:"pointer",minWidth:64}}>
            <div style={{width:48,height:48,borderRadius:16,background:`${q.color}18`,border:`1px solid ${q.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{q.icon}</div>
            <span style={{fontSize:10,fontWeight:600,color:"var(--t2)",textAlign:"center"}}>{q.label}</span>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div style={{padding:"0 20px 24px",display:"flex",flexDirection:"column",gap:12}}>
        {sections.map(sec=>(
          <div key={sec.key} style={{background:"var(--card)",border:"1px solid var(--b)",borderRadius:24,overflow:"hidden"}}>
            {/* Section header */}
            <div onClick={()=>toggle(sec.key)} style={{padding:"16px 18px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
              <div style={{width:40,height:40,borderRadius:14,background:`${sec.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{sec.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700}}>{sec.title}</div>
                <div style={{fontSize:11,color:"var(--t2)",marginTop:1}}>{sec.items.length} options</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" style={{transition:"transform .2s",transform:expanded[sec.key]?"rotate(180deg)":"rotate(0)"}}><path d="M6 8l4 4 4-4" stroke="var(--t3)" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
            </div>
            {/* Items */}
            {expanded[sec.key]&&(
              <div style={{borderTop:"1px solid var(--b)"}}>
                {sec.items.map((item,i)=>(
                  <div key={item.name} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:i<sec.items.length-1?"1px solid var(--b)":"none",cursor:"pointer",transition:"background .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--bg3)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <div style={{width:36,height:36,borderRadius:12,background:`${item.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{item.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                        {item.name}
                        {item.badge&&<span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:6,background:item.badge==="Priority"?"rgba(239,68,68,.15)":"rgba(16,185,129,.15)",color:item.badge==="Priority"?"var(--r2)":"var(--p2)"}}>{item.badge}</span>}
                      </div>
                      <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{item.sub}</div>
                    </div>
                    <span style={{fontSize:16,color:"var(--t3)"}}>›</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Help footer */}
      <div style={{padding:"0 20px 20px"}}>
        <div style={{padding:16,background:"linear-gradient(135deg,rgba(99,102,241,.08),rgba(236,72,153,.05))",border:"1px solid rgba(99,102,241,.15)",borderRadius:22,display:"flex",alignItems:"center",gap:14,cursor:"pointer"}} onClick={()=>nav("oracle")}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"var(--gv)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 0 16px rgba(99,102,241,.3)"}}>🌀</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700}}>Need help?</div>
            <div style={{fontSize:12,color:"var(--t2)",marginTop:1}}>Ask Flow AI about any banking service</div>
          </div>
          <div style={{padding:"6px 12px",background:"var(--gv)",borderRadius:12,fontSize:11,fontWeight:700,color:"white"}}>Chat</div>
        </div>
      </div>
    </div>
  );
}

/* ─── REWARDS SCREEN ─── */
function ScreenRewards({nav,setOverlay}){
  const [tab,setTab]=useState("health");
  const tabs=[["health","💪 Health"],["shopping","🛍️ Shopping"],["travel","✈️ Travel"]];
  return(
    <div className="sbody" style={{background:"radial-gradient(ellipse 80% 40% at 50% 0%,rgba(255,215,0,.1),transparent),var(--bg)"}}>
      <div className="hdr"><span className="hdr-title hdr-serif" style={{fontSize:24}}>Rewards</span></div>
      
      {/* Coin Hero */}
      <div style={{padding:"0 20px 20px",textAlign:"center"}}>
        <div onClick={()=>nav("rewards-detail")} style={{cursor:"pointer",position:"relative",width:120,height:120,margin:"0 auto 16px",animation:"coinFloat 3s ease-in-out infinite"}}>
          <div style={{width:120,height:120,borderRadius:"50%",background:"linear-gradient(145deg,#FFD700,#FFA500,#FF8C00)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 40px rgba(255,215,0,.4),inset 0 -4px 12px rgba(0,0,0,.2),inset 0 4px 12px rgba(255,255,255,.3)",animation:"pulse 2s ease-in-out infinite",position:"relative"}}>
            <div style={{fontSize:16,fontWeight:700,color:"#1a1a00",fontFamily:"var(--mono)",textAlign:"center",lineHeight:1.3}}>
              <div style={{fontSize:32}}>🪙</div>
              <div>SUPER</div>
            </div>
          </div>
          <div style={{position:"absolute",top:-4,right:-4,width:28,height:28,borderRadius:"50%",background:"var(--r)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,border:"2px solid var(--bg)"}}>→</div>
        </div>
        <div style={{fontFamily:"var(--mono)",fontSize:36,fontWeight:700,background:"var(--gg)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>15,000</div>
        <div style={{fontSize:13,color:"var(--t2)",marginTop:2}}>Super Coins Available</div>
        <div style={{marginTop:12}}>
          <Btn className="gold sm" style={{width:"auto",display:"inline-flex",padding:"10px 28px"}} onClick={()=>nav("rewards-detail")}>Redeem Now →</Btn>
        </div>
        <div style={{marginTop:12,padding:"8px 16px",background:"rgba(255,215,0,.08)",borderRadius:14,display:"inline-flex",alignItems:"center",gap:6,border:"1px solid rgba(255,215,0,.15)"}}>
          <span style={{fontSize:12,color:"var(--f2)"}}>🪙 1,000 coins = ₹500 voucher</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="hscroll" style={{padding:"0 20px",marginBottom:16}}>
        {tabs.map(([k,l])=>(
          <div key={k} onClick={()=>setTab(k)} style={{padding:"8px 18px",borderRadius:20,fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,border:"1px solid var(--b2)",transition:"all .15s",background:tab===k?"var(--gg)":"none",borderColor:tab===k?"transparent":"var(--b2)",color:tab===k?"#1a1a00":"var(--t2)"}}>{l}</div>
        ))}
      </div>

      {/* Brand Cards */}
      <div style={{padding:"0 20px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {REWARDS_BRANDS[tab]?.map(b=>(
            <div key={b.name} onClick={()=>nav("rewards-detail")} style={{background:"var(--card)",border:"1px solid var(--b)",borderRadius:22,padding:16,cursor:"pointer",position:"relative",overflow:"hidden",transition:"transform .15s"}}>
              <div style={{position:"absolute",top:-10,right:-10,width:60,height:60,background:`${b.color}15`,borderRadius:"50%"}}/>
              {b.logo
                ?<div style={{width:48,height:48,borderRadius:16,overflow:"hidden",marginBottom:10}}><img src={b.logo} width="48" height="48" style={{display:"block",objectFit:"cover"}}/></div>
                :<div style={{width:48,height:48,borderRadius:16,background:`${b.color}20`,border:`1px solid ${b.color}40`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><BrandLogo name={b.name} size={32}/></div>
              }
              <div style={{fontSize:14,fontWeight:700,marginBottom:3}}>{b.name}</div>
              <div style={{fontSize:11,color:"var(--t3)",marginBottom:10}}>{b.tagline}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:11,fontWeight:700,color:"var(--f2)"}}>🪙 1,000</span>
                <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8,background:"rgba(255,215,0,.15)",color:"var(--f2)"}}>₹500</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── REWARDS DETAIL ─── */
function ScreenRewardsDetail({nav,back}){
  return(
    <div className="sbody nonav">
      <div className="hdr"><div className="back-btn" onClick={back}>‹</div><span className="hdr-title hdr-serif">Redeem Rewards</span></div>
      <div style={{padding:"20px",textAlign:"center"}}>
        <div style={{fontSize:60,marginBottom:12}}>🪙</div>
        <div style={{fontFamily:"var(--mono)",fontSize:32,fontWeight:700,color:"var(--f2)"}}>15,000 Coins</div>
        <div style={{fontSize:13,color:"var(--t2)",marginTop:4,marginBottom:20}}>You can redeem up to 15 vouchers</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[...REWARDS_BRANDS.shopping,...REWARDS_BRANDS.health,...REWARDS_BRANDS.travel].slice(0,6).map(b=>(
            <div key={b.name} style={{display:"flex",alignItems:"center",gap:12,padding:14,background:"var(--card)",border:"1px solid var(--b)",borderRadius:18}}>
              {b.logo
                ?<div style={{width:44,height:44,borderRadius:14,overflow:"hidden"}}><img src={b.logo} width="44" height="44" style={{display:"block",objectFit:"cover"}}/></div>
                :<div style={{width:44,height:44,borderRadius:14,background:`${b.color}20`,display:"flex",alignItems:"center",justifyContent:"center"}}><BrandLogo name={b.name} size={28}/></div>
              }
              <div style={{flex:1,textAlign:"left"}}>
                <div style={{fontSize:14,fontWeight:700}}>{b.name}</div>
                <div style={{fontSize:11,color:"var(--t3)"}}>{b.tagline}</div>
              </div>
              <div style={{padding:"8px 14px",borderRadius:14,background:"var(--gg)",fontSize:12,fontWeight:700,color:"#1a1a00",cursor:"pointer"}}>Redeem</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── HEALTH / WALK SCREEN ─── */
function ScreenHealth({nav,setOverlay}){
  const todaySteps=7420;
  const goalSteps=10000;
  const pct=Math.round((todaySteps/goalSteps)*100);
  const [streak]=useState(18);
  const [showLb,setShowLb]=useState(false);
  
  return(
    <div className="sbody" style={{background:"radial-gradient(ellipse 80% 40% at 50% 0%,rgba(16,185,129,.15),transparent),var(--bg)"}}>
      <div className="hdr"><span className="hdr-title hdr-serif" style={{fontSize:24}}>Health Makes You Rich</span></div>

      {/* Hero */}
      <div style={{padding:"0 20px 20px",textAlign:"center"}}>
        <div style={{position:"relative",width:200,height:200,margin:"0 auto 16px"}}>
          <svg width="200" height="200" viewBox="0 0 200 200" style={{transform:"rotate(-90deg)"}}>
            <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="12"/>
            <circle cx="100" cy="100" r="85" fill="none" stroke="url(#stepGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${pct*5.34} ${534-pct*5.34}`}/>
            <defs><linearGradient id="stepGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#10B981"/><stop offset="100%" stopColor="#06B6D4"/></linearGradient></defs>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:14}}>🚶</div>
            <div style={{fontFamily:"var(--mono)",fontSize:38,fontWeight:700,color:"var(--p2)"}}>{todaySteps.toLocaleString()}</div>
            <div style={{fontSize:12,color:"var(--t2)"}}>/ {goalSteps.toLocaleString()} steps</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:16}}>
          <div style={{padding:"10px 18px",background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.2)",borderRadius:16,textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:700,color:"var(--p2)"}}>{streak}</div>
            <div style={{fontSize:10,color:"var(--t3)"}}>Day Streak 🔥</div>
          </div>
          <div style={{padding:"10px 18px",background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.2)",borderRadius:16,textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:700,color:"var(--v2)"}}>{pct}%</div>
            <div style={{fontSize:10,color:"var(--t3)"}}>Today's Goal</div>
          </div>
        </div>
      </div>

      {/* Walk & Earn Challenge */}
      <div style={{margin:"0 20px 20px",background:"linear-gradient(145deg,rgba(16,185,129,.1),rgba(6,182,212,.06))",border:"1px solid rgba(16,185,129,.2)",borderRadius:24,padding:18,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-10,right:-10,fontSize:60,opacity:.08}}>🏃</div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--p2)",marginBottom:8}}>🏆 Walk & Earn Challenge</div>
        <div style={{fontFamily:"var(--serif)",fontSize:22,marginBottom:6}}>10K Steps × 30 Days</div>
        <div style={{fontSize:13,color:"var(--t2)",lineHeight:1.6,marginBottom:14}}>Hit 10,000 steps every day for 30 days and earn <b style={{color:"var(--p2)"}}>5,000 reward points</b> (worth ₹2,500!)</div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{flex:1,height:8,background:"rgba(255,255,255,.06)",borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(streak/30)*100}%`,background:"var(--gp)",borderRadius:4,transition:"width .5s ease"}}/>
          </div>
          <span style={{fontSize:12,fontWeight:700,color:"var(--p2)"}}>{streak}/30 days</span>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:14}}>
          {Array.from({length:30},(_,i)=>(
            <div key={i} style={{width:16,height:16,borderRadius:4,background:i<streak?"var(--p)":i===streak?"var(--v4)":"rgba(255,255,255,.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:i<streak?"white":"var(--t3)"}}>{i<streak?"✓":""}</div>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn className="green sm" style={{flex:1}} onClick={()=>setOverlay("share-health")}>Share Progress 📤</Btn>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="sh">
        <span className="sh-t">Leaderboard · 30km</span>
        <span className="sh-l" onClick={()=>setShowLb(!showLb)}>{showLb?"Collapse":"Expand"}</span>
      </div>
      <div style={{padding:"0 20px",marginBottom:20}}>
        {LEADERBOARD.slice(0,showLb?8:4).map((p,i)=>(
          <div key={p.name} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:"1px solid var(--b)"}}>
            <div style={{width:24,fontFamily:"var(--mono)",fontSize:14,fontWeight:700,color:i===0?"var(--f2)":i===1?"var(--t2)":i===2?"#CD7F32":"var(--t3)",textAlign:"center"}}>
              {i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}
            </div>
            <div style={{width:36,height:36,borderRadius:"50%",background:p.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,border:p.isYou?"2px solid var(--v)":"none"}}>{p.avatar}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:p.isYou?700:600}}>{p.name}</div>
            </div>
            <div style={{fontSize:14,fontWeight:700,fontFamily:"var(--mono)",color:p.isYou?"var(--v2)":"var(--t)"}}>{p.steps.toLocaleString()}</div>
            <span style={{fontSize:10,color:"var(--t3)"}}>steps</span>
          </div>
        ))}
      </div>

      {/* Squad creation */}
      <div style={{margin:"0 20px 20px",padding:16,background:"var(--card)",border:"1px solid var(--b)",borderRadius:22}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>🏃 Create Your Squad</div>
        <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.6,marginBottom:14}}>Add friends, track steps together, and compete for weekly rewards. Top squad wins bonus coins!</div>
        <div style={{display:"flex",gap:8}}>
          <Btn className="sm" style={{flex:1}}>Create Squad</Btn>
          <Btn className="outline sm" style={{flex:1}} onClick={()=>setOverlay("share-health")}>Invite Friends</Btn>
        </div>
      </div>

      {/* Share leaderboard */}
      <div style={{padding:"0 20px 24px"}}>
        <Btn className="outline" onClick={()=>setOverlay("share-health")}>📤 Share Leaderboard Stats</Btn>
      </div>
    </div>
  );
}

/* ─── SQUAD SCREEN ─── */
function ScreenSquad({nav}){
  return(
    <div className="sbody" style={{background:"radial-gradient(ellipse 80% 40% at 20% 10%,rgba(236,72,153,.1),transparent),var(--bg)"}}>
      <div style={{padding:"16px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontFamily:"var(--serif)",fontSize:28}}>Money<br/><em style={{color:"var(--n2)"}}>Moves</em></div>
        <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.2)",borderRadius:20,fontSize:11,fontWeight:700,color:"var(--r2)"}}><span className="live-dot"/>3 live</div>
      </div>
      {/* Challenge */}
      <div style={{margin:"14px 20px",background:"linear-gradient(135deg,#1A0638,#260830,#081830)",border:"1px solid rgba(236,72,153,.2)",borderRadius:26,padding:18,cursor:"pointer",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:14,top:14,fontSize:44,opacity:.08}}>⚡</div>
        <div style={{fontSize:10,fontWeight:700,color:"var(--n2)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>🔥 Live · Ends Sunday</div>
        <div style={{fontSize:18,fontWeight:700,fontFamily:"var(--serif)",marginBottom:6}}>No-Spend Weekend Warrior</div>
        <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.5,marginBottom:14}}>Zero food delivery Sat–Sun. Fail = public shame post 😂</div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{flex:1,height:6,background:"rgba(255,255,255,.08)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:"60%",background:"var(--gn)",borderRadius:3}}/></div>
          <span style={{fontSize:11,fontWeight:700,color:"var(--n2)"}}>6/10 friends in</span>
        </div>
      </div>
      {/* Live feed */}
      <div className="sh"><span className="sh-t">Live Feed</span><span className="pill pn">● 3 active</span></div>
      <div style={{padding:"0 20px"}}>
        {[
          {av:"R",bg:"var(--gv)",name:"Riya Sharma",text:`Invested <b>₹1,000</b> in EV Smallcase 🚀`,tag:"Investing",tc:"pv",time:"2 min"},
          {av:"P",bg:"var(--gn)",name:"Priya G.",text:`Completed Tax Wizard 🎓 — found <b>₹3,200</b> refund!`,tag:"Learning",tc:"pf",time:"14 min"},
          {av:"V",bg:"var(--gp)",name:"Varun T.",text:`Saved <b>₹500</b> towards Manali trip 🏔️`,tag:"Saving",tc:"pp",time:"28 min"},
        ].map((a,i)=>(
          <div key={i} style={{padding:13,background:"var(--card)",border:"1px solid var(--b)",borderRadius:20,marginBottom:8}}>
            <div style={{display:"flex",gap:11,alignItems:"flex-start",marginBottom:8}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,flexShrink:0}}>{a.av}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{a.name}</div>
                <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.5}} dangerouslySetInnerHTML={{__html:a.text}}/>
              </div>
              <span className={`pill ${a.tc}`}>{a.tag}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:10,color:"var(--t3)"}}>{a.time} ago</span>
              <div style={{display:"flex",gap:8,flex:1}}>
                <div style={{padding:"4px 10px",borderRadius:12,background:"var(--card2)",border:"1px solid var(--b2)",fontSize:14,cursor:"pointer"}}>🔥</div>
                <div style={{padding:"4px 10px",borderRadius:12,background:"var(--card2)",border:"1px solid var(--b2)",fontSize:14,cursor:"pointer"}}>👏</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Groups */}
      <div className="sh" style={{marginTop:8}}><span className="sh-t">Groups</span><span className="sh-l">+ New</span></div>
      <div style={{padding:"0 20px 24px",display:"flex",flexDirection:"column",gap:8}}>
        {[{ic:"🏠",bg:"var(--gv)",nm:"PG Roomies",text:`Priya owes you <b style="color:var(--p2)">₹450</b>`},{ic:"✈️",bg:"var(--gn)",nm:"Goa Gang",text:`Trip fund <b style="color:var(--p2)">₹12,400</b> collected`}].map(g=>(
          <div key={g.nm} style={{padding:"12px 14px",background:"var(--card)",border:"1px solid var(--b)",borderRadius:18,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:g.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{g.ic}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{g.nm}</div><div style={{fontSize:12,color:"var(--t2)",marginTop:2}} dangerouslySetInnerHTML={{__html:g.text}}/></div>
            <div style={{fontSize:13,fontWeight:700,color:"var(--v2)"}}>View ›</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FLOW AI CHAT — GenZ Chatbot ─── */
function ScreenOracle({nav,back}){
  const [msgs,setMsgs]=useState([]);
  const [thinking,setThinking]=useState(false);
  const [showWelcome,setShowWelcome]=useState(true);
  const bodyRef=useRef(null);
  const inputRef=useRef(null);
  useEffect(()=>{if(bodyRef.current)bodyRef.current.scrollTop=bodyRef.current.scrollHeight;},[msgs,thinking]);

  const prompts=[
    {key:"save",icon:"💰",label:"Where can I save?",color:"var(--p2)",bg:"rgba(16,185,129,.12)",bd:"rgba(16,185,129,.25)"},
    {key:"trip",icon:"✈️",label:"Save for a trip",color:"var(--c2)",bg:"rgba(6,182,212,.12)",bd:"rgba(6,182,212,.25)"},
    {key:"invest",icon:"📈",label:"Investment planner",color:"var(--v2)",bg:"rgba(99,102,241,.12)",bd:"rgba(99,102,241,.25)"},
    {key:"spend",icon:"🔍",label:"Spend insights",color:"var(--n2)",bg:"rgba(236,72,153,.12)",bd:"rgba(236,72,153,.25)"},
    {key:"sip",icon:"📊",label:"SIP planner",color:"var(--f2)",bg:"rgba(245,158,11,.12)",bd:"rgba(245,158,11,.25)"},
    {key:"budget",icon:"💵",label:"Make me a budget",color:"var(--p2)",bg:"rgba(16,185,129,.12)",bd:"rgba(16,185,129,.25)"},
    {key:"roast",icon:"🌶️",label:"Roast my spending",color:"var(--r2)",bg:"rgba(239,68,68,.12)",bd:"rgba(239,68,68,.25)"},
  ];

  const addReply=useCallback((key)=>{
    const r=ORACLE_REPLIES[key];if(!r)return;
    setShowWelcome(false);
    if(r.u)setMsgs(m=>[...m,{role:"me",text:r.u}]);
    setThinking(true);
    setTimeout(()=>{setThinking(false);setMsgs(m=>[...m,{role:"ai",text:r.a,chips:prompts.filter(p=>p.key!==key).slice(0,3).map(p=>p.key)}]);},1200);
  },[]);

  const send=useCallback(()=>{
    const txt=inputRef.current?.innerText?.trim();if(!txt)return;
    if(inputRef.current)inputRef.current.innerText="";
    setShowWelcome(false);
    setMsgs(m=>[...m,{role:"me",text:txt}]);
    setThinking(true);
    setTimeout(()=>{setThinking(false);setMsgs(m=>[...m,{role:"ai",text:FALLBACK_REPLIES[Math.floor(Math.random()*3)],chips:["save","invest","spend"]}]);},1100);
  },[]);

  const chipMap=Object.fromEntries(prompts.map(p=>[p.key,{icon:p.icon,label:p.label,color:p.color,bg:p.bg,bd:p.bd}]));

  return(
    <>
      {/* Header */}
      <div style={{padding:"42px 20px 10px",display:"flex",alignItems:"center",gap:12,flexShrink:0,borderBottom:"1px solid var(--b)",background:"linear-gradient(180deg,var(--bg),rgba(99,102,241,.03))"}}>
        <div className="back-btn" onClick={back}>‹</div>
        <div style={{position:"relative"}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"var(--gv)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 0 24px rgba(99,102,241,.5),0 0 48px rgba(99,102,241,.15)"}}>🌀</div>
          <div style={{position:"absolute",bottom:0,right:0,width:12,height:12,borderRadius:"50%",background:"var(--p)",border:"2.5px solid var(--bg)",boxShadow:"0 0 6px var(--p)"}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:17,fontWeight:700,fontFamily:"var(--serif)",letterSpacing:.3}}>Flow AI</div>
          <div style={{fontSize:11,color:"var(--p2)",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"var(--p)",display:"inline-block",animation:"idp 2s ease-in-out infinite"}}/>
            Always on · Encrypted
          </div>
        </div>
      </div>

      {/* Body */}
      <div ref={bodyRef} style={{flex:1,overflowY:"auto",padding:0,display:"flex",flexDirection:"column",scrollbarWidth:"none",background:"radial-gradient(ellipse 100% 50% at 50% 100%,rgba(99,102,241,.05),transparent)"}}>

        {/* ── Welcome state ── */}
        {showWelcome&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 16px 8px",animation:"msgin .4s ease"}}>
            {/* Glowing orb */}
            <div style={{position:"relative",width:80,height:80,marginBottom:14}}>
              <div style={{width:80,height:80,borderRadius:"50%",background:"radial-gradient(circle at 40% 35%,rgba(99,102,241,.4),rgba(99,102,241,.06) 65%,transparent)",display:"flex",alignItems:"center",justifyContent:"center",animation:"walkPulse 3s ease-in-out infinite"}}>
                <div style={{width:50,height:50,borderRadius:"50%",background:"var(--gv)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:"0 0 30px rgba(99,102,241,.5)"}}>🌀</div>
              </div>
              <div style={{position:"absolute",inset:-6,borderRadius:"50%",border:"1px solid rgba(99,102,241,.12)",animation:"spin 20s linear infinite"}}/>
            </div>
            <div style={{fontFamily:"var(--serif)",fontSize:20,marginBottom:2}}>Hey Aryan 👋</div>
            <div style={{fontSize:12,color:"var(--t2)",textAlign:"center",lineHeight:1.5,marginBottom:14,maxWidth:260}}>
              Your money bestie. Ask anything — no judgment, just vibes.
            </div>

            {/* Prompt bubbles */}
            <div style={{width:"100%",display:"flex",flexDirection:"column",gap:6}}>
              {prompts.map((p,i)=>(
                <div key={p.key} onClick={()=>addReply(p.key)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:p.bg,border:`1px solid ${p.bd}`,borderRadius:16,cursor:"pointer",transition:"all .2s",animation:`msgin .35s ease ${i*.08}s both`,position:"relative",overflow:"hidden"}}>
                  <div style={{width:32,height:32,borderRadius:10,background:"rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{p.icon}</div>
                  <span style={{fontSize:13,fontWeight:600,color:p.color,flex:1}}>{p.label}</span>
                  <span style={{fontSize:14,color:"var(--t3)",flexShrink:0}}>→</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Messages ── */}
        {!showWelcome&&(
          <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:14,flex:1}}>
            <div style={{textAlign:"center",marginBottom:2}}><span style={{fontSize:10,color:"var(--t3)",background:"var(--bg3)",padding:"3px 12px",borderRadius:10}}>Today · Encrypted 🔒</span></div>
            {msgs.map((m,i)=>(
              <div key={i} className="msg-in" style={{display:"flex",gap:9,flexDirection:m.role==="me"?"row-reverse":"row",alignItems:"flex-end"}}>
                {m.role==="ai"&&<div style={{width:28,height:28,borderRadius:"50%",background:"var(--gv)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,boxShadow:"0 0 10px rgba(99,102,241,.3)"}}>🌀</div>}
                <div style={{maxWidth:280}}>
                  <div style={{padding:"12px 15px",borderRadius:22,fontSize:14,lineHeight:1.6,background:m.role==="me"?"var(--gv)":"var(--card2)",border:m.role==="me"?"none":"1px solid var(--b2)",color:"white",borderBottomLeftRadius:m.role==="ai"?6:22,borderBottomRightRadius:m.role==="me"?6:22,boxShadow:m.role==="me"?"0 4px 14px rgba(99,102,241,.2)":"none"}} dangerouslySetInnerHTML={{__html:m.text}}/>
                  {m.chips&&(
                    <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                      {m.chips.map(k=>{const c=chipMap[k];if(!c)return null;return(
                        <div key={k} onClick={()=>addReply(k)} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 11px",borderRadius:14,background:c.bg,border:`1px solid ${c.bd}`,cursor:"pointer",fontSize:12,fontWeight:600,color:c.color,transition:"all .15s"}}>
                          <span>{c.icon}</span>{c.label}
                        </div>
                      );})}
                    </div>
                  )}
                  <div style={{fontSize:10,color:"var(--t3)",marginTop:4,textAlign:m.role==="me"?"right":"left"}}>{m.role==="ai"?"Flow AI":"You"} · just now</div>
                </div>
              </div>
            ))}
            {thinking&&(
              <div className="msg-in" style={{display:"flex",gap:9,alignItems:"flex-end"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"var(--gv)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:"0 0 10px rgba(99,102,241,.3)"}}>🌀</div>
                <div style={{padding:"14px 18px",background:"var(--card2)",border:"1px solid var(--b2)",borderRadius:22,borderBottomLeftRadius:6}}>
                  <div style={{display:"flex",gap:5}}><div className="td"/><div className="td"/><div className="td"/></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick actions — after first message */}
      {!showWelcome&&(
        <div className="hscroll" style={{padding:"6px 16px",flexShrink:0,borderTop:"1px solid var(--b)"}}>
          {prompts.map(p=>(
            <div key={p.key} onClick={()=>addReply(p.key)} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 11px",borderRadius:14,background:p.bg,border:`1px solid ${p.bd}`,cursor:"pointer",flexShrink:0,fontSize:11,fontWeight:600,color:p.color,whiteSpace:"nowrap"}}>
              {p.icon} {p.label}
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{padding:"10px 16px 20px",background:"var(--bg)",flexShrink:0}}>
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <div style={{flex:1,position:"relative"}}>
            <div ref={inputRef} contentEditable suppressContentEditableWarning
              onFocus={()=>setShowWelcome(false)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
              style={{background:"var(--card2)",border:"1px solid var(--b2)",borderRadius:22,padding:"10px 48px 10px 16px",fontSize:14,color:"var(--t)",fontFamily:"var(--font)",minHeight:44,outline:"none",maxHeight:110,overflowY:"auto"}}
              data-placeholder="Ask me anything..."
            />
            <div style={{position:"absolute",right:5,bottom:5}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"var(--card3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer"}}>🎙️</div>
            </div>
          </div>
          <button onClick={send} style={{width:44,height:44,borderRadius:"50%",background:"var(--gv)",border:"none",cursor:"pointer",fontSize:18,color:"white",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(99,102,241,.5)",flexShrink:0}}>↑</button>
        </div>
        <div style={{textAlign:"center",marginTop:4,marginBottom:2}}>
          <span style={{fontSize:9,color:"var(--t3)"}}>🔒 Private · Powered by Flow AI</span>
        </div>
      </div>
    </>
  );
}

/* ─── ANALYSIS ─── */
function ScreenAnalysis({nav,back}){
  const [expanded,setExpanded]=useState("Food");
  const categories=[
    {name:"Food",icon:"🍕",color:"#6366F1",total:"₹3,040",pct:"37%",w:67,merchants:[
      {name:"Swiggy",icon:"🟠",amt:"₹1,420",txns:"12 orders",color:"#FF6B00"},
      {name:"Zomato",icon:"🔴",amt:"₹980",txns:"8 orders",color:"#E23744"},
      {name:"Big Chill Cafe",icon:"☕",amt:"₹640",txns:"3 visits",color:"#8B4513"},
    ]},
    {name:"Shopping",icon:"🛍️",color:"#EC4899",total:"₹1,880",pct:"23%",w:41,merchants:[
      {name:"Myntra",icon:"👗",amt:"₹820",txns:"2 orders",color:"#FF3F6C"},
      {name:"H&M",icon:"🏷️",amt:"₹650",txns:"1 visit",color:"#E50010"},
      {name:"Comet",icon:"👟",amt:"₹410",txns:"1 pair",color:"#FF6B35"},
    ]},
    {name:"Transport",icon:"🚗",color:"#F59E0B",total:"₹1,540",pct:"18%",w:34,merchants:[
      {name:"Delhi Metro",icon:"🚇",amt:"₹840",txns:"28 rides",color:"#0066B3"},
      {name:"Uber",icon:"🚕",amt:"₹700",txns:"6 rides",color:"#000000"},
    ]},
    {name:"Learning",icon:"📚",color:"#10B981",total:"₹1,280",pct:"15%",w:28,merchants:[
      {name:"Udemy",icon:"📖",amt:"₹1,280",txns:"2 courses",color:"#A435F0"},
    ]},
    {name:"Others",icon:"🎮",color:"#64748B",total:"₹600",pct:"7%",w:13,merchants:[
      {name:"Spotify",icon:"🎵",amt:"₹119",txns:"subscription",color:"#1DB954"},
      {name:"Netflix",icon:"🎬",amt:"₹199",txns:"subscription",color:"#E50914"},
      {name:"Hotstar",icon:"⭐",amt:"₹149",txns:"subscription",color:"#0C56A5"},
      {name:"Gym",icon:"💪",amt:"₹133",txns:"monthly",color:"#EF4444"},
    ]},
  ];
  return(
    <div className="sbody nonav">
      <div className="hdr"><div className="back-btn" onClick={back}>‹</div><span className="hdr-title hdr-serif">Spend Breakdown</span></div>
      {/* Summary */}
      <div style={{padding:"0 20px 16px"}}>
        <div style={{display:"flex",gap:10,marginBottom:16}}>
          <div style={{flex:1,padding:14,background:"rgba(16,185,129,.08)",borderRadius:18,textAlign:"center",border:"1px solid rgba(16,185,129,.15)"}}>
            <div style={{fontSize:22,fontWeight:700,color:"var(--p2)"}}>25% ▼</div>
            <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>less than last month</div>
          </div>
          <div style={{flex:1,padding:14,background:"rgba(239,68,68,.06)",borderRadius:18,textAlign:"center",border:"1px solid rgba(239,68,68,.1)"}}>
            <div style={{fontSize:22,fontWeight:700,color:"var(--r2)"}}>₹8,340</div>
            <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>total spent · Nov</div>
          </div>
        </div>
      </div>
      {/* Categories with merchant drill-down */}
      <div style={{padding:"0 20px 28px",display:"flex",flexDirection:"column",gap:10}}>
        {categories.map(cat=>(
          <div key={cat.name} onClick={()=>setExpanded(expanded===cat.name?null:cat.name)} style={{background:"var(--card)",border:"1px solid var(--b)",borderRadius:22,overflow:"hidden",cursor:"pointer"}}>
            <div style={{padding:16}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                <div style={{width:42,height:42,borderRadius:14,background:`${cat.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{cat.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700}}>{cat.name}</div>
                  <div style={{fontSize:11,color:"var(--t2)"}}>{cat.merchants.length} merchants</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:17,fontWeight:700}}>{cat.total}</div>
                  <div style={{fontSize:11,color:"var(--t2)"}}>{cat.pct}</div>
                </div>
                <span style={{fontSize:16,color:"var(--t3)",transition:"transform .2s",transform:expanded===cat.name?"rotate(90deg)":"rotate(0)"}}>›</span>
              </div>
              <div style={{height:4,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${cat.w}%`,background:cat.color,borderRadius:2}}/>
              </div>
            </div>
            {expanded===cat.name&&(
              <div style={{borderTop:"1px solid var(--b)",background:"var(--bg3)"}}>
                {cat.merchants.map((m,i)=>(
                  <div key={m.name} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<cat.merchants.length-1?"1px solid var(--b)":"none"}}>
                    <div style={{width:34,height:34,borderRadius:10,background:`${m.color}20`,border:`1px solid ${m.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{m.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700}}>{m.name}</div>
                      <div style={{fontSize:11,color:"var(--t3)",marginTop:1}}>{m.txns}</div>
                    </div>
                    <div style={{fontSize:14,fontWeight:700}}>{m.amt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── LOCKED SCREEN ─── */
function ScreenLocked({nav,back}){
  const [minLock,setMinLock]=useState(3200);
  const maxLock=10000;
  return(
    <div className="sbody nonav">
      <div className="hdr"><div className="back-btn" onClick={back}>‹</div><span className="hdr-title hdr-serif">Locked Funds</span></div>
      <div style={{padding:"20px",textAlign:"center",background:"radial-gradient(ellipse 80% 50% at 50% 0%,rgba(245,158,11,.1),transparent)"}}>
        <div style={{fontSize:56,marginBottom:12}}>🔒</div>
        <div style={{fontFamily:"var(--mono)",fontSize:38,fontWeight:700,color:"var(--f2)"}}>₹{minLock.toLocaleString("en-IN")}</div>
        <div style={{fontSize:13,color:"var(--t2)",marginTop:4}}>Emergency fund · Blocked for transactions</div>
      </div>
      {/* Slider */}
      <div style={{padding:"20px 20px 0"}}>
        <div style={{fontSize:12,fontWeight:700,color:"var(--t2)",letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>Min. Emergency Fund Lock</div>
        <div style={{padding:20,background:"var(--card)",border:"1px solid var(--b)",borderRadius:22}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:"var(--t3)"}}>₹0</span>
            <span style={{fontSize:14,fontWeight:700,color:"var(--f2)"}}>₹{minLock.toLocaleString("en-IN")}</span>
            <span style={{fontSize:12,color:"var(--t3)"}}>₹{maxLock.toLocaleString("en-IN")}</span>
          </div>
          <input type="range" min={0} max={maxLock} step={500} value={minLock} onChange={e=>setMinLock(+e.target.value)} style={{width:"100%",height:8,borderRadius:4,appearance:"none",WebkitAppearance:"none",background:`linear-gradient(90deg,var(--f) ${(minLock/maxLock)*100}%,rgba(255,255,255,.08) ${(minLock/maxLock)*100}%)`,outline:"none",cursor:"pointer"}}/>
          <div style={{fontSize:12,color:"var(--t2)",marginTop:12,lineHeight:1.6}}>
            This amount is <b style={{color:"var(--f2)"}}>blocked from all transactions</b>. You can't spend below this balance — keeping your emergency fund safe.
          </div>
        </div>
      </div>
      {/* Info cards */}
      <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:10}}>
        <div style={{padding:14,background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.15)",borderRadius:18}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:"var(--t2)"}}>Days of expenses covered</span>
            <span style={{fontSize:14,fontWeight:700,color:"var(--f2)"}}>{Math.round(minLock/550)} days</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:12,color:"var(--t2)"}}>Goal: 90 days safety net</span>
            <span style={{fontSize:12,fontWeight:700,color:"var(--t3)"}}>{Math.round((minLock/550)/90*100)}%</span>
          </div>
        </div>
        <div style={{padding:14,background:"var(--card)",border:"1px solid var(--b)",borderRadius:18}}>
          <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.6}}>
            💡 Locked funds earn <b style={{color:"var(--p2)"}}>6.5% p.a.</b> in a liquid fund — accessible in emergencies but protected from impulse spending.
          </div>
        </div>
      </div>
      <div style={{padding:"12px 20px 28px"}}>
        <Btn className="gold" onClick={back}>Save Lock Amount ✓</Btn>
      </div>
    </div>
  );
}

/* ─── PROFILE ─── */
function ScreenProfile({nav,back}){
  return(
    <div className="sbody nonav">
      <div className="hdr"><div className="back-btn" onClick={back}>‹</div><span className="hdr-title">Profile</span><span className="hdr-action">Edit</span></div>
      <div style={{padding:"28px 20px 20px",textAlign:"center",background:"radial-gradient(ellipse 80% 60% at 50% 0%,rgba(99,102,241,.12),transparent)"}}>
        <div style={{width:84,height:84,borderRadius:"50%",background:"var(--ga)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,fontWeight:700,margin:"0 auto 12px",boxShadow:"0 0 40px rgba(99,102,241,.3)"}}>A</div>
        <div style={{fontFamily:"var(--serif)",fontSize:26,marginBottom:4}}>Aryan Sharma</div>
        <div style={{fontSize:13,color:"var(--v2)",fontFamily:"var(--mono)",marginBottom:14}}>@aryan@hdfcu</div>
        <div style={{display:"flex",gap:8,justifyContent:"center"}}><span className="pill pv">Level 4 · Money Mover</span><span className="pill pf">🔥 12 day streak</span></div>
      </div>
      <div style={{display:"flex",background:"var(--card)",border:"1px solid var(--b)",borderRadius:20,overflow:"hidden",margin:"0 20px 20px"}}>
        {[["₹24,830","var(--p2)","Net Worth"],["🪙 15k","var(--f2)","Super Coins"],["648","var(--v2)","CIBIL"],["45%","var(--t)","Save Rate"]].map(([v,c,l])=>(
          <div key={l} style={{flex:1,padding:14,textAlign:"center",borderRight:"1px solid var(--b)"}}>
            <div style={{fontSize:18,fontWeight:700,color:c}}>{v}</div>
            <div style={{fontSize:10,color:"var(--t3)",marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{padding:"0 20px 32px"}}><Btn className="outline">Sign Out</Btn></div>
    </div>
  );
}


/* ─── JARS (Savings Goals) ─── */
function ScreenJars({nav,back}){
  const jars=[
    {emoji:"✈️",name:"Goa Trip Fund",target:10000,saved:3200,color:"#06B6D4",grad:"var(--gp)"},
    {emoji:"👟",name:"Yeezy's",target:15000,saved:2400,color:"#EC4899",grad:"var(--gn)"},
    {emoji:"🎓",name:"Course Fund",target:5000,saved:1200,color:"#10B981",grad:"var(--gp)"},
    {emoji:"🛡️",name:"Emergency Fund",target:20000,saved:900,color:"#6366F1",grad:"var(--gv)"},
    {emoji:"🎮",name:"PS5 Fund",target:50000,saved:500,color:"#F59E0B",grad:"var(--gf)"},
  ];
  return(
    <div className="sbody nonav">
      <div className="hdr"><div className="back-btn" onClick={back}>‹</div><span className="hdr-title hdr-serif">My Jars</span></div>
      <div style={{padding:"0 20px 8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:16,background:"linear-gradient(135deg,rgba(16,185,129,.1),rgba(6,182,212,.06))",border:"1px solid rgba(16,185,129,.2)",borderRadius:22,marginBottom:16}}>
          <div style={{fontSize:32}}>🐷</div>
          <div style={{flex:1}}>
            <div style={{fontSize:12,color:"var(--t2)"}}>Total Saved in Jars</div>
            <div style={{fontSize:28,fontWeight:700,fontFamily:"var(--mono)",color:"var(--p2)"}}>₹{jars.reduce((a,j)=>a+j.saved,0).toLocaleString("en-IN")}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:12,color:"var(--t2)"}}>{jars.length} jars</div>
            <div style={{fontSize:12,fontWeight:700,color:"var(--p2)"}}>{jars.filter(j=>j.saved>=j.target).length} complete</div>
          </div>
        </div>
      </div>
      <div style={{padding:"0 20px 28px",display:"flex",flexDirection:"column",gap:12}}>
        {jars.map(j=>{
          const pct=Math.min(100,Math.round((j.saved/j.target)*100));
          const done=j.saved>=j.target;
          return(
            <div key={j.name} style={{background:"var(--card)",border:"1px solid var(--b)",borderRadius:22,padding:16,position:"relative",overflow:"hidden"}}>
              {done&&<div style={{position:"absolute",top:12,right:12,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:10,background:"rgba(16,185,129,.15)",color:"var(--p2)"}}>✓ Complete</div>}
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                <div style={{width:50,height:50,borderRadius:16,background:`${j.color}18`,border:`1px solid ${j.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{j.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700}}>{j.name}</div>
                  <div style={{fontSize:12,color:"var(--t2)",marginTop:2}}>Target: ₹{j.target.toLocaleString("en-IN")}</div>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{marginBottom:10}}>
                <div style={{height:10,background:"rgba(255,255,255,.06)",borderRadius:5,overflow:"hidden",position:"relative"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:j.grad,borderRadius:5,transition:"width .6s ease"}}/>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <span style={{fontSize:18,fontWeight:700,fontFamily:"var(--mono)",color:done?"var(--p2)":"var(--t)"}}>₹{j.saved.toLocaleString("en-IN")}</span>
                  <span style={{fontSize:12,color:"var(--t3)",marginLeft:6}}>saved</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:13,fontWeight:700,color:done?"var(--p2)":"var(--t2)"}}>{pct}%</span>
                  {!done&&<span style={{fontSize:11,color:"var(--t3)"}}>₹{(j.target-j.saved).toLocaleString("en-IN")} to go</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div style={{padding:14,border:"2px dashed var(--b2)",borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",color:"var(--v2)",fontSize:14,fontWeight:700}}>
          + Create New Jar
        </div>
      </div>
    </div>
  );
}

/* ─── INVESTED ─── */
function ScreenInvested({nav,back}){
  const holdings=[
    {icon:"📊",name:"Mutual Funds",sub:"3 SIPs active",value:"₹3,840",ret:"+12.4%",retColor:"var(--p2)",color:"#6366F1",pct:42,items:[
      {name:"Nifty 50 Index ETF",sip:"₹500/mo",val:"₹2,840",ret:"+8.2%"},
      {name:"ELSS Tax Saver",sip:"₹500/mo",val:"₹600",ret:"+4.1%"},
      {name:"Flexi Cap Growth",sip:"₹200/mo",val:"₹400",ret:"+6.8%"},
    ]},
    {icon:"🏦",name:"Fixed Deposits",sub:"1 active FD",value:"₹1,200",ret:"+7.1%",retColor:"var(--p2)",color:"#F59E0B",pct:22,items:[
      {name:"HDFC FD — 1 Year",sip:"Lump sum",val:"₹1,200",ret:"+7.1% p.a."},
    ]},
    {icon:"🥇",name:"Digital Gold",sub:"Auto-buy active",value:"₹1,560",ret:"+4.1%",retColor:"var(--p2)",color:"#FFD700",pct:20,items:[
      {name:"24K Digital Gold",sip:"Round-ups",val:"₹1,560",ret:"+4.1%"},
    ]},
  ];
  const [expanded,setExpanded]=useState(null);
  const total=6600;
  return(
    <div className="sbody nonav">
      <div className="hdr"><div className="back-btn" onClick={back}>‹</div><span className="hdr-title hdr-serif">Invested</span></div>
      {/* Hero */}
      <div style={{padding:"0 20px 16px",textAlign:"center"}}>
        <div style={{fontSize:40,fontWeight:400,fontFamily:"var(--serif)",background:"var(--gp)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:-1}}>₹{total.toLocaleString("en-IN")}</div>
        <div style={{fontSize:12,color:"var(--t2)",marginTop:2}}>Total Invested · 5 instruments</div>
        <div style={{display:"inline-flex",alignItems:"center",marginTop:8,padding:"6px 14px",background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.2)",borderRadius:16}}>
          <span style={{fontSize:13,fontWeight:700,color:"var(--p2)"}}>▲ +₹712 all-time · +12.1%</span>
        </div>
      </div>
      {/* Allocation donut mini */}
      <div style={{display:"flex",gap:8,padding:"0 20px",marginBottom:16}}>
        {holdings.map(h=>(
          <div key={h.name} style={{flex:1,padding:12,background:"var(--card)",border:"1px solid var(--b)",borderRadius:16,textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:4}}>{h.icon}</div>
            <div style={{fontSize:11,fontWeight:700,color:"var(--t)"}}>{h.value}</div>
            <div style={{fontSize:10,color:"var(--t3)",marginTop:1}}>{h.pct}%</div>
          </div>
        ))}
      </div>
      {/* Holdings */}
      <div style={{padding:"0 20px 28px",display:"flex",flexDirection:"column",gap:10}}>
        {holdings.map(h=>(
          <div key={h.name} onClick={()=>setExpanded(expanded===h.name?null:h.name)} style={{background:"var(--card)",border:"1px solid var(--b)",borderRadius:22,overflow:"hidden",cursor:"pointer"}}>
            <div style={{padding:16,display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:48,height:48,borderRadius:16,background:`${h.color}18`,border:`1px solid ${h.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{h.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700}}>{h.name}</div>
                <div style={{fontSize:12,color:"var(--t2)",marginTop:2}}>{h.sub}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:17,fontWeight:700}}>{h.value}</div>
                <div style={{fontSize:12,fontWeight:700,color:h.retColor,marginTop:2}}>{h.ret}</div>
              </div>
              <span style={{fontSize:16,color:"var(--t3)",transition:"transform .2s",transform:expanded===h.name?"rotate(90deg)":"rotate(0)"}}>›</span>
            </div>
            {/* Progress bar */}
            <div style={{padding:"0 16px 12px"}}>
              <div style={{height:4,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${h.pct}%`,background:h.color,borderRadius:2}}/>
              </div>
            </div>
            {/* Expanded items */}
            {expanded===h.name&&(
              <div style={{borderTop:"1px solid var(--b)",background:"var(--bg3)"}}>
                {h.items.map((it,i)=>(
                  <div key={it.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:i<h.items.length-1?"1px solid var(--b)":"none"}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600}}>{it.name}</div>
                      <div style={{fontSize:11,color:"var(--t3)",marginTop:1}}>{it.sip}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,fontWeight:700}}>{it.val}</div>
                      <div style={{fontSize:11,fontWeight:700,color:"var(--p2)"}}>{it.ret}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


/* ─── TRANSFER HUB ─── */
function ScreenTransfer({nav,back}){
  const methods=[
    {id:"upi",icon:"⚡",name:"UPI",sub:"Instant · Free · ₹1L limit",color:"#6366F1",bg:"rgba(99,102,241,.12)",bd:"rgba(99,102,241,.25)"},
    {id:"imps",icon:"🚀",name:"IMPS",sub:"24×7 · ₹5L limit · Instant",color:"#10B981",bg:"rgba(16,185,129,.12)",bd:"rgba(16,185,129,.25)"},
    {id:"neft",icon:"🏦",name:"NEFT",sub:"Batch · No limit · 30 min",color:"#F59E0B",bg:"rgba(245,158,11,.12)",bd:"rgba(245,158,11,.25)"},
    {id:"rtgs",icon:"💎",name:"RTGS",sub:"₹2L minimum · Real-time",color:"#EC4899",bg:"rgba(236,72,153,.12)",bd:"rgba(236,72,153,.25)"},
    {id:"receive",icon:"📥",name:"Receive Money",sub:"QR Code · UPI ID · Bank details",color:"#06B6D4",bg:"rgba(6,182,212,.12)",bd:"rgba(6,182,212,.25)"},
  ];
  return(
    <div className="sbody nonav">
      <div className="hdr"><div className="back-btn" onClick={back}>‹</div><span className="hdr-title hdr-serif">Transfer Money</span></div>
      {/* Quick send */}
      <div style={{padding:"0 20px 16px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--t2)",letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Send to Recent</div>
        <div className="hscroll">
          {[{n:"Priya",a:"P",bg:"var(--gn)"},{n:"Riya",a:"R",bg:"var(--gv)"},{n:"Varun",a:"V",bg:"var(--gp)"},{n:"Karan",a:"K",bg:"#4A0080"},{n:"Add new",a:"+",bg:"var(--card3)"}].map(f=>(
            <div key={f.n} onClick={()=>f.n!=="Add new"&&nav("upi")} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",flexShrink:0}}>
              <div style={{width:50,height:50,borderRadius:"50%",background:f.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700}}>{f.a}</div>
              <span style={{fontSize:10,fontWeight:600,color:"var(--t2)"}}>{f.n}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Methods */}
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
        {methods.map(m=>(
          <div key={m.id} onClick={()=>nav(m.id)} style={{display:"flex",alignItems:"center",gap:14,padding:"16px",background:m.bg,border:`1px solid ${m.bd}`,borderRadius:22,cursor:"pointer",transition:"all .15s"}}>
            <div style={{width:48,height:48,borderRadius:16,background:"rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{m.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:700,color:m.color}}>{m.name}</div>
              <div style={{fontSize:12,color:"var(--t2)",marginTop:2}}>{m.sub}</div>
            </div>
            <span style={{fontSize:18,color:"var(--t3)"}}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── UPI TRANSFER ─── */
function ScreenUPI({nav,back}){
  const [upiId,setUpiId]=useState("");
  const [amount,setAmount]=useState("");
  const [note,setNote]=useState("");
  return(
    <div className="sbody nonav">
      <div className="hdr"><div className="back-btn" onClick={back}>‹</div><span className="hdr-title">UPI Transfer</span><span className="pill pv">⚡ Instant</span></div>
      <div style={{padding:"0 20px"}}>
        <div style={{padding:14,background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.15)",borderRadius:18,marginBottom:16,fontSize:12,color:"var(--v3)",lineHeight:1.5}}>
          ⚡ UPI transfers are instant, free, and work 24×7. Limit: <b>₹1,00,000</b> per transaction.
        </div>
        {[["UPI ID / Phone",upiId,setUpiId,"name@bank or 9876543210","text"],["Amount (₹)",amount,setAmount,"Enter amount","number"],["Note (optional)",note,setNote,"What's this for?","text"]].map(([label,val,setter,ph,type])=>(
          <div key={label} style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:6}}>{label}</div>
            <input value={val} onChange={e=>setter(e.target.value)} placeholder={ph} type={type} style={{width:"100%",padding:"14px 16px",background:"var(--card2)",border:"1px solid var(--b2)",borderRadius:16,fontSize:15,color:"var(--t)",fontFamily:"var(--font)",outline:"none"}}/>
          </div>
        ))}
        <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
          {["₹100","₹200","₹500","₹1,000","₹2,000"].map(v=>(
            <div key={v} onClick={()=>setAmount(v.replace(/[₹,]/g,""))} style={{padding:"8px 14px",borderRadius:14,border:"1px solid var(--b2)",fontSize:13,fontWeight:700,color:amount===v.replace(/[₹,]/g,"")?"var(--v2)":"var(--t2)",cursor:"pointer",background:amount===v.replace(/[₹,]/g,"")?"var(--v4)":"none"}}>{v}</div>
          ))}
        </div>
        <Btn onClick={back}>Pay via UPI →</Btn>
        <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"var(--t3)"}}>🔒 Secured by NPCI · UPI 2.0</div>
      </div>
    </div>
  );
}

/* ─── IMPS TRANSFER ─── */
function ScreenIMPS({nav,back}){
  const [acNo,setAcNo]=useState("");
  const [ifsc,setIfsc]=useState("");
  const [name,setName]=useState("");
  const [amount,setAmount]=useState("");
  return(
    <div className="sbody nonav">
      <div className="hdr"><div className="back-btn" onClick={back}>‹</div><span className="hdr-title">IMPS Transfer</span><span className="pill pp">🚀 Instant</span></div>
      <div style={{padding:"0 20px"}}>
        <div style={{padding:14,background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.15)",borderRadius:18,marginBottom:16,fontSize:12,color:"var(--p2)",lineHeight:1.5}}>
          🚀 IMPS works 24×7 including holidays. Limit: <b>₹5,00,000</b>. Fee: ₹2.50–₹25 based on amount.
        </div>
        {[["Account Number",acNo,setAcNo,"Enter account number","number"],["IFSC Code",ifsc,setIfsc,"e.g. HDFC0001234","text"],["Beneficiary Name",name,setName,"Account holder name","text"],["Amount (₹)",amount,setAmount,"Enter amount","number"]].map(([label,val,setter,ph,type])=>(
          <div key={label} style={{marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:6}}>{label}</div>
            <input value={val} onChange={e=>setter(e.target.value)} placeholder={ph} type={type} style={{width:"100%",padding:"14px 16px",background:"var(--card2)",border:"1px solid var(--b2)",borderRadius:16,fontSize:15,color:"var(--t)",fontFamily:"var(--font)",outline:"none",textTransform:label==="IFSC Code"?"uppercase":"none"}}/>
          </div>
        ))}
        <Btn className="green" onClick={back}>Send via IMPS →</Btn>
        <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"var(--t3)"}}>🔒 RBI Regulated · Available 24×7</div>
      </div>
    </div>
  );
}

/* ─── NEFT TRANSFER ─── */
function ScreenNEFT({nav,back}){
  const [acNo,setAcNo]=useState("");
  const [ifsc,setIfsc]=useState("");
  const [name,setName]=useState("");
  const [amount,setAmount]=useState("");
  return(
    <div className="sbody nonav">
      <div className="hdr"><div className="back-btn" onClick={back}>‹</div><span className="hdr-title">NEFT Transfer</span><span className="pill pf">🏦 Batch</span></div>
      <div style={{padding:"0 20px"}}>
        <div style={{padding:14,background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.15)",borderRadius:18,marginBottom:16,fontSize:12,color:"var(--f2)",lineHeight:1.5}}>
          🏦 NEFT settles in batches (every 30 min). <b>No upper limit.</b> Free for online transfers. Available 24×7.
        </div>
        {[["Account Number",acNo,setAcNo,"Enter account number","number"],["IFSC Code",ifsc,setIfsc,"e.g. SBIN0001234","text"],["Beneficiary Name",name,setName,"Account holder name","text"],["Amount (₹)",amount,setAmount,"Enter amount (no limit)","number"]].map(([label,val,setter,ph,type])=>(
          <div key={label} style={{marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:6}}>{label}</div>
            <input value={val} onChange={e=>setter(e.target.value)} placeholder={ph} type={type} style={{width:"100%",padding:"14px 16px",background:"var(--card2)",border:"1px solid var(--b2)",borderRadius:16,fontSize:15,color:"var(--t)",fontFamily:"var(--font)",outline:"none",textTransform:label==="IFSC Code"?"uppercase":"none"}}/>
          </div>
        ))}
        <Btn style={{background:"var(--gf)"}} onClick={back}>Send via NEFT →</Btn>
        <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"var(--t3)"}}>🔒 Settles in next batch · No limit</div>
      </div>
    </div>
  );
}

/* ─── RTGS TRANSFER ─── */
function ScreenRTGS({nav,back}){
  const [acNo,setAcNo]=useState("");
  const [ifsc,setIfsc]=useState("");
  const [name,setName]=useState("");
  const [amount,setAmount]=useState("");
  return(
    <div className="sbody nonav">
      <div className="hdr"><div className="back-btn" onClick={back}>‹</div><span className="hdr-title">RTGS Transfer</span><span className="pill pn">💎 Real-time</span></div>
      <div style={{padding:"0 20px"}}>
        <div style={{padding:14,background:"rgba(236,72,153,.08)",border:"1px solid rgba(236,72,153,.15)",borderRadius:18,marginBottom:16,fontSize:12,color:"var(--n2)",lineHeight:1.5}}>
          💎 RTGS is real-time for large transfers. Minimum: <b>₹2,00,000</b>. No upper limit. Available 24×7.
        </div>
        {[["Account Number",acNo,setAcNo,"Enter account number","number"],["IFSC Code",ifsc,setIfsc,"e.g. ICIC0001234","text"],["Beneficiary Name",name,setName,"Account holder name","text"],["Amount (₹)",amount,setAmount,"Minimum ₹2,00,000","number"]].map(([label,val,setter,ph,type])=>(
          <div key={label} style={{marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:6}}>{label}</div>
            <input value={val} onChange={e=>setter(e.target.value)} placeholder={ph} type={type} style={{width:"100%",padding:"14px 16px",background:"var(--card2)",border:"1px solid var(--b2)",borderRadius:16,fontSize:15,color:"var(--t)",fontFamily:"var(--font)",outline:"none",textTransform:label==="IFSC Code"?"uppercase":"none"}}/>
          </div>
        ))}
        <Btn className="pink" onClick={back}>Send via RTGS →</Btn>
        <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"var(--t3)"}}>🔒 Real-time settlement · Min ₹2L</div>
      </div>
    </div>
  );
}

/* ─── RECEIVE MONEY ─── */
function ScreenReceive({nav,back}){
  const [tab,setTab]=useState("qr");
  return(
    <div className="sbody nonav">
      <div className="hdr"><div className="back-btn" onClick={back}>‹</div><span className="hdr-title hdr-serif">Receive Money</span></div>
      {/* Tabs */}
      <div style={{display:"flex",gap:8,padding:"0 20px",marginBottom:16}}>
        {[["qr","QR Code"],["upi","UPI ID"],["bank","Bank Details"]].map(([k,l])=>(
          <div key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"10px",borderRadius:16,textAlign:"center",fontSize:13,fontWeight:700,cursor:"pointer",border:"1px solid var(--b2)",background:tab===k?"var(--gp)":"none",color:tab===k?"white":"var(--t2)",borderColor:tab===k?"transparent":"var(--b2)"}}>{l}</div>
        ))}
      </div>
      <div style={{padding:"0 20px"}}>
        {tab==="qr"&&(
          <div style={{textAlign:"center"}}>
            <div style={{width:220,height:220,margin:"0 auto 16px",background:"white",borderRadius:24,padding:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="180" height="180" viewBox="0 0 180 180">
                {/* Simplified QR pattern */}
                <rect width="180" height="180" fill="white"/>
                {/* Position markers */}
                <rect x="10" y="10" width="50" height="50" fill="black"/><rect x="15" y="15" width="40" height="40" fill="white"/><rect x="20" y="20" width="30" height="30" fill="black"/>
                <rect x="120" y="10" width="50" height="50" fill="black"/><rect x="125" y="15" width="40" height="40" fill="white"/><rect x="130" y="20" width="30" height="30" fill="black"/>
                <rect x="10" y="120" width="50" height="50" fill="black"/><rect x="15" y="125" width="40" height="40" fill="white"/><rect x="20" y="130" width="30" height="30" fill="black"/>
                {/* Data modules */}
                {Array.from({length:40},(_,i)=>{const x=70+((i%8)*12);const y=70+(Math.floor(i/8)*12);return <rect key={i} x={x} y={y} width="8" height="8" fill={Math.random()>.4?"black":"white"}/>;}).filter(Boolean)}
                {/* Center logo */}
                <rect x="72" y="72" width="36" height="36" rx="8" fill="#6366F1"/>
                <text x="90" y="95" textAnchor="middle" fill="white" fontSize="14" fontWeight="900">F</text>
              </svg>
            </div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Scan to pay Aryan Sharma</div>
            <div style={{fontSize:13,color:"var(--v2)",fontFamily:"var(--mono)",marginBottom:16}}>aryan@hdfcbank</div>
            <Btn className="outline sm" style={{width:"auto",display:"inline-flex"}}>Download QR</Btn>
          </div>
        )}
        {tab==="upi"&&(
          <div style={{textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:"var(--ga)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,fontWeight:700,margin:"0 auto 16px"}}>A</div>
            <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>Aryan Sharma</div>
            <div style={{padding:16,background:"var(--card)",border:"1px solid var(--b)",borderRadius:20,marginTop:16}}>
              {[["UPI ID","aryan@hdfcbank"],["Phone Pay","aryan-1@ybl"],["GPay","aryan.sharma@okhdfcbank"]].map(([l,v],i)=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<2?"1px solid var(--b)":"none"}}>
                  <span style={{fontSize:13,color:"var(--t2)"}}>{l}</span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:13,fontWeight:700,fontFamily:"var(--mono)",color:"var(--v2)"}}>{v}</span>
                    <span style={{fontSize:12,cursor:"pointer"}}>📋</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==="bank"&&(
          <div>
            <div style={{padding:16,background:"var(--card)",border:"1px solid var(--b)",borderRadius:20}}>
              {[["Account Holder","Aryan Sharma"],["Account Number","50100XXXXX1234"],["IFSC Code","HDFC0001234"],["Bank","HDFC Bank"],["Branch","Koramangala, Bangalore"],["Account Type","Savings"]].map(([l,v],i)=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<5?"1px solid var(--b)":"none"}}>
                  <span style={{fontSize:13,color:"var(--t2)"}}>{l}</span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:13,fontWeight:700,fontFamily:l.includes("Code")||l.includes("Number")?"var(--mono)":"var(--font)"}}>{v}</span>
                    <span style={{fontSize:12,cursor:"pointer"}}>📋</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:12,background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.15)",borderRadius:16,marginTop:14,fontSize:12,color:"var(--v3)",lineHeight:1.5}}>
              💡 Share these details for NEFT/RTGS/IMPS transfers from any bank.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ─── MAIN APP ─── */
const MAIN_TABS=["pulse","services","rewards","health","squad"];
const SCREEN_MAP={
  "pulse":ScreenPulse,
  "rewards":ScreenRewards,
  "rewards-detail":ScreenRewardsDetail,
  "services":ScreenServices,
  "health":ScreenHealth,
  "squad":ScreenSquad,
  "oracle":ScreenOracle,
  "analysis":ScreenAnalysis,
  "profile":ScreenProfile,
  "jars":ScreenJars,
  "invested":ScreenInvested,
  "locked":ScreenLocked,
  "transfer":ScreenTransfer,
  "upi":ScreenUPI,
  "imps":ScreenIMPS,
  "neft":ScreenNEFT,
  "rtgs":ScreenRTGS,
  "receive":ScreenReceive,
};

export default function FlowApp(){
  const [current,setCurrent]=useState("pulse");
  const [histStack,setHistStack]=useState([]);
  const [overlay,setOverlay]=useState(null);
  const [islandBig,setIslandBig]=useState(false);
  const [islandIdx,setIslandIdx]=useState(0);

  useEffect(()=>{const tag=document.createElement("style");tag.textContent=GLOBAL_CSS;document.head.appendChild(tag);return()=>document.head.removeChild(tag);},[]);
  useEffect(()=>{const t=setInterval(()=>{if(!islandBig)setIslandIdx(i=>(i+1)%ISLAND_MSGS.length);},4000);return()=>clearInterval(t);},[islandBig]);

  const nav=useCallback((id)=>{
    if(id.startsWith("_ov_")){setOverlay(id.slice(4));return;}
    const isMain=MAIN_TABS.includes(id);
    if(!isMain)setHistStack(h=>[...h,current]);
    else setHistStack([]);
    setCurrent(id);
  },[current]);

  const back=useCallback(()=>{
    if(histStack.length===0){setCurrent("pulse");return;}
    const prev=histStack[histStack.length-1];
    setHistStack(h=>h.slice(0,-1));
    setCurrent(prev);
  },[histStack]);

  const Comp=SCREEN_MAP[current];
  const isMain=MAIN_TABS.includes(current);

  return(
    <div className="flow-device">
      {/* island removed */}
      {/* iPhone status bar */}
      <div style={{position:"absolute",top:16,left:0,right:0,height:20,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 32px",zIndex:200,pointerEvents:"none"}}>
        <span style={{fontSize:15,fontWeight:600,fontFamily:"var(--font)",color:"var(--t)",letterSpacing:.2}}>9:41</span>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:12,fontWeight:600,color:"var(--t)"}}>86%</span>
          <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0" y="0" width="23" height="13" rx="3.5" stroke="rgba(255,255,255,.5)" strokeWidth="1" fill="none"/><rect x="1.5" y="1.5" width={23*0.86-3} height="10" rx="2" fill="var(--p)"/><path d="M24.5 4v5a2 2 0 000-5z" fill="rgba(255,255,255,.5)"/></svg>
        </div>
      </div>

      {Comp&&(
        <div key={current} className="scr" style={{background:"var(--bg)"}}>
          <Comp nav={nav} back={back} overlay={overlay} setOverlay={setOverlay}/>
        </div>
      )}

      {isMain&&(
        <div className="nav">
          {[["pulse","◎","Home",null],["services","🏦","Services",null],["rewards","🪙","Rewards",null],["health","🏃","Health",null],["squad","👥","Squad",4]].map(([id,ic,lbl,badge])=>(
            <div key={id} className={`ni${current===id?" on":""}`} onClick={()=>nav(id)}>
              <div className="ni-i">{ic}</div>
              <div className="ni-l">{lbl}</div>
              {badge&&<div className="nbadge">{badge}</div>}
            </div>
          ))}
        </div>
      )}

      {overlay==="share-split"&&<ShareOverlay title="Share Split Request" onClose={()=>setOverlay(null)}/>}
      {overlay==="share-health"&&<ShareOverlay title="Share Progress" onClose={()=>setOverlay(null)}/>}
    </div>
  );
}
