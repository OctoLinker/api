import React from "react";
import App, { Container } from "next/app";
import Header from "../components/header.js";
import Footer from "../components/footer.js";
import LayoutContainer from "../components/container.js";
import Mascot from "../components/mascot.js";

class Layout extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div className="layout">
        <Header />
        {children}
        <LayoutContainer>
          <Mascot src="static/mascot-tentacle.png" width="158" />
          <Footer />
        </LayoutContainer>
      </div>
    );
  }
}

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Container>
    );
  }
}
