import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { groupTasksByStatus } from '../utils/utils';
import moment from 'moment';

const TaskBoard = ({ tasks, onDragUpdate, onUpdateTask, onDeleteTask,loading }) => {
  // Group tasks into columns by status (todo, inprogress, done)
  const columns = groupTasksByStatus(tasks);
  

  // Handles task drop logic
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    onDragUpdate(draggableId, destination.droppableId);
  };

  const getDueDateColor = (dueDate) => {
    if(!dueDate) return 'linear-gradient(to bottom, rgb(244, 190, 190), #F0E68C)';

    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0,0,0,0);
    due.setHours(0, 0, 0, 0);

    if(due<today) return 'linear-gradient(to top, rgb(203, 160, 160),hsl(0, 50.00%, 58.40%))'; 
    if(due.getTime() === today.getTime()) return "linear-gradient(to top, rgb(172, 169, 208),rgb(103, 92, 198))"; 
    return 'linear-gradient(to top, rgb(147, 187, 159),rgb(74, 219, 115))';
  }

  // State to track which task description is expanded
  const [expandedCharsByTask, setExpandedCharsByTask] = useState({});

  // Toggle task description expansion
  const toggleExpanded = (taskId, totalChars) => {setExpandedCharsByTask((prev) => 
    {
      const current = prev[taskId] || 55;
      const next = current +140;
      return {
        ...prev,
        [taskId]: current >= totalChars ? 55 : next,
      }
    });
      
  };

  return (
      
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Container to hold all columns */}
 <div className="d-flex overflow-auto w-100 align-items-center justify-content-center flex-nowrap" style={{ minHeight: '400px' }}>
  <div
    className="d-flex align-items-start justify-content-center flex-nowrap w-100"
    style={{
      gap: '20px',
      padding: '10px',
      minHeight: '100%',
    }}
    >
          {/* Loop through each status to render its column */}
          {['todo', 'inprogress', 'done'].map((status) => (
            <Droppable droppableId={status} key={status}>
              
              {(provided) => (
                <div
                className="shadow border-4 border-dark-subtle"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  overflowX: 'auto',
                  flex: '0 0 29%',
                  padding: '20px 40px',
                  minWidth: '355px',
                  maxWidth: '400px',
                  background: status === 'todo' ? 'linear-gradient(to top,rgb(241, 124, 122), #2c3e55)':
                  status === 'inprogress' ? 'linear-gradient(to top,rgb(102, 92, 243), #2c3e55)':
                  'linear-gradient(to top,rgb(91, 238, 118), #2c3e55)', 
                  minHeight: '460px',
                  borderRadius: '20%',
                  boxSizing: 'border-box',
                  color: 'white',
                }}
                >
                  <h3 style={{ textAlign: 'center', fontWeight: 'normal' }}>{status === 'inprogress' ? 'LIVE' : status.toUpperCase()}</h3>

                  {/* Display message when no tasks are present */}
                  {columns[status].length === 0 ? (
                    <h4 style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'normal' }}>
                      No tasks added to show
                    </h4>
                  ) : (
                    // Map each task into a Draggable card
                    columns[status].map((task, index) => (
                      <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                        {(provided, snapshot) => {
                          const dragStyle = provided.draggableProps.style || {};
                          const transform = dragStyle.transform || '';
                          
                          return (
                            <div
                            className="mb-3"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...dragStyle,
                              background: getDueDateColor(task.dueDate),
                              transition: 'transform 0.25s ease, opacity 0.25s ease',
                              opacity: snapshot.isDragging ? 0.8 : 1,
                              transform: `${transform}${snapshot.isDragging ? ' scale(1.13)' : ''}`,
                              padding: '10px',
                              paddingBottom: '95px',
                              flexWrap: 'wrap',
                              minHeight: '255px',
                              borderRadius: '10%',
                              minWidth: '110px',
                              maxWidth: '90%',
                              color: 'black',
                              flexShrink: 1,
                              wordBreak: 'break-word',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                              willChange: 'transform, opacity',
                              marginBottom: '20px',
                              }}
                              >
                              {/* Task Content */}
                              <div
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  flexDirection: 'column',
                                }}
                                >
                                {/* Task Title */}
                                <div style={{ marginBottom: '6px', textAlign: 'center' }}>
                                  <b style={{ display: 'block', marginBottom: '2px' }}>Title</b>
                                  <p style={{ margin: 0, wordBreak: 'break-word' }}>{task.title}</p>
                                </div>

                                {/* Task Description */}
                                <div style={{ marginBottom: '6px', textAlign: 'center' }}>
                                  <b style={{ display: 'block', marginBottom: '2px' }}>Description</b>
                                  <p
                                    style={{
                                      margin: 0,
                                      wordBreak: 'break-word',
                                      overflowWrap: 'break-word',
                                      
                                      
                                      textAlign: 'center',
                                    }}
                                    >
                                    {(task.description || 'No Description to Show !').slice(0, expandedCharsByTask[task.id] || 55)}
                                  </p>
                                  {/* Toggle "Read more"/"Show less" */}
                                  {task.description && task.description.length > 55 && (
                                    <button
                                    onClick={() => toggleExpanded(task.id, task.description.length)}
                                    style={{
                                      marginTop: '4px',
                                      background: 'transparent',
                                      color: 'burlywood',
                                      border: 'none',
                                      cursor: 'pointer',
                                      fontSize: '0.875rem',
                                      padding: 0,
                                    }}
                                    >
                                      {(expandedCharsByTask[task.id] || 55) >= task.description.length ? 'Show less' : 'Read more'}
                                    </button>
                                  )}
                                </div>
                                    <div style={{ marginBottom: '6px', textAlign: 'center' }}>
                                      <b style={{ display: 'block', marginBottom: '2px' }}>dueDate</b>
                                      <p style={{ margin: 0, wordBreak: 'break-word' }}>{task.dueDate}</p>
                                    </div>

                                {/* Task Creation Time */}
                                <div style={{ marginBottom: '8px', textAlign: 'center' }}>
                                  <small style={{ fontStyle: 'italic', color: '#553' }}>
                                    Created {moment(task.createdAt).fromNow()}
                                  </small>
                                </div>
                              </div>

                              {/* Task Buttons */}
                              <div
                                
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  padding: '4px',
                                  gap: '5px',
                                  flexWrap: 'wrap',
                                  width: '100%',
                                }}
                                className="fixed-bottom"
                                >
                                {/* Edit Button */}
                                <button
                                disabled={loading}
                                  type="button"
                                  onClick={() => onUpdateTask(task)}
                                  style={{
                                    
                                    background: 'linear-gradient(to bottom right, #2c3e55, #4a6b8c)',
                                    color: 'white',
                                    borderRadius: '40%',
                                  }}
                                  className="btn btn-sm-sm btn-md shadow border-dark-subtle"
                                  >
                                  Edit
                                </button><br />

                                {/* Delete Button */}
                                <button
                                disabled={loading}
                                  type="button"
                                  onClick={() => onDeleteTask(task.id)}
                                  style={{
                                    
                                    background: 'linear-gradient(to bottom right, #2c3e55, #4a6b8c)',
                                    color: 'white',
                                    borderRadius: '40%',
                                  }}
                                  className="btn btn-sm-sm btn-md shadow border-dark-subtle"
                                  >
                                  Drop
                                </button>
                              </div>
                            </div>
                          );
                        }}
                      </Draggable>
                    ))
                  )}

                  {/* Placeholder required by react-beautiful-dnd */}
                  {provided.placeholder}
                </div>
              )}
          
            </Droppable>

          ))}
        </div>
      </div>
        
    </DragDropContext>
  );
};

export default TaskBoard;
