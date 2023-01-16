import { buildResponse } from "./responses.js";

export const badRequestResponse = (error) => {
  console.error("[Bad Request] Error:", error);
  const response = buildResponse(400, "Bad Request");
  return response;
};

export const notFoundResponse = (error) => {
  console.error("[Not Found] Error:", error);
  const response = buildResponse(404, "404 Not Found");
  return response;
};

export default {
  badRequestResponse,
  notFoundResponse,
};
