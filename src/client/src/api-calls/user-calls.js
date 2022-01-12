const getUserInfo = async (username) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  };
  const response = await fetch("/api/users/" + username + "/", requestOptions);
  const body = await response.json();
  return body
};

const updateUser = async (username, updates) => {
  console.log("updating user")
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  };
  const response = await fetch("/api/users/" + username, requestOptions)
  const body = await response.json()
  
  return body
}

const login = async (user) => {
  //Will be replaced with real auth
  // const requestOptions = {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(user),
  // };

  // const response = await fetch("api/users/login/", requestOptions)
  // const body = await response.json()
  // console.log(body)
  // localStorage.setItem("currentUser", body.username)
  // return body;
}

const signup = async (user) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };
  const response = await fetch("api/users/", requestOptions)
  const body = response.json()
  localStorage.setItem("currentUser", user.username)
  return body;
}

export default {
  getUserInfo,
  updateUser,
  login,
  signup
}