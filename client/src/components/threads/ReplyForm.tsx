import { useState } from "react";
import { toast } from "react-hot-toast";
import { createReply } from "../../api/threads";
import useAuth from "../../hooks/useAuth";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ReplyForm({
  threadId,
  onReplyAdded
}: {
  threadId: number;
  onReplyAdded?: () => void;
}) {
  const [operation, setOperation] = useState("ADD");
  const [rightOperand, setRightOperand] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to reply");
      return;
    }
    if (rightOperand === null) {
      toast.error("Please enter a value");
      return;
    }

    setSubmitting(true);

    try {
      const result = await createReply(threadId, operation, rightOperand);

      if (result.success) {
        toast.success("Reply posted successfully!");
        setRightOperand(null);

        if (onReplyAdded) {
          onReplyAdded();
        }
      } else if (operation === "DIVIDE" && rightOperand === 0) {
        toast.error(
          "You can't be serious, we can't divide a number by 0, can we?"
        );
      } else {
        toast.error("Failed to post reply");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 my-2">
      <select
        value={operation}
        onChange={(e) => setOperation(e.target.value)}
        className="p-2 border border-gray-300 rounded bg-white"
        disabled={submitting}
      >
        <option value="ADD">+</option>
        <option value="SUBTRACT">-</option>
        <option value="MULTIPLY">*</option>
        <option value="DIVIDE">/</option>
      </select>

      <Input
        type="number"
        value={rightOperand || ""}
        onChange={(e) => setRightOperand(Number(e.target.value))}
        className="flex-grow"
        disabled={submitting}
      />

      <Button
        onClick={handleSubmit}
        variant="success"
        disabled={submitting || !rightOperand}
      >
        {submitting ? "Posting..." : "Reply"}
      </Button>
    </div>
  );
}
