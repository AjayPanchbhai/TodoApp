const Filter = ({ currentFilter, onFilterChange }) => {
  const filters = ['All', 'To Do', 'In Progress', 'Completed'];

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginBottom: '15px', color: '#333' }}>
        Filter Tasks
      </h3>
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            style={{
              padding: '10px 20px',
              border: '2px solid #e9ecef',
              background: currentFilter === filter ? '#667eea' : 'white',
              color: currentFilter === filter ? 'white' : '#333',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (currentFilter !== filter) {
                e.target.style.borderColor = '#667eea';
                e.target.style.color = '#667eea';
              }
            }}
            onMouseLeave={(e) => {
              if (currentFilter !== filter) {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.color = '#333';
              }
            }}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filter;