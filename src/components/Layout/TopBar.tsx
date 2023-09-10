"use client";

import SearchBar from "./SearchBar";
import styles from "./TopBar.module.scss";
import classNames from "classnames";
import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import RulesetIcon from "../shared/Icons/RulesetIcon";
import TopBarUser from "./TopBarUser";

export default function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={classNames("container", styles.container)}>
        <div className={styles.leftHalf}>
          <Link href="/" className={styles.homeLink}>
            OMDB
          </Link>

          <Link href="/" className={styles.link}>
            <div className="topBarLink">home</div>
          </Link>
          <Link href="/charts/" className={styles.link} passHref>
            <div className="topBarLink">charts</div>
          </Link>

          <div className={classNames(styles.topBarDropDown, styles.link)}>
            <div className="topBarLink topBarDropDownButton">maps</div>
            <div className={styles.dropdownContent}>
              <Link href="/maps/?m=08&amp;y=2023">latest</Link>
              <Link href="/random/">random</Link>
            </div>
          </div>

          <SearchBar />
        </div>

        <div className={styles.spacer} />

        <div className={styles.rightHalf}>
          <div className={classNames(styles.topBarDropDown, styles.link)}>
            <div className="topBarLink topBarDropDownButton">
              <RulesetIcon ruleset="osu" />
            </div>
            <div className={styles.dropdownContent}>
              <a id="osuLink" href="#">
                <RulesetIcon ruleset="osu" />
              </a>
              <a id="taikoLink" href="#">
                <RulesetIcon ruleset="taiko" />
              </a>
              <a id="catchLink" href="#">
                <RulesetIcon ruleset="mania" />
              </a>
              <a id="maniaLink" href="#">
                <RulesetIcon ruleset="catch" />
              </a>
            </div>
          </div>
          <Link href="/dashboard/" className={styles.link}>
            <div className="topBarLink">dashboard</div>
          </Link>
          <Link href="/settings/" className={styles.link}>
            <GearIcon />
          </Link>
          <TopBarUser />
        </div>
      </div>
    </div>
  );
}
