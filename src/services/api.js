import axios from 'axios'

export default axios.create({
    baseURL: "http://gateway.marvel.com/v1/public"
})