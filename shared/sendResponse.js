export const sendResponse = (res, message, data, error, code) => {
  return res.status(code).json({ message: message, data: data, error: error });
};
