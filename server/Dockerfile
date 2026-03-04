# Step 1 — Use Node.js as our base
# Think of this like choosing which kitchen to cook in 🍳
FROM node:18-alpine

# Step 2 — Create a folder inside Docker container for our app
# Like creating a workspace folder
WORKDIR /app

# Step 3 — Copy package.json first (for faster builds)
# Like writing down the ingredients list before cooking
COPY package*.json ./

# Step 4 — Install all dependencies
# Like buying all ingredients from the store
RUN npm install

# Step 5 — Copy ALL our code into the container
# Like bringing all your cooking tools into the kitchen
COPY . .

# Step 6 — Build TypeScript into JavaScript
# Docker can't run .ts files directly, so we compile first!
RUN npm run build

# Step 7 — Tell Docker our app runs on port 3000
EXPOSE 3000

# Step 8 — The command to START our app
# This runs when container starts!
CMD ["node", "dist/src/index.js"]

