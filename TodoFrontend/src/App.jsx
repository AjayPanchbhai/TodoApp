import { useState, useEffect, useRef } from 'react';
import { taskAPI } from './services/api';
import { io } from 'socket.io-client';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Filter from './components/Filter';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const socketRef = useRef(null);

  useEffect(() => {
    const initializeSocket = () => {
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: false,
        autoConnect: true,
        withCredentials: true,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to server:', newSocket.id);
        setConnectionStatus('connected');
        setError('');
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
        setConnectionStatus('disconnected');
        
        if (reason === 'io server disconnect') {
          setTimeout(() => {
            newSocket.connect();
          }, 1000);
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setConnectionStatus('error');
        setError('Failed to connect to server. Retrying...');
        
        setTimeout(() => {
          newSocket.connect();
        }, 2000);
      });

      newSocket.on('reconnect', (attempt) => {
        console.log('Reconnected to server. Attempt:', attempt);
        setConnectionStatus('connected');
        setError('');
      });

      newSocket.on('reconnect_attempt', (attempt) => {
        console.log('Attempting to reconnect... Attempt:', attempt);
        setConnectionStatus('reconnecting');
      });

      newSocket.on('reconnect_error', (error) => {
        console.error('Reconnection error:', error);
        setConnectionStatus('error');
      });

      newSocket.on('reconnect_failed', () => {
        console.error('Reconnection failed');
        setConnectionStatus('failed');
        setError('Failed to reconnect to server. Please refresh the page.');
      });

      newSocket.on('taskCreated', (taskData) => {
        console.log('Received taskCreated event:', taskData);
        const task = taskData.data || taskData;
        setTasks(prev => [task, ...prev]);
      });

      newSocket.on('taskUpdated', (taskData) => {
        console.log('Received taskUpdated event:', taskData);
        const updatedTask = taskData.data || taskData;
        setTasks(prev => prev.map(task => 
          task._id === updatedTask._id ? updatedTask : task
        ));
      });

      newSocket.on('taskDeleted', (taskId) => {
        console.log('Received taskDeleted event:', taskId);
        setTasks(prev => prev.filter(task => task._id !== taskId));
      });

      newSocket.on('welcome', (data) => {
        console.log('Server welcome:', data);
      });
    };

    initializeSocket();

    return () => {
      console.log('Cleaning up socket connection');
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await taskAPI.getAllTasks();
      
      let tasksData = [];
      
      if (Array.isArray(response)) {
        tasksData = response;
      } else if (response && Array.isArray(response.data)) {
        tasksData = response.data;
      } else if (response && response.success && Array.isArray(response.data)) {
        tasksData = response.data;
      } else {
        console.warn('Unexpected response format:', response);
        tasksData = [];
      }
      
      setTasks(tasksData);
      console.log('Loaded tasks:', tasksData.length);
      
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please check if the server is running.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setError('');
      await taskAPI.createTask(taskData);
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Error creating task. Please try again.');
      throw err;
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      setError('');
      await taskAPI.updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Error updating task. Please try again.');
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setError('');
      await taskAPI.deleteTask(taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Error deleting task. Please try again.');
      throw err;
    }
  };

  const reconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  };

  // FIXED: Safe filtering
  const filteredTasks = Array.isArray(tasks) 
    ? (filter === 'All' 
        ? tasks 
        : tasks.filter(task => task && task.status === filter))
    : [];

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#1a936f';
      case 'reconnecting': return '#f4a261';
      case 'disconnected': return '#e76f51';
      case 'error': return '#e63946';
      default: return '#6c757d';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'reconnecting': return 'Reconnecting...';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Connection Error';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="app-header">
          <h1>Interactive Task Manager</h1>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>Interactive Task Manager</h1>
          <p>Manage your tasks efficiently with real-time updates</p>
          <div style={{ 
            marginTop: '10px', 
            fontSize: '0.9rem',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.1)',
              padding: '5px 12px',
              borderRadius: '20px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(),
                animation: connectionStatus === 'connected' ? 'pulse 2s infinite' : 'none'
              }}></div>
              <span>Real-time: {getStatusText()}</span>
              {connectionStatus !== 'connected' && (
                <button 
                  onClick={reconnectSocket}
                  style={{
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reconnect
                </button>
              )}
            </div>
          </div>
        </header>

        {error && (
          <div style={{
            background: '#ff6b6b',
            color: 'white',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
            <button 
              onClick={reconnectSocket}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                backgroundColor: 'white',
                color: '#ff6b6b',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Retry
            </button>
          </div>
        )}

        <div className="app-content">
          <div className="sidebar">
            <TaskForm onCreateTask={createTask} />
          </div>

          <div className="main-content">
            <Filter currentFilter={filter} onFilterChange={setFilter} />
            <TaskList 
              tasks={filteredTasks}
              onUpdateStatus={updateTaskStatus}
              onDeleteTask={deleteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;