import { useEffect, useState } from "react";
import { getThreads } from "../../api/threads";
import { Thread } from "../../types";
import ThreadForm from "./ThreadForm";
import ThreadItem from "./ThreadItem";

export default function ThreadList() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThreads = async () => {
    const result = await getThreads();
    if (result.success && result.data) setThreads(result.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const handleNewThread = (newThread: Thread) => {
    setThreads((prev) => [newThread, ...prev]);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Calculations Threads</h2>
      <ThreadForm onNewThread={handleNewThread} />
      <div className="mt-6 space-y-4">
        {threads.length > 0 ? (
          threads.map((thread) => (
            <ThreadItem key={thread.id} thread={thread} />
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No threads yet. Start a new one!
          </p>
        )}
      </div>
    </div>
  );
}
