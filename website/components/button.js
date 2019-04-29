import classNames from "classnames";

export default function Button({ children, compact, href, className }) {
  const classes = classNames(className, "button", {
    compact
  });

  return (
    <a className={classes} href={href}>
      <style jsx>{`
        .button {
          font-size: 12px;
          font-weight: 700;
          line-height: 46px;
          display: inline-block;
          box-sizing: border-box;
          height: 46px;
          padding: 0 22px;
          cursor: pointer;
          text-transform: uppercase;
          color: #fff;
          border-radius: calc(46px / 2);
          text-decoration: none;
          background-color: #1c1f2b;
        }

        .button:hover {
          text-decoration: none;
        }

        @media only screen and (min-width: 768px) {
          .button {
            line-height: 58px;
            height: 58px;
            padding: 0 26px;
            border-radius: calc(58px / 2);
          }
        }

        .button.compact {
          line-height: 45px;
          height: 45px;
          border-radius: calc(45px / 2);
        }

        .button:hover {
          background: #30354a;
        }
      `}</style>
      <span>{children}</span>
    </a>
  );
}
