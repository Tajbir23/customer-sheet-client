import React from "react"
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Customers from "../pages/customers/Customers";
import Layout from "../Layout";
import AuthCheck from "./AuthCheck";
import Login from "../pages/login/Login";
import Teams from "../pages/teams/Teams";
import GptAccounts from "../pages/gptAccounts/gptAccounts";
import DropboxPolicy from "../pages/dropboxPolicy/page";
import Asocks from "../pages/asocks/Asocks";
import MemberChecklist from "../pages/memberCheckList/MemberChecklist";

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
            },
            {
                path: "/chatgpt-accounts",
                element: <GptAccounts />
            },
            {
                path:"/asocks",
                element: <Asocks />
            },
            {
                path: "/member-check-list",
                element: <MemberChecklist />
            }
        ],
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/dropbox-policy",
        element: <DropboxPolicy />
    }
])

export default Routes