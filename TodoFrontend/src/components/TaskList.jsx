import TaskItem from './TaskItem';

const TaskList = ({ tasks, onUpdateStatus, onDeleteTask, onUpdateTask }) => {
  // Ensure tasks is always an array
  const tasksArray = Array.isArray(tasks) ? tasks : [];

  if (tasksArray.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ fontSize: '1.2rem', color: '#6c757d', marginBottom: '20px' }}>
          📝 No tasks found
        </p>
        <p style={{ color: '#888' }}>
          Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {tasksArray.map(task => (
        <TaskItem
          key={task._id || task.id}
          task={task}
          onUpdateStatus={onUpdateStatus}
          onDeleteTask={onDeleteTask}
          onUpdateTask={onUpdateTask}
        />
      ))}
    </div>
  );
};

export default TaskList;