import Container from "./container";
import Button from "./button";
import InstallButton from "./installButton";
import Code from "./code";

export default function Nav() {
  return (
    <div className="hero">
      <style jsx>
        {`
          .hero {
            text-align: center;
            padding-top: 3rem;
          }

          .hero h1 {
            padding-top: 1.2rem;
            line-height: 2.3rem;
          }

          .hero p {
            margin: 1rem auto;
            max-width: 350px;
            line-height: 1.4rem;
            color: #808493;
          }

          @media only screen and (min-width: 768px) {
            .hero p {
              font-size: 1.4rem;
              font-weight: 300;
              line-height: 2.1rem;
              max-width: 550px;
              margin: 0 auto;
            }
          }
          .hero strong {
            color: #373a3c;
          }
          @media only screen and (max-width: 767px) {
            .hero {
              margin: 0;
            }
            .hero h1 {
              line-height: 2rem;
            }
          }
        `}
      </style>
      <style jsx global>
        {`
          .hero .button {
            margin-top: 8px;
            margin-right: 10px;
          }

          @media only screen and (min-width: 768px) {
            .hero .button {
              margin: 20px 6px;
            }
          }
        `}
      </style>
      <img src="static/octolinker.png" width="200" />
      <h1>
        {" "}
        <strong>OctoLinker</strong> —{" "}
        <span>
          Links together, <nobr>what belongs together.</nobr>
        </span>
      </h1>
      <p>
        OctoLinker is a browser extension for GitHub, which turns
        language-specific statements like <Code>include</Code>{" "}
        <Code>require</Code> or <Code>import</Code> into links.
      </p>
      <p>
        <InstallButton />
        <Button href="#how-it-works">Learn how it works</Button>
      </p>
    </div>
  );
}
