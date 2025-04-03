import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      const result = await login(username, password);
      if (result.success) {
        toast.success(`Successfully ${isLogin ? "logged in" : "registered"}!`);
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isLogin ? "Login" : "Register"}
          </h2>
          <Button onClick={onClose} aria-label="Close modal">
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <Button
            type="submit"
            className="w-full"
            disabled={submitting || !username || !password}
          >
            {isLogin
              ? submitting
                ? "Logging in"
                : "Login"
              : submitting
              ? "Registering"
              : "Register"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            onClick={() => setIsLogin(!isLogin)}
            variant="secondary"
            className="text-sm"
          >
            Switch to {isLogin ? "Register" : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
