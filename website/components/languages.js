import LanguageBox from "./LanguageBox";

export default function Languages() {
  return (
    <>
      <style jsx>{`
        .language-boxes {
          display: grid;
          grid-template-columns: repeat(3, auto);
          grid-gap: 15px;
          justify-content: center;
        }

        @media only screen and (min-width: 768px) {
          .language-boxes {
            grid-template-columns: repeat(5, auto);
          }
        }
      `}</style>
      <div className="language-boxes">
        <LanguageBox image="static/bower.png" label="bower" />
        <LanguageBox image="static/composer.png" label="composer" />
        <LanguageBox image="static/css.png" label="css" />
        <LanguageBox image="static/docker.png" label="docker" />
        <LanguageBox image="static/go.png" label="go" />
        <LanguageBox image="static/haskell.png" label="Haskell" />
        <LanguageBox image="static/homebrew.png" label="Homebrew" />
        <LanguageBox image="static/html.png" label="HTML" />
        <LanguageBox image="static/java.png" label="Java" />
        <LanguageBox image="static/javascript.png" label="JavaScript" />
        <LanguageBox image="static/less.png" label="less" />
        <LanguageBox image="static/nodejs.png" label="nodejs" />
        <LanguageBox image="static/npm.png" label="npm" />
        <LanguageBox image="static/python.png" label="python" />
        <LanguageBox image="static/ruby.png" label="Ruby" />
        <LanguageBox image="static/rubygems.png" label="RubyGems" />
        <LanguageBox image="static/rust.png" label="Rust" />
        <LanguageBox image="static/sass.png" label="Sass" />
        <LanguageBox image="static/typescript.png" label="TypeScript" />
        <LanguageBox image="static/vim.png" label="Vim" />
      </div>
    </>
  );
}
