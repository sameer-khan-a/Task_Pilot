import React, { useState } from 'react';
import axios from 'axios';

const CreateTaskForm = ({ boardId, onTaskCreated }) => {
  // State to hold task title input
  const [title, setTitle] = useState('');

  // State to hold task description input
  const [description, setDescription] = useState('');

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submit behavior (page reload)
    try {
      // POST request to create a new task
      const res = await axios.post(
        '/api/tasks/create',
        {
          title, // Task title from state
          description, // Task description from state
          status: 'todo', // Default status for new tasks
          boardId, // The board this task belongs to, passed as prop
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Authorization header with token
          },
        }
      );

      // Call callback to inform parent component of the new task
      onTaskCreated(res.data);

      // Reset form fields after successful creation
      setTitle('');
      setDescription('');
    } catch (err) {
      // Log any errors that occur during task creation
      console.log('error creating task : ' + err);
      alert("Error Creating Task !!!")
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
            placeholder="task title"
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
            placeholder="task description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-md"
            style={{
              background: "#2c3e50",
              color: 'white',
              borderRadius: '50px'
            }}
          >
            Create Task
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateTaskForm;
