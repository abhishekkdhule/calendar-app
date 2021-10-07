import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './App.module.css';
import EventTimestamp from './EventTimestamp'
import Event from './Event'
import { db } from './firebase'


function App() {
  const [events, setEvents] = useState({})
  const [value, onChange] = useState(new Date());
  const [username, setUsername] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [finaUser, setFinalUser] = useState('')
  const [headStyles, setHeadStyles] = useState(
    {
      SectionOne: styles.initial_head_section_one,
      SectionTwo: styles.initial_head_section_two,
      welcomeSection: "d-none"
    }
  )
  
  const [eventForm, setEventForm] = useState({"title": "", "description": "", "date": "", "starttime": "", "duration": "15", "type": "event"})

  const newUser = () => {
    setHeadStyles({ SectionOne: styles.initial_head_section_two, SectionTwo: styles.initial_head_section_one, loginBtn: "d-none", createBtn: "btn btn-primary", welcomeSection: "d-none" })
  }

  const existingUser = () => {
    setHeadStyles({ SectionOne: styles.initial_head_section_two, SectionTwo: styles.initial_head_section_one, createBtn: "d-none", loginBtn: "btn btn-primary", welcomeSection: "d-none" })
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
              setHeadStyles({ SectionOne: "d-none", SectionTwo: "d-none", welcomeSection: "d-flex justify-content-between m-4" })
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
          setHeadStyles({ SectionOne: "d-none", SectionTwo: "d-none", welcomeSection: "d-flex justify-content-between m-4" })
        } else {
          alert("User does not exists!")
        }
      });
  }

  const handleDateClick = (value) => {
    if (username) {
      setLoading(true)
      let localEventDict = {}
      let eventDocs = db.collection('events').where('username', '==', username).orderBy('starttime')
      eventDocs.get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let date = new Date((doc.data()['starttime']).toDate())
            let docDate = date.toLocaleDateString()
            let selectedDate = value.toLocaleDateString()
            if (docDate === selectedDate) {
              let time = date.toLocaleTimeString().substring(0, 2)
              let listOfEvents;
              if (localEventDict.hasOwnProperty(time)) {
                listOfEvents = localEventDict[time]
              } else {
                localEventDict[time] = []
                listOfEvents = localEventDict[time]
              }
              listOfEvents.push(doc.data())

            }
          })
          setEvents(localEventDict)
          setLoading(false)
        })
        .catch((error) => {
          alert("Error getting documents: ", error);
          setLoading(false)
        });
    }
  }

  const createNewEvent = (e) => {    
    setLoading(true)
    console.log(eventForm)
    if(eventForm['title'].length > 0 && eventForm['date'].length > 0  && eventForm['starttime'].length > 0  && eventForm['duration'].length > 0  && eventForm['type'].length > 0){
      if(eventForm['title'] > 50) alert("Title should not exceed 50 characters!")
      else if(eventForm['description'] > 200) alert("Description should not exceed 200 characters!")
      else {
        let eventDate = new Date(eventForm['date'])
        let duration = parseInt(eventForm['duration'])
        // eventDate = new Date(eventDate.getMinutes())
        eventDate.setMinutes(eventDate.getMinutes()+eventDate.getTimezoneOffset());
        eventDate.setMinutes(eventDate.getMinutes() + (parseInt(eventForm['starttime'].substring(0,2)))*60 + (parseInt(eventForm['starttime'].substring(3))) )
        let endDate = new Date(eventDate)
        endDate.setMinutes(eventDate.getMinutes() + duration)
        console.log(eventDate.toLocaleString(), endDate.toLocaleString())
        db.collection("events").doc().set({
          username: username,
          title: eventForm['title'],
          description: eventForm['description'],
          starttime: eventDate,
          endtime: endDate,
          type: eventForm['type']
        })
        .then(()=>{
          setLoading(false)
        })
        .catch((error) => {
          alert("Internal Server Error, Try again later!");
          setLoading(false)
        });
      }
    } else {
      alert("Incomplete Details")
    }
  }
  // console.log(events)
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
            {/* modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Add Event</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">Title</label>
                      <input type="text" onChange={(e)=>setEventForm({...eventForm, "title": e.target.value.trim()})} className="form-control" id="title" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="Description" className="form-label">Description</label>
                      <textarea className="form-control" onChange={(e)=>setEventForm({...eventForm, "description": e.target.value.trim()})} id="description" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">Type</label>
                        <select className="form-select" id="type" onChange={(e)=>setEventForm({...eventForm, "type": e.target.value})}>
                          <option value="event" selected>Event</option>
                          <option value="task">Task</option>
                          <option value="reminder">Reminder</option>
                        </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">Date</label>
                      <input type="date" className="form-control" id="date" onChange={(e)=>setEventForm({...eventForm, "date": e.target.value})} />
                    </div>
                    <div className="mb-3 d-flex justify-content-between">
                      <div className="w-50">
                        <label htmlFor="time" className="form-label">StartTime</label>
                        <input type="time" className="form-control" id="time" onChange={(e)=>setEventForm({...eventForm, "starttime": e.target.value})} />
                      </div>
                      <div>
                        <label htmlFor="duration" className="form-label">Duration</label>
                        <select className="form-select" id="duration" onChange={(e)=>setEventForm({...eventForm, "duration": e.target.value})}>
                          <option value="15" selected>15 Min</option>
                          <option value="30">30 Min</option>
                          <option value="45">45 Min</option>
                          <option value="60">60 Min</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={(e)=>createNewEvent(e)}>Save changes</button>
                  </div>
                </div>
              </div>
            </div>

            <div className={headStyles.welcomeSection}>
              <h4 className="">{value.toDateString()}</h4>
              <h3 className="">Hello {username}!!!</h3>
              <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Add Event</button>
            </div>
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
            {finaUser ? (
              <div className="row ms-2 me-2 mt-3">
                <div className="col-md-3 p-2">
                  <h5 className="text-center mb-4 p-3 bg-primary text-white shadow-lg">Calendar</h5>
                  <Calendar
                    onChange={(value, event) => handleDateClick(value)}
                    value={value}
                  />
                </div>
                <div className="col-md-6 p-0 pt-2">
                  <h5 className="text-center mb-4 p-3 bg-light shadow-lg">Timeline of Events</h5>
                  <EventTimestamp allevents={events} />
                </div>
                <div className="col-md-3 p-2">
                  <h5 className="text-center mb-4 p-3 text-white bg-primary shadow-lg">All Events </h5>
                  {
                    Object.keys(events).length === 0 ? (<div className={styles.no_events}>No events yet!</div>) : (
                      Object.keys(events).map(function (keyName, keyIndex) {
                        return (
                          events[keyName].map((eventDetails) => {
                            return <Event eventDetails={eventDetails} />
                          }))
                      })
                    )
                  }
                </div>
              </div>
            ) : (
              <br />
            )
            }
          </>
        )
      }
    </>
  );
}

export default App;
