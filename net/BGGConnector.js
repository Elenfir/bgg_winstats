import axios from 'axios'
import { xml2json } from '@codask/xml2json'

const GetData = async () => {
    return new Promise((resolve, reject) =>  {
        axios({
            method: 'get',
            url: process.env.URL + "/plays",
            responseType: 'xml',
            params: {
                username: process.env.BGG_USERNAME,
                mindate: "2024-01-01"
            }
        }).then(function (response) {
            resolve(xml2json(response.data))
        });
    })
}


export {GetData}