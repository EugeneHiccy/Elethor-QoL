// ==UserScript==
// @name         Elethor Chameleon
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       Eugene
// @description  Change colors on Elethor.com
// @match        *://elethor.com/*
// @grant        GM_addStyle
// @license      GPL-3.0-or-later
// @downloadURL  https://raw.github.com/EugeneHiccy/Elethor-QoL/main/Elethor%20Chameleon-1.0.user.js
// @updateURL    https://raw.github.com/EugeneHiccy/Elethor-QoL/main/Elethor%20Chameleon-1.0.meta.js
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

    // Default colors
    const defaultBackgroundColor = '#202c3c';
    const defaultActionBarColor = '#40444c';
    const defaultTopBarColor = '#505c6c';
    const defaultTextColor = '#ffffff';

    // Function to set colors from localStorage or use defaults
    function setColors() {
        const appElement = document.querySelector('#app[data-v-app]');
        if (appElement) {
            const backgroundColor = localStorage.getItem('backgroundColor') || defaultBackgroundColor;
            appElement.style.backgroundColor = backgroundColor;
            backgroundColorInput.value = backgroundColor;
        }

        const actionBarElement = document.querySelector('#currentAction.shadow.shadow-slate-800');
        if (actionBarElement) {
            const actionBarColor = localStorage.getItem('actionBarColor') || defaultActionBarColor;
            actionBarElement.style.backgroundColor = actionBarColor;
            actionBarColorInput.value = actionBarColor;
        }

        const topBarElement = document.querySelector('nav.navbar.is-fixed-top.is-primary.shadow-sm.shadow-slate-800\\/50');
        if (topBarElement) {
            const topBarColor = localStorage.getItem('topBarColor') || defaultTopBarColor;
            topBarElement.style.backgroundColor = topBarColor;
            topBarColorInput.value = topBarColor;
        }

        const textColor = localStorage.getItem('textColor') || defaultTextColor;
        document.body.style.color = textColor;
        textColorInput.value = textColor;
        applyTextColorToAll(textColor);
    }

    // Function to apply text color to all relevant elements
    function applyTextColorToAll(color) {
        const elementsToColor = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'a'
        ];
        elementsToColor.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.style.color = color);
        });
    }

    // Function to wait for elements to load
    function waitForElements() {
        const interval = setInterval(() => {
            const appElement = document.querySelector('#app[data-v-app]');
            const actionBarElement = document.querySelector('#currentAction.shadow.shadow-slate-800');
            const topBarElement = document.querySelector('nav.navbar.is-fixed-top.is-primary.shadow-sm.shadow-slate-800\\/50');

            if (appElement && actionBarElement && topBarElement) {
                clearInterval(interval);
                setColors();
                addOpenButton();
                positionUI();
                // Start reapplying colors every 2 seconds
                setInterval(setColors, 10000); // Reapply colors every 2 seconds
            }
        }, 500);
    }

// Function to add the Open button next to the specified link
function addOpenButton() {
    const navbarItem = document.querySelector('a[href="/corporation"].navbar-item.is-skewed');
    if (navbarItem) {
        const openButton = document.createElement('button');
        openButton.innerHTML = '🎨'; // Color palette symbol
        openButton.style.marginLeft = '10px';
        const topBarElement = document.querySelector('nav.navbar.is-fixed-top.is-primary.shadow-sm.shadow-slate-800\\/50');
        const topBarColor = topBarElement ? topBarElement.style.backgroundColor : '#2596be'; // Fallback color
        openButton.style.backgroundColor = topBarColor; // Match button color to top bar color
        openButton.style.color = '#fff';
        openButton.style.border = 'none';
        openButton.style.padding = '5px';
        openButton.style.borderRadius = '3px';
        openButton.style.cursor = 'pointer';

        // Add click event to open the color changer UI
        openButton.addEventListener('click', () => {
            uiContainer.style.display = uiContainer.style.display === 'none' ? 'flex' : 'none';
            positionUI(); // Ensure UI is positioned correctly
        });

        navbarItem.parentNode.insertBefore(openButton, navbarItem.nextSibling);
    }
}

    // Function to position the UI
    function positionUI() {
        const topBarElement = document.querySelector('nav.navbar.is-fixed-top.is-primary.shadow-sm.shadow-slate-800\\/50');
        if (topBarElement) {
            const { height } = topBarElement.getBoundingClientRect();
            uiContainer.style.top = `${height}px`; // Set UI below the navbar
        }
    }

    // Create a container for the UI
    const uiContainer = document.createElement('div');
    uiContainer.id = 'colorChangerUI';
    uiContainer.style.position = 'fixed';
    uiContainer.style.padding = '10px';
    uiContainer.style.backgroundColor = '#505c6c';
    uiContainer.style.border = '1px solid #ccc';
    uiContainer.style.zIndex = '10000';
    uiContainer.style.display = 'none'; // Initially hide the UI
    uiContainer.style.flexDirection = 'row'; // Set horizontal layout
    uiContainer.style.alignItems = 'center'; // Center items vertically
    uiContainer.style.whiteSpace = 'nowrap'; // Prevent wrapping
    uiContainer.style.color = '#ffffff'; // Match text color to Top Bar Icons
    uiContainer.style.fontSize = '12px'; // Decrease font size

    // Background Color Input for #app[data-v-app]
    const backgroundColorLabel = document.createElement('label');
    backgroundColorLabel.textContent = 'Background Color: ';
    uiContainer.appendChild(backgroundColorLabel);

    const backgroundColorInput = document.createElement('input');
    backgroundColorInput.type = 'color';
    uiContainer.appendChild(backgroundColorInput);

    // Color Input for Action Bar #currentAction
    const actionBarColorLabel = document.createElement('label');
    actionBarColorLabel.textContent = 'Action Bar Color: ';
    actionBarColorLabel.style.marginLeft = '10px';
    uiContainer.appendChild(actionBarColorLabel);

    const actionBarColorInput = document.createElement('input');
    actionBarColorInput.type = 'color';
    uiContainer.appendChild(actionBarColorInput);

    // Color Input for Top Bar nav.navbar
    const topBarColorLabel = document.createElement('label');
    topBarColorLabel.textContent = 'Top Bar Color: ';
    topBarColorLabel.style.marginLeft = '10px';
    uiContainer.appendChild(topBarColorLabel);

    const topBarColorInput = document.createElement('input');
    topBarColorInput.type = 'color';
    uiContainer.appendChild(topBarColorInput);

    // Color Input for Text Color
    const textColorLabel = document.createElement('label');
    textColorLabel.textContent = 'Text Color: ';
    textColorLabel.style.marginLeft = '10px';
    uiContainer.appendChild(textColorLabel);

    const textColorInput = document.createElement('input');
    textColorInput.type = 'color';
    uiContainer.appendChild(textColorInput);

    // Save Button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style.marginLeft = '10px';
    uiContainer.appendChild(saveButton);

    // Reset Button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.style.marginLeft = '5px';
    uiContainer.appendChild(resetButton);
// Create Export Button
const exportButton = document.createElement('button');
exportButton.textContent = 'Export';
exportButton.style.marginLeft = '5px';
exportButton.style.backgroundColor = '#2596be'; // Blue color
uiContainer.appendChild(exportButton);

// Create Import Button
const importButton = document.createElement('button');
importButton.textContent = 'Import';
importButton.style.marginLeft = '5px';
importButton.style.backgroundColor = '#2596be'; // Blue color
uiContainer.appendChild(importButton);

// Export color scheme to clipboard
exportButton.addEventListener('click', () => {
    const colorScheme = {
        backgroundColor: backgroundColorInput.value,
        actionBarColor: actionBarColorInput.value,
        topBarColor: topBarColorInput.value,
        textColor: textColorInput.value // No topBarIconsColor
    };

    const colorSchemeString = JSON.stringify(colorScheme);

    // Copy to clipboard without a popup
    navigator.clipboard.writeText(colorSchemeString)
        .then(() => {
            console.log('Color scheme exported to clipboard successfully:', colorSchemeString);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
});

// Import color scheme from clipboard
importButton.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        const colorScheme = JSON.parse(text);

        // Apply the imported color values to the input fields
        backgroundColorInput.value = colorScheme.backgroundColor || '#202c3c';
        actionBarColorInput.value = colorScheme.actionBarColor || '#40444c';
        topBarColorInput.value = colorScheme.topBarColor || '#505c6c';
        textColorInput.value = colorScheme.textColor || '#ffffff';

        // Update the UI with the imported values immediately
        const appElement = document.querySelector('#app[data-v-app]');
        if (appElement) {
            appElement.style.backgroundColor = backgroundColorInput.value;
        }

        const actionBarElement = document.querySelector('#currentAction.shadow.shadow-slate-800');
        if (actionBarElement) {
            actionBarElement.style.backgroundColor = actionBarColorInput.value;
        }

        const topBarElement = document.querySelector('nav.navbar.is-fixed-top.is-primary.shadow-sm.shadow-slate-800\\/50');
        if (topBarElement) {
            topBarElement.style.backgroundColor = topBarColorInput.value;
        }

        // Apply text color to body and other elements
        document.body.style.color = textColorInput.value;
        applyTextColorToAll(textColorInput.value); // Apply to all relevant elements

    } catch (error) {
        console.error('Import error: ', error);
        alert('Failed to import color scheme. Please ensure the clipboard has a valid format.');
    }
});
    // Add UI container to the body
    document.body.appendChild(uiContainer);

    // Set colors from localStorage when the script loads
    setColors();

    // Change Background Color dynamically
    backgroundColorInput.addEventListener('input', () => {
        const appElement = document.querySelector('#app[data-v-app]');
        if (appElement) {
            appElement.style.backgroundColor = backgroundColorInput.value;
        }
    });

    // Change Action Bar color dynamically
    actionBarColorInput.addEventListener('input', () => {
        const actionBarElement = document.querySelector('#currentAction.shadow.shadow-slate-800');
        if (actionBarElement) {
            actionBarElement.style.backgroundColor = actionBarColorInput.value;
        }
    });

    // Change Top Bar color dynamically
    topBarColorInput.addEventListener('input', () => {
        const topBarElement = document.querySelector('nav.navbar.is-fixed-top.is-primary.shadow-sm.shadow-slate-800\\/50');
        if (topBarElement) {
            topBarElement.style.backgroundColor = topBarColorInput.value;
        }
    });

    // Change Text Color dynamically
    textColorInput.addEventListener('input', () => {
        document.body.style.color = textColorInput.value; // Change body text color
        applyTextColorToAll(textColorInput.value); // Apply to all relevant elements
    });

    // Save color changes to localStorage on button click
    saveButton.addEventListener('click', () => {
        const backgroundColor = backgroundColorInput.value;
        const actionBarColor = actionBarColorInput.value;
        const topBarColor = topBarColorInput.value;
        const textColor = textColorInput.value; // Get text color input value

        localStorage.setItem('backgroundColor', backgroundColor); // Save to localStorage
        localStorage.setItem('actionBarColor', actionBarColor); // Save to localStorage
        localStorage.setItem('topBarColor', topBarColor); // Save to localStorage
        localStorage.setItem('textColor', textColor); // Save to localStorage

        // Set colors again to ensure everything is updated
        setColors();
    });

    // Reset button functionality
    resetButton.addEventListener('click', () => {
        localStorage.removeItem('backgroundColor');
        localStorage.removeItem('actionBarColor');
        localStorage.removeItem('topBarColor');
        localStorage.removeItem('textColor');
        setColors(); // Reset colors to defaults
    });

// Optional: Add basic styling for the UI
GM_addStyle(`
    #colorChangerUI input[type="color"] {
        cursor: pointer;
        margin-left: 5px;
    }
    #colorChangerUI button {
        cursor: pointer;
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 12px; /* Match font size to your requirements */
    }
    #colorChangerUI button:hover {
        opacity: 0.8; /* Slightly dim on hover */
    }
    #colorChangerUI button#saveButton {
        background-color: green; /* Green background for Save */
    }
    #colorChangerUI button#resetButton {
        background-color: red; /* Red background for Reset */
    }
`);

// Change the button IDs for styling
saveButton.id = 'saveButton'; // Add ID for Save button
resetButton.id = 'resetButton'; // Add ID for Reset button
 // Start waiting for elements to load
    waitForElements();
})();
