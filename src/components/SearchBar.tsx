"use client";

import { ChangeEvent, useState } from "react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const changeSearchQuery = (evt: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(evt.target.value);
    // showResult(searchQuery)
  };

  return (
    <form className="topBarSearch">
      <input
        className="topBarSearchBar"
        type="text"
        size={30}
        // onfocusin="searchFocus()"
        onChange={changeSearchQuery}
        value={searchQuery}
        autoComplete="off"
        placeholder="Search... (or paste link)"
      />

      <div id="topBarSearchResults"></div>
    </form>
  );
}
