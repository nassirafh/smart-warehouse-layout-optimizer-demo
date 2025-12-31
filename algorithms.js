// src/utils/algorithms.js

// Distance euclidienne
export const calculateDistance = (p1, p2) => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

// Point de départ : en bas près de la zone "DISPATCH" du plan
const getStartPoint = () => ({ x: 360, y: 460 });

// Optimisation : rapprocher fortement les classes A du départ,
// puis les B, puis les C, en colonnes alignées.
export const optimizeLayout = (zones, strategy = 'balanced') => {
  if (!zones || zones.length === 0) return zones;

  const start = getStartPoint();

  // 1. trier par importance (A > B > C puis demande)
  const sorted = [...zones].sort((a, b) => {
    const rank = (z) =>
      z.abcClass === 'A' ? 1 : z.abcClass === 'B' ? 2 : 3;
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    return (b.demand ?? 0) - (a.demand ?? 0);
  });

  // 2. paramètres de placement (colonnes par classe)
  const laneWidth = 80;
  const rowHeight = 60;

  // colonnes selon la classe (A collé au start, puis B, puis C)
  const colOffsetA = 0;
  const colOffsetB = laneWidth * 1;
  const colOffsetC = laneWidth * 2;

  // facteur de compactage selon la stratégie
  // distance : plus compact, time : compromis, cost : un peu plus étalé
  let compactY = 1;
  if (strategy === 'distance') compactY = 0.7;
  else if (strategy === 'time') compactY = 0.8;
  else if (strategy === 'cost') compactY = 0.9;
  else compactY = 0.8;

  // limites carte (700 x 520)
  const minX = 40;
  const maxX = 660;
  const minY = 40;
  const maxY = 500;

  const positions = {
    A: [],
    B: [],
    C: [],
  };

  // 3. calcul d'une grille cible par classe
  ['A', 'B', 'C'].forEach((cls) => {
    const zonesOfClass = sorted.filter((z) => z.abcClass === cls);
    zonesOfClass.forEach((z, idx) => {
      const colOffset =
        cls === 'A' ? colOffsetA : cls === 'B' ? colOffsetB : colOffsetC;
      const col = Math.floor(idx / 5); // 5 lignes par colonne
      const row = idx % 5;

      const targetX = start.x + colOffset + col * laneWidth;
      const targetY =
        start.y -
        (row + 1) * rowHeight * compactY; // on remonte vers le haut du dépôt

      const clampedX = Math.min(Math.max(targetX, minX), maxX);
      const clampedY = Math.min(Math.max(targetY, minY), maxY);

      positions[cls].push({ id: z.id, name: z.name, x: clampedX, y: clampedY });
    });
  });

  // 4. appliquer une translation forte vers la position cible (effet visible)
  const k = 0.85; // 0.85 → rapproche fort de la cible

  const optimized = sorted.map((z) => {
    const cls = z.abcClass || 'C';
    const list = positions[cls] || [];
    const target =
      list.find((p) => p.id === z.id || p.name === z.name) || {
        x: z.x,
        y: z.y,
      };

    return {
      ...z,
      x: z.x + (target.x - z.x) * k,
      y: z.y + (target.y - z.y) * k,
    };
  });

  return optimized;
};
