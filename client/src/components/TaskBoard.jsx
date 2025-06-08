import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { groupTasksByStatus } from '../utils/utils';
import moment from 'moment';

const TaskBoard = ({ tasks, onDragUpdate, onUpdateTask, onDeleteTask }) => {
  // Group tasks into columns by status (todo, inprogress, done)
  const columns = groupTasksByStatus(tasks);

  // Handles task drop logic
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    onDragUpdate(draggableId, destination.droppableId);
  };

  // State to track which task description is expanded
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  // Toggle task description expansion
  const toggleExpanded = (id) => setExpandedTaskId((prev) => (prev === id ? null : id));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Container to hold all columns */}
 <div className="d-flex overflow-auto w-100 align-items-center justify-content-center" style={{ minHeight: '400px' }}>
  <div
    className="d-flex ms-5 ps-5 ms-sm-0 ps-sm-0 align-items-start justify-content-center"
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
                    flex: '0 0 28%',
                    padding: '20px',
                    maxWidth: '360px',
                    background:
                      status === 'todo'
                        ? 'rgb(91, 130, 169)'
                        : status === 'inprogress'
                        ? 'rgb(60, 88, 116)'
                        : '#2c3e50',
                    minHeight: '320px',
                    borderRadius: '20%',
                    boxSizing: 'border-box',
                    color: 'white',
                  }}
                >
                  <h3 style={{ textAlign: 'center', fontWeight: 'normal' }}>{status.toUpperCase()}</h3>

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
                                background: '#f4f1de',
                                transition: 'transform 0.25s ease, opacity 0.25s ease',
                                opacity: snapshot.isDragging ? 0.8 : 1,
                                transform: `${transform}${snapshot.isDragging ? ' scale(1.13)' : ''}`,
                                padding: '10px',
                                paddingBottom: '95px',
                                flexWrap: 'wrap',
                                minHeight: '270px',
                                borderRadius: '10%',
                                minWidth: '120px',
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
                                      ...(expandedTaskId === task.id
                                        ?{}:{
                                          display: '-webkit-box',
                                          WebkitLineClamp: expandedTaskId === task.id ? 'none' : 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                        }
                                      ),
                                      textAlign: 'center',
                                    }}
                                  >
                                    {task.description || 'No Description to Show !'}
                                  </p>
                                  {/* Toggle "Read more"/"Show less" */}
                                  {task.description && task.description.length > 65 && (
                                    <button
                                      onClick={() => toggleExpanded(task.id)}
                                      style={{
                                        marginTop: '4px',
                                        background: 'transparent',
                                        color: '#007bff',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        padding: 0,
                                      }}
                                    >
                                      {expandedTaskId === task.id ? 'Show less' : 'Read more'}
                                    </button>
                                  )}
                                </div>

                                {/* Task Creation Time */}
                                <div style={{ marginBottom: '8px', textAlign: 'center' }}>
                                  <small style={{ fontStyle: 'italic', color: '#555' }}>
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
                                  flexWrap: 'wrap',
                                  gap: '10px',
                                  width: '100%',
                                }}
                                className="fixed-bottom"
                              >
                                {/* Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => onUpdateTask(task)}
                                  style={{
                                    height: 'auto',
                                    flex: '1 1 40%',
                                    minWidth: '100px',
                                    maxWidth: '100px',
                                    background: '#2c3e50',
                                    color: 'white',
                                    borderRadius: '40%',
                                  }}
                                  className="shadow border-dark-subtle"
                                >
                                  Edit
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => onDeleteTask(task.id)}
                                  style={{
                                    height: 'auto',
                                    flex: '1 1 40%',
                                    minWidth: '80px',
                                    maxWidth: '100px',
                                    background: '#2c3e50',
                                    color: 'white',
                                    borderRadius: '40%',
                                  }}
                                  className="shadow border-dark-subtle"
                                >
                                  Delete
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
