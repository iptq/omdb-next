import styles from "./Footer.module.scss";
import classNames from "classnames";

export default function Footer() {
  return (
    <div className={styles.footer}>
      omdb made by <a href="https://omdb.nyahh.net/profile/9558549">apollo</a> | icon made by{" "}
      <a href="https://omdb.nyahh.net/profile/7081160">olc</a> | <a href="/rules/">rules</a> |{" "}
      <a href="https://github.com/apollo-dw/omdb">github</a> | <a href="https://discord.gg/NwcphppBMG">discord</a> |{" "}
      <a href="/edit-queue">edit queue</a>
      <br></br>
    </div>
  );
}
