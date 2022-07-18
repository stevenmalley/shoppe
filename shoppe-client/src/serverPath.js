// absolutePath used by GoogleLogin component
export const absolutePath = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "http://ye-shoppe.herokuapp.com";

const serverPath = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "";
export default serverPath;