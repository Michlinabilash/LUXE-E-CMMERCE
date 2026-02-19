import { useState, useEffect, useCallback } from "react";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────── */
const injectStyles = () => {
  const el = document.createElement("style");
  el.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Outfit', sans-serif; background: #faf9f7; color: #1a1a1a; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #f0ede8; }
    ::-webkit-scrollbar-thumb { background: #c9a96e; border-radius: 10px; }

    @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
    @keyframes slideInR { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
    @keyframes slideInL { from { opacity:0; transform:translateX(-60px); } to { opacity:1; transform:translateX(0); } }
    @keyframes spin     { to { transform:rotate(360deg); } }
    @keyframes pop      { 0%{transform:scale(1)} 40%{transform:scale(1.3)} 100%{transform:scale(1)} }
    @keyframes toast    { 0%{opacity:0;transform:translateX(100%)} 10%{opacity:1;transform:translateX(0)} 85%{opacity:1;transform:translateX(0)} 100%{opacity:0;transform:translateX(100%)} }
    @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.5} }

    .fade-up    { animation: fadeUp  .55s cubic-bezier(.22,1,.36,1) both; }
    .fade-in    { animation: fadeIn  .4s ease both; }
    .slide-r    { animation: slideInR .5s cubic-bezier(.22,1,.36,1) both; }
    .slide-l    { animation: slideInL .5s cubic-bezier(.22,1,.36,1) both; }

    .btn-gold {
      display:inline-flex; align-items:center; justify-content:center; gap:8px;
      padding:13px 28px; background:linear-gradient(135deg,#c9a96e,#e8c88a,#c9a96e);
      background-size:200% auto; border:none; border-radius:8px;
      color:#fff; font-family:'Outfit',sans-serif; font-weight:600; font-size:14px;
      cursor:pointer; transition:all .3s ease; letter-spacing:.03em;
    }
    .btn-gold:hover { background-position:right center; box-shadow:0 6px 24px rgba(201,169,110,.4); transform:translateY(-1px); }
    .btn-gold:active { transform:translateY(0); }
    .btn-gold:disabled { opacity:.6; cursor:not-allowed; transform:none; }

    .btn-outline {
      display:inline-flex; align-items:center; justify-content:center; gap:8px;
      padding:12px 24px; background:transparent;
      border:1.5px solid #1a1a1a; border-radius:8px;
      color:#1a1a1a; font-family:'Outfit',sans-serif; font-weight:600; font-size:14px;
      cursor:pointer; transition:all .25s ease;
    }
    .btn-outline:hover { background:#1a1a1a; color:#fff; }

    .btn-ghost {
      background:none; border:none; cursor:pointer; font-family:'Outfit',sans-serif;
      color:#666; transition:color .2s; padding:4px 8px; font-size:13px;
    }
    .btn-ghost:hover { color:#1a1a1a; }

    .card {
      background:#fff; border-radius:16px;
      box-shadow:0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04);
      overflow:hidden; transition:all .3s ease;
    }
    .card:hover { box-shadow:0 8px 32px rgba(0,0,0,.1); transform:translateY(-4px); }

    .input-field {
      width:100%; padding:12px 16px;
      border:1.5px solid #e5e0d8; border-radius:8px;
      font-family:'Outfit',sans-serif; font-size:14px;
      color:#1a1a1a; background:#fff; outline:none;
      transition:border-color .25s, box-shadow .25s;
    }
    .input-field::placeholder { color:#aaa; }
    .input-field:focus { border-color:#c9a96e; box-shadow:0 0 0 3px rgba(201,169,110,.15); }
    .input-field.err { border-color:#ef4444; }

    .badge {
      position:absolute; top:-6px; right:-6px;
      width:18px; height:18px; border-radius:50%;
      background:#ef4444; color:#fff; font-size:10px; font-weight:700;
      display:flex; align-items:center; justify-content:center;
      animation: pop .3s ease;
    }

    .tag {
      display:inline-block; padding:3px 10px; border-radius:20px;
      font-size:11px; font-weight:600; letter-spacing:.04em; text-transform:uppercase;
    }

    .skeleton {
      background:linear-gradient(90deg,#f0ede8 25%,#faf9f7 50%,#f0ede8 75%);
      background-size:400px 100%; animation:shimmer 1.4s ease infinite;
      border-radius:8px;
    }

    .star { color:#f59e0b; font-size:13px; }

    .nav-link {
      background:none; border:none; cursor:pointer; font-family:'Outfit',sans-serif;
      font-size:14px; font-weight:500; color:#555; padding:6px 4px;
      border-bottom:2px solid transparent; transition:all .2s; letter-spacing:.02em;
    }
    .nav-link:hover, .nav-link.active { color:#1a1a1a; border-bottom-color:#c9a96e; }

    .toast-item {
      padding:14px 20px; background:#1a1a1a; color:#fff; border-radius:10px;
      font-size:13px; font-weight:500; display:flex; align-items:center; gap:10px;
      box-shadow:0 8px 24px rgba(0,0,0,.3); animation:toast 3.2s ease forwards;
      border-left:3px solid #c9a96e; min-width:260px;
    }

    .qty-btn {
      width:32px; height:32px; border-radius:6px; border:1.5px solid #e5e0d8;
      background:#fff; cursor:pointer; font-size:16px; font-weight:600;
      display:flex; align-items:center; justify-content:center;
      transition:all .2s; color:#1a1a1a;
    }
    .qty-btn:hover { border-color:#c9a96e; background:#fdf8f0; }

    .filter-chip {
      padding:7px 16px; border-radius:20px; border:1.5px solid #e5e0d8;
      background:#fff; font-family:'Outfit',sans-serif; font-size:13px; font-weight:500;
      cursor:pointer; transition:all .2s; color:#555;
    }
    .filter-chip:hover, .filter-chip.active {
      border-color:#c9a96e; background:#fdf8f0; color:#c9a96e;
    }

    .wishlist-btn {
      position:absolute; top:12px; right:12px; width:34px; height:34px;
      border-radius:50%; background:rgba(255,255,255,.9); border:none;
      cursor:pointer; font-size:16px; display:flex; align-items:center;
      justify-content:center; transition:all .2s; backdrop-filter:blur(4px);
      box-shadow:0 2px 8px rgba(0,0,0,.1);
    }
    .wishlist-btn:hover { transform:scale(1.1); background:#fff; }

    .checkout-step {
      display:flex; align-items:center; gap:8px;
    }
    .step-dot {
      width:28px; height:28px; border-radius:50%; border:2px solid #e5e0d8;
      display:flex; align-items:center; justify-content:center;
      font-size:12px; font-weight:700; color:#aaa; flex-shrink:0;
      transition:all .3s;
    }
    .step-dot.done { background:#c9a96e; border-color:#c9a96e; color:#fff; }
    .step-dot.active { border-color:#c9a96e; color:#c9a96e; }

    .order-card {
      border:1.5px solid #f0ede8; border-radius:12px; padding:20px;
      transition:border-color .2s;
    }
    .order-card:hover { border-color:#c9a96e; }

    select.input-field { cursor:pointer; }
    textarea.input-field { resize:vertical; min-height:80px; }

    .product-img {
      width:100%; aspect-ratio:1; object-fit:cover;
      transition:transform .4s ease;
    }
    .card:hover .product-img { transform:scale(1.05); }

    .hero-section {
      min-height:88vh; display:flex; align-items:center;
      background:linear-gradient(135deg,#1a1208 0%,#2d1f0a 40%,#1a1208 100%);
      position:relative; overflow:hidden;
    }
    .hero-section::before {
      content:''; position:absolute; inset:0;
      background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
  `;
  document.head.appendChild(el);
};
injectStyles();

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const PRODUCTS = [
  { id:1, name:"Noir Oud Perfume", category:"Fragrance", price:4299, originalPrice:5999, image:"https://flora-parfums.com/wp-content/uploads/2025/04/8675-Noir-Al-Majed-Oud.jpg", rating:4.8, reviews:124, badge:"Bestseller", description:"A deep, woody fragrance with notes of oud, amber, and dark musk. Lasts 12+ hours.", stock:15 },
  { id:2, name:"Silk Evening Dress", category:"Fashion", price:8999, originalPrice:12999, image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80", rating:4.6, reviews:89, badge:"New", description:"Handcrafted silk evening dress with delicate embroidery. Perfect for special occasions.", stock:8 },
  { id:3, name:"Leather Tote Bag", category:"Accessories", price:6499, originalPrice:8999, image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", rating:4.9, reviews:203, badge:"Top Rated", description:"Full-grain leather tote with gold hardware. Spacious interior with suede lining.", stock:20 },
  { id:4, name:"Gold Chain Necklace", category:"Jewelry", price:3299, originalPrice:4599, image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", rating:4.7, reviews:156, badge:"Sale", description:"18K gold plated chain necklace with lobster clasp. Tarnish-resistant finish.", stock:30 },
  { id:5, name:"Cashmere Sweater", category:"Fashion", price:5999, originalPrice:7999, image:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", rating:4.5, reviews:67, badge:null, description:"100% pure Mongolian cashmere. Ultra-soft, lightweight, and warm. Relaxed fit.", stock:12 },
  { id:6, name:"Rose Gold Watch", category:"Accessories", price:12999, originalPrice:17999, image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", rating:4.8, reviews:312, badge:"Bestseller", description:"Swiss movement rose gold watch with genuine leather strap. Water-resistant 50m.", stock:5 },
  { id:7, name:"Velvet Heels", category:"Footwear", price:4799, originalPrice:6499, image:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80", rating:4.4, reviews:44, badge:"New", description:"Midnight blue velvet block heels with pointed toe. 3.5 inch heel height.", stock:18 },
  { id:8, name:"Pearl Drop Earrings", category:"Jewelry", price:2199, originalPrice:2999, image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", rating:4.6, reviews:98, badge:"Sale", description:"Genuine freshwater pearl drop earrings with sterling silver posts. 8mm pearls.", stock:25 },
  { id:9, name:"Linen Blazer", category:"Fashion", price:7499, originalPrice:9999, image:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", rating:4.7, reviews:78, badge:null, description:"Tailored linen blazer in natural beige. Single-breasted with notched lapels.", stock:10 },
  { id:10, name:"Satin Clutch", category:"Accessories", price:3499, originalPrice:4999, image:"https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80", rating:4.5, reviews:55, badge:"New", description:"Emerald green satin clutch with gold-tone clasp. Interior mirror and card slots.", stock:14 },
  { id:11, name:"Musk Body Lotion", category:"Fragrance", price:1899, originalPrice:2499, image:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80", rating:4.3, reviews:189, badge:null, description:"Luxurious body lotion with white musk and vanilla. Non-greasy, fast-absorbing.", stock:40 },
  { id:12, name:"Ankle Boot", category:"Footwear", price:5999, originalPrice:7999, image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", rating:4.6, reviews:134, badge:"Bestseller", description:"Genuine leather ankle boot with side zipper. Cushioned insole and rubber sole.", stock:9 },
];

const CATEGORIES = ["All", "Fashion", "Accessories", "Jewelry", "Fragrance", "Footwear"];

/* ─── LOCAL STORAGE HELPERS ─────────────────────────────────────────────── */
const LS = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

/* ─── TOAST ─────────────────────────────────────────────────────────────── */
let _toastId = 0;
function ToastContainer({ toasts }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} className="toast-item">
          <span style={{ fontSize:18 }}>{t.icon || "✦"}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, icon="✦") => {
    const id = ++_toastId;
    setToasts(p => [...p, { id, msg, icon }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);
  return { toasts, add };
}

/* ─── AUTH PAGES ─────────────────────────────────────────────────────────── */
function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const { toasts, add } = useToasts();

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    const e = {};
    if (mode === "register" && !form.name.trim()) e.name = "Name required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
    if (mode === "register" && form.password !== form.confirm) e.confirm = "Passwords don't match";
    if (Object.keys(e).length) { setErrs(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const users = LS.get("ec_users", []);
    if (mode === "login") {
      const u = users.find(u => u.email === form.email && u.password === form.password);
      if (!u) { setErrs({ password: "Invalid credentials" }); setLoading(false); return; }
      LS.set("ec_session", u);
      onAuth(u);
    } else {
      if (users.find(u => u.email === form.email)) { setErrs({ email: "Already registered" }); setLoading(false); return; }
      const u = { id: Date.now().toString(), name: form.name.trim(), email: form.email, password: form.password, createdAt: new Date().toISOString() };
      LS.set("ec_users", [...users, u]);
      LS.set("ec_session", u);
      onAuth(u);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1a1208,#2d1f0a)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <ToastContainer toasts={toasts} />
      <div className="fade-up" style={{ width:"100%", maxWidth:420, background:"#fff", borderRadius:20, padding:"40px 36px", boxShadow:"0 40px 80px rgba(0,0,0,.4)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:28, color:"#1a1a1a", letterSpacing:"-.01em" }}>LUXE</div>
          <div style={{ fontSize:13, color:"#999", marginTop:4 }}>Premium Fashion & Lifestyle</div>
        </div>
        <div style={{ display:"flex", gap:4, background:"#f5f3ef", borderRadius:10, padding:4, marginBottom:28 }}>
          {["login","register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setErrs({}); }} style={{
              flex:1, padding:"10px", border:"none", borderRadius:8,
              background: mode===m ? "#fff" : "transparent",
              color: mode===m ? "#1a1a1a" : "#888",
              fontFamily:"Outfit", fontWeight:600, fontSize:13, cursor:"pointer",
              boxShadow: mode===m ? "0 1px 4px rgba(0,0,0,.1)" : "none",
              transition:"all .25s"
            }}>
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {mode === "register" && (
            <div>
              <input className={`input-field ${errs.name?"err":""}`} placeholder="Full Name" value={form.name} onChange={set("name")} />
              {errs.name && <div style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errs.name}</div>}
            </div>
          )}
          <div>
            <input className={`input-field ${errs.email?"err":""}`} placeholder="Email address" type="email" value={form.email} onChange={set("email")} />
            {errs.email && <div style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errs.email}</div>}
          </div>
          <div>
            <input className={`input-field ${errs.password?"err":""}`} placeholder="Password" type="password" value={form.password} onChange={set("password")} />
            {errs.password && <div style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errs.password}</div>}
          </div>
          {mode === "register" && (
            <div>
              <input className={`input-field ${errs.confirm?"err":""}`} placeholder="Confirm Password" type="password" value={form.confirm} onChange={set("confirm")} />
              {errs.confirm && <div style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errs.confirm}</div>}
            </div>
          )}
          <button className="btn-gold" style={{ width:"100%", padding:"14px" }} onClick={submit} disabled={loading}>
            {loading ? <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.4)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }} /> : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── NAVBAR ─────────────────────────────────────────────────────────────── */
function Navbar({ user, page, setPage, cartCount, wishCount, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      background: scrolled || page !== "home" ? "rgba(255,255,255,.97)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled || page !== "home" ? "1px solid #f0ede8" : "none",
      transition:"all .3s ease", padding:"0 32px",
    }}>
      <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:68 }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{ background:"none", border:"none", cursor:"pointer" }}>
          <div style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:22,
            color: scrolled || page !== "home" ? "#1a1a1a" : "#fff", letterSpacing:".05em" }}>
            LUXE
          </div>
        </button>

        {/* Nav Links */}
        <div style={{ display:"flex", gap:28, alignItems:"center" }}>
          {["home","shop","about"].map(p => (
            <button key={p} className={`nav-link ${page===p?"active":""}`}
              onClick={() => setPage(p)}
              style={{ color: scrolled || page !== "home" ? undefined : "rgba(255,255,255,.8)",
                borderBottomColor: page===p ? "#c9a96e" : "transparent" }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Right Icons */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {/* Wishlist */}
          <button onClick={() => setPage("wishlist")} style={{ position:"relative", background:"none", border:"none", cursor:"pointer", padding:"8px", fontSize:20,
            color: scrolled || page !== "home" ? "#1a1a1a" : "#fff" }}>
            ♡
            {wishCount > 0 && <span className="badge">{wishCount}</span>}
          </button>
          {/* Cart */}
          <button onClick={() => setPage("cart")} style={{ position:"relative", background:"none", border:"none", cursor:"pointer", padding:"8px", fontSize:20,
            color: scrolled || page !== "home" ? "#1a1a1a" : "#fff" }}>
            🛍
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
          {/* User */}
          <button onClick={() => setPage("account")} style={{ display:"flex", alignItems:"center", gap:8,
            background:"none", border:"none", cursor:"pointer",
            color: scrolled || page !== "home" ? "#555" : "rgba(255,255,255,.8)",
            fontFamily:"Outfit", fontSize:13, fontWeight:500 }}>
            <div style={{
              width:32, height:32, borderRadius:"50%",
              background:"linear-gradient(135deg,#c9a96e,#e8c88a)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", fontWeight:700, fontSize:13
            }}>
              {user.name[0].toUpperCase()}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─── HERO ───────────────────────────────────────────────────────────────── */
function HeroSection({ setPage }) {
  return (
    <section className="hero-section">
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 32px", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}>
        <div className="fade-up">
          <div style={{ display:"inline-block", padding:"6px 14px", border:"1px solid rgba(201,169,110,.4)", borderRadius:20, color:"#c9a96e", fontSize:12, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", marginBottom:24 }}>
            New Collection 2025
          </div>
          <h1 style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:"clamp(40px,6vw,72px)", color:"#fff", lineHeight:1.05, marginBottom:20 }}>
            Dress to<br />
            <em style={{ color:"#c9a96e" }}>Impress</em>
          </h1>
          <p style={{ color:"rgba(255,255,255,.5)", fontSize:16, lineHeight:1.7, maxWidth:440, marginBottom:36 }}>
            Discover curated luxury fashion, timeless jewelry, and signature fragrances. Elevate every moment with pieces that speak your style.
          </p>
          <div style={{ display:"flex", gap:16 }}>
            <button className="btn-gold" onClick={() => setPage("shop")} style={{ padding:"15px 32px", fontSize:15 }}>
              Shop Now →
            </button>
            <button className="btn-outline" onClick={() => setPage("about")} style={{ color:"#fff", borderColor:"rgba(255,255,255,.3)", padding:"15px 28px" }}>
              Our Story
            </button>
          </div>
          <div style={{ display:"flex", gap:32, marginTop:48 }}>
            {[["12K+","Happy Customers"],["500+","Premium Products"],["Free","Shipping over ₹999"]].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:22, color:"#c9a96e" }}>{v}</div>
                <div style={{ color:"rgba(255,255,255,.4)", fontSize:12, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="slide-r" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[PRODUCTS[0], PRODUCTS[1], PRODUCTS[2], PRODUCTS[3]].map((p, i) => (
            <div key={p.id} style={{
              borderRadius:12, overflow:"hidden", aspectRatio: i%2===0 ? "0.8" : "1",
              marginTop: i===1||i===3 ? 24 : 0, boxShadow:"0 12px 40px rgba(0,0,0,.4)"
            }}>
              <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRODUCT CARD ───────────────────────────────────────────────────────── */
function ProductCard({ product, onAddCart, onToggleWish, isWished, toast }) {
  const disc = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="card" style={{ position:"relative", cursor:"pointer" }}>
      <div style={{ position:"relative", overflow:"hidden", background:"#f5f3ef" }}>
        <img className="product-img" src={product.image} alt={product.name} />
        {product.badge && (
          <span className="tag" style={{ position:"absolute", top:12, left:12,
            background: product.badge==="Sale"?"#ef4444":product.badge==="New"?"#1a1a1a":"#c9a96e",
            color:"#fff" }}>
            {product.badge}
          </span>
        )}
        <button className="wishlist-btn" onClick={(e) => { e.stopPropagation(); onToggleWish(product); }}>
          {isWished ? "❤️" : "🤍"}
        </button>
      </div>
      <div style={{ padding:"16px" }}>
        <div style={{ fontSize:11, color:"#c9a96e", fontWeight:600, textTransform:"uppercase", letterSpacing:".05em", marginBottom:4 }}>{product.category}</div>
        <div style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:16, color:"#1a1a1a", marginBottom:6, lineHeight:1.3 }}>{product.name}</div>
        <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:10 }}>
          {"★★★★★".split("").map((s,i) => (
            <span key={i} style={{ color: i < Math.floor(product.rating) ? "#f59e0b" : "#ddd", fontSize:12 }}>{s}</span>
          ))}
          <span style={{ fontSize:11, color:"#999", marginLeft:4 }}>({product.reviews})</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <span style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:18, color:"#1a1a1a" }}>₹{product.price.toLocaleString()}</span>
          <span style={{ fontSize:13, color:"#bbb", textDecoration:"line-through" }}>₹{product.originalPrice.toLocaleString()}</span>
          <span style={{ fontSize:11, color:"#10b981", fontWeight:700 }}>{disc}% off</span>
        </div>
        <button className="btn-gold" style={{ width:"100%", padding:"11px", fontSize:13 }}
          onClick={() => { onAddCart(product); toast(`${product.name} added to cart 🛍`, "✦"); }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ─── SHOP PAGE ──────────────────────────────────────────────────────────── */
function ShopPage({ cart, setCart, wishlist, setWishlist, toast }) {
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      const next = ex ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...product, qty: 1 }];
      LS.set("ec_cart", next);
      return next;
    });
  };

  const toggleWish = (product) => {
    setWishlist(prev => {
      const has = prev.find(i => i.id === product.id);
      const next = has ? prev.filter(i => i.id !== product.id) : [...prev, product];
      LS.set("ec_wishlist", next);
      if (!has) toast(`${product.name} added to wishlist ♡`, "♡");
      return next;
    });
  };

  let filtered = PRODUCTS.filter(p => {
    const matchCat = cat === "All" || p.category === cat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sort === "price-asc") filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === "rating") filtered = [...filtered].sort((a,b) => b.rating - a.rating);

  if (selectedProduct) return (
    <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)}
      onAddCart={addToCart} isWished={!!wishlist.find(i => i.id === selectedProduct.id)}
      onToggleWish={toggleWish} toast={toast} />
  );

  return (
    <div style={{ minHeight:"100vh", paddingTop:88, background:"#faf9f7" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"40px 32px" }}>
        {/* Header */}
        <div className="fade-up" style={{ marginBottom:36 }}>
          <h1 style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:40, color:"#1a1a1a", marginBottom:8 }}>Shop</h1>
          <p style={{ color:"#888", fontSize:15 }}>Discover {PRODUCTS.length} premium products</p>
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:16, marginBottom:28, flexWrap:"wrap", alignItems:"center" }}>
          <input className="input-field" placeholder="🔍  Search products…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth:260, padding:"10px 16px" }} />
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-chip ${cat===c?"active":""}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <select className="input-field" value={sort} onChange={e => setSort(e.target.value)}
            style={{ marginLeft:"auto", maxWidth:180, padding:"10px 16px" }}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:"#aaa" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
            <div style={{ fontFamily:"Playfair Display", fontSize:22, color:"#555", marginBottom:8 }}>No products found</div>
            <button className="btn-ghost" onClick={() => { setSearch(""); setCat("All"); }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:24 }}>
            {filtered.map((p, i) => (
              <div key={p.id} className="fade-up" style={{ animationDelay:`${i * 0.05}s` }}
                onClick={() => setSelectedProduct(p)}>
                <ProductCard product={p} onAddCart={addToCart}
                  onToggleWish={toggleWish} isWished={!!wishlist.find(i => i.id === p.id)}
                  toast={toast} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── PRODUCT DETAIL ─────────────────────────────────────────────────────── */
function ProductDetail({ product, onBack, onAddCart, isWished, onToggleWish, toast }) {
  const [qty, setQty] = useState(1);
  const disc = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div style={{ minHeight:"100vh", paddingTop:88, background:"#faf9f7" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 32px" }}>
        <button className="btn-ghost" onClick={onBack} style={{ marginBottom:28, display:"flex", alignItems:"center", gap:6, fontSize:14 }}>
          ← Back to Shop
        </button>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"start" }}>
          <div className="slide-l" style={{ borderRadius:20, overflow:"hidden", background:"#f5f3ef", position:"relative" }}>
            <img src={product.image} alt={product.name} style={{ width:"100%", aspectRatio:"1", objectFit:"cover" }} />
            {product.badge && (
              <span className="tag" style={{ position:"absolute", top:16, left:16,
                background: product.badge==="Sale"?"#ef4444":product.badge==="New"?"#1a1a1a":"#c9a96e", color:"#fff" }}>
                {product.badge}
              </span>
            )}
          </div>
          <div className="slide-r">
            <div style={{ fontSize:12, color:"#c9a96e", fontWeight:600, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>{product.category}</div>
            <h1 style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:36, color:"#1a1a1a", lineHeight:1.1, marginBottom:16 }}>{product.name}</h1>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
              {"★★★★★".split("").map((s,i) => (
                <span key={i} style={{ color: i < Math.floor(product.rating) ? "#f59e0b" : "#ddd", fontSize:16 }}>{s}</span>
              ))}
              <span style={{ color:"#999", fontSize:13 }}>{product.rating} ({product.reviews} reviews)</span>
            </div>
            <p style={{ color:"#666", lineHeight:1.8, fontSize:15, marginBottom:24 }}>{product.description}</p>
            <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:28 }}>
              <span style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:36, color:"#1a1a1a" }}>₹{product.price.toLocaleString()}</span>
              <span style={{ fontSize:16, color:"#bbb", textDecoration:"line-through" }}>₹{product.originalPrice.toLocaleString()}</span>
              <span style={{ padding:"4px 10px", background:"#dcfce7", color:"#16a34a", borderRadius:20, fontSize:13, fontWeight:700 }}>{disc}% off</span>
            </div>
            <div style={{ padding:"16px", background:"#f5f3ef", borderRadius:12, marginBottom:24, fontSize:14, color:"#666" }}>
              <span style={{ color:"#10b981", fontWeight:600 }}>✓ In Stock</span> — {product.stock} units remaining
              &nbsp;&nbsp;|&nbsp;&nbsp; 🚚 Free delivery
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
              <span style={{ fontSize:14, fontWeight:600, color:"#1a1a1a" }}>Qty:</span>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
                <span style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:18, minWidth:28, textAlign:"center" }}>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock,q+1))}>+</button>
              </div>
            </div>
            <div style={{ display:"flex", gap:12 }}>
              <button className="btn-gold" style={{ flex:1, padding:"15px" }}
                onClick={() => { for(let i=0;i<qty;i++) onAddCart(product); toast(`${qty}x ${product.name} added!`,"✦"); }}>
                Add to Cart — ₹{(product.price * qty).toLocaleString()}
              </button>
              <button onClick={() => onToggleWish(product)} style={{
                width:50, height:50, borderRadius:8, border:"1.5px solid #e5e0d8",
                background:"#fff", cursor:"pointer", fontSize:20, display:"flex",
                alignItems:"center", justifyContent:"center", transition:"all .2s",
                flexShrink:0
              }}>
                {isWished ? "❤️" : "🤍"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── CART ───────────────────────────────────────────────────────────────── */
function CartPage({ cart, setCart, setPage, toast }) {
  const updateQty = (id, delta) => {
    setCart(prev => {
      const next = prev.map(i => i.id===id ? { ...i, qty: Math.max(1,i.qty+delta) } : i);
      LS.set("ec_cart", next);
      return next;
    });
  };
  const remove = (id) => {
    setCart(prev => {
      const next = prev.filter(i => i.id !== id);
      LS.set("ec_cart", next);
      return next;
    });
    toast("Item removed from cart", "🗑");
  };

  const subtotal = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (cart.length === 0) return (
    <div style={{ minHeight:"100vh", paddingTop:88, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, background:"#faf9f7" }}>
      <div style={{ fontSize:64 }}>🛍</div>
      <h2 style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:28, color:"#1a1a1a" }}>Your cart is empty</h2>
      <p style={{ color:"#888" }}>Add some beautiful items to get started</p>
      <button className="btn-gold" onClick={() => setPage("shop")} style={{ padding:"13px 28px", marginTop:8 }}>Explore Shop</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", paddingTop:88, background:"#faf9f7" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 32px" }}>
        <h1 className="fade-up" style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:40, marginBottom:36 }}>
          Cart <span style={{ color:"#bbb", fontWeight:400, fontSize:24 }}>({cart.length} {cart.length===1?"item":"items"})</span>
        </h1>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:32, alignItems:"start" }}>
          {/* Items */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {cart.map((item, i) => (
              <div key={item.id} className="fade-up" style={{ animationDelay:`${i*.06}s`,
                background:"#fff", borderRadius:14, padding:"20px", display:"flex", gap:20, alignItems:"center",
                boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
                <img src={item.image} alt={item.name} style={{ width:90, height:90, borderRadius:10, objectFit:"cover", flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, color:"#c9a96e", fontWeight:600, textTransform:"uppercase", letterSpacing:".05em" }}>{item.category}</div>
                  <div style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:17, color:"#1a1a1a", marginTop:2 }}>{item.name}</div>
                  <div style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:18, color:"#1a1a1a", marginTop:6 }}>
                    ₹{(item.price * item.qty).toLocaleString()}
                    <span style={{ fontSize:13, color:"#bbb", fontWeight:400, fontFamily:"Outfit", marginLeft:8 }}>₹{item.price.toLocaleString()} each</span>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                  <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                  <span style={{ fontWeight:700, minWidth:24, textAlign:"center" }}>{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
                <button onClick={() => remove(item.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#ccc", fontSize:18, padding:4, flexShrink:0, transition:"color .2s" }}
                  onMouseEnter={e => e.target.style.color="#ef4444"}
                  onMouseLeave={e => e.target.style.color="#ccc"}>✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background:"#fff", borderRadius:16, padding:"28px", boxShadow:"0 1px 4px rgba(0,0,0,.06)", position:"sticky", top:88 }} className="fade-up">
            <h2 style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:22, marginBottom:24 }}>Order Summary</h2>
            {[["Subtotal", `₹${subtotal.toLocaleString()}`], ["Shipping", shipping===0 ? "FREE" : `₹${shipping}`]].map(([l,v]) => (
              <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:12, fontSize:14, color:"#666" }}>
                <span>{l}</span><span style={{ color: v==="FREE" ? "#10b981" : undefined, fontWeight:600 }}>{v}</span>
              </div>
            ))}
            {shipping > 0 && <div style={{ fontSize:12, color:"#c9a96e", marginBottom:12 }}>Add ₹{(999-subtotal).toLocaleString()} more for free shipping</div>}
            <div style={{ borderTop:"1.5px solid #f0ede8", paddingTop:16, marginTop:4, display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:18 }}>Total</span>
              <span style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:22, color:"#c9a96e" }}>₹{total.toLocaleString()}</span>
            </div>
            <button className="btn-gold" style={{ width:"100%", padding:"15px", marginTop:24, fontSize:15 }} onClick={() => setPage("checkout")}>
              Proceed to Checkout →
            </button>
            <button className="btn-ghost" style={{ width:"100%", marginTop:10 }} onClick={() => setPage("shop")}>Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── CHECKOUT ───────────────────────────────────────────────────────────── */
function CheckoutPage({ cart, setCart, user, setPage, toast }) {
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState({ name: user.name, phone:"", line1:"", city:"", state:"", pin:"" });
  const [payment, setPayment] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [errs, setErrs] = useState({});

  const subtotal = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const validateAddr = () => {
    const e = {};
    if (!addr.phone || addr.phone.length < 10) e.phone = "Valid phone required";
    if (!addr.line1) e.line1 = "Address required";
    if (!addr.city) e.city = "City required";
    if (!addr.state) e.state = "State required";
    if (!addr.pin || addr.pin.length < 6) e.pin = "Valid PIN required";
    return e;
  };

  const placeOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1800));
    const order = {
      id: "LX" + Date.now().toString().slice(-6),
      items: cart,
      total,
      address: addr,
      payment,
      status: "Confirmed",
      date: new Date().toISOString(),
      userId: user.id,
    };
    const orders = LS.get("ec_orders", []);
    LS.set("ec_orders", [...orders, order]);
    LS.set("ec_cart", []);
    setCart([]);
    toast(`Order ${order.id} placed! 🎉`, "🎉");
    setPage("orders");
  };

  const setA = k => e => setAddr(p => ({ ...p, [k]: e.target.value }));

  const steps = ["Address", "Payment", "Review"];

  return (
    <div style={{ minHeight:"100vh", paddingTop:88, background:"#faf9f7" }}>
      <div style={{ maxWidth:880, margin:"0 auto", padding:"40px 32px" }}>
        <h1 className="fade-up" style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:36, marginBottom:8 }}>Checkout</h1>

        {/* Steps */}
        <div className="fade-up" style={{ display:"flex", alignItems:"center", gap:0, marginBottom:40, marginTop:8 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display:"flex", alignItems:"center" }}>
              <div className="checkout-step">
                <div className={`step-dot ${step>i+1?"done":step===i+1?"active":""}`}>
                  {step > i+1 ? "✓" : i+1}
                </div>
                <span style={{ fontSize:13, fontWeight:600, color: step===i+1?"#1a1a1a":"#bbb" }}>{s}</span>
              </div>
              {i < steps.length-1 && <div style={{ width:40, height:1.5, background: step>i+1?"#c9a96e":"#e5e0d8", margin:"0 12px" }} />}
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:32, alignItems:"start" }}>
          <div className="fade-up">
            {/* Step 1: Address */}
            {step === 1 && (
              <div style={{ background:"#fff", borderRadius:16, padding:"28px", boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
                <h2 style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:22, marginBottom:24 }}>Delivery Address</h2>
                <div style={{ display:"grid", gap:16 }}>
                  {[
                    { k:"name", label:"Full Name", ph:"Your name" },
                    { k:"phone", label:"Phone Number", ph:"10-digit mobile number" },
                    { k:"line1", label:"Address", ph:"House no., Street, Area" },
                    { k:"city", label:"City", ph:"City" },
                    { k:"state", label:"State", ph:"State" },
                    { k:"pin", label:"PIN Code", ph:"6-digit PIN" },
                  ].map(f => (
                    <div key={f.k}>
                      <label style={{ fontSize:12, fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:".05em", display:"block", marginBottom:6 }}>{f.label}</label>
                      <input className={`input-field ${errs[f.k]?"err":""}`} placeholder={f.ph} value={addr[f.k]} onChange={setA(f.k)} />
                      {errs[f.k] && <div style={{ color:"#ef4444", fontSize:12, marginTop:4 }}>{errs[f.k]}</div>}
                    </div>
                  ))}
                </div>
                <button className="btn-gold" style={{ width:"100%", padding:"14px", marginTop:24 }}
                  onClick={() => { const e=validateAddr(); if(Object.keys(e).length){setErrs(e);return;} setErrs({}); setStep(2); }}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div style={{ background:"#fff", borderRadius:16, padding:"28px", boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
                <h2 style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:22, marginBottom:24 }}>Payment Method</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    { id:"card", label:"Credit / Debit Card", icon:"💳" },
                    { id:"upi", label:"UPI Payment", icon:"📱" },
                    { id:"cod", label:"Cash on Delivery", icon:"💵" },
                    { id:"netbanking", label:"Net Banking", icon:"🏦" },
                  ].map(m => (
                    <div key={m.id} onClick={() => setPayment(m.id)} style={{
                      display:"flex", alignItems:"center", gap:14, padding:"16px 20px",
                      border:`2px solid ${payment===m.id?"#c9a96e":"#e5e0d8"}`,
                      borderRadius:12, cursor:"pointer", transition:"all .2s",
                      background: payment===m.id ? "#fdf8f0" : "#fff"
                    }}>
                      <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${payment===m.id?"#c9a96e":"#ccc"}`,
                        background: payment===m.id ? "#c9a96e" : "transparent",
                        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {payment===m.id && <div style={{ width:8, height:8, borderRadius:"50%", background:"#fff" }} />}
                      </div>
                      <span style={{ fontSize:18 }}>{m.icon}</span>
                      <span style={{ fontSize:14, fontWeight:600, color:"#1a1a1a" }}>{m.label}</span>
                    </div>
                  ))}
                </div>
                {payment === "card" && (
                  <div style={{ marginTop:20, padding:"16px", background:"#f5f3ef", borderRadius:10, display:"flex", flexDirection:"column", gap:10 }}>
                    <input className="input-field" placeholder="Card Number (demo)" />
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      <input className="input-field" placeholder="MM/YY" />
                      <input className="input-field" placeholder="CVV" />
                    </div>
                  </div>
                )}
                <div style={{ display:"flex", gap:12, marginTop:24 }}>
                  <button className="btn-outline" onClick={() => setStep(1)} style={{ flex:1 }}>← Back</button>
                  <button className="btn-gold" onClick={() => setStep(3)} style={{ flex:2, padding:"13px" }}>Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div style={{ background:"#fff", borderRadius:16, padding:"28px", boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
                <h2 style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:22, marginBottom:20 }}>Review Order</h2>
                <div style={{ background:"#f5f3ef", borderRadius:10, padding:"16px", marginBottom:20 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:".05em", marginBottom:8 }}>Delivery to</div>
                  <div style={{ fontSize:14, color:"#1a1a1a", lineHeight:1.7 }}>
                    {addr.name} • {addr.phone}<br />{addr.line1}, {addr.city}, {addr.state} - {addr.pin}
                  </div>
                </div>
                <div style={{ marginBottom:20 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 0", borderBottom:"1px solid #f0ede8" }}>
                      <img src={item.image} alt={item.name} style={{ width:50, height:50, borderRadius:8, objectFit:"cover" }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:600, color:"#1a1a1a" }}>{item.name}</div>
                        <div style={{ fontSize:12, color:"#888" }}>Qty: {item.qty}</div>
                      </div>
                      <div style={{ fontFamily:"Playfair Display", fontWeight:700 }}>₹{(item.price*item.qty).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:12 }}>
                  <button className="btn-outline" onClick={() => setStep(2)} style={{ flex:1 }}>← Back</button>
                  <button className="btn-gold" onClick={placeOrder} disabled={placing} style={{ flex:2, padding:"13px" }}>
                    {placing ? <span style={{ width:18, height:18, border:"2px solid rgba(255,255,255,.4)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }} />
                      : `Place Order — ₹${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mini Summary */}
          <div style={{ background:"#fff", borderRadius:14, padding:"22px", boxShadow:"0 1px 4px rgba(0,0,0,.06)", position:"sticky", top:88 }}>
            <h3 style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:16, marginBottom:16 }}>Summary</h3>
            {cart.map(i => (
              <div key={i.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
                <span style={{ color:"#666" }}>{i.name} ×{i.qty}</span>
                <span style={{ fontWeight:600 }}>₹{(i.price*i.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ borderTop:"1.5px solid #f0ede8", paddingTop:12, marginTop:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#888", marginBottom:6 }}>
                <span>Shipping</span><span style={{ color:shipping===0?"#10b981":undefined, fontWeight:600 }}>{shipping===0?"FREE":`₹${shipping}`}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontFamily:"Playfair Display", fontWeight:700 }}>Total</span>
                <span style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:20, color:"#c9a96e" }}>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ORDERS ─────────────────────────────────────────────────────────────── */
function OrdersPage({ user, setPage }) {
  const orders = LS.get("ec_orders", []).filter(o => o.userId === user.id).reverse();
  const statusColor = { Confirmed:"#10b981", Shipped:"#3b82f6", Delivered:"#c9a96e", Cancelled:"#ef4444" };

  if (orders.length === 0) return (
    <div style={{ minHeight:"100vh", paddingTop:88, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, background:"#faf9f7" }}>
      <div style={{ fontSize:60 }}>📦</div>
      <h2 style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:28 }}>No orders yet</h2>
      <p style={{ color:"#888" }}>Start shopping to see your orders here</p>
      <button className="btn-gold" onClick={() => setPage("shop")} style={{ padding:"13px 28px", marginTop:8 }}>Explore Shop</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", paddingTop:88, background:"#faf9f7" }}>
      <div style={{ maxWidth:880, margin:"0 auto", padding:"40px 32px" }}>
        <h1 className="fade-up" style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:40, marginBottom:36 }}>My Orders</h1>
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {orders.map((o, i) => (
            <div key={o.id} className="order-card fade-up" style={{ animationDelay:`${i*.07}s` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:18, color:"#1a1a1a" }}>Order #{o.id}</div>
                  <div style={{ fontSize:13, color:"#888", marginTop:4 }}>
                    {new Date(o.date).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}
                    &nbsp;·&nbsp; {o.payment.toUpperCase()}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ padding:"5px 14px", borderRadius:20, background:`${statusColor[o.status]}18`, color:statusColor[o.status], fontSize:13, fontWeight:700 }}>
                    ● {o.status}
                  </span>
                  <span style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:20, color:"#c9a96e" }}>₹{o.total.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {o.items.map(item => (
                  <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, background:"#f5f3ef", borderRadius:10, padding:"10px 14px" }}>
                    <img src={item.image} alt={item.name} style={{ width:40, height:40, borderRadius:6, objectFit:"cover" }} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>{item.name}</div>
                      <div style={{ fontSize:12, color:"#888" }}>×{item.qty} · ₹{item.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:14, fontSize:13, color:"#888", padding:"10px 14px", background:"#f5f3ef", borderRadius:8 }}>
                📍 {o.address.line1}, {o.address.city}, {o.address.state} - {o.address.pin}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── WISHLIST ───────────────────────────────────────────────────────────── */
function WishlistPage({ wishlist, setWishlist, setCart, toast }) {
  const remove = (id) => {
    const next = wishlist.filter(i => i.id !== id);
    setWishlist(next); LS.set("ec_wishlist", next);
  };
  const moveToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id);
      const next = ex ? prev.map(i => i.id===item.id ? {...i,qty:i.qty+1}:i) : [...prev, {...item,qty:1}];
      LS.set("ec_cart", next);
      return next;
    });
    remove(item.id);
    toast(`${item.name} moved to cart`, "✦");
  };

  if (wishlist.length === 0) return (
    <div style={{ minHeight:"100vh", paddingTop:88, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, background:"#faf9f7" }}>
      <div style={{ fontSize:60 }}>♡</div>
      <h2 style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:28 }}>Your wishlist is empty</h2>
      <p style={{ color:"#888" }}>Save items you love for later</p>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", paddingTop:88, background:"#faf9f7" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 32px" }}>
        <h1 className="fade-up" style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:40, marginBottom:36 }}>
          Wishlist <span style={{ color:"#bbb", fontWeight:400, fontSize:24 }}>({wishlist.length})</span>
        </h1>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:24 }}>
          {wishlist.map((item, i) => (
            <div key={item.id} className="card fade-up" style={{ animationDelay:`${i*.06}s` }}>
              <div style={{ position:"relative", overflow:"hidden" }}>
                <img className="product-img" src={item.image} alt={item.name} style={{ aspectRatio:"1" }} />
                <button onClick={() => remove(item.id)} className="wishlist-btn">❤️</button>
              </div>
              <div style={{ padding:"16px" }}>
                <div style={{ fontSize:11, color:"#c9a96e", fontWeight:600, textTransform:"uppercase", marginBottom:4 }}>{item.category}</div>
                <div style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:16, marginBottom:10 }}>{item.name}</div>
                <div style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:18, marginBottom:14 }}>₹{item.price.toLocaleString()}</div>
                <button className="btn-gold" style={{ width:"100%", padding:"11px", fontSize:13 }} onClick={() => moveToCart(item)}>
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── ACCOUNT ─────────────────────────────────────────────────────────────── */
function AccountPage({ user, onLogout, setPage, cart, wishlist }) {
  const orders = LS.get("ec_orders", []).filter(o => o.userId === user.id);
  const totalSpent = orders.reduce((s,o) => s + o.total, 0);

  return (
    <div style={{ minHeight:"100vh", paddingTop:88, background:"#faf9f7" }}>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 32px" }}>
        {/* Profile Header */}
        <div className="fade-up" style={{ background:"linear-gradient(135deg,#1a1208,#2d1f0a)", borderRadius:20, padding:"36px", marginBottom:28, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='0.05'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          <div style={{ position:"relative", display:"flex", alignItems:"center", gap:24 }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#c9a96e,#e8c88a)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Playfair Display", fontWeight:900, fontSize:32, color:"#fff", flexShrink:0 }}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:28, color:"#fff", marginBottom:4 }}>{user.name}</h1>
              <div style={{ color:"rgba(255,255,255,.5)", fontSize:14 }}>{user.email}</div>
              <div style={{ color:"#c9a96e", fontSize:12, marginTop:6, fontWeight:600 }}>
                Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month:"long", year:"numeric" })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="fade-up" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:28 }}>
          {[
            { icon:"📦", label:"Orders", value: orders.length },
            { icon:"♡", label:"Wishlist", value: wishlist.length },
            { icon:"₹", label:"Total Spent", value:`₹${totalSpent.toLocaleString()}` },
          ].map(s => (
            <div key={s.label} style={{ background:"#fff", borderRadius:14, padding:"22px", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:24, color:"#c9a96e" }}>{s.value}</div>
              <div style={{ fontSize:12, color:"#888", marginTop:4, fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="fade-up" style={{ background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.06)", marginBottom:20 }}>
          {[
            { icon:"📦", label:"My Orders", sub:"Track and manage orders", page:"orders" },
            { icon:"♡", label:"Wishlist", sub:"Items saved for later", page:"wishlist" },
            { icon:"🛍", label:"Cart", sub:`${cart.length} item(s)`, page:"cart" },
          ].map((item, i) => (
            <button key={item.page} onClick={() => setPage(item.page)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:16, padding:"18px 24px",
              background:"none", border:"none", borderBottom: i<2?"1px solid #f0ede8":"none",
              cursor:"pointer", textAlign:"left", transition:"background .2s"
            }}
              onMouseEnter={e => e.currentTarget.style.background="#fdf8f0"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <span style={{ fontSize:22, width:36, textAlign:"center" }}>{item.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, color:"#1a1a1a", fontSize:14 }}>{item.label}</div>
                <div style={{ color:"#888", fontSize:12, marginTop:2 }}>{item.sub}</div>
              </div>
              <span style={{ color:"#ccc" }}>›</span>
            </button>
          ))}
        </div>

        <button className="btn-outline" style={{ width:"100%", padding:"13px", borderColor:"#ef4444", color:"#ef4444" }}
          onClick={() => { localStorage.removeItem("ec_session"); onLogout(); }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ─── ABOUT ──────────────────────────────────────────────────────────────── */
function AboutPage() {
  return (
    <div style={{ minHeight:"100vh", paddingTop:88, background:"#faf9f7" }}>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"60px 32px", textAlign:"center" }}>
        <div className="fade-up">
          <div style={{ fontSize:12, fontWeight:700, color:"#c9a96e", textTransform:"uppercase", letterSpacing:".12em", marginBottom:16 }}>Our Story</div>
          <h1 style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:"clamp(36px,6vw,60px)", color:"#1a1a1a", lineHeight:1.1, marginBottom:24 }}>
            Luxury Redefined,<br />
            <em style={{ color:"#c9a96e" }}>Democratized</em>
          </h1>
          <p style={{ color:"#666", fontSize:16, lineHeight:1.9, maxWidth:600, margin:"0 auto 48px" }}>
            LUXE was born from a simple belief — that premium craftsmanship shouldn't be exclusive. We curate the finest fashion, jewelry, and fragrances from artisans around the world, bringing timeless elegance to your doorstep.
          </p>
        </div>
        <div className="fade-up" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, marginBottom:60 }}>
          {[
            { icon:"🌍", title:"Global Curation", desc:"Handpicked pieces from 40+ countries" },
            { icon:"✦", title:"Authenticity", desc:"100% genuine, certified products" },
            { icon:"🚚", title:"Swift Delivery", desc:"Free shipping on orders above ₹999" },
          ].map(c => (
            <div key={c.title} style={{ background:"#fff", borderRadius:16, padding:"28px 20px", boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>{c.icon}</div>
              <div style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:18, color:"#1a1a1a", marginBottom:8 }}>{c.title}</div>
              <div style={{ color:"#888", fontSize:13, lineHeight:1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── HOME PAGE ──────────────────────────────────────────────────────────── */
function HomePage({ setPage, cart, setCart, wishlist, setWishlist, toast }) {
  const featured = PRODUCTS.filter(p => p.badge === "Bestseller" || p.badge === "Top Rated").slice(0, 4);

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      const next = ex ? prev.map(i => i.id===product.id ? {...i,qty:i.qty+1}:i) : [...prev, {...product,qty:1}];
      LS.set("ec_cart", next);
      return next;
    });
  };
  const toggleWish = (product) => {
    setWishlist(prev => {
      const has = prev.find(i => i.id === product.id);
      const next = has ? prev.filter(i => i.id !== product.id) : [...prev, product];
      LS.set("ec_wishlist", next);
      if (!has) toast(`${product.name} added to wishlist ♡`, "♡");
      return next;
    });
  };

  return (
    <>
      <HeroSection setPage={setPage} />

      {/* Categories */}
      <section style={{ padding:"80px 32px", maxWidth:1280, margin:"0 auto" }}>
        <div className="fade-up" style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#c9a96e", textTransform:"uppercase", letterSpacing:".12em", marginBottom:12 }}>Shop By Category</div>
          <h2 style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:40, color:"#1a1a1a" }}>Find Your Style</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16 }}>
          {[
            { label:"Fashion", icon:"👗", color:"#fdf2f8" },
            { label:"Accessories", icon:"👜", color:"#fef9ee" },
            { label:"Jewelry", icon:"💎", color:"#f0fdf4" },
            { label:"Fragrance", icon:"🌸", color:"#fff7ed" },
            { label:"Footwear", icon:"👠", color:"#eff6ff" },
          ].map((c, i) => (
            <div key={c.label} className="fade-up" style={{ animationDelay:`${i*.08}s`, cursor:"pointer" }}
              onClick={() => setPage("shop")}>
              <div style={{ background:c.color, borderRadius:16, padding:"32px 20px", textAlign:"center",
                border:"1.5px solid transparent", transition:"all .25s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#c9a96e"; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(201,169,110,.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="transparent"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
                <div style={{ fontSize:36, marginBottom:12 }}>{c.icon}</div>
                <div style={{ fontFamily:"Playfair Display", fontWeight:700, fontSize:16, color:"#1a1a1a" }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section style={{ padding:"0 32px 80px", maxWidth:1280, margin:"0 auto" }}>
        <div className="fade-up" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:36 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"#c9a96e", textTransform:"uppercase", letterSpacing:".12em", marginBottom:10 }}>Curated Picks</div>
            <h2 style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:40, color:"#1a1a1a" }}>Bestsellers</h2>
          </div>
          <button className="btn-outline" onClick={() => setPage("shop")} style={{ padding:"11px 22px" }}>View All →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:24 }}>
          {featured.map((p, i) => (
            <div key={p.id} className="fade-up" style={{ animationDelay:`${i*.08}s` }}>
              <ProductCard product={p} onAddCart={addToCart}
                onToggleWish={toggleWish} isWished={!!wishlist.find(i => i.id === p.id)} toast={toast} />
            </div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section style={{ background:"linear-gradient(135deg,#1a1208,#2d1f0a)", padding:"80px 32px", textAlign:"center" }}>
        <div className="fade-up">
          <div style={{ fontSize:48, marginBottom:16 }}>🚚</div>
          <h2 style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:36, color:"#fff", marginBottom:12 }}>Free Shipping on Orders Above ₹999</h2>
          <p style={{ color:"rgba(255,255,255,.5)", fontSize:15, marginBottom:28 }}>Fast delivery · Easy returns · Secure payment</p>
          <button className="btn-gold" onClick={() => setPage("shop")} style={{ padding:"14px 32px", fontSize:15 }}>Shop Now →</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:"#1a1208", padding:"40px 32px", textAlign:"center" }}>
        <div style={{ fontFamily:"Playfair Display", fontWeight:900, fontSize:24, color:"#c9a96e", marginBottom:10 }}>LUXE</div>
        <p style={{ color:"rgba(255,255,255,.3)", fontSize:13 }}>© 2025 Luxe. All rights reserved. Built for your interview 🎯</p>
      </footer>
    </>
  );
}

/* ─── ROOT APP ────────────────────────────────────────────────────────────── */
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [ready, setReady] = useState(false);
  const { toasts, add: toast } = useToasts();

  useEffect(() => {
    const session = LS.get("ec_session", null);
    if (session) setUser(session);
    setCart(LS.get("ec_cart", []));
    setWishlist(LS.get("ec_wishlist", []));
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!user) return <AuthPage onAuth={u => { setUser(u); setPage("home"); }} />;

  const cartCount = cart.reduce((s,i) => s + i.qty, 0);
  const wishCount = wishlist.length;

  const pageProps = { cart, setCart, wishlist, setWishlist, toast, setPage, user };

  return (
    <div>
      <Navbar user={user} page={page} setPage={setPage} cartCount={cartCount} wishCount={wishCount}
        onLogout={() => { setUser(null); setPage("home"); }} />

      {page === "home"     && <HomePage {...pageProps} />}
      {page === "shop"     && <ShopPage {...pageProps} />}
      {page === "cart"     && <CartPage {...pageProps} />}
      {page === "checkout" && <CheckoutPage {...pageProps} />}
      {page === "orders"   && <OrdersPage user={user} setPage={setPage} />}
      {page === "wishlist" && <WishlistPage {...pageProps} />}
      {page === "account"  && <AccountPage user={user} onLogout={() => { localStorage.removeItem("ec_session"); setUser(null); }} setPage={setPage} cart={cart} wishlist={wishlist} />}
      {page === "about"    && <AboutPage />}

      <ToastContainer toasts={toasts} />
    </div>
  );
}