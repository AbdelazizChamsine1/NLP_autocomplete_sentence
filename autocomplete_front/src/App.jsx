import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [completions, setCompletions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionsRef = useRef(null);

  const handleInputChange = async (e) => {
    const q = e.target.value;
    setQuery(q);
    setActiveIndex(-1);

    if (q.length < 2) {
      setCompletions([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/autocomplete?q=${q}`);
      const data = await response.json();
      setCompletions(data.Completions || []);
    } catch (error) {
      console.error("Error fetching completions:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (completions.length === 0) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % completions.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + completions.length) % completions.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      setQuery(completions[activeIndex]);
      setCompletions([]);
      setActiveIndex(-1);
    }
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
    setCompletions([]);
  };

  useEffect(() => {
    // Scroll into view active item
    if (suggestionsRef.current && activeIndex >= 0) {
      const el = suggestionsRef.current.children[activeIndex];
      if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeIndex]);

  return (
    <div className="container">
      <h1 className="title">🔍 Autocomplete System</h1>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Start typing your question..."
        className="search-box"
      />
      <ul className="suggestions-list" ref={suggestionsRef}>
        {completions.map((c, index) => (
          <li
            key={index}
            className={`suggestion ${index === activeIndex ? "active" : ""}`}
            onClick={() => handleSuggestionClick(c)}
          >
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
