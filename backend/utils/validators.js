const isValidDate = (value) => !Number.isNaN(Date.parse(value));

export const validateRegister = (req) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return "Name, email and password are required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  if (role && !["admin", "receptionist", "customer"].includes(role)) {
    return "Invalid role provided";
  }

  return null;
};

export const validateLogin = (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return "Email and password are required";
  }

  return null;
};

export const validateRoom = (req) => {
  const { room_number, type, price, status } = req.body;

  if (!room_number || !type || price === undefined) {
    return "Room number, type and price are required";
  }

  if (!["single", "double", "suite"].includes(type)) {
    return "Invalid room type";
  }

  if (Number(price) <= 0) {
    return "Room price must be greater than zero";
  }

  if (status && !["available", "occupied", "maintenance"].includes(status)) {
    return "Invalid room status";
  }

  return null;
};

export const validateReservation = (req) => {
  const { room_id, check_in, check_out } = req.body;

  if (!room_id || !check_in || !check_out) {
    return "Room, check-in date and check-out date are required";
  }

  if (!isValidDate(check_in) || !isValidDate(check_out)) {
    return "Invalid reservation date provided";
  }

  if (new Date(check_out) <= new Date(check_in)) {
    return "Check-out date must be after check-in date";
  }

  return null;
};

export const validatePayment = (req) => {
  const { reservation_id, amount, method, status } = req.body;

  if (!reservation_id || amount === undefined || !method) {
    return "Reservation, amount and payment method are required";
  }

  if (!["cash", "stripe", "chapa"].includes(method)) {
    return "Invalid payment method";
  }

  if (status && !["completed", "failed"].includes(status)) {
    return "Invalid payment status";
  }

  if (Number(amount) <= 0) {
    return "Payment amount must be greater than zero";
  }

  return null;
};
