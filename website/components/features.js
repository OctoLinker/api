import Code from "./code";

export default function Features() {
  return (
    <>
      <style jsx>{`
        @media only screen and (min-width: 768px) {
          .feature-boxes {
            display: grid;
            grid-template-columns: auto auto;
            grid-gap: 30px;
          }
        }
      `}</style>
      <div className="feature-boxes">
        <div>
          <h3>Relative files</h3>
          <p>
            Navigate through GitHub repositories faster than ever before with a
            single click. OctoLinker leverages the GitHub API to fetch a tree
            structure of the repository to link relative files.
          </p>
        </div>
        <div>
          <h3>Dependency Discovery</h3>
          <p>
            Never leave GitHub to manually search what a certain dependency is
            supposed to be doing. OctoLinker links dependencies defined in files
            such as <Code>package.json</Code>, <Code>composer.json</Code>,
            <Code>Gemfile</Code> or <Code>requirements.txt</Code> with their
            related GitHub project page.
          </p>
        </div>
        <div>
          <h3>API Docs</h3>
          <p>
            Don't remember the signature of core library method? No worries,
            OctoLinker keeps you covered by linking to API docs sucha as{" "}
            <a href="https://nodejs.org/docs">nodejs.org/en/docs</a>{" "}
            <a href="https://docs.python.org">docs.python.org</a>{" "}
            <a href="https://docs.oracle.com">docs.oracle.com</a> or{" "}
            <a href="https://rubygems.org">rubygems.org</a>.
          </p>
        </div>
        <div>
          <h3>Pull Request</h3>
          <p>
            Code review made easy. OctoLinker links dependencies and files on a
            Pull Request so you can focus on the work that matters – code
            review.
          </p>
        </div>
        <div>
          <h3>Issue & Comments</h3>
          <p>
            If OctoLinker is able to infer a file type from code snippet in a
            Markdown file, Issue or Pull Request comment, it will insert links
            here as well.
          </p>
        </div>
        <div>
          <h3>Private repositories</h3>
          <p>
            In order to support all mentioned features on a private repository,
            OctoLinker needs a GitHub access token. OctoLinker will prompt a
            notification in such a scenario. No worries, your GitHub token will
            be never send to a server! Your token stays in your browser.
          </p>
        </div>
      </div>
    </>
  );
}
