import { REACT_APP_API_URL, api } from "./config";
const AUTH_APP_API_URL = `${REACT_APP_API_URL}/user`

const login = async (username, password) => {
  try {
    const res = await api.post(`${AUTH_APP_API_URL}/login`, {
      username: username,
      password: password
    });

    return res; // Return response data if login is successful
  } catch (error) {
    // Handle errors, such as incorrect credentials, etc.
    console.error("Login failed:", error);
    throw error; // Re-throw the error to handle it in the calling code
  }
};

const createAccount = async (username, password,fullName) => {
  const res = await api.post(`${AUTH_APP_API_URL}/register`, {
    username: username,
    password: password,
    fullName:fullName
  });
  return res; // Return response data if account creation is successful


};

const logout = async (username) => {
  try {
    localStorage.setItem('username', null);

    const res = await api.post(`${AUTH_APP_API_URL}/logout`, {
      username: username,
    });
    return res; // Return response data if account creation is successful


  }
  catch (error) {
    // Handle errors, such as username already exists, etc.
    console.error("Logout failed:");
    throw error; // Re-throw the error to handle it in the calling code
  }
};

export { login, createAccount, logout };
