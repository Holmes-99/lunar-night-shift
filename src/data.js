// Real numbers used in Level 1, with sources shown in the in-game "Data & sources" screen.
// Gameplay rounds some values so kids can follow them; the rounding is noted per value.

export const CREW_SIZE = 3;

export const REAL = {
  // NASA Life Support Baseline Values and Assumptions Document (BVAD), 2022
  oxygenKgPerDay: 0.84,
  waterLPerDay: 2.5, // 2.0 kg drinking + 0.5 kg for food
  kcalPerDay: 2900, // about 12 MJ, rounded
  // ISS water recovery after the Brine Processor (NASA, June 2023)
  issWaterRecovery: 0.98,
  // Veggie red romaine lettuce grew 33 days before harvest (NASA, 2015)
  lettuceDays: 33,
  // Earth surface background radiation, about 2 mSv per year
  earthDoseMSvPerDay: 0.005,
  // Curiosity RAD on the surface of Mars (Hassler et al., Science 2014)
  marsDoseMSvPerDay: 0.67,
  // InSight solar power before and after dust (NASA JPL)
  insightWhStart: 5000,
  insightWhEnd: 285,
  // Average Earth-Moon distance
  moonDistanceKm: 384400,
  // ARADS first field season in the Atacama
  aradsYear: 2017
};

export const SOURCES = [
  {
    key: "arads",
    label: "NASA Astrobiology: NASA tests life-detection drill in the Atacama Desert (ARADS, 2017)",
    url: "https://astrobiology.nasa.gov/news/nasa-tests-life-detection-drill-in-the-atacama-desert/"
  },
  {
    key: "bvad",
    label: "NASA Life Support Baseline Values and Assumptions Document (2022): oxygen, water and food per astronaut",
    url: "https://ntrs.nasa.gov/api/citations/20210024855/downloads/BVAD_2.15.22-final.pdf"
  },
  {
    key: "iss",
    label: "NASA: International Space Station facts and figures",
    url: "https://www.nasa.gov/international-space-station/space-station-facts-and-figures/"
  },
  {
    key: "veggie",
    label: "NASA plant growth on the space station: Veggie lettuce after 33 days (2015 report)",
    url: "https://phys.org/news/2015-08-meals-ready-crew-members-sample.pdf"
  },
  {
    key: "srag",
    label: "NASA Space Radiation Analysis Group: why Earth's atmosphere and magnetic field protect us",
    url: "https://srag.jsc.nasa.gov/SpaceRadiation/Why/Why.cfm"
  },
  {
    key: "recycle",
    label: "ISS water recycling reaches 98% (NASA, June 2023, reported by Space.com)",
    url: "https://www.space.com/astronaut-pee-iss-water-recycling-98-percent-milestone"
  },
  {
    key: "insight",
    label: "NASA: InSight's power level as dust covered its solar panels (Dec 2022)",
    url: "https://science.nasa.gov/blogs/insight/2022/12/12/nasa-insights-power-level-as-of-dec-12-2022/"
  },
  {
    key: "diviner",
    label: "NASA LRO: temperature variation on the Moon",
    url: "https://science.nasa.gov/wp-content/uploads/2024/01/lrolitho7temperaturevariation27may2014.pdf"
  }
];
