import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateTaskForm from './createTaskForm';
import { useParams } from 'react-router-dom';
import TaskBoard from './TaskBoard';
import Navbar2 from './NavBar2';
import Footer from './Footer';

const BoardPage = () => {
  const [boardName, setBoardName] = useState('');
  const { boardId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  // Fetch all tasks for the specific board
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Ensure we got an array before setting state
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        console.error('Expected an array but got:', res.data);
        setTasks([]);
      }
    } catch (err) {
      console.error('Error fetching tasks: ', err);
      alert("Error Loading tasks !!!");
    }
    finally{
      setLoading(false);
    }
  };

  // Fetch the board's metadata (e.g. name)
  const fetchBoardDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBoardName(res.data.name);
    } catch (err) {
      console.error('Error fetching board details', err);
      alert("Error loading board details !!!")
    }
    finally{
      setLoading(false);
    }
  };

  // Handle task update after getting new values from prompt
  const handleUpdateTask = async (task) => {
    setLoading(true);
    const newTitle = prompt('New title:', task.title);
    const newDesc = prompt('New description:', task.description);
    if (newTitle) {
      try {
        const res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${task.id}`,
          { title: newTitle, description: newDesc },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        // Replace updated task in list
        setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
      } catch (err) {
        console.error('Update error: ', err);
        alert("Error updating task !!!")
      }
      finally{
        setLoading(false);
      }
    }
  };

  // Delete task after confirmation
  const handleDeleteTask = async (taskId) => {
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(tasks.filter((t) => t.id !== taskId)); // Remove deleted task from list
    } catch (err) {
      console.error('Delete error: ', err);
      alert("Error deleting task");
    }
    finally{
      setLoading(false);
    }
  };

  // Run when boardId changes
  useEffect(() => {
    if (boardId) {
      fetchBoardDetails();
      fetchTasks();
    }
  }, [boardId]);

  // Handle drag-and-drop updates to status
  const handleDragUpdate = async (taskId, newStatus) => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id.toString() === taskId.toString() ? res.data : t))
      );
    } catch (err) {
      console.error('Drag update error:', err);
      alert("Can't Perform action !!!")
    }
    finally{

      setLoading(false);
    }
  };

  // Push new task to the tasks state
  const handleTaskCreated = (newTask) => {
    setLoading(true);
    try{

      setTasks([...tasks, newTask]);
    }
    catch(err){
      alert("Error adding task !!!")
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center gap-4"
      style={{
        maxWidth: '100%',
        flexWrap: 'wrap',
        width: '100%',
      }}
    >
      {/* Top navigation bar */}
      <Navbar2 />

      <div className="row" style={{background: 'linear-gradient(to bottom right,#8cb8f5, #8ef6d2)'}} >
        <div className="col-12 mb-3 d-flex flex-column align-items-center">
          {/* Form to create a new task */}
          <CreateTaskForm boardId={boardId} onTaskCreated={handleTaskCreated} />
        </div>

        <div className="col-12 d-flex flex-column flex-wrap ">
          {/* Board name header */}
          <h2 className="w-100 mb-4 text-center" style={{ color: '#2c3e50' }}>
            {boardName} 
          </h2>
          {/* TaskBoard (with drag and drop) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
              overflowX: 'auto',
              width: '100vw',
            }}
            >
            
            <TaskBoard
              tasks={tasks}
              onDragUpdate={handleDragUpdate}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
              loading={loading}
            />
          
          </div>
        </div>
          
      </div>

      {/* Page footer */}
      <Footer />
    </div>
  );
};

export default BoardPage;
