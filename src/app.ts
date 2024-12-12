import express from "express";
import mongoose, { Error } from "mongoose";
import "dotenv/config";
import routes from "./routes";
import { MongoMemoryServer } from "mongodb-memory-server";

// setup app
const PORT = process.env.PORT || 3000;
export const app = express();

// setup middleware
app.use(express.json());
app.use(routes);

// wrapping initializing in a function to be able to use async/await
export async function initializeServer() {
  if (process.env.NODE_ENV === "prod") {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      console.log("Connected to MongoDB");

      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error("Error connecting to MongoDB:", (err as Error).message);
    }
  } else {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log("Connected to in-memory MongoDB for testing");
  }
}

if (process.env.NODE_ENV !== "test") {
  initializeServer().catch((err) => {
    console.error("Failed to initialize server:", err);
  });
}

// export for testing
export default app;
