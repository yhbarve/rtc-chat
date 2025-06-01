export default function OtherMessageBubble({
  user,
  msg,
}: {
  user: string;
  msg: string;
  index: number;
}) {
  return (
    <div className="flex justify-start pl-4">
      <div className="bg-gray-200 text-black rounded-xl rounded-bl-none px-4 py-2 max-w-xs sm:max-w-md shadow-md">
        <div className="text-xs text-gray-600 font-semibold mb-1">
          {user}
        </div>
        <div className="text-sm font-medium break-words">{msg}</div>
      </div>
    </div>
  );
}
