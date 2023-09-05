import styles from "./RatingTable.module.scss";
import { PrismaClient } from "@prisma/client";

export async function getData() {
  const prisma = new PrismaClient();

  const comments = await prisma.comments.findMany({ take: 20 });

  return { comments };
}

export default async function RatingTable() {
  return (
    <div
      className="flex-child column-when-mobile" // style="width:40%;height:32em;overflow-y:scroll;position:relative;"
    >
      <div className="flex-container ratingContainer alternating-bg">
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
      </div>
    </div>
  );
}
