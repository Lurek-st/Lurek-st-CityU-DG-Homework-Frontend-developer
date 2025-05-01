// Use ES6 Class to manage message display
class MessageManager {
  constructor() {
    this.messageDiv = this.createMessageDiv();
  }

  createMessageDiv() {
    const messageDiv = document.createElement('div');
    messageDiv.style.color = 'white';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.padding = '10px';
    messageDiv.style.marginTop = '10px';
    messageDiv.style.marginBottom = '10px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.display = 'none';

    const tableContainer = document.querySelector('.chosen-companies');
    tableContainer.insertBefore(messageDiv, document.querySelector('.form-actions'));
    return messageDiv;
  }

  showMessage(message, isError = false) {
    this.messageDiv.textContent = message;
    this.messageDiv.style.backgroundColor = isError ? '#ff6b6b' : '#75e287';
    this.messageDiv.style.display = 'block';
    this.messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (!isError) {
      setTimeout(() => {
        this.messageDiv.style.display = 'none';
      }, 10000);
    }
  }

  hideMessage() {
    this.messageDiv.style.display = 'none';
    this.messageDiv.textContent = '';
  }
}

// Use ES6 Class to manage Zone display
class ZoneManager {
  constructor() {
    // Use Map to store zone data
    this.zones = new Map([
      ['technology', {
        zone: document.querySelector('.Technology-Zone'),
        header: document.querySelector('.Technology-Zone .list'),
        content: document.querySelector('.one')
      }],
      ['innovation', {
        zone: document.querySelector('.Innovation-Zone'),
        header: document.querySelector('.Innovation-Zone .list'),
        content: document.querySelector('.two')
      }],
      ['ecology', {
        zone: document.querySelector('.Ecology-Zone'),
        header: document.querySelector('.Ecology-Zone .list'),
        content: document.querySelector('.three')
      }]
    ]);

    this.initializeZones();
    this.setupEventListeners();
  }

  initializeZones() {
    this.zones.forEach((zoneData, zoneName) => {
      const isActive = zoneName === 'technology';
      zoneData.header.style.backgroundColor = isActive ? 'rgba(0, 0, 0, 0.17)' : 'rgba(0, 0, 0, 0.08)';
      zoneData.content.style.visibility = isActive ? 'visible' : 'hidden';
      zoneData.content.style.opacity = isActive ? '1' : '0';
      zoneData.content.style.pointerEvents = isActive ? 'auto' : 'none';
    });
  }

  showZone(zoneName) {
    this.zones.forEach((zoneData, name) => {
      const isActive = name === zoneName;
      zoneData.header.style.backgroundColor = isActive ? 'rgba(0, 0, 0, 0.17)' : 'rgba(0, 0, 0, 0.08)';
      zoneData.content.style.visibility = isActive ? 'visible' : 'hidden';
      zoneData.content.style.opacity = isActive ? '1' : '0';
      zoneData.content.style.pointerEvents = isActive ? 'auto' : 'none';
      zoneData.content.style.transition = 'opacity 0.5s ease';
    });
  }

  setupEventListeners() {
    // Use two different event handling methods
    this.zones.forEach((zoneData, zoneName) => {
      // Method 1: HTML onclick
      zoneData.header.setAttribute('onclick', `handleZoneClick('${zoneName}')`);
    });
  }
}

// Use ES6 Class to manage company selection
class CompanySelector {
  constructor(messageManager) {
    this.messageManager = messageManager;
    this.tbody = document.querySelector('#chosen-companies-table tbody');
    this.timeDisplay = document.querySelector('.last-change-time');
    // Use Set to store selection data
    this.selectedCompanies = new Set();
    this.selectedRanks = new Set();

    this.initialize();
    this.setupEventListeners();
  }

  initialize() {
    this.tbody.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
                <td></td>
                <td></td>
                <td>${i}</td>
            `;
      this.tbody.appendChild(tr);
    }
    this.updateTime();
  }

  updateTime() {
    const now = new Date();
    this.timeDisplay.textContent = `Last change time: ${now.toString()}`;
  }

  updateTotalCount() {
    const filledRows = Array.from(this.tbody.querySelectorAll('tr'))
      .filter(row => row.cells[0].textContent.trim() !== '').length;
    document.querySelector('tfoot tr td').textContent =
      `Total number of completed choices: ${filledRows}`;
    this.updateTime();
  }

  getOrdinalNumber(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  checkGaps(rows) {
    let lastFilledIndex = -1;

    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].cells[0].textContent.trim() !== '') {
        lastFilledIndex = i;
        break;
      }
    }

    if (lastFilledIndex === -1) {
      return [];
    }

    const gaps = [];
    let foundFirstEntry = false;

    for (let i = 0; i <= lastFilledIndex; i++) {
      const hasContent = rows[i].cells[0].textContent.trim() !== '';
      if (hasContent) {
        foundFirstEntry = true;
      } else if (foundFirstEntry) {
        gaps.push(i + 1);
      }
    }

    return gaps;
  }

  handleRankChoice(event) {
    const button = event.target;
    const rankInput = button.parentElement.querySelector('.text');
    const rank = parseInt(rankInput.value.trim());

    const companyElement = button.parentElement;
    const companyName = companyElement.querySelector('.label').textContent;
    const zone = companyElement.closest('.Technology-Zone, .Innovation-Zone, .Ecology-Zone')
      .className.replace('-Zone', ' Zone');

    // Validate input
    if (!rankInput.value.trim() || isNaN(rank) || !Number.isInteger(rank)) {
      alert('Please enter the rank of chosen company');
      return;
    }

    if (rank < 1 || rank > 10) {
      alert('Please enter the rank of chosen between 1 and 10');
      return;
    }

    if (this.selectedCompanies.has(companyName)) {
      alert('You have already chosen this company');
      return;
    }

    const rows = this.tbody.querySelectorAll('tr');
    if (rows[rank - 1].cells[0].textContent !== '') {
      alert('You have already chosen this rank');
      return;
    }

    // Update selection
    this.selectedCompanies.add(companyName);
    this.selectedRanks.add(rank);

    rows[rank - 1].cells[0].textContent = zone;
    rows[rank - 1].cells[1].textContent = companyName;

    this.updateTotalCount();
    alert(`You have chosen ${companyName} as your ${this.getOrdinalNumber(rank)} chosen company in ${zone} successfully`);
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const rows = Array.from(this.tbody.querySelectorAll('tr'));

    // Check if table is empty
    if (!rows.some(row => row.cells[0].textContent.trim() !== '')) {
      this.messageManager.showMessage("You have not chosen any company.", true);
      return;
    }

    // Check for gaps
    const gaps = this.checkGaps(rows);
    if (gaps.length > 0) {
      const gapPositions = gaps.map(gap => this.getOrdinalNumber(gap)).join(', ');
      this.messageManager.showMessage(
        `You have not chosen your ${gapPositions} chosen companies, you can not leave any gap between your chosen companies`,
        true
      );
      return;
    }

    // Calculate number of chosen companies
    let chosenCount = 0;
    for (const row of rows) {
      if (row.cells[0].textContent.trim() !== '') {
        chosenCount++;
      } else {
        break;
      }
    }

    const now = new Date().toString();
    this.messageManager.showMessage(
      `You have successfully submitted your application with ${chosenCount} choices at time ${now}`
    );
  }

  handleClear(event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedCompanies.clear();
    this.selectedRanks.clear();

    const rows = this.tbody.querySelectorAll('tr');
    rows.forEach(row => {
      row.cells[0].textContent = '';
      row.cells[1].textContent = '';
    });

    document.querySelector('tfoot tr td').textContent = 'Total number of completed choices: 0';
    this.updateTime();
    this.messageManager.hideMessage();
  }

  setupEventListeners() {
    // Method 2: JavaScript addEventListener
    document.querySelectorAll('.bnt').forEach(button => {
      button.addEventListener('click', this.handleRankChoice.bind(this));
    });

    const submitLink = document.querySelector('.submit-link');
    const clearLink = document.querySelector('.clear-link');

    if (submitLink) {
      submitLink.addEventListener('click', this.handleSubmit.bind(this));
    }

    if (clearLink) {
      clearLink.addEventListener('click', this.handleClear.bind(this));
    }
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  const messageManager = new MessageManager();
  const zoneManager = new ZoneManager();
  const companySelector = new CompanySelector(messageManager);

  // Provide global function for HTML onclick event
  window.handleZoneClick = (zoneName) => {
    zoneManager.showZone(zoneName);
  };
});
