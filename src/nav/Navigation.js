import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import "./Navigation.css";

function Navigation({ logout }) {
    const { currentUser } = useContext(UserContext);
    console.debug("Navigation", "currentUser=", currentUser);

    function loggedInNav() {
        return (
            <ul>
            <li>
                <NavLink to="/companies">
                    Companies
                </NavLink>
            </li>
            <li>
                <NavLink to="/jobs">
                    Jobs
                </NavLink>
            </li>
            <li>
                <NavLink to="/profile">
                    Profile
                </NavLink>
            </li>
            <li>
                <Link to="/" onClick={logout}>
                    Log out {currentUser.first_name || currentUser.username}
                </Link>
            </li>
        </ul>
        );
    }

    function loggedOutNav() {
        return (
            <ul>
                <li>
                    <NavLink to="/login">Login</NavLink>
                </li>
                <li>
                    <NavLink to="/signup">Signup</NavLink>
                </li>
            </ul>
        );
    }

    return (
        <nav>
            <Link to="/">
            Jobly
            </Link>
            {currentUser ? loggedInNav() : loggedOutNav()}
        </nav>
    );
}

export default Navigation;
