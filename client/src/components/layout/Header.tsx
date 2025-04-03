import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import AuthModal from "../auth/AuthModal";
import Button from "../ui/Button";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Calculations Threads</h1>

      <div className="flex items-center gap-4">
        {user && user?.username ? (
          <>
            <span className="text-sm">Hello, {user.username}</span>
            <Button onClick={logout} variant="secondary" className="text-sm">
              Logout
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsModalOpen(true)} className="text-sm">
            Login / Register
          </Button>
        )}
      </div>

      {isModalOpen && <AuthModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
}
