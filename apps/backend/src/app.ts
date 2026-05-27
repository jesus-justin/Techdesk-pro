import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./lib/logger.js";

export const app = express();

app.use(cors());
app.use(helmet());
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      }
    }
  })
);
app.use(express.json());

app.use("/api/v1", routes);
app.use(errorHandler);
