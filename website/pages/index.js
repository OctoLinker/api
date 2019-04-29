import Container from "../components/container";
import Hero from "../components/hero";
import Install from "../components/install";
import Backers from "../components/backers";
import Sponsors from "../components/sponsors";
import Tweets from "../components/tweets";
import Languages from "../components/languages";
import Features from "../components/features";
import HowItWorks from "../components/howItWorks";
import Screenshot from "../components/screenshot";
import Mascot from "../components/mascot";
import InstallButton from "../components/installButton";

function Home() {
  return (
    <>
      <Container>
        <Hero />
      </Container>
      <Container>
        <Screenshot />
      </Container>
      <Container colored={true}>
        <h1 id="how-it-works">How it works</h1>
        <HowItWorks />
      </Container>
      <Container>
        <Mascot src="static/mascot-down.png" width="205" />
        <h1 id="features">Features</h1>
        <Features />
      </Container>
      <Container colored={true}>
        <h1 id="languages">Supported languages</h1>
        <Languages />
      </Container>
      <Container>
        <Mascot src="static/mascot-baby.png" width="123" />
        <h1>What people are saying</h1>
        <Tweets />
      </Container>
      <Container colored={true} center={true}>
        <h1>Backers</h1>
        <Backers />
      </Container>
      <Container>
        <h1 id="sponsors">Sponsors</h1>
        <Sponsors />
      </Container>
      <Container colored={true} center={true}>
        <h1>Install OctoLinker</h1>
        <Install />
      </Container>
    </>
  );
}

export default Home;
