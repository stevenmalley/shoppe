export const absolutePath = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "https://olde-shoppe-421300d4552b.herokuapp.com";

const origin = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "";

export const scriptPath = origin + "/scripts";

const serverPath = origin + "/api";

export default serverPath;