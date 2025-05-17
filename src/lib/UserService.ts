/* eslint-disable @typescript-eslint/no-explicit-any */
import Keycloak from "keycloak-js";

const _kc = new Keycloak("/keycloak.json");

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */

const initKeycloak = (onAuthenticatedCallback: any) => {
  _kc
    .init({
      onLoad: "login-required",
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
      pkceMethod: "S256",
    })
    .then((authenticated) => {
      if (!authenticated) {
        console.log("user is not authenticated..!");
      }
      onAuthenticatedCallback();
    })
    .catch(console.error);
};

// const doLogin = _kc.login;
const doLogin = (redirectUri = "") =>
  _kc.login({ redirectUri: `${window.location.origin}/${redirectUri}` });

const doLogout = () => _kc.logout({ redirectUri: window.location.origin });

const getToken = () => _kc.token;

const getTokenParsed = () => _kc.tokenParsed;

const isLoggedIn = () => !!_kc.token;

const updateKcToken = () => _kc.updateToken(5);

const updateToken = (successCallback: any) =>
  _kc.updateToken(5).then(successCallback).catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;

const getName = () => _kc.tokenParsed?.name;

const hasRole = (roles: any[]) => roles.some((role) => _kc.hasRealmRole(role));

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getTokenParsed,
  updateToken,
  getUsername,
  hasRole,
  updateKcToken,
  getName,
};

export default UserService;
