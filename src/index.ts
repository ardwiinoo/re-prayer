import App from "./services/app"

const API_URL = 'https://api.myquran.com/v2/sholat'
const app = new App(API_URL)

app.run()