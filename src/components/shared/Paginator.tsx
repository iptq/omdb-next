"use client";

import React from "react";
import classNames from "classnames";
import styles from "./Paginator.module.scss";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (shift: number) => void;
}

function Paginator({ currentPage, totalPages, onPageChange }: PaginatorProps) {
  const handlePageChange = (pageChange: number) => {
    if (currentPage + pageChange >= 1 && currentPage + pageChange <= totalPages) {
      onPageChange(pageChange);
    }
  };

  const generatePageNumbers = () => {
    const adjacentPages = 1;
    const start = Math.max(1, currentPage - adjacentPages);
    const end = Math.min(totalPages, currentPage + adjacentPages);

    const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

    if (pages[0] !== 1) {
      pages.unshift(1);
    }

    if (pages[pages.length - 1] !== totalPages) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pagesToShow = generatePageNumbers();

  return (
    <div className={classNames(styles.paginator)}>
      <span className="pointer" onClick={() => handlePageChange(-1)}>
        «
      </span>
      {pagesToShow.map((page) => (
        <span
          key={page}
          className={classNames("pointer", page === currentPage && styles.current)}
          onClick={() => handlePageChange(page - currentPage)}
        >
          {page}
        </span>
      ))}
      <span className="pointer" onClick={() => handlePageChange(1)}>
        »
      </span>
    </div>
  );
}

export default Paginator;
