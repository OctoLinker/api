import Link from "next/link";

export default function Footer() {
  return (
    <div className="footer">
      <style jsx>
        {`
          .footer {
            font-size: 14px;
            font-weight: 400;
            margin-top: 20px;
            margin-bottom: 40px;
            text-align: center;
          }

          .footer-logo {
            margin: 20px 0 50px;
          }

          .footer a {
            color: #373a3a;
          }

          .note {
            font-size: 0.8rem;
            line-height: 1.2rem;
            color: #999;
          }

          @media only screen and (max-width: 767px) {
            .footer {
              margin-bottom: 50px;
            }

            .footer a {
              margin-left: 15px;
            }

            .footer-logo {
              margin-bottom: 30px;
            }
          }

          @media only screen and (min-width: 768px) {
            .footer {
              margin: 1rem 0;
            }

            .footer a {
              display: inline;
              margin-right: 0;
              margin-left: 20px;
            }
          }
        `}
      </style>
      <span>&copy; OctoLinker 2019</span>
      <Link href="/privacy">
        <a>Privacy</a>
      </Link>
      <a href="https://twitter.com/octolinker">Twitter</a>
      <a href="https://github.com/octolinker/octolinker">GitHub</a>
      <div className="footer-logo">
        <a
          href="https://www.art-noir.net"
          title="https://www.art-noir.net"
          target="_blank"
        >
          <img
            src="static/art-noir-logo.png"
            alt="https://www.art-noir.net"
            width="90"
          />
        </a>
      </div>

      <div className="note">
        OctoLinker is not affiliated with, sponsored by,
        <br />
        or endorsed by GitHub Inc.
      </div>
    </div>
  );
}
