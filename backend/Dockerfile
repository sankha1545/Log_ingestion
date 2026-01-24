# ---------- BASE IMAGE ----------
FROM node:20-alpine

# ---------- WORKDIR ----------
WORKDIR /app

# ---------- COPY PACKAGE FILES ----------
COPY package.json ./

# ---------- INSTALL DEPENDENCIES ----------
RUN npm install --production

# ---------- COPY APP SOURCE ----------
COPY . .

# ---------- CREATE DATA DIR ----------
RUN mkdir -p /app/data

# ---------- EXPOSE PORT ----------
EXPOSE 3001

# ---------- START SERVER ----------
CMD ["npm", "start"]

