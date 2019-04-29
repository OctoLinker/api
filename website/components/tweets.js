import HideOnMobile from "./hide-on-mobile";

export default function Tweets() {
  return (
    <>
      <style jsx>{`
        @media only screen and (min-width: 768px) {
          .tweet-boxes {
            display: grid;
            grid-column-gap: 15px;
            grid-template-columns: repeat(2, 50%);
          }
        }
      `}</style>
      <div className="tweet-boxes">
        <blockquote
          className="twitter-tweet"
          data-cards="hidden"
          data-lang="en"
        >
          <p lang="en" dir="ltr">
            Octo Linker links up dependencies, require() &amp; ES2015 imports
            across packages on GitHub{" "}
            <a href="https://t.co/vhoZyyINi2">https://t.co/vhoZyyINi2</a> 👌{" "}
            <a href="https://t.co/LcB7uMoVPI">pic.twitter.com/LcB7uMoVPI</a>
          </p>
          &mdash; Addy Osmani (@addyosmani)
          <a href="https://twitter.com/addyosmani/status/682002966669180928?ref_src=twsrc%5Etfw">
            December 30, 2015
          </a>
        </blockquote>

        <blockquote
          className="twitter-tweet"
          data-cards="hidden"
          data-lang="en"
        >
          <p lang="en" dir="ltr">
            I&#39;m generally skeptical of Chrome plugins, but OctoLinker&#39;s
            been really handy. Makes it much easier to navigate projects on
            GitHub.{" "}
            <a href="https://t.co/CfZD2Awe8O">https://t.co/CfZD2Awe8O</a>
          </p>
          &mdash; Daniel O&#39;Connor (@_danoc)
          <a href="https://twitter.com/_danoc/status/1093640620692783104?ref_src=twsrc%5Etfw">
            February 7, 2019
          </a>
        </blockquote>

        <blockquote
          className="twitter-tweet"
          data-cards="hidden"
          data-lang="en"
        >
          <p lang="en" dir="ltr">
            OctoLinker is probably the most valuable tool I&#39;ve added to my
            developer belt in the last five years. Lowering friction to read
            open source code gives me superpowers{" "}
            <a href="https://t.co/7eE7pNopRN">https://t.co/7eE7pNopRN</a>
          </p>
          &mdash; Josh Duff (@TehShrike){" "}
          <a href="https://twitter.com/TehShrike/status/1049322121913094150?ref_src=twsrc%5Etfw">
            October 8, 2018
          </a>
        </blockquote>
        <HideOnMobile>
          <blockquote
            className="twitter-tweet"
            data-conversation="none"
            data-lang="en"
          >
            <p lang="en" dir="ltr">
              Octolinker is crucial improvement, being able to jump around files
              without searching for them makes analysing code and dependencies a
              breeze
            </p>
            &mdash; Pete Nykänen (@pete_tnt)
            <a href="https://twitter.com/pete_tnt/status/1107037105207812096?ref_src=twsrc%5Etfw">
              March 16, 2019
            </a>
          </blockquote>
        </HideOnMobile>
        <HideOnMobile>
          <blockquote
            className="twitter-tweet"
            data-conversation="none"
            data-lang="en"
          >
            <p lang="en" dir="ltr">
              Navigating and understanding a new codebase becomes so easy.
              Thanks{" "}
              <a href="https://twitter.com/OctoLinker?ref_src=twsrc%5Etfw">
                @OctoLinker
              </a>{" "}
              for this! ❤
            </p>
            &mdash; Nikhita Raghunath (@TheNikhita){" "}
            <a href="https://twitter.com/TheNikhita/status/832295220175892481?ref_src=twsrc%5Etfw">
              February 16, 2017
            </a>
          </blockquote>
        </HideOnMobile>
        <HideOnMobile>
          <blockquote
            className="twitter-tweet"
            data-cards="hidden"
            data-lang="en"
          >
            <p lang="en" dir="ltr">
              How did I go all these years without coming across{" "}
              <a href="https://twitter.com/OctoLinker?ref_src=twsrc%5Etfw">
                @OctoLinker
              </a>{" "}
              extension for GitHub? Essential.{" "}
              <a href="https://t.co/3wT8rwaPch">https://t.co/3wT8rwaPch</a>
            </p>
            &mdash; Steve Wu (@stevenwu){" "}
            <a href="https://twitter.com/stevenwu/status/1090020371619766272?ref_src=twsrc%5Etfw">
              January 28, 2019
            </a>
          </blockquote>
        </HideOnMobile>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        />
      </div>
    </>
  );
}
