export default function Maskot({src, width}) {
  return (
    <>
      <style jsx>
        {`
          .mascot {
            text-align: center;
            margin-top: 2rem;
          }
        `}
      </style>
      <div className="mascot">
        <img src={src} width={width} />
      </div>
    </>
  );
}
