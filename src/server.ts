import { httpServer } from "./express";

const PORT = process.env.PORT || 3000;

httpServer.listen(Number(PORT), () => {
  console.log(`server running on http://localhost:${PORT}`);
});