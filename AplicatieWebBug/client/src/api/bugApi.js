const API_URL = 'http://localhost:3001/api/bugs';

export const fetchBugsByProject = async (id) => {
  const r = await fetch(`${API_URL}/project/${id}`);
  return r.json();
};

export const addBug = async (data) => {
  // Ne asigurăm că trimitem ProjectId (cu P mare) așa cum așteaptă Sequelize
  const payload = {
    ...data,
    ProjectId: data.projectId 
  };
  
  const r = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return r.json();
};

export const assignBug = async (id, userId) => {
  const r = await fetch(`${API_URL}/${id}/assign`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  return r.json();
};

export const updateBugStatus = async (id, solutionLink) => {
  // Am corectat ruta la /resolve și ne asigurăm că trimitem solutionLink
  const r = await fetch(`${API_URL}/${id}/resolve`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ solutionLink })
  });
  return r.json();
};

export const fetchTeamMembers = async () => {
  // Această rută returnează toți utilizatorii pentru a putea alege un MP căruia să-i aloci bug-ul
  const r = await fetch('http://localhost:3001/api/auth/users');
  return r.json();
};