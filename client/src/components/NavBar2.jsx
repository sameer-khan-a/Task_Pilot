import { useState, useEffect } from "react";
import axios from "axios";
import {io} from "socket.io-client";
import { useRef } from "react";
function Navbar2 ({fetchBoards}) {
// State to store pending board invitations
const socketRef = useRef(null);
const [invitations, setInvitations] = useState([]);
const [notifications, setNotifications] = useState([]);
// Function to handle user logout
const handleLogout = () => {
// Remove auth token from localStorage to log out user
localStorage.removeItem('token');
// Redirect to login page
window.location.href = '/login';
};
const soundRef = useRef(null);
useEffect(() => {
    soundRef.current = new Audio('/sounds/Notification.mp3.mp3');
}, [])
// Fetch all pending invitations for the logged-in user
const fetchInvitations = async () => {
try {
const token = localStorage.getItem('token'); // Get auth token
const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/invitations/my`, {
headers: {Authorization: `Bearer ${token}`},
});
setInvitations(res.data); // Store invitations in state
} catch(err) {
console.error("Error fetching invitations: ", err); // Log error
}
};
const fetchTaskNotifications = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notifications`, {
            headers: {Authorization: `Bearer ${token}`},
        });
        console.log(res.data);
        setNotifications(res.data);
    } catch(err){
        console.error("Error fetching task notifications: ", err);
    }
};
const markNotificationAsRead = async (notificationId) => {
    try {
        const token = localStorage.getItem('token');
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/${notificationId}/read`, null,  {
            headers: {Authorization: `Bearer ${token}`},
        });
        fetchTaskNotifications();
    } catch(err){
        console.error("Failed to mark notification as read: ", err);
    }
};
// Function to accept or decline an invitation
const respondToInvitation = async (invitationId, action) => {
try {
const token = localStorage.getItem('token'); // Get auth token
// Send response (accepted/declined) to backend
await axios.post(
`${import.meta.env.VITE_BACKEND_URL}/api/invitations/${invitationId}/respond`,
{response: action},
{
headers: {Authorization: `Bearer ${token}`},
}
);
// Remove the handled invitation from UI
setInvitations(prev => prev.filter(inv => inv.id !== invitationId));

// If accepted, refresh board list in parent component
if(action === 'accepted'){
fetchBoards();
}
} catch(err){
console.error(`Error on ${action}:`, err); // Log error
}
};

// Fetch invitations when component mounts
useEffect(() => {
const token = localStorage.getItem('token');
if(!token) return;

const userId = JSON.parse(atob(token.split('.')[1])).id;
const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ['websocket'],
    withCredentials: true,
});
socketRef.current = socket;
socket.emit('join', `user-${userId}`);
    
socket.on("notification:new", (newNotification) => {
    console.log("Recieved new notification" + newNotification);
    setNotifications(prev => [newNotification, ...prev]);
    if(soundRef.current){
        soundRef.current.play().catch(err => console.log("Play error: ", err));
    }
});
socket.on("notification:delete", ({ taskId }) => {
    setNotifications(prev =>
      prev.filter(n => n.taskId !== taskId)
    );
        if(soundRef.current){
        soundRef.current.play().catch(err => console.log("Play error: ", err));
    }
  });
socket.on("notification:refresh", () => {
      console.log("Received notification: refresh");
      fetchTaskNotifications();
          if(soundRef.current){
        soundRef.current.play().catch(err => console.log("Play error: ", err));
    }
  });
  socket.on("notification:boardLeft", ({boardId}) => {
    console.log("Board left triggerd");
    setNotifications(prev => prev.filter(n=> n.boardId !== boardId));
    fetchBoards();
        if(soundRef.current){
        soundRef.current.play().catch(err => console.log("Play error: ", err));
    }
  })
socket.on("notification:update", (updatedNotification) => {
    console.log("Received updated notification" + updatedNotification);
    setNotifications(prev => 
        prev.map(n=>
            n.id === updatedNotification.id ? updatedNotification : n
        )
    )
        if(soundRef.current){
        soundRef.current.play().catch(err => console.log("Play error: ", err));
    }
})
fetchInvitations();
fetchTaskNotifications();
return () => socket.disconnect();
}, []);
const token = localStorage.getItem("token");
const userId = token ? JSON.parse(atob(token.split(".")[1])).id: null;

const personalTaskNotifs = notifications.filter(n => n.createdBy=== userId);
const groupTaskNotifs = notifications.filter((n) => n.createdBy!== userId);
return (
<nav
className="navbar navbar-expand-lg navbar-dark fixed-top shadow"
style={{
background: 'linear-gradient(to bottom right, #2c3e50, #4a6b8c)',
backgroundSize: 'cover',
zIndex: 1000,
paddingLeft: '1rem',
paddingRight: '1rem',
}}
>
<div className="container">
{/* Brand name */}
<a className="navbar-brand" style={{color: 'rgb(200, 218, 219)'}} href="/">
TaskPilot
</a>

{/* Navbar toggle button for mobile view */}
<button
className="navbar-toggler"
type="button"
data-bs-toggle="collapse"
data-bs-target="#navbarText"
aria-controls="navbarText"
aria-expanded="false"
aria-label="Toggle navigation"
>
<span className="navbar-toggler-icon"></span>
</button>

{/* Navbar links and text */}
<div className="collapse navbar-collapse" id="navbarText">
<ul className="navbar-nav me-auto mb-2 mb-lg-0">
{/* Home link */}
<li className="nav-item">
<a
className="nav-link active"
style={{color: 'rgb(200, 218, 219)'}}
aria-current="page"
href="/"
>
Home
</a>
</li>

{/* Logout button */}
<li className="nav-item">
<button
className="nav-link active"
style={{color: 'rgb(200, 218, 219)'}}
aria-current="page"
onClick={handleLogout}
>
Logout
</button>
</li>
</ul>

{/* Right-side section: Invitations and motto */}
<div className="d-flex align-items-center gap-3">
<div className="dropdown position-relative">
{/* Bell icon button with badge for pending invitations */}
<button
className="btn btn-md position-relative"
type="button"
id="invitationDropdown"
data-bs-toggle="dropdown"
aria-expanded="false"
style={{background: "transparent", border: "none", color: "white"}}
>
<i className="bi bi-bell fs-5"></i>

{/* Red badge showing number of pending invitations */}
{(invitations.length + notifications.length) > 0 && (
<span
className="position-absolute translate-middle badge rounded-pill bg-danger"
style={{top: '10px', left: '40px', fontSize: '0.7rem'}}
>
{invitations.length + notifications.length}
</span>
)}
</button>

{/* Dropdown list showing invitation messages */}
<ul
className="dropdown-menu dropdown-menu-start "
aria-labelledby="invitationDropdown"
style={{minWidth: '300px', maxHeight: '80vh', overflowY: 'auto', background: 'linear-gradient(to bottom,rgb(244, 190, 190), #F0E68C)'}}
>
<li className="dropdown-header fw-bold">Invitation alerts</li>
{/* Show message if no invitations */}
{invitations.length === 0 ? (
<li className="dropdown-item text-muted">No Invitations</li>
) : (
// List all invitations with accept/reject buttons
invitations.map(inv => (
<li key={inv.id} className="dropdown-item d-flex flex-column">
<span><strong>Invitation to join {inv.Board.name} Board </strong> <br /><small>by {inv.Inviter.email}</small> </span>
<div className="d-flex justify-content-start mt-1">
<button
className="btn btn-sm btn-success me-2"
onClick={() => respondToInvitation(inv.id, 'accepted')}
>
Accept
</button>
<button
className="btn btn-sm btn-danger"
onClick={() => respondToInvitation(inv.id, 'declined')}
>
Reject
</button>
</div>
</li>
))
)}
<li>
    <hr className="dropdown-divider" />
</li>
<li className="dropdown-header fw-bold">Personal Task alerts</li>
{personalTaskNotifs.length===0 ? (
    <li className="dropdown-item text-muted">No Personal Task Notifications</li>
): (
    personalTaskNotifs.map((n) => {
        const [firstLine, secondLine] = n.message.split("\n");
        return (
            <li key={`noti-${n.id}`}
            className={`dropdown-item ${n.isRead ? "text-muted": ""}`}
            >
                <span>
                    {firstLine}
                    {!n.isRead && (
                        <span>
                            <br />
                        <span className="badge bg-warning text-dark ms-2">New</span>
                        
                    </span>
                    )}
                    
                </span>
                <br />
                <span className="small text-muted">-{secondLine}</span>
                <br />
                 {!n.isRead && (
                        <button className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() => markNotificationAsRead(n.id)}
                        >
                            Mark as read
                        </button>
                    )}
            </li>
            
            
        );
    })

)}
<li>
    <hr className="dropdown-divider" />
</li>
<li className="dropdown-header fw-bold">Group Task alerts</li>
{groupTaskNotifs.length===0 ? (
    <li className="dropdown-item text-muted">No Group Task Notifications</li>
): (
    groupTaskNotifs.map((n) => {
        const [firstLine, secondLine] = n.message.split("\n");
        return (
            <li key={`noti-${n.id}`}
            className={`dropdown-item ${n.isRead ? "text-muted": ""}`}
            >
                <span>
                    {firstLine}
                    {!n.isRead && (
                        <span>

                <br />
                        <span className="badge bg-warning text-dark ms-2">New</span>
                        </span>
                        
                    )}
                    
                </span>
                <br />
                <span className="small text-muted">-{secondLine}</span>
                <br />
                 {!n.isRead && (
                        <button className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() => markNotificationAsRead(n.id)}
                        >
                            Mark as read
                        </button>
                    )}
            </li>
            
            
        );
    })

)}
</ul>
</div>
  <span
              className="navbar-text"
              style={{ color: "rgb(200, 218, 219)", fontWeight: "bold" }}
            >
              Where Productivity Takes Flight !
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar2;