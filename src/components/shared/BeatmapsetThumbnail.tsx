import styles from "./BeatmapsetThumbnail.module.scss";
import Image from "next/image";

export interface BeatmapsetThumbnailProps {
  setID: number;
}

function BeatmapsetThumbnail({ setID }: BeatmapsetThumbnailProps) {
  return (
    <div className={styles.setImage}>
      <a href={`/mapset/${setID}`}>
        <Image
          height={32}
          width={32}
          src={`https://b.ppy.sh/thumb/${setID}l.jpg`}
          className={styles["beatmapset-image-thumbnail"]}
          alt=""
          unoptimized
        />
      </a>
    </div>
  );
}

export default BeatmapsetThumbnail;
