export async function fetchRoomContent(roomId) {
  // Hardcoded frontend-only content
  const content = {
    about: {
      title: "About Me",
      body: "Hi! I'm a passionate developer specializing in building rich interactive 3D web experiences and modern applications.\n\nI love combining cutting-edge technologies like React Three Fiber, WebGL, and elegant UI design to create immersive digital spaces.\n\nWhen I'm not coding, you can usually find me exploring new graphics techniques or reading up on architectural design."
    },
    projects: {
      title: "My Projects",
      body: "1. 3D Portfolio Mansion\nA fully interactive, first-person 3D environment built with React Three Fiber, featuring custom lighting, collision detection, and dynamic UI panels.\n\n2. E-Commerce Dashboard\nA high-performance React dashboard with real-time analytics, dark mode support, and complex data visualizations.\n\n3. WebGL Physics Engine\nA lightweight 3D physics solver written in JavaScript to handle rigid body dynamics in the browser."
    },
    skills: {
      title: "Skills & Tech",
      body: "• Frontend: React, Next.js, Three.js, React Three Fiber, Zustand, TailwindCSS, Framer Motion\n\n• Backend: Node.js, Express, PostgreSQL, MongoDB, RESTful APIs\n\n• Tools: Git, Docker, Vite, Webpack, Figma\n\n• Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, Python"
    }
  };

  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 500));

  return content[roomId] || {
    title: "Unknown Room",
    body: "Content not found."
  };
}
