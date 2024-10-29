import { ICreateMultipleExtrusions } from "@/models/map/population";

function createSquare(center: [number, number], sizeInMeters: number) {
  const earthRadius = 6378137; // Earth's radius in meters
  const lat = center[1];
  const lon = center[0];

  // Convert size from meters to degrees
  const sizeInDegrees = (sizeInMeters / earthRadius) * (180 / Math.PI);

  const halfSize = sizeInDegrees / 2;

  return {
    type: "Polygon",
    coordinates: [
      [
        [lon - halfSize, lat - halfSize],
        [lon + halfSize, lat - halfSize],
        [lon + halfSize, lat + halfSize],
        [lon - halfSize, lat + halfSize],
        [lon - halfSize, lat - halfSize], // Close the polygon
      ],
    ],
  };
}
export function createMultipleExtrusions(params: ICreateMultipleExtrusions) {
  const {
    cellSize,
    center,
    gap,
    maxHeight,
    dif,
    maxPopulation,
    minPopulation,
    name,
    newMax,
    newMin,
    totalPopulation,
  } = params;
  const resultFeatures = [];
  let remainingPopulation = totalPopulation;

  // Центральний стовпчик
  const centralHeight = Math.min(remainingPopulation, maxHeight);
  const normalizedPopulation =
    ((totalPopulation - minPopulation) / (maxPopulation - minPopulation)) *
      (newMax - newMin) +
    newMin;
  remainingPopulation -= centralHeight;

  resultFeatures.push({
    type: "Feature",
    geometry: createSquare(center, cellSize),
    properties: {
      height: centralHeight,
      normalizedPopulation,
      population: totalPopulation,
      textOffsetY: -(normalizedPopulation / 1000),
      isTopRank: true,
      name,
    },
  });

  // Корекція координат
  const latCorrectionFactor = 180 / Math.PI / 6378137; // Зміна широти в градусах для одного метра
  const lonCorrectionFactor =
    180 / Math.PI / (6378137 * Math.cos(center[1] * (Math.PI / 180))); // Зміна довготи

  let currentMaxHeight = maxHeight - dif; // Початковий рівень висоти для наступних квадратів
  let radius = 1;

  // Продовжуємо поки є залишкове населення
  while (remainingPopulation > 0 && currentMaxHeight > 0) {
    for (let x = -radius; x <= radius; x++) {
      for (let y = -radius; y <= radius; y++) {
        // Пропускаємо клітинки, що не знаходяться на зовнішньому краю поточного кільця
        if (Math.abs(x) !== radius && Math.abs(y) !== radius) continue;

        if (remainingPopulation <= 0) break;

        const height = Math.min(remainingPopulation, currentMaxHeight);
        remainingPopulation -= height;

        const normalizedPopulation =
          ((remainingPopulation - minPopulation) /
            (maxPopulation - minPopulation)) *
            (newMax - newMin) +
          newMin;

        // Застосовуємо відступ (gap) до кожного нового квадрата
        const newCenter: [number, number] = [
          center[0] + x * (cellSize + gap) * lonCorrectionFactor, // Зміщення по довготі з відступом
          center[1] + y * (cellSize + gap) * latCorrectionFactor, // Зміщення по широті з відступом
        ];

        resultFeatures.push({
          type: "Feature",
          geometry: createSquare(newCenter, cellSize),
          properties: {
            height: height,
            normalizedPopulation,
            population: totalPopulation,
            textOffsetY: -(normalizedPopulation / 1000),
            name: `${name}_${radius}`,
          },
        });
      }
    }

    currentMaxHeight -= dif; // Зменшуємо висоту для наступного рівня
    radius++; // Збільшуємо радіус для наступного шару, щоб новий шар був зовні
  }
  return resultFeatures;
}
