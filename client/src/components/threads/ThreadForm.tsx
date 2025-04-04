import { useState } from "react";
import { toast } from "react-hot-toast";
import { createThread } from "../../api/threads";
import useAuth from "../../hooks/useAuth";
import { Thread } from "../../types";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface ThreadFormProps {
  onNewThread: (thread: Thread) => void;
}

export default function ThreadForm({ onNewThread }: ThreadFormProps) {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to post a thread");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createThread(Number(value));
      if (result.success && result.data) {
        setValue("");
        if (result.data) onNewThread(result.data);
        toast.success("Thread created successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create thread");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter starting number"
          step="any"
          className="flex-grow"
        />
        <Button type="submit" disabled={submitting || !value}>
          {submitting ? "Posting..." : "Post"}
        </Button>
      </form>
    </div>
  );
}
