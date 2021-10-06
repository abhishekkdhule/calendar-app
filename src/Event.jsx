import React from 'react'
import styles from './Event.module.css'
function Event(props) {
    let eventDetails = props.eventDetails;
    console.log(eventDetails)
    return (
        <>
        { eventDetails.length > 0 &&
            (
            <div className={styles.event_main_container}>
                <p><b>Title</b> {eventDetails.title} </p>
                <small>{eventDetails.starttime} - {eventDetails.endtime}</small>
                <p><b>Description</b> {eventDetails.description}</p>
            </div>
            ) 
        }
        </>
    )
}

export default Event
