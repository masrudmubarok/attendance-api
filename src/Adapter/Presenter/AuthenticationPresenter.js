module.exports = {
    presentLogin: (token) => {
      return { token };
    },
  
    presentRegister: (user) => {
      return {
        id: user.getId(),
        email: user.getEmail(),
        name: user.getName(),
        createdAt: user.getCreatedAt(),
      };
    },
  
    presentLogout: () => {
      return { message: 'Logout successful' };
    },
  
  };