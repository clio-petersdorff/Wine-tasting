import React , {useState , useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import Pusher from 'pusher-js';

import avatars from '../assets/avatars.json'

import Footer from "../components/Footer"
import Header from "../components/Header"

export default function WaitingRoom() {
  const roomId = sessionStorage.getItem('roomId');
  const hostId = sessionStorage.getItem('tempHostId')
  const userId = sessionStorage.getItem('participantId')

  const [starting, setStarting] = useState(false);


  const [people, setPeople] = useState([])
  const [laggards, setLaggards] = useState([])

  const navigate = useNavigate()
  
  useEffect(() => {

      async function getPeople(){ 

        const response = await fetch(`/api/participants/room/${roomId}`)
        const data = await response.json();
        console.log(data)

        // Filter participants to only those with "waiting" status
        const waitingPeople = data.filter(person => person.status === "waiting");
        setPeople(waitingPeople); // Update people to only include those waiting

        const laggingPeople = data.filter(person => person.status === 'choosing avatar')
        setLaggards(laggingPeople)

        // Find and set the avatar image for each person
        const peopleWithImages = waitingPeople.map(person => {
          const img = avatars.find(avatar => avatar.id === person.avatarId);
          return { ...person, avatarImage: img ? img.image : '' };
        });
        
      } 
  
      getPeople()

      // Initialise Pusher
      const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
        cluster: "eu",
      });
    
      // Subscribe to the room's channel
      const channel = pusher.subscribe(`room-${roomId}`);
    
      // Listen for participant updates
      channel.bind('participantUpdated', (data) => {
          getPeople(); // Fetch the updated participants list
      });

      channel.bind('participantAdded', (data) => {
          getPeople(); // Fetch the updated participants list
      });

      // Listen for the "tastingStarted" event
      channel.bind('tastingStarted', (data) => {
        console.log('Tasting started event received:', data);
        navigate(data.redirectTo);
      });
    
      // Cleanup on component unmount
      return () => {
          channel.unbind_all();
          pusher.unsubscribe(`room-${roomId}`);
      };
  
    },[])
  

    const startTasting = async () => {
      try {
        setStarting(true);
        const response = await fetch(`/api/room/${roomId}/start-tasting`, {
          method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to start tasting');
        console.log('Tasting started');
      } catch (error) {
        console.error('Error starting tasting:', error);
      } finally {
        setStarting(false);
      }
    };
    
    return (
      <div className = "main-container">
        
        <div className="header">
          <Header/>
        </div>
        
        <h3> Ready to start tasting:</h3>
        <div className = "avatar-layout">

          {
            people.map((person) => (
              <div className="card-layout" key={person._id}>
                <img
                  className="selected-avatar"
                  src={avatars.find(avatar => avatar.id === person.avatarId).image}
                  alt={person.name}
                />
                <h3 className="name">{person.name}</h3>
              </div>                        
            ))
          }
        </div>

        <div>
        {laggards.length > 0 && <h3>Still waiting on:</h3>}
        <div className="avatar-layout">
          {laggards.map(person => (
            <div className="card-layout" key={person._id}>
              {avatars.find(avatar => avatar.id === person.avatarId) ? (
                <img
                  className="selected-avatar"
                  src={avatars.find(avatar => avatar.id === person.avatarId)?.image}
                  alt={person.name}
                />
              ) : (
                <div className="placeholder-avatar">
                  <span>?</span>
                </div>
              )}
              <h3 className="name">{person.name}</h3>
            </div>
          ))}
        </div>

        {laggards.length > 0 && <p>Once everyone is ready to start tasting, the host can start the wine tasting process</p>}
        {laggards.length === 0 && !hostId && <p>If you want to start drinking - nudge the host!</p>}

          {
            hostId && laggards.length === 0 &&
            <>
              <p>When the waiting room is full you (the host) can start the tasting</p>
              <button onClick={startTasting} disabled={starting}>
                {starting ? 'Starting...' : 'Let the tasting begin'}
              </button>
            </>
          
          }
        </div>

        <div className="footer">
          <Footer/>
        </div>
        
      </div>
    );
  }