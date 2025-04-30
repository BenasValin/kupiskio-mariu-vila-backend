function importAll(glob: Record<string, { default: string }>) {
  return Object.values(glob).map((mod) => mod.default);
}

export const pagrindinisPastatasAntrasAukstasImages = importAll(
  import.meta.glob("./pagrindinisPastatasAntrasAukstas/*.{png,jpg,jpeg,svg}", {
    eager: true,
  })
);

export const pagrindinisPastatasPirmasAukstasImages = importAll(
  import.meta.glob("./pagrindinisPastatasPirmasAukstas/*.{png,jpg,jpeg,svg}", {
    eager: true,
  })
);

export const mariuAplinkaImages = importAll(
  import.meta.glob("./MariuAplinka/*.{png,jpg,jpeg,svg}", { eager: true })
);

export const vilosAplinkaImages = importAll(
  import.meta.glob("./VilosAplinka/*.{png,jpg,jpeg,svg}", { eager: true })
);

export const zvejuNamelisImages = importAll(
  import.meta.glob("./Zvejunamelis/*.{png,jpg,jpeg,svg}", { eager: true })
);

export const traktieriusDyvaiImages = importAll(
  import.meta.glob("./TraktieriusDyvai/*.{png,jpg,jpeg,svg}", { eager: true })
);

export const pirtiesPastatasPirmasAukstasImages = importAll(
  import.meta.glob("./pirtiesPastatasPirmasAukstas/*.{png,jpg,jpeg,svg}", {
    eager: true,
  })
);

export const pirtiesPastatasAntrasAukstasImages = importAll(
  import.meta.glob("./PirtiesPastatasAntrasAukstas/*.{png,jpg,jpeg,svg}", {
    eager: true,
  })
);

export const kupiskioPliazasImages = importAll(
  import.meta.glob("./kupiskioPliazas/*.{png,jpg,jpeg,svg}", { eager: true })
);

export const kempingasImages = importAll(
  import.meta.glob("./kempingas/*.{png,jpg,jpeg,svg}", { eager: true })
);

export const dendrologinisParkasImages = importAll(
  import.meta.glob("./dendrologinisParkas/*.{png,jpg,jpeg,svg}", {
    eager: true,
  })
);

export const baznyciaImages = importAll(
  import.meta.glob("./baznycia/*.{png,jpg,jpeg,svg}", { eager: true })
);

export const etnografijosMuziejusImages = importAll(
  import.meta.glob("./etnografijosMuziejus/*.{png,jpg,jpeg,svg}", {
    eager: true,
  })
);

export const poilsioNamelisImages = importAll(
  import.meta.glob("./poilsioNamelis/*.{png,jpg,jpeg,svg}", { eager: true })
);

// ✅ Combine different floors into one building
export const pirtiesPastatasImages = [
  ...pirtiesPastatasPirmasAukstasImages,
  ...pirtiesPastatasAntrasAukstasImages,
];

export const pagrindinisPastatasImages = [
  ...pagrindinisPastatasAntrasAukstasImages,
  ...pagrindinisPastatasPirmasAukstasImages,
];
