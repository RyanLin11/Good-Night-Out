import React from "react";
import NavBar from "../components/navbar/NavBar";
import "./css/Home.css";

function Home() {
  return (
    <>
      <NavBar />
      <div class="home-container">
        <div class="header">
          <h1>
            Welcome to <span>Good Night Out</span>
          </h1>
        </div>
        <div class="info-block" style={{ backgroundColor: "white" }}>
          <h3>
            What is <span>Good Night Out</span>?
          </h3>
          <div className="text">
            <div>
              A social web app dedicated to helping university students
              <ul>
                <li>
                  <span>Schedule</span> and <span>plan</span> study sessions and
                  social gatherings with their friends.
                </li>
                <br />
                <li>
                  <span>Join</span> other public events to get involved in the
                  school community
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="info-block" style={{ backgroundColor: "rgb(221, 221, 221)" }}>
          <h3>
            This is our project for <span>Project Program</span>
          </h3>
          <div className="text">
            <div>
              Enjoy!
              <ul>
                <li>
                  Use the <span>MyEvents</span> tab to see the events you've joined or created.
                </li>
                <br />
                <li>
                  Look at <span>Event List</span> to browse public events.
                </li>
                <br />
                <li>
                  Check <span>Profile</span> to view/edit your profile
                </li>
                <br />
                <li>
                  At the end, <span>logout</span>!
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
