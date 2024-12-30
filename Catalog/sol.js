const fs = require('fs');

function convertBaseToDecimal(base, valueString) {
    return parseInt(valueString, base);
}

function computeConstantTerm(dataPoints) {
    let constantValue = 0;

    for (let i = 0; i < dataPoints.length; i++) {
        let currentX = dataPoints[i].x;
        let currentY = dataPoints[i].y;
        let termProduct = currentY;

        for (let j = 0; j < dataPoints.length; j++) {
            if (i !== j) {
                let otherX = dataPoints[j].x;
                termProduct *= otherX / (otherX - currentX);
            }
        }

        constantValue += termProduct;
    }

    return Math.round(constantValue);
}

function retrieveSecretFromJSON(filePath) {
    const jsonContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const totalPoints = jsonContent.keys.n;
    const requiredPoints = jsonContent.keys.k;

    if (totalPoints < requiredPoints) {
        throw new Error("Not enough points to determine the polynomial.");
    }

    const pointList = [];
    for (const identifier in jsonContent) {
        if (identifier === "keys") continue;
        const xCoordinate = parseInt(identifier);
        const baseValue = parseInt(jsonContent[identifier].base);
        const yCoordinate = convertBaseToDecimal(baseValue, jsonContent[identifier].value);
        pointList.push({ x: xCoordinate, y: yCoordinate });
    }

    pointList.sort((a, b) => a.x - b.x);
    const selectedDataPoints = pointList.slice(0, requiredPoints);
    return computeConstantTerm(selectedDataPoints);
}

try {
    const secretValueA = retrieveSecretFromJSON('testcase1.json');
    console.log("Secret constant (c) for testcase1.json:", secretValueA);

    const secretValueB = retrieveSecretFromJSON('testcase2.json');
    console.log("Secret constant (c) for testcase2.json:", secretValueB);
} catch (error) {
    console.error("Error:", error.message);
}
