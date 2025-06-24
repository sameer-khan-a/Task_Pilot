import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const CreateTaskForm = ({ boardId, onTaskCreated }) => {
  // State to hold task title input
  const [title, setTitle] = useState('');

  const [creating, setCreating] = useState(false);

  // State to hold task description input
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [message, setMessage] = useState("");
 const soundRef = useRef(null);
      
  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submit behavior (page reload)
    setCreating(true);
    setMessage("");
    try {
      // POST request to create a new task
      const res = await axios.post(
        `${process.env.DATABASE_URL}/api/tasks/create`,
        {
          title, // Task title from state
          description, // Task description from state
          status: 'todo', // Default status for new tasks
          boardId, // The board this task belongs to, passed as prop
          dueDate
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Authorization header with token
          },
        }
      );
        if(soundRef.current){
        soundRef.current.play().catch(err => console.log("Play error: ", err));
    }

      // Call callback to inform parent component of the new task
      onTaskCreated(res.data);

      // Reset form fields after successful creation
      setTitle('');
      setDescription('');
      
    } catch (err) {
      // Log any errors that occur during task creation
      console.log('error creating task : ' + err);
      setMessage("Error Creating Task !!!");
    }
    finally{
      setCreating(false);
    }
  };

  return (
    <>
      <h1
        className="text-center mb-3"
        style={{ color: '#2c3e50', marginTop: '80px' }}
      >
        Manage Your Tasks
      </h1>
      {/* Form for creating a new task */}
      <form onSubmit={handleSubmit}>
        <div
          className="container"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
          }}
        >
          {/* Input for task title */}
          <input
            type="text"
            className="form-control w-100 rounded-5"
            placeholder="Task Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            required // Title is required field
          />

          {/* Textarea for task description */}
          <textarea
            rows="5"
            cols="10"
            className="form-control w-100 h-100 rounded-5"
            placeholder="Task Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          <input
            type="date"
            className="form-control-color w-100 rounded-5"
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
            }}
            required // Title is required field
          />
          {/* Submit button */}
          <button
            type="submit"
            disabled={creating}
            className="btn btn-md"
            style={{
              background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
              color: 'white',
              borderRadius: '50px'
              
            }}
          >
           Create Task
          </button>
                 <center>

           {message && (
        <div
        className="alert alert-warning alert-dismissible fade show mt-2 w-100 rounded-5"
        role="alert"
        >
    {message}
    <button
    type="button"
    className="btn-close"
    data-bs-dismiss="alert"
    aria-label="Close"
    onClick={() => setMessage('')}
    ></button>
    </div>
    )}
            </center>
        </div>
      </form>
    </>
  );
};

export default CreateTaskForm;
