const API_URL = 'http://localhost:3001/api/bugs';

export const fetchBugsByProject = async (id) => {
  const r = await fetch(`${API_URL}/project/${id}`);
  const result = await r.json();
  return result.data || result || [];
};

export const addBug = async (data) => {
  const payload = {
    ...data,
    ProjectId: data.projectId 
  };
  
  const r = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await r.json();
  return result.data || result;
};

export const assignBug = async (id, userId) => {
  const r = await fetch(`${API_URL}/${id}/assign`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  const result = await r.json();
  return result.data || result;
};

export const updateBugStatus = async (id, solutionLink) => {
  const r = await fetch(`${API_URL}/${id}/resolve`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ solutionLink })
  });
  const result = await r.json();
  return result.data || result;
};

export const fetchTeamMembers = async () => {
  const r = await fetch('http://localhost:3001/api/auth/users');
  const result = await r.json();
  return result.data || result || [];
};