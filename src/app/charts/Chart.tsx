"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Chart() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const debounced = useDebouncedCallback(() => {
    router.push(`/charts?query=${searchQuery}`);
  }, 500);

  const onChangeSearchQuery = (evt) => {
    setSearchQuery(evt.target.value);
    debounced();
  };

  return (
    <>
      hello
      <input type="text" value={searchQuery} onChange={onChangeSearchQuery} />
    </>
  );
}
