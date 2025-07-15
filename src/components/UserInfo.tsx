// src/components/UserInfo.tsx
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-4 flex items-center justify-between bg-gray-100">
      <div className="flex items-center gap-4">
        <img src={user.photoURL} alt="avatar" className="w-10 h-10 rounded-full" />
        <span className="font-semibold text-lg">{user.displayName}</span>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
