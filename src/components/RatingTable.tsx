import classNames from "classnames";
import styles from "./RatingTable.module.scss";
import { PrismaClient } from "@prisma/client";
import StarRatingDisplay from "./StarRatingDisplay";

export async function getData() {
  const prisma = new PrismaClient();

  const ratings = await prisma.rating.findMany({
    take: 20,
    include: { Beatmap: { select: { SetID: true } } },
  });
  const comments = await prisma.comment.findMany({ take: 20 });

  return { ratings, comments };
}

export default async function RatingTable() {
  const { ratings } = await getData();

  return (
    <div
      className="flex-child column-when-mobile" // style="width:40%;height:32em;overflow-y:scroll;position:relative;"
    >
      {ratings.map((rating) => {
        return (
          <div className={classNames(styles.ratingContainer)}>
            <div className={styles.setImage}>
              <a href={`/mapset/${rating.Beatmap.SetID}`}>
                <img
                  src={`https://b.ppy.sh/thumb/${rating.Beatmap.SetID}l.jpg`}
                  className={styles.diffThumb}
                  //   onerror="this.onerror=null; this.src='/charts/INF.png';"
                />
              </a>
            </div>
            <div>
              <a href={`/profile/${rating.UserID}`}>
                <img
                  src={`https://s.ppy.sh/a/${rating.UserID}`}
                  className={styles.profilePicture}
                  title="<?php echo GetUserNameFromId($row['UserID'], $conn); ?>"
                />
              </a>
            </div>

            <div className="flex-child" style={{ flex: "0 0 66%" }}>
              {/* <a style="display:flex;" href="/profile/<?php echo $row["UserID"]; ?>">
                        <?php echo GetUserNameFromId($row["UserID"], $conn); ?>
                    </a> */}
              <StarRatingDisplay rating={rating.Score} /> on
              <a href={`/mapset/${rating.Beatmap.SetID}`}>
                {/* mb_strimwidth(htmlspecialchars($row["DifficultyName"]), 0, 35, "...") . "</a>"; */}
              </a>
            </div>
          </div>
        );
      })}
      {/* <div className="flex-container ratingContainer alternating-bg">
        <div
          className="flex-child" // style="margin-left:0.5em;"
        >
          <a href="/mapset/115011">
            <img
              src="https://b.ppy.sh/thumb/115011l.jpg"
              className="diffThumb"
              onerror="this.onerror=null; this.src='/charts/INF.png';"
            />
          </a>
        </div>
        <div className="flex-child">
          <a // style="display:flex;"
            href="/profile/11237996"
          >
            <img
              src="https://s.ppy.sh/a/11237996"
              //   style="height:24px;width:24px;"
              title="payney"
            />
          </a>
        </div>
        <div
          className="flex-child" //style="flex:0 0 66%;"
        >
          <a // style="display:flex;"
            href="/profile/11237996"
          >
            payney{" "}
          </a>
          <div className="starRatingDisplay">
            <div className="starBackground">
              <i className="icon-star"></i>
              <i className="icon-star"></i>
              <i className="icon-star"></i>
              <i className="icon-star"></i>
              <i className="icon-star"></i>
            </div>
            <div className="starForeground">
              <i className="star icon-star"></i>
              <i className="star icon-star"></i>
              <i className="star icon-star"></i>
              <i className="star icon-star"></i>
            </div>
          </div>{" "}
          on <a href="/mapset/115011">Lan</a>{" "}
        </div>
      </div> */}
    </div>
  );
}
