import Code from "./code";

export default function Sponsors() {
  return (
    <>
      <style jsx>{`
        .sponsor-boxes {
          display: grid;
          grid-column-gap: 15px;
        }

        @media only screen and (min-width: 768px) {
          .sponsor-boxes {
            grid-template-columns: repeat(2, 50%);
          }
        }

        .sponsor-logo {
          transition: all 180ms ease-in-out;
        }

        .sponsor-logo:hover {
          transform: scale(1.05);
        }

        .sponsor-logo {
          width: 120px;
          height: 120px;
          margin: auto;
          border-radius: 50%;
          background-repeat: no-repeat;
          background-position-x: center;
          background-size: contain;
        }

        @media only screen and (min-width: 768px) {
          .sponsor-logo {
            width: 200px;
            height: 200px;
            margin-bottom: 20px;
          }
        }
      `}</style>
      <div className="sponsor-boxes">
        <div>
          <a href="https://zeit.co">
            <div
              className="sponsor-logo"
              style={{
                backgroundColor: "#000",
                backgroundImage: "url(static/zeit.png)",
                backgroundPositionY: "54%",
                backgroundSize: "65%"
              }}
            />
          </a>
          <p>
            With <a href="https://zeit.co/">ZEIT Now</a> we can ensure that we
            provide you with the best user experience when using OctoLinker. The
            simplicity and power of ZEIT Now allows use to serve a reliably
            OctoLinker API from different locations around the world with low
            latency.
          </p>
        </div>
        <div>
          <a href="https://redisgreen.net">
            <div
              className="sponsor-logo"
              style={{
                backgroundColor: "#5f8834",
                backgroundImage: "url(static/redisgreen.png)",
                backgroundPositionY: "53%",
                backgroundSize: "80%"
              }}
            />
          </a>
          <p>
            We leverage <a href="https://redisgreen.net">RedisGreen</a> high
            performance as a caching layer to reduce network calls to
            third-party providers such as <Code>npmjs.com</Code>,{" "}
            <Code>getcomposer.org</Code>, <Code>rubygems.org</Code> and more.
            RedisGreen supports OctoLinker with four dedicated servers and high
            availability in four regions.
          </p>
        </div>
      </div>
    </>
  );
}
