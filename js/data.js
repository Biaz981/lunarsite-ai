// ============================================================
// LunarSite AI - Data Store
// ============================================================

const CLPS_MISSIONS = [
    { id: "im-2", name: "IM-2", fullName: "Intuitive Machines Mission 2",
      company: "Intuitive Machines", lander: "Nova-C",
      launch: "Nov 2026", launchDate: "2026-11-15", site: "Mons Mouton",
      lat: 87.3, lon: -30.0, region: "Lunar South Pole",
      payload: "PRIME-1 Drill, Micro-Nova Hopper",
      objective: "Water ice drilling near south pole", era: "2026" },
    { id: "firefly-2", name: "Blue Ghost 2", fullName: "Firefly Blue Ghost Mission 2",
      company: "Firefly Aerospace", lander: "Blue Ghost",
      launch: "Dec 2026", launchDate: "2026-12-01", site: "Mare Crisium",
      lat: 17.0, lon: 59.1, region: "Mare Crisium (Far Side)",
      payload: "LuSEE-Night Radio Telescope",
      objective: "Deploy radio telescope on lunar far side", era: "2026" },
    { id: "griffin-1", name: "Griffin-1", fullName: "Astrobotic Griffin Mission 1",
      company: "Astrobotic", lander: "Griffin",
      launch: "Dec 2026", launchDate: "2026-12-20", site: "Shackleton Ridge",
      lat: -89.9, lon: 0.0, region: "Lunar South Pole",
      payload: "VIPER Rover", objective: "Search for water ice with VIPER rover", era: "2026" },
    { id: "blue-moon-1", name: "Blue Moon MK1", fullName: "Blue Origin Blue Moon Mark 1",
      company: "Blue Origin", lander: "Blue Moon",
      launch: "Jan 2027", launchDate: "2027-01-15", site: "Shackleton Crater",
      lat: -89.9, lon: 0.0, region: "Lunar South Pole",
      payload: "NASA CLPS Payloads", objective: "Precision landing test near Shackleton", era: "2026" },
    { id: "lunar-vise", name: "Lunar-VISE", fullName: "Lunar Vulcan Imaging & Seismology Experiment",
      company: "NASA / Firefly", lander: "Blue Ghost",
      launch: "Nov 2026", launchDate: "2026-11-15", site: "Mons Gruithuisen Gamma",
      lat: 36.45715, lon: 319.20398, region: "Gruithuisen Domes",
      payload: "Lunar-VISE Instrument", objective: "Study unique volcanic domes", era: "2026" },
    { id: "csmg", name: "CSMG", fullName: "Commercial SmallSat Mission to Gateway",
      company: "NASA / Firefly", lander: "Blue Ghost",
      launch: "Dec 2026", launchDate: "2026-12-01", site: "Mare Crisium",
      lat: 17.0, lon: 59.1, region: "Mare Crisium",
      payload: "Lunar GPS Receiver", objective: "Test GPS signals on lunar surface", era: "2026" }
];

const APOLLO_MISSIONS = [
    { id: "apollo-11", name: "Apollo 11", year: 1969, site: "Sea of Tranquility",
      lat: 0.67408, lon: 23.47297, crew: "Armstrong, Aldrin, Collins",
      objective: "First human Moon landing", era: "historical" },
    { id: "apollo-12", name: "Apollo 12", year: 1969, site: "Ocean of Storms",
      lat: -3.01239, lon: -23.42157, crew: "Conrad, Bean, Gordon",
      objective: "Precision landing near Surveyor 3", era: "historical" },
    { id: "apollo-14", name: "Apollo 14", year: 1971, site: "Fra Mauro",
      lat: -3.64530, lon: -17.47136, crew: "Shepard, Mitchell, Roosa",
      objective: "Collect samples from Fra Mauro formation", era: "historical" },
    { id: "apollo-15", name: "Apollo 15", year: 1971, site: "Hadley-Apennine",
      lat: 26.13222, lon: 3.63386, crew: "Scott, Worden, Irwin",
      objective: "First use of Lunar Roving Vehicle", era: "historical" },
    { id: "apollo-16", name: "Apollo 16", year: 1972, site: "Descartes Highlands",
      lat: -8.97301, lon: 15.50019, crew: "Young, Mattingly, Duke",
      objective: "Explore lunar highlands", era: "historical" },
    { id: "apollo-17", name: "Apollo 17", year: 1972, site: "Taurus-Littrow",
      lat: 20.19080, lon: 30.77168, crew: "Cernan, Evans, Schmitt",
      objective: "Last human Moon landing", era: "historical" }
];

const WATER_ICE_SITES = [
    { lat: -89.9, lon: 0.0, name: "Shackleton Crater", confidence: 0.95 },
    { lat: -88.0, lon: 45.0, name: "Cabeus Crater", confidence: 0.88 },
    { lat: -87.5, lon: -45.0, name: "Malapert Massif", confidence: 0.82 },
    { lat: 87.3, lon: -30.0, name: "Mons Mouton", confidence: 0.79 },
    { lat: -85.0, lon: 0.0, name: "South Pole Region", confidence: 0.75 }
];

console.log(`✅ Data: ${CLPS_MISSIONS.length} CLPS + ${APOLLO_MISSIONS.length} Apollo`);