import dotenv from 'dotenv';
dotenv.config();

const PORT = parseInt(`${process.env.PORT || 3000}`);

import app from './app';

app.listen(PORT, '0.0.0.0', () => console.log(`Server is running at ${PORT}.`));

// rodar o build e o deploy novamente (agora com o host especificado)



