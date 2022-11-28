import React from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
AOS.init({
  duration: 2000,
});

function LandingScreen() {
  return (
    <div className="row landing text-center justify-content-center">
      <div className="col-md-9 my-auto">
        <h2 data-aos="zoom-in" style={{ color: "white", fontSize: "118px" }}>
          MVD Hotels
        </h2>
        <h1 data-aos="zoom-out" style={{ color: "white" }}>
          "Where Affordability Meets Luxury.
        </h1>
        <Link to="/home">
          <button className="btn btn-primary landingbtn"> Get Started</button>
        </Link>
      </div>
    </div>
  );
}

export default LandingScreen;
