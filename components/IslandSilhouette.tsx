export function IslandSilhouette() {
  return (
    <svg
      className="island-svg"
      viewBox="0 0 220 640"
      role="img"
      aria-labelledby="islandTitle islandDesc"
    >
      <title id="islandTitle">Silueta de Isla Mujeres</title>
      <desc id="islandDesc">
        Lectura de norte a sur: Playa Norte, el centro, la bahía al oeste y
        Punta Sur.
      </desc>
      <defs>
        <linearGradient id="isleFill" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#b7f3ee" />
          <stop offset="38%" stopColor="#1aa3a8" />
          <stop offset="100%" stopColor="#0b3144" />
        </linearGradient>
      </defs>
      <path
        fill="url(#isleFill)"
        d="M118 26c28 4 46 28 48 62 2 36-8 68-16 98-6 24-2 44 8 68 12 28 8 54-6 84-12 26-20 58-26 96-5 32-12 66-22 96-8 24-20 42-36 50-12 6-20-2-18-16 4-28 14-58 12-92-2-36-12-64-20-94-10-36-16-62-12-96 4-38 18-70 28-104 10-34 16-62 8-92-6-22 2-48 22-58 8-4 16-6 24-6z"
      />
      <circle cx="126" cy="78" r="3.2" fill="#f4efe6" />
      <circle cx="118" cy="168" r="3.2" fill="#f4efe6" />
      <circle cx="104" cy="430" r="3.2" fill="#e7d5ba" />
      <circle cx="96" cy="548" r="3.2" fill="#e7d5ba" />
    </svg>
  );
}
