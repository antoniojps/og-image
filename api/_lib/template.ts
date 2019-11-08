import { readFileSync } from 'fs'
import marked from 'marked'
import { sanitizeHtml } from './sanitizer'
import { ParsedRequest } from './types'
const twemoji = require('twemoji')
const twOptions = { folder: 'svg', ext: '.svg' }
const emojify = (text: string) => twemoji.parse(text, twOptions)

const rglr = readFileSync(`${__dirname}/../_fonts/PlantsRough.woff2`).toString(
  'base64'
)

function getCss(theme: string, fontSize: string) {
  let background = '#111111'
  let foreground = 'white'

  if (theme === 'dark') {
    background = '#111111'
    foreground = 'white'
  }
  return `
    @font-face {
        font-family: 'PlantsRough';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    body {
        height: 100vh;
        width: 100vw;
        background: ${background};
        background-size: auto;
        background-image: url("https://major.shootsgud.com/sml_bg.png");
        background-position: 50% 10%;
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .top {
      position: absolute;
      width: 50px;
      height: 50px;
      background-image: url("https://major.shootsgud.com/pubg-pt.png");
      background-repeat: no-repeat;
      background-position: center;
      margin: 2em;
      top: 0;
      right: 0;
    }

    .spacer {
        margin: 150px;
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    p {
      margin-top: 0.3em;
    }

    .seperator {
      height: 10px;
      width: 15%;
      background: repeating-linear-gradient( 45deg, rgba(0,0,0,0), rgba(0,0,0,0) 10px, #F1B11D 10px, #F1B11D 20px );
      margin-top: 2em;
      margin-bottom: 1em;
      margin-left: auto;
      margin-right: auto;
    }

    .heading {
      font-family: 'PlantsRough', sans-serif;
      font-size: ${sanitizeHtml(fontSize)};
      color: ${foreground};
      line-height: 1;
      letter-spacing: 0.05em;
    }
  `
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, images, widths, heights } = parsedReq
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
            <div class="top"></div>
            <div class="spacer" />
            <div class="logo-wrapper">
                ${images
                  .map(
                    (img, i) =>
                      getPlusSign(i) + getImage(img, widths[i], heights[i])
                  )
                  .join('')}
            </div>
            <div class="seperator"></div>
            <div class="heading">${emojify(
              md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
</html>`
}

function getImage(src: string, width = 'auto', height = '225') {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
  return i === 0 ? '' : '<div class="plus">+</div>'
}
