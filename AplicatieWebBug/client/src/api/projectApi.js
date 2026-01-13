const API_URL = 'http://localhost:3001/api/projects';

export const fetchProjects = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

export const addProject = async (name, ownerId) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, repository: 'http://repo.com/' + name })
    });
    return response.json();
};