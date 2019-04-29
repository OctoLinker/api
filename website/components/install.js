import InstallButton from "./installButton";

export default function Install() {
  return (
    <>
      <style jsx>{`
        @media only screen and (min-width: 768px) {
          p {
            margin: 1rem auto;
            max-width: 600px;
          }
        }

        @media only screen and (max-width: 768px) {
          .install-count {
            padding-left: 1em;
          }
        }
      `}</style>
      <p>
        OctoLinker is a browser extension and available on{" "}
        <a
          href="https://chrome.google.com/webstore/detail/octo-linker/jlmafbaeoofdegohdhinkhilhclaklkp"
          rel="nofollow"
        >
          <nobr>Chrome Web Store</nobr>
        </a>
        ,{" "}
        <a
          href="https://addons.mozilla.org/en-US/firefox/addon/octolinker/"
          rel="nofollow"
        >
          <nobr>Mozilla Add-ons Store</nobr>
        </a>{" "}
        or{" "}
        <a
          href="https://addons.opera.com/en/extensions/details/octolinker/"
          rel="nofollow"
        >
          <nobr>Opera Add-ons Store</nobr>
        </a>
        <br />
        Install and enhance your GitHub experience.
      </p>
      <InstallButton />
      <div className="install-count">
        <small>Trusted by over 20,000 developers</small>
      </div>
    </>
  );
}
