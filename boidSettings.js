class BoidSettings {
    static maxVel;
    static maxAcc;
    static accMultiplier;
    static instantAcc;

    static perceptionRadius;
    static perceptionAngle;

    static seperationMultiplier;

    static separationWeight;
    static alignmentWeight;
    static cohesionWeight;

    static drawMode; // true: triangle, false: circle

    static historyLength;
    static drawHistory;

    static obstacleStrength;

    static avoidWalls; // false: wrap
    static wallMargin;
    static wallTurnStrength;

    static numBoids;

    static species; // true: group by species (and color by species)
    static NUM_SPECIES = 5;
}