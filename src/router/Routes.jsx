import React from "react"
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Customers from "../pages/customers/Customers";
import Layout from "../Layout";
import AuthCheck from "./AuthCheck";
import Login from "../pages/login/Login";
import Teams from "../pages/teams/Teams";

const Routes = createBrowserRouter([
    {
        path: "/",
        element: <AuthCheck><Layout /></AuthCheck>,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/customers",
                element: <Customers />,
            },
            {
                path: "/teams",
                element: <Teams />
            }
        ],
    },
    {
        path: "/login",
        element: <Login />
    }
])

export default Routes