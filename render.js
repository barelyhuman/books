import { marked } from "marked";
import fs from "node:fs";
import { dirname, join } from "node:path";
import { basename } from "node:path";
import { watch } from "chokidar";
import glob from "tiny-glob";

const html = String.raw;
const unslugify = (slug) =>
  slug
    .replace(/\-/g, " ")
    .replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    );

const writeToDist = async (data, path) => {
  await fs.promises.mkdir(dirname(path), { recursive: true });
  await fs.promises.writeFile(path, data, "utf8");
};
const exists = (file) =>
  fs.promises
    .access(file)
    .then(() => true)
    .catch((err) => false);
const pages = ["index.html"];

const linkify = (name) => name.replace(/\.md$/, "");

const main = async () => {
  const books = (await fs.promises.readdir("books")).map((d) =>
    join("books", d)
  );
  const booksBaseNames = books.slice().map((d) => unslugify(basename(d)));
  const baseTemplate = html` <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=
  , initial-scale=1.0"
        />
        <title>Reaper's Books</title>
      </head>
      <body>
        <ul>
          ${booksBaseNames.map(
            (d, i) => html`<li><a href="/${linkify(books[i])}">${d}</a></li>`
          )}
        </ul>
      </body>
    </html>`;

  await writeToDist(baseTemplate, "dist/index.html");

  for (const book of books) {
    const bookFile = join(book, "book.md");
    if (!exists(bookFile)) {
      continue;
    }
    const data = await marked(await fs.promises.readFile(bookFile, "utf8"));
    await writeToDist(data, join("dist", book, "index.html"));
  }
};

main();

if (process.argv.slice(2).includes("--dev")) {
  const watcher = watch(await glob("./**/*.md",{absolute:true}));
  watcher.on("all", () => {
    main();
  });
}
