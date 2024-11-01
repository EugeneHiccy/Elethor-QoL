// ==UserScript==
// @name         Elethor Recyclobot Calculator
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Calculate platinum production and gold profit with a UI
// @author       Eugene
// @match        https://elethor.com/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL  https://raw.github.com/EugeneHiccy/Elethor-QoL/main/Elethor%20Recyclobot%20Calculator-0.8.user.js
// @updateURL    https://raw.github.com/EugeneHiccy/Elethor-QoL/main/Elethor%20Recyclobot%20Calculator-0.8.user.js
// ==/UserScript==
/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
(function() {
    'use strict';

    // Define the target URL for the calculator to display
    const TARGET_URL = 'https://elethor.com/character/companion/recyclobot';

    // Create a button to open the calculator
    const button = document.createElement('button');
    button.innerText = 'Open Recyclobot Calculator';
    button.style.padding = '10px';
    button.style.backgroundColor = '#18743c'; // Button color
    button.style.color = '#dee5ed'; // Text color
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.position = 'absolute'; // Use absolute positioning for precise placement
    button.style.zIndex = '9999'; // Ensure the button appears on top
    button.style.display = 'none'; // Initially hidden

    // Function to position the button
    function positionButton() {
        const referenceElement = document.querySelector('.button.is-info.is-multiline.w-full'); // Target button
        if (referenceElement) {
            const rect = referenceElement.getBoundingClientRect();
            button.style.top = `${rect.top + window.scrollY - button.offsetHeight - 50}px`; // Move button above the reference element (50px margin)
            button.style.left = `${rect.left + window.scrollX - button.offsetWidth - 10}px`; // Position to the left with a margin
            document.body.appendChild(button); // Append button to the body
        }
    }

    // Create a MutationObserver to detect changes in the DOM
    const observer = new MutationObserver((mutations) => {
        // Check if the target element is in the DOM
        const referenceElement = document.querySelector('.button.is-info.is-multiline.w-full');
        if (referenceElement) {
            positionButton(); // Position the button
            observer.disconnect(); // Stop observing once the button is placed
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Create the calculator UI
    const calculatorContainer = document.createElement('div');
    calculatorContainer.style.display = 'none'; // Initially hidden
    calculatorContainer.style.position = 'fixed';
    calculatorContainer.style.border = '2px solid #505c6c'; // Border around calculator
    calculatorContainer.style.borderRadius = '10px';
    calculatorContainer.style.backgroundColor = '#202c3c'; // Background color
    calculatorContainer.style.zIndex = '1001';
    calculatorContainer.style.padding = '20px';

    // Function to position the calculator below the "Prospector" element
    function positionCalculator() {
        const prospectorElement = document.querySelector('a[href="/character/companion/prospector"]');
        if (prospectorElement) {
            const rect = prospectorElement.getBoundingClientRect();
            calculatorContainer.style.top = `${rect.bottom + window.scrollY - 230 + 10}px`; // 250px up from the bottom of the Prospector element + 10px margin
            calculatorContainer.style.left = `${rect.left + window.scrollX}px`; // Align horizontally with the Prospector element
        }
    }

    // Set the initial position of the calculator
    positionCalculator();
    document.body.appendChild(calculatorContainer);

    // Add form elements to the calculator
    calculatorContainer.innerHTML = `
        <h3 style="color: #dee5ed;">Elethor Recyclobot Calculator</h3>
        <p style="color: #dee5ed; font-size: 0.9em;">Made by <a href="https://elethor.com/profile/49979" target="_blank" style="color: #6cb4e4; text-decoration: underline;">Eugene</a></p>
        <div style="margin-bottom: 5px;">
            <label style="color: #dee5ed;">Bonus Platinum Level:</label>
            <input type="number" id="bonusPlatinumLevel" required style="border: 1px solid #dee5ed; border-radius: 5px; padding: 5px; width: 100px; margin-right: 10px; color: black;">
        </div>
        <div style="margin-bottom: 5px;">
            <label style="color: #dee5ed;">Exchange Rate Level:</label>
            <input type="number" id="exchangeRateLevel" required style="border: 1px solid #dee5ed; border-radius: 5px; padding: 5px; width: 100px; margin-right: 10px; color: black;">
        </div>
        <div style="margin-bottom: 5px;">
            <label style="color: #dee5ed;">Gold cost per curved blade:</label>
            <input type="number" step="0.01" id="curvedBladeGoldCost" required style="border: 1px solid #dee5ed; border-radius: 5px; padding: 5px; width: 100px; margin-right: 10px; color: black;">
        </div>
        <div style="margin-bottom: 5px;">
            <label style="color: #dee5ed;">Gold value per platinum (in millions):</label>
            <input type="number" step="0.01" id="goldPerPlatinum" required style="border: 1px solid #dee5ed; border-radius: 5px; padding: 5px; width: 100px; margin-right: 10px; color: black;">
        </div>

        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button id="calculateBtn" style="background-color: #18743c; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Calculate</button>
            <button id="resetBtn" style="background-color: #2596be; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🔄 Reset</button>
            <button id="closeBtn" style="background-color: #a02424; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">X Close</button>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button id="copyInputBtn" style="background-color: #ea951f; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📋 Copy Input</button>
            <button id="copyOutputBtn" style="background-color: #ea951f; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📋 Copy Output</button>
        </div>
        <div id="results" style="margin-top: 20px;"></div>
    `;

    // Show/hide calculator on button click
    button.addEventListener('click', () => {
        // Toggle the visibility of the calculator
        if (calculatorContainer.style.display === 'none') {
            calculatorContainer.style.display = 'block';
            positionCalculator(); // Ensure it is positioned correctly when opened
            loadInputs(); // Load saved inputs when opening
        } else {
            calculatorContainer.style.display = 'none';
        }
    });

    // Close button
    calculatorContainer.querySelector('#closeBtn').addEventListener('click', () => {
        calculatorContainer.style.display = 'none';
    });

    // Reset button functionality
    calculatorContainer.querySelector('#resetBtn').addEventListener('click', () => {
        document.querySelector('#bonusPlatinumLevel').value = '';
        document.querySelector('#exchangeRateLevel').value = '';
        document.querySelector('#curvedBladeGoldCost').value = '';
        document.querySelector('#goldPerPlatinum').value = '';
        clearInputs(); // Clear localStorage
        document.getElementById('results').innerHTML = ''; // Clear results
    });

    // Copy Output button functionality
    calculatorContainer.querySelector('#copyOutputBtn').addEventListener('click', () => {
        const resultsText = document.getElementById('results').innerText;
        navigator.clipboard.writeText(resultsText)
        .then(() => {
            // You can log to console instead of showing an alert
            console.log('Output copied to clipboard!');
        })
        .catch(err => console.error('Failed to copy: ', err));
});

// Copy Input button functionality
calculatorContainer.querySelector('#copyInputBtn').addEventListener('click', () => {
    const bonusPlatinumLevel = document.querySelector('#bonusPlatinumLevel').value;
    const exchangeRateLevel = document.querySelector('#exchangeRateLevel').value;
    const curvedBladeGoldCost = document.querySelector('#curvedBladeGoldCost').value;
    const goldPerPlatinum = document.querySelector('#goldPerPlatinum').value;

    const inputText = `
        Bonus Platinum Level: ${bonusPlatinumLevel}
        Exchange Rate Level: ${exchangeRateLevel}
        Gold cost per curved blade: ${curvedBladeGoldCost}
        Gold value per platinum (in millions): ${goldPerPlatinum}
    `;

    navigator.clipboard.writeText(inputText.trim())
        .then(() => {
            // You can log to console instead of showing an alert
            console.log('Input values copied to clipboard!');
        })
        .catch(err => console.error('Failed to copy: ', err));
});

// Calculate button functionality
calculatorContainer.querySelector('#calculateBtn').addEventListener('click', () => {
    const bonusPlatinumLevel = parseFloat(document.querySelector('#bonusPlatinumLevel').value);
    const exchangeRateLevel = parseFloat(document.querySelector('#exchangeRateLevel').value);
    const curvedBladeGoldCost = parseFloat(document.querySelector('#curvedBladeGoldCost').value);
    const goldPerPlatinum = parseFloat(document.querySelector('#goldPerPlatinum').value);

    // Validation: Check for positive values
    if (
        isNaN(bonusPlatinumLevel) || bonusPlatinumLevel < 0 ||
        isNaN(exchangeRateLevel) || exchangeRateLevel < 0 ||
        isNaN(curvedBladeGoldCost) || curvedBladeGoldCost < 0 ||
        isNaN(goldPerPlatinum) || goldPerPlatinum < 0
    ) {
        alert('Please enter positive values for all fields.');
        return; // Exit the function if validation fails
    }

    saveInputs(bonusPlatinumLevel, exchangeRateLevel, curvedBladeGoldCost, goldPerPlatinum);

    const CURVED_BLADES_PER_RECYCLE = 200;
    const BASE_PLATINUM_POINTS = 1080;
    const BASE_PLATINUM_COST = 10000;
    const MAX_COST_INCREASE_PLATINUM = 20;
    const PLATINUM_GOLD_COST = 250000;
    const BONUS_PLATINUM_INCREMENT = 0.002;

    const exchangeRateMultiplier = 1 + (exchangeRateLevel * 0.01);
    const bonusPlatinumMultiplier = 1 + (bonusPlatinumLevel * BONUS_PLATINUM_INCREMENT);
    const platinumPointsPerRecycle = Math.floor(BASE_PLATINUM_POINTS * exchangeRateMultiplier);
    let currentPlatinumCost = BASE_PLATINUM_COST;
    let platinumCount = 0;
    let totalGoldProfit = 0;
    let totalGoldSpent = 0;
    let totalCurvedBladesUsed = 0; // New variable to track total curved blades used

    while (true) {
        const platinumPointsNeeded = currentPlatinumCost;
        const requiredRecycles = Math.ceil(platinumPointsNeeded / platinumPointsPerRecycle);
        const requiredCurvedBlades = requiredRecycles * CURVED_BLADES_PER_RECYCLE;
        totalCurvedBladesUsed += requiredCurvedBlades; // Update total curved blades used
        const curvedBladesGoldCostTotal = requiredCurvedBlades * curvedBladeGoldCost;
        const totalGoldCost = PLATINUM_GOLD_COST + curvedBladesGoldCostTotal;
        const totalPlatinum = 1 * bonusPlatinumMultiplier;
        const goldGainedFromPlatinum = totalPlatinum * goldPerPlatinum * 1_000_000;
        const profit = goldGainedFromPlatinum - totalGoldCost;

        if (profit <= 0) {
            break;
        }

        totalGoldProfit += profit;
        totalGoldSpent += totalGoldCost;
        platinumCount++;

        if (platinumCount < MAX_COST_INCREASE_PLATINUM) {
            currentPlatinumCost += 1000;
        } else {
            currentPlatinumCost += 500;
        }
    }

    // Display results
    document.getElementById('results').innerHTML = `
        <p style="color: #dee5ed;">Platinum to produce: ${platinumCount}</p>
        <p style="color: #dee5ed;">Total Gold Profit: ${formatToBillions(totalGoldProfit)}</p>
        <p style="color: #dee5ed;">Maximum Bonus Platinum: ${(platinumCount * bonusPlatinumMultiplier).toFixed(2)}</p>
        <p style="color: #dee5ed;">Total Curved Blades Used: ${totalCurvedBladesUsed}</p> <!-- New output -->
    `;
});

    // Function to format value to billions
    function formatToBillions(value) {
        let billions = value / 1_000_000_000;
        return billions.toFixed(2) + " billion";
    }

    // Save inputs to localStorage
    function saveInputs(bonusPlatinumLevel, exchangeRateLevel, curvedBladeGoldCost, goldPerPlatinum) {
        localStorage.setItem('bonusPlatinumLevel', bonusPlatinumLevel);
        localStorage.setItem('exchangeRateLevel', exchangeRateLevel);
        localStorage.setItem('curvedBladeGoldCost', curvedBladeGoldCost);
        localStorage.setItem('goldPerPlatinum', goldPerPlatinum);
    }

    // Load inputs from localStorage
    function loadInputs() {
        document.querySelector('#bonusPlatinumLevel').value = localStorage.getItem('bonusPlatinumLevel') || '';
        document.querySelector('#exchangeRateLevel').value = localStorage.getItem('exchangeRateLevel') || '';
        document.querySelector('#curvedBladeGoldCost').value = localStorage.getItem('curvedBladeGoldCost') || '';
        document.querySelector('#goldPerPlatinum').value = localStorage.getItem('goldPerPlatinum') || '';
    }

    // Clear inputs from localStorage
    function clearInputs() {
        localStorage.removeItem('bonusPlatinumLevel');
        localStorage.removeItem('exchangeRateLevel');
        localStorage.removeItem('curvedBladeGoldCost');
        localStorage.removeItem('goldPerPlatinum');
    }

    // URL check function to show button and calculator only on the correct page
    function checkURL() {
        if (window.location.href === TARGET_URL) {
            button.style.display = 'block';
            if (calculatorContainer.style.display !== 'none') {
                positionCalculator();
            }
        } else {
            button.style.display = 'none';
            calculatorContainer.style.display = 'none';
        }
    }

    // Check URL initially and set interval for changes
    checkURL();
    setInterval(checkURL, 500); // Check URL every 500 milliseconds

})();
