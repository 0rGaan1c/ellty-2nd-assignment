import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getThreadReplies } from "../../api/threads";
import { Thread } from "../../types";
import { operationToSymbol } from "../../utils/operation";
import Button from "../ui/Button";
import UserAvatar from "../ui/UserAvatar";
import ReplyForm from "./ReplyForm";

export default function ThreadItem({ thread }: { thread: Thread }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReplies = useCallback(async () => {
    if (!showReplies) return;

    setLoading(true);
    const result = await getThreadReplies(thread.id);

    if (result.success) {
      setReplies(result.data || []);
    } else {
      toast.error("Failed to load replies");
    }
    setLoading(false);
  }, [showReplies, thread.id]);

  useEffect(() => {
    if (showReplies) {
      fetchReplies();
    }
  }, [showReplies, fetchReplies]);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  console.log(thread);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <div>
          <UserAvatar username={thread.user.username} />
          <span className="font-medium text-gray-700">
            {thread.user.username}
          </span>
          <span className="text-gray-500 text-sm ml-2">
            •{" "}
            {formatDistanceToNow(new Date(thread.createdAt), {
              addSuffix: true
            })}
          </span>
        </div>
        <div className="flex justify-end">
          {thread.parentId && thread.operation && (
            <div className="text-2xl">
              <span className="text-gray-500">
                {operationToSymbol[thread.operation]} {thread.rightOperand} =
              </span>
            </div>
          )}
          <span className="font-bold text-2xl pl-2">
            {Math.round(thread.value * 100) / 100}
          </span>
        </div>
      </div>

      <div className="mt-2">
        {thread._count.replies > 0 ? (
          <Button
            onClick={toggleReplies}
            variant="secondary"
            className="text-sm"
          >
            {showReplies
              ? "Hide Replies"
              : `Show Replies (${thread._count.replies})`}
          </Button>
        ) : (
          <Button
            onClick={toggleReplies}
            variant="secondary"
            className="text-sm"
          >
            {showReplies ? "Cancel Reply" : "Reply"}
          </Button>
        )}
      </div>

      {showReplies && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200">
          <ReplyForm threadId={thread.id} onReplyAdded={fetchReplies} />

          {loading ? (
            <p className="text-gray-500 text-center my-3">Loading replies...</p>
          ) : replies.length > 0 ? (
            <div className="space-y-3 mt-4">
              {replies.map((reply) => (
                <ThreadItem key={reply.id} thread={reply} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center my-3">
              No replies yet. Be the first to reply!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
