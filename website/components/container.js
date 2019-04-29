import classNames from "classnames";

export default function Container({ colored, center, children }) {
  if (colored) {
    return (
      <div className="colored">
        {" "}
        <style jsx>
          {`
            .colored {
              background-color: #f7f7f7;
              padding-bottom: 2rem;
              margin-top: 4rem;
            }
          `}
        </style>
        <Container center={center}>{children}</Container>
      </div>
    );
  }

  const classes = classNames("container", {
    center
  });

  return (
    <div className={classes}>
      <style jsx>
        {`
          .container {
            max-width: 500px;
            margin: 0 auto;
            padding: 0 20px;
          }

          @media only screen and (min-width: 768px) {
            .container {
              max-width: 940px;
              padding: 0 30px;
            }

            .container.center {
              text-align: center;
            }
          }
        `}
      </style>
      {children}
    </div>
  );
}
