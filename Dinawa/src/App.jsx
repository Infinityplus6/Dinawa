import { useState } from "react";
import UploadFile from "./components/UploadFile.jsx";
import Flashcard from "./components/flashcard.jsx";

export default function App() {
  const [page, setPage] = useState("home");
  const [cards, setCards] = useState([]);

  const addFlashcard = (card) => {
    setCards((previousCards) => [
      ...previousCards,
      card,
    ]);
  };

  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navigation">

        <button
          onClick={() => setPage("home")}
          className={
            page === "home"
              ? "active"
              : ""
          }
        >
          Home
        </button>

        <button
          onClick={() => setPage("learning")}
          className={
            page === "learning"
              ? "active"
              : ""
          }
        >
          Learning
        </button>

      </nav>

      {/* Pages */}
      {page === "home" && (
        <UploadFile
          onCardCreated={addFlashcard}
        />
      )}

      {page === "learning" && (
        <Flashcard
          cards={cards}
        />
      )}

    </div>
  );
}