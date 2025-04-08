document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const daytimeTab = document.getElementById('daytime-tab');
    const nighttimeTab = document.getElementById('nighttime-tab');
    const specialTab = document.getElementById('special-tab');
    const daytimeContent = document.getElementById('daytime-content');
    const nighttimeContent = document.getElementById('nighttime-content');
    const specialContent = document.getElementById('special-content');
    const mapElement = document.getElementById('map');
    const instructionsDiv = document.getElementById('instructions');
    const dayButtonsContainer = document.querySelector('.buttons');

    // --- Map Variables ---
    let map = null; 
    const quemuCoords = [-36.055, -63.565];
    const initialZoom = 14;
    let currentZoneLayer = null;

    // --- Function to Initialize Map ---
    function initializeMap() {
        if (!map && mapElement) {
            map = L.map('map').setView(quemuCoords, initialZoom);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            setupDayButtonListeners();
        }
    }

    // --- Function to Destroy Map ---
    function destroyMap() {
        if (map) {
            map.remove();
            map = null;
            instructionsDiv.innerHTML = '<p>Seleccione un día para ver la zona de recolección y las instrucciones.</p>';
            currentZoneLayer = null;
        }
    }

    // --- Zone Data ---
    const zones = {
        lunes: {
            geojson: {
                "type": "Feature",
                "properties": { "name": "Zona Lunes" },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[ 
                        [-63.575, -36.050], 
                        [-63.565, -36.050], 
                        [-63.565, -36.055], 
                        [-63.575, -36.055], 
                        [-63.575, -36.050]  
                    ]]
                }
            },
            style: { 
                fillColor: '#ff7800', 
                color: '#ff7800',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.4
            },
            instructions: `
                <p><strong>LUNES:</strong> Zona Noroeste.</p>
                <p>Señor vecino, las ramas o escombros deben estar sobre su vereda.</p>
                <p>En caso de sacar residuos especiales (muebles, membranas, etc.), contactarse con <button onclick="showSpecialInfo()">RESIDUOS ESPECIALES</button>.</p>
            `
        },
        martes: {
            geojson: {
                "type": "Feature",
                "properties": { "name": "Zona Martes" },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[ 
                        [-63.565, -36.050], 
                        [-63.555, -36.050], 
                        [-63.555, -36.055], 
                        [-63.565, -36.055], 
                        [-63.565, -36.050]  
                    ]]
                }
            },
            style: { 
                fillColor: '#007bff', 
                color: '#007bff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.4
            },
            instructions: `
                <p><strong>MARTES:</strong> Zona Noreste.</p>
                <p>Señor vecino, las ramas o escombros deben estar sobre su vereda.</p>
                <p>En caso de sacar residuos especiales (muebles, membranas, etc.), contactarse con <button onclick="showSpecialInfo()">RESIDUOS ESPECIALES</button>.</p>
            `
        },
        miercoles: {
            geojson: {
                "type": "Feature",
                "properties": { "name": "Zona Miércoles" },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[ 
                        [-63.575, -36.055], 
                        [-63.565, -36.055], 
                        [-63.565, -36.060], 
                        [-63.575, -36.060], 
                        [-63.575, -36.055]  
                    ]]
                }
            },
            style: { 
                fillColor: '#28a745', 
                color: '#28a745',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.4
            },
            instructions: `
                <p><strong>MIÉRCOLES:</strong> Zona Sudoeste.</p>
                <p>Señor vecino, las ramas o escombros deben estar sobre su vereda.</p>
                <p>En caso de sacar residuos especiales (muebles, membranas, etc.), contactarse con <button onclick="showSpecialInfo()">RESIDUOS ESPECIALES</button>.</p>
            `
        },
        jueves: {
            geojson: {
                "type": "Feature",
                "properties": { "name": "Zona Jueves" },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[ 
                        [-63.565, -36.055], 
                        [-63.555, -36.055], 
                        [-63.555, -36.060], 
                        [-63.565, -36.060], 
                        [-63.565, -36.055]  
                    ]]
                }
            },
            style: { 
                fillColor: '#dc3545', 
                color: '#dc3545',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.4
            },
            instructions: `
                <p><strong>JUEVES:</strong> Zona Sudeste.</p>
                <p>Señor vecino, las ramas o escombros deben estar sobre su vereda.</p>
                <p>En caso de sacar residuos especiales (muebles, membranas, etc.), contactarse con <button onclick="showSpecialInfo()">RESIDUOS ESPECIALES</button>.</p>
            `
        }
    };

    // --- Function to Show Zone on Map ---
    function showZone(day) {
        if (!map) return;

        if (currentZoneLayer) {
            map.removeLayer(currentZoneLayer);
            currentZoneLayer = null;
        }
        instructionsDiv.innerHTML = '';

        if (zones[day]) {
            const zoneData = zones[day];
            currentZoneLayer = L.geoJSON(zoneData.geojson, {
                style: zoneData.style 
            }).addTo(map);

            instructionsDiv.innerHTML = zoneData.instructions;
        } else if (day === 'reset') {
            instructionsDiv.innerHTML = '<p>Seleccione un día para ver la zona de recolección y las instrucciones.</p>';
            map.setView(quemuCoords, initialZoom); 
        }
    }

    // --- Function to Show Special Info Popup ---
    window.showSpecialInfo = function() {
        const content = `
            <html>
            <head><title>Residuos Especiales - Tarifario y Contacto</title></head>
            <body style="font-family: sans-serif; padding: 20px;">
                <h2>Información Residuos Especiales</h2>
                <p><strong>Tarifario:</strong> [Aquí iría el tarifario actualizado]</p>
                <p><strong>Contacto:</strong> [Aquí iría el teléfono o forma de contacto]</p>
                <p>Por favor, comuníquese para coordinar el retiro.</p>
                <button onclick="window.close()">Cerrar</button>
            </body>
            </html>
        `;
        const newWindow = window.open('', 'ResiduosEspeciales', 'width=400,height=300,scrollbars=yes,resizable=yes');
        if (newWindow) {
            newWindow.document.write(content);
            newWindow.document.close();
        } else {
            alert('El navegador bloqueó la ventana emergente. Por favor, habilite las ventanas emergentes para este sitio.');
        }
    }

    // --- Setup Day Button Listeners ---
    function setupDayButtonListeners() {
        if (dayButtonsContainer) {
            dayButtonsContainer.querySelectorAll('button').forEach(button => {
                button.replaceWith(button.cloneNode(true));
            });
            dayButtonsContainer.querySelectorAll('button').forEach(button => {
                const day = button.getAttribute('data-day');

                // Set button color based on zone color
                if (day && zones[day] && zones[day].style && zones[day].style.fillColor) {
                    button.style.backgroundColor = zones[day].style.fillColor;
                    // Optional: Add a darker shade on hover using JS
                    button.addEventListener('mouseenter', () => {
                       button.style.filter = 'brightness(90%)';
                    });
                    button.addEventListener('mouseleave', () => {
                        button.style.filter = 'brightness(100%)';
                    });
                } else if (day === 'reset') {
                    // Keep reset button style from CSS
                    button.style.backgroundColor = ''; // Clear inline style if any
                }

                button.addEventListener('click', () => {
                    showZone(day);
                    // Optional: Add active state styling
                    dayButtonsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active-day'));
                    if (day !== 'reset') {
                        button.classList.add('active-day');
                    }
                });
            });
        }
    }

    // --- Tab Switching Logic ---
    function setActiveTab(tabId) {
        const isDaytime = tabId === 'daytime-tab';
        const isNighttime = tabId === 'nighttime-tab';
        const isSpecial = tabId === 'special-tab';

        // Toggle active class for tabs
        daytimeTab.classList.toggle('active', isDaytime);
        nighttimeTab.classList.toggle('active', isNighttime);
        specialTab.classList.toggle('active', isSpecial);

        // Toggle active class for content sections
        daytimeContent.classList.toggle('active', isDaytime);
        nighttimeContent.classList.toggle('active', isNighttime);
        specialContent.classList.toggle('active', isSpecial);

        // Handle map visibility
        if (isDaytime) {
            if (!map) { 
                setTimeout(() => {
                    initializeMap();
                    if (map) map.invalidateSize();
                }, 10);
            } else {
                map.invalidateSize(); 
            }
        } else {
            destroyMap();
        }
    }

    // Add event listeners for tab clicks
    daytimeTab.addEventListener('click', () => setActiveTab('daytime-tab'));
    nighttimeTab.addEventListener('click', () => setActiveTab('nighttime-tab'));
    specialTab.addEventListener('click', () => setActiveTab('special-tab'));

    // --- Initial Setup ---
    setActiveTab('daytime-tab');
});