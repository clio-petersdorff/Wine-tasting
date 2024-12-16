import {useEffect} from 'react'

import "./App.css"
import NewTasting from "./pages/NewTasting";

import Footer from "./components/Footer"
import Header from "./components/Header"

export default function App() {
  
  // TEMPORARY
  // useEffect(() => {
  //   localStorage.clear();
  // },[])

  return (
    <div>
      <Header/>

      <NewTasting/>

      <Footer/>

    </div>

  );
}