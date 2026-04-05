import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const colors = {
  lova: "#0e081f",
  white: "white",
  black: "black",
  green: "#406D61",

  navy:      "#12284B",
  lav:       "#BFB6CE",
  lavLight:  "#D4CEDF",
  lavPale:   "#EDE8F4",
  lavSofter: "#F3F0F8",
  sage:      "#406D61",
  sageDark:  "#34574d",
  sageLight: "#6B9B8E",
  cream:     "#FAF7F2",
  text:      "#2c2840",
  muted:     "#7a7090",
  error:     "#b5443a",
  errorBg:   "#fdf5f5",
  errorBorder:"#c0392b",
};

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/* ── Reusable sprig SVG ── */
function Sprig() {
  return (
    <svg viewBox="0 0 100 180" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <line x1="50" y1="180" x2="50" y2="52" stroke={colors.lova} strokeWidth="1.5" />
      <line x1="32" y1="180" x2="32" y2="72" stroke={colors.lova}  strokeWidth="1.2" />
      <line x1="68" y1="180" x2="68" y2="68" stroke={colors.lova}  strokeWidth="1.2" />
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

/* ── Heart icon ── */
function HeartIcon({ size = 20, fill = colors.navy, opacity = 0.85 }) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ width: size, fill, opacity }}>
      <path d="M16 27C16 27 4 19 4 11c0-4.2 3.6-7.5 8-7.5 1.8 0 3.4.7 4 1.6.6-.9 2.2-1.6 4-1.6C24.4 3.5 28 6.8 28 11c0 8-12 16-12 16z" />
    </svg>
  );
}

/* ── Field component ── */
function Field({ label, id, type = "text", placeholder, value, onChange, onBlur, status, errorMsg, children }) {
  const borderColor =
    status === "error" ? colors.errorBorder :
    status === "ok"    ? colors.sageLight   :
    `rgba(191,182,206,0.55)`;
  const bg = status === "error" ? colors.errorBg : colors.lavSofter;

  return (
    <div className="login-field-wrap">
      {label && (
        <label className="login-field-label">
          {label}
        </label>
      )}
      <div className="login-field-inner">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={type === "email" ? "email" : type === "password" ? "current-password" : "off"}
          style={{
            width: "100%", background: bg,
            border: `1.5px solid ${borderColor}`,
            borderRadius: 9, padding: "12px 38px 12px 14px",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            fontWeight: 300, color: colors.navy, outline: "none",
            transition: "border-color .25s, background .25s, box-shadow .25s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = colors.lav;
            e.target.style.background = "#fff";
            e.target.style.boxShadow = "0 0 0 3px rgba(191,182,206,0.22)";
          }}
        />
        {children}
      </div>
      {status === "error" && (
        <p className="login-field-error-msg">
          {errorMsg}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════
   LOGIN PAGE
══════════════════════════════ */
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});

  const validate = (field, val) => {
    if (field === "email")    return isEmail(val) ? "ok" : "error";
    if (field === "password") return val.length >= 8 ? "ok" : "error";
    return null;
  };

  const handleBlur = (field, val) => {
    if (!val) return;
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validate(field, val) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailStatus = validate("email", email);
    const passStatus  = validate("password", password);
    setErrors({ email: emailStatus, password: passStatus });
    setTouched({ email: true, password: true });
    if (emailStatus === "ok" && passStatus === "ok") {
      navigate("/validation");
    }
  };

  return (
    <div className="login-page">

      {/* ── LEFT PANEL ── */}
      <div className="login-left">

        {/* Caption */}
        <div className="login-caption">
          <p className="login-eyebrow">Heart Island · Lavender Retreat</p>
          <h2 className="login-caption-h2">
            Where lavender<br />meets the <em style={{ fontStyle: "italic", color: colors.white }}>sea</em>
          </h2>
          <p className="login-caption-p">A heart-shaped island wrapped in lavender fields and ocean air. Your escape is always waiting.</p>
        </div>

        <svg className="login-scene-svg" viewBox="0 0 760 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs></defs>
          <path d="M0 430 Q150 360 300 400 Q450 435 610 370 Q690 340 760 380 L760 510 L0 510Z" fill="#c8c0da" opacity="0.38" />
          <path d="M0 460 Q130 400 280 435 Q430 468 580 405 Q680 370 760 415 L760 530 L0 530Z" fill="#b0a8c8" opacity="0.32" />
          <rect x="0" y="508" width="760" height="50" fill="url(#water)" opacity="0.55" />
          <path d="M0 518 Q95 512 190 518 Q285 524 380 518 Q475 512 570 518 Q665 524 760 518" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

          {/* Lavender rows — far */}
          {[30,65,100,135,170,205,240,275,310,345,380,415,450,485,520,555,590,625,660,700,735].map((x) => (
            <g key={x} opacity="0.65">
              <line x1={x} y1="640" x2={x} y2="614" stroke="#9090b0" strokeWidth="1.1" />
              <ellipse cx={x} cy="607" rx="5" ry="9" fill={x % 60 === 0 ? "#bbb3cc" : "#b2aac8"} />
            </g>
          ))}
          {/* Lavender rows — mid */}
          {[15,55,95,135,175,215,255,295,335,375,415,455,495,535,575,615,655,695,735].map((x) => (
            <g key={x} opacity="0.82">
              <line x1={x} y1="710" x2={x} y2="673" stroke="#888" strokeWidth="1.4" />
              <ellipse cx={x} cy="666" rx="7" ry="14" fill={x % 80 === 0 ? "#b2aac8" : "#a8a0c4"} />
            </g>
          ))}
          {/* Lavender rows — foreground */}
          {[0,40,80,120,160,200,240,280,320,360,400,440,480,520,560,600,640,680,720,760].map((x) => (
            <g key={x}>
              <line x1={x} y1="900" x2={x} y2="820" stroke="#76708c" strokeWidth="2" />
              <ellipse cx={x} cy="802" rx="10" ry="20" fill={x % 80 === 0 ? "#b4aed0" : x % 40 === 0 ? "#aaa4c8" : "#a09ac0"} />
            </g>
          ))}
        </svg>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="login-right">
        <div className="login-sprig-tr"><Sprig /></div>
        <div className="login-sprig-bl"><Sprig /></div>
        <div className="login-form-wrap">

          <h1 className="login-h1">
            Sign <em style={{ fontStyle: "italic", color: colors.lova }}>in</em> to<br />your island
          </h1>
          <p className="login-sub-p">Welcome back. The lavender is in bloom.</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <Field
              label="Email Address"
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email", email)}
              status={touched.email ? errors.email : undefined}
              errorMsg="Please enter a valid email address."
            >
              <svg style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", width:18, opacity:0.4, pointerEvents:"none" }}
                viewBox="0 0 20 40" xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="40" x2="10" y2="14" stroke="#0e081f" strokeWidth="1.5" />
                <ellipse cx="10" cy="9" rx="6" ry="11" fill={colors.lav} />
              </svg>
            </Field>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <div className="login-pass-header">
                <span className="login-pass-label">Password</span>
                <a href="#" className="login-forgot-link">Forgot password?</a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password", password)}
                  style={{
                    width: "100%", background: touched.password && errors.password === "error" ? colors.white : colors.white,
                    border: `1.5px solid ${touched.password && errors.password === "error" ? colors.lova : touched.password && errors.password === "ok" ? colors.lova : "rgba(191,182,206,0.55)"}`,
                    borderRadius: 9, padding: "12px 14px",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: colors.lova, outline: "none",
                  }}
                />
              </div>
              {touched.password && errors.password === "error" && (
                <p className="login-field-error-msg">
                  Password must be at least 8 characters.
                </p>
              )}
            </div>

            {/* Remember me */}
            <div className="login-remember-row">
              <div
                className="login-checkbox"
                onClick={() => setRemember(!remember)}
                style={{ background: remember ? colors.lova : colors.white }}
              >
                {remember && <span className="login-checkbox-tick" />}
              </div>
              <span className="login-remember-text" onClick={() => setRemember(!remember)}>Keep me signed in</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-btn-cta"
              onMouseEnter={(e) => { e.currentTarget.style.background = colors.green; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = colors.green; e.currentTarget.style.transform = "none"; }}
            >
              <svg viewBox="0 0 20 20" style={{ width: 0, opacity: 0.85 }} fill="none" xmlns="http://www.w3.org/2000/svg" />
              Enter the Island
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">or</span>
            <div className="login-divider-line" />
          </div>

          <p className="login-signup-prompt">
            New to Lovender?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: colors.navy, fontWeight: 500, cursor: "pointer", borderBottom: `1px solid ${colors.lav}`, paddingBottom: 1 }}
            >
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}