import { db } from "@/db";
import classNames from "classnames";
import { Metadata } from "next";
import styles from "../page.module.css";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const metadata: Metadata = {
  title: "Settings",
};

const settingsSchema = z.object({});

const ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

async function getData() {
  const apiKeys = await db
    .selectFrom("ApiKey")
    .selectAll()
    .where("ApiKey.UserID", "=", 2688103)
    .execute();

  return { apiKeys };
}

export default async function Page() {
  const { apiKeys } = await getData();
  const doTrueRandom = true;
  const hideRatings = true;

  async function create(formData: FormData) {
    "use server";

    const parsed = settingsSchema.parse({
      id: formData.get("id"),
    });
    console.log("form data", formData);
    // mutate data
    // revalidate cache

    revalidatePath("/settings");
  }

  return (
    <main className={classNames(styles.main, "container")}>
      <h1>Settings</h1>
      <hr />
      <form action={create}>
        <table>
          <tr>
            <td>
              <label>Random behaviour:</label>
              <br />
            </td>
            <td>
              <select
                name="RandomBehaviour"
                id="RandomBehaviour"
                autoComplete="off"
              >
                <option value="0">Prioritise Played</option>
                <option value="1" selected={doTrueRandom}>
                  True Random
                </option>
              </select>
              <br />
              <span className="subText">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                "Prioritise Played" only works if you have osu! supporter.
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <label>Custom rating names:</label>
            </td>
            <td>
              {ratings.map((rating) => {
                const ratingStr = rating.toFixed(1);
                return (
                  <>
                    <input
                      autoComplete="off"
                      placeholder={ratingStr}
                      maxLength={40}
                      value="<?php echo htmlspecialchars($user['Custom50Rating']); ?>"
                    />
                    {ratingStr}
                    <br />
                  </>
                );
              })}
            </td>
          </tr>
          <tr>
            <td>
              <label>Hide ratings:</label>
              <br />
            </td>
            <td>
              <select name="HideRatings" id="HideRatings" autoComplete="off">
                <option value="0">No</option>
                <option value="1" selected={hideRatings}>
                  Yes
                </option>
              </select>
              <br />
              <span className="subText">
                Disallows your ratings from appearing on the front page feed.
              </span>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <button type="submit">Save changes</button>
              <span id="statusText"></span>
            </td>
          </tr>
        </table>
      </form>
      <hr />
      <h2>API</h2>
      <a
        href="https://github.com/apollo-dw/omdb/wiki/API"
        target="_blank"
        rel="noopener noreferrer"
      >
        Click to view the (bare bones) documentations.
      </a>
      <br />
      <span className="subText">
        Please keep your API key secure - if it leaks then it&quot;s as bad as
        having your PASSWORD leaked.
        <br /> Click your application name to REVEAL your API key.
      </span>
      <br />
      <br />

      {apiKeys.map((apiKey) => {
        return (
          <details key={apiKey.ApiKey}>
            <summary>
              {apiKey.ApiKey}
              <a href='RemoveApiApp.php?id={$row["ApiID"]}'>
                <i className="icon-remove"></i>
              </a>
            </summary>
            <span className="subText">{apiKey.ApiKey}</span>
          </details>
        );
      })}

      <form action="CreateNewApiApp.php" method="get">
        <table>
          <tr>
            <td>
              <label>New Application Name:</label>
              <br />
            </td>
            <td>
              <input
                type="text"
                autoComplete="off"
                name="apiname"
                id="apiname"
                placeholder="omdb application"
                maxLength={255}
                minLength={1}
                value=""
                required
              />
              <br />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <button>Create new application</button>
            </td>
          </tr>
        </table>
      </form>
    </main>
  );
}
