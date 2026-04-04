import { useState } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  navy:       "#12284B",
  lav:        "#BFB6CE",
  lavLight:   "#D4CEDF",
  lavPale:    "#EDE8F4",
  lavSofter:  "#F3F0F8",
  sage:       "#406D61",
  sageDark:   "#34574d",
  sageLight:  "#6B9B8E",
  cream:      "#FAF7F2",
  text:       "#2c2840",
  muted:      "#7a7090",
  error:      "#b5443a",
  errorBg:    "#fdf5f5",
  errorBorder:"#c0392b",
};

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function HeartIcon({ size = 20, fill = colors.navy, opacity = 0.85 }) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ width: size, fill, opacity }}>
      <path d="M16 27C16 27 4 19 4 11c0-4.2 3.6-7.5 8-7.5 1.8 0 3.4.7 4 1.6.6-.9 2.2-1.6 4-1.6C24.4 3.5 28 6.8 28 11c0 8-12 16-12 16z" />
    </svg>
  );
}

/* Password strength helper */
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "Weak",   color: "#c0392b" },
    { label: "Fair",   color: "#e67e22" },
    { label: "Good",   color: "#f0a500" },
    { label: "Strong", color: colors.sage },
  ];
  return { score, ...map[score - 1] || { label: "", color: "transparent" } };
}

/* ── Styled input ── */
function FormInput({ label, id, type="text", placeholder, value, onChange, onBlur, status, errorMsg, extra }) {
  const [focused, setFocused] = useState(false);
  const borderColor =
    status === "error" ? colors.errorBorder :
    status === "ok"    ? colors.sageLight   :
    focused            ? colors.lav         : "rgba(191,182,206,0.55)";
  const bg = status === "error" ? colors.errorBg : focused ? "#fff" : colors.lavSofter;
  const shadow = focused ? "0 0 0 3px rgba(191,182,206,0.22)" : "none";

  return (
    <div>
      {label && (
        <label style={{
          display:"block", fontSize:9.5, fontWeight:500, letterSpacing:"0.2em",
          textTransform:"uppercase", color:colors.text, opacity:0.55, marginBottom:6,
        }}>{label}</label>
      )}
      <input
        id={id} type={type} placeholder={placeholder} value={value}
        onChange={onChange}
        onBlur={() => { setFocused(false); onBlur && onBlur(); }}
        onFocus={() => setFocused(true)}
        style={{
          width:"100%", background:bg, border:`1.5px solid ${borderColor}`,
          borderRadius:9, padding:"11px 14px", fontFamily:"'DM Sans',sans-serif",
          fontSize:14, fontWeight:300, color:colors.navy, outline:"none",
          transition:"border-color .25s,background .25s,box-shadow .25s",
          boxShadow: shadow,
        }}
      />
      {extra}
      {status === "error" && <p style={{ fontSize:10.5, color:colors.error, marginTop:4, fontWeight:300 }}>{errorMsg}</p>}
    </div>
  );
}

/* ══════════════════════════════
   SIGNUP PAGE
══════════════════════════════ */
export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ fname:"", lname:"", email:"", phone:"", password:"", confirm:"" });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [terms, setTerms]     = useState(false);

  const strength = getStrength(form.password);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (field, val) => {
    if (field === "fname" || field === "lname") return val.trim() ? "ok" : "error";
    if (field === "email")    return isEmail(val) ? "ok" : "error";
    if (field === "password") return val.length >= 8 ? "ok" : "error";
    if (field === "confirm")  return val === form.password && val ? "ok" : "error";
    return null;
  };

  const touch = (field) => () => {
    const val = form[field];
    if (!val && field !== "fname" && field !== "lname") return;
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validate(field, val) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fields = ["fname","lname","email","password","confirm"];
    const newErrors = {};
    fields.forEach((f) => { newErrors[f] = validate(f, form[f]); });
    setErrors(newErrors);
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));
    if (!terms) { alert("Please accept the Terms of Stay to continue."); return; }
    if (fields.every((f) => newErrors[f] === "ok")) navigate("/validation");
  };

  const st = (field) => touched[field] ? errors[field] : undefined;

  const S = {
    page:  { display:"grid", gridTemplateColumns:"45% 55%", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" },
    left:  {
      background: colors.lavPale, position:"relative", overflow:"hidden",
      display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"44px 44px 48px",
    },
    leftOverlay: {
      content:"", position:"absolute", inset:0,
      background:"radial-gradient(ellipse 80% 70% at 30% 40%, rgba(191,182,206,0.4) 0%, transparent 65%)",
      pointerEvents:"none",
    },
    logo:  { display:"flex", alignItems:"center", gap:10, marginBottom:40, position:"relative", zIndex:2 },
    logoText: { fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:400, letterSpacing:"0.15em", color:colors.navy },
    heading: { fontFamily:"'Playfair Display',serif", fontWeight:400, fontSize:"clamp(26px,3vw,38px)", lineHeight:1.2, color:colors.navy, marginBottom:14 },
    sub:   { fontSize:13, fontWeight:300, color:colors.muted, lineHeight:1.75, maxWidth:280, marginBottom:36 },
    perk:  { display:"flex", alignItems:"flex-start", gap:12, marginBottom:18 },
    perkDot: {
      width:34, height:34, borderRadius:"50%", background:"white",
      border:`1.5px solid ${colors.lavLight}`, display:"flex", alignItems:"center",
      justifyContent:"center", fontSize:14, flexShrink:0, color:colors.muted,
    },
    perkStrong: { display:"block", fontSize:13, fontWeight:500, color:colors.navy, marginBottom:2 },
    perkP: { fontSize:11.5, fontWeight:300, color:colors.muted, lineHeight:1.55 },
    right: {
      background:colors.cream, padding:"50px 60px 50px 54px",
      position:"relative", overflow:"hidden", borderLeft:`1px solid rgba(191,182,206,0.4)`,
    },
    back:  {
      display:"inline-flex", alignItems:"center", gap:7, textDecoration:"none",
      fontSize:10, fontWeight:500, letterSpacing:"0.18em", textTransform:"uppercase",
      color:colors.muted, marginBottom:28, cursor:"pointer", background:"none", border:"none",
    },
    badge: {
      display:"inline-flex", alignItems:"center", gap:8, background:colors.lavSofter,
      border:`1px solid ${colors.lavLight}`, borderRadius:20, padding:"5px 14px 5px 8px", marginBottom:14,
    },
    badgeText: { fontSize:9, fontWeight:500, letterSpacing:"0.2em", textTransform:"uppercase", color:colors.muted },
    title: { fontFamily:"'Playfair Display',serif", fontWeight:400, fontSize:32, lineHeight:1.15, color:colors.navy, marginBottom:6 },
    formSub: { fontSize:12.5, fontWeight:300, color:colors.muted, lineHeight:1.6, marginBottom:26 },
    secLabel: {
      display:"flex", alignItems:"center", gap:10, fontSize:9, fontWeight:500,
      letterSpacing:"0.28em", textTransform:"uppercase", color:colors.navy, opacity:0.4, margin:"20px 0 16px",
    },
    row2:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:18 },
    fieldWrap: { marginBottom:18 },
    segBar: { display:"flex", gap:3, marginTop:7 },
    seg: (active, col) => ({
      height:3, flex:1, borderRadius:3,
      background: active ? col : "rgba(191,182,206,0.2)", transition:"background .3s",
    }),
    terms: { display:"flex", alignItems:"flex-start", gap:10, margin:"16px 0 22px" },
    chk: (on) => ({
      width:16, height:16, borderRadius:4, border:`1.5px solid ${colors.lav}`,
      background: on ? colors.lav : colors.lavSofter, cursor:"pointer",
      position:"relative", flexShrink:0, marginTop:2, transition:"background .2s",
    }),
    termsP: { fontSize:12, fontWeight:300, color:colors.muted, lineHeight:1.65, cursor:"pointer", userSelect:"none" },
    termsA: { color:colors.sage, textDecoration:"none" },
    btnCta: {
      width:"100%", padding:13, borderRadius:9, background:colors.sage, color:"#fff", border:"none", cursor:"pointer",
      fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, letterSpacing:"0.06em",
      display:"flex", alignItems:"center", justifyContent:"center", gap:9,
      boxShadow:"0 4px 14px rgba(64,109,97,0.28)", transition:"background .3s,transform .2s",
    },
    loginPrompt: { textAlign:"center", fontSize:12, fontWeight:300, color:colors.muted, marginTop:16 },
  };

  const perks = [
    { icon: "✦", title: "Priority Bookings", desc: "Reserve suites before they open to the public." },
    { icon: "❋", title: "Lavender Welcome Kit", desc: "Fresh sprigs, island salt, and a hand-poured candle in every room." },
    { icon: "◈", title: "Sunrise Field Walks", desc: "Exclusive guided walks through the lavender fields at dawn." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:none;} }
        input::placeholder { color:rgba(44,40,64,0.28); font-style:italic; }
      `}</style>

      <div style={S.page}>

        {/* ── LEFT ── */}
        <div style={S.left}>
          <div style={S.leftOverlay} />

          {/* Big botanical sprig art */}
          <svg style={{ position:"absolute", bottom:0, right:-20, zIndex:1, width:220, opacity:0.35, pointerEvents:"none" }}
            viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
            <line x1="100" y1="400" x2="100" y2="40" stroke="#9b92b8" strokeWidth="2.5" />
            <line x1="65"  y1="400" x2="65"  y2="80" stroke="#9b92b8" strokeWidth="1.8" />
            <line x1="135" y1="400" x2="135" y2="72" stroke="#9b92b8" strokeWidth="1.8" />
            <line x1="45"  y1="400" x2="45"  y2="130" stroke="#9b92b8" strokeWidth="1.4" />
            <line x1="155" y1="400" x2="155" y2="120" stroke="#9b92b8" strokeWidth="1.4" />
            <line x1="28"  y1="380" x2="28"  y2="200" stroke="#9b92b8" strokeWidth="1.1" />
            <line x1="172" y1="380" x2="172" y2="190" stroke="#9b92b8" strokeWidth="1.1" />
            <ellipse cx="100" cy="25"  rx="13" ry="28" fill={colors.lav} />
            <ellipse cx="65"  cy="65"  rx="10" ry="22" fill="#C4BCE0" />
            <ellipse cx="135" cy="58"  rx="10" ry="22" fill={colors.lav} />
            <ellipse cx="45"  cy="115" rx="8"  ry="18" fill="#C4BCE0" />
            <ellipse cx="155" cy="107" rx="8"  ry="18" fill={colors.lav} />
            <ellipse cx="28"  cy="186" rx="6"  ry="14" fill="#C4BCE0" />
            <ellipse cx="172" cy="176" rx="6"  ry="14" fill={colors.lav} />
            {[[82,180],[118,180],[82,240],[118,240],[82,310],[118,310]].map(([cx,cy],i) => (
              <ellipse key={i} cx={cx} cy={cy} rx="15" ry="5" fill={colors.sage} opacity="0.55"
                transform={`rotate(${cx < 100 ? -30 : 30} ${cx} ${cy})`} />
            ))}
          </svg>

          <div style={{ position:"relative", zIndex:2 }}>
            <div style={S.logo}>
              <HeartIcon size={26} />
              <span style={S.logoText}>LOVENDER</span>
            </div>
            <h2 style={S.heading}>
              Your <em style={{ fontStyle:"italic", color:colors.sage }}>island</em><br />
              adventure<br />starts here
            </h2>
            <p style={S.sub}>Join the Lovender family and unlock early access to lavender-season stays, curated arrivals, and member-only experiences.</p>
            {perks.map((p) => (
              <div key={p.title} style={S.perk}>
                <div style={S.perkDot}>{p.icon}</div>
                <div>
                  <strong style={S.perkStrong}>{p.title}</strong>
                  <p style={S.perkP}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div style={S.right}>
          {/* top sprig accent */}
          <svg style={{ position:"absolute", top:-5, right:30, width:80, opacity:0.2, pointerEvents:"none" }}
            viewBox="0 0 80 140" xmlns="http://www.w3.org/2000/svg">
            <line x1="40" y1="140" x2="40" y2="38" stroke="#9b92b8" strokeWidth="1.5" />
            <line x1="22" y1="130" x2="22" y2="60" stroke="#9b92b8" strokeWidth="1.1" />
            <line x1="58" y1="130" x2="58" y2="56" stroke="#9b92b8" strokeWidth="1.1" />
            <ellipse cx="40" cy="28" rx="9" ry="18" fill={colors.lav} />
            <ellipse cx="22" cy="48" rx="7" ry="14" fill={colors.lav} />
            <ellipse cx="58" cy="44" rx="7" ry="14" fill={colors.lav} />
          </svg>

          <div style={{ maxWidth:420, margin:"0 auto", animation:"fadeUp .8s ease both" }}>
            <button style={S.back} onClick={() => navigate("/login")}>
              ← Back to Login
            </button>

            <div style={S.badge}>
              <HeartIcon size={14} fill={colors.lav} opacity={1} />
              <span style={S.badgeText}>New Member</span>
            </div>

            <h2 style={S.title}>
              Join <em style={{ fontStyle:"italic", color:colors.muted }}>Lovender</em>
            </h2>
            <p style={S.formSub}>Create your account and step onto the island.</p>

            <form onSubmit={handleSubmit} noValidate>

              <div style={S.secLabel}>
                Personal Details
                <div style={{ flex:1, height:1, background:"rgba(191,182,206,0.5)" }} />
              </div>

              <div style={S.row2}>
                <div>
                  <FormInput label="First Name" id="fname" placeholder="Élise"
                    value={form.fname} onChange={update("fname")} onBlur={touch("fname")}
                    status={st("fname")} errorMsg="Required." />
                </div>
                <div>
                  <FormInput label="Last Name" id="lname" placeholder="Moreau"
                    value={form.lname} onChange={update("lname")} onBlur={touch("lname")}
                    status={st("lname")} errorMsg="Required." />
                </div>
              </div>

              <div style={S.fieldWrap}>
                <FormInput label="Email Address" id="email" type="email" placeholder="your@email.com"
                  value={form.email} onChange={update("email")} onBlur={touch("email")}
                  status={st("email")} errorMsg="Please enter a valid email address." />
              </div>

              <div style={S.fieldWrap}>
                <FormInput label="Phone (optional)" id="phone" type="tel" placeholder="+1 000 000 0000"
                  value={form.phone} onChange={update("phone")} />
              </div>

              <div style={S.secLabel}>
                Account Security
                <div style={{ flex:1, height:1, background:"rgba(191,182,206,0.5)" }} />
              </div>

              <div style={S.fieldWrap}>
                <label style={{ display:"block", fontSize:9.5, fontWeight:500, letterSpacing:"0.2em", textTransform:"uppercase", color:colors.text, opacity:0.55, marginBottom:6 }}>
                  Password
                </label>
                <input
                  type="password" placeholder="Min. 8 characters" value={form.password}
                  onChange={update("password")} onBlur={touch("password")}
                  style={{
                    width:"100%", background: st("password") === "error" ? colors.errorBg : colors.lavSofter,
                    border:`1.5px solid ${st("password")==="error" ? colors.errorBorder : st("password")==="ok" ? colors.sageLight : "rgba(191,182,206,0.55)"}`,
                    borderRadius:9, padding:"11px 14px", fontFamily:"'DM Sans',sans-serif",
                    fontSize:14, fontWeight:300, color:colors.navy, outline:"none",
                  }}
                />
                {/* Strength bar */}
                {form.password && (
                  <>
                    <div style={S.segBar}>
                      {[1,2,3,4].map((n) => (
                        <div key={n} style={S.seg(n <= strength.score, strength.color)} />
                      ))}
                    </div>
                    <p style={{ fontSize:10, color:colors.muted, marginTop:4, letterSpacing:"0.08em" }}>
                      {strength.label}
                    </p>
                  </>
                )}
                {st("password") === "error" && (
                  <p style={{ fontSize:10.5, color:colors.error, marginTop:4, fontWeight:300 }}>Must be at least 8 characters.</p>
                )}
              </div>

              <div style={S.fieldWrap}>
                <FormInput label="Confirm Password" id="confirm" type="password" placeholder="••••••••"
                  value={form.confirm} onChange={update("confirm")} onBlur={touch("confirm")}
                  status={st("confirm")} errorMsg="Passwords do not match." />
              </div>

              {/* Terms */}
              <div style={S.terms}>
                <div style={S.chk(terms)} onClick={() => setTerms(!terms)}>
                  {terms && (
                    <span style={{
                      position:"absolute", top:3, left:5, width:4, height:7,
                      borderRight:"1.5px solid white", borderBottom:"1.5px solid white",
                      transform:"rotate(45deg)", display:"block",
                    }} />
                  )}
                </div>
                <p style={S.termsP} onClick={() => setTerms(!terms)}>
                  I agree to Lovender's <a href="#" style={S.termsA}>Terms of Stay</a> and{" "}
                  <a href="#" style={S.termsA}>Privacy Charter</a>, including updates about island experiences.
                </p>
              </div>

              <button
                type="submit" style={S.btnCta}
                onMouseEnter={(e) => { e.currentTarget.style.background = colors.sageDark; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = colors.sage; }}
              >
                <HeartIcon size={15} fill="white" opacity={0.85} />
                Create My Account
              </button>
            </form>

            <p style={S.loginPrompt}>
              Already a member?{" "}
              <span
                onClick={() => navigate("/login")}
                style={{ color:colors.navy, fontWeight:500, cursor:"pointer", borderBottom:`1px solid ${colors.lav}`, paddingBottom:1 }}
              >
                Sign in here
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
