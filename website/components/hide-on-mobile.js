export default function HideOnMobile(props) {
  return (
    <div className="hide-on-mobile">
      {" "}
      <style jsx>
        {`
          @media only screen and (max-width: 768px) {
            .hide-on-mobile {
              display: none;
            }
          }
        `}
      </style>
      {props.children}
    </div>
  );
}
