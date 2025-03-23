import React from 'react';
import "./AboutUs.css";
import img1 from '../assets/teesha.jpg';
import img2 from '../assets/tushar.jpg';
import img3 from '../assets/ritaja.jpg';

const Aboutus = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About Us</h1>
        <p>
          Welcome to <strong>ResearchNow</strong>, an innovative educational platform connecting students and faculty
          with valuable research and learning opportunities. Our mission is to bridge the gap between aspiring
          researchers and real-world projects, fostering growth and collaboration.
        </p>
        <p>
          Join us to explore, learn, and contribute to cutting-edge developments in various fields.
          Your journey to knowledge starts here!
        </p>
      </div>

      {/* Team Section */}
      <div className="about-images">
        <div className="team-member">
          <img src={img1} alt="Team Member 1" className="about-img" />
          <h3>Teesha Debnath</h3>
          <p>22051040@kiit.ac.in</p>
        </div>

        <div className="team-member">
          <img src={img2} alt="Team Member 2" className="about-img" />
          <h3>Tushar Bhattacharya</h3>
          <p>22051210@kiit.ac.in</p>
        </div>

        <div className="team-member">
          <img src={img3} alt="Team Member 3" className="about-img" />
          <h3>Ritaja Tarafder</h3>
          <p>22051004@kiit.ac.in</p>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
