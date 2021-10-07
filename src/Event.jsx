import React from 'react'
import styles from './Event.module.css'
function Event(props) {
    let eventDetails = props.eventDetails;
    let st = new Date(eventDetails['starttime'].toDate())
    let et = new Date(eventDetails['endtime'].toDate())
    
    return (
        <>
            <div className={styles.event_main_container}>
                <p className={styles.event_text}> {eventDetails.title} </p>
                <p className={styles.event_text}>{st.toLocaleTimeString()} - {et.toLocaleTimeString()}</p>
                <p className={styles.event_text}> {eventDetails.description}</p>
            </div>
        </>
    )
}

export default Event
