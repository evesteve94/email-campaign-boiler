# Använder en officiell Docker-bild för Node.js, version 20, baserad på Alpine Linux för en liten och snabb bild.
FROM node:20-alpine

# Sätter arbetskatalogen inuti containern till /app. Alla efterföljande kommandon kommer att köras i denna katalog.
WORKDIR /app

# Kopierar över package.json och package-lock.json (om det finns) från projektmappen på värddatorn till den aktuella katalogen i containern (/app).
COPY package*.json ./

# Kör npm install för att installera alla projektets beroenden. Detta gör att Node.js-biblioteken installeras inuti containern.
RUN npm install

# Kopierar över resten av projektfilerna från värddatorn till containern. Detta inkluderar källkodsfiler som behövs för att starta frontend-appen.
COPY . .

# Anger att port 5173 ska vara öppen och tillgänglig från containern. Port 5173 är standardporten för Vite, som ofta används i frontendutveckling.
EXPOSE 5173

# Startar frontend-appen i utvecklingsläge genom att köra npm run dev, vilket är ett skript i package.json.
CMD npm run dev
