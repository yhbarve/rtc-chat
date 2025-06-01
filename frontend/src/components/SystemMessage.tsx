export default function SystemMessage({
  msg,
}: {
  msg: string;
  index: number;
}) {
  return (
    <div className="text-center my-2">
      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
        {msg}
      </span>
    </div>
  );
}
