import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const colors = {
  lova: "#0e081f", white: "white", green: "#406D61", navy: "#12284B",
  lav: "#BFB6CE", lavSofter: "#F3F0F8", sage: "#406D61", sageDark: "#34574d",
  sageLight: "#6B9B8E", text: "#2c2840", muted: "#7a7090",
  error: "#b5443a", errorBg: "#fdf5f5", errorBorder: "#c0392b",
};

function Sprig() {
  return (
    <svg viewBox="0 0 100 180" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <line x1="50" y1="180" x2="50" y2="52" stroke={colors.lova} strokeWidth="1.5" />
      <line x1="32" y1="180" x2="32" y2="72" stroke={colors.lova} strokeWidth="1.2" />
      <line x1="68" y1="180" x2="68" y2="68" stroke={colors.lova} strokeWidth="1.2" />
      <ellipse cx="50" cy="42" rx="9" ry="18" fill={colors.lova} />
      <ellipse cx="32" cy="60" rx="7" ry="14" fill={colors.lova} />
      <ellipse cx="68" cy="56" rx="7" ry="14" fill={colors.lova} />
      <ellipse cx="40" cy="98" rx="9" ry="3.5" fill={colors.green} opacity="0.7" transform="rotate(-28 40 98)" />
      <ellipse cx="60" cy="98" rx="9" ry="3.5" fill={colors.green} opacity="0.7" transform="rotate(28 60 98)" />
      <ellipse cx="40" cy="120" rx="9" ry="3.5" fill={colors.green} opacity="0.6" transform="rotate(-28 40 120)" />
      <ellipse cx="60" cy="120" rx="9" ry="3.5" fill={colors.green} opacity="0.6" transform="rotate(28 60 120)" />
    </svg>
  );
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [backendError, setBackendError] = useState("");

  const validate = (field, val) => {
    if (field === "password") {
      if (!val) return "Password is required.";
      if (val.length < 6) return "Password must be at least 6 characters.";
      return "";
    }
    if (field === "confirm") {
      if (!val) return "Please confirm your password.";
      if (val !== password) return "Passwords do not match.";
      return "";
    }
    return "";
  };

  const handleBlur = (field, val) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validate(field, val) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError("");
    const passErr = validate("password", password);
    const confErr = validate("confirm", confirm);
    setErrors({ password: passErr, confirm: confErr });
    setTouched({ password: true, confirm: true });
    if (passErr || confErr) return;
    if (!token) {
      setBackendError("Reset token is missing. Please start over.");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${API_URL}/auth/reset-password`, { token, password });
      setSuccess(true);
      setTimeout(() => navigate("/Login"), 2500);
    } catch (error) {
      setBackendError(error.response?.data?.message || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    background: touched[field] && errors[field] ? colors.errorBg : colors.lavSofter,
    border: `1.5px solid ${touched[field] && errors[field] ? colors.errorBorder : "rgba(191,182,206,0.55)"}`,
    borderRadius: 9, padding: "12px 14px",
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: colors.navy, outline: "none",
  });

  const S = {
    page: { display: "grid", gridTemplateColumns: "55% 45%", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" },
    left: { position: "relative", overflow: "hidden", background: "#0e081f" },
    sceneSvg: { position: "absolute", inset: 0, width: "100%", height: "100%" },
    caption: { position: "absolute", top: 90, left: 44, right: 44, zIndex: 20 },
    eyebrow: { fontSize: 9, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", color: colors.white, marginBottom: 10 },
    captionH2: { fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(28px, 3.2vw, 42px)", lineHeight: 1.18, color: colors.white, marginBottom: 11 },
    captionP: { fontSize: 12.5, fontWeight: 300, color: colors.white, lineHeight: 1.75, maxWidth: 300 },
    right: { background: colors.white, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 52px", position: "relative", borderLeft: "1px solid rgba(191,182,206,0.4)", overflow: "hidden" },
    sprigTR: { position: "absolute", top: -8, right: 10, width: 110, opacity: 0.28, transform: "rotate(-15deg)", pointerEvents: "none" },
    sprigBL: { position: "absolute", bottom: -8, left: 5, width: 90, opacity: 0.22, transform: "rotate(165deg) scaleX(-1)", pointerEvents: "none" },
    formWrap: { width: "100%", maxWidth: 340, zIndex: 1, animation: "fadeUp .8s ease both" },
    h1: { fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 34, lineHeight: 1.15, color: colors.lova, marginBottom: 7 },
    subP: { fontSize: 13, fontWeight: 300, color: colors.lova, lineHeight: 1.65, marginBottom: 28 },
    label: { display: "block", fontSize: 9.5, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: colors.text, opacity: 0.55, marginBottom: 7 },
    errorMsg: { fontSize: 11, color: colors.error, marginTop: 5, fontWeight: 300 },
    btn: {
      width: "100%", padding: 13, borderRadius: 9,
      background: loading ? colors.sageDark : colors.sage,
      color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em",
      boxShadow: "0 4px 14px rgba(64,109,97,0.28)", transition: "background .3s", opacity: loading ? 0.8 : 1, marginTop: 8,
    },
    backendErrorBox: { background: colors.errorBg, border: `1px solid ${colors.errorBorder}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: colors.error, fontWeight: 400 },
    successBox: { background: "#f0f7f5", border: `1px solid ${colors.sageLight}`, borderRadius: 8, padding: "16px 14px", marginBottom: 16, fontSize: 13, color: colors.sage, fontWeight: 400, lineHeight: 1.6 },
    backLink: { display: "block", textAlign: "center", marginTop: 20, fontSize: 12, fontWeight: 300, color: colors.muted, cursor: "pointer" },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
        input::placeholder { color: rgba(44,40,64,0.28); font-style: italic; }
      `}</style>
      <div style={S.page}>
        <div style={S.left}>
          <div style={S.caption}>
            <p style={S.eyebrow}>Heart Island · Lavender Retreat</p>
            <h2 style={S.captionH2}>A fresh<br /><em style={{ fontStyle: "italic" }}>beginning</em></h2>
            <p style={S.captionP}>Set a new password and step back into your island sanctuary.</p>
          </div>
          <svg style={S.sceneSvg} viewBox="0 0 760 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <path d="M0 430 Q150 360 300 400 Q450 435 610 370 Q690 340 760 380 L760 510 L0 510Z" fill="#c8c0da" opacity="0.38" />
            <path d="M0 460 Q130 400 280 435 Q430 468 580 405 Q680 370 760 415 L760 530 L0 530Z" fill="#b0a8c8" opacity="0.32" />
            {[30,65,100,135,170,205,240,275,310,345,380,415,450,485,520,555,590,625,660,700,735].map((x) => (
              <g key={x} opacity="0.65"><line x1={x} y1="640" x2={x} y2="614" stroke="#9090b0" strokeWidth="1.1" /><ellipse cx={x} cy="607" rx="5" ry="9" fill="#b2aac8" /></g>
            ))}
            {[0,40,80,120,160,200,240,280,320,360,400,440,480,520,560,600,640,680,720,760].map((x) => (
              <g key={x}><line x1={x} y1="900" x2={x} y2="820" stroke="#76708c" strokeWidth="2" /><ellipse cx={x} cy="802" rx="10" ry="20" fill="#a09ac0" /></g>
            ))}
          </svg>
        </div>
        <div style={S.right}>
          <div style={S.sprigTR}><Sprig /></div>
          <div style={S.sprigBL}><Sprig /></div>
          <div style={S.formWrap}>
            <h1 style={S.h1}>Reset your<br /><em style={{ fontStyle: "italic" }}>password</em></h1>
            <p style={S.subP}>Choose a new password for your account.</p>
            {backendError && <div style={S.backendErrorBox}>{backendError}</div>}
            {success ? (
              <div style={S.successBox}>✅ Password reset! Redirecting you to sign in…</div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: 20 }}>
                  <label style={S.label}>New Password</label>
                  <input
                    type="password" placeholder="••••••••" value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((err) => ({ ...err, password: "" })); }}
                    onBlur={() => handleBlur("password", password)}
                    style={inputStyle("password")}
                  />
                  {touched.password && errors.password && <p style={S.errorMsg}>{errors.password}</p>}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={S.label}>Confirm Password</label>
                  <input
                    type="password" placeholder="••••••••" value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setErrors((err) => ({ ...err, confirm: "" })); }}
                    onBlur={() => handleBlur("confirm", confirm)}
                    style={inputStyle("confirm")}
                  />
                  {touched.confirm && errors.confirm && <p style={S.errorMsg}>{errors.confirm}</p>}
                </div>
                <button type="submit" style={S.btn} disabled={loading}>
                  {loading ? "Resetting…" : "Reset Password"}
                </button>
              </form>
            )}
            <span style={S.backLink} onClick={() => navigate("/Login")}>← Back to sign in</span>
          </div>
        </div>
      </div>
    </>
  );
}
