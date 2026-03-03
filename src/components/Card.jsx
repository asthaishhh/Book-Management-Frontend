import React from "react";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";

const Card = ({ list = [], onEdit, onDelete, onBuyCart }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&display=swap');

        /* ── grid ── */
        .card-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
          animation: gridIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes gridIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 640px)  { .card-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 900px)  { .card-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1200px) { .card-grid { grid-template-columns: repeat(4, 1fr); } }

        /* ── card shell — fixed height, full bleed ── */
        .book-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          /* fixed aspect ratio so all cards are uniform tall rectangles */
          aspect-ratio: 2 / 3;
          box-shadow:
            0 8px 32px rgba(30,5,60,0.28),
            0 2px 8px rgba(180,130,255,0.12);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.35s cubic-bezier(0.22,1,0.36,1);
          animation: cardIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: scale(0.94) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .book-card:hover {
          transform: translateY(-8px) scale(1.025);
          box-shadow:
            0 24px 56px rgba(30,5,60,0.38),
            0 0 0 2px rgba(192,132,252,0.5),
            0 0 40px rgba(192,132,252,0.15);
        }

        /* ── full-bleed cover image ── */
        .card-cover {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.55s cubic-bezier(0.22,1,0.36,1),
                      filter 0.55s ease;
          /* slight warm-correct so covers look natural */
          filter: brightness(1.0) saturate(1.05);
        }
        .book-card:hover .card-cover {
          transform: scale(1.08);
          filter: brightness(0.55) saturate(0.8) blur(1.5px);
        }

        /* no-cover placeholder */
        .card-no-cover {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(160deg, #2a0a50 0%, #1a0535 100%);
          color: rgba(192,132,252,0.4);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          transition: opacity 0.3s;
        }
        .card-no-cover svg { width: 48px; height: 48px; opacity: 0.3; }
        .book-card:hover .card-no-cover {
          /* dim placeholder so overlay is still readable */
          filter: brightness(0.6);
        }

        /* ── iridescent top stripe (always visible) ── */
        .card-stripe {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c084fc, #f9a8d4, #86efac, #7dd3fc, #c084fc);
          z-index: 3;
          opacity: 0.7;
        }

        /* ── category pill (always visible, top-right) ── */
        .card-badge {
          position: absolute;
          top: 12px; right: 12px;
          z-index: 4;
          background: rgba(20, 5, 40, 0.55);
          border: 1px solid rgba(192,132,252,0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #e4baff;
          font-size: 9.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.9px;
          padding: 4px 10px;
          border-radius: 999px;
          transition: opacity 0.3s;
        }
        .book-card:hover .card-badge { opacity: 0; }

        /* ── hover overlay panel — slides up from bottom ── */
        .card-overlay {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          /* frosted dark-aurora glass */
          background: linear-gradient(
            to top,
            rgba(25, 5, 55, 0.96) 0%,
            rgba(35, 8, 70, 0.88) 50%,
            rgba(45, 10, 85, 0.35) 80%,
            transparent 100%
          );
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          opacity: 0;
          transform: translateY(12px);
          transition:
            opacity 0.38s cubic-bezier(0.22,1,0.36,1),
            transform 0.38s cubic-bezier(0.22,1,0.36,1),
            backdrop-filter 0.38s ease;
          padding: 24px 20px 20px;
        }
        .book-card:hover .card-overlay {
          opacity: 1;
          transform: translateY(0);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        /* overlay content */
        .overlay-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          color: #f5eeff;
          line-height: 1.2;
          margin-bottom: 10px;
          letter-spacing: -0.2px;
        }

        /* thin iridescent rule under title */
        .overlay-rule {
          height: 1.5px;
          width: 40px;
          background: linear-gradient(90deg, #c084fc, #f9a8d4);
          border-radius: 999px;
          margin-bottom: 12px;
          transition: width 0.4s 0.1s cubic-bezier(0.22,1,0.36,1);
        }
        .book-card:hover .overlay-rule { width: 80px; }

        .overlay-meta {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 14px;
        }
        .overlay-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .overlay-label {
          font-size: 9.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(192,132,252,0.65);
          min-width: 52px;
          flex-shrink: 0;
        }
        .overlay-value {
          font-size: 13px;
          font-weight: 600;
          color: rgba(240,228,255,0.88);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .overlay-price {
          font-size: 15px;
          font-weight: 800;
          background: linear-gradient(90deg, #c084fc, #f9a8d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── action buttons inside overlay ── */
        .overlay-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          padding-top: 10px;
          border-top: 1px solid rgba(192,132,252,0.15);
        }
        .card-action-btn {
          width: 34px; height: 34px;
          border-radius: 10px;
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.22,1,0.36,1);
        }
        .card-action-btn.edit {
          background: rgba(192,132,252,0.15);
          border: 1px solid rgba(192,132,252,0.3);
          color: #d8aaff;
        }
        .card-action-btn.edit:hover {
          background: rgba(192,132,252,0.3);
          border-color: rgba(192,132,252,0.6);
          transform: scale(1.1);
          box-shadow: 0 0 14px rgba(192,132,252,0.3);
        }
        .card-action-btn.delete {
          background: rgba(249,100,140,0.12);
          border: 1px solid rgba(249,168,212,0.25);
          color: #ffb3cc;
        }
        .card-action-btn.delete:hover {
          background: rgba(249,100,140,0.28);
          border-color: rgba(249,100,140,0.55);
          color: #ff6b9d;
          transform: scale(1.1);
          box-shadow: 0 0 14px rgba(249,100,140,0.3);
        }
      `}</style>

      <div className="card-grid">
        {list.map((book, i) => (
          <div
            key={book._id}
            className="book-card"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {/* Iridescent stripe */}
            <div className="card-stripe" />

            {/* Cover image or placeholder */}
            {book.Image ? (
              <img
                className="card-cover"
                src={book.Image}
                alt={book.BookName}
              />
            ) : (
              <div className="card-no-cover">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                No Cover
              </div>
            )}

            {/* Category badge — visible at rest, fades on hover */}
            {book.Category && (
              <span className="card-badge">{book.Category}</span>
            )}

            {/* Hover info overlay */}
            <div className="card-overlay">
              <div className="overlay-title">{book.BookName}</div>
              <div className="overlay-rule" />
              <div className="overlay-meta">
                <div className="overlay-row">
                  <span className="overlay-label">Author</span>
                  <span className="overlay-value">{book.Author}</span>
                </div>
                <div className="overlay-row">
                  <span className="overlay-label">Price</span>
                  <span className="overlay-price">&#8377;{book.Price}</span>
                </div>
                {book.Category && (
                  <div className="overlay-row">
                    <span className="overlay-label">Category</span>
                    <span className="overlay-value">{book.Category}</span>
                  </div>
                )}
              </div>

              {(onEdit || onDelete) && (
                <div className="overlay-actions">
                  {onEdit && (
                    <button
                      className="card-action-btn edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(book);
                      }}
                      title="Edit book"
                    >
                      <FaPen size={13} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="card-action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(book._id);
                      }}
                      title="Delete book"
                    >
                      <MdDelete size={16} />
                    </button>
                  )}
                  {onBuyCart && (
                    <button
                      className="card-action-btn edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuyCart(book);
                      }}
                      title="Buy book"
                    >
                      <FaShoppingBag />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Card;
