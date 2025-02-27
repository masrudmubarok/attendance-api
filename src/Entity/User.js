const bcrypt = require('bcrypt');

class User {
  constructor(id, email, password, name, createdAt = new Date()) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = new Date(createdAt);
    this.setPassword(password);
  }

  getId() {
    return this.id;
  }

  getEmail() {
    return this.email;
  }

  getName() {
    return this.name;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  async setPassword(password) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }

  async checkPassword(inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
  }
}

module.exports = User;