import classNames from "classnames";
import { useMemo } from "react";
import styles from "./RulesetIcon.module.scss";

export interface RulesetIconProps {
  ruleset: string | number;
}

export default function RulesetIcon({ ruleset }: RulesetIconProps) {
  const mappedRuleset: string = useMemo(() => {
    switch (ruleset) {
      case 0:
      case "osu":
        return "osu";
      case 1:
      case "taiko":
        return "taiko";
      case 2:
      case "catch":
        return "catch";
      case 3:
      case "mania":
        return "mania";
      default:
        return "osu";
    }
  }, [ruleset]);

  return (
    <div
      className={classNames(styles.rulesetIcon, styles[mappedRuleset])}
    ></div>
  );
}
