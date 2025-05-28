import { useAuth } from "../context/AuthProvider";

function Dashboard() {
  const { token, doLogout } = useAuth();

  console.log(token);
  return (
    <div>
      Dashboard
      <br />
      <button
        className="btn btn-primary"
        onClick={() => {
          if (doLogout) {
            doLogout();
          }
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
