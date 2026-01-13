const API_URL = 'http://localhost:3001/api/bugs';

export const fetchBugsByProject = async (id) => {
  const r = await fetch(`${API_URL}/project/${id}`);
  return r.json();
};

export const addBug = async (data) => {
  const r = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
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
  const r = await fetch(`${API_URL}/${id}/resolve`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ solutionLink })
  });
  return r.json();
};

export const fetchTeamMembers = async () => {
  const r = await fetch('http://localhost:3001/api/auth/users');
  return r.json();
};