export default function Container({ image, label }) {
  return (
    <div className="language-box">
      <style jsx>
        {`
          .language-box {
            width: 104px;
            height: 104px;
            border-radius: 50%;
            background-color: #fff;
            text-align: center;
            box-shadow: 0 0 5px 0 rgba(209, 209, 252, 0.4);
          }

          @media only screen and (min-width: 768px) {
            .language-box {
              width: 113px;
              height: 113px;
            }
          }

          .language-icon {
            margin-top: 20px;
            display: inline-block;
            width: 50px;
            height: 50px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
          }

          .language-name {
            font-size: 12px;
            text-align: center;
            margin-top: -6px;
          }

          @media only screen and (min-width: 768px) {
            .language-name {
              font-size: 14px;
            }
          }
        `}
      </style>
      <div
        className="language-icon"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="language-name">{label}</div>
    </div>
  );
}
