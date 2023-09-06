import { Decimal } from "@prisma/client/runtime/library";
import styles from "./StarRatingDisplay.module.scss";

export interface Props {
  rating: Decimal;
}

export default function StarRatingDisplay({ rating }: Props) {
  const ratingNumber = rating.toNumber();
  const overlay = [0, 1, 2, 3, 4]
    .filter((x) => x < ratingNumber)
    .map((x) => {
      if (ratingNumber - 0.5 === x)
        return <i className="star icon-star-half"></i>;
      else return <i className="star icon-star"></i>;
    });

  const backgroundStars = <div className={styles.starBackground}></div>;

  return (
    <div className={styles.starRatingDisplay}>
      {backgroundStars}
      <div className={styles.starForeground}>{overlay}</div>
    </div>
  );
}
