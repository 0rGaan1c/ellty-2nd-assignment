export default function UserAvatar({ username }: { username: string }) {
  const initials = username.slice(0, 2).toUpperCase();

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-teal-500"
  ];

  const colorIndex =
    username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;

  const bgColor = colors[colorIndex];

  return (
    <div
      className={`inline-flex items-center justify-center w-8 h-8 mr-2 ${bgColor} rounded-full text-white font-medium text-sm`}
    >
      {initials}
    </div>
  );
}
