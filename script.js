document.addEventListener('DOMContentLoaded', () => {
    loadWarData();
});

async function loadWarData() {
    const warFiles = [
        'BalkanWars.json',
        'BeaverWars.json',
        'ProxyWars/ModernProxyWars.json',
        'ProxyWars/InterwarProxyWars.json',
        'QingDzungarWars.json'
    ];

    const wars = [];
    for (const file of warFiles) {
        const response = await fetch(file);
        const data = await response.json();
        wars.push(data);
    }

    populateWarSelect(wars);
}

function populateWarSelect(wars) {
    const warSelect = document.getElementById('warSelect');
    wars.forEach((war, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = Object.keys(war)[0]; // Assuming the key is the war name
        warSelect.appendChild(option);
    });
}

function displayWarDetails() {
    const warSelect = document.getElementById('warSelect');
    const warIndex = warSelect.value;
    const warDetails = document.getElementById('warDetails');
    const selectedWar = wars[warIndex];
    const warName = Object.keys(selectedWar)[0];
    const warData = selectedWar[warName];

    warDetails.innerHTML = `
        <h2>${warName}</h2>
        <p><strong>Date Range:</strong> ${warData.date_range}</p>
        <p><strong>Location:</strong> ${warData.location}</p>
        <p><strong>Background:</strong> ${warData.background.causes.join(', ')}</p>
        <p><strong>Result:</strong> ${warData.result.general}</p>
        <p><strong>Belligerents:</strong> ${Object.keys(warData.belligerents).join(', ')}</p>
        <p><strong>Commanders and Leaders:</strong> ${Object.entries(warData.commanders_and_leaders).map(([side, leaders]) => `${side}: ${leaders.join(', ')}`).join('; ')}</p>
        <p><strong>Strength:</strong> ${Object.entries(warData.strength).map(([side, details]) => `${side}: ${details.troops} troops`).join('; ')}</p>
        <p><strong>Casualties and Losses:</strong> ${Object.entries(warData.casualties_and_losses).map(([side, casualties]) => `${side}: ${casualties.dead} dead`).join('; ')}</p>
    `;
    warDetails.classList.add('active');
}

function compareWars() {
    const comparison = document.getElementById('comparison');
    const selectedOptions = Array.from(document.getElementById('warSelect').selectedOptions);
    const selectedWars = selectedOptions.map(option => wars[option.value]);
    
    comparison.innerHTML = selectedWars.map((war, index) => {
        const warName = Object.keys(war)[0];
        const warData = war[warName];
        return `
            <h3>${warName}</h3>
            <p><strong>Date Range:</strong> ${warData.date_range}</p>
            <p><strong>Location:</strong> ${warData.location}</p>
            <p><strong>Result:</strong> ${warData.result.general}</p>
        `;
    }).join('');
    comparison.classList.add('active');
}

function displayTimeline() {
    const timeline = document.getElementById('timeline');
    const selectedOptions = Array.from(document.getElementById('warSelect').selectedOptions);
    const selectedWars = selectedOptions.map(option => wars[option.value]);
    
    const timelineData = selectedWars.map(war => {
        const warName = Object.keys(war)[0];
        const warData = war[warName];
        return {
            name: warName,
            start: new Date(warData.date_range.split('–')[0]),
            end: new Date(warData.date_range.split('–')[1])
        };
    }).sort((a, b) => a.start - b.start);

    timeline.innerHTML = timelineData.map(war => `
        <div class="timeline-event">
            <span class="timeline-war">${war.name}</span>
            <span class="timeline-date">${war.start.getFullYear()} - ${war.end.getFullYear()}</span>
        </div>
    `).join('');
    timeline.classList.add('active');
}
