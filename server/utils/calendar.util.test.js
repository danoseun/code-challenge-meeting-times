const util = require("./calendar.util");
const fixture = require("../../fixture");

describe("utility functions", () => {
  it("util.generateAvailableTimeSlots should return an array of timeslots on the hour with default arguments", async () => {
    const generatedTimeSlots = util.generateAvailableTimeSlots();

    expect(generatedTimeSlots).toHaveLength(56);
    generatedTimeSlots.forEach((slot) => {
      expect(slot).toHaveProperty("start");
      expect(slot).toHaveProperty("end");
      expect(util.isTimeSlotOnTheHour(slot.start)).toBe(true);
      expect(util.isTimeSlotOnTheHour(slot.end)).toBe(true);
    });
  });
  it("util.generateAvailableTimeSlots should return an array of timeslots on the hour when arguments are passed", async () => {
    const generatedTimeSlots = util.generateAvailableTimeSlots(8, 6);

    expect(generatedTimeSlots).toHaveLength(48);
    generatedTimeSlots.forEach((slot) => {
      expect(slot).toHaveProperty("start");
      expect(slot).toHaveProperty("end");
      expect(util.isTimeSlotOnTheHour(slot.start)).toBe(true);
      expect(util.isTimeSlotOnTheHour(slot.end)).toBe(true);
    });
  });

  it("util.doTimeSlotsOverlap should return a boolean", async () => {
    expect(typeof util.doTimeSlotsOverlap(fixture.slot1, fixture.slot2)).toBe(
      "boolean"
    );
  });
});
