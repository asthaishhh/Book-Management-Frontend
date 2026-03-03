import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookForm from "./BookForm";
import Card from "./Card";
import { Plus, Funnel, Sparkles, BookOpen } from "lucide-react";

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}}/book`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

const Home = () => {
  const navigate = useNavigate();
  const [showPurchasePopup, setShowPurchasePopup] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [quantity, setQuantity] = useState(1);

  /* ================= SAFE USER PARSE ================= */

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const user = getUser();
  const role = user?.role;

  /* ================= PERMISSIONS ================= */

  const canAdd = role === "Admin" || role === "User";
  const canEdit = role === "Admin";
  const canDelete = role === "Admin";
  const canBuy = role === "Admin" || role == "User";
  console.log(canAdd);

  /* ================= STATES ================= */

  const [bookList, setBookList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState(false);
  const [selectedFilterField, setSelectedFilterField] = useState("Category");
  const [selectedFilterValue, setSelectedFilterValue] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [showForm, setShowForm] = useState(false);

  const [bookForm, setBookForm] = useState({
    BookName: "",
    Author: "",
    Price: "",
    Category: "",
    Image: "",
    BookImage: null,
  });

  /* ================= FETCH BOOKS ================= */

  const fetchBooks = async () => {
    try {
      const { data } = await api.get("/booklists");
      setBookList(data?.Booklist || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
    else fetchBooks();
  }, []);

  /* ================= PRICE RANGE ================= */

  const highestBookPrice = Math.max(
    ...bookList.map((b) => parseInt(b.Price) || 0),
    1000,
  );

  /* ================= FORM HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "BookImage") setBookForm({ ...bookForm, BookImage: files[0] });
    else setBookForm({ ...bookForm, [name]: value });
  };

  const handleSubmit = async () => {
    if (!bookForm.BookName || !bookForm.Author || !bookForm.Price)
      return alert("Fill required fields");

    try {
      let imageURL = bookForm.Image || "";

      if (bookForm.BookImage) {
        const formData = new FormData();
        formData.append("image", bookForm.BookImage);
        const res = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageURL = res.data.imageUrl;
      }

      const finalData = { ...bookForm, Image: imageURL };
      const method = editingId ? "put" : "post";
      const url = editingId ? "/updatebook" : "/";
      const payload = editingId ? { _id: editingId, ...finalData } : finalData;

      const { data } = await api[method](url, payload);
      if (data?.Success) {
        resetForm();
        fetchBooks();
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };
  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleBuy = (book) => {
    setSelectedBook(book);
    setQuantity(1);
    setShowPurchasePopup(true);
  };
  const resetForm = () => {
    setEditingId(null);
    setBookForm({
      BookName: "",
      Author: "",
      Price: "",
      Category: "",
      Image: "",
      BookImage: null,
    });
  };
  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const updatedCart = [
      ...existingCart,
      {
        ...selectedBook,
        quantity: quantity,
        totalPrice: selectedBook.price * quantity,
      },
    ];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    console.log("Selected Book:", selectedBook);

    setShowPurchasePopup(false);
    navigate("/purchase",{
     state: {
      book: selectedBook,
      quantity: quantity
    }});
  };

  const handleEditInit = (book) => {
    setBookForm({
      BookName: book.BookName,
      Author: book.Author,
      Price: book.Price,
      Category: book.Category,
      Image: book.Image || "",
      BookImage: null,
    });
    setEditingId(book._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await api.post("/deletebook", { _id: id });
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FILTER LOGIC ================= */

  const getUniqueFilterValues = () => {
    const values = bookList.map((book) => book[selectedFilterField]);
    return [...new Set(values)].filter(Boolean);
  };

  const filteredBooks =
    selectedFilterField === "Price"
      ? bookList.filter((book) => parseInt(book.Price) <= maxPrice)
      : selectedFilterValue
        ? bookList.filter(
            (book) =>
              String(book[selectedFilterField]) === String(selectedFilterValue),
          )
        : bookList;

  /* ================= JSX ================= */

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,500&display=swap');

        * { box-sizing: border-box; }

        .home-root {
          min-height: 100vh;
          font-family: 'Nunito', sans-serif;
          background: #ede9f7;
          position: relative;
          overflow-x: hidden;
        }

        /* aurora blobs */
        .home-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
          pointer-events: none;
          z-index: 0;
        }
        .home-blob-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #d4b8f0 0%, #c9d4f8 60%, transparent 100%);
          top: -150px; left: -120px;
          animation: driftA 18s ease-in-out infinite alternate;
        }
        .home-blob-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #f9c5d1 0%, #fce4ec 60%, transparent 100%);
          bottom: -100px; right: -100px;
          animation: driftB 22s ease-in-out infinite alternate;
        }
        .home-blob-3 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, #b5e8e0 0%, #c8f0ea 60%, transparent 100%);
          top: 35%; left: 55%;
          animation: driftC 16s ease-in-out infinite alternate;
        }
        .home-blob-4 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, #ffeaa7 0%, #fdf3cf 60%, transparent 100%);
          top: 15%; right: 8%;
          animation: driftD 20s ease-in-out infinite alternate;
        }
        @keyframes driftA { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(40px,30px) scale(1.08); } }
        @keyframes driftB { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-35px,-25px) scale(1.06); } }
        @keyframes driftC { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-20px,30px) scale(1.1); } }
        @keyframes driftD { 0% { transform: translate(0,0); }          100% { transform: translate(15px,-20px); } }

        /* dot grid */
        .home-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(180,150,230,0.22) 1.5px, transparent 1.5px),
            radial-gradient(circle, rgba(240,180,200,0.18) 1px, transparent 1px);
          background-size: 52px 52px, 31px 31px;
          background-position: 0 0, 16px 16px;
          pointer-events: none;
          z-index: 1;
        }

        /* ── content ── */
        .home-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 36px 32px 120px;
        }

        /* ── hero ── */
        .home-hero {
          margin-bottom: 24px;
          animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .home-hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #a855f7;
          margin-bottom: 8px;
        }
        .home-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 600;
          color: #2e1060;
          line-height: 1.15;
          letter-spacing: -0.5px;
        }
        .home-hero-title em {
          font-style: italic;
          background: linear-gradient(90deg, #a855f7, #ec4899, #14b8a6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .home-hero-sub { margin-top: 6px; font-size: 14px; color: #9b7bb8; }

        /* ── stats ── */
        .home-stats {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
          flex-wrap: wrap;
          animation: fadeUp 0.6s 0.1s cubic-bezier(0.22,1,0.36,1) both;
        }
        .stat-pill {
          background: rgba(255,253,255,0.7);
          border: 1px solid rgba(210,180,240,0.35);
          border-radius: 14px;
          padding: 10px 18px;
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 12px rgba(160,120,200,0.1);
        }
        .stat-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .stat-dot-purple { background: linear-gradient(135deg, #c084fc, #a855f7); }
        .stat-dot-pink   { background: linear-gradient(135deg, #f9a8d4, #ec4899); }
        .stat-dot-teal   { background: linear-gradient(135deg, #86efac, #14b8a6); }
        .stat-label { font-size: 12px; color: #9b7bb8; font-weight: 500; }
        .stat-value { font-size: 15px; font-weight: 800; color: #3b1f5e; margin-left: 2px; }

        /* ── filter panel ── */
        .filter-panel {
          background: rgba(255,253,255,0.72);
          border: 1px solid rgba(210,180,240,0.35);
          border-radius: 20px;
          padding: 20px 24px;
          margin-bottom: 24px;
          backdrop-filter: blur(16px);
          box-shadow: 0 4px 24px rgba(160,120,200,0.1);
          animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }
        .filter-panel-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #a855f7;
          margin-bottom: 14px;
        }
        .filter-row {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .filter-label { font-size: 13px; font-weight: 600; color: #6b3fa0; }
        .filter-select {
          padding: 8px 14px;
          border: 1.5px solid rgba(192,132,252,0.35);
          border-radius: 12px;
          background: rgba(255,255,255,0.7);
          color: #3b1f5e;
          font-family: 'Nunito', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .filter-select:focus {
          border-color: rgba(192,132,252,0.7);
          box-shadow: 0 0 0 3px rgba(192,132,252,0.12);
        }
        .filter-range-wrap { width: 100%; max-width: 380px; margin-top: 14px; }
        .filter-range-label {
          font-size: 13px;
          font-weight: 700;
          color: #6b3fa0;
          margin-bottom: 10px;
        }
        .filter-range-label span {
          background: linear-gradient(90deg, #a855f7, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 15px;
        }
        input[type="range"].aurora-range {
          -webkit-appearance: none;
          width: 100%;
          height: 5px;
          border-radius: 999px;
          background: linear-gradient(90deg, #c084fc, #f9a8d4, #86efac);
          outline: none;
          cursor: pointer;
        }
        input[type="range"].aurora-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #c084fc;
          box-shadow: 0 2px 8px rgba(192,132,252,0.4);
          transition: transform 0.15s;
        }
        input[type="range"].aurora-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .filter-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
        .filter-chip {
          padding: 7px 16px;
          border-radius: 999px;
          border: 1.5px solid rgba(192,132,252,0.3);
          background: rgba(255,255,255,0.6);
          color: #6b3fa0;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-chip:hover, .filter-chip.active {
          background: linear-gradient(135deg, #c084fc, #f9a8d4);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 3px 12px rgba(192,132,252,0.3);
          transform: translateY(-1px);
        }

        /* ── modal ── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(60,20,100,0.25);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 50;
        }
        .modal-inner {
          background: rgba(255,253,255,0.92);
          border: 1px solid rgba(210,180,240,0.4);
          border-radius: 24px;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.6) inset, 0 32px 80px rgba(160,120,200,0.25);
          width: 90%;
          max-width: 860px;
          overflow: hidden;
        }
        .modal-inner::before {
          content: '';
          display: block;
          height: 3px;
          background: linear-gradient(90deg, #c084fc 0%, #f9a8d4 35%, #86efac 65%, #7dd3fc 100%);
        }

        /* ── FABs ── */
        .fab-add {
          position: fixed;
          bottom: 32px; right: 32px;
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #c084fc, #f9a8d4);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(192,132,252,0.45), 0 0 0 3px rgba(255,255,255,0.6);
          transition: transform 0.2s, box-shadow 0.2s;
          z-index: 40;
          border: none;
        }
        .fab-add:hover {
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 10px 32px rgba(192,132,252,0.55), 0 0 0 3px rgba(255,255,255,0.7);
        }
        .fab-add svg { color: #fff; }

        .fab-filter {
          position: fixed;
          bottom: 32px; right: 96px;
          width: 52px; height: 52px;
          background: rgba(255,253,255,0.85);
          border: 1.5px solid rgba(192,132,252,0.35);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(160,120,200,0.2), 0 0 0 3px rgba(255,255,255,0.5);
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          z-index: 40;
          backdrop-filter: blur(12px);
        }
        .fab-filter:hover {
          transform: scale(1.1) translateY(-2px);
          background: rgba(216,180,254,0.25);
        }
        .fab-filter.active { background: rgba(192,132,252,0.15); border-color: rgba(192,132,252,0.6); }
        .fab-filter svg { color: #a855f7; }

        /* ── empty state ── */
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #9b7bb8;
        }
        .empty-icon {
          width: 72px; height: 72px;
          background: rgba(192,132,252,0.1);
          border: 1.5px solid rgba(192,132,252,0.2);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }
        .empty-icon svg { color: #c084fc; }
        .empty-state h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: #3b1f5e;
          margin-bottom: 6px;
        }
        .empty-state p { font-size: 14px; }
        
  /* ══ Aurora Purchase Popup ══ */

  .pp-sheet {
  width: 90%;
  max-width: 460px;
  background: rgba(245, 240, 255, 0.92);
  backdrop-filter: blur(32px);
  border-radius: 28px;
  border: 1px solid rgba(210, 180, 240, 0.5);
  box-shadow: 0 32px 80px rgba(160, 120, 200, 0.25);
  position: relative;
  overflow: hidden;
  animation: pp-zoom 0.25s ease forwards;
}
  .pp-sheet {
  animation: pp-zoom 0.25s ease forwards;
}

  .pp-close {
    position: absolute; top: 12px; right: 16px;
    background: rgba(192,132,252,0.1);
    border: 1px solid rgba(192,132,252,0.2);
    color: rgba(107,63,160,0.5);
    width: 30px; height: 30px; border-radius: 50%;
    font-size: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; z-index: 5;
  }
  .pp-close:hover { background: rgba(192,132,252,0.2); color: #6b3fa0; }


.pp-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 10, 60, 0.5);
  backdrop-filter: blur(10px);
  animation: pp-fadein 0.2s ease forwards;
}

@keyframes pp-fadein {
  from { opacity: 0; }
  to { opacity: 1; }
}



@keyframes pp-zoom {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* rainbow top bar */
.pp-sheet::before {
  content: '';
  display: block;
  height: 3px;
  background: linear-gradient(
    90deg,
    #c084fc 0%,
    #f9a8d4 35%,
    #86efac 65%,
    #7dd3fc 100%
  );
}
 @keyframes pp-zoom {
  from { transform: scale(0.95); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}



  /* rainbow top bar */
  .pp-sheet::before {
    content: '';
    display: block; height: 3px;
    background: linear-gradient(90deg, #c084fc 0%, #f9a8d4 35%, #86efac 65%, #7dd3fc 100%);
    flex-shrink: 0;
  }

  /* inner glow */
  .pp-sheet::after {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 55% at 90% 5%, rgba(192,132,252,0.1) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 10% 95%, rgba(134,239,172,0.08) 0%, transparent 55%);
  }

  .pp-handle {
    width: 36px; height: 3px;
    background: rgba(160,120,200,0.2);
    border-radius: 2px;
    margin: 12px auto 0;
  }



  .pp-book-row {
    display: flex; gap: 18px;
    padding: 22px 26px 20px;
    border-bottom: 1px solid rgba(192,132,252,0.12);
    position: relative; z-index: 1;
  }

  .pp-cover {
    width: 82px; height: 116px;
    object-fit: cover; border-radius: 8px; flex-shrink: 0;
    box-shadow:
      0 8px 24px rgba(160,120,200,0.3),
      0 0 0 1px rgba(192,132,252,0.15),
      0 0 20px rgba(192,132,252,0.12);
  }

  .pp-meta { display: flex; flex-direction: column; justify-content: center; gap: 7px; }

  .pp-tag {
    font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
    color: #a855f7; font-family: 'Nunito', sans-serif;
  }

  .pp-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 600; line-height: 1.3;
    color: #2e1060;
  }

  .pp-author {
    font-size: 11px; font-weight: 400; font-style: italic;
    color: rgba(107,63,160,0.55); font-family: 'Nunito', sans-serif;
  }

  .pp-unit-badge {
    display: inline-flex; align-items: center;
    background: rgba(192,132,252,0.1);
    border: 1px solid rgba(192,132,252,0.25);
    border-radius: 20px; padding: 3px 12px;
    font-size: 12px; font-weight: 700;
    color: #a855f7; font-family: 'Nunito', sans-serif;
    width: fit-content; margin-top: 2px;
  }

  .pp-body { padding: 20px 26px 0; position: relative; z-index: 1; }

  .pp-section-label {
    font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(107,63,160,0.4); margin-bottom: 10px;
    font-family: 'Nunito', sans-serif; font-weight: 700;
  }

  .pp-stepper {
    display: flex; align-items: center;
    background: rgba(255,255,255,0.6);
    border: 1.5px solid rgba(192,132,252,0.25);
    border-radius: 14px; width: fit-content; overflow: hidden;
  }

  .pp-step-btn {
    background: none; border: none;
    color: rgba(107,63,160,0.55);
    width: 44px; height: 42px;
    font-size: 20px; font-weight: 300;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; font-family: 'Nunito', sans-serif;
  }
  .pp-step-btn:hover {
    background: rgba(192,132,252,0.12);
    color: #a855f7;
  }

  .pp-step-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 600; color: #2e1060;
    width: 40px; text-align: center;
    border-left: 1px solid rgba(192,132,252,0.15);
    border-right: 1px solid rgba(192,132,252,0.15);
    line-height: 42px;
  }

  .pp-total-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 20px; padding-top: 18px;
    border-top: 1px solid rgba(192,132,252,0.12);
  }

  .pp-total-label {
    font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(107,63,160,0.4); font-family: 'Nunito', sans-serif; font-weight: 700;
  }

  .pp-total-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px; font-weight: 600;
    background: linear-gradient(135deg, #a855f7, #ec4899, #14b8a6);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .pp-total-amount sup {
    font-size: 14px; font-family: 'Nunito', sans-serif; font-weight: 600;
    margin-right: 2px;
  }

  .pp-cta {
    width: 100%; margin-top: 18px; padding: 15px;
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
  }
  .pp-cta::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%);
    pointer-events: none;
  }
  .pp-cta:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(192,132,252,0.4); }
  .pp-cta:active { transform: translateY(0); }
      `}</style>

      <div className="home-root">
        {/* Aurora blobs */}
        <div className="home-blob home-blob-1" />
        <div className="home-blob home-blob-2" />
        <div className="home-blob home-blob-3" />
        <div className="home-blob home-blob-4" />

        <div className="home-content">
          {/* Hero */}
          <div className="home-hero">
            <div className="home-hero-eyebrow">
              <Sparkles size={12} /> Your personal library
            </div>
            <h1 className="home-hero-title">
              Your reading <em>journey</em> goes on…
            </h1>
            <p className="home-hero-sub">
              {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}{" "}
              in your collection
            </p>
          </div>

          {/* Stats */}
          <div className="home-stats">
            <div className="stat-pill">
              <div className="stat-dot stat-dot-purple" />
              <span className="stat-label">Total Books</span>
              <span className="stat-value">{bookList.length}</span>
            </div>
            <div className="stat-pill">
              <div className="stat-dot stat-dot-pink" />
              <span className="stat-label">Showing</span>
              <span className="stat-value">{filteredBooks.length}</span>
            </div>
            <div className="stat-pill">
              <div className="stat-dot stat-dot-teal" />
              <span className="stat-label">Role</span>
              <span className="stat-value">{role || "Guest"}</span>
            </div>
          </div>

          {/* Filter Panel */}
          {filter && (
            <div className="filter-panel">
              <div className="filter-panel-title">Filter books</div>
              <div className="filter-row">
                <span className="filter-label">Filter by:</span>
                <select
                  className="filter-select"
                  value={selectedFilterField}
                  onChange={(e) => {
                    setSelectedFilterField(e.target.value);
                    setSelectedFilterValue("");
                    setMaxPrice(highestBookPrice);
                  }}
                >
                  <option value="Category">Category</option>
                  <option value="Author">Author</option>
                  <option value="Price">Price</option>
                </select>
              </div>

              {selectedFilterField === "Price" ? (
                <div className="filter-range-wrap">
                  <div className="filter-range-label">
                    Max Price: <span>&#8377;{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    className="aurora-range"
                    min="0"
                    max={highestBookPrice}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  />
                </div>
              ) : (
                <div className="filter-chips">
                  <button
                    className={`filter-chip${selectedFilterValue === "" ? " active" : ""}`}
                    onClick={() => setSelectedFilterValue("")}
                  >
                    All
                  </button>
                  {getUniqueFilterValues().map((value) => (
                    <button
                      key={value}
                      className={`filter-chip${selectedFilterValue === value ? " active" : ""}`}
                      onClick={() => setSelectedFilterValue(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Book Cards / Empty State */}
          {filteredBooks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <BookOpen size={30} />
              </div>
              <h3>No books found</h3>
              <p>Try adjusting your filters or add a new book.</p>
            </div>
          ) : (
            <Card
              list={filteredBooks}
              onEdit={canEdit ? handleEditInit : null}
              onDelete={canDelete ? handleDelete : null}
              onBuyCart={canBuy ? handleBuy : null}
            />
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
              <BookForm
                bookForm={bookForm}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={() => {
                  resetForm();
                  setShowForm(false);
                }}
                editingId={editingId}
              />
            </div>
          </div>
        )}
        {showPurchasePopup && selectedBook && (
          <div
            className="pp-overlay"
            onClick={() => setShowPurchasePopup(false)}
          >
            <div className="pp-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="pp-handle" />
              <button
                className="pp-close"
                onClick={() => {
    
    setShowPurchasePopup(false);
  }}
                
                
              >
                ×
              </button>

              <div className="pp-book-row">
                <img
                  src={selectedBook.Image}
                  alt={selectedBook.BookName}
                  className="pp-cover"
                />
                <div className="pp-meta">
                  <div className="pp-tag">✦ Ready to Order</div>
                  <div className="pp-title">{selectedBook.BookName}</div>
                  <div className="pp-author">by {selectedBook.Author}</div>
                  <div className="pp-unit-badge">
                    ₹{selectedBook.Price} / copy
                  </div>
                </div>
              </div>

              <div className="pp-body">
                <div className="pp-section-label">Quantity</div>
                <div className="pp-stepper">
                  <button className="pp-step-btn" onClick={decreaseQty}>
                    −
                  </button>
                  <span className="pp-step-num">{quantity}</span>
                  <button className="pp-step-btn" onClick={increaseQty}>
                    +
                  </button>
                </div>

                <div className="pp-total-row">
                  <span className="pp-total-label">Total</span>
                  <span className="pp-total-amount">
                    <sup>₹</sup>
                    {selectedBook.Price * quantity}
                  </span>
                </div>

                <button className="pp-cta px-5 py-5" onClick={handleAddToCart}>
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
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
        {/* FAB: Filter */}
        <button
          className={`fab-filter${filter ? " active" : ""}`}
          onClick={() => {
            setFilter(!filter);
            setSelectedFilterValue("");
            setSelectedFilterField("Category");
            setMaxPrice(highestBookPrice);
          }}
          title="Toggle filters"
        >
          <Funnel size={20} />
        </button>

        {/* FAB: Add */}
        {canAdd && (
          <button
            className="fab-add"
            onClick={() => setShowForm(true)}
            title="Add book"
          >
            <Plus size={22} />
          </button>
        )}
      </div>
    </>
  );
};

export default Home;
