import "dotenv/config";
import { app } from "./app";
import { logger } from "./lib/logger";

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  logger.info(`TechDesk Pro backend running on port ${PORT}`);
});
