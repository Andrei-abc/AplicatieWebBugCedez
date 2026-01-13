// client/src/pages/ProjectPage.js - CORECTAT ȘI FINALIZAT

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../App';
import * as bugApi from '../api/bugApi';
import BugForm from '../components/BugForm';
import BugList from '../components/BugList';

const ProjectPage = () => {
  const { projectId } = useParams();
  const { authState } = useAuth();
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // <-- NOU: Starea de filtrare
  
  const userRole = authState.user ? authState.user.role : null;
  const currentUserId = authState.user ? authState.user.id : null;
  
  // Funcție care reîncarcă bug-urile de pe server (mock)
  const loadBugs = async () => {
    setLoading(true);
    try {
      const data = await bugApi.fetchBugsByProject(projectId);
      setBugs(data);
    } catch (error) {
      console.error('Eroare la preluarea bug-urilor:', error);
    } finally {
      setLoading(false);
    }
  };
    
  // Funcția CRUCIALĂ care se execută când un bug este modificat (alocat/rezolvat)
  // Aceasta actualizează starea locală a listei de bug-uri pentru a declanșa re-filtrarea
  const handleBugUpdate = (updatedBug) => {
    setBugs(prevBugs => 
        prevBugs.map(bug => bug.id === updatedBug.id ? updatedBug : bug)
    );
  };


  useEffect(() => {
    loadBugs();
  }, [projectId]);

  // Funcția de adăugare a bug-ului (pentru BugForm)
  const handleBugAdded = (newBug) => {
    setBugs([newBug, ...bugs]);
  };
    
  // Logica de filtrare a bug-urilor
  const filteredBugs = useMemo(() => {
    if (!bugs) return [];

    switch (filter) {
        case 'MY_BUGS':
            return bugs.filter(bug => bug.assignedToId === currentUserId);
        case 'OPEN':
            return bugs.filter(bug => bug.status === 'Open');
        case 'IN_PROGRESS':
            return bugs.filter(bug => bug.status === 'In Progress');
        case 'RESOLVED':
            return bugs.filter(bug => bug.status === 'Resolved');
        case 'ALL':
        default:
            return bugs;
    }
  }, [bugs, filter, currentUserId]);


  if (loading) return <div>Se încarcă detaliile proiectului...</div>;

  return (
    <div>
      <h2>Gestionare Proiect #{projectId}</h2>
      
      {/* 1. Formular Adaugă Bug (Vizibil doar pentru TST) */}
      {userRole === 'TST' && (
        <div style={{ marginBottom: '30px' }}>
          <h3>Raportează un Bug Nou</h3>
          <BugForm 
            projectId={projectId} 
            reporterId={authState.user.id} 
            onBugAdded={handleBugAdded} 
          />
        </div>
      )}
      
      <h3>Bug-uri înregistrate ({filteredBugs.length} afișate)</h3>
      
      {/* NOU: CONTROALE DE FILTRARE */}
      <div className="bug-filter-controls">
        <span style={{ marginRight: '10px' }}>Filtrează:</span>
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(f => (
            <button 
                key={f}
                className={filter === f ? 'active' : ''} 
                onClick={() => setFilter(f)}
            >
                {f.charAt(0) + f.slice(1).toLowerCase().replace('_', ' ')}
            </button>
        ))}
        {/* Filtru special MP: Alocate Mie */}
        {userRole === 'MP' && (
            <button 
                className={filter === 'MY_BUGS' ? 'active' : ''} 
                onClick={() => setFilter('MY_BUGS')}
                style={{ marginLeft: '10px' }}
            >
                Alocate mie
            </button>
        )}
      </div>

      {/* 2. Listă Bug-uri (Folosește lista FILTRATĂ) */}
      <BugList bugs={filteredBugs} projectId={projectId} userRole={userRole} onUpdate={handleBugUpdate} />
    </div>
  );
};

export default ProjectPage;