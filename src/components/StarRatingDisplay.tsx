import { Decimal } from "@prisma/client/runtime/library";
import styles from "./StarRatingDisplay.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";

export interface StarRatingDisplayProps {
  rating: number;
}

export default function StarRatingDisplay({ rating }: StarRatingDisplayProps) {
  const numbers = [0, 1, 2, 3, 4];
  const overlay = numbers
    .filter((x) => x < rating)
    .map((x) => {
      if (rating - 0.5 === x)
        return <FontAwesomeIcon icon={faStarHalf} color="white" fixedWidth />;
      else return <FontAwesomeIcon icon={faStar} color="white" fixedWidth />;
    });

  const backgroundStars = (
    <div className={styles.starBackground}>
      {numbers.map((_) => (
        <FontAwesomeIcon icon={faStar} color="black" fixedWidth />
      ))}
    </div>
  );

  return (
    <div className={styles.starRatingDisplay}>
      {backgroundStars}
      <div className={styles.starForeground}>{overlay}</div>
    </div>
  );
}
