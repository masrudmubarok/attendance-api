const db = require("../../config").db;
const User = require("../Entity/UserEntity");

module.exports = {
  findUserByEmail: async (email) => {
    try {
      const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
      if (rows.length) {
        const row = rows[0];
        return new User(row.id, row.email, row.password, row.name, row.created_at);
      }
      return null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Database connection error");
    }
  },

  findUserById: async (id) => {
    try {
      const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
      if (rows.length) {
        const row = rows[0];
        return new User(row.id, row.email, row.password, row.name, row.created_at);
      }
      return null;
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw new Error("Database connection error");
    }
  },

  createUser: async ({ email, password, name }) => {
    try {
      const user = new User(null, email, password, name);
      await db.execute(
        "INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, NOW())",
        [user.getEmail(), user.password, user.getName()]
      );
      const newUser = await module.exports.findUserByEmail(email);
      console.log(`User created successfully: ${email}`);
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Database connection error");
    }
  },

  updateUser: async (id, { email, password, name }) => {
    try {
      const user = new User(id, email, password, name);
      await db.execute(
        "UPDATE users SET email = ?, password = ?, name = ? WHERE id = ?",
        [user.getEmail(), user.password, user.getName(), id]
      );
      const updatedUser = await module.exports.findUserById(id);
      console.log(`User updated successfully: ${id}`);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Database connection error");
    }
  },

  deleteUser: async (id) => {
    try {
      await db.execute("DELETE FROM users WHERE id = ?", [id]);
      return { message: `User deleted successfully: ${id}`};
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Database connection error");
    }
  },
};