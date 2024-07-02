import express from 'express';
import {Run} from '../logic/CollateData.js'
const app = express()
const port = 3000

const StartServer = () => {
    app.get('/', (req, res) => {
        Run().then((response) => {
            res.setHeader('content-type', 'text/plain');
            res.status(200).send(response)
        })
    })

    app.listen(port, () => {
        console.log(`Server Started on port: ${port}`)
    })
}
export {StartServer}