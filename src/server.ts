import "dotenv/config";
import App from "./app";
import BookRoutes from "./routes/book.routes";
import MemberRoutes from "./routes/member.routes";
import BorrowRoutes from "./routes/borrow.routes";

const app = new App([new BookRoutes(), new MemberRoutes(), new BorrowRoutes()]);

app.startServer();
