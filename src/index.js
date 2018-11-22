require('dotenv').config();
import server from 'server';

const port = process.env.PORT || 5050
server.listen(port, () => console.log(`API server started on ${port}`))