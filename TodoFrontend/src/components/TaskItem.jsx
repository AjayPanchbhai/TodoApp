import { useState } from 'react';

const TaskItem = ({ task, onUpdateStatus, onDeleteTask, onUpdateTask }) => {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: task.title,
    description: task.description
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return '#ff6b6b';
      case 'In Progress': return '#4ecdc4';
      case 'Completed': return '#1a936f';
      default: return '#6c757d';
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await onUpdateStatus(task._id, newStatus);
    } catch (error) {
      // Error handled in parent
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setDeleting(true);
      try {
        await onDeleteTask(task._id);
      } catch (error) {
        // Error handled in parent
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditFormData({
      title: task.title,
      description: task.description
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      title: task.title,
      description: task.description
    });
  };

  const handleSaveEdit = async () => {
    if (!editFormData.title.trim()) {
      alert('Title is required');
      return;
    }

    setUpdating(true);
    try {
      await onUpdateTask(task._id, editFormData);
      setIsEditing(false);
    } catch (error) {
      // Error handled in parent
    } finally {
      setUpdating(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isEditing) {
    return (
      <div style={{ 
        background: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        borderLeft: `4px solid ${getStatusColor(task.status)}`
      }}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            name="title"
            value={editFormData.title}
            onChange={handleEditInputChange}
            placeholder="Task title"
            required
            disabled={updating}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '16px',
              marginBottom: '10px',
              fontFamily: 'inherit'
            }}
          />
          <textarea
            name="description"
            value={editFormData.description}
            onChange={handleEditInputChange}
            placeholder="Task description"
            rows="3"
            disabled={updating}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleCancelEdit}
            disabled={updating}
            style={{
              padding: '8px 16px',
              border: '2px solid #6c757d',
              background: 'white',
              color: '#6c757d',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={updating}
            style={{
              padding: '8px 16px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {updating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        background: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        borderLeft: `4px solid ${getStatusColor(task.status)}`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px',
        gap: '15px'
      }}>
        <h4 style={{
          flex: 1,
          fontSize: '1.3rem',
          color: '#333',
          margin: 0
        }}>
          {task.title}
        </h4>
        <span 
          style={{
            padding: '6px 12px',
            borderRadius: '20px',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            backgroundColor: getStatusColor(task.status)
          }}
        >
          {task.status}
        </span>
      </div>

      {task.description && (
        <p style={{
          color: '#666',
          marginBottom: '15px',
          lineHeight: '1.5'
        }}>
          {task.description}
        </p>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        fontSize: '12px',
        color: '#888'
      }}>
        <span>
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </span>
        <span>
          Owner: {task.ownerEmail}
        </span>
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        {task.status !== 'To Do' && (
          <button
            onClick={() => handleStatusChange('To Do')}
            disabled={updating || deleting}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              backgroundColor: '#ff6b6b',
              color: 'white'
            }}
          >
            {updating ? 'Updating...' : 'Mark as To Do'}
          </button>
        )}
        
        {task.status !== 'In Progress' && (
          <button
            onClick={() => handleStatusChange('In Progress')}
            disabled={updating || deleting}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              backgroundColor: '#4ecdc4',
              color: 'white'
            }}
          >
            {updating ? 'Updating...' : 'Mark In Progress'}
          </button>
        )}
        
        {task.status !== 'Completed' && (
          <button
            onClick={() => handleStatusChange('Completed')}
            disabled={updating || deleting}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              backgroundColor: '#1a936f',
              color: 'white'
            }}
          >
            {updating ? 'Updating...' : 'Mark Complete'}
          </button>
        )}

        {/* Edit Button */}
        <button
          onClick={handleEdit}
          disabled={updating || deleting}
          style={{
            padding: '8px 16px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          disabled={updating || deleting}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default TaskItem;