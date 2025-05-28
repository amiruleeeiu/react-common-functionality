// AuthProvider.tsx
import Keycloak from "keycloak-js";
import React, { createContext, useContext, useEffect, useState } from "react";
const keycloak = new Keycloak("/keycloak.json");

interface AuthContextType {
  isAuthenticated: boolean;
  userRoles: string[];
  token: string | undefined;
  isLoading: boolean;
  doLogin?: () => void;
  doLogout?: () => void;
}

const doLogin = () => {
  keycloak.login();
  window.location.pathname = "/dashboard";
};
const doLogout = () => {
  keycloak.logout();
};

const initialAuthState: AuthContextType = {
  isAuthenticated: false,
  userRoles: [],
  token: undefined,
  isLoading: true,
  doLogin,
  doLogout,
};

const AuthContext = createContext<AuthContextType>(initialAuthState);

let keycloakAlreadyInitialized = false;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthContextType>(initialAuthState);

  useEffect(() => {
    if (!keycloakAlreadyInitialized) {
      keycloakAlreadyInitialized = true;

      keycloak
        .init({
          onLoad: "check-sso", // Don't force redirect unless manually triggered
          silentCheckSsoRedirectUri:
            window.location.origin + "/silent-check-sso.html",
        })
        .then((authenticated) => {
          console.log(authenticated);

          if (authenticated) {
            setAuthState((prevState) => ({
              ...prevState,
              isAuthenticated: true,
              userRoles: ["USER", "ADMIN"],
              token: keycloak.token,
              isLoading: false,
            }));

            // Optional: auto refresh token
            setInterval(() => {
              keycloak.updateToken(60).catch(() => keycloak.logout());
            }, 6000);
          } else {
            setAuthState((prevState) => ({
              ...prevState,
              isAuthenticated: false,
              userRoles: [],
              token: undefined,
              isLoading: false,
            }));
          }
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
