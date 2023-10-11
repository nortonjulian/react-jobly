import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import LocalStorage from "./hooks/LocalStorage";
import Navigation from "./nav/Navigation";
import Routes from "./nav/Routes";
import LoadingSpinner from "./common/LoadingSpinner";
import JoblyApi from "./api/api";
import UserContext from "./auth/UserContext";
import jwt from "jsonwebtoken";

export const TOKEN_STORAGE_ID = "jobly-token"

function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [applicantIds, setApplicantIds] = useState(new Set([]));
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = LocalStorage(TOKEN_STORAGE_ID);

  console.debug(
    "App",
    "infoLoaded=", infoLoaded,
    "currentUser=", currentUser,
    "token=", token
  );

  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          JoblyApi.token = token;
          let currentUser = await JoblyApi.getCurrentUser(username)
          setCurrentUser(currentUser);
          setApplicantIds(new Set(currentUser.application));
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }
    setInfoLoaded(false);
    getCurrentUser();
  }, [token])

  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  async function signup(signupData) {
    try {
      let token = await JoblyApi.signup(signupData)
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors)
      return { success: false, errors }
    }
  }

  async function login(loginData) {
    try {
      let token = await JoblyApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors)
      return { success: false, errors }
    }
  }

  function hasAppliedToJob(id) {
    return applicantIds.has(id);
  }

  function applyToJob(id) {
    if (hasAppliedToJob(id)) return;
    JoblyApi.applyToJob(currentUser.username, id);
    setApplicantIds(new Set([...applicantIds, id]))
  }

  if (!infoLoaded) return <LoadingSpinner />

  return (
    <BrowserRouter>
      <UserContext.Provider
          value={{ currentUser, setCurrentUser, hasAppliedToJob, applyToJob }}>
        <div>
          <Navigation logout={logout} />
          <Routes login={login} signup={signup} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
