import Document, { Html, Head, Main, NextScript } from "next/document";

export default class NextSite extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <title>OctoLinker – Links together, what belongs together.</title>
          <meta name="description"
            content="Browser extension for GitHub which turns language-specific module-loading statements like include, require or import into links." />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@octolinker" />
          <meta name="twitter:title" content="OctoLinker – Links together, what belongs together." />
          <meta property="og:url" content="https://octolinker.github.io" />
          <meta property="og:site_name" content="OctoLinker" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="OctoLinker – Links together, what belongs together." />
          <meta property="og:description"
            content="Browser extension for GitHub which turns language-specific module-loading statements like include, require or import into links." />
          <meta property="og:image" content="https://octolinker.github.io/static/octolinker-og-image.jpg" />
          <meta name="twitter:image" content="https://octolinker.github.io/static/octolinker-og-image.jpg" />
          <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <link rel="image_src" href="https://octolinker.github.io/static/octolinker-og-image.jpg" />
          <link
            href="https://fonts.googleapis.com/css?family=Oxygen:300,400,700"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="static/main.css"
            rel="stylesheet"
            type="text/css"
          />
        </Head>
        <style jsx global>{`
        `}</style>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
