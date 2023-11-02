window.addEventListener('load', function() {
    async function getHighscores() {
      const response = await axios.get(`https://ets-pemrograman-web-f.cyclic.app/scores/score`);
      return response.data.data.sort((a, b) => b.score - a.score);
    }

    async function populateHighscoresTable() {
        const highscores = await getHighscores();
    
        const table = document.querySelector('.highscores-table');
        table.querySelector('tbody').innerHTML = '';

    
        for (const highscore of highscores) {
          const row = document.createElement('tr');
    
          const nameCell = document.createElement('td');
          nameCell.textContent = highscore.nama;
          row.appendChild(nameCell);
    
          const scoreCell = document.createElement('td');
          scoreCell.textContent = highscore.score;
          row.appendChild(scoreCell);
    
          table.appendChild(row);
        }
      }
  
    populateHighscoresTable();
  });