import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './App.module.css';
import EventTimestamp from './EventTimestamp'
import Event from './Event'
import { db } from './firebase'


let events = {
  "00": [],
  "01": [],
  "02": [],
  "03": [],
  "04": [],
  "05": [],
  "06": [],
  "07": [],
  "08": [],
  "09": [],
  "10": [],
  "11": [],
  "12": [],
  "13": [],
  "14": [],
  "15": [],
  "16": [],
  "17": [],
  "18": [],
  "19": [],
  "20": [],
  "21": [],
  "22": [],
  "23": []
}

function App() {

  const [value, onChange] = useState(new Date());
  const [username, setUsername] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [finaUser, setFinalUser] = useState('')
  const [headStyles, setHeadStyles] = useState(
    {
      SectionOne: styles.initial_head_section_one,
      SectionTwo: styles.initial_head_section_two,
      welcomeText: "d-none"
    }
  )

  const newUser = () => {
    setHeadStyles({ SectionOne: styles.initial_head_section_two, SectionTwo: styles.initial_head_section_one, loginBtn: "d-none", createBtn: "btn btn-primary", welcomeText: "d-none" })
  }

  const existingUser = () => {
    setHeadStyles({ SectionOne: styles.initial_head_section_two, SectionTwo: styles.initial_head_section_one, createBtn: "d-none", loginBtn: "btn btn-primary", welcomeText: "d-none" })
  }

  const createUser = () => {
    setLoading(true)
    let userDoc = db.collection('users').doc(username)
    userDoc.get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          setLoading(false)
          alert("User already Exists")
          setUsername("")
        } else {
          let date = new Date()
          db.collection("users").doc(username).set({
            username: username,
            timestamp: date
          })
            .then((docRef) => {
              localStorage.setItem("cal_username", username)
              setHeadStyles({ SectionOne: "d-none", SectionTwo: "d-none", welcomeText: "text-center mt-2" })
              setLoading(false)
              setFinalUser(username)
            })
        }
      });

  }

  const loginUser = () => {
    setLoading(true)
    let userDoc = db.collection('users').doc(username)
    userDoc.get()
      .then((docSnapshot) => {
        setLoading(false)
        if (docSnapshot.exists) {
          localStorage.setItem("cal_username", username)
          setFinalUser(username)
          setHeadStyles({ SectionOne: "d-none", SectionTwo: "d-none", welcomeText: "text-center mt-2" })
        } else {
          alert("User does not exists!")
        }
      });
  }

  const handleDateClick = (value) => {
    
    if(username){
      setLoading(true)
      let eventDocs = db.collection('events').where('username', '==', username).orderBy('starttime')
      eventDocs.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let date = new Date((doc.data()['starttime']).toDate())
            let docDate = date.toLocaleDateString()
            let selectedDate = value.toLocaleDateString()
            if(docDate === selectedDate){
              let time = date.toLocaleTimeString().substring(0,2)
              let listOfEvents = events[time]
              listOfEvents.push(doc.data())
            }
        })
        setLoading(false)
        // console.log(events)
      })
      .catch((error) => {
          alert("Error getting documents: ", error);
          setLoading(false)
      });
    }
    
  }

  return (
    <>
      {isLoading ?
        (
          <div className="text-center " style={{ marginTop: "250px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <h3 className={headStyles.welcomeText}>Hello {username}!!!</h3>
            <div className="d-flex ">
              <div className={headStyles.SectionOne}>
                <button className="btn btn-primary" onClick={() => newUser()}>
                  New User
                </button>
                <button className="btn btn-primary" onClick={() => existingUser()}>
                  Existing User
                </button>
              </div>
              <div className={headStyles.SectionTwo}>
                <input type="text" className="" onChange={(e) => setUsername(e.target.value.trim())} value={username} />
                <button className={headStyles.createBtn} onClick={() => createUser()}>Create User</button>
                <button className={headStyles.loginBtn} onClick={() => loginUser()}>Login</button>
              </div>
            </div>
            { finaUser ? (
            <div className="row ms-2 me-2">
              <div className="col-md-3 p-2">
                <Calendar
                  onChange={(value, event) => handleDateClick(value)}
                  value={value}
                />
              </div>
              <div className="col-md-6 p-2 ">
                <EventTimestamp />
              </div>
              <div className="col-md-3 p-2">
                {
                  Object.keys(events).map(function(keyName, keyIndex) {
                    if(events[keyName].length>0){ 
                      return (<p>{events[keyName]}</p>)
                      // events[keyName].map((eventDetails)=>{
                      //   return <Event  eventDetails={eventDetails} />
                      // })
                    }
                    
                  })
                }               
              </div>
            </div>
            ): (
              <br/>
            )
            }   
          </>
        )
      }
    </>
  );
}

export default App;
