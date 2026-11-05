import React, { Component } from "react";
import Header from "../../components/header/Header";
import Greeting from "../../containers/greeting/Greeting";
import Footer from "../../components/footer/Footer";
import TopButton from "../../components/topButton/TopButton";
import "./HomeComponent.css";

class Home extends Component {
  render() {
    return (
      <div>
        <Header theme={this.props.theme} />
        <div className="container">
          <Greeting theme={this.props.theme} />
          <Footer theme={this.props.theme} />
          <TopButton theme={this.props.theme} />
        </div>
      </div>
    );
  }
}

export default Home;
