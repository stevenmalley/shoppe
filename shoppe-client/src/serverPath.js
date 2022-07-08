const serverPath = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "";
export default serverPath;