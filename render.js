import { marked } from 'marked'
import fs from 'node:fs'
import { dirname, join } from 'node:path'
import { basename } from 'node:path'
import { watch } from 'chokidar'
import glob from 'tiny-glob'
import { spawn, spawnSync } from 'node:child_process'

const html = String.raw
const unslugify = slug =>
  slug
    .replace(/\-/g, ' ')
    .replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    )

const commonHeader = html`
  <link rel="preconnect" href="https://rsms.me/" />
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
  <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
  <style>
    :root {
      font-family: Inter, sans-serif;
      font-feature-settings: 'liga' 1, 'calt' 1; /* fix for Chrome */
    }
    @supports (font-variation-settings: normal) {
      :root {
        font-family: InterVariable, sans-serif;
      }
    }
  </style>
`

const writeToDist = async (data, path) => {
  await fs.promises.mkdir(dirname(path), { recursive: true })
  await fs.promises.writeFile(path, data, 'utf8')
}
const exists = file =>
  fs.promises
    .access(file)
    .then(() => true)
    .catch(err => false)
const pages = ['index.html']

const linkify = name => name.replace(/\.md$/, '')

const createHeadingRendererWithCollector =
  (collector = []) =>
  ({ tokens, depth }, markedInstance) => {
    const text = markedInstance.parser.parseInline(tokens)

    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')

    collector.push({
      text,
      depth,
      slug: escapedText,
    })

    return `
        <h${depth}>
          <a name="${escapedText}" class="anchor" href="#${escapedText}">
            <span class="header-link"></span>
          </a>
          ${text}
        </h${depth}>`
  }

const main = async () => {
  const books = (await fs.promises.readdir('books')).map(d => join('books', d))
  const booksBaseNames = books.slice().map(d => unslugify(basename(d)))
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
        ${commonHeader}
      </head>
      <body>
        <h1>Books</h1>
        <ul>
          ${booksBaseNames.map(
            (d, i) => html`<li><a href="/${linkify(books[i])}">${d}</a></li>`
          )}
        </ul>
      </body>
    </html>`

  await writeToDist(baseTemplate, 'dist/index.html')

  for (const book of books) {
    const bookFile = join(book, 'book.md')
    if (!exists(bookFile)) {
      continue
    }
    const contentIndex = []
    const headingRenderer = createHeadingRendererWithCollector(contentIndex)

    marked.use({
      renderer: {
        heading(args) {
          return headingRenderer(args, this)
        },
      },
    })

    const data = await marked(await fs.promises.readFile(bookFile, 'utf8'))

    const bookTemplate = html`
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=
  , initial-scale=1.0"
          />
          <title>Reaper's Books</title>
          ${commonHeader}
        </head>
        <body>
          <section>
            <h2>Contents</h2>
            <ul>
              ${contentIndex
                .map(
                  d =>
                    html`<li
                      style="margin-left: ${d.depth}em"
                      data-depth="${d.depth}"
                    >
                      <a href="#${d.slug}">${d.text}</a>
                    </li>`
                )
                .join('\n')}
            </ul>
            <article>${data}</article>
          </section>
        </body>
      </html>
    `

    await writeToDist(bookTemplate, join('dist', book, 'index.html'))
  }
}

main()

if (process.argv.slice(2).includes('--dev')) {
  const watcher = watch([
    await glob('./**/*.md', { absolute: true }),
    './render.js',
  ])
  watcher.on('all', () => {
    main()
  })
  const pStream = spawn('npx', ['serve', 'dist'], { stdio: 'inherit' })
  if (pStream.pid) {
    pStream.stdout?.pipe(process.stdout)
    pStream.stderr?.pipe(process.stderr)
  }
}
