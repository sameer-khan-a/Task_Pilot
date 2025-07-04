import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar2 from './NavBar2';
import Footer from './Footer';
import BoardMembers from './BoardMembers';
import moment from 'moment';

const BoardSelector = () => {
  // State to hold all boards fetched from backend
  const [boards, setBoards] = useState([]);

  // State for new board name input
  const [newBoardName, setNewBoardName] = useState('');

  // State to track which board is being edited (null if none)
  const [editingBoardId, setEditingBoardId] = useState(null);

  // State to hold the edited board name during editing
  const [editedName, setEditedName] = useState('');

  // State to hold invite emails keyed by board id
  const [inviteEmails, setInviteEmails] = useState({});  

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
    const soundRef = useRef(null);
      useEffect(() => {
          soundRef.current = new Audio('/sounds/Sound.wav');
      }, [])
  // React Router navigation hook to programmatically navigate between routes
  const navigate = useNavigate();

  // State to trigger refresh for board members lists keyed by board id
  const [memberRefreshKeys, setMemberRefreshKeys] = useState({});

  // Fetch boards and their owner emails from ${import.meta.env.VITE_BACKEND_URL}/api when component mounts
   const fetchBoards = async () => {
      setLoading(true);
      try {
        // Get all boards for the user
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/boards`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Auth token from localStorage
          },
        });

        const boardsData = res.data;

        // For each board, fetch the owner's email
        const boardsWithOwnerEmail = await Promise.all(
          boardsData.map(async (board) => {
            try {
              const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${board.createdBy}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              });
              return {...board, ownerEmail: userRes.data.email};
            } catch(userErr) {
              // If fetching owner fails, set default email
              return {...board, ownerEmail: 'unknown@example.com'};
            }
          })
        );
        
        // Set boards with owner email into state
        setBoards(boardsWithOwnerEmail);
      } catch (err) {
        console.error('Error fetching boards', err);
        alert("Error loading boards !!!");
      }
      finally{
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchBoards();
  }, []);

  // Handler to create a new board
  const handleCreateBoard = async () => {
    if (!newBoardName) return; 
    setError("");// Don't allow empty board names
    setLoading(true);
    try {
      // Create new board via ${import.meta.env.VITE_BACKEND_URL}/api
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/boards/create`,
        { name: newBoardName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Fetch owner's email for the new board
      const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${res.data.createdBy}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
        if(soundRef.current){
        soundRef.current.play().catch(err => console.log("Play error: ", err));
    }
      // Add new board to boards state
      setBoards([...boards, {...res.data, ownerEmail: userRes.data.email}]);
      setNewBoardName(''); // Clear input after creation
    } catch (err) {
      console.error('Error creating Board !!!', err);
      setError("Error Creating Board !!! Try Again");

    }
    finally{
      setLoading(false);
    }
  };

  // Handler to update existing board name
  const handleUpdate = async (boardId) => {
    setLoading(true);
    try {
      // Update board name via ${import.meta.env.VITE_BACKEND_URL}/api
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/boards/${boardId}`,
        { name: editedName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  if(soundRef.current){
        soundRef.current.play().catch(err => console.log("Play error: ", err));
    }
      // Update the board in local state with new data
      const updated = boards.map((b) => (b.id === boardId ? res.data : b));
      setBoards(updated);

      // Clear editing state
      setEditingBoardId(null);
      setEditedName('');
    } catch (err) {
      console.error('Error Updating Board', err);
      alert("Board Updation Failed !!!")
    }
    finally {
      setLoading(false);
    }
  };

  // Handler to delete a board after user confirmation
  const handleDelete = async (boardId) => {
    
    setLoading(true);
    try {
      // Delete board via ${import.meta.env.VITE_BACKEND_URL}/api
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Remove deleted board from state
      setBoards(boards.filter((b) => b.id !== boardId));
    } catch (err) {
      console.error('Error deleting board', err);
      alert("Board deletion Failed !!!");
    }
    finally{setLoading(false)};
  };

  // Handler to leave a shared board after confirmation
  const handleLeaveBoard = async (boardId) => {
    
    setLoading(true);
    try {
      // Post to leave board ${import.meta.env.VITE_BACKEND_URL}/api
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/boards/${boardId}/leave`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
 
      // Remove the left board from state
      setBoards(boards.filter((b)=> b.id !== boardId));
    } catch(err){
      console.error('Error leaving board', err);
      alert("Cannot Leave Board !!!");
    }
    finally{
      setLoading(false);
    }
  };

  // Handler to invite a member to a board
  const handleInvite = async(boardId) => {
    setLoading(true);
    const email = inviteEmails[boardId];
    if(!email) return; // Do nothing if email input is empty

    try {
      // Send invite via ${import.meta.env.VITE_BACKEND_URL}/api
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/invitations/${boardId}/invite`, 
        { email },{headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
      );
  if(soundRef.current){
        soundRef.current.play().catch(err => console.log("Play error: ", err));
    }
      // Trigger refresh of board members component by updating refresh key
      setMemberRefreshKeys(prev => ({
        ...prev,
        [boardId]: (prev[boardId] || 0) + 1,
      }));

      // Clear invite input field for this board
      setInviteEmails({...inviteEmails, [boardId]: ''});
      alert("Invitation Sent");
    } catch(err){
      console.error('Invite error: ', err);
      alert('Failed to invite user !!!');
    } finally {
      setLoading(false);
    }
  }

  // Navigate user to the selected board's detail page
  const gotoBoard = (boardId) => {
    try {
      navigate(`/boards/${boardId}`);
    }  
    catch(err){
      alert(err);
    }  
 
  };  
  
  // Decode current user ID from JWT token in localStorage
  const currentUserId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;
  
  return (
    <div className="container py-5">
      <Navbar2 fetchBoards={fetchBoards}/>
      

      <div
        className="container"
        style={{
          paddingTop: '90px',
          width: '100%',
          paddingBottom: '95px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
        }}
        >
        {/* Section to create new board */}
        <div className="col-12 d-flex gap-3  flex-column  align-items-center justify-content-center">
          <h1 className="text-center" style={{ color: '#2c3e50' }}>
            Manage your Boards
          </h1>

          <input
            type="text"
            className="form-control rounded-4 text-center"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="New board name"
            style={{maxWidth: '200px'}}
          />
          <button
            className="btn"
            disabled={loading}
            style={{
              display: 'flex',
              background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
              color: 'white',
              width: '120px',
              
              borderRadius: '50px',
            }}  
            onClick={handleCreateBoard}
          >
            Create Board

          </button>
           <center>

            {error && (
              <div className="alert alert-danger rounded-5 mt-2 w-100" role="alert" >
                {error}
              </div>      
            )}
            </center>
        </div>

        {/* Section listing all existing boards */}
        <h2 className="text-center" style={{ color: '#2c3e50' }}>
          Select a Board
        </h2>

        <div className="row justify-content-center align-items-start w-100 gy-3 " style={{
                    gap: boards.length === 2
                        ? '90px'
                        : boards.length === 3
                        ? '40px'
                        : boards.length === 4
                        ? '0px'
                        : '0px'
                      }}>
          {boards.length === 0 ? (
            // Show message if no boards available
            <h3 align="center" style={{ color: 'black' }}>
              No boards to show !!!
            </h3>
          ) : (
            

            // Map through boards and display each one
            boards.map((board) => {
              // Check if current user owns the board
              const isOwner = board.createdBy === currentUserId;
              return (
                <div
                  key={board.id}
                  className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center "
                  
                >
                  <div
                    className="shadow text-center"
                    style={{
                      color: 'black',
                      background: 'linear-gradient(to bottom,rgb(244, 190, 190), #F0E68C)',
                      minWidth: '210px',// increased for wider appearance
                      maxWidth: '230px',
                      minHeight: '510px',
                      padding: '20px 40px',
                      borderRadius: '50px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    {editingBoardId === board.id ? (
                      // Edit mode: input and buttons to save or cancel changes
                      <>
                        <input
                          className="form-control rounded-4"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-md rounded-4"
                            disabled={loading}
                            style={{
                              background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
                              color: 'white',
                              
                            }}
                            onClick={() => handleUpdate(board.id)}
                          >
                                           Save
                          </button>
                          <button
                            className="btn btn-md rounded-4"
                            disabled={loading}
                            style={{
                              background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
                              color: 'white',
                              
                            }}
                            onClick={() => setEditingBoardId(null)}
                          >
                                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      // Display mode: show board info and action buttons
                      <>
                        <h5
                          style={{
                            color: "#2c3e50",
                            fontWeight: 'bold',
                            textAlign: 'center',
                          }}
                        >
                          {board.name}
                        </h5>
                        <small style={{color: 'black', fontWeight: 'bold'}}>
                          {isOwner ? 'Owned': 'Shared'}
                        </small>
                        <div style={{ marginBottom: '6px', textAlign: 'center' }}>
                          <small style={{fontStyle: 'italic', color: '#555'}}>
                            Created {moment(board.createdAt).fromNow()}
                          </small>
                        </div>

                        {/* Action buttons */}
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm rounded-4"
                            disabled={loading}
                            style={{
                              background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
                              color: 'white',
                            }}
                            onClick={() => gotoBoard(board.id)}
                          >
                                            Open
                          </button>

                          {/* Show Edit button only for owners */}
                          {isOwner ? (
                            <button
                              className="btn btn-sm rounded-4"
                              
                              disabled={loading}
                              style={{
                                background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
                                color: 'white',
                              }}
                              onClick={() => {
                                setEditingBoardId(board.id);
                                setEditedName(board.name);
                                
                              }}
                            >
                                              Edit
                            </button>
                          ) : <p></p>}

                          {/* Delete button for owners, Leave button for members */}
                          {isOwner ? (
                            <button
                              className="btn btn-sm rounded-4"
                              disabled={loading}
                              style={{
                                background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
                                color: 'white',
                              }}
                              onClick={() => handleDelete(board.id)}
                            >
                                              Delete
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm rounded-4"
                              disabled={loading}
                              style={{
                                background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
                                color: 'white',
                              }}
                              onClick={() => handleLeaveBoard(board.id)}
                            >
                                              Leave
                            </button>
                          )}
                        </div>

                        {/* Component showing members of the board */}
                        <BoardMembers 
                          currentUserId={currentUserId} 
                          boardId={board.id} 
                          boardOwnerEmail={board.ownerEmail} 
                          boardOwnerId={board.createdBy} 
                          refreshKey={memberRefreshKeys[board.id]}
                        />

                        {/* Invite members section visible only to owners */}
                        {isOwner && (
                          <div className='d-flex flex-column align-items-center mt-2'>
                            <input
                              style={{width: '150px'}}
                              type='email'
                              className="form-control mb-2 rounded-4"
                              placeholder="Add member"
                              value={inviteEmails[board.id] || ''}
                              onChange={(e)=> setInviteEmails({...inviteEmails, [board.id]: e.target.value})}
                            />
                            <button
                              className='btn btn-md rounded-4'
disabled={loading}
                              style={{background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)', color: 'white'}}
                              onClick={() => handleInvite(board.id)}
                            >
                                        Invite
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
                           
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BoardSelector;
