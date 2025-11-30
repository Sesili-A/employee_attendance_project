// backend/middlewares/roleMiddleware.js
import User from "../models/User.js";

export const requireManager = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "manager") {
      return res.status(403).json({ message: "Access denied: Managers only" });
    }

    // pass manager info if needed
    req.currentUser = user;
    next();
  } catch (err) {
    console.error("requireManager error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
