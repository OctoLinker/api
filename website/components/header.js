import Link from "next/link";
import Container from "./container";
import InstallButton from "./installButton";
import HideOnMobile from "./hide-on-mobile";

export default function Nav() {
  return (
    <HideOnMobile>
      <style jsx>
        {`
          .nav-box {
            box-shadow: 0px 0px 3px 0px rgba(40, 40, 40, 0.4);
          }

          .nav {
            display: grid;
            grid-template-columns: auto auto;
            justify-content: space-between;
            padding-top: 27px;
            padding-bottom: 15px;
          }

          .nav-item {
            font-size: 12px;
            line-height: 46px;

            font-weight: 700;
            margin: 0 19px;
            text-decoration: none;
            text-transform: uppercase;
            color: #1c1f2b;
          }

          .nav-item:first-child {
            margin-left: 0;
          }

          .nav-item:hover {
            border-bottom: 2px solid #1c1f2b;
          }
        `}
      </style>
      <div className="nav-box hide-on-mobile">
        <Container>
          <nav className="nav">
            <div className="nav-menu-wrapper">
              <Link>
                <a className="nav-item" href="/#how-it-works">
                  How it works
                </a>
              </Link>
              <Link>
                <a className="nav-item" href="/#features">
                  Features
                </a>
              </Link>
              <Link>
                <a className="nav-item" href="/#languages">
                  Languages
                </a>
              </Link>
              <Link>
                <a className="nav-item" href="/#sponsors">
                  Sponsors
                </a>
              </Link>
            </div>
            <InstallButton compact={true} />
          </nav>
        </Container>
      </div>
    </HideOnMobile>
  );
}
