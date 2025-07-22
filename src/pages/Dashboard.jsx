import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div>
      <h2>Dashboard</h2>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-blue-500 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
