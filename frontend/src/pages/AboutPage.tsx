export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        About This App
      </h1>

      <p className="mb-6 text-lg leading-relaxed">
        This is a real-time group chat application built using modern web technologies.
        It allows users to join or create unique chat rooms, send and receive live messages,
        and view who's currently active — all in a fast, interactive experience powered by WebSockets.
      </p>

      <ul className="list-disc list-inside mb-6 text-md space-y-2">
        <li>Real-time messaging with WebSockets (Socket.IO)</li>
        <li>Room-based architecture for collaborative chat</li>
        <li>Responsive UI built with React and Tailwind CSS</li>
        <li>Session memory using <code>sessionStorage</code></li>
      </ul>

      <p className="text-md">
        This project was developed by{" "}
        <a
          href="https://yashbarve.vercel.app"
          className="text-blue-600 hover:underline font-semibold"
          target="_blank"
          rel="noopener noreferrer"
        >
          Yash Barve
        </a>
        . Explore more of my work or get in touch!
      </p>
    </div>
  );
}
