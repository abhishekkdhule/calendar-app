import React from 'react'
import styles from './EventTimestamp.module.css'


function EventTimestamp(props) {
    let timeStamp = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
    let events = props.allevents
    return (
        <div className={styles.eventtimestamp_main_container}>
            { 
            timeStamp.map((curr)=>{

                return (<div className={styles.per_hour}>
                            <p className="m-0 me-3">{curr}.00</p>
                            {
                                (events.hasOwnProperty(curr)) && events[curr].map((event)=>{
                                    return <span class={styles.event_title}>{event.title}</span>
                                })
                                
                            }
                        </div>)
            })
                
            }
        </div>
    )
}

export default EventTimestamp
