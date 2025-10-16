import { useState } from 'react';

const TaskForm = ({ onCreateTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ownerEmail: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    if (!formData.ownerEmail.trim()) {
      alert('Owner email is required');
      return;
    }

    setSubmitting(true);
    
    try {
      await onCreateTask(formData);
      setFormData({
        title: '',
        description: '',
        ownerEmail: ''
      });
    } catch (error) {
      // Error handled in parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: '20px'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '1.4rem' }}>
        Create New Task
      </h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: '600',
            color: '#555'
          }}>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '14px',
              transition: 'border-color 0.3s ease',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: '600',
            color: '#555'
          }}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows="3"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '14px',
              transition: 'border-color 0.3s ease',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: '600',
            color: '#555'
          }}>Owner Email *</label>
          <input
            type="email"
            name="ownerEmail"
            value={formData.ownerEmail}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '14px',
              transition: 'border-color 0.3s ease',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
        >
          {submitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;