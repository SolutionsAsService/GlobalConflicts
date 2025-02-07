document.addEventListener('DOMContentLoaded', () => {
    loadWarData();
});

let wars = [];

async function loadWarData() {
    const warFiles = [
        'BalkanWars.json',
        'BeaverWars.json',
        'ProxyWars/ModernProxyWars.json',
        'ProxyWars/InterwarProxyWars.json',
        'QingDzungarWars.json',
        'NapoleonicWars/NapoleonicWars.json',
        'YugoslavWars/YugoslavWars.json',
        'Colonization/AngloDutchWars.json',
    
    ];

    for (const file of warFiles) {
        try {
            const response = await fetch(file);
            const data = await response.json();
            wars.push(data);
        } catch (error) {
            console.error(`Failed to load ${file}:`, error);
        }
    }

    displayTimeline();
}

function displayTimeline() {
    const timeline = document.getElementById('timeline');

    const timelineData = wars.map(war => {
        const warName = Object.keys(war)[0];
        const warData = war[warName];
        return {
            name: warName,
            start: new Date(warData.date_range.split('–')[0]),
            end: new Date(warData.date_range.split('–')[1]),
            data: warData
        };
    }).sort((a, b) => a.start - b.start);

    timeline.innerHTML = timelineData.map((war, index) => `
        <div class="timeline-event" onclick="showWarDetails(${index})">
            <span class="timeline-war">${war.name}</span>
            <span class="timeline-date">${war.start.getFullYear()} - ${war.end.getFullYear()}</span>
        </div>
    `).join('');
}

function showWarDetails(index) {
    const warDetails = document.getElementById('warDetails');
    const selectedWar = wars[index];
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
    warDetails.style.display = 'block';
}
