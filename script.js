const SHEET_ID = '1h0kKoCdJ59-yvYurhA0A3gGkRT8T4Z76LeRXTyqrNqs';
const SHEET_NAME = 'ANNONCES';

const annoncesList = document.getElementById('annonces-list');

async function loadAnnonces() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows;
    
    const annonces = rows.slice(1).map(row => ({
      date: row.c[0]?.v || '',
      titre: row.c[1]?.v || '',
      description: row.c[2]?.v || '',
      prix: row.c[3]?.v || '0',
      devise: row.c[4]?.v || '$',
      categorie: row.c[5]?.v || '',
      ville: row.c[6]?.v || '',
      telephone: row.c[7]?.v || '',
      photo: row.c[8]?.v || 'https://via.placeholder.com/300',
      whatsapp: row.c[9]?.v || ''
    })).filter(a => a.titre);
    
    if(annonces.length === 0){
      annoncesList.innerHTML = '<p>Aucune annonce pour le moment</p>';
      return;
    }

    annoncesList.innerHTML = annonces.map(a => `
      <div class="annonce-card">
        <img src="${a.photo}" onerror="this.src='https://via.placeholder.com/300'">
        <h3>${a.titre}</h3>
        <p class="prix">${a.prix} ${a.devise}</p>
        <p>${a.ville} - ${a.categorie}</p>
        <p>${a.description}</p>
        <a href="https://wa.me/${a.whatsapp}" target="_blank">Contacter sur WhatsApp</a>
      </div>
    `).join('');

  } catch(err) {
    annoncesList.innerHTML = '<p>Erreur: Impossible de charger les annonces</p>';
    console.error(err);
  }
}

loadAnnonces();
