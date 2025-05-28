import { useAuth } from "../context/AuthProvider";

// src/pages/Login.tsx
const Login = () => {
  const { doLogin } = useAuth();

  return (
    <div>
      🔐 Login Page
      <br />
      <button
        className="btn btn-primary"
        onClick={() => {
          if (doLogin) {
            doLogin();
          }
        }}
      >
        Login
      </button>
    </div>
  );
};
export default Login;
