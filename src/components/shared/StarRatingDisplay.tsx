"use client";

import styles from "./StarRatingDisplay.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useMemo, useState } from "react";
import classNames from "classnames";

export interface StarRatingDisplayProps {
  rating: number;
  interactive?: boolean;
  key?: number;
  onClick?: (key: number) => void;
}

export default function StarRatingDisplay({ rating, interactive, key, onClick }: StarRatingDisplayProps) {
  const [currentRating, setCurrentRating] = useState<number>(rating);
  const [newRating, setNewRating] = useState<number>(rating);

  const calculateRatingFromEvent = (event: React.MouseEvent<SVGSVGElement, MouseEvent>, index: number) => {
    const starSize =
      event.currentTarget.getBoundingClientRect().right - event.currentTarget.getBoundingClientRect().left;
    const offsetX = event.nativeEvent.offsetX + 4;

    const hoveredRating = offsetX / starSize + (index - 1);
    const roundedRating = Math.round(hoveredRating * 2) / 2;

    return roundedRating;
  };

  const handleStarHover = useCallback(
    (event: React.MouseEvent<SVGSVGElement, MouseEvent> | undefined, index: number) => {
      if (!event) {
        setNewRating(currentRating);
        return;
      }

      const newRating = calculateRatingFromEvent(event, index);
      setNewRating(newRating);
    },
    [currentRating],
  );

  const handleClick = useCallback((event: React.MouseEvent<SVGSVGElement, MouseEvent>, index: number) => {
    const newRating = calculateRatingFromEvent(event, index);
    setCurrentRating(newRating);

    if (key && onClick) {
      onClick(key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const foregroundStars = useMemo(() => {
    return [0, 1, 2, 3, 4]
      .filter((x) => x < newRating)
      .map((x) => {
        return (
          <FontAwesomeIcon
            key={x}
            icon={newRating - 0.5 === x ? faStarHalf : faStar}
            size="sm"
            style={{ pointerEvents: "none" }}
          />
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRating]);

  const backgroundStars = useMemo(
    () => (
      <div className={styles.starBackground}>
        {[0, 1, 2, 3, 4].map((_, x) => (
          <FontAwesomeIcon
            key={x}
            icon={faStar}
            size="sm"
            onClick={interactive ? (e) => handleClick(e, x + 1) : undefined}
            onMouseMove={interactive ? (e) => handleStarHover(e, x + 1) : undefined}
            onMouseLeave={interactive ? () => handleStarHover(undefined, currentRating) : undefined}
          />
        ))}
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRating],
  );

  return (
    <div className={classNames(styles.starRatingDisplay, { pointer: interactive })}>
      {backgroundStars}
      <div className={styles.starForeground}>{foregroundStars}</div>
    </div>
  );
}
