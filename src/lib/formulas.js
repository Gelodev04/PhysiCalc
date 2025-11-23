export const FORMULAS = {
  // Kinematics
  velocity: {
    id: "velocity",
    name: "Find Final Velocity",
    category: "Kinematics",
    formula: "v = v₀ + at",
    endpoint: "/api/kinematics/velocity",
    variables: [
      {
        key: "u",
        label: "v₀",
        name: "Initial Velocity",
        unit: "m/s",
        placeholder: "0",
      },
      {
        key: "a",
        label: "a",
        name: "Acceleration",
        unit: "m/s²",
        placeholder: "9.8",
      },
      { key: "t", label: "t", name: "Time", unit: "s", placeholder: "10" },
    ],
    required: ["u", "a", "t"],
    resultKey: "result",
  },
  displacement: {
    id: "displacement",
    name: "Find Displacement",
    category: "Kinematics",
    formula: "s = v₀t + ½at²",
    endpoint: "/api/kinematics/displacement",
    variables: [
      {
        key: "u",
        label: "v₀",
        name: "Initial Velocity",
        unit: "m/s",
        placeholder: "0",
      },
      {
        key: "a",
        label: "a",
        name: "Acceleration",
        unit: "m/s²",
        placeholder: "9.8",
      },
      { key: "t", label: "t", name: "Time", unit: "s", placeholder: "10" },
    ],
    required: ["u", "a", "t"],
    resultKey: "result",
  },
  acceleration: {
    id: "acceleration",
    name: "Find Acceleration",
    category: "Kinematics",
    formula: "a = (v - v₀) / t",
    endpoint: "/api/kinematics/acceleration",
    variables: [
      {
        key: "v",
        label: "v",
        name: "Final Velocity",
        unit: "m/s",
        placeholder: "50",
      },
      {
        key: "u",
        label: "v₀",
        name: "Initial Velocity",
        unit: "m/s",
        placeholder: "0",
      },
      { key: "t", label: "t", name: "Time", unit: "s", placeholder: "10" },
    ],
    required: ["v", "u", "t"],
    resultKey: "result",
  },
  time: {
    id: "time",
    name: "Find Time",
    category: "Kinematics",
    formula: "t = (v - v₀) / a",
    endpoint: "/api/kinematics/time",
    variables: [
      {
        key: "v",
        label: "v",
        name: "Final Velocity",
        unit: "m/s",
        placeholder: "50",
      },
      {
        key: "u",
        label: "v₀",
        name: "Initial Velocity",
        unit: "m/s",
        placeholder: "0",
      },
      {
        key: "a",
        label: "a",
        name: "Acceleration",
        unit: "m/s²",
        placeholder: "9.8",
      },
    ],
    required: ["v", "u", "a"],
    resultKey: "result",
  },
  // Electricity
  current: {
    id: "current",
    name: "Calculate Current",
    category: "Electricity",
    formula: "I = V / R",
    endpoint: "/api/electricity/current",
    variables: [
      {
        key: "voltage",
        label: "V",
        name: "Voltage",
        unit: "V",
        placeholder: "12",
      },
      {
        key: "resistance",
        label: "R",
        name: "Resistance",
        unit: "Ω",
        placeholder: "4",
      },
    ],
    required: ["voltage", "resistance"],
    resultKey: "result",
  },
  voltage: {
    id: "voltage",
    name: "Calculate Voltage",
    category: "Electricity",
    formula: "V = I × R",
    endpoint: "/api/electricity/voltage",
    variables: [
      {
        key: "current",
        label: "I",
        name: "Current",
        unit: "A",
        placeholder: "2",
      },
      {
        key: "resistance",
        label: "R",
        name: "Resistance",
        unit: "Ω",
        placeholder: "5",
      },
    ],
    required: ["current", "resistance"],
    resultKey: "result",
  },
  resistance: {
    id: "resistance",
    name: "Calculate Resistance",
    category: "Electricity",
    formula: "R = V / I",
    endpoint: "/api/electricity/resistance",
    variables: [
      {
        key: "voltage",
        label: "V",
        name: "Voltage",
        unit: "V",
        placeholder: "220",
      },
      {
        key: "current",
        label: "I",
        name: "Current",
        unit: "A",
        placeholder: "5",
      },
    ],
    required: ["voltage", "current"],
    resultKey: "result",
  },
  power: {
    id: "power",
    name: "Calculate Power",
    category: "Electricity",
    formula: "P = V × I",
    endpoint: "/api/electricity/power",
    variables: [
      {
        key: "voltage",
        label: "V",
        name: "Voltage",
        unit: "V",
        placeholder: "10",
      },
      {
        key: "current",
        label: "I",
        name: "Current",
        unit: "A",
        placeholder: "2",
      },
    ],
    required: ["voltage", "current"],
    resultKey: "result",
  },
  // Forces
  normalForce: {
    id: "normalForce",
    name: "Calculate Normal Force",
    category: "Forces",
    formula: "N = mg",
    endpoint: "/api/forces/normal",
    variables: [
      { key: "mass", label: "m", name: "Mass", unit: "kg", placeholder: "10" },
    ],
    required: ["mass"],
    resultKey: "result",
  },
  friction: {
    id: "friction",
    name: "Calculate Frictional Force",
    category: "Forces",
    formula: "F_f = μN",
    endpoint: "/api/forces/friction",
    variables: [
      {
        key: "mu",
        label: "μ",
        name: "Coefficient of Friction",
        unit: "",
        placeholder: "0.5",
      },
      {
        key: "normal_force",
        label: "N",
        name: "Normal Force",
        unit: "N",
        placeholder: "98",
      },
    ],
    required: ["mu", "normal_force"],
    resultKey: "result",
  },
  // Work & Energy
  kineticEnergy: {
    id: "kineticEnergy",
    name: "Calculate Kinetic Energy",
    category: "Work & Energy",
    formula: "KE = ½mv²",
    endpoint: "/api/work_energy/kinetic",
    variables: [
      { key: "mass", label: "m", name: "Mass", unit: "kg", placeholder: "2" },
      {
        key: "velocity",
        label: "v",
        name: "Velocity",
        unit: "m/s",
        placeholder: "10",
      },
    ],
    required: ["mass", "velocity"],
    resultKey: "result",
  },
  potentialEnergy: {
    id: "potentialEnergy",
    name: "Calculate Potential Energy",
    category: "Work & Energy",
    formula: "PE = mgh",
    endpoint: "/api/work_energy/potential",
    variables: [
      { key: "mass", label: "m", name: "Mass", unit: "kg", placeholder: "10" },
      {
        key: "height",
        label: "h",
        name: "Height",
        unit: "m",
        placeholder: "5",
      },
    ],
    required: ["mass", "height"],
    resultKey: "result",
  },
  work: {
    id: "work",
    name: "Calculate Work",
    category: "Work & Energy",
    formula: "W = F × d",
    endpoint: "/api/work_energy/work",
    variables: [
      { key: "force", label: "F", name: "Force", unit: "N", placeholder: "50" },
      {
        key: "distance",
        label: "d",
        name: "Distance",
        unit: "m",
        placeholder: "10",
      },
    ],
    required: ["force", "distance"],
    resultKey: "result",
  },
  // Projectile Motion
  projectileHeight: {
    id: "projectileHeight",
    name: "Calculate Maximum Height",
    category: "Projectile Motion",
    formula: "H = (v₀²sin²θ) / 2g",
    endpoint: "/api/projectile/height",
    variables: [
      {
        key: "u",
        label: "v₀",
        name: "Initial Velocity",
        unit: "m/s",
        placeholder: "20",
      },
      { key: "angle", label: "θ", name: "Angle", unit: "°", placeholder: "60" },
    ],
    required: ["u", "angle"],
    resultKey: "result",
  },
  projectileRange: {
    id: "projectileRange",
    name: "Calculate Horizontal Range",
    category: "Projectile Motion",
    formula: "R = (v₀²sin(2θ)) / g",
    endpoint: "/api/projectile/range",
    variables: [
      {
        key: "u",
        label: "v₀",
        name: "Initial Velocity",
        unit: "m/s",
        placeholder: "20",
      },
      { key: "angle", label: "θ", name: "Angle", unit: "°", placeholder: "45" },
    ],
    required: ["u", "angle"],
    resultKey: "result",
  },
};

export function getFormulasByCategory(category) {
  return Object.values(FORMULAS).filter(
    (formula) => formula.category === category
  );
}

export function getFormulaById(id) {
  return FORMULAS[id] || null;
}

export function getCategories() {
  const categories = new Set(Object.values(FORMULAS).map((f) => f.category));
  return Array.from(categories);
}
