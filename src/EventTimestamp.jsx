import React from 'react'
import styles from './EventTimestamp.module.css'


function EventTimestamp() {
    return (
        <div className={styles.eventtimestamp_main_container}>
            <div className="bg-white per-hour">
                <p className="m-0">00.00 am</p>
                <hr className="m-0"/>
            </div>
            <div className="bg-white ">
                <p className="m-0">00.00 am</p>
                <hr className="m-0"/>
            </div>
            <div className="bg-white ">
                <p className="m-0">00.00 am</p>
                <hr className="m-0"/>
            </div>

        </div>
    )
}

export default EventTimestamp
