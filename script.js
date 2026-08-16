const SHEET_ID = '1h0kKoCdJ59-yvYurhA0A3gGkRT8T4Z76LeRXTyqrNqs';
const SHEET_NAME = 'ANNONCES';

async function fetchAnnonces() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    
    const rows = json.table.rows;
    const cols = json.table.cols;
    
    const getColIndex = (name) => cols.findIndex(c => c.label && c.label.toLowerCase().trim() === name.toLowerCase());
    
    const data = rows.map(row => {
      const prix = row.c[getColIndex('prix')]?.v || '';
      const devise = row.c[getColIndex('devise')]?.v || 'FC';
      return {
        date: row.c[getColIndex('date')]?.v || '',
        titre: row.c[getColIndex('titre')]?.v || '',
        description: row.c[getColIndex('description')]?.v || '',
        prix: `${prix} ${devise}`,
        ville: row.c[getColIndex('ville')]?.v || '',
        categorie: row.c[getColIndex('categorie')]?.v || '',
        telephone: row.c[getColIndex('telephone')]?.v || '',
        photo: row.c[getColIndex('photo')]?.v || '',
        whatsapp: row.c[getColIndex('whatsapp')]?.v || ''
      }
    }).filter(item => item.titre);

    displayAnnonces(data);
  } catch (e) {
    document.getElementById('annonces').innerHTML = '<p>Erreur de chargement: ' + e.message + '</p>';
    console.error(e);
  }
}

function displayAnnonces(data) {
  const container = document.getElementById('annonces');
  if (data.length === 0) {
    container.innerHTML = '<p>Aucune annonce pour le moment</p>';
    return;
  }
  container.innerHTML = data.map(item => `
    <div class="card">
      <img src="${item.photo}" onerror="this.src='https://placehold.co/300x200'">
      <h3>${item.titre}</h3>
      <p class="prix">${item.prix}</p>
      <p>${item.ville} - ${item.categorie}</p>
      <p>${item.description}</p>
      <a href="https://wa.me/243${item.whatsapp}" target="_blank">Contacter sur WhatsApp</a>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', fetchAnnonces);
