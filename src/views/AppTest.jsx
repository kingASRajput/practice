import React, { useEffect, useState } from 'react'
import axios from 'axios'
function AppTest() {
    const [avlData, setAvlData] = useState([])
    useEffect(() => {
        const photoData = {
            albumId: 1
        };

        // fetch('https://jsonplaceholder.typicode.com/photos', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(photoData)
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         console.log(data);
        //         setAvlData((prevPhotos) => [...prevPhotos, data]);
        //     });
        axios.get('https://jsonplaceholder.typicode.com/photos', { params: photoData }).then((Response) => {
            console.log(Response)
            setAvlData(Response)
        })

    }, [])
    console.log(avlData, 'jkoj')
    return (
        <>
            <div className='main-wrapper'></div>
        </>
    )
}

export default AppTest