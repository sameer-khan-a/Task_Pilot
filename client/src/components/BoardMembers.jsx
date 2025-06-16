import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Component to display members of a specific board
const BoardMembers = ({ boardId, currentUserId, refreshKey, boardOwnerId, boardOwnerEmail }) => {
  const [members, setMembers] = useState([]);
  const [showAll, setShowAll] = useState(false); // Controls 'See more' toggle

  // Fetch members from the API
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/boardmembers/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMembers(res.data); // Store members in state
    } catch (err) {
      console.error("Error fetching board members", err);
    }
  };

  // Run fetchMembers on initial load or when refreshKey changes
  useEffect(() => {
    fetchMembers();
  }, [refreshKey]);

  // Handle removing a member from the board
  const removeMembers = async (userId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/boardmembers/${boardId}/members/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchMembers(); // Refresh member list after removal
    } catch (err) {
      console.error("Failed to remove member", err);
      alert("Couldn't remove member. Try again");
    }
  };

  // Check if board owner is part of the members list
  const ownerIsMember = members.some((m) => m.id === boardOwnerId);

  // Clone current members for modification
  let displayMembers = [...members];

  // Add owner manually if not already present
  if (!ownerIsMember) {
    displayMembers.push({
      id: boardOwnerId,
      email: boardOwnerEmail || 'Board Owner',
      isOwner: true,
    });
  }

  // Filter to avoid showing owner to themselves (when owner is logged in)
  const finalMembersToShow = displayMembers.filter((m) => {
    if (m.id === boardOwnerId && currentUserId === boardOwnerId) {
      return false;
    }
    return true;
  });

  // Slice members to show either all or just first 2
  const displayedMembers = showAll ? finalMembersToShow : finalMembersToShow.slice(0, 2);

  return (
    <div className="text-center">
      <h4 style={{ color: '#2c3e50' }}>👥 Board Members</h4>

      <ol className="mb-0">
        {displayedMembers.length === 0 ? (
          <p style={{ color: 'black', fontWeight: 'bold' }}>
            No members to show !!
          </p>
        ) : (
          displayedMembers.map((member) => (
            <li key={member.id} style={{ color: '#800000', fontWeight: 'bold', marginBottom: '6px' }}>
              {member.email}
              {/* Show remove button only if logged-in user is board owner and not the owner themselves */}
              {currentUserId === boardOwnerId && member.id !== boardOwnerId && (
                <>
                <br />
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeMembers(member.id)}
                  style={{
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 8px',
                    cursor: 'pointer',
                    fontWeight: 'normal',
                }}
                >
                  Remove
                </button>
              </>
              )}
            </li>
          ))
        )}
      </ol>

      {/* Show toggle if there are more than 2 members */}
      {finalMembersToShow.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: 0,
            color: '#400000',
            fontSize: '0.9rem',
          }}
        >
          {showAll ? 'See Less' : 'See more'}
        </button>
      )}
    </div>
  );
};

export default BoardMembers;
