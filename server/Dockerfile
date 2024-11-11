# Använder en officiell Docker-bild för Node.js, version 20, baserad på Alpine Linux för en mindre och snabb bild.
FROM node:20-alpine

# Sätter arbetskatalogen inuti containern till /app. Alla efterföljande kommandon körs i denna katalog.
WORKDIR /app

# Kopierar över package.json och package-lock.json (om det finns) från projektmappen på värddatorn till den aktuella katalogen i containern (/app).
COPY package*.json ./

# Kör npm install för att installera alla projektets beroenden. Detta installerar Node.js-bibliotek inuti containern.
RUN npm install

# Kopierar över resten av projektfilerna från värddatorn till containern. Detta inkluderar backend-källkod och andra nödvändiga filer.
COPY . .

# Anger att port 3007 ska vara öppen och tillgänglig från containern. Port 3007 antas vara backend-applikationens standardport.
EXPOSE 3007

# Startar backend-appen i utvecklingsläge genom att köra npm run dev, vilket är ett skript definierat i package.json.
CMD npm run dev
