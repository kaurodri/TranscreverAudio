import axios from 'axios';

export default axios.create({
    baseURL: 'https://backend-transcrever-audio.vercel.app'
});
