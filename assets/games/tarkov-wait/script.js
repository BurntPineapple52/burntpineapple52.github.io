// script.js
function calculateWaitTimes() {
    validateInputs();
    const gameMode = document.getElementById("gameMode").value;
    const numMatches = parseInt(document.getElementById("numMatches").value);

    const waitTimes = {
        "PMC": {min: 2.5, max: 5},
        "Scav": {min: 2.5, max: 10},
    };

    // Math formulas as hover titles
    const optimisticFormula = `Min time + 0.25 * (Max time - Min time) = ${waitTimes[gameMode].min} + 0.25 * (${waitTimes[gameMode].max} - ${waitTimes[gameMode].min})`;
    const pessimisticFormula = `Max time - 0.25 * (Max time - Min time) = ${waitTimes[gameMode].max} - 0.25 * (${waitTimes[gameMode].max} - ${waitTimes[gameMode].min})`;


    // Estimate when most matches are quick
    const optimisticEstimateMinutes = waitTimes[gameMode].min * numMatches + (waitTimes[gameMode].max - waitTimes[gameMode].min) * 0.25 * numMatches;
    // Estimate when most matches take longer
    const pessimisticEstimateMinutes = waitTimes[gameMode].max * numMatches - (waitTimes[gameMode].max - waitTimes[gameMode].min) * 0.25 * numMatches;

    // Additional calculations for fastest and slowest possible matches
    const fastestPossibleMinutes = waitTimes[gameMode].min * numMatches;
    const slowestPossibleMinutes = waitTimes[gameMode].max * numMatches;

    // Convert minutes to hours
    const optimisticEstimateHours = optimisticEstimateMinutes / 60;
    const pessimisticEstimateHours = pessimisticEstimateMinutes / 60;
    const fastestPossibleHours = fastestPossibleMinutes / 60;
    const slowestPossibleHours = slowestPossibleMinutes / 60;

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <div class="result">
            <div>Fastest Possible Wait:</div>
            <div>${fastestPossibleMinutes.toFixed(1)} min  (${fastestPossibleHours.toFixed(1)} hrs)</div>
        </div>
        <div class="result">
            <div>If Matching Took Less Time:</div>
            <div>${optimisticEstimateMinutes.toFixed(1)} min  (${optimisticEstimateHours.toFixed(1)} hrs)</div>
        </div>
        <div class="result">
            <div>If Matching Took More Time:</div>
            <div>${pessimisticEstimateMinutes.toFixed(1)} min  (${pessimisticEstimateHours.toFixed(1)} hrs)</div>
        </div>
        <div class="result">
            <div>Slowest Possible Wait:</div>
            <div>${slowestPossibleMinutes.toFixed(1)} min  (${slowestPossibleHours.toFixed(1)} hrs)</div>
        </div>
    `;

    applyDynamicStyling(resultsDiv);
}

function validateInputs() {
    const numMatchesInput = document.getElementById("numMatches");
    const numMatches = parseInt(numMatchesInput.value);
    if (isNaN(numMatches) || numMatches < 1) {
        numMatchesInput.value = '1';
        alert('Please enter a valid number of matches.');
    }
}

function applyDynamicStyling(resultsDiv) {
    // Apply dynamic styling to resultsDiv for better readability
    resultsDiv.style.backgroundColor = '#2a2a2a'; // darker background
    resultsDiv.style.padding = '10px';
    resultsDiv.style.borderRadius = '5px';
    resultsDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    
    // Style each result paragraph
    let paragraphs = resultsDiv.querySelectorAll('p');
    paragraphs.forEach(p => {
        p.style.margin = '10px 0';
        p.style.padding = '5px';
        p.style.borderLeft = '3px solid green'; // Aesthetic touch
    });
}

