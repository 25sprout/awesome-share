# Pug web-starter

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/) [![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg?style=flat-square)](https://github.com/conventional-changelog/standard-version)

*新芽網路前端開發架構*

### 簡介

25sprout 自用開發架構，未搭配市面上框架使用，**HTML** 使用 [Pug](pugjs.org) 引擎，**JS** 採用 [Webpack](webpack.github.io) 處理，[Babel](babeljs.io) 編譯，[Jest](facebook.github.io/jest/) 測試，**CSS** 使用 [PostCSS](postcss.org) 編譯，採用 [cssnext](http://cssnext.io) 規範。

目前另有分支 - [separate](https://fox.25sprout.com:10088/frontend/pug-starter/tree/separate) 專供多語系使用，打包結果與 master 不同，會將不同語系分裝成單獨的資料夾，若專案希望以不同 domain 指向個別語系時，可以從此分支進行開發。

### 資源介紹

##### webpack config

`webpack.config.build.js` 是上伺服器時打包用的，會將打包完的檔案存放於 `/build`，將其下所有檔案丟上 server 即可； `webpack.config.dev.js` 則是本機開發時所用，兩支 config 皆共用 `webpack.config.js`，任何共用的設定可於此檔案一同調整，如：webpack 環境變數。

##### config/palette.json

CSS 所用的全域變數，可以於此檔案中設定整個網站的標準色等。

```javascript
{
	"primary": "#F5AA38",
	"secondary": "#DF5F3C",
	"lightGray": "#EBEBEB",
	"gray": "#AAAAAA"
}
```

##### config/website.json

可以在這份檔案設定整個網站的通用內容，目前這份檔案可以設定 GA, JS entry points 以及 輸出成 sitemap.xml，應該可以做出更多應用，歡迎大家提出想法。

`domain` 是供輸出 sitemap 時所用，直接設定成上線的 domain 即可。  
`multiLanguage` 是設定此網站為單/多語系，詳情請見 [**Multiple-Language.md**](http://nas25lol.myqnapcloud.com:10088/frontend/pug-starter/blob/master/Multiple-Language.md)  
`pages` 目前僅供 webpack 設定 entry point 所用，keyname 務必按照 `src/view/` 下的檔案路徑，js 則是按照 `src/js` 下檔案路徑。（ page 格式錯誤會使 webpack compile error  
`dev.port` 設定本機開發時所用的 port

##### config/external-lib.json

設定直接使用 script 引入的外部資源檔，key 為 library 名稱，value 為全域變數。

##### sitemap.js

會在 `npm run build` 後輸出網站的 sitemap 至 `/build/sitemap.xml`，亦可直接使用 `node sitemap.js` 手動輸出（請確定 build 資料夾存在）。

##### /src/static

放置靜態資源，會直接完整複製到 `/build/static` 下。

##### /src/js/appConfig.js

可以在此檔案輸出全網站 js 變數，供其他支 js 共同使用。

目前輸出 domain，並依照不同的 webpack 變數改變其值，可以做到在打包正式機版時，呼叫不同 domain 的 API。

##### /src/view/pug.json

設定供 pug 所用的全域變數

```pug
//- 等號後面為固定語法，左側變數可自行宣告
- global = htmlWebpackPlugin.options.global

#title = global.title
```

### 如何開始

##### 踏出第一步

```bash
$ rm -rf .git
# npm install
$ yarn
$ npm run dev
```

便可在 <http://localhost:8080> 看到本地伺服器～  
*可以在 package.json 設定 port，預設為 8080。（由於使用 BrowserSync plugin，webpack-dev-server 實際上是使用 port 3000，這裡設定的 port 是供 BrowserSync 使用）*

##### npm script

三支主要的指令如下：

`npm run dev`：本機開發時所用，會在 localhost:PORT 啟動  
`npm run demo`：打包上線版本供測試機所用。  
`npm run build`：相同於 `demo`，可以透過 webpack 變數進行不同的變數設定。

專案重建**（小心服用）**：

`npm run init`：此指令希望可以達到整份專案重建的作用，目前會重新命名資料夾、移除示範用檔案並針對單/多語系進行設定。

目前設定了三個問題如下：  
`? What is the project name`：*(String)* 請輸入此專案資料夾希望的名稱（純粹重新命名資料夾）  
`? Is this a multiple language project`：*(Boolean)* 設定此專案是否為多語系*（若為多語系則繼續下一題）*  
`? Tell me the languages you wanna support(connect with ,)`：*(String)* 設定所需支援的多語系，請以逗號分開不加空白，如：`tw,en,jp`（第一個為預設語言）。

以及其他 script 如：`test`, `lint`, `clean` 等，亦可再自行新增～

### ENV

 script  |  NODE_ENV  |  process.env.NODE_ENV
-------- | ---------- | ----------------------
dev      | dev        | DEV
demo     | demo       | DEMO
build    | production | PRODUCTION

### Release

此專案使用 [standard-version](https://github.com/conventional-changelog/standard-version) 輔助 release 流程，自動產生 `CHANGELOG.md` 和 提升版本號（提升 major version 依據是否有 `feat` 來判斷）

- `npm run release`

可以自己決定 提升 patch, minor or major

- `npm run release -- --release-as minor`

**Warning**: 第一次 release 請下

- `npm run release -- --first-release`
