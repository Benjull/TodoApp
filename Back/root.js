app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM tasks WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de la tâche' });
      return;
    }
    res.sendStatus(204);
  });
});
app.post('/tasks', (req, res) => {
  const { title, description, is_done, due_date, ask_date } = req.body;
  connection.query('INSERT INTO tasks (title, description, is_done, due_date, ask_date) VALUES (?, ?, ?, ?, ?)', [title, description, is_done, due_date, ask_date], (error, results) => {
    if (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la tâche' });
      return;
    }
    res.status(201).json({ id: results.insertId, title, description, is_done, due_date, ask_date });
  });
});
app.get('/tasks', (req, res) => {
  connection.query('SELECT * FROM tasks', (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
      return;
    }
    res.json(results);
  });
});
// Récupérer la référence de la liste des tâches
const taskList = document.getElementById('taskList');

// Fonction pour afficher les tâches dans la liste
function displayTasks(tasks) {
    // Effacer le contenu actuel de la liste
    taskList.innerHTML = '';

    // Parcourir toutes les tâches et les ajouter à la liste
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.title + ' - ' + task.description; // Vous pouvez personnaliser l'affichage ici
        taskList.appendChild(li);
    });
}

// Fonction pour récupérer les tâches depuis l'API et les afficher
function fetchAndDisplayTasks() {
    axios.get('http://localhost:3000/tasks')
        .then(response => {
            const tasks = response.data;
            displayTasks(tasks);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

// Appeler la fonction pour récupérer et afficher les tâches au chargement de la page
fetchAndDisplayTasks();

// Ajouter un écouteur d'événement sur le bouton "Validez" pour actualiser la liste après l'ajout d'une nouvelle tâche
document.getElementById('addTask').addEventListener('click', () => {
    fetchAndDisplayTasks();
});