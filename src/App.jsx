import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  bg: "#0d0d12", card: "#14141c", cardHover: "#1a1a26", border: "#2a2a3d",
  gold: "#c8923a", goldLight: "#e8b86d", sage: "#7a9e8a", rose: "#c47a7a",
  lavender: "#9a8ec0", teal: "#5a9e9a", text: "#e8e4d9", muted: "#7a7a8a",
};

const NAV = [
  { id:"home",      label:"Sanctuary",   icon:"✦" },
  { id:"mylibrary", label:"My Library",  icon:"☆" },
  { id:"ritual",   label:"Ritual",      icon:"◎" },
  { id:"library",  label:"Videos",      icon:"▷" },
  { id:"breathe",  label:"Breathe",     icon:"〜" },
  { id:"ocd",      label:"OCD",         icon:"⬡" },
  { id:"journal",  label:"Journal",     icon:"✐" },
  { id:"quotes",   label:"Quotes",      icon:"❝" },
  { id:"vow",      label:"The Vow",     icon:"◈" },
  { id:"circle",   label:"The Circle",  icon:"○" },
  { id:"resting",  label:"The Rest",    icon:"◑" },
  { id:"community",label:"The Green Room", icon:"♡" },
];

const BOTTOM_NAV = [
  { id:"home",      label:"Home",    icon:"✦" },
  { id:"mylibrary", label:"Library", icon:"☆" },
  { id:"circle",    label:"Circle",  icon:"○" },
  { id:"journal",   label:"Journal", icon:"✐" },
  { id:"more",      label:"More",    icon:"⋯" },
];

const PRACTITIONERS = [
  { id:1, name:"Dr. Amara Osei", specialty:"Performance Psychology", avatar:"AO", color:C.sage,
    videos:[
      { id:"v1", title:"Releasing Outcome Attachment", duration:"12 min", tag:"Mindset" },
      { id:"v2", title:"The Actor's Nervous System",   duration:"18 min", tag:"Science" },
      { id:"v3", title:"Fear as Fuel",                 duration:"9 min",  tag:"Audition Prep" },
    ]},
  { id:2, name:"Lena Marchetti", specialty:"Somatic Movement", avatar:"LM", color:C.rose,
    videos:[
      { id:"v4", title:"Body Scan Before the Room",       duration:"8 min",  tag:"Grounding" },
      { id:"v5", title:"Shaking It Out — Trauma Release", duration:"15 min", tag:"Release" },
      { id:"v6", title:"Standing in Your Power",          duration:"11 min", tag:"Embodiment" },
    ]},
  { id:3, name:"James Okafor", specialty:"Voice & Breath", avatar:"JO", color:C.lavender,
    videos:[
      { id:"v7", title:"The Resonant Breath",         duration:"10 min", tag:"Voice" },
      { id:"v8", title:"Releasing the Throat Hold",   duration:"7 min",  tag:"Release" },
      { id:"v9", title:"Box Breathing for Creatives", duration:"6 min",  tag:"Breathwork" },
    ]},
];

const ALL_VIDEOS = PRACTITIONERS.flatMap(p => p.videos.map(v => ({ ...v, practitioner:p.name, color:p.color })));

const RITUAL_STEPS = [
  { id:"ground",  label:"Ground",  icon:"⬡", desc:"Connect to your body",         color:C.sage },
  { id:"breathe", label:"Breathe", icon:"〜", desc:"Regulate your nervous system", color:C.lavender },
  { id:"affirm",  label:"Affirm",  icon:"✦", desc:"Set your intention",            color:C.gold },
  { id:"release", label:"Release", icon:"◌", desc:"Let go of outcome",             color:C.rose },
  { id:"arrive",  label:"Arrive",  icon:"◎", desc:"Step into your character",      color:C.teal },
];

const AFFIRMATIONS = [
  "I bring something no one else can.",
  "This room is lucky to have me in it.",
  "My preparation has brought me here.",
  "I am not auditioning for approval — I am sharing my art.",
  "Nerves are proof that I care. They are my allies.",
  "I release the need to control the outcome.",
  "My presence is enough.",
  "I have done hard things before. I am doing one now.",
];

const ACTOR_QUOTES = [
  { id:"q1", text:"An actor is at his best a kind of unfrocked priest who, for an hour or two, can call on heaven and hell to mesmerise a group of innocents.", author:"Alec Guinness" },
  { id:"q2", text:"Acting is not about being someone different. It's finding the similarity in what is apparently different, then finding myself in there.", author:"Meryl Streep" },
  { id:"q3", text:"You have to be willing to look stupid. The fear of looking stupid is what makes you look stupid.", author:"Stella Adler" },
  { id:"q4", text:"Your emotional life is not cut off when you walk into an audition room. It is the very thing they want to see.", author:"Sanford Meisner" },
  { id:"q5", text:"The craft is in the listening. Be changed by what your scene partner gives you.", author:"Sanford Meisner" },
  { id:"q6", text:"Don't act. Be. The camera picks up everything — especially the lie.", author:"Michael Caine" },
  { id:"q7", text:"There is no failure in rehearsal. There is only discovery.", author:"Peter Brook" },
  { id:"q8", text:"Your vulnerability is your power. The audience comes to be moved, not impressed.", author:"Uta Hagen" },
  { id:"q9", text:"Acting is the ability to live truthfully under imaginary circumstances.", author:"Sanford Meisner" },
  { id:"q10", text:"A great actor is someone who can do nothing — and hold the room.", author:"Lee Strasberg" },
  { id:"q11", text:"The best performances come from actors who are not afraid of silence.", author:"Sidney Lumet" },
  { id:"q12", text:"The preparation, the work, the discipline — it's what you bring to the room, not what you take away.", author:"Viola Davis" },
];

const KAZAN_VOW = [
  "I will take my rightful place on the stage and I will be myself.",
  "I am not a cosmic orphan.",
  "I have no reason to be timid.",
  "I will respond as I feel; awkwardly, vulgarly, but respond.",
  "I will have my throat open, I will have my heart open, I will be vulnerable.",
  "I may have anything or everything the world has to offer, but the thing I need most, and want most, is to be myself.",
  "I will admit rejection, admit pain, admit frustration, admit even pettiness, admit shame, admit outrage, admit anything and everything that happens to me.",
  "The best and most human parts of me are those that I have inhabited and hidden from the world.",
  "I will work on it.",
  "I will raise my voice.",
  "I will be heard.",
];

const OCD_TOOLS = [
  { id:"notice", icon:"◎", color:C.lavender, title:"Notice & Name", subtitle:"Defusion",
    body:"When an intrusive thought arrives, you don't have to fight it or obey it. Simply name what's happening:",
    steps:[`"I notice I'm having the thought that ___"`,`"There's a part of me that is frightened right now"`,`"This is OCD speaking. It is not the truth."`],
    note:"Naming creates distance. You are the noticer — not the thought." },
  { id:"parts", icon:"⬡", color:C.gold, title:"Meet the Part", subtitle:"IFS",
    body:"OCD often shows up as a protective Part — anxious, urgent, trying to keep you safe. Instead of fighting it:",
    steps:[`Get curious: "What are you afraid will happen if I don't listen to you?"`,`Offer compassion: "I see you. Thank you for trying to protect me."`,`Gently redirect: "I'm going to take care of us another way right now."`],
    note:"Parts that feel heard tend to quiet down. You are the Self — larger than any one Part." },
  { id:"body", icon:"〜", color:C.sage, title:"Return to the Body", subtitle:"Somatic grounding",
    body:"Rumination lives in the mind. The body is always in the present moment. Use it as your anchor:",
    steps:["Press both feet firmly into the floor. Feel the weight.","Name 5 things you can see in this room — slowly, with detail.","Place one hand on your chest. Breathe in for 4, out for 6."],
    note:"You cannot be fully in your body and fully in a spiral at the same time." },
  { id:"room", icon:"✦", color:C.rose, title:"Bring It Into the Room", subtitle:"The actor's superpower",
    body:"You don't have to resolve the thought before you walk in. The audition room itself is an anchor:",
    steps:["Notice the temperature of the air.","Make real eye contact with the reader or panel.","Let your scene partner's words actually land on you."],
    note:"Presence is the antidote. The thought cannot follow you into a moment of genuine contact." },
];

const COMMUNITY_POSTS = [
  { name:"Priya M.", avatar:"PM", color:C.rose, time:"2 hours ago", hearts:24, text:"Used the 4-7-8 breath before my callback today. I felt so present. Didn't book it but I felt proud of how I showed up. 🌿" },
  { name:"Tom R.",   avatar:"TR", color:C.sage, time:"Yesterday",    hearts:41, text:"Dr. Osei's video on releasing outcome attachment literally changed how I walk into a room. Highly recommend." },
  { name:"Cass B.",  avatar:"CB", color:C.lavender, time:"3 days ago", hearts:57, text:"Built my first ritual using the builder. 5 mins of grounding, 3 mins of breath, one affirmation. Simple but it's mine. Felt like armour." },
];

const GOOD_LUCK_MESSAGES = [
  "You've prepared for this. The room is lucky to have you in it. Go show them what you've got. ★",
  "Today is your day. Walk in like you belong there — because you do. We're cheering for you. ★",
  "You are so ready for this. Trust your preparation, trust yourself. Break a leg. ★",
  "The work is done. Now just be yourself — that's always been enough. Rooting for you. ★",
  "Step into that room with your whole heart. You've got this. We love you. ★",
];

const AVATAR_COLORS = [C.sage, C.rose, C.lavender, C.teal, C.gold];

// ─── Storage helpers ──────────────────────────────────────────────────────
function useStorage(key, defaultVal) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : defaultVal; } catch { return defaultVal; }
  });
  const set = useCallback((v) => {
    setVal(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [val, set];
}

// ─── Heart Button ─────────────────────────────────────────────────────────
function Heart({ active, onToggle, size=16 }) {
  return (
    <button onClick={e => { e.stopPropagation(); onToggle(); }} style={{ background:"none", border:"none", cursor:"pointer", color:active?C.rose:C.muted, fontSize:size, lineHeight:1, padding:4, flexShrink:0, transition:"color 0.2s" }}>
      {active ? "♥" : "♡"}
    </button>
  );
}

// ─── The Circle ───────────────────────────────────────────────────────────
function TheCircle() {
  const [friends, setFriends] = useStorage("circle_friends", [
    { id:1, name:"Sophie H.", initials:"SH", color:C.rose, auditions:[{ role:"Lady Macbeth — National Theatre", date:"2026-05-10", sent:false }]},
    { id:2, name:"Declan W.", initials:"DW", color:C.sage, auditions:[{ role:"Callbacks — Menier Chocolate Factory", date:"2026-05-06", sent:true }]},
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddAudition, setShowAddAudition] = useState(null);
  const [newFriend, setNewFriend] = useState({ name:"" });
  const [newAudition, setNewAudition] = useState({ role:"", date:"" });
  const [sentFlash, setSentFlash] = useState({});
  const [selectedMsg, setSelectedMsg] = useState(0);
  const [customMsg, setCustomMsg] = useState("");
  const [sendingTo, setSendingTo] = useState(null);

  const today = new Date();
  const daysUntil = d => Math.round((new Date(d) - today) / 86400000);

  const addFriend = () => {
    if (!newFriend.name.trim()) return;
    const initials = newFriend.name.trim().split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
    setFriends(f => [...f, { id:Date.now(), name:newFriend.name.trim(), initials, color:AVATAR_COLORS[f.length%AVATAR_COLORS.length], auditions:[] }]);
    setNewFriend({ name:"" }); setShowAdd(false);
  };

  const addAudition = (friendId) => {
    if (!newAudition.role.trim() || !newAudition.date) return;
    setFriends(f => f.map(fr => fr.id===friendId ? { ...fr, auditions:[...fr.auditions, { role:newAudition.role.trim(), date:newAudition.date, sent:false }] } : fr));
    setNewAudition({ role:"", date:"" }); setShowAddAudition(null);
  };

  const sendLuck = (friendId, audIdx) => {
    const key = `${friendId}-${audIdx}`;
    setFriends(f => f.map(fr => fr.id===friendId ? { ...fr, auditions:fr.auditions.map((a,i) => i===audIdx?{...a,sent:true}:a) } : fr));
    setSentFlash(s => ({ ...s, [key]:true }));
    setSendingTo(null);
    setTimeout(() => setSentFlash(s => { const n={...s}; delete n[key]; return n; }), 3000);
  };

  const msgToSend = customMsg.trim() || GOOD_LUCK_MESSAGES[selectedMsg];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, fontWeight:400, marginBottom:6 }}>The Circle</h2>
        <p style={{ color:C.muted, fontSize:14, lineHeight:1.7 }}>Your people. Save their auditions and send a good luck message on the day — they don't need the app.</p>
      </div>

      {friends.some(f => f.auditions.some(a => daysUntil(a.date)>=0 && daysUntil(a.date)<=3)) && (
        <div style={{ background:`${C.gold}12`, border:`1px solid ${C.gold}44`, borderRadius:14, padding:"14px 18px" }}>
          <p style={{ color:C.gold, fontSize:13, fontWeight:600, marginBottom:6 }}>○ Coming up soon</p>
          {friends.map(fr => fr.auditions.map((a,i) => {
            const d = daysUntil(a.date);
            if (d<0||d>3) return null;
            return <p key={`${fr.id}-${i}`} style={{ color:C.text, fontSize:13, lineHeight:1.7 }}><span style={{ color:fr.color }}>{fr.name}</span> — {a.role} {d===0?"is today!":d===1?"is tomorrow":`is in ${d} days`}</p>;
          }))}
        </div>
      )}

      {friends.map(friend => (
        <div key={friend.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
            <div style={{ width:46, height:46, borderRadius:"50%", background:`${friend.color}33`, border:`2px solid ${friend.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:friend.color, fontSize:14, flexShrink:0 }}>{friend.initials}</div>
            <div style={{ flex:1 }}><p style={{ fontWeight:600, fontSize:16 }}>{friend.name}</p><p style={{ fontSize:12, color:C.muted }}>{friend.auditions.length} audition{friend.auditions.length!==1?"s":""} saved</p></div>
          </div>
          {friend.auditions.length > 0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
              {friend.auditions.map((aud,i) => {
                const d = daysUntil(aud.date); const key=`${friend.id}-${i}`; const isPast=d<0; const isToday=d===0;
                return (
                  <div key={i} style={{ background:C.bg, border:`1px solid ${isToday?friend.color:C.border}`, borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:14, color:C.text, marginBottom:3, fontWeight:isToday?600:400 }}>{aud.role}</p>
                      <p style={{ fontSize:12, color:isToday?friend.color:C.muted }}>{isPast?"Past":isToday?"Today! ○":d===1?"Tomorrow":`In ${d} days`} · {new Date(aud.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</p>
                    </div>
                    {!isPast && (sentFlash[key] ? <span style={{ fontSize:12, color:C.sage, fontWeight:600, flexShrink:0 }}>Sent ✓</span> : aud.sent ? <span style={{ fontSize:12, color:C.muted, flexShrink:0 }}>Luck sent ♡</span> : <button onClick={() => setSendingTo({friendId:friend.id,audIdx:i})} style={{ padding:"7px 14px", borderRadius:30, border:`1px solid ${friend.color}`, background:"transparent", color:friend.color, cursor:"pointer", fontSize:12, flexShrink:0, whiteSpace:"nowrap" }}>Send luck ○</button>)}
                  </div>
                );
              })}
            </div>
          )}
          {showAddAudition===friend.id ? (
            <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
              <input value={newAudition.role} onChange={e=>setNewAudition(a=>({...a,role:e.target.value}))} placeholder="Role or production..." style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", color:C.text, fontSize:14, outline:"none", width:"100%", boxSizing:"border-box" }} />
              <input type="date" value={newAudition.date} onChange={e=>setNewAudition(a=>({...a,date:e.target.value}))} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", color:C.text, fontSize:14, outline:"none", width:"100%", boxSizing:"border-box", colorScheme:"dark" }} />
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => addAudition(friend.id)} style={{ padding:"8px 20px", borderRadius:30, background:C.gold, border:"none", color:C.bg, fontWeight:700, cursor:"pointer", fontSize:13 }}>Save</button>
                <button onClick={() => setShowAddAudition(null)} style={{ padding:"8px 16px", borderRadius:30, background:"transparent", border:`1px solid ${C.border}`, color:C.muted, cursor:"pointer", fontSize:13 }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddAudition(friend.id)} style={{ background:"transparent", border:`1px dashed ${C.border}`, borderRadius:10, padding:"9px 16px", color:C.muted, cursor:"pointer", fontSize:13, width:"100%", textAlign:"center" }}>+ Add audition</button>
          )}
        </div>
      ))}

      {showAdd ? (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px" }}>
          <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, marginBottom:14 }}>Add someone to your circle</p>
          <input value={newFriend.name} onChange={e=>setNewFriend(f=>({...f,name:e.target.value}))} placeholder="Their name..." style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:14, outline:"none", width:"100%", boxSizing:"border-box", marginBottom:12 }} />
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={addFriend} style={{ padding:"10px 24px", borderRadius:30, background:C.gold, border:"none", color:C.bg, fontWeight:700, cursor:"pointer", fontSize:14 }}>Add to Circle</button>
            <button onClick={() => setShowAdd(false)} style={{ padding:"10px 16px", borderRadius:30, background:"transparent", border:`1px solid ${C.border}`, color:C.muted, cursor:"pointer", fontSize:13 }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} style={{ background:"transparent", border:`1px dashed ${C.border}`, borderRadius:14, padding:"16px", color:C.muted, cursor:"pointer", fontSize:14, textAlign:"center", transition:"all 0.2s" }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.color=C.gold; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.muted; }}>
          + Add someone to your circle
        </button>
      )}

      {sendingTo && (() => {
        const friend = friends.find(f=>f.id===sendingTo.friendId); const aud = friend?.auditions[sendingTo.audIdx];
        if (!friend||!aud) return null;
        return (
          <div style={{ position:"fixed", inset:0, background:"#000000aa", backdropFilter:"blur(6px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
            <div style={{ background:C.card, border:`1px solid ${C.gold}55`, borderRadius:20, padding:"28px 24px", maxWidth:420, width:"100%" }}>
              <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, marginBottom:4 }}>Send good luck</p>
              <p style={{ color:C.muted, fontSize:13, marginBottom:20 }}>to {friend.name} for {aud.role}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
                {GOOD_LUCK_MESSAGES.map((msg,i) => (
                  <button key={i} onClick={() => { setSelectedMsg(i); setCustomMsg(""); }} style={{ padding:"10px 14px", borderRadius:12, border:`1px solid ${selectedMsg===i&&!customMsg?friend.color:C.border}`, background:selectedMsg===i&&!customMsg?`${friend.color}15`:"transparent", color:selectedMsg===i&&!customMsg?C.text:C.muted, cursor:"pointer", textAlign:"left", fontSize:13, lineHeight:1.5 }}>{msg}</button>
                ))}
              </div>
              <textarea value={customMsg} onChange={e=>setCustomMsg(e.target.value)} placeholder={`Write something personal for ${friend.name}...`} style={{ width:"100%", background:C.bg, border:`1px solid ${customMsg?friend.color:C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:14, lineHeight:1.6, resize:"none", outline:"none", minHeight:80, fontFamily:"'Lato',sans-serif", boxSizing:"border-box", marginBottom:16 }} />
              <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", marginBottom:18 }}>
                <p style={{ color:C.muted, fontSize:11, marginBottom:6 }}>PREVIEW</p>
                <p style={{ color:C.text, fontSize:14, lineHeight:1.6, fontStyle:"italic" }}>{msgToSend}</p>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => sendLuck(friend.id, sendingTo.audIdx)} style={{ flex:1, padding:"12px", borderRadius:30, background:C.gold, border:"none", color:C.bg, fontWeight:700, cursor:"pointer", fontSize:14 }}>Send via WhatsApp ○</button>
                <button onClick={() => setSendingTo(null)} style={{ padding:"12px 18px", borderRadius:30, background:"transparent", border:`1px solid ${C.border}`, color:C.muted, cursor:"pointer", fontSize:13 }}>Cancel</button>
              </div>
              <p style={{ color:C.muted, fontSize:11, textAlign:"center", marginTop:12 }}>They don't need the app to receive this.</p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

const RESTING_AFFIRMATIONS = [
  "I am not my last job. I am not my next job. I am the work itself.",
  "Rest is not the opposite of readiness. It is part of it.",
  "The industry's silence says nothing about my worth.",
  "I am an artist in every season — working or not.",
  "This period is not the end of my story. It is a chapter in it.",
  "The gap does not define me. What I do inside it does.",
  "I am allowed to grieve the work I don't have. And I am allowed to keep going.",
  "Every actor I admire has stood exactly where I'm standing now.",
  "My instrument — my body, my voice, my heart — is still here. Still mine.",
  "Resting is not disappearing. It is waiting with intention.",
];

const RESTING_STORIES = [
  {
    name: "Bryan Cranston",
    color: C.sage,
    initials: "BC",
    gap: "Years of small TV roles into his late 40s",
    story: "Before Breaking Bad, Cranston was best known as the dad in Malcolm in the Middle — a beloved but lightweight role. For years he struggled to be taken seriously for dramatic work. He was 50 when Vince Gilligan cast him as Walter White, a role almost everyone else passed on. He has spoken openly about the years of uncertainty, the sense that his window was closing, and how he learned to find meaning in the work itself rather than the outcome.",
    quote: "I just focused on the work. I stopped worrying about whether it would lead anywhere.",
  },
  {
    name: "Viola Davis",
    color: C.rose,
    initials: "VD",
    gap: "Decades of supporting roles before her breakthrough",
    story: "Davis spent over twenty years working steadily but largely unseen in supporting roles in film and television. She has described growing up in poverty, being told repeatedly she wasn't the right type, and pushing through years of invisibility. Her performance in Doubt (2008) — which she shot in two days — earned her an Oscar nomination. She was in her forties. How to Get Away with Murder and Fences followed, and with them, the recognition that had been earned across a lifetime of quiet work.",
    quote: "My career didn't happen overnight. It happened over decades of showing up.",
  },
  {
    name: "Brendan Fraser",
    color: C.lavender,
    initials: "BF",
    gap: "Nearly a decade away from leading roles",
    story: "After a string of blockbusters in the late 90s, Fraser largely disappeared from Hollywood for almost ten years. What wasn't publicly known at the time was that he was dealing with the aftermath of assault, physical injuries from his action roles, and profound personal struggles. He returned in 2022 with The Whale, giving what many called the performance of his career, and won the Academy Award for Best Actor. His tearful acceptance speech moved an entire industry.",
    quote: "I just kept believing that stories worth telling would find me again.",
  },
  {
    name: "Timothy Spall",
    color: C.teal,
    initials: "TS",
    gap: "Leukaemia diagnosis mid-career",
    story: "In 1996, at a pivotal point in his career, Spall was diagnosed with acute myeloid leukaemia and told he had a 50/50 chance of survival. He spent two years in and out of hospitals, uncertain if he would ever work again. He came back. He went on to work with Mike Leigh, Tim Burton and many others, and delivered one of the most celebrated British screen performances of his generation in Mr Turner — the role he had to fight his way back from death to reach.",
    quote: "I was given a second chance at life and at the thing I love most. I wasn't going to waste either.",
  },
  {
    name: "Andrea Riseborough",
    color: C.gold,
    initials: "AR",
    gap: "Years of UK work largely unseen in the US",
    story: "Riseborough spent years working extensively in British theatre and television, respected within the industry but almost unknown to international audiences. She has spoken candidly about the financial precarity of that period, the self-doubt, and the question of whether it would ever translate. Her Oscar-nominated performance in To Leslie came from a tiny independent film with almost no budget. The nomination came as a genuine shock to her. She was 41.",
    quote: "I never stopped working. I just stopped expecting it to look a certain way.",
  },
];

const RESTING_RITUALS = [
  { icon:"✐", color:C.sage,     title:"The Artist's Letter", desc:"Write a letter to your future working self. Tell them what this time taught you. Seal it. Open it when the work comes back." },
  { icon:"◎", color:C.lavender, title:"Stay in the Body",    desc:"Your instrument doesn't rest. Move, stretch, breathe. A 10-minute walk is a rehearsal for presence." },
  { icon:"❝", color:C.gold,     title:"Consume Hungrily",   desc:"Watch. Read. Go to the theatre. You are still a student of the craft. Let other people's work nourish yours." },
  { icon:"〜", color:C.rose,    title:"Name What You Feel", desc:"Say it out loud or write it down: 'I am finding this hard.' The silence of a resting period gets heavier when it's unnamed." },
];

function RestingTab() {
  const [affIdx, setAffIdx] = useState(0);
  const [openStory, setOpenStory] = useState(null);
  const [favRestAffs, setFavRestAffs] = useStorage("fav_rest_affirmations", []);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, fontWeight:400, marginBottom:6 }}>The Rest</h2>
        <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, maxWidth:500 }}>
          Not working is part of working. This space is for the in-between — the waiting, the wondering, and the quiet courage it takes to keep believing in yourself when the phone isn't ringing.
        </p>
      </div>

      {/* Holding banner */}
      <div style={{ background:`linear-gradient(135deg, ${C.card}, ${C.bg})`, border:`1px solid ${C.lavender}44`, borderRadius:18, padding:"28px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-30, width:140, height:140, borderRadius:"50%", background:`${C.lavender}08` }} />
        <p style={{ color:C.lavender, fontSize:10, letterSpacing:3, textTransform:"uppercase", marginBottom:12 }}>A reminder</p>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontStyle:"italic", color:C.text, lineHeight:1.7 }}>
          The gap has a name. It is not failure.<br/>It is not a sign.<br/>It is the industry — and it happens to everyone.
        </p>
      </div>

      {/* Resting affirmations */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px" }}>
        <p style={{ color:C.muted, fontSize:10, letterSpacing:3, textTransform:"uppercase", marginBottom:16 }}>Words for the Wait</p>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:16 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontStyle:"italic", color:C.text, lineHeight:1.65, flex:1 }}>
            "{RESTING_AFFIRMATIONS[affIdx]}"
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
            <Heart active={favRestAffs.includes(RESTING_AFFIRMATIONS[affIdx])} onToggle={()=>setFavRestAffs(f=>f.includes(RESTING_AFFIRMATIONS[affIdx])?f.filter(a=>a!==RESTING_AFFIRMATIONS[affIdx]):[...f,RESTING_AFFIRMATIONS[affIdx]])} size={16} />
            <button onClick={()=>setAffIdx(i=>(i+1)%RESTING_AFFIRMATIONS.length)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:18 }}>↻</button>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {RESTING_AFFIRMATIONS.map((_,i)=>(
            <button key={i} onClick={()=>setAffIdx(i)} style={{ width:8, height:8, borderRadius:"50%", border:"none", background:i===affIdx?C.lavender:C.border, cursor:"pointer", padding:0, transition:"background 0.2s" }} />
          ))}
        </div>
      </div>

      {/* Stories */}
      <div>
        <p style={{ color:C.muted, fontSize:10, letterSpacing:3, textTransform:"uppercase", marginBottom:14 }}>They Were Here Too</p>
        <p style={{ color:C.muted, fontSize:13, lineHeight:1.7, marginBottom:16 }}>Every actor you admire has had a resting period. Some had many. Here are a few of their stories.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {RESTING_STORIES.map((story,i)=>(
            <div key={i} style={{ background:C.card, border:`1px solid ${openStory===i?story.color:C.border}`, borderRadius:16, padding:"18px 20px", cursor:"pointer", transition:"all 0.25s" }}
              onClick={()=>setOpenStory(openStory===i?null:i)}
              onMouseEnter={e=>{ if(openStory!==i) e.currentTarget.style.borderColor=`${story.color}77`; }}
              onMouseLeave={e=>{ if(openStory!==i) e.currentTarget.style.borderColor=C.border; }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom: openStory===i?16:0 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:`${story.color}22`, border:`2px solid ${story.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:story.color, fontSize:13, flexShrink:0 }}>{story.initials}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, fontSize:16, marginBottom:2 }}>{story.name}</p>
                  <p style={{ fontSize:12, color:story.color }}>{story.gap}</p>
                </div>
                <span style={{ color:C.muted, fontSize:16, transition:"transform 0.2s", transform:openStory===i?"rotate(180deg)":"none" }}>↓</span>
              </div>
              {openStory===i && (
                <div>
                  <p style={{ color:C.text, fontSize:14, lineHeight:1.8, marginBottom:16 }}>{story.story}</p>
                  <div style={{ background:`${story.color}10`, border:`1px solid ${story.color}33`, borderRadius:12, padding:"14px 18px" }}>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontStyle:"italic", color:story.color, lineHeight:1.6 }}>"{story.quote}"</p>
                    <p style={{ color:C.muted, fontSize:12, marginTop:8 }}>— {story.name}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resting rituals */}
      <div>
        <p style={{ color:C.muted, fontSize:10, letterSpacing:3, textTransform:"uppercase", marginBottom:14 }}>A Ritual for the Wait</p>
        <div className="grid-2">
          {RESTING_RITUALS.map((r,i)=>(
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px", transition:"all 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=r.color}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <span style={{ fontSize:20, color:r.color, display:"block", marginBottom:10 }}>{r.icon}</span>
              <p style={{ fontWeight:600, fontSize:14, marginBottom:6 }}>{r.title}</p>
              <p style={{ color:C.muted, fontSize:13, lineHeight:1.65 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing note */}
      <div style={{ border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 24px", textAlign:"center" }}>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontStyle:"italic", color:C.muted, lineHeight:1.7 }}>
          "The instrument is always being tuned.<br/>Even in the silence."
        </p>
      </div>
    </div>
  );
}
// ─── Ritual Builder ───────────────────────────────────────────────────────
const RITUAL_CONTENT = {
  ground: {
    title:"Ground", color:"#7a9e8a", instruction:"Take a moment to arrive in your body.", duration:"2–3 minutes",
    steps:["Stand or sit with both feet flat on the floor.","Feel the weight of your body — let gravity hold you.","Press your feet down gently. Notice the floor beneath you.","Take three slow breaths. With each exhale, soften your jaw, your shoulders, your hands.","Say quietly to yourself: I am here. I am ready."],
  },
  breathe: {
    title:"Breathe", color:"#9a8ec0", instruction:"Regulate your nervous system with the 4–7–8 breath.", duration:"3–4 minutes",
    steps:["Breathe in through your nose for 4 counts.","Hold for 7 counts.","Exhale slowly through your mouth for 8 counts.","Repeat three to four times.","Notice the shift. Your body knows how to calm itself."],
  },
  affirm: {
    title:"Affirm", color:"#c8923a", instruction:"Choose one affirmation and let it land.", duration:"1–2 minutes",
    affirmations:true,
    steps:["Read your affirmation aloud — not in your head. Out loud.","Say it again, slower.","Close your eyes. Breathe it in.","Let it be true right now, even if only for this moment."],
  },
  release: {
    title:"Release", color:"#c47a7a", instruction:"Let go of what you are carrying into the room.", duration:"2 minutes",
    steps:["Name one thing you are worried about. Say it or write it down.","Now say: I acknowledge this. And I am choosing to set it down.","Shake out your hands. Shake out your arms.","Roll your shoulders back. Open your chest.","Take one deep breath and exhale it all out."],
  },
  arrive: {
    title:"Arrive", color:"#5a9e9a", instruction:"Step into who you are about to be.", duration:"1–2 minutes",
    steps:["Stand tall. Feet hip-width apart.","Take up your full space — no shrinking.","Think of one moment in your life when you felt completely alive.","Carry that with you as you walk through the door.","You are not auditioning for approval. You are sharing your art."],
  },
};

function RitualBuilder({ ritualSteps, setRitualSteps, savedRitual, setSavedRitual }) {
  const [mode, setMode] = useState("build");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [affIdx, setAffIdx] = useState(0);

  const activeStep = ritualSteps[currentIdx];
  const content = activeStep ? RITUAL_CONTENT[activeStep] : null;

  const startRitual = () => { setMode("run"); setCurrentIdx(0); };
  const nextStep = () => {
    if (currentIdx + 1 >= ritualSteps.length) { setMode("complete"); }
    else { setCurrentIdx(i => i + 1); }
  };
  const reset = () => { setMode("build"); setCurrentIdx(0); };

  if (mode === "run" && content) {
    return (
      <div className="fu" style={{ display:"flex", flexDirection:"column", gap:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={reset} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13 }}>← Exit</button>
          <div style={{ flex:1, height:3, background:C.border, borderRadius:2 }}>
            <div style={{ height:"100%", borderRadius:2, background:content.color, width:`${((currentIdx+1)/ritualSteps.length)*100}%`, transition:"width 0.4s" }} />
          </div>
          <span style={{ color:C.muted, fontSize:12 }}>{currentIdx+1} / {ritualSteps.length}</span>
        </div>

        <div style={{ background:`linear-gradient(160deg, ${C.card}, ${C.bg})`, border:`1px solid ${content.color}55`, borderRadius:20, padding:"28px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ width:48, height:48, borderRadius:"50%", background:`${content.color}22`, border:`2px solid ${content.color}`, display:"flex", alignItems:"center", justifyContent:"center", color:content.color, fontSize:20, flexShrink:0 }}>
              {RITUAL_STEPS.find(s=>s.id===activeStep)?.icon}
            </div>
            <div>
              <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:22 }}>{content.title}</p>
              <p style={{ fontSize:12, color:content.color }}>{content.duration}</p>
            </div>
          </div>

          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontStyle:"italic", color:C.text, lineHeight:1.65, marginBottom:22 }}>{content.instruction}</p>

          {content.affirmations && (
            <div style={{ background:`${content.color}10`, border:`1px solid ${content.color}33`, borderRadius:14, padding:"16px 18px", marginBottom:20 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontStyle:"italic", color:C.text, lineHeight:1.6, marginBottom:12 }}>"{AFFIRMATIONS[affIdx]}"</p>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setAffIdx(i=>(i-1+AFFIRMATIONS.length)%AFFIRMATIONS.length)} style={{ width:30, height:30, borderRadius:"50%", border:`1px solid ${C.border}`, background:"transparent", color:C.muted, cursor:"pointer" }}>←</button>
                <button onClick={()=>setAffIdx(i=>(i+1)%AFFIRMATIONS.length)} style={{ width:30, height:30, borderRadius:"50%", border:`1px solid ${content.color}`, background:"transparent", color:content.color, cursor:"pointer" }}>→</button>
              </div>
            </div>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {content.steps.map((s,i) => (
              <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ width:24, height:24, borderRadius:"50%", border:`1px solid ${content.color}55`, background:`${content.color}11`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:content.color, flexShrink:0 }}>{i+1}</div>
                <p style={{ color:C.text, fontSize:14, lineHeight:1.7, paddingTop:3 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={nextStep} style={{ padding:"14px", borderRadius:40, background:content.color, border:"none", color:C.bg, fontWeight:700, cursor:"pointer", fontSize:15 }}>
          {currentIdx === ritualSteps.length - 1 ? "Complete Ritual ✓" : `Next: ${RITUAL_CONTENT[ritualSteps[currentIdx+1]]?.title || ""} →`}
        </button>
      </div>
    );
  }

  if (mode === "complete") {
    return (
      <div className="fu" style={{ display:"flex", flexDirection:"column", gap:20, textAlign:"center" }}>
        <div style={{ padding:"40px 24px", border:`1px solid ${C.gold}44`, borderRadius:20, background:`linear-gradient(160deg, ${C.card}, ${C.bg})` }}>
          <p style={{ fontSize:40, marginBottom:16 }}>✦</p>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, marginBottom:12 }}>You're ready.</h2>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontStyle:"italic", color:C.muted, lineHeight:1.7 }}>You've done the work. Now go into that room<br/>and trust what you've prepared.</p>
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={reset} style={{ padding:"11px 24px", borderRadius:40, border:`1px solid ${C.border}`, background:"transparent", color:C.muted, cursor:"pointer", fontSize:14 }}>Build Ritual</button>
          <button onClick={()=>setSavedRitual([...ritualSteps])} style={{ padding:"11px 24px", borderRadius:40, background:C.gold, border:"none", color:C.bg, fontWeight:700, cursor:"pointer", fontSize:14 }}>Save to My Library ☆</button>
        </div>
        {savedRitual.length > 0 && savedRitual.join()===ritualSteps.join() && <p style={{ color:C.sage, fontSize:13 }}>✓ Saved to your library</p>}
      </div>
    );
  }

  // Build mode
  return (
    <div className="fu" style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, fontWeight:400, marginBottom:6 }}>Build Your Ritual</h2>
        <p style={{ color:C.muted, fontSize:14 }}>Choose your steps, then tap Begin to be guided through each one.</p>
      </div>

      {RITUAL_STEPS.map(step => {
        const on = ritualSteps.includes(step.id);
        const rc = RITUAL_CONTENT[step.id];
        return (
          <button key={step.id} onClick={()=>setRitualSteps(p=>p.includes(step.id)?p.filter(s=>s!==step.id):[...p,step.id])}
            style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 18px", borderRadius:14, border:`1px solid ${on?step.color:C.border}`, background:on?`${step.color}12`:C.card, cursor:"pointer", textAlign:"left", transition:"all 0.25s", width:"100%" }}>
            <div style={{ width:42, height:42, borderRadius:"50%", border:`2px solid ${on?step.color:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, color:on?step.color:C.muted, flexShrink:0, transition:"all 0.25s" }}>{step.icon}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:600, color:on?C.text:C.muted, marginBottom:2, fontSize:15 }}>{step.label}</p>
              <p style={{ fontSize:13, color:C.muted }}>{step.desc}{rc?` · ${rc.duration}`:""}</p>
            </div>
            <div style={{ width:22, height:22, borderRadius:"50%", border:`2px solid ${on?step.color:C.border}`, background:on?step.color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", color:C.bg, fontSize:12, flexShrink:0, transition:"all 0.25s" }}>{on?"✓":""}</div>
          </button>
        );
      })}

      {ritualSteps.length > 0 ? (
        <div style={{ background:`${C.gold}10`, border:`1px solid ${C.gold}55`, borderRadius:16, padding:"20px 22px" }}>
          <p style={{ color:C.gold, fontSize:11, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Your Ritual — {ritualSteps.length} step{ritualSteps.length!==1?"s":""}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:18 }}>
            {ritualSteps.map(id=>{ const s=RITUAL_STEPS.find(r=>r.id===id); if(!s) return null; return <span key={id} style={{ padding:"5px 14px", borderRadius:20, background:`${s.color}22`, border:`1px solid ${s.color}55`, color:s.color, fontSize:13 }}>{s.icon} {s.label}</span>; })}
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button onClick={startRitual} style={{ padding:"11px 28px", borderRadius:40, background:C.gold, border:"none", color:C.bg, fontWeight:700, cursor:"pointer", fontSize:14 }}>Begin Ritual →</button>
            <button onClick={()=>setSavedRitual([...ritualSteps])} style={{ padding:"11px 20px", borderRadius:40, background:"transparent", border:`1px solid ${C.border}`, color:C.muted, cursor:"pointer", fontSize:13 }}>Save ☆</button>
            <button onClick={()=>setRitualSteps([])} style={{ padding:"11px 16px", borderRadius:40, background:"transparent", border:`1px solid ${C.border}`, color:C.muted, cursor:"pointer", fontSize:13 }}>Clear</button>
          </div>
          {savedRitual.length > 0 && savedRitual.join()===ritualSteps.join() && <p style={{ color:C.sage, fontSize:13, marginTop:10 }}>✓ Saved to your library</p>}
        </div>
      ) : (
        <div style={{ textAlign:"center", padding:"24px", border:`1px dashed ${C.border}`, borderRadius:14 }}>
          <p style={{ color:C.muted, fontSize:14 }}>Select the steps above to build your ritual.</p>
        </div>
      )}
    </div>
  );
}

function BreathCircle() {
  const [phase, setPhase] = useState("ready"); const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0); const [running, setRunning] = useState(false);
  const timerRef = useRef(null);
  const PHASES = [{ name:"inhale",label:"Breathe In",duration:4,next:"hold"},{name:"hold",label:"Hold",duration:7,next:"exhale"},{name:"exhale",label:"Breathe Out",duration:8,next:"rest"},{name:"rest",label:"Rest",duration:1,next:"inhale"}];
  useEffect(() => {
    if (!running) return;
    if (phase==="ready") { setPhase("inhale"); setCount(4); return; }
    const cur = PHASES.find(p=>p.name===phase); if (!cur) return;
    if (count<=0) { if(cur.name==="exhale") setCycles(c=>c+1); const nxt=PHASES.find(p=>p.name===cur.next); setPhase(cur.next); setCount(nxt?.duration||4); return; }
    timerRef.current = setTimeout(()=>setCount(c=>c-1),1000); return ()=>clearTimeout(timerRef.current);
  }, [running,phase,count]);
  const stop = () => { setRunning(false); setPhase("ready"); setCount(0); clearTimeout(timerRef.current); };
  const cur = PHASES.find(p=>p.name===phase);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:28, padding:"32px 0" }}>
      <div style={{ position:"relative", width:180, height:180, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:`1px solid ${C.lavender}33`, transition:"transform 4s ease-in-out", transform:phase==="inhale"?"scale(1.15)":"scale(1)" }} />
        <div style={{ width:148, height:148, borderRadius:"50%", background:`radial-gradient(circle at 40% 40%, ${C.lavender}33, ${C.bg})`, border:`2px solid ${C.lavender}66`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", transition:"transform 4s ease-in-out", transform:phase==="inhale"?"scale(1.2)":phase==="exhale"?"scale(0.85)":"scale(1)", boxShadow:running?`0 0 40px ${C.lavender}33`:"none" }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38, color:C.text, lineHeight:1 }}>{running&&phase!=="ready"?count:"〜"}</span>
          <span style={{ fontSize:10, color:C.muted, letterSpacing:2, textTransform:"uppercase", marginTop:4 }}>{running?(cur?.label||""):"ready"}</span>
        </div>
      </div>
      {cycles>0&&<p style={{ color:C.gold, fontSize:13 }}>Cycles: {cycles}</p>}
      {!running ? <button onClick={()=>setRunning(true)} style={{ padding:"12px 32px", borderRadius:40, border:`1px solid ${C.lavender}`, background:"transparent", color:C.lavender, cursor:"pointer", fontFamily:"'Cormorant Garamond',serif", fontSize:16 }}>Begin</button>
        : <button onClick={stop} style={{ padding:"12px 32px", borderRadius:40, border:`1px solid ${C.border}`, background:"transparent", color:C.muted, cursor:"pointer", fontSize:14 }}>Stop</button>}
    </div>
  );
}

// ─── Journal ──────────────────────────────────────────────────────────────
function Journal({ favQuotes, onFavQuote }) {
  const PROMPTS = ["What am I bringing into the room today?","What does success look like beyond booking the job?","What would I do if I knew I couldn't fail?","What is one thing I'm releasing before I walk in?","My body is telling me ____. I respond with ____."];
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);
  const [affIdx, setAffIdx] = useState(0);
  const [promptIdx, setPromptIdx] = useState(0);
  const [entries, setEntries] = useStorage("journal_entries", [
    { date:"May 1", prompt:"What am I bringing into the room today?", text:"I bring my curiosity and my truth. I've been working on this piece for weeks and it lives in me now." }
  ]);
  const [favAffs, setFavAffs] = useStorage("fav_affirmations", []);

  const save = () => {
    if (!entry.trim()) return;
    setEntries(e=>[{ id:Date.now(), date:"Today", prompt:PROMPTS[promptIdx], text:entry },...e]);
    setEntry(""); setSaved(true); setTimeout(()=>setSaved(false),2000);
  };

  const toggleFavAff = (aff) => setFavAffs(f => f.includes(aff) ? f.filter(a=>a!==aff) : [...f,aff]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ background:`linear-gradient(135deg, ${C.gold}11, ${C.rose}11)`, border:`1px solid ${C.gold}33`, borderRadius:12, padding:"14px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontStyle:"italic", color:C.goldLight, flex:1, lineHeight:1.5 }}>"{AFFIRMATIONS[affIdx]}"</p>
          <div style={{ display:"flex", gap:4, flexShrink:0 }}>
            <Heart active={favAffs.includes(AFFIRMATIONS[affIdx])} onToggle={()=>toggleFavAff(AFFIRMATIONS[affIdx])} size={15} />
            <button onClick={()=>setAffIdx(i=>(i+1)%AFFIRMATIONS.length)} style={{ background:"none", border:"none", color:C.gold, cursor:"pointer", fontSize:18 }}>↻</button>
          </div>
        </div>
      </div>
      <div>
        <p style={{ color:C.muted, fontSize:11, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>Today's Prompt</p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {PROMPTS.map((_,i)=><button key={i} onClick={()=>setPromptIdx(i)} style={{ padding:"6px 14px", borderRadius:20, fontSize:12, border:`1px solid ${i===promptIdx?C.gold:C.border}`, background:i===promptIdx?`${C.gold}22`:"transparent", color:i===promptIdx?C.gold:C.muted, cursor:"pointer" }}>Prompt {i+1}</button>)}
        </div>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontStyle:"italic", color:C.text, marginTop:12, lineHeight:1.5 }}>{PROMPTS[promptIdx]}</p>
      </div>
      <textarea value={entry} onChange={e=>setEntry(e.target.value)} placeholder="Write freely. This is just for you." style={{ width:"100%", minHeight:130, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, color:C.text, padding:14, fontSize:15, lineHeight:1.7, resize:"vertical", fontFamily:"'Cormorant Garamond',serif", outline:"none", boxSizing:"border-box" }} />
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <button onClick={save} style={{ padding:"10px 26px", borderRadius:40, background:saved?C.sage:C.gold, border:"none", color:C.bg, fontWeight:600, cursor:"pointer", fontSize:14, transition:"background 0.3s" }}>{saved?"Saved ✓":"Save Entry"}</button>
      </div>
      <div>
        <p style={{ color:C.muted, fontSize:11, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>Past Entries</p>
        {entries.map((e,i)=>(
          <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, flexWrap:"wrap", gap:4 }}>
              <span style={{ fontSize:12, color:C.muted, fontStyle:"italic" }}>{e.prompt}</span>
              <span style={{ fontSize:11, color:C.muted, flexShrink:0 }}>{e.date}</span>
            </div>
            <p style={{ color:C.text, fontSize:14, lineHeight:1.6 }}>{e.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── My Library ───────────────────────────────────────────────────────────
function MyLibrary({ goTo }) {
  const [favAffs]     = useStorage("fav_affirmations", []);
  const [favQuotes]   = useStorage("fav_quotes", []);
  const [favVideos]   = useStorage("fav_videos", []);
  const [savedRitual] = useStorage("saved_ritual", []);
  const [entries]     = useStorage("journal_entries", []);

  const isEmpty = !favAffs.length && !favQuotes.length && !favVideos.length && !savedRitual.length && !entries.length;

  const Section = ({ title, icon, color, children, tab }) => (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <p style={{ color, fontSize:11, letterSpacing:2, textTransform:"uppercase", display:"flex", alignItems:"center", gap:6 }}>
          <span>{icon}</span>{title}
        </p>
        {tab && <button onClick={()=>goTo(tab)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:12 }}>See all →</button>}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
      <div>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, fontWeight:400, marginBottom:6 }}>My Library</h2>
        <p style={{ color:C.muted, fontSize:14, lineHeight:1.7 }}>Everything you've saved — your rituals, your words, your favourites.</p>
      </div>

      {isEmpty && (
        <div style={{ textAlign:"center", padding:"48px 24px", border:`1px dashed ${C.border}`, borderRadius:18 }}>
          <p style={{ fontSize:32, marginBottom:16 }}>☆</p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontStyle:"italic", color:C.muted, marginBottom:8 }}>Your library is waiting.</p>
          <p style={{ color:C.muted, fontSize:14, lineHeight:1.7 }}>Heart an affirmation, quote or video and it will appear here. Save your ritual and journal entries too.</p>
        </div>
      )}

      {savedRitual.length > 0 && (
        <Section title="My Ritual" icon="◎" color={C.gold} tab="ritual">
          <div style={{ background:C.card, border:`1px solid ${C.gold}33`, borderRadius:14, padding:"16px 18px" }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {savedRitual.map(id => { const s=RITUAL_STEPS.find(r=>r.id===id); if(!s) return null; return (
                <span key={id} style={{ padding:"6px 16px", borderRadius:20, background:`${s.color}22`, border:`1px solid ${s.color}55`, color:s.color, fontSize:13 }}>{s.icon} {s.label}</span>
              );})}
            </div>
          </div>
        </Section>
      )}

      {favAffs.length > 0 && (
        <Section title="Saved Affirmations" icon="✦" color={C.rose} tab="journal">
          {favAffs.map((aff,i) => (
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 18px" }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontStyle:"italic", color:C.text, lineHeight:1.6 }}>"{aff}"</p>
            </div>
          ))}
        </Section>
      )}

      {favQuotes.length > 0 && (
        <Section title="Saved Quotes" icon="❝" color={C.lavender} tab="quotes">
          {favQuotes.map((id,i) => { const q=ACTOR_QUOTES.find(q=>q.id===id); if(!q) return null; return (
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 18px" }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontStyle:"italic", color:C.text, lineHeight:1.6, marginBottom:8 }}>"{q.text}"</p>
              <p style={{ color:C.muted, fontSize:12 }}>— {q.author}</p>
            </div>
          );})}
        </Section>
      )}

      {favVideos.length > 0 && (
        <Section title="Saved Videos" icon="▷" color={C.sage} tab="library">
          {favVideos.map((id,i) => { const v=ALL_VIDEOS.find(v=>v.id===id); if(!v) return null; return (
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:`${v.color}22`, border:`1px solid ${v.color}55`, display:"flex", alignItems:"center", justifyContent:"center", color:v.color, fontSize:14, flexShrink:0 }}>▷</div>
              <div>
                <p style={{ fontSize:14, color:C.text, marginBottom:3 }}>{v.title}</p>
                <p style={{ fontSize:12, color:C.muted }}>{v.practitioner} · {v.duration}</p>
              </div>
            </div>
          );})}
        </Section>
      )}

      {entries.length > 0 && (
        <Section title="Journal Entries" icon="✐" color={C.teal} tab="journal">
          {entries.slice(0,3).map((e,i) => (
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:12, color:C.muted, fontStyle:"italic" }}>{e.prompt}</span>
                <span style={{ fontSize:11, color:C.muted }}>{e.date}</span>
              </div>
              <p style={{ color:C.text, fontSize:14, lineHeight:1.6 }}>{e.text}</p>
            </div>
          ))}
          {entries.length > 3 && <p style={{ color:C.muted, fontSize:13, textAlign:"center" }}>+{entries.length-3} more entries in your journal</p>}
        </Section>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────
export default function ActorSanctuary() {
  const [tab, setTab] = useState("home");
  const [practitioner, setPractitioner] = useState(null);
  const [activeOcd, setActiveOcd] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [affIdx, setAffIdx] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [hearts, setHearts] = useState({});

  // Persistent state
  const [ritualSteps, setRitualSteps] = useStorage("ritual_steps", []);
  const [savedRitual, setSavedRitual] = useStorage("saved_ritual", []);
  const [favQuotes, setFavQuotes] = useStorage("fav_quotes", []);
  const [favVideos, setFavVideos] = useStorage("fav_videos", []);

  useEffect(() => {
    const t = setInterval(()=>setAffIdx(i=>(i+1)%AFFIRMATIONS.length), 6000);
    return ()=>clearInterval(t);
  }, []);

  const goTo = (t) => { setTab(t); setMenuOpen(false); window.scrollTo(0,0); };
  const toggleFavQuote = id => setFavQuotes(f => f.includes(id)?f.filter(q=>q!==id):[...f,id]);
  const toggleFavVideo = id => setFavVideos(f => f.includes(id)?f.filter(v=>v!==id):[...f,id]);

  const Heading = ({ children }) => <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, fontWeight:400, marginBottom:6 }}>{children}</h2>;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'Lato',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Lato:wght@300;400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes slideUp{from{opacity:0;transform:translateY(100%);}to{opacity:1;transform:translateY(0);}}
        .fu{animation:fadeUp 0.4s ease forwards;}
        .slide-up{animation:slideUp 0.3s ease forwards;}
        input::placeholder,textarea::placeholder{color:${C.muted};}
        .layout{display:flex;max-width:1100px;margin:0 auto;}
        .sidebar{width:200px;padding:24px 10px;position:sticky;top:56px;height:calc(100vh - 56px);border-right:1px solid ${C.border};display:flex;flex-direction:column;gap:2px;flex-shrink:0;overflow-y:auto;}
        .main-content{flex:1;padding:28px;}
        .bottom-nav{display:none;}
        .menu-overlay{display:none;}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;}
        @media(max-width:680px){
          .sidebar{display:none;}
          .layout{display:block;}
          .main-content{padding:20px 16px 96px 16px;}
          .bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:${C.card};border-top:1px solid ${C.border};z-index:200;padding-bottom:env(safe-area-inset-bottom);}
          .bottom-nav-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 4px 8px;border:none;background:transparent;cursor:pointer;gap:3px;}
          .menu-overlay{display:block;position:fixed;bottom:60px;left:0;right:0;background:${C.card};border-top:1px solid ${C.border};z-index:190;padding:14px;}
          .grid-2{grid-template-columns:1fr;}
          .grid-3{grid-template-columns:1fr 1fr;}
        }
      `}</style>

      <header style={{ borderBottom:`1px solid ${C.border}`, padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56, position:"sticky", top:0, background:`${C.bg}ee`, backdropFilter:"blur(12px)", zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:C.gold }}>✦</span>
          <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:C.goldLight }}>The Actor's Sanctuary</span>
        </div>
        <button onClick={()=>goTo("mylibrary")} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:20, padding:"5px 12px", color:C.muted, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:5 }}>
          <span>☆</span> My Library
        </button>
      </header>

      <div className="layout">
        <nav className="sidebar">
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>goTo(item.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, border:"none", cursor:"pointer", textAlign:"left", background:tab===item.id?`${C.gold}18`:"transparent", color:tab===item.id?C.gold:C.muted, fontSize:13, transition:"all 0.2s", borderLeft:tab===item.id?`2px solid ${C.gold}`:"2px solid transparent" }}
              onMouseEnter={e=>{ if(tab!==item.id) e.currentTarget.style.color=C.text; }}
              onMouseLeave={e=>{ if(tab!==item.id) e.currentTarget.style.color=C.muted; }}>
              <span style={{ fontSize:14, flexShrink:0 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <div style={{ marginTop:"auto", padding:"14px 12px", borderTop:`1px solid ${C.border}` }}>
            <p style={{ fontSize:11, color:C.muted, lineHeight:1.7, fontStyle:"italic" }}>"The craft requires the whole self. Tend to it."</p>
          </div>
        </nav>

        <main className="main-content">

          {/* HOME */}
          {tab==="home" && (
            <div className="fu" style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ background:`linear-gradient(135deg, ${C.card}, ${C.bg})`, border:`1px solid ${C.border}`, borderRadius:18, padding:"30px 28px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:`${C.gold}08` }} />
                <p style={{ color:C.gold, fontSize:10, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>Welcome back</p>
                <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, lineHeight:1.25, marginBottom:14 }}>You belong<br/>in every room.</h1>
                <p style={{ color:C.muted, lineHeight:1.7, marginBottom:22, fontSize:14 }}>Your space to ground, prepare, and arrive fully present.</p>
                <button onClick={()=>goTo("ritual")} style={{ padding:"11px 26px", borderRadius:40, border:`1px solid ${C.gold}`, background:"transparent", color:C.gold, cursor:"pointer", fontFamily:"'DM Serif Display',serif", fontSize:15 }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=C.gold; e.currentTarget.style.color=C.bg; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.gold; }}>
                  Begin Today's Ritual →
                </button>
              </div>
              <div style={{ textAlign:"center", padding:"22px 20px", border:`1px solid ${C.border}`, borderRadius:16, background:C.card }}>
                <p style={{ fontSize:10, color:C.muted, letterSpacing:3, textTransform:"uppercase", marginBottom:12 }}>Affirmation of the Moment</p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontStyle:"italic", color:C.text, lineHeight:1.6 }}>"{AFFIRMATIONS[affIdx]}"</p>
              </div>
              <div className="grid-3">
                {[{ t:"breathe",icon:"〜",label:"Breathwork",desc:"Calm in 5 min",col:C.lavender },{ t:"circle",icon:"○",label:"The Circle",desc:"Send luck",col:C.gold },{ t:"resting",icon:"◑",label:"The Rest",desc:"For the in-between",col:C.lavender }].map(card=>(
                  <button key={card.t} onClick={()=>goTo(card.t)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 14px", cursor:"pointer", textAlign:"left", transition:"all 0.2s", color:C.text }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=card.col; e.currentTarget.style.background=C.cardHover; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.card; }}>
                    <span style={{ fontSize:20, color:card.col, display:"block", marginBottom:8 }}>{card.icon}</span>
                    <p style={{ fontWeight:600, marginBottom:3, fontSize:13 }}>{card.label}</p>
                    <p style={{ color:C.muted, fontSize:12 }}>{card.desc}</p>
                  </button>
                ))}
              </div>
              <div onClick={()=>goTo("vow")} style={{ border:`1px solid ${C.gold}33`, borderRadius:16, padding:"20px 24px", cursor:"pointer", background:`${C.gold}07`, transition:"all 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold}
                onMouseLeave={e=>e.currentTarget.style.borderColor=`${C.gold}33`}>
                <p style={{ fontSize:10, color:C.gold, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>Elia Kazan</p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontStyle:"italic", color:C.text, lineHeight:1.65 }}>"I will take my rightful place on the stage and I will be myself. I am not a cosmic orphan."</p>
                <p style={{ color:C.gold, fontSize:13, marginTop:12 }}>Read The Actor's Vow →</p>
              </div>
            </div>
          )}

          {/* MY LIBRARY */}
          {tab==="mylibrary" && <div className="fu"><MyLibrary goTo={goTo} /></div>}

          {/* RITUAL */}
          {tab==="ritual" && <RitualBuilder ritualSteps={ritualSteps} setRitualSteps={setRitualSteps} savedRitual={savedRitual} setSavedRitual={setSavedRitual} />}

          {/* LIBRARY */}
          {tab==="library" && (
            <div className="fu" style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div><Heading>Video Library</Heading><p style={{ color:C.muted, fontSize:14 }}>Guidance from practitioners who understand the actor's world.</p></div>
              {!practitioner ? PRACTITIONERS.map(p=>(
                <div key={p.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px", transition:"all 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=p.color}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                  <div onClick={()=>setPractitioner(p)} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12, cursor:"pointer" }}>
                    <div style={{ width:48, height:48, borderRadius:"50%", background:`${p.color}33`, border:`2px solid ${p.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:p.color, fontSize:13, flexShrink:0 }}>{p.avatar}</div>
                    <div style={{ flex:1 }}><p style={{ fontWeight:600, fontSize:16, marginBottom:2 }}>{p.name}</p><p style={{ color:p.color, fontSize:13 }}>{p.specialty}</p></div>
                    <span style={{ color:C.muted, fontSize:18 }}>→</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {p.videos.map(v=>(
                      <div key={v.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderTop:`1px solid ${C.border}` }}>
                        <span style={{ color:p.color, fontSize:14 }}>▷</span>
                        <div style={{ flex:1 }}><p style={{ fontSize:14, color:C.text }}>{v.title}</p><p style={{ fontSize:12, color:C.muted }}>{v.duration} · {v.tag}</p></div>
                        <Heart active={favVideos.includes(v.id)} onToggle={()=>toggleFavVideo(v.id)} />
                      </div>
                    ))}
                  </div>
                </div>
              )) : (
                <div>
                  <button onClick={()=>setPractitioner(null)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:14, marginBottom:16 }}>← All practitioners</button>
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18, padding:18, background:C.card, borderRadius:16 }}>
                    <div style={{ width:56, height:56, borderRadius:"50%", background:`${practitioner.color}33`, border:`2px solid ${practitioner.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:practitioner.color, fontSize:16 }}>{practitioner.avatar}</div>
                    <div><h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22 }}>{practitioner.name}</h3><p style={{ color:practitioner.color }}>{practitioner.specialty}</p></div>
                  </div>
                  {practitioner.videos.map(v=>(
                    <div key={v.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px", display:"flex", alignItems:"center", gap:14, marginBottom:10, transition:"all 0.2s" }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=practitioner.color}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                      <div style={{ width:42, height:42, borderRadius:"50%", background:`${practitioner.color}22`, border:`1px solid ${practitioner.color}55`, display:"flex", alignItems:"center", justifyContent:"center", color:practitioner.color, fontSize:16, flexShrink:0 }}>▷</div>
                      <div style={{ flex:1 }}><p style={{ fontWeight:600, marginBottom:4, fontSize:15 }}>{v.title}</p><div style={{ display:"flex", gap:8 }}><span style={{ fontSize:12, color:C.muted }}>{v.duration}</span><span style={{ fontSize:11, padding:"2px 10px", borderRadius:10, background:`${practitioner.color}22`, color:practitioner.color }}>{v.tag}</span></div></div>
                      <Heart active={favVideos.includes(v.id)} onToggle={()=>toggleFavVideo(v.id)} size={18} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BREATHWORK */}
          {tab==="breathe" && (
            <div className="fu"><Heading>Breathwork</Heading><p style={{ color:C.muted, fontSize:14 }}>Regulate your nervous system before you walk through the door.</p><BreathCircle /></div>
          )}

          {/* OCD */}
          {tab==="ocd" && (
            <div className="fu" style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div><Heading>OCD Support</Heading><p style={{ color:C.muted, fontSize:14, lineHeight:1.7 }}>Intrusive thoughts can be present — and you can still show up fully.</p></div>
              <div style={{ background:`${C.teal}12`, border:`1px solid ${C.teal}44`, borderRadius:14, padding:"14px 18px" }}>
                <p style={{ color:C.teal, fontSize:14, lineHeight:1.8 }}><strong>A reminder:</strong> The thought is not the truth. You don't have to resolve it before you walk in. You just have to be in the room.</p>
              </div>
              <div className="grid-2">
                {OCD_TOOLS.map(tool=>(
                  <div key={tool.id} onClick={()=>setActiveOcd(activeOcd===tool.id?null:tool.id)} style={{ background:C.card, border:`1px solid ${activeOcd===tool.id?tool.color:C.border}`, borderRadius:16, padding:"18px", cursor:"pointer", transition:"all 0.25s" }}
                    onMouseEnter={e=>{ if(activeOcd!==tool.id) e.currentTarget.style.borderColor=`${tool.color}77`; }}
                    onMouseLeave={e=>{ if(activeOcd!==tool.id) e.currentTarget.style.borderColor=C.border; }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                      <span style={{ fontSize:18, color:tool.color }}>{tool.icon}</span>
                      <div><p style={{ fontWeight:600, fontSize:14, color:C.text }}>{tool.title}</p><p style={{ fontSize:11, color:tool.color }}>{tool.subtitle}</p></div>
                    </div>
                    {activeOcd===tool.id?(
                      <div style={{ marginTop:12, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
                        <p style={{ color:C.muted, fontSize:13, lineHeight:1.7, marginBottom:10 }}>{tool.body}</p>
                        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
                          {tool.steps.map((s,i)=><div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start" }}><span style={{ color:tool.color, fontSize:13, flexShrink:0, marginTop:2 }}>◦</span><p style={{ color:C.text, fontSize:13, lineHeight:1.6, fontStyle:s.startsWith('"')?"italic":"normal" }}>{s}</p></div>)}
                        </div>
                        <div style={{ background:`${tool.color}12`, border:`1px solid ${tool.color}33`, borderRadius:10, padding:"10px 13px" }}><p style={{ color:tool.color, fontSize:12, lineHeight:1.6 }}>{tool.note}</p></div>
                      </div>
                    ):<p style={{ color:C.muted, fontSize:12, marginTop:4 }}>Tap to open →</p>}
                  </div>
                ))}
              </div>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px" }}>
                <p style={{ color:C.gold, fontSize:10, letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>Quick Grounding — Right Now</p>
                {["Press both feet into the floor. Feel the ground hold you.","Name 3 colours you can see from where you are.","Take one slow breath — in through the nose, out through the mouth.",`Say aloud or silently: "I am here. I am safe. The thought is just a thought."`].map((s,i)=>(
                  <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:12 }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", border:`1px solid ${C.gold}55`, background:`${C.gold}11`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:C.gold, flexShrink:0 }}>{i+1}</div>
                    <p style={{ color:C.text, fontSize:14, lineHeight:1.6, paddingTop:1, fontStyle:s.startsWith('"')?"italic":"normal" }}>{s}</p>
                  </div>
                ))}
              </div>
              <p style={{ color:C.muted, fontSize:12, lineHeight:1.8, borderTop:`1px solid ${C.border}`, paddingTop:14 }}>These tools draw on ACT, IFS, and somatic grounding. They complement — but don't replace — working with a therapist. The IOCDF (iocdf.org) can help you find a specialist.</p>
            </div>
          )}

          {/* JOURNAL */}
          {tab==="journal" && (
            <div className="fu"><Heading>Your Journal</Heading><p style={{ color:C.muted, fontSize:14, marginBottom:20 }}>Write before. Write after. Write through it.</p><Journal /></div>
          )}

          {/* QUOTES */}
          {tab==="quotes" && (
            <div className="fu" style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div><Heading>Words for the Work</Heading><p style={{ color:C.muted, fontSize:14 }}>From those who understood the craft.</p></div>
              <div style={{ background:`linear-gradient(135deg, ${C.card}, ${C.bg})`, border:`1px solid ${C.gold}44`, borderRadius:18, padding:"28px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-10, left:-10, fontSize:100, color:`${C.gold}08`, fontFamily:"Georgia,serif", lineHeight:1, userSelect:"none" }}>"</div>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:21, fontStyle:"italic", lineHeight:1.65, color:C.text, marginBottom:16, position:"relative" }}>{ACTOR_QUOTES[quoteIdx].text}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <p style={{ color:C.gold, fontSize:14 }}>— {ACTOR_QUOTES[quoteIdx].author}</p>
                  <Heart active={favQuotes.includes(ACTOR_QUOTES[quoteIdx].id)} onToggle={()=>toggleFavQuote(ACTOR_QUOTES[quoteIdx].id)} size={20} />
                </div>
                <div style={{ display:"flex", gap:12, marginTop:20 }}>
                  <button onClick={()=>setQuoteIdx(i=>(i-1+ACTOR_QUOTES.length)%ACTOR_QUOTES.length)} style={{ width:36, height:36, borderRadius:"50%", border:`1px solid ${C.border}`, background:"transparent", color:C.muted, cursor:"pointer", fontSize:16 }}>←</button>
                  <button onClick={()=>setQuoteIdx(i=>(i+1)%ACTOR_QUOTES.length)} style={{ width:36, height:36, borderRadius:"50%", border:`1px solid ${C.gold}`, background:"transparent", color:C.gold, cursor:"pointer", fontSize:16 }}>→</button>
                </div>
              </div>
              <div className="grid-2">
                {ACTOR_QUOTES.filter((_,i)=>i!==quoteIdx).map((q,i)=>(
                  <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px", cursor:"pointer", transition:"all 0.2s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.background=C.cardHover; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.card; }}>
                    <div onClick={()=>setQuoteIdx(ACTOR_QUOTES.indexOf(q))}>
                      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:"italic", color:C.text, lineHeight:1.6, marginBottom:8 }}>"{q.text}"</p>
                      <p style={{ color:C.muted, fontSize:12, marginBottom:8 }}>— {q.author}</p>
                    </div>
                    <Heart active={favQuotes.includes(q.id)} onToggle={()=>toggleFavQuote(q.id)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VOW */}
          {tab==="vow" && (
            <div className="fu" style={{ display:"flex", flexDirection:"column", gap:22 }}>
              <div>
                <p style={{ color:C.gold, fontSize:10, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>Elia Kazan</p>
                <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, fontWeight:400, marginBottom:8 }}>The Actor's Vow</h2>
                <p style={{ color:C.muted, fontSize:14, lineHeight:1.7 }}>Read it slowly. Read it aloud. Let it remind you of what you came here to do.</p>
              </div>
              <div style={{ border:`1px solid ${C.gold}33`, borderRadius:18, padding:"32px 28px", background:`linear-gradient(160deg, ${C.card}, ${C.bg})`, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, right:0, width:160, height:160, borderRadius:"50%", background:`${C.gold}05`, transform:"translate(50px,-50px)" }} />
                <div style={{ display:"flex", flexDirection:"column", gap:16, position:"relative" }}>
                  {KAZAN_VOW.map((line,i)=>(
                    <p key={i} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:i===0?22:i===KAZAN_VOW.length-1?21:18, fontStyle:"italic", color:i===0||i===KAZAN_VOW.length-1?C.goldLight:C.text, lineHeight:1.7, borderLeft:i===0?`3px solid ${C.gold}`:"none", paddingLeft:i===0?16:0, fontWeight:300 }}>{line}</p>
                  ))}
                </div>
              </div>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 20px" }}>
                <p style={{ color:C.muted, fontSize:13, lineHeight:1.8 }}>Elia Kazan (1909–2003) was one of the most influential directors in American theatre and film — responsible for some of the great performances of the 20th century. He wrote The Actor's Vow as a declaration of what it truly means to show up as yourself on stage.</p>
              </div>
            </div>
          )}

          {/* THE CIRCLE */}
          {tab==="circle" && <div className="fu"><TheCircle /></div>}

          {/* RESTING */}
          {tab==="resting" && <div className="fu"><RestingTab /></div>}

          {/* COMMUNITY */}
          {tab==="community" && (
            <div className="fu" style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div><Heading>The Green Room</Heading><p style={{ color:C.muted, fontSize:14 }}>You are not alone in this work.</p></div>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:18 }}>
                <p style={{ color:C.muted, fontSize:12, marginBottom:10, fontStyle:"italic" }}>Posts below are placeholders — real posts will come from your community once live.</p>
                <textarea placeholder="Share something — a win, a worry, a wisdom..." style={{ width:"100%", background:"transparent", border:"none", color:C.text, fontSize:15, fontFamily:"'Lato',sans-serif", resize:"none", outline:"none", lineHeight:1.7, minHeight:70 }} />
                <div style={{ display:"flex", justifyContent:"flex-end" }}>
                  <button style={{ padding:"8px 20px", borderRadius:40, background:C.sage, border:"none", color:C.bg, fontWeight:700, cursor:"pointer", fontSize:13 }}>Share</button>
                </div>
              </div>
              {COMMUNITY_POSTS.map((post,i)=>(
                <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:`${post.color}33`, border:`1px solid ${post.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:post.color, flexShrink:0 }}>{post.avatar}</div>
                    <div><p style={{ fontWeight:600, fontSize:14 }}>{post.name}</p><p style={{ fontSize:12, color:C.muted }}>{post.time}</p></div>
                  </div>
                  <p style={{ color:C.text, lineHeight:1.7, fontSize:14, marginBottom:12 }}>{post.text}</p>
                  <button onClick={()=>setHearts(h=>({...h,[i]:!h[i]}))} style={{ background:"none", border:"none", cursor:"pointer", color:hearts[i]?C.rose:C.muted, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                    {hearts[i]?"♥":"♡"} {post.hearts+(hearts[i]?1:0)}
                  </button>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>

      {menuOpen && (
        <div className="menu-overlay slide-up">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            {NAV.filter(n=>!["home","mylibrary","circle","journal","resting"].includes(n.id)).map(item=>(
              <button key={item.id} onClick={()=>goTo(item.id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"12px 8px", borderRadius:12, border:`1px solid ${tab===item.id?C.gold:C.border}`, background:tab===item.id?`${C.gold}18`:"transparent", color:tab===item.id?C.gold:C.muted, cursor:"pointer" }}>
                <span style={{ fontSize:18 }}>{item.icon}</span>
                <span style={{ fontSize:11 }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        {BOTTOM_NAV.map(item=>{
          const isMore=item.id==="more"; const isActive=isMore?menuOpen:tab===item.id;
          return (
            <button key={item.id} className="bottom-nav-item" onClick={()=>isMore?setMenuOpen(m=>!m):goTo(item.id)} style={{ color:isActive?C.gold:C.muted }}>
              <span style={{ fontSize:18, lineHeight:1 }}>{item.icon}</span>
              <span style={{ fontSize:10 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
