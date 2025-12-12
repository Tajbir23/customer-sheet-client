import React from "react";
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
import RemovedMembers from "../pages/removedMembers/removedMembers";
import QrCode from "../pages/qrCode/QrCode";
import Invoice from "../pages/invoice/Invoice";
import SearchInvoice from "../pages/invoice/SearchInvoice";
import FacebookTermsConditions from "../pages/facebookTermsConditions/FacebookTermsConditions";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthCheck>
        <Layout />
      </AuthCheck>
    ),
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
        element: <Teams />,
      },
      {
        path: "/chatgpt-accounts",
        element: <GptAccounts />,
      },
      {
        path: "/asocks",
        element: <Asocks />,
      },
      {
        path: "/member-check-list",
        element: <MemberChecklist />,
      },
      {
        path: "/removed-members",
        element: <RemovedMembers />,
      },
      {
        path: "/subscription-end-members",
        element: React.lazy(() =>
          import("../pages/subscriptionEndMembers/subscriptionEndMembers")
        ),
      },
      {
        path: "/qr-code",
        element: <QrCode />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dropbox-policy",
    element: <DropboxPolicy />,
  },
  {
    path: "/search-invoice",
    element: <SearchInvoice />,
  },
  {
    path: "/invoice/:id",
    element: <Invoice />,
  },
  {
    path: "/facebook-terms-conditions",
    element: <FacebookTermsConditions />,
  },
]);

export default Routes;
