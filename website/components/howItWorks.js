export default function HowItWorks() {
  return (
    <>
      <style jsx>
        {`
          h3 span {
            background: #fd4eff;
            width: 1.5em;
            height: 1.5em;
            line-height: 1.5em;
            border-radius: 50%;
            display: inline-block;
            text-align: center;
            margin-right: 0.3em;
            margin-left: -0.3em;
            box-shadow: 0 3px 16px rgba(0, 0, 0, 0.2);
            color: white;
          }
          @media only screen and (min-width: 768px) {
            .how-it-works-boxes {
              display: grid;
              grid-template-columns: auto auto auto;
              grid-gap: 30px;
            }
          }
        `}
      </style>
      <div className="how-it-works-boxes">
        <div className="how-it-works-description">
          <h3><span>1</span> Read</h3>
          <p>
            OctoLinker reads the source code you're currently viewing either
            straight from the browser or in some cases using the GitHub API.
          </p>
          <p>
            No source code will be ever send to a server! Your source code stays
            in your browser.
          </p>
        </div>

        <div className="how-it-works-description">
          <h3><span>2</span> Find</h3>
          <p>
            Based on the file type, OctoLinker invokes a plugin which then
            executes a regular expression on the source code to find import
            statements.
          </p>
        </div>

        <div className="how-it-works-description">
          <h3><span>3</span> Resolve</h3>
          <p>
            Relative file references are resolved through the GitHub tree API in
            your browser. External dependencies are resolved using the{" "}
            <a href="https://octolinker.now.sh/">OctoLinker API</a>.{" "}
          </p>
          <p>
            Only the name of a dependency along with the registry type is send
            to this service.
          </p>
        </div>
      </div>
    </>
  );
}
