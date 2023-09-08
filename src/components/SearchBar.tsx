"use client";

import {
  components,
  OptionsOrGroups,
  GroupBase,
  DropdownIndicatorProps,
} from "react-select";
import AsyncSelect from "react-select/async";
import { useDebouncedCallback } from "use-debounce";
import styles from "./SearchBar.module.scss";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type Options = OptionsOrGroups<string, GroupBase<string>>;

export default function SearchBar() {
  const [value, setValue] = useState(null);
  const router = useRouter();

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
              options: result.users.map((user: any) => ({
                value: { user: user.UserID },
                label: user.Username,
              })),
            },
            {
              label: "Maps",
              options: result.maps.map((map: any) => ({
                value: { map: map.SetID },
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

  const navigate = (newValue) => {
    setValue(newValue);
    if (!newValue) return;
    const { value } = newValue;
    if (value.user) router.push(`/profile/${value.user}`);
    if (value.map) router.push(`/mapset/${value.map}`);
    setValue(null);
  };

  return (
    <form className={styles.topBarSearch}>
      <AsyncSelect
        placeholder="Search... (or paste link)"
        loadOptions={loadOptions}
        value={value}
        onChange={navigate}
        components={{ DropdownIndicator }}
      />

      <div id="topBarSearchResults"></div>
    </form>
  );
}

function DropdownIndicator(props: DropdownIndicatorProps) {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <FontAwesomeIcon icon={faSearch} />
      </components.DropdownIndicator>
    )
  );
}
