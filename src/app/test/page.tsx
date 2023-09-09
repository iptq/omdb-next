import classNames from "classnames";
import styles from "../page.module.css";
import RulesetIcon from "@/components/shared/Icons/RulesetIcon";

export default async function Page() {
    return (
        <main className={classNames(styles.main, "content")}>
            <p>Test page entirely for testing!!!</p>
            <RulesetIcon ruleset={0} />
        </main>
    );
}
