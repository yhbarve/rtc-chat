export default function MyMessageBubble({
  msg,
}: {
  msg: string;
  index: number;
}) {
  return (
    <div className="flex justify-end pr-4">
      <div className="bg-green-500 text-white rounded-xl rounded-br-none px-4 py-2 max-w-xs sm:max-w-md shadow-md">
        <div className="text-xs text-white/80 font-semibold mb-1 text-right">
          Me
        </div>
        <div className="text-sm font-medium break-words">{msg}</div>
      </div>
    </div>
  );
}
