const express = require("express");
const router = express.Router();
const moment = require("moment");
const db = require("db");
const util = require("../utils/calendar.util");

router.get("/api/calendar", async (req, res) => {
  try {
    util.validateQueryKey(req.query);

    const queryValue = util.sanitiseAndReturnQueryValue(
      req.query["hostUserId"]
    );

    const slots = await db.calendar.findEventsForUser(queryValue);

    const eventsAvailableInTheNextSevenDaysFromTomorrow =
      util.eventsAvailableInTheNextSevenDaysFromTomorrow(slots);

    const filteredResult = util.excludeOverlappingTimeSlots(
      eventsAvailableInTheNextSevenDaysFromTomorrow,
      util.generateAvailableTimeSlots()
    );

    const availableTimeSlots = filteredResult.map(
      (slot) => (slot.start, slot.end)
    );

    res.status(200).json({
      name: queryValue,
      timeslotLengthMin: 60,
      len: availableTimeSlots.length,
      timeSlots: availableTimeSlots,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

module.exports = router;
