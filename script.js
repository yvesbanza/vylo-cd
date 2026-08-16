const SHEET_ID = '1h0kKoCdJ59-yvYurhA0A3gGkRT8T4Z76LeRXTyqrNqs';
const SHEET_NAME = 'ANNONCES';

document.addEventListener('DOMContentLoaded', () => {
  fetchAnnonces();
});

async function fetchAnnonces() {
  const url = `https://corsproxy.io/?https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
  const container = document.getElementById('annonces');
  container.innerHTML = '<p>Chargement des annonces...</p>';
  
  try {
    const res = await fetch(url);
    const text = await res.text();
    
    // On extrait le JSON entre les parenthèses
    const jsonText = text.match(/google\.visualization\.Query\.setResponse\((.*)\)/)[1];
    const json = JSON.parse(jsonText);
    
    const rows = json.table.rows;
    
    const data = rows.map(row => {
      const c = row.c;
      return {
        date: c[0]?.f || c[0]?.v || '', //.f pour formater la date
        titre: c[1]?.v || '',
        description: c[2]?.v || '',
        prix: `${c[3]?.v || ''} ${c[4]?.v || 'FC'}`,
        categorie: c[5]?.v || '',
        ville: c[6]?.v || '',
        telephone: c[7]?.v || '',
        photo: c[8]?.v || '',
        whatsapp: c[9]?.v || ''
      }
    }).filter(item => item.titre && item.titre.toLowerCase()!== 'titre');

    if(data.length === 0) {
        container.innerHTML = '<p>Aucune annonce pour l\'instant</p>';
    } else {
        displayAnnonces(data);
    }
  } catch (e) {
    container.innerHTML = `<p style="color:red">Erreur: ${e.message}</p>`;
  }
}

function displayAnnonces(annonces) {
  const container = document.getElementById('annonces');
  container.innerHTML = '';
  annonces.forEach(item => {
    const card = document.createElement('div');
    card.className = 'annonce-card';
    card.innerHTML = `
      ${item.photo? `<img src="${item.photo}" alt="${item.titre}">` : ''}
      <div class="annonce-content">
        <h3>${item.titre}</h3>
        <p class="prix">${item.prix}</p>
        <p>${item.description}</p>
        <p><b>Ville:</b> ${item.ville} | <b>Cat:</b> ${item.categorie}</p>
        <a href="tel:${item.telephone}" class="btn-call">Appeler</a>
        ${item.whatsapp? `<a href="https://wa.me/243${item.whatsapp}" target="_blank" class="btn-whatsapp">WhatsApp</a>` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}
