"use client";

import { ChangeEvent, useState } from "react";
import { SingleValue, OptionsOrGroups, GroupBase } from "react-select";
import AsyncSelect from "react-select/async";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import styles from "./SearchBar.module.scss";

type Options = OptionsOrGroups<string, GroupBase<string>>;

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState<SingleValue<string>>();

  const changeSearchQuery = (evt: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(evt.target.value);
    // showResult(searchQuery)
  };

  const loadFetch = useDebouncedCallback(
    (inputValue: string, callback: (_: Options) => void) => {
      const searchParams = new URLSearchParams();
      searchParams.append("query", inputValue);
      fetch(`/search?${searchParams.toString()}`, {})
        .then((result) => result.json())
        .then((result) => {
          console.log("result", result);
          callback([
            {
              label: "Users",
              options: result.users.map((user) => ({
                value: user.UserID,
                label: user.Username,
              })),
            },
            {
              label: "Maps",
              options: result.maps.map((map) => ({
                value: map.SetID,
                label: `${map.Artist} - ${map.Title}`,
              })),
            },
          ]);
        });
    },
    500
  );

  const loadOptions = (inputValue: string, callback: (_: Options) => void) => {
    loadFetch(inputValue, callback);
  };

  return (
    <form className={styles.topBarSearch}>
      <AsyncSelect
        placeholder="Search... (or paste link)"
        loadOptions={loadOptions}
      />

      {/* <input
        className="topBarSearchBar"
        type="text"
        size={30}
        onChange={changeSearchQuery}
        value={searchQuery}
        autoComplete="off"
        placeholder="Search... (or paste link)"
      /> */}

      <div id="topBarSearchResults"></div>
    </form>
  );
}
