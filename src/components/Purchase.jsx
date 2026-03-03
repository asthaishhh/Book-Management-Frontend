import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const promoCode = "FREE20";
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cart-root {
    min-height: 100vh;
    background: #ede9f7;
    font-family: 'Nunito', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Aurora blobs ── */
  .cart-blob {
    position: fixed; border-radius: 50%;
    filter: blur(80px); opacity: 0.45;
    pointer-events: none; z-index: 0;
  }
  .cart-blob-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, #d4b8f0 0%, #c9d4f8 60%, transparent 100%);
    top: -150px; left: -120px;
    animation: driftA 18s ease-in-out infinite alternate;
  }
  .cart-blob-2 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, #f9c5d1 0%, #fce4ec 60%, transparent 100%);
    bottom: -100px; right: -100px;
    animation: driftB 22s ease-in-out infinite alternate;
  }
  .cart-blob-3 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, #b5e8e0 0%, #c8f0ea 60%, transparent 100%);
    top: 40%; left: 55%;
    animation: driftC 16s ease-in-out infinite alternate;
  }
  @keyframes driftA { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(40px,30px) scale(1.08); } }
  @keyframes driftB { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-35px,-25px) scale(1.06); } }
  @keyframes driftC { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-20px,30px) scale(1.1); } }

  /* dot grid */
  .cart-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      radial-gradient(circle, rgba(180,150,230,0.22) 1.5px, transparent 1.5px),
      radial-gradient(circle, rgba(240,180,200,0.18) 1px, transparent 1px);
    background-size: 52px 52px, 31px 31px;
    background-position: 0 0, 16px 16px;
    pointer-events: none; z-index: 1;
  }

  /* ── Layout ── */
  .cart-content {
    position: relative; z-index: 2;
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 28px 100px;
  }

  /* ── Header ── */
  .cart-header {
    margin-bottom: 32px;
    animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cart-eyebrow {
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.8px;
    color: #a855f7; margin-bottom: 6px;
    display: flex; align-items: center; gap: 5px;
  }
  .cart-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px; font-weight: 600;
    color: #2e1060; line-height: 1.15;
  }
  .cart-title em {
    font-style: italic;
    background: linear-gradient(90deg, #a855f7, #ec4899, #14b8a6);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .cart-subtitle {
    margin-top: 5px; font-size: 13px; color: #9b7bb8;
  }

  /* ── Back button ── */
  .cart-back {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.65);
    border: 1.5px solid rgba(192,132,252,0.25);
    border-radius: 50px;
    padding: 8px 18px;
    font-family: 'Nunito', sans-serif;
    font-size: 12px; font-weight: 700;
    color: #6b3fa0; letter-spacing: 0.04em;
    cursor: pointer; backdrop-filter: blur(8px);
    transition: all 0.2s;
    margin-bottom: 28px;
  }
  .cart-back:hover {
    background: rgba(192,132,252,0.12);
    border-color: rgba(192,132,252,0.5);
    transform: translateX(-2px);
  }
  .cart-back svg { transition: transform 0.2s; }
  .cart-back:hover svg { transform: translateX(-3px); }

  /* ── Two-column grid ── */
  .cart-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 800px) {
    .cart-grid { grid-template-columns: 1fr; }
  }

  /* ── Cart items list ── */
  .cart-items { display: flex; flex-direction: column; gap: 16px; }

  .cart-item {
    background: rgba(255,253,255,0.75);
    border: 1px solid rgba(210,180,240,0.3);
    border-radius: 20px;
    padding: 20px;
    display: flex; gap: 18px; align-items: flex-start;
    backdrop-filter: blur(16px);
    box-shadow: 0 4px 20px rgba(160,120,200,0.08);
    animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .cart-item:hover {
    box-shadow: 0 8px 32px rgba(160,120,200,0.15);
    transform: translateY(-1px);
  }

  /* rainbow top line on each card */
  .cart-item::before {
    content: none;
  }

  .item-cover-wrap { position: relative; flex-shrink: 0; }
  .item-cover {
    width: 76px; height: 108px;
    object-fit: cover; border-radius: 10px;
    box-shadow:
      0 8px 20px rgba(160,120,200,0.25),
      0 0 0 1px rgba(192,132,252,0.15);
  }
  .item-cover-placeholder {
    width: 76px; height: 108px;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(192,132,252,0.15), rgba(249,168,212,0.15));
    border: 1px solid rgba(192,132,252,0.2);
    display: flex; align-items: center; justify-content: center;
    color: rgba(168,85,247,0.4); font-size: 28px;
  }

  .item-info { flex: 1; min-width: 0; }

  .item-tag {
    font-size: 9px; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; color: #a855f7; margin-bottom: 5px;
  }
  .item-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px; font-weight: 600; color: #2e1060;
    line-height: 1.25; margin-bottom: 3px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .item-author {
    font-size: 11px; color: rgba(107,63,160,0.5);
    font-style: italic; margin-bottom: 14px;
  }

  /* Qty stepper */
  .item-footer { display: flex; align-items: center; justify-content: space-between; }
  .item-stepper {
    display: flex; align-items: center;
    background: rgba(255,255,255,0.7);
    border: 1.5px solid rgba(192,132,252,0.22);
    border-radius: 12px; overflow: hidden;
  }
  .stepper-btn {
    background: none; border: none;
    width: 36px; height: 34px;
    font-size: 18px; font-weight: 300; cursor: pointer;
    color: rgba(107,63,160,0.5);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; font-family: 'Nunito', sans-serif;
  }
  .stepper-btn:hover { background: rgba(192,132,252,0.1); color: #a855f7; }
  .stepper-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-weight: 600; color: #2e1060;
    width: 34px; text-align: center;
    border-left: 1px solid rgba(192,132,252,0.12);
    border-right: 1px solid rgba(192,132,252,0.12);
    line-height: 34px;
  }

  .item-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 600;
    background: linear-gradient(135deg, #a855f7, #ec4899);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .item-price sup { font-size: 12px; font-family: 'Nunito', sans-serif; margin-right: 1px; }

  .item-remove {
    background: none; border: none;
    color: rgba(160,120,200,0.35); cursor: pointer;
    padding: 4px; border-radius: 6px;
    transition: color 0.2s, background 0.2s;
    display: flex; align-items: center;
    margin-left: 8px;
  }
  .item-remove:hover { color: #ec4899; background: rgba(249,168,212,0.1); }

  /* ── Empty state ── */
  .cart-empty {
    text-align: center; padding: 60px 20px;
    background: rgba(255,253,255,0.7);
    border: 1px solid rgba(210,180,240,0.3);
    border-radius: 24px; backdrop-filter: blur(16px);
    animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  .cart-empty-icon {
    width: 72px; height: 72px; border-radius: 20px;
    background: rgba(192,132,252,0.1);
    border: 1.5px solid rgba(192,132,252,0.2);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px; font-size: 32px;
  }
  .cart-empty h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 600; color: #3b1f5e; margin-bottom: 6px;
  }
  .cart-empty p { font-size: 13px; color: #9b7bb8; }

  /* ── Order Summary panel ── */
  .order-summary {
    background: rgba(255,253,255,0.78);
    border: 1px solid rgba(210,180,240,0.35);
    border-radius: 24px;
    overflow: hidden;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 40px rgba(160,120,200,0.12);
    position: sticky; top: 32px;
    animation: fadeUp 0.5s 0.15s cubic-bezier(0.22,1,0.36,1) both;
  }

  /* rainbow top stripe */
  .summary-stripe {
    height: 3px;
    background: linear-gradient(90deg, #c084fc 0%, #f9a8d4 35%, #86efac 65%, #7dd3fc 100%);
  }

  .summary-body { padding: 24px; }

  .summary-title {
    font-size: 10px; font-weight: 800; letter-spacing: 0.18em;
    text-transform: uppercase; color: #a855f7; margin-bottom: 20px;
  }

  .summary-line {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 12px;
  }
  .summary-line-label { font-size: 13px; color: #9b7bb8; font-weight: 500; }
  .summary-line-val { font-size: 14px; font-weight: 700; color: #3b1f5e; }
  .summary-line-val.free {
    background: linear-gradient(90deg, #14b8a6, #86efac);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .summary-divider { height: 1px; background: rgba(192,132,252,0.12); margin: 16px 0; }

  .summary-total {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 24px;
  }
  .summary-total-label {
    font-size: 12px; font-weight: 800; letter-spacing: 0.1em;
    text-transform: uppercase; color: #6b3fa0;
  }
  .summary-total-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px; font-weight: 600;
    background: linear-gradient(135deg, #a855f7, #ec4899, #14b8a6);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .summary-total-val sup { font-size: 14px; font-family: 'Nunito', sans-serif; margin-right: 2px; }

  .checkout-btn {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, #c084fc 0%, #f9a8d4 50%, #86efac 100%);
    color: #3b1f5e;
    border: none; border-radius: 14px;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 800;
    letter-spacing: 0.08em; text-transform: uppercase;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(192,132,252,0.3), 0 0 0 1px rgba(255,255,255,0.4) inset;
    position: relative; overflow: hidden;
    margin-bottom: 10px;
  }
  .checkout-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%);
    pointer-events: none;
  }
  .checkout-btn:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(192,132,252,0.4); }
  .checkout-btn:active { transform: translateY(0); }

  .summary-note {
    text-align: center; font-size: 11px;
    color: rgba(107,63,160,0.4); letter-spacing: 0.03em;
    display: flex; align-items: center; justify-content: center; gap: 4px;
  }

  /* ── Promo input ── */
  .promo-wrap {
  margin-top: 15px;
  transition: all 0.3s ease;
}

.promo-row {
  display: flex;
  gap: 10px;
}

.promo-message {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
  animation: fadeIn 0.3s ease;
}

/* Success style */
.promo-message.success {
  color: #1b8f3c;
}

/* Error style */
.promo-message.error {
  color: #d62828;
}

/* Smooth expand effect */
.promo-wrap.expanded {
  padding-bottom: 10px;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
  }
  .promo-input {
    flex: 1; padding: 10px 14px;
    border: 1.5px solid rgba(192,132,252,0.25);
    border-radius: 10px;
    background: rgba(255,255,255,0.6);
    font-family: 'Nunito', sans-serif;
    font-size: 13px; color: #3b1f5e;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .promo-input::placeholder { color: rgba(107,63,160,0.35); }
  .promo-input:focus {
    border-color: rgba(192,132,252,0.55);
    box-shadow: 0 0 0 3px rgba(192,132,252,0.1);
  }
  .promo-btn {
    padding: 10px 16px;
    background: rgba(192,132,252,0.12);
    border: 1.5px solid rgba(192,132,252,0.25);
    border-radius: 10px;
    font-family: 'Nunito', sans-serif;
    font-size: 12px; font-weight: 700;
    color: #a855f7; cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .promo-btn:hover { background: rgba(192,132,252,0.2); }

  /* stagger delay for items */
  .cart-item:nth-child(1) { animation-delay: 0.05s; }
  .cart-item:nth-child(2) { animation-delay: 0.1s; }
  .cart-item:nth-child(3) { animation-delay: 0.15s; }
  .cart-item:nth-child(4) { animation-delay: 0.2s; }
  .cart-item:nth-child(5) { animation-delay: 0.25s; }
`;

// ── Demo: reads from localStorage cart, with fallback mock data ──
const loadCart = () => {
  try {
    const raw = localStorage.getItem("cart");
    if (raw) return JSON.parse(raw);
  } catch {}
  // fallback mock for preview
  return [
    {
      _id: "1",
      BookName: "The Midnight Library",
      Author: "Matt Haig",
      Price: 349,
      Category: "Fiction",
      Image: "https://covers.openlibrary.org/b/id/10909258-L.jpg",
      quantity: 2,
    },
    {
      _id: "2",
      BookName: "Atomic Habits",
      Author: "James Clear",
      Price: 499,
      Category: "Self-Help",
      Image: "https://covers.openlibrary.org/b/id/10521270-L.jpg",
      quantity: 1,
    },
    {
      _id: "3",
      BookName: "Sapiens",
      Author: "Yuval Noah Harari",
      Price: 599,
      Category: "History",
      Image: "https://covers.openlibrary.org/b/id/8571180-L.jpg",
      quantity: 1,
    },
  ];
};

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(loadCart);
  const [promo, setPromo] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [discount, setDiscount] = useState(0);

  const saveCart = (updated) => {
    setItems(updated);
    try {
      localStorage.setItem("cart", JSON.stringify(updated));
    } catch {}
  };

  const updateQty = (id, delta) => {
    const updated = items.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item,
    );
    saveCart(updated);
  };

  const removeItem = (id) => {
    saveCart(items.filter((item) => item._id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + parseInt(item.Price) * (item.quantity || 1),
    0,
  );
  const delivery = subtotal > 999 ? 0 : 49;
  const total = subtotal + delivery;
  const finalTotal = Math.max(total - discount, 0);

  const handleApplyPromo = () => {
    const code = promo.trim().toUpperCase();

    if (code === "SAVE10") {
      const discount = total * 0.1;
      setDiscount(discount); // 10% discount
      setPromoMessage("10% discount applied!");
    } else if (code === "FLAT50") {
      setDiscount(50);
      setPromoMessage("₹50 discount applied!");
    } else if (code == "FREE20") {
      setDiscount(20);
      setPromoMessage("₹20 discount applied!");
    } else {
      alert("Invalid promo code");
      setDiscount(0);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cart-root">
        <div className="cart-blob cart-blob-1" />
        <div className="cart-blob cart-blob-2" />
        <div className="cart-blob cart-blob-3" />

        <div className="cart-content">
          {/* Header */}
          <div className="cart-header">
            <div className="cart-eyebrow">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 2h1.5l2 8h7l1.5-5.5H5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="7" cy="13.5" r="1.2" fill="currentColor" />
                <circle cx="11" cy="13.5" r="1.2" fill="currentColor" />
              </svg>
              Your Cart
            </div>
            <h1 className="cart-title">
              Your reading <em>picks</em>
            </h1>
            <p className="cart-subtitle">
              {items.length} item{items.length !== 1 ? "s" : ""} waiting for you
            </p>
          </div>

          {/* Back */}
          <button className="cart-back" onClick={() => navigate(-1)}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path
                d="M9 2L4 7L9 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Continue browsing
          </button>

          {/* Grid */}
          <div className="cart-grid">
            {/* Left: Items */}
            <div className="cart-items">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">🛒</div>
                  <h3>Your cart is empty</h3>
                  <p>Go pick some wonderful books!</p>
                </div>
              ) : (
                items.map((item) => (
                  <div className="cart-item" key={item._id}>
                    <div className="item-cover-wrap">
                      {item.Image ? (
                        <img
                          src={item.Image}
                          alt={item.BookName}
                          className="item-cover"
                        />
                      ) : (
                        <div className="item-cover-placeholder">📖</div>
                      )}
                    </div>
                    <div className="item-info">
                      <div className="item-tag">
                        ✦ {item.Category || "Book"}
                      </div>
                      <div className="item-name">{item.BookName}</div>
                      <div className="item-author">by {item.Author}</div>
                      <div className="item-footer">
                        <div className="item-stepper">
                          <button
                            className="stepper-btn"
                            onClick={() => updateQty(item._id, -1)}
                          >
                            −
                          </button>
                          <span className="stepper-num">
                            {item.quantity || 1}
                          </span>
                          <button
                            className="stepper-btn"
                            onClick={() => updateQty(item._id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span className="item-price">
                            <sup>₹</sup>
                            {parseInt(item.Price) * (item.quantity || 1)}
                          </span>
                          <button
                            className="item-remove"
                            onClick={() => removeItem(item._id)}
                            title="Remove"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M4 4l8 8M12 4l-8 8"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="order-summary">
              <div className="summary-stripe" />
              <div className="summary-body">
                <div className="summary-title">Order Summary</div>

                {discount > 0 && (
                  <div className="summary-line">
                    <span className="summary-line-label">Discount</span>
                    <span className="summary-line-val">- ₹{discount}</span>
                  </div>
                )}
                <div className="summary-line">
                  <span className="summary-line-label">Delivery</span>
                  <span
                    className={`summary-line-val${delivery === 0 ? " free" : ""}`}
                  >
                    {delivery === 0 ? "Free ✦" : `₹${delivery}`}
                  </span>
                </div>
                {delivery > 0 && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(107,63,160,0.45)",
                      marginBottom: "8px",
                      marginTop: "-4px",
                    }}
                  >
                    Add ₹{1000 - subtotal} more for free delivery
                  </div>
                )}

                <div className="summary-divider" />

                <div className="summary-total">
                  <span className="summary-total-label">Total</span>
                  <span className="summary-total-val">
                    <sup>₹</sup>
                    {finalTotal}
                  </span>
                </div>

                <button
                  className="checkout-btn"
                  onClick={() => alert("Proceeding to checkout…")}
                  disabled={items.length === 0}
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 2h1.5l2 8h7l1.5-5.5H5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="7" cy="13" r="1" fill="currentColor" />
                    <circle cx="11" cy="13" r="1" fill="currentColor" />
                  </svg>
                  Proceed to Checkout
                </button>

                <div className="summary-note">
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 7v4M8 5v.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  Secure checkout · Free returns within 7 days
                </div>

                {/* Promo */}
                <div className="summary-divider" />
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "rgba(107,63,160,0.5)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Promo Code
                </div>
                <div className={`promo-wrap ${promoMessage ? "expanded" : ""}`}>
                  <div className="promo-row">
                    <input
                      className="promo-input"
                      placeholder="Enter code…"
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                    />
                    <button className="promo-btn" onClick={handleApplyPromo}>
                      Apply
                    </button>
                  </div>

                  {promoMessage && (
                    <div
                      className={`promo-message ${
                        promoMessage.includes("applied") ? "success" : "error"
                      }`}
                    >
                      {promoMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
