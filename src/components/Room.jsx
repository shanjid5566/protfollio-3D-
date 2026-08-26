import { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { fetchRoomContent } from "../api/client";
import Door from "./Door";

export default function Room({ room }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchRoomContent(room.id)
      .then((data) => alive && setContent(data))
      .catch(() => alive && setContent({ error: true }))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [room.id]);

  const [cx, , cz] = room.roomCenter;
  const accent = room.accentColor || "#3f4f8a";

  return (
    <group position={[cx, 0, cz]}>
      {/* Room walls */}
      <mesh position={[0, 2, -5]} receiveShadow>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color="#f0ead8" roughness={0.85} />
      </mesh>
      <mesh position={[-5, 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4, 10]} />
        <meshStandardMaterial color="#f0ead8" roughness={0.85} />
      </mesh>
      <mesh position={[5, 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4, 10]} />
        <meshStandardMaterial color="#f0ead8" roughness={0.85} />
      </mesh>

      {/* Exit Door */}
      <Door 
        id="exit" 
        position={[0, 0, 4.85]} 
        rotationY={Math.PI} 
        label="Exit" 
      />

      {/* Front wall (entrance side) — without this, looking back toward
          where the player enters shows nothing but empty space, since
          rooms live far away from the corridor with no other geometry
          nearby. Exiting is handled by the "Back to Corridor" button, so
          this wall doesn't need an actual doorway cut into it. */}
      <mesh position={[0, 2, 5]} receiveShadow>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color="#f0ead8" roughness={0.85} />
      </mesh>
      {/* Ceiling, so the room isn't open to the black void above */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[10, 0.2, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* Accent-colored rug — each room gets its own color so they don't
          all look like the same plain white box. Kept clear of the floor
          plane (y offset) to avoid z-fighting. */}
      <mesh
        position={[0, 0.011, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial color={accent} roughness={0.9} />
      </mesh>

      {/* Accent-colored trim band along the back wall, protruding clearly
          past the wall face (not coplanar with it) to avoid z-fighting. */}
      <mesh position={[0, 2.6, -4.85]}>
        <boxGeometry args={[9.4, 0.3, 0.1]} />
        <meshStandardMaterial color={accent} roughness={0.6} />
      </mesh>
      {/* Gold baseboard, matching the corridor's, along the two side walls.
          Positioned flush against the wall's inner face, protruding into
          the room — same fix as the corridor trim (avoids both a floating
          gap and z-fighting). */}
      <mesh position={[-4.85, 0.18, 0]}>
        <boxGeometry args={[0.1, 0.36, 9.6]} />
        <meshStandardMaterial color="#b8923f" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[4.85, 0.18, 0]}>
        <boxGeometry args={[0.1, 0.36, 9.6]} />
        <meshStandardMaterial color="#b8923f" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Content panel — data fetched from the Express/PostgreSQL backend renders here */}
      <Html position={[0, 2, -4.8]} transform distanceFactor={4} occlude>
        <div
          style={{
            width: 420,
            padding: 20,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 10,
            fontFamily: "sans-serif",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            borderTop: `6px solid ${accent}`,
          }}
        >
          <h2 style={{ margin: "0 0 10px" }}>{room.label}</h2>
          {loading && <p>Loading...</p>}
          {!loading && content?.error && <p>Couldn't load this content.</p>}
          {!loading && content && !content.error && (
            <RoomContentBody
              roomId={room.id}
              content={content}
              accent={accent}
            />
          )}
        </div>
      </Html>
    </group>
  );
}

function RoomContentBody({ roomId, content, accent }) {
  if (roomId === "about") {
    return <p>{content.bio}</p>;
  }
  if (roomId === "projects") {
    return (
      <ul style={{ paddingLeft: 18 }}>
        {content.items?.map((p) => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            <strong>{p.title}</strong> — {p.description}
            {p.link && (
              <>
                {" "}
                <a href={p.link} target="_blank" rel="noreferrer">
                  link
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    );
  }
  if (roomId === "skills") {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {content.items?.map((s) => (
          <span
            key={s}
            style={{
              padding: "4px 10px",
              background: accent,
              color: "#fff",
              borderRadius: 20,
              fontSize: 13,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    );
  }
  return null;
}
