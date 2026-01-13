// client/src/components/BugList.js - CORECTAT

import React from 'react';
import BugItem from './BugItem'; 

// ATENȚIE: Am adăugat onUpdate ca prop primit și trimis mai departe
const BugList = ({ bugs, projectId, userRole, onUpdate }) => { 

  if (bugs.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '30px', color: '#6c757d' }}>
        Nu există bug-uri înregistrate pentru acest proiect.
    </p>;
  }

  return (
    <div className="bug-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {bugs.map((bug) => (
        <BugItem 
          key={bug.id} 
          bug={bug} 
          projectId={projectId} 
          userRole={userRole}
          onUpdate={onUpdate} // <-- TRIMITE CĂTRE BugItem
        />
      ))}
    </div>
  );
};

export default BugList;