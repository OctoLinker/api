import Button from "./button";
import bowser from "bowser";

export default function Install({ children, compact }) {
  const supported = {
    chrome: {
      text: "Install for Google Chrome",
      url:
        "https://chrome.google.com/webstore/detail/octo-linker/jlmafbaeoofdegohdhinkhilhclaklkp"
    },
    firefox: {
      text: "Install for Mozilla Firefox",
      url: "https://addons.mozilla.org/en-US/firefox/addon/octolinker/"
    },
    opera: {
      text: "Install for Opera",
      url: "https://addons.opera.com/en/extensions/details/octolinker/"
    }
  };
  const details = supported[bowser.name.toLowerCase()] || supported.chrome;
  const buttonUrl = details.url;
  const buttonLabel = compact ? "Install" : details.text;

  return (
    <Button compact={compact} href={buttonUrl}>
      {buttonLabel}
    </Button>
  );
}
