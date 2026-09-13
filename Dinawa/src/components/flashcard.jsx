import { useState } from "react";

export default function Flashcard({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!cards || cards.length === 0) {
    return (
      <div className="learningPage">
        <h1>Learning</h1>
        <p>Upload an image on Home to start learning.</p>
      </div>
    );
  }

  const card = cards[currentIndex];

  const nextCard = () => {
    setCurrentIndex((currentIndex + 1) % cards.length);
  };

  const previousCard = () => {
    setCurrentIndex(
      (currentIndex - 1 + cards.length) % cards.length
    );
  };

  return (
    <div
      className="learningPage"
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Learning
      </h1>

      {/* ONE WHITE CARD */}
      <div
        className="flashcard"
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {card.image && (
          <img
            src={card.image}
            alt={card.ojibwe_word}
            style={{
              display: "block",
              width: "100%",
              maxHeight: "280px",
              objectFit: "contain",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          />
        )}

        <div>
          <h2
            style={{
              fontSize: "22px",
              margin: "0 0 4px 0",
            }}
          >
            {card.ojibwe_word}
          </h2>

          <p
            style={{
              fontSize: "16px",
              margin: "0 0 14px 0",
              color: "#555",
            }}
          >
            {card.english_translation}
          </p>

          <h3
            style={{
              fontSize: "15px",
              margin: "0 0 5px 0",
            }}
          >
            Context
          </h3>

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              margin: 0,
              color: "#444",
            }}
          >
            {card.context}
          </p>
        </div>
      </div>

      {cards.length > 1 && (
        <div
          className="flashcardNavigation"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            marginTop: "16px",
          }}
        >
          <button onClick={previousCard}>←</button>

          <span style={{ fontSize: "13px" }}>
            {currentIndex + 1} / {cards.length}
          </span>

          <button onClick={nextCard}>→</button>
        </div>
      )}
    </div>
  );
}