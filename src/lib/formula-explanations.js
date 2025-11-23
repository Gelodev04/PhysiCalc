export const FORMULA_EXPLANATIONS = {
  // Kinematics
  velocity: {
    description:
      "This formula calculates the final velocity of an object given its initial velocity, acceleration, and time.",
    whenToUse:
      "Use this when you know the initial velocity, acceleration, and time, and need to find the final velocity.",
    example:
      "A car starts from rest (v₀ = 0) and accelerates at 5 m/s² for 10 seconds. Its final velocity would be v = 0 + (5)(10) = 50 m/s.",
  },
  displacement: {
    description:
      "This formula calculates the displacement (change in position) of an object using initial velocity, time, and acceleration.",
    whenToUse:
      "Use this to find how far an object has moved when you know its initial velocity, acceleration, and time.",
    example:
      "An object starts with velocity 10 m/s, accelerates at 2 m/s² for 5 seconds. Displacement = (10)(5) + ½(2)(5)² = 50 + 25 = 75 m.",
  },
  acceleration: {
    description:
      "This formula calculates acceleration by finding the change in velocity over time.",
    whenToUse:
      "Use this when you know the initial and final velocities and the time taken, and need to find acceleration.",
    example:
      "A car changes velocity from 20 m/s to 60 m/s in 5 seconds. Acceleration = (60 - 20) / 5 = 8 m/s².",
  },
  time: {
    description:
      "This formula calculates the time taken for a velocity change given initial velocity, final velocity, and acceleration.",
    whenToUse:
      "Use this to find how long it takes for an object to change from one velocity to another under constant acceleration.",
    example:
      "An object accelerates from 10 m/s to 30 m/s at 4 m/s². Time = (30 - 10) / 4 = 5 seconds.",
  },
  // Electricity
  current: {
    description:
      "Ohm's Law: This formula calculates electric current flowing through a circuit given voltage and resistance.",
    whenToUse:
      "Use this when you know the voltage across a resistor and its resistance, and need to find the current.",
    example:
      "A 12V battery is connected to a 4Ω resistor. Current = 12 / 4 = 3 A.",
  },
  voltage: {
    description:
      "Ohm's Law: This formula calculates the voltage across a circuit element given current and resistance.",
    whenToUse:
      "Use this when you know the current flowing and the resistance, and need to find the voltage.",
    example:
      "A current of 2 A flows through a 5Ω resistor. Voltage = 2 × 5 = 10 V.",
  },
  resistance: {
    description:
      "Ohm's Law: This formula calculates the resistance of a circuit element given voltage and current.",
    whenToUse:
      "Use this when you know the voltage and current, and need to find the resistance.",
    example:
      "A 220V source produces 5 A of current. Resistance = 220 / 5 = 44 Ω.",
  },
  power: {
    description:
      "This formula calculates electrical power (rate of energy transfer) in a circuit.",
    whenToUse:
      "Use this to find the power consumed or produced when you know voltage and current.",
    example:
      "A device operates at 12 V with 2 A current. Power = 12 × 2 = 24 W.",
  },
  // Forces
  normalForce: {
    description:
      "This formula calculates the normal force (perpendicular contact force) acting on an object on a horizontal surface.",
    whenToUse:
      "Use this to find the normal force when you know the mass and gravitational acceleration.",
    example:
      "A 10 kg object on Earth (g = 9.8 m/s²). Normal force = 10 × 9.8 = 98 N.",
  },
  friction: {
    description:
      "This formula calculates the frictional force using the coefficient of friction and normal force.",
    whenToUse:
      "Use this when you know the coefficient of friction and normal force to find friction.",
    example:
      "Coefficient of friction μ = 0.5, normal force N = 100 N. Friction = 0.5 × 100 = 50 N.",
  },
  // Work & Energy
  kineticEnergy: {
    description:
      "This formula calculates the kinetic energy (energy of motion) of an object.",
    whenToUse:
      "Use this to find the kinetic energy when you know the mass and velocity of an object.",
    example:
      "A 5 kg object moving at 10 m/s. Kinetic energy = ½ × 5 × 10² = 250 J.",
  },
  potentialEnergy: {
    description:
      "This formula calculates gravitational potential energy (energy due to height).",
    whenToUse:
      "Use this to find potential energy when you know mass, gravitational acceleration, and height.",
    example:
      "A 2 kg object at height 10 m. Potential energy = 2 × 9.8 × 10 = 196 J.",
  },
  work: {
    description:
      "This formula calculates work done (energy transferred) when a force moves an object.",
    whenToUse:
      "Use this to find work when you know the force applied and the distance moved.",
    example: "A 50 N force moves an object 10 m. Work = 50 × 10 = 500 J.",
  },
  // Projectile Motion
  projectileHeight: {
    description:
      "This formula calculates the maximum height reached by a projectile launched at an angle.",
    whenToUse:
      "Use this to find maximum height when you know initial velocity, launch angle, and gravitational acceleration.",
    example:
      "A projectile launched at 20 m/s at 45° angle. Height = (20² × sin²(45°)) / (2 × 9.8) ≈ 10.2 m.",
  },
  projectileRange: {
    description:
      "This formula calculates the horizontal range (distance) of a projectile launched at an angle.",
    whenToUse:
      "Use this to find how far a projectile travels when you know initial velocity, launch angle, and gravity.",
    example:
      "A projectile launched at 30 m/s at 30° angle. Range = (30² × sin(60°)) / 9.8 ≈ 79.5 m.",
  },
};

export function getFormulaExplanation(formulaId, category) {
  return (
    FORMULA_EXPLANATIONS[formulaId] || {
      description: `This formula is used in ${category} calculations.`,
      whenToUse: "Enter the required values to calculate the result.",
      example: "Fill in the input fields above to see an example calculation.",
    }
  );
}
