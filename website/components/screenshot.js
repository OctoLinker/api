export default function Screenshot() {
  return (
    <>
      <style jsx>
        {`
          .screenshot {
            width: 100%;
            text-align: center;
            margin: 3rem 0 2rem 0;
          }

          .screenshot > img {
            border-radius: 5px;
            box-shadow: 0 3px 16px rgba(0, 0, 0, 0.2);
          }

          @media only screen and (min-width: 768px) {
            .screenshot {
                margin: 6rem 0 5rem 0;
            }
          }
        `}
      </style>
      <div className="screenshot">
        <img src="static/screenshot.png" width="100%" />
      </div>
    </>
  );
}
