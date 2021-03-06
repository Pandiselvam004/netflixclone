import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import { AuthContextProvider } from "context/authContext/authContext";
import axios from 'axios';

axios.interceptors.request.use(async (conf) => {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  if (user) {
    conf.headers.token = `Bearer ${user.accessToken}`;
  }
  return conf;
});

ReactDOM.render(
  <AuthContextProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
          <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
          <Redirect from="/" to="/admin/index" />
        </Switch>
      </BrowserRouter>
  </AuthContextProvider>,
  document.getElementById("root")
);
