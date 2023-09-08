"use client";

import SearchBar from "./SearchBar";
import styles from "./TopBar.module.scss";
import classNames from "classnames";
import { GearIcon } from "@radix-ui/react-icons";
import UserProfilePicture from "./UserProfilePicture";

export default function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={classNames("container", styles.container)}>
        <div className={styles.leftHalf}>
          <a href="/" className={styles.homeLink}>
            OMDB
          </a>

          <a href="/" className={styles.link}>
            <div className="topBarLink">home</div>
          </a>
          <a href="/charts/" className={styles.link}>
            <div className="topBarLink">charts</div>
          </a>

          <div className={classNames(styles.topBarDropDown, styles.link)}>
            <div className="topBarLink topBarDropDownButton">maps</div>
            <div className={styles.dropdownContent}>
              <a href="/maps/?m=08&amp;y=2023">latest</a>
              <a href="/random/">random</a>
            </div>
          </div>

          <SearchBar />
        </div>

        <div className={styles.spacer} />

        <div className={styles.rightHalf}>
          <div className={styles.topBarDropDown}>
            <div className="topBarLink topBarDropDownButton">osu! </div>
            <div className={styles.dropdownContent}>
              <a id="osuLink" href="">
                osu!
              </a>
              <a id="taikoLink" href="">
                osu!taiko
              </a>
              <a id="catchLink" href="">
                osu!catch
              </a>
              <a id="maniaLink" href="">
                osu!mania
              </a>
            </div>
          </div>
          <a href="/dashboard/">
            <div className="topBarLink">dashboard</div>
          </a>
          <a href="/settings/">
            <GearIcon />
          </a>
          <UserProfilePicture userID={2688103} username="IOException" />
          <a className={styles.username} href="/profile/2688103">
            <b>IOException</b>
          </a>
        </div>
      </div>
    </div>
  );
}
