import { FORMULAS } from "./formulas";

/**
 * Maps variable names and keywords to formula variable keys
 */
const VARIABLE_MAPPINGS = {
  // Kinematics variables
  "initial velocity": "u",
  "initial speed": "u",
  "starting velocity": "u",
  "starting speed": "u",
  v0: "u",
  "v₀": "u",
  u: "u",
  "final velocity": "v",
  "final speed": "v",
  velocity: "v",
  speed: "v",
  v: "v",
  acceleration: "a",
  a: "a",
  time: "t",
  t: "t",
  seconds: "t",
  s: "t",
  displacement: "s",
  distance: "s",
  s: "s",
  // Electricity variables
  voltage: "voltage",
  v: "voltage", // context-dependent
  "potential difference": "voltage",
  current: "current",
  i: "current",
  amperes: "current",
  amps: "current",
  resistance: "resistance",
  r: "resistance",
  ohms: "resistance",
  power: "power",
  p: "power",
  // Forces variables
  mass: "mass",
  m: "mass",
  kg: "mass",
  kilograms: "mass",
  "coefficient of friction": "mu",
  "friction coefficient": "mu",
  mu: "mu",
  μ: "mu",
  "normal force": "normal_force",
  n: "normal_force",
  // Work & Energy variables
  height: "height",
  h: "height",
  meters: "height",
  force: "force",
  f: "force",
  newtons: "force",
  // Projectile Motion
  angle: "angle",
  θ: "angle",
  theta: "angle",
  degrees: "angle",
};

/**
 * Extracts numeric values from text
 */
function extractNumber(text) {
  // Match numbers with optional decimal points and units
  const numberRegex =
    /(-?\d+\.?\d*)\s*(m\/s²?|m\/s|m|s|kg|N|V|A|Ω|°|degrees?|seconds?|meters?|kilograms?|newtons?|volts?|amperes?|ohms?)?/gi;
  const matches = text.match(numberRegex);
  if (!matches) return null;

  // Extract the first number
  const numberMatch = matches[0].match(/-?\d+\.?\d*/);
  return numberMatch ? parseFloat(numberMatch[0]) : null;
}

/**
 * Determines which formula to use based on problem text
 */
function identifyFormula(problemText) {
  const lowerText = problemText.toLowerCase();

  // Check for keywords that indicate specific formulas
  const formulaKeywords = {
    velocity: [
      "final velocity",
      "find velocity",
      "calculate velocity",
      "velocity after",
      "speed after",
    ],
    displacement: ["displacement", "distance traveled", "how far", "distance"],
    acceleration: [
      "acceleration",
      "find acceleration",
      "calculate acceleration",
    ],
    time: [
      "time",
      "how long",
      "how long will it take",
      "how long does it take",
      "takes",
      "duration",
      "reach.*velocity",
    ],
    current: [
      "current",
      "find current",
      "find the current",
      "calculate current",
      "calculate the current",
      "what is.*current",
      "what is the current",
      "amperes",
      "amps",
      "i =",
    ],
    voltage: [
      "voltage",
      "find voltage",
      "calculate voltage",
      "determine.*voltage",
      "how much.*voltage",
      "what is.*voltage",
      "potential difference",
      "voltage across",
      "voltage applied",
      "voltage present",
      "voltage applied across",
      "potential difference across",
      "what is.*potential difference",
      "find.*potential difference",
      "calculate.*potential difference",
      "determine.*potential difference",
      "how much.*potential difference",
      "v =",
    ],
    resistance: [
      "resistance",
      "find resistance",
      "find the resistance",
      "calculate resistance",
      "calculate the resistance",
      "what is.*resistance",
      "what is the resistance",
      "ohms",
      "r =",
    ],
    power: [
      "power",
      "find power",
      "find the power",
      "calculate power",
      "calculate the power",
      "what is.*power",
      "what is the power",
      "power dissipated",
      "power.*resistor",
      "p =",
    ],
    normalForce: [
      "normal force",
      "find normal force",
      "find the normal force",
      "calculate normal force",
      "calculate the normal force",
      "what is.*normal force",
      "what is the normal force",
      "force.*table.*exerts",
      "force.*exerts.*upward",
      "force.*exerted.*upward",
      "table.*exerts.*upward",
      "n =",
    ],
    friction: [
      "friction",
      "frictional force",
      "find frictional force",
      "find the frictional force",
      "calculate frictional force",
      "calculate the frictional force",
      "what is.*frictional force",
      "what is the frictional force",
      "f_f",
    ],
    kineticEnergy: [
      "kinetic energy",
      "find kinetic energy",
      "find the kinetic energy",
      "calculate kinetic energy",
      "calculate the kinetic energy",
      "what is.*kinetic energy",
      "what is the kinetic energy",
      "energy due to.*motion",
      "energy.*motion",
      "ke =",
    ],
    potentialEnergy: ["potential energy", "pe =", "gravitational potential"],
    work: [
      "work",
      "find work",
      "find the work",
      "calculate work",
      "calculate the work",
      "what is.*work",
      "what is the work",
      "work performed",
      "work done",
      "w =",
    ],
    projectileHeight: [
      "maximum height",
      "find maximum height",
      "find the maximum height",
      "calculate maximum height",
      "calculate the maximum height",
      "calculate its maximum height",
      "what is.*maximum height",
      "what is the maximum height",
      "height reached",
      "peak height",
      "find.*peak height",
      "find the peak height",
      "peak.*height.*reaches",
      "peak.*it.*reaches",
      "highest point",
      "find.*highest point",
      "calculate.*highest point",
      "what is.*highest point",
      "projectile.*maximum height",
      "projectile.*highest point",
      "rocket.*height",
      "ball.*height",
    ],
    projectileRange: [
      "range",
      "horizontal range",
      "horizontal distance",
      "distance traveled",
      "how far.*travel",
      "how far.*go",
      "distance.*travel",
    ],
  };

  // Check for special cases first (before general scoring)
  // IMPORTANT: Check projectile height FIRST as it's very specific

  // Basic detection patterns - check these early
  // More lenient velocity detection - match any mention of speed/velocity with units or numbers
  const hasVelocity =
    /(?:initial\s+)?(?:speed|velocity)|m\/s|\d+\s*m\/s|speed\s+of|velocity\s+of/i.test(
      problemText
    );
  // More lenient angle detection - match angle keywords or degree symbols
  const hasAngle = /angle|degrees?|°|\d+\s*°|at\s+an?\s+angle/i.test(
    problemText
  );
  // More lenient projectile detection - match common projectile motion keywords
  const hasProjectile =
    /projectile|rocket|ball|cannonball|object|launched|fired|thrown|shot|bullet|missile|catapult/i.test(
      problemText
    );
  // More explicit regex for maximum height - be very specific
  // Include "peak height", "peak.*reaches", "find.*peak"
  // Make it more flexible - match any mention of height with maximum/peak/highest
  const asksForMaximumHeight =
    /maximum\s+height|height\s+reached|peak\s+height|highest\s+point|find.*peak|find.*maximum|calculate.*maximum|what.*maximum|calculate.*its.*maximum|calculate.*height|find.*height|what.*height|peak.*reaches|maximum.*reaches|find.*peak.*height|peak.*it.*reaches|find.*the.*peak|find.*the.*maximum|peak.*height.*reaches|maximum.*height.*reaches|find.*peak.*it.*reaches|find.*the.*peak.*height/i.test(
      problemText
    );

  // Also check if it's asking for range (horizontal distance) - DEFINE THIS FIRST
  const asksForRange =
    /range|horizontal range|horizontal distance|how far.*travel|distance.*travel|how far.*go|how far.*land|horizontal.*distance/i.test(
      problemText
    );

  // PRIORITY 1: Check for projectile maximum height FIRST
  // This is very specific and should be caught early
  // Be more lenient: if it asks for maximum/peak height and has velocity+angle, it's likely projectile
  // Even if projectile keyword is missing, velocity + angle + height question = projectile motion

  // Check for height-related keywords
  const mentionsAnyHeight = /height|peak|maximum|highest/i.test(problemText);
  const mentionsHeight = /height|peak|maximum|highest/i.test(problemText);

  // Be very lenient: if velocity + angle + height question = projectile motion
  // OR if projectile keyword + height question = projectile motion
  // OR if it mentions height and has both velocity and angle (even without explicit projectile keyword)
  const isProjectileHeightProblem =
    asksForMaximumHeight && (hasProjectile || (hasVelocity && hasAngle));

  // Additional check: if problem has velocity, angle, and asks about height in any form
  const isProjectileHeightProblemStrict =
    mentionsAnyHeight && hasVelocity && hasAngle && !asksForRange;

  // Even more lenient fallback: if we have velocity and angle, and it mentions height at all
  const isProjectileHeightProblemLenient =
    mentionsHeight &&
    hasVelocity &&
    hasAngle &&
    !asksForRange &&
    !/displacement|distance.*traveled|how far/i.test(problemText);

  // Most lenient: if we have projectile keyword + velocity + angle, assume it's projectile motion
  // and if it mentions height at all, it's likely asking for maximum height
  const isProjectileHeightProblemVeryLenient =
    hasProjectile && hasVelocity && hasAngle && mentionsHeight && !asksForRange;

  // Store these for use in scoring system
  const projectileHeightDetected =
    isProjectileHeightProblem ||
    isProjectileHeightProblemLenient ||
    isProjectileHeightProblemStrict ||
    isProjectileHeightProblemVeryLenient;

  // Check for range problem
  const isProjectileRangeProblem =
    asksForRange && (hasProjectile || (hasVelocity && hasAngle));

  // Early return for projectile problems - highest priority
  // This MUST happen before any other formula checks
  if (projectileHeightDetected) {
    return "projectileHeight";
  }

  if (isProjectileRangeProblem) {
    return "projectileRange";
  }

  const hasResistance = /resistance|resistor|ohms?|Ω/i.test(problemText);
  const hasVoltage = /voltage|potential difference|V\s+(?!\/)/i.test(
    problemText
  );
  const hasCurrent =
    /current|amperes?|amps?|A\s+(?:of\s+)?current|flows\s+through|flowing\s+through/i.test(
      problemText
    );
  const asksForVoltage =
    /what is.*voltage|find.*voltage|calculate.*voltage|determine.*voltage|how much.*voltage|voltage across|voltage applied|voltage present|what is.*potential difference|find.*potential difference|calculate.*potential difference|determine.*potential difference|how much.*potential difference|potential difference across/i.test(
      problemText
    );
  const asksForResistance =
    /what is.*resistance|find.*resistance|calculate.*resistance|determine.*resistance|how much.*resistance|calculate the resistance|find the resistance|what is the resistance/i.test(
      problemText
    );
  const asksForCurrent =
    /what is.*current|find.*current|calculate.*current|determine.*current|how much.*current|calculate the current|find the current|what is the current/i.test(
      problemText
    );
  const asksForPower =
    /what is.*power|find.*power|calculate.*power|determine.*power|how much.*power|calculate the power|find the power|what is the power/i.test(
      problemText
    );
  const hasMass = /mass|kg|kilograms?|object.*kg|\d+\s*kg/i.test(problemText);
  const hasForce = /force|N\s+(?!\/)|newtons?/i.test(problemText);
  const hasDistance = /distance|m\s+(?!\/)|meters?/i.test(problemText);
  const hasMu = /coefficient.*friction|friction.*coefficient|μ|mu\s*=/i.test(
    problemText
  );
  const asksForNormalForce =
    /what is.*normal force|find.*normal force|calculate.*normal force|determine.*normal force|what is the normal force|find the normal force|calculate the normal force|force.*table.*exerts|force.*exerts.*upward|force.*exerted.*upward|table.*exerts.*upward|what is.*force.*table|what is.*force.*exerts/i.test(
      problemText
    );
  const asksForFriction =
    /what is.*frictional force|find.*frictional force|calculate.*frictional force|determine.*frictional force|what is the frictional force|find the frictional force|calculate the frictional force|calculate.*friction|find.*friction/i.test(
      problemText
    );
  const asksForKineticEnergy =
    /what is.*kinetic energy|find.*kinetic energy|calculate.*kinetic energy|determine.*kinetic energy|what is the kinetic energy|find the kinetic energy|calculate the kinetic energy|energy due to.*motion|energy.*motion|calculate.*energy.*motion|find.*energy.*motion/i.test(
      problemText
    );
  const asksForWork =
    /what is.*work|find.*work|calculate.*work|determine.*work|what is the work|find the work|calculate the work|work performed|work done|calculate.*work.*performed|find.*work.*performed/i.test(
      problemText
    );

  // Prioritize work formula if force and distance are mentioned and work is asked
  if (hasForce && hasDistance && asksForWork) {
    return "work";
  }

  // Prioritize kinetic energy formula if mass and velocity are mentioned and kinetic energy is asked
  if (hasMass && hasVelocity && asksForKineticEnergy) {
    return "kineticEnergy";
  }

  // Prioritize friction formula if coefficient of friction is mentioned and friction is asked
  if (hasMu && asksForFriction) {
    return "friction";
  }

  // Prioritize normal force formula if mass is mentioned and normal force is asked
  if (hasMass && asksForNormalForce) {
    return "normalForce";
  }

  // Prioritize power formula if voltage and current are mentioned and power is asked
  if (hasVoltage && hasCurrent && asksForPower) {
    return "power";
  }

  // Prioritize resistance formula if voltage and current are mentioned and resistance is asked
  if (hasVoltage && hasCurrent && asksForResistance) {
    return "resistance";
  }

  // Prioritize current formula if voltage and resistance are mentioned and current is asked
  if (hasVoltage && hasResistance && asksForCurrent) {
    return "current";
  }

  // Prioritize voltage formula if current and resistance are mentioned and voltage is asked
  if (hasCurrent && hasResistance && asksForVoltage) {
    return "voltage";
  }

  // Score each formula based on keyword matches
  // But skip if we already identified projectileHeight or projectileRange
  let bestMatch = "velocity"; // default
  let bestScore = 0;

  for (const [formulaId, keywords] of Object.entries(formulaKeywords)) {
    // Skip scoring if this is projectileHeight/projectileRange and we already determined it should be used
    if (
      (formulaId === "projectileHeight" && projectileHeightDetected) ||
      (formulaId === "projectileRange" && isProjectileRangeProblem)
    ) {
      continue;
    }

    const score = keywords.reduce((acc, keyword) => {
      // Use regex for patterns like "voltage.*power"
      if (keyword.includes(".*")) {
        const regex = new RegExp(keyword, "i");
        if (regex.test(lowerText)) {
          return acc + 2; // Give higher score for pattern matches
        }
      } else if (lowerText.includes(keyword)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = formulaId;
    }
  }

  // If we determined it's a projectile height/range problem, return that instead
  if (projectileHeightDetected) {
    return "projectileHeight";
  }

  if (isProjectileRangeProblem) {
    return "projectileRange";
  }

  return bestMatch;
}

/**
 * Extracts variable values from problem text
 */
function extractVariables(problemText, formulaConfig) {
  const extracted = {};
  const lowerText = problemText.toLowerCase();

  // Normalize different minus sign characters (Unicode minus, hyphen-minus, etc.)
  // Replace various minus signs with standard hyphen-minus
  const normalizedText = problemText
    .replace(/[\u2212\u2013\u2014]/g, "-") // Unicode minus, en-dash, em-dash → hyphen-minus
    .replace(/\+\s*([+-])/g, "$1"); // Remove redundant +- or ++

  // Track which numbers have been used (for fallback matching)
  const usedNumberIndices = new Set();

  // First, try to extract initial velocity specifically (before other numbers)
  const initialVelocityVar = formulaConfig.variables.find((v) => v.key === "u");
  if (initialVelocityVar) {
    const initialVelocityPatterns = [
      // Pattern: "launched with an initial speed of X m/s" - most specific, prioritize
      /launched\s+with\s+(?:an\s+)?initial\s+speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      // Pattern: "with an initial speed of X m/s" (standalone, for rockets, projectiles)
      /with\s+(?:an\s+)?initial\s+speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      // Pattern: "launched at X m/s" - but be careful not to match angle
      /launched\s+at\s+([+-]?\d+\.?\d*)\s*m\/s(?!\s*at\s+an?\s+angle)/gi,
      /projectile.*?launched\s+at\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      /launched\s+with\s+a\s+speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      /launched\s+at\s+a\s+speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      // Pattern: "fired at a speed of X m/s"
      /fired\s+at\s+a\s+speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      /fired\s+at\s+.*?speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      /fired\s+at\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      /fired\s+with\s+a\s+speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      // Pattern: "thrown with an initial speed of X m/s" - prioritize this
      /thrown\s+with\s+(?:an\s+)?initial\s+speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      // Pattern: "thrown with a speed of X m/s"
      /thrown\s+with\s+a\s+speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      /thrown\s+with\s+.*?speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      /thrown\s+at\s+.*?speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      // Pattern: "moving backward/forward/upward with an initial velocity of X"
      /moving\s+(?:backward|forward|upward|downward).*?with\s+(?:an\s+)?initial\s+velocity\s+of\s+([+-]?\d+\.?\d*)/gi,
      /moving\s+.*?with\s+(?:an\s+)?initial\s+velocity\s+of\s+([+-]?\d+\.?\d*)/gi,
      /initial\s+velocity\s+of\s+([+-]?\d+\.?\d*)/gi,
      /initial\s+speed\s+of\s+([+-]?\d+\.?\d*)/gi,
      // Pattern: "speed of X m/s" when in projectile context
      /(?:rocket|projectile|ball|object).*?speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      /traveling\s+at\s+(?:an\s+)?initial\s+velocity\s+of\s+([+-]?\d+\.?\d*)/gi,
      /traveling\s+at\s+([+-]?\d+\.?\d*)\s+m\/s/gi,
      // Pattern: "from X m/s" (for "increases from X to Y")
      /from\s+([+-]?\d+\.?\d*)\s+m\/s/gi,
      /increases\s+.*?from\s+([+-]?\d+\.?\d*)\s+m\/s/gi,
      /decreases\s+.*?from\s+([+-]?\d+\.?\d*)\s+m\/s/gi,
    ];

    for (const pattern of initialVelocityPatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        // Use the capture group directly (match[1]) since patterns have capture groups
        let value = match[1] || match[0].match(/([+-]?\d+\.?\d*)/)?.[1];
        if (value) {
          value = value.trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted["u"] = value;
          // Mark this number as used
          const matchIndex = normalizedText
            .toLowerCase()
            .indexOf(match[0].toLowerCase());
          if (matchIndex !== -1) {
            usedNumberIndices.add(matchIndex);
          }
          break;
        }
      }
    }

    // Check for "starts from rest"
    if (
      !extracted["u"] &&
      lowerText.includes("rest") &&
      (lowerText.includes("starts") || lowerText.includes("from rest"))
    ) {
      extracted["u"] = "0";
    }
  }

  // Extract final velocity specifically (for acceleration and time formulas)
  const finalVelocityVar = formulaConfig.variables.find((v) => v.key === "v");
  if (finalVelocityVar) {
    // First check for "come to a stop" or "stop" = final velocity = 0
    if (
      lowerText.includes("come to a stop") ||
      lowerText.includes("come to stop") ||
      (lowerText.includes("stop") &&
        (lowerText.includes("final velocity") ||
          lowerText.includes("v=0") ||
          lowerText.includes("v = 0")))
    ) {
      extracted["v"] = "0";
    } else {
      const finalVelocityPatterns = [
        /final\s+velocity\s+of\s+([+-]?\d+\.?\d*)/gi,
        /final\s+speed\s+of\s+([+-]?\d+\.?\d*)/gi,
        // Pattern: "reach a velocity of X m/s" or "reach velocity of X m/s"
        /reach\s+(?:a\s+)?velocity\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
        /reach\s+(?:a\s+)?speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
        // Pattern: "v = 0" or "v=0" explicitly stated
        /v\s*=\s*([+-]?\d+\.?\d*)/gi,
        // Pattern: "to X m/s" (for "increases from X to Y")
        /to\s+([+-]?\d+\.?\d*)\s+m\/s/gi,
        /increases\s+.*?to\s+([+-]?\d+\.?\d*)\s+m\/s/gi,
        /decreases\s+.*?to\s+([+-]?\d+\.?\d*)\s+m\/s/gi,
        // Pattern: "velocity of X m/s" (when asking "how long to reach")
        /velocity\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      ];

      for (const pattern of finalVelocityPatterns) {
        const match = normalizedText.match(pattern);
        if (match) {
          const numberMatch = match[0].match(/([+-]?\d+\.?\d*)/);
          if (numberMatch) {
            // Remove leading + sign from positive numbers
            let value = numberMatch[1].trim();
            if (value.startsWith("+")) {
              value = value.substring(1);
            }
            extracted["v"] = value;
            break;
          }
        }
      }
    }
  }

  // Extract acceleration specifically (before other numbers to avoid conflicts)
  const accelerationVar = formulaConfig.variables.find((v) => v.key === "a");
  if (accelerationVar && lowerText.includes("accelerat")) {
    // Find the position of "accelerat" to search nearby
    const accelIndex = lowerText.indexOf("accelerat");

    // Search in a window around "accelerat" for acceleration values
    const searchStart = Math.max(0, accelIndex - 50);
    const searchEnd = Math.min(normalizedText.length, accelIndex + 200);
    const searchWindow = normalizedText.substring(searchStart, searchEnd);

    // Try multiple patterns to catch acceleration in different formats
    const accelPatterns = [
      // Pattern: "accelerates forward at +4.25 m/s²" - most specific
      /accelerat[^m]*?(?:forward|backward)?\s*at\s+([+-]?\d+\.?\d*)\s*(?:m\/s[²2]|m\/s)/gi,
      // Pattern: "at +4.35 m/s²" - most direct
      /at\s+([+-]?\d+\.?\d*)\s*(?:m\/s[²2]|m\/s)/gi,
      // Pattern: "of +4.35 m/s²"
      /of\s+([+-]?\d+\.?\d*)\s*(?:m\/s[²2]|m\/s)/gi,
      // Pattern: "accelerates [anything] +4.35 m/s²"
      /([+-]?\d+\.?\d*)\s*(?:m\/s[²2]|m\/s)/gi,
    ];

    for (const pattern of accelPatterns) {
      // Use matchAll to get all matches with their capture groups
      const accelMatches = [...searchWindow.matchAll(pattern)];
      if (accelMatches.length > 0) {
        // Use the first match that has a number
        for (const match of accelMatches) {
          if (match[1] && !isNaN(parseFloat(match[1]))) {
            // Remove leading + sign from positive numbers
            let value = match[1].trim();
            if (value.startsWith("+")) {
              value = value.substring(1);
            }
            extracted["a"] = value;
            break;
          }
        }
        if (extracted["a"]) {
          break;
        }
      }
    }
  }

  // Extract time specifically with "for X seconds" or "after X seconds" or "over X seconds" pattern
  const timeVar = formulaConfig.variables.find((v) => v.key === "t");
  if (timeVar && !extracted["t"]) {
    const timePatterns = [
      /(?:for|after|over)\s+(?:a\s+)?(?:time\s+)?(?:interval\s+of\s+)?([+-]?\d+\.?\d*)\s+seconds?/gi,
      /(?:for|after|over)\s+([+-]?\d+\.?\d*)\s+seconds?/gi,
    ];

    for (const timePattern of timePatterns) {
      const timeMatch = normalizedText.match(timePattern);
      if (timeMatch) {
        // Get the last match (most likely to be the time we want)
        const lastMatch = timeMatch[timeMatch.length - 1];
        const numberMatch = lastMatch.match(/([+-]?\d+\.?\d*)/);
        if (numberMatch) {
          // Remove leading + sign from positive numbers
          let value = numberMatch[1].trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted["t"] = value;
          break;
        }
      }
    }
  }

  // Extract electricity variables specifically (before general number extraction)
  const voltageVar = formulaConfig.variables.find((v) => v.key === "voltage");
  if (voltageVar) {
    const voltagePatterns = [
      /voltage\s+of\s+([+-]?\d+\.?\d*)\s*V\s+across/gi,
      /voltage\s+of\s+([+-]?\d+\.?\d*)\s*V/gi,
      /voltage\s+applied\s+across.*?is\s+([+-]?\d+\.?\d*)\s*V/gi,
      /voltage\s+across\s+.*?is\s+([+-]?\d+\.?\d*)\s*V/gi,
      /voltage\s+across\s+the\s+.*?is\s+([+-]?\d+\.?\d*)\s*V/gi,
      /potential\s+difference\s+of\s+([+-]?\d+\.?\d*)\s*V/gi,
      /potential\s+difference\s+across\s+.*?is\s+([+-]?\d+\.?\d*)\s*V/gi,
      /([+-]?\d+\.?\d*)\s*V(?!\/)/gi, // V but not V/ (to avoid matching V/R)
    ];

    for (const pattern of voltagePatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        // Use the capture group directly if available, otherwise extract from full match
        let value = match[1] || match[0].match(/([+-]?\d+\.?\d*)/)?.[1];
        if (value) {
          value = value.trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted["voltage"] = value;
          break;
        }
      }
    }
  }

  const currentVar = formulaConfig.variables.find((v) => v.key === "current");
  if (currentVar) {
    const currentPatterns = [
      /([+-]?\d+\.?\d*)\s*A\s+of\s+current\s+passing\s+through/gi,
      /the\s+current\s+flowing\s+through.*?is\s+measured\s+to\s+be\s+([+-]?\d+\.?\d*)\s*A/gi,
      /current\s+flowing\s+through.*?is\s+measured\s+to\s+be\s+([+-]?\d+\.?\d*)\s*A/gi,
      /the\s+current\s+flowing\s+through.*?is\s+([+-]?\d+\.?\d*)\s*A/gi,
      /current\s+flowing\s+through.*?is\s+([+-]?\d+\.?\d*)\s*A/gi,
      /current\s+measured\s+through.*?is\s+([+-]?\d+\.?\d*)\s*A/gi,
      /the\s+current\s+measured\s+through.*?is\s+([+-]?\d+\.?\d*)\s*A/gi,
      /a\s+current\s+of\s+([+-]?\d+\.?\d*)\s*A\s+flows\s+through/gi,
      /current\s+of\s+([+-]?\d+\.?\d*)\s*A\s+flows\s+through/gi,
      /([+-]?\d+\.?\d*)\s*A\s+flows\s+through/gi,
      /current\s+of\s+([+-]?\d+\.?\d*)\s*A/gi,
      /current\s+.*?is\s+([+-]?\d+\.?\d*)\s*A/gi,
      /carrying\s+a\s+current\s+of\s+([+-]?\d+\.?\d*)\s*A/gi,
      /passing\s+through.*?current\s+of\s+([+-]?\d+\.?\d*)\s*A/gi,
      /flows\s+through.*?current\s+of\s+([+-]?\d+\.?\d*)\s*A/gi,
      /([+-]?\d+\.?\d*)\s*A(?!\/)/gi, // A but not A/ (to avoid matching A/s)
    ];

    for (const pattern of currentPatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        // Use the capture group directly if available, otherwise extract from full match
        let value = match[1] || match[0].match(/([+-]?\d+\.?\d*)/)?.[1];
        if (value) {
          value = value.trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted["current"] = value;
          break;
        }
      }
    }
  }

  const resistanceVar = formulaConfig.variables.find(
    (v) => v.key === "resistance"
  );
  if (resistanceVar) {
    const resistancePatterns = [
      /has\s+a\s+resistance\s+of\s+([+-]?\d+\.?\d*)\s*Ω/gi,
      /has\s+resistance\s+of\s+([+-]?\d+\.?\d*)\s*Ω/gi,
      /resistance\s+of\s+([+-]?\d+\.?\d*)\s*Ω/gi,
      /resistor\s+of\s+([+-]?\d+\.?\d*)\s*Ω/gi,
      /resistance\s+.*?is\s+([+-]?\d+\.?\d*)\s*Ω/gi,
      /([+-]?\d+\.?\d*)\s*Ω/gi,
      /([+-]?\d+\.?\d*)\s*ohms?/gi,
    ];

    for (const pattern of resistancePatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        // Use the capture group directly if available, otherwise extract from full match
        let value = match[1] || match[0].match(/([+-]?\d+\.?\d*)/)?.[1];
        if (value) {
          value = value.trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted["resistance"] = value;
          break;
        }
      }
    }
  }

  const powerVar = formulaConfig.variables.find((v) => v.key === "power");
  if (powerVar) {
    const powerPatterns = [
      /power\s+of\s+([+-]?\d+\.?\d*)\s*W/gi,
      /power\s+dissipated\s+(?:by|is)\s+([+-]?\d+\.?\d*)\s*W/gi,
      /power\s+.*?is\s+([+-]?\d+\.?\d*)\s*W/gi,
      /([+-]?\d+\.?\d*)\s*W(?!\/)/gi, // W but not W/ (to avoid matching W/s)
    ];

    for (const pattern of powerPatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        // Use the capture group directly if available, otherwise extract from full match
        let value = match[1] || match[0].match(/([+-]?\d+\.?\d*)/)?.[1];
        if (value) {
          value = value.trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted["power"] = value;
          break;
        }
      }
    }
  }

  // Extract mass - needed for normal force calculation in friction problems and for kinetic energy
  const massVar = formulaConfig.variables.find((v) => v.key === "mass");
  const needsMassForNormalForce =
    formulaConfig.variables.find((v) => v.key === "normal_force") &&
    !extracted["normal_force"];
  const needsMassForKineticEnergy =
    formulaConfig.variables.find((v) => v.key === "velocity") &&
    !extracted["mass"];

  if (massVar || needsMassForNormalForce || needsMassForKineticEnergy) {
    const massPatterns = [
      /mass\s+of\s+([+-]?\d+\.?\d*)\s*kg/gi,
      /object.*?mass\s+of\s+([+-]?\d+\.?\d*)\s*kg/gi,
      /([+-]?\d+\.?\d*)\s*kg\s+object/gi,
      /([+-]?\d+\.?\d*)\s*kg\s+box/gi,
      /([+-]?\d+\.?\d*)\s*kg\s+crate/gi,
      /([+-]?\d+\.?\d*)\s*kg\s+ball/gi,
      /([+-]?\d+\.?\d*)\s*kg(?!\/)/gi, // kg but not kg/ (to avoid matching kg/m)
    ];

    for (const pattern of massPatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        // Use the capture group directly if available, otherwise extract from full match
        let value = match[1] || match[0].match(/([+-]?\d+\.?\d*)/)?.[1];
        if (value) {
          value = value.trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted["mass"] = value;
          break;
        }
      }
    }
  }

  const muVar = formulaConfig.variables.find((v) => v.key === "mu");
  if (muVar) {
    const muPatterns = [
      /coefficient\s+of\s+(?:kinetic|static)\s+friction\s+of\s+([+-]?\d+\.?\d*)/gi,
      /coefficient\s+of\s+(?:kinetic|static)\s+friction.*?is\s+([+-]?\d+\.?\d*)/gi,
      /coefficient\s+of\s+friction\s+of\s+([+-]?\d+\.?\d*)/gi,
      /coefficient\s+of\s+friction.*?is\s+([+-]?\d+\.?\d*)/gi,
      /(?:kinetic|static)\s+friction.*?coefficient.*?is\s+([+-]?\d+\.?\d*)/gi,
      /friction.*?coefficient.*?is\s+([+-]?\d+\.?\d*)/gi,
      /coefficient\s+of\s+(?:kinetic|static)\s+friction\s+between.*?is\s+([+-]?\d+\.?\d*)/gi,
      /μ\s*=\s*([+-]?\d+\.?\d*)/gi,
      /mu\s*=\s*([+-]?\d+\.?\d*)/gi,
    ];

    for (const pattern of muPatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        // Use the capture group directly if available, otherwise extract from full match
        let value = match[1] || match[0].match(/([+-]?\d+\.?\d*)/)?.[1];
        if (value) {
          value = value.trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted["mu"] = value;
          break;
        }
      }
    }
  }

  const normalForceVar = formulaConfig.variables.find(
    (v) => v.key === "normal_force"
  );
  if (normalForceVar) {
    // If normal force is not given but mass is available, calculate it from N = mg
    // But we can't calculate here, so we'll extract if explicitly mentioned
    const normalForcePatterns = [
      /normal\s+force\s+of\s+([+-]?\d+\.?\d*)\s*N/gi,
      /normal\s+force.*?is\s+([+-]?\d+\.?\d*)\s*N/gi,
      /([+-]?\d+\.?\d*)\s*N\s+normal\s+force/gi,
    ];

    for (const pattern of normalForcePatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        // Use the capture group directly if available, otherwise extract from full match
        let value = match[1] || match[0].match(/([+-]?\d+\.?\d*)/)?.[1];
        if (value) {
          value = value.trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted["normal_force"] = value;
          break;
        }
      }
    }

    // If normal force not found but mass is available, calculate N = mg
    if (!extracted["normal_force"] && extracted["mass"]) {
      const massValue = parseFloat(extracted["mass"]);
      if (!isNaN(massValue)) {
        const normalForceValue = massValue * 9.8; // g = 9.8 m/s²
        extracted["normal_force"] = normalForceValue.toString();
      }
    }
  }

  // Extract force specifically for work problems
  const forceVar = formulaConfig.variables.find((v) => v.key === "force");
  if (forceVar) {
    const forcePatterns = [
      /force\s+of\s+([+-]?\d+\.?\d*)\s*N/gi,
      /pulls.*?force\s+of\s+([+-]?\d+\.?\d*)\s*N/gi,
      /applies.*?force\s+of\s+([+-]?\d+\.?\d*)\s*N/gi,
      /exerts.*?force\s+of\s+([+-]?\d+\.?\d*)\s*N/gi,
      /([+-]?\d+\.?\d*)\s*N(?!\/)/gi, // N but not N/ (to avoid matching N/m)
    ];

    for (const pattern of forcePatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        // Use the capture group directly if available, otherwise extract from full match
        let value = match[1] || match[0].match(/([+-]?\d+\.?\d*)/)?.[1];
        if (value) {
          value = value.trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted["force"] = value;
          break;
        }
      }
    }
  }

  // Extract distance specifically for work problems
  const distanceVar = formulaConfig.variables.find((v) => v.key === "distance");
  if (distanceVar) {
    const distancePatterns = [
      /distance\s+of\s+([+-]?\d+\.?\d*)\s*m/gi,
      /for\s+a\s+distance\s+of\s+([+-]?\d+\.?\d*)\s*m/gi,
      /distance\s+.*?is\s+([+-]?\d+\.?\d*)\s*m/gi,
      /([+-]?\d+\.?\d*)\s*m(?!\/|²|2)/gi, // m but not m/s, m/s², or m²
    ];

    for (const pattern of distancePatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        // Use the capture group directly if available, otherwise extract from full match
        let value = match[1] || match[0].match(/([+-]?\d+\.?\d*)/)?.[1];
        if (value) {
          value = value.trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted["distance"] = value;
          break;
        }
      }
    }
  }

  // Extract angle specifically for projectile motion
  const angleVar = formulaConfig.variables.find((v) => v.key === "angle");
  if (angleVar) {
    const anglePatterns = [
      // Prioritize patterns with "above" or "below" for better context
      /at\s+an\s+angle\s+of\s+([+-]?\d+\.?\d*)\s*°.*?(?:above|below)/gi,
      /at\s+angle\s+of\s+([+-]?\d+\.?\d*)\s*°.*?(?:above|below)/gi,
      /angle\s+of\s+([+-]?\d+\.?\d*)\s*°.*?(?:above|below)/gi,
      // Patterns without "above/below" but with "at an angle" - most common
      /at\s+an\s+angle\s+of\s+([+-]?\d+\.?\d*)\s*°/gi,
      /at\s+angle\s+of\s+([+-]?\d+\.?\d*)\s*°/gi,
      /angle\s+of\s+([+-]?\d+\.?\d*)\s*°/gi,
      // Patterns for "launched/fired/thrown at X°" - but only if it's clearly an angle
      /launched.*?at\s+an?\s+angle\s+of\s+([+-]?\d+\.?\d*)\s*°/gi,
      /fired.*?at\s+an?\s+angle\s+of\s+([+-]?\d+\.?\d*)\s*°/gi,
      /thrown.*?at\s+an?\s+angle\s+of\s+([+-]?\d+\.?\d*)\s*°/gi,
      // More flexible patterns
      /angle\s+.*?is\s+([+-]?\d+\.?\d*)\s*°/gi,
      // Fallback: any number with degree symbol (but be careful with context)
      // Only match if we're in a projectile context (has velocity or projectile keyword nearby)
      /([+-]?\d+\.?\d*)\s*°(?!\/)/gi, // ° but not °/ (to avoid matching °/s)
      /([+-]?\d+\.?\d*)\s*degrees?/gi,
    ];

    for (const pattern of anglePatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        // Use the capture group directly if available, otherwise extract from full match
        let value = match[1] || match[0].match(/([+-]?\d+\.?\d*)/)?.[1];
        if (value) {
          value = value.trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted["angle"] = value;
          break;
        }
      }
    }
  }

  // Extract velocity specifically for kinetic energy (speed/velocity with m/s)
  const velocityVar = formulaConfig.variables.find((v) => v.key === "velocity");
  if (velocityVar) {
    const velocityPatterns = [
      /speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      /velocity\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      /rolls\s+with\s+a\s+speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      /moves\s+with\s+a\s+speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      /travels\s+with\s+a\s+speed\s+of\s+([+-]?\d+\.?\d*)\s*m\/s/gi,
      /([+-]?\d+\.?\d*)\s*m\/s(?!²|2)/gi, // m/s but not m/s²
    ];

    for (const pattern of velocityPatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        // Use the capture group directly if available, otherwise extract from full match
        let value = match[1] || match[0].match(/([+-]?\d+\.?\d*)/)?.[1];
        if (value) {
          value = value.trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted["velocity"] = value;
          break;
        }
      }
    }
  }

  // Extract all numbers with context - improved regex to capture m/s² properly
  // Matches: m/s², m/s2, m/s, and other units
  // Note: [+-]? allows both positive and negative signs
  // Use normalizedText to handle Unicode minus signs
  const numberPattern =
    /([+-]?\d+\.?\d*)\s*(m\/s[²2]|m\/s|m|s|kg|N|V|A|W|Ω|°|degrees?|seconds?|meters?|kilograms?|newtons?|volts?|amperes?|watts?|ohms?)?/gi;
  const matches = [...normalizedText.matchAll(numberPattern)];

  // Note: usedNumberIndices is already defined earlier in the function

  // For each variable in the formula, try to find its value
  formulaConfig.variables.forEach((variable) => {
    const varName = variable.name.toLowerCase();
    const varLabel = variable.label.toLowerCase();
    const varKey = variable.key;

    // Look for the variable name near a number
    for (const match of matches) {
      // Preserve the original string to keep negative signs
      const numberString = match[1];
      const number = parseFloat(numberString);
      let unit = match[2]?.toLowerCase() || "";
      // Normalize units: replace superscripts and special characters
      unit = unit.replace(/²/g, "2").replace(/₀/g, "0");

      const matchIndex = match.index;
      // Get context before and after the number to better identify which variable it belongs to
      const contextStart = Math.max(0, matchIndex - 100);
      const contextEnd = Math.min(
        normalizedText.length,
        matchIndex + match[0].length + 100
      );
      // Keep original case for better matching of phrases like "initial velocity"
      const contextOriginal = normalizedText.substring(
        contextStart,
        contextEnd
      );
      const context = contextOriginal.toLowerCase();

      // Skip if this variable is already extracted (e.g., from specific patterns)
      // Also skip if this variable has specific extraction patterns defined above
      // (we've already tried those, so don't fall back to general matching)
      if (extracted[varKey]) {
        continue;
      }

      // Skip general matching for variables that have specific extraction patterns
      // These should only be extracted via their specific patterns, not general matching
      const hasSpecificPattern = [
        "u",
        "v",
        "t",
        "voltage",
        "current",
        "resistance",
        "power",
        "mass",
        "mu",
        "normal_force",
        "velocity",
        "force",
        "distance",
        "angle",
      ].includes(varKey);

      if (hasSpecificPattern) {
        continue; // Don't use general matching for these - rely on specific patterns only
      }

      // Check if variable name appears in context
      // For initial velocity, look for "initial velocity" or "traveling at" before the number
      const isInitialVelocity =
        varKey === "u" &&
        (context.includes("initial velocity") ||
          context.includes("initial speed") ||
          (context.includes("initial") &&
            (context.includes("velocity") || context.includes("speed"))) ||
          context.includes("launched at") ||
          context.includes("fired at") ||
          context.includes("thrown with") ||
          context.includes("thrown at") ||
          (context.includes("traveling at") && !context.includes("final")) ||
          context.includes("rest") ||
          context.includes("starts from"));

      // Check for final velocity - "to X m/s", "final velocity", "reach a velocity of", or "come to a stop"
      const isFinalVelocity =
        varKey === "v" &&
        (context.includes("final velocity") ||
          context.includes("final speed") ||
          context.includes("reach") ||
          context.includes("come to") ||
          context.includes("stop") ||
          context.includes("v =") ||
          context.includes("v=") ||
          (context.includes("reach") && context.includes("velocity")) ||
          (context.includes("to") &&
            (context.includes("m/s") || unit === "m/s") &&
            !context.includes("from")) ||
          (context.includes("increases") && context.includes("to")) ||
          (context.includes("decreases") && context.includes("to")));

      // Stricter context matching - require clear context AND unit for most variables
      // Only match if we have explicit context (variable name/keyword) AND the right unit
      const matchesContext =
        (varKey === "u" &&
          isInitialVelocity &&
          (unit === "m/s" || unit.includes("m/s"))) ||
        (varKey === "v" &&
          isFinalVelocity &&
          (unit === "m/s" || unit.includes("m/s"))) ||
        // For other variables, require both context AND unit match
        (varKey !== "u" &&
          varKey !== "v" &&
          varKey !== "voltage" &&
          varKey !== "current" &&
          varKey !== "resistance" &&
          varKey !== "power" &&
          varKey !== "mass" &&
          varKey !== "mu" &&
          varKey !== "normal_force" &&
          varKey !== "velocity" &&
          varKey !== "force" &&
          varKey !== "distance" &&
          varKey !== "angle" &&
          varKey !== "a" &&
          varKey !== "t" &&
          varKey !== "s" &&
          (context.includes(varName) || context.includes(varLabel)) &&
          unit &&
          unit.includes(normalizedVarUnit)) ||
        (varKey === "a" &&
          (context.includes("accelerat") ||
            context.includes("acceleration") ||
            context.includes("rate of") ||
            (context.includes("at") &&
              (context.includes("m/s") ||
                context.includes("forward") ||
                context.includes("backward")))) &&
          unit.includes("m/s") &&
          (unit.includes("2") || unit.includes("²"))) ||
        (varKey === "voltage" &&
          (context.includes("voltage") ||
            context.includes("voltage applied") ||
            context.includes("potential difference")) &&
          (unit === "v" || unit.includes("volt"))) ||
        (varKey === "current" &&
          (context.includes("current") ||
            context.includes("carrying") ||
            context.includes("flowing through") ||
            context.includes("measured through") ||
            context.includes("passing through") ||
            context.includes("flows through") ||
            context.includes("measured to be")) &&
          (unit === "a" || unit.includes("ampere") || unit.includes("amp"))) ||
        (varKey === "resistance" &&
          (context.includes("resistance") || context.includes("resistor")) &&
          (unit === "ω" || unit.includes("ohm"))) ||
        (varKey === "power" &&
          (context.includes("power") || context.includes("dissipated")) &&
          (unit === "w" || unit.includes("watt"))) ||
        (varKey === "mass" &&
          (context.includes("mass") ||
            context.includes("object") ||
            context.includes("box") ||
            context.includes("crate") ||
            context.includes("ball") ||
            unit === "kg" ||
            unit.includes("kilogram"))) ||
        (varKey === "velocity" &&
          (context.includes("speed") ||
            context.includes("velocity") ||
            context.includes("rolls with") ||
            context.includes("moves with") ||
            unit === "m/s" ||
            unit.includes("meter per second"))) ||
        (varKey === "force" &&
          (context.includes("force") ||
            context.includes("pulls") ||
            context.includes("applies") ||
            context.includes("exerts") ||
            unit === "n" ||
            unit.includes("newton"))) ||
        (varKey === "distance" &&
          (context.includes("distance") ||
            context.includes("for a distance") ||
            unit === "m" ||
            unit.includes("meter"))) ||
        (varKey === "angle" &&
          (context.includes("angle") ||
            context.includes("at an angle") ||
            context.includes("at angle") ||
            context.includes("thrown") ||
            context.includes("fired") ||
            context.includes("above") ||
            context.includes("below") ||
            unit === "°" ||
            unit.includes("degree"))) ||
        (varKey === "mu" &&
          (context.includes("coefficient") ||
            context.includes("friction") ||
            context.includes("μ") ||
            context.includes("mu"))) ||
        (varKey === "normal_force" &&
          (context.includes("normal force") ||
            context.includes("normal") ||
            unit === "n" ||
            unit.includes("newton"))) ||
        (varKey === "t" &&
          !extracted["t"] && // Don't match time if already extracted
          (unit === "s" || unit.includes("second") || unit.includes("sec")) &&
          (context.includes("for") ||
            context.includes("after") ||
            context.includes("over") ||
            context.includes("time") ||
            context.includes("interval") ||
            context.includes("duration"))) ||
        (varKey === "s" &&
          (context.includes("displacement") ||
            context.includes("distance") ||
            context.includes("traveled")) &&
          (unit === "m" || unit.includes("meter")));

      if (matchesContext) {
        // Normalize variable unit for comparison
        const normalizedVarUnit = variable.unit
          .toLowerCase()
          .replace(/²/g, "2")
          .replace(/₀/g, "0");

        // Check if unit matches (if provided)
        // For acceleration, also check if unit contains "m/s" and "2" or "²"
        // For time, check if unit is "s", "second", or "seconds"
        // Only match if unit is provided and matches, or if no unit is provided but context is very clear
        // Be more strict: require unit match for electricity variables
        // Require BOTH context match AND unit match (or very strong context for unitless)
        // This prevents matching random numbers that happen to be in the text
        const unitMatches =
          // For kinematics variables, allow unitless only with very strong context
          (!unit &&
            (varKey === "u" || varKey === "v" || varKey === "s") &&
            (isInitialVelocity ||
              isFinalVelocity ||
              context.includes("displacement") ||
              context.includes("distance traveled"))) ||
          // For variables with units, require unit match
          (unit && unit.includes(normalizedVarUnit)) ||
          (varKey === "a" &&
            normalizedVarUnit === "m/s2" &&
            unit.includes("m/s") &&
            (unit.includes("2") || unit.includes("²"))) ||
          (varKey === "t" &&
            normalizedVarUnit === "s" &&
            (unit === "s" ||
              unit.includes("second") ||
              unit.includes("sec"))) ||
          // For electricity variables, require unit match
          ((varKey === "voltage" ||
            varKey === "current" ||
            varKey === "resistance" ||
            varKey === "power") &&
            unit &&
            unit.includes(normalizedVarUnit)) ||
          // For other variables with units, require unit match
          ((varKey === "force" ||
            varKey === "distance" ||
            varKey === "angle" ||
            varKey === "mass" ||
            varKey === "velocity") &&
            unit &&
            unit.includes(normalizedVarUnit));

        // Only extract if we have BOTH context match AND unit match
        // Additional check: for variables that should have units, don't match if unit is missing
        const requiresUnit = [
          "voltage",
          "current",
          "resistance",
          "power",
          "force",
          "distance",
          "angle",
          "mass",
          "velocity",
          "a",
        ];
        if (requiresUnit.includes(varKey) && !unit) {
          continue; // Skip if unit is required but missing
        }

        if (unitMatches && matchesContext) {
          // Use the original string, but remove leading + sign from positive numbers
          let value = numberString.trim();
          if (value.startsWith("+")) {
            value = value.substring(1);
          }
          extracted[varKey] = value;
          usedNumberIndices.add(matchIndex);
          break;
        }
      }
    }

    // Special handling for initial velocity (if not already extracted)
    if (varKey === "u" && !extracted[varKey]) {
      // "starts from rest" = initial velocity = 0
      if (
        lowerText.includes("rest") &&
        (lowerText.includes("starts") || lowerText.includes("from rest"))
      ) {
        extracted[varKey] = "0";
      }
    }

    // Special handling for acceleration - only if mentioned and not extracted, use strict patterns
    if (
      varKey === "a" &&
      !extracted[varKey] &&
      lowerText.includes("accelerat")
    ) {
      // Only use strict patterns that require acceleration keyword and unit
      const accelPatterns = [
        /accelerat[^+-]*([+-]?\d+\.?\d*)\s*(?:m\/s[²2]|m\/s)/gi,
        /(?:accelerat|acceleration).*?(?:at|of)\s+([+-]?\d+\.?\d*)\s*(?:m\/s[²2]|m\/s)/gi,
      ];

      for (const pattern of accelPatterns) {
        const accelMatch = normalizedText.match(pattern);
        if (accelMatch) {
          // Find the match closest to "accelerat"
          const accelIndex = lowerText.indexOf("accelerat");
          let bestMatch = null;
          let bestDistance = Infinity;

          for (const match of accelMatch) {
            const matchIndex = normalizedText.toLowerCase().indexOf(match);
            if (matchIndex !== -1 && matchIndex >= accelIndex - 50) {
              const distance = Math.abs(matchIndex - accelIndex);
              if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = match;
              }
            }
          }

          if (bestMatch) {
            const numberMatch = bestMatch.match(/([+-]?\d+\.?\d*)/);
            if (numberMatch) {
              // Remove leading + sign from positive numbers
              let value = numberMatch[1].trim();
              if (value.startsWith("+")) {
                value = value.substring(1);
              }
              extracted[varKey] = value;
              break;
            }
          }
        }
      }
      // If still not found, leave empty - don't use overly broad patterns
    }

    // Special handling for time - only use strict patterns with context words
    if (varKey === "t" && !extracted[varKey]) {
      // Only match time when there's clear context like "for X seconds" or "after X seconds"
      // Don't use overly broad pattern that matches any number with "seconds"
      const timePatterns = [
        /(?:for|after|over)\s+(?:a\s+)?(?:time\s+)?(?:interval\s+of\s+)?([+-]?\d+\.?\d*)\s+seconds?/gi,
      ];

      for (const pattern of timePatterns) {
        const timeMatch = problemText.match(pattern);
        if (timeMatch) {
          // Get the last match (most likely to be the time we want)
          const lastMatch = timeMatch[timeMatch.length - 1];
          const numberMatch = lastMatch.match(/([+-]?\d+\.?\d*)/);
          if (numberMatch) {
            // Remove leading + sign from positive numbers
            let value = numberMatch[1].trim();
            if (value.startsWith("+")) {
              value = value.substring(1);
            }
            extracted[varKey] = value;
            // Mark the number as used (find its index in matches)
            for (let i = 0; i < matches.length; i++) {
              const match = matches[i];
              if (match[1] === value || match[1] === `+${value}`) {
                usedNumberIndices.add(match.index);
                break;
              }
            }
            break;
          }
        }
      }
      // If still not found, leave empty - don't use overly broad patterns
    }
  });

  // Second pass: For variables that weren't extracted, try to match with remaining numbers
  // Track which numbers have been used
  const usedNumbers = new Set();
  formulaConfig.variables.forEach((variable) => {
    if (extracted[variable.key]) {
      // Find the extracted value in the text to mark it as used
      const value = extracted[variable.key];
      const valuePattern = new RegExp(
        `\\b${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "gi"
      );
      const matches = normalizedText.matchAll(valuePattern);
      for (const match of matches) {
        usedNumbers.add(match.index);
      }
    }
  });

  // For variables still not extracted, try matching with remaining numbers
  formulaConfig.variables.forEach((variable) => {
    const varKey = variable.key;
    const varName = variable.name.toLowerCase();
    const varLabel = variable.label.toLowerCase();
    const normalizedVarUnit = variable.unit
      .toLowerCase()
      .replace(/²/g, "2")
      .replace(/₀/g, "0");

    // Skip if already extracted
    if (extracted[varKey]) {
      return;
    }

    // Try to find remaining numbers with matching unit and some context
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      // Skip if this number was already used
      if (usedNumberIndices.has(match.index)) {
        continue;
      }

      const numberString = match[1];
      let unit = match[2]?.toLowerCase() || "";
      unit = unit.replace(/²/g, "2").replace(/₀/g, "0");

      const matchIndex = match.index;
      const contextStart = Math.max(0, matchIndex - 50);
      const contextEnd = Math.min(
        normalizedText.length,
        matchIndex + match[0].length + 50
      );
      const context = normalizedText
        .substring(contextStart, contextEnd)
        .toLowerCase();

      // Check if unit matches
      const unitMatches =
        (unit && unit.includes(normalizedVarUnit)) ||
        (varKey === "a" &&
          normalizedVarUnit === "m/s2" &&
          unit.includes("m/s") &&
          (unit.includes("2") || unit.includes("²"))) ||
        (varKey === "t" &&
          normalizedVarUnit === "s" &&
          (unit === "s" || unit.includes("second") || unit.includes("sec")));

      // Check if there's some context match (more lenient than first pass)
      const hasContext =
        context.includes(varName) ||
        context.includes(varLabel) ||
        (varKey === "u" &&
          (context.includes("initial") ||
            context.includes("speed") ||
            context.includes("velocity"))) ||
        (varKey === "v" &&
          (context.includes("final") ||
            context.includes("speed") ||
            context.includes("velocity"))) ||
        (varKey === "a" && context.includes("accelerat")) ||
        (varKey === "t" &&
          (context.includes("second") ||
            context.includes("time") ||
            context.includes("for") ||
            context.includes("after"))) ||
        (varKey === "s" &&
          (context.includes("distance") || context.includes("displacement"))) ||
        (varKey === "angle" &&
          (context.includes("angle") ||
            context.includes("degree") ||
            unit === "°")) ||
        (varKey === "force" && (context.includes("force") || unit === "n")) ||
        (varKey === "distance" &&
          (context.includes("distance") || unit === "m")) ||
        (varKey === "mass" &&
          (context.includes("mass") ||
            context.includes("kg") ||
            unit === "kg")) ||
        (varKey === "velocity" &&
          (context.includes("speed") ||
            context.includes("velocity") ||
            unit === "m/s")) ||
        (varKey === "voltage" &&
          (context.includes("voltage") || unit === "v")) ||
        (varKey === "current" &&
          (context.includes("current") || unit === "a")) ||
        (varKey === "resistance" &&
          (context.includes("resistance") ||
            unit === "ω" ||
            unit.includes("ohm"))) ||
        (varKey === "power" && (context.includes("power") || unit === "w"));

      // Only match if unit matches and we have some context
      // This is a fallback, so be more lenient but still require unit match
      if (unitMatches && hasContext) {
        const requiresUnit = [
          "voltage",
          "current",
          "resistance",
          "power",
          "force",
          "distance",
          "angle",
          "mass",
          "velocity",
          "a",
        ];
        if (requiresUnit.includes(varKey) && !unit) {
          continue; // Skip if unit is required but missing
        }

        let value = numberString.trim();
        if (value.startsWith("+")) {
          value = value.substring(1);
        }
        extracted[varKey] = value;
        usedNumberIndices.add(matchIndex);
        break; // Only use one number per variable
      }
    }
  });

  return extracted;
}

/**
 * Main function to parse a physics problem using rule-based parsing
 */
export async function parsePhysicsProblem(
  problemText,
  currentFormulaId = null
) {
  if (!problemText || problemText.trim().length === 0) {
    return { error: "Please enter a physics problem" };
  }

  const result = parseWithRules(problemText);

  // If no formula identified and we have a current formula, use it as fallback
  if (result.error && currentFormulaId) {
    // Try to extract values with the current formula
    const formulaConfig = FORMULAS[currentFormulaId];
    if (formulaConfig) {
      const values = extractVariables(problemText, formulaConfig);
      return {
        formulaId: currentFormulaId,
        values,
      };
    }
  }

  return result;
}

/**
 * Rule-based parsing
 */
function parseWithRules(problemText) {
  // Identify which formula to use
  const formulaId = identifyFormula(problemText);

  // If no formula identified, return error
  if (!formulaId) {
    return { error: "Could not identify a suitable formula for this problem" };
  }

  // Trim and normalize the formulaId to handle any whitespace issues
  const normalizedFormulaId = String(formulaId).trim();

  const formulaConfig = FORMULAS[normalizedFormulaId];

  if (!formulaConfig) {
    return {
      error:
        "Could not identify a suitable formula for this problem. Please try rephrasing.",
    };
  }

  // Extract variable values
  const values = extractVariables(problemText, formulaConfig);

  return {
    formulaId: normalizedFormulaId,
    values,
  };
}
