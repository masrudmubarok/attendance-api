module.exports = {
    presentUser: (user) => {
      return {
        id: user.getId(),
        email: user.getEmail(),
        name: user.getName(),
        createdAt: user.getCreatedAt(),
      };
    },
};