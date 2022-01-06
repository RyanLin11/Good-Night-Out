const getUserInfo = async (username) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  };
  const response = await fetch("/api/users/" + username, requestOptions);
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


export default {
  getUserInfo,
  updateUser
}