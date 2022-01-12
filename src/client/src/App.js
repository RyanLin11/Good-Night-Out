import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React, { Component } from "react";
import "./App.css";
import api from "./api-calls/user-calls.js";

function App() {
  const navigate = useNavigate();
  const [login, toggleLogin] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();

    //authenticate this user to see if we should log them in
    const user = api
      .login({
        username: e.target.elements.username.value,
        password: e.target.elements.password.value
      })
      .catch((e) => {
        return console.log(e);
      });
    this.setState({ currentUser: user });
    navigate("/home");
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    alert("signing in");

    api.signup({
      firstname: e.target.elements.firstname.value,
      lastname: e.target.elements.lastname.value,
      username: e.target.elements.username.value,
      email: e.target.elements.email.value,
      password: e.target.elements.password.value
    });

    navigate("/home");
  };

  return false ? (
    <div class="container">
      <div class="centered-form">
        <div class="centered-form__box">
          <h1>
            Welcome to
            <br />
            <span>Good Night Out</span>
          </h1>
          <form onSubmit={handleLogin}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              required
            ></input>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            ></input>
            <button>Login</button>
          </form>
          <button
            class="toggleform__button"
            onClick={() => toggleLogin(!login)}
          >
            Or if you don't have an account, <span>sign up</span>
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div class="container">
      <div class="centered-form">
        <div class="centered-form__box">
          <h1>
            Welcome to
            <br />
            <span>Good Night Out</span>
          </h1>
          <form onSubmit={handleSignUp}>
            <label>First Name</label>
            <input
              type="text"
              name="firstname"
              placeholder="Enter your first name"
              required
            ></input>
            <label>Last Name</label>
            <input
              type="text"
              name="lastname"
              placeholder="Enter your last name"
              required
            ></input>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              required
            ></input>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            ></input>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            ></input>
            <button>Sign Up</button>
          </form>
          <button
            class="toggleform__button"
            onClick={() => toggleLogin(!login)}
          >
            Or if you already have an account, <span>log in</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
