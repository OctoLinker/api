export default function Backers() {
  return (
    <>
      <style jsx>{`
        .backers {
          margin: 20px 0 0 20px;
        }

        @media only screen and (min-width: 768px) {
          p {
            margin: 1rem auto;
            max-width: 600px;
          }
        }

        .backers a {
          display: inline-block;
          overflow: hidden;
          height: 74px;
          height: 74px;
          margin-left: -20px;
          padding: 3px;
          border: 2px solid #7d7c7c;
          border-radius: 50%;
          background: white;
          box-shadow: 0 3px 3px 0 rgba(40, 40, 40, 0.4);
        }

        .backers a:last-child {
          border-color: #fd4eff;
        }

        .backers img {
          border-radius: 50%;
        }

        .backers a:last-child:hover {
          transform: translate3d(0, 0, 0);
          animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          backface-visibility: hidden;
          perspective: 1000px;
        }

        @keyframes shake {
          10%,
          90% {
            transform: translate3d(0, -1px, 0);
          }

          20%,
          80% {
            transform: translate3d(0, 2px, 0);
          }

          30%,
          50%,
          70% {
            transform: translate3d(0, -4px, 0);
          }

          40%,
          60% {
            transform: translate3d(0, 4px, 0);
          }
        }

        .backers a:last-child img {
          border-radius: 50%;
        }
      `}</style>
      <p>
        The following users enjoy the productivity of using OctoLinker and
        ensures the project that they love stays healthy and actively maintained
        with monthly donation.
      </p>
      <div className="backers">
        <a
          href="https://opencollective.com/octolinker/backer/0/website"
          target="_blank"
        >
          <img
            src="https://opencollective.com/octolinker/backer/0/avatar.svg"
            width="64"
          />
        </a>
        <a
          href="https://opencollective.com/octolinker/backer/1/website"
          target="_blank"
        >
          <img
            src="https://opencollective.com/octolinker/backer/1/avatar.svg"
            width="64"
          />
        </a>
        <a href="https://opencollective.com/octolinker" target="_blank">
          <img src="static/backer.png" width="64" />
        </a>
      </div>
    </>
  );
}
