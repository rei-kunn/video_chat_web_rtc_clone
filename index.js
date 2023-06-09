const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const req = require("express/lib/request");
const res = require("express/lib/response");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methoods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 2000;

app.get("/", (req, res) => {
    res.send('Server is running.');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));