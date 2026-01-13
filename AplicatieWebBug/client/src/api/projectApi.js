const API_URL = 'http://localhost:3001/api/projects';

export const fetchProjects = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Eroare la încărcarea proiectelor');
    return response.json();
};

export const addProject = async (projectData) => {
    // Trimitem obiectul complet (nume și repository) primit din DashboardPage
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData) 
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Eroare la salvarea proiectului');
    }
    return response.json();
};