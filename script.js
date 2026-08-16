const SHEET_ID = '1h0kKoCdJ59-yvYurhA0A3gGkRT8T4Z76LeRXTyqrNqs';

document.addEventListener('DOMContentLoaded', () => {
  fetchAnnonces();
});

async function fetchAnnonces() {
  const url = `https://opensheet.elk.sh/${SHEET_ID}/ANNONCES`;
  const container = document.getElementById('annonces');
  container.innerHTML = '<p>Chargement des annonces...</p>';
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    // On filtre pour enlever l'entête
    const annonces = data.filter(item => item.titre && item.titre.toLowerCase() !== 'titre');

    if(annonces.length === 0) {
        container.innerHTML = '<p>Aucune annonce pour l\'instant</p>';
    } else {
        displayAnnonces(annonces);
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
        <p class="prix">${item.prix} ${item.devise || 'FC'}</p>
        <p>${item.description}</p>
        <p><b>Ville:</b> ${item.ville} | <b>Cat:</b> ${item.categorie}</p>
        <a href="tel:${item.telephone}" class="btn-call">Appeler</a>
        ${item.whatsapp? `<a href="https://wa.me/243${item.whatsapp}" target="_blank" class="btn-whatsapp">WhatsApp</a>` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}
