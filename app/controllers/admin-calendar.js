import CalendarController from './calendar';

export default CalendarController.extend({
  actions: {
    setViewingSlot(slot) {
      this.set('viewingSlot', slot);
    }
  }
});
