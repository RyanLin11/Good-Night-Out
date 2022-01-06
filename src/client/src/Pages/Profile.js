import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import "./css/Profile.css";
import api from "./api-calls/user-calls.js";

import { FaPen } from "react-icons/fa";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {faPencil} from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const navigate = useNavigate();
  const [editMode, toggleEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    api
      .getUserInfo(localStorage.getItem("currentUser"))
      .then((result) => {
        console.log(result);
        return setCurrentUser(result);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      const updates = [];

      //Filling in updates
      if (e.target.elements.username.value) {
        updates.push({
          field: "username",
          value: e.target.elements.username.value,
        });
      }
      if (e.target.elements.email.value) {
        updates.push({ field: "email", value: e.target.elements.email.value });
      }
      if (e.target.elements.password.value) {
        updates.push({
          field: "password",
          value: e.target.elements.password.value,
        });
      }
      alert(updates)
      console.log(updates);

      let updatedUser = null;

      api
        .updateUser(updates)
        .then((res) => {
          console.log(res);
          updatedUser = res;
        });

      console.log(updatedUser)

      if (updatedUser === {} || updatedUser === null) {
        alert("Updates were not able to be saved.");
      } else {
        setCurrentUser(updatedUser);
        localStorage.setItem("currentUser", updatedUser.username);
        alert("Saved Changes!");
      }
    }
    toggleEditMode(!editMode);
    navigate("/profile");
  };


  return (
    <>
      <NavBar />
      <div class="container">
        <div className="container__box">
          <h1>
            Hello, <span>{currentUser.username}</span>
          </h1>
          <form class="edit-profile-form" onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder={currentUser.username}
              disabled={editMode ? "" : "disabled"}
            ></input>
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder={currentUser.email}
              disabled={editMode ? "" : "disabled"}
            ></input>
            <label>Password</label>
            <input
              type="text"
              name="password"
              placeholder={currentUser.password}
              disabled={editMode ? "" : "disabled"}
            ></input>
            {editMode ? (
              <button>Save Changes</button>
            ) : (
              <button>
                <FaPen />
                <span>Edit Profile</span>
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;
