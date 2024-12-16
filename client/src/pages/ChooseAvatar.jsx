import React , {useState , useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import Pusher from 'pusher-js';

import '../style/ChooseAvatar.css'
import avatars from '../assets/avatars.json'

import Footer from "../components/Footer"
import Header from "../components/Header"

export default function ChooseAvatar() {

    const [roomId, setRoomId] = useState('')
    const [hostId, setHostId] = useState('')
    const [availableAvatars, setAvailableAvatars] = useState(avatars);
    const [name, setName] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [step, setStep] = useState(1); // Step 1 for name entry, Step 2 for avatar selection

    const [nameAlert, setNameAlert] = useState(false)
    const [changeName, setChangeName] = useState(false)
    
    // Update avatars as they're being submitted

    useEffect(() => {
        // Get roomId into local Storage
        const tempHostId = sessionStorage.getItem('tempHostId');
        if (tempHostId){
            setHostId(tempHostId)
            console.log('you are the host')
        }
    
        if (sessionStorage.getItem('roomId')){
            const id = sessionStorage.getItem('roomId'); // won't hve room id if not host
            sessionStorage.setItem('roomId', id);
            setRoomId(id)
        } else {
            const id = window.location.href.match(/\/([^/]+)\/choose-avatar/)[1]
            sessionStorage.setItem('roomId', id);
            setRoomId(id)
        }

        // Initialize Pusher
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
          cluster: "eu",
        });
    
        const channel = pusher.subscribe('avatars');
    
        // Listen for the 'avatar-selected' event
        channel.bind('avatar-selected', (data) => {
          setAvailableAvatars((prevAvatars) =>
            prevAvatars.filter((avatar) => avatar.id !== data.avatarId)
          );
        });
    
        // Cleanup on component unmount
        return () => {
          channel.unbind_all();
          channel.unsubscribe();
        };
      }, []);

    // Handler for name input
    function handleNameChange(event) {
        setName(event.target.value);
    }

    async function handleSubmit(event) {
        console.log('submit')
        event.preventDefault();
        if (name.trim()) { // Proceed only if name is not empty
            // Check if the user already exists in the database
            const response = await fetch(`/api/participants/room/${roomId}/name?name=${name}`);
            const data = await response.json();
 
            if (data && data.length > 0) {
                // User exists, go to Step 3
                const user = data[0]; // Assuming only one match (same name should have one user)

                // save participant id to local storage
                console.log(user._id)
                sessionStorage.setItem('tempId', user._id);

                // Set selected avatar
                const selected = availableAvatars.find(avatar => avatar.id === user.avatarId); // Find the selected avatar object
                setSelectedAvatar(selected.image);

                setNameAlert(true)
            } else {
                // No user found, go to Step 2 (avatar selection)
                setStep(2);
            }
        }
    }

    // Function to handle avatar selection
    function handleAvatarClick(avatarId) {
        submitAvatarChoice(avatarId); // Submit avatar choice to database
        const selected = availableAvatars.find(avatar => avatar.id === avatarId); // Find the selected avatar object
        setSelectedAvatar(selected.image);
        setStep(3)

    }

    // Function to submit the avatar choice to the database
    async function submitAvatarChoice(avatarId) {
        try {
            console.log('Payload:', { name, avatarId, hostId, roomId });
            const response = await fetch('/api/participants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, avatarId, hostId, roomId })
            });
            const data = await response.json();
            console.log(data.participant._id)
            console.log("userId: ", data.participant._id);
            sessionStorage.setItem('participantId', data.participant._id);
        } catch (error) {
            console.error("Error submitting avatar choice:", error);
        }
    }
    
    const navigate = useNavigate();

    async function startTasting(){

        const userId = sessionStorage.getItem('participantId') ? sessionStorage.getItem('participantId') : sessionStorage.getItem('tempId')
        sessionStorage.setItem('participantId', userId)
        console.log("userId: ", userId)
        console.log("roomId: ", roomId)

        // Make an API call to update the status of all participants in the room to 'waiting'
        try {
            const response = await fetch(`/api/participants/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:JSON.stringify({ status: 'waiting' })
            });
    
            if (!response.ok) {
                throw new Error('Failed to update participant status');
            }
    
            console.log('Participant statuses updated to "waiting" successfully');
    
            // Navigate to the waiting room
            navigate(`/${roomId}/waiting-room`);
        } catch (error) {
            console.error('Error starting the tasting process:', error);
        }
    }

    return (
        <>
        <Header/>

        <div className = "main-container">
        {
            step == 1 &&
            <div className = "form-div">
                <form onSubmit={handleSubmit}>
                    Enter your name:
                    <input 
                        className="name-input"
                        type = "text"
                        value={name}
                        onChange={handleNameChange}
                    />
                    <button type = "submit">next</button>
                </form>            
            </div>
        }

        { // username already exists - is this you?
            step == 1 && nameAlert && !changeName &&
            <>
                <p> User called {name} already exists, is this you?</p>
                <div className="card-layout">
                    <img className="selected-avatar" src = {selectedAvatar}/>
                    <h3 className="name">{name}</h3>
                </div>
                <button onClick={()=>{setStep(3)}}>Yes</button>
                <button onClick={()=>setChangeName(true)}>No</button>
            </>
        }

        { step == 1 && changeName && <p style={{color:'red'}}>Please choose a different user name</p>}

        {
            step == 2 &&
            <div>
                Quick! Select your avatar before it's gone!
                <div className = "avatar-layout">
                    {
                        availableAvatars.map(i => (
                            <div className = "picture" key={i.id} onClick={() => handleAvatarClick(i.id)}>          
                                <img src={i.image} alt={`Avatar ${i.id}`} />
                            </div>
                        ))
                    }
                </div>            
            </div>            
        }


        {
            step == 3 && 
            <>
                <div className="card-layout">
                    <img className="selected-avatar" src = {selectedAvatar}/>
                    <h3 className="name">{name}</h3>
                </div>
                <div>
                    <button onClick={startTasting}> Start <span className="bad-word">drinking</span> tasting</button>
                </div>
            </>
        }

      </div>
    
    <Footer/>
        
    </>

    );
  }