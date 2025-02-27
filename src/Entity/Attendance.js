class Attendance {
    constructor(id, userId, clockIn, clockOut) {
      this.id = id;
      this.userId = userId;
      this.clockIn = clockIn ? new Date(clockIn) : null;
      this.clockOut = clockOut ? new Date(clockOut) : null;
    }
  
    getId() {
      return this.id;
    }
  
    getUserId() {
      return this.userId;
    }
  
    getClockIn() {
      return this.clockIn;
    }
  
    getClockOut() {
      return this.clockOut;
    }
  
    getWorkedHours() {
        if (!this.clockIn || !this.clockOut) {
          return null; 
        }
    
        const diff = this.clockOut - this.clockIn; 
        return (diff / (1000 * 60 * 60)).toFixed(2);
      }
  }
  
  module.exports = Attendance;
  