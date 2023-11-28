const moment = require("moment");

/**
 *
 * @param {takes in number of days and number of slots per day as numbers}
 * Each argument has a default params as fallback if nothing is specified while calling the function
 * @returns an array of timeslots from 9am - 5pm(17:00)
 */
function generateAvailableTimeSlots(days = 7, numberOfSlotsPerDay = 8) {
  const today = moment().startOf("day");

  const tomorrow = today.clone().add(1, "day");

  const availableTimeSlots = [];

  for (let i = 0; i < days * numberOfSlotsPerDay; i++) {
    // 0-7 -> 0, 7-13 -> 1, 14...
    const currentDate = tomorrow
      .clone()
      .add(Math.floor(i / numberOfSlotsPerDay), "days");

    // 0-7 -> 0, 7-13 -> 1, 14...
    const currentHour = (i % numberOfSlotsPerDay) + 9; // 8 hours between 9am and 4pm start times

    const startTime = currentDate
      .clone()
      .hour(currentHour + 1)
      .toISOString();

    const endTime = currentDate
      .clone()
      .hour(currentHour + 2)
      .toISOString();

    availableTimeSlots.push({ start: startTime, end: endTime });
  }

  return availableTimeSlots;
}

/**
 * Helper function to check if two time slots overlap
 * returns a boolean
 */

function doTimeSlotsOverlap(slot1, slot2) {
  const start1 = moment(slot1.start);
  const end1 = moment(slot1.end);
  const start2 = moment(slot2.start);
  const end2 = moment(slot2.end);

  return start1.isBefore(end2) && end1.isAfter(start2);
}

/**
 * Function to exclude time slots that overlap with events in userCalendarEventsArray
 * Filters out time slots that overlap with events in userCalendarEventsArray
 * returns an array of timeslots
 */

function excludeOverlappingTimeSlots(userCalendarEventsArray, timeSlotsArray) {
  const filteredTimeSlots = timeSlotsArray.filter(
    (timeSlot) =>
      !userCalendarEventsArray.some((userEvent) =>
        doTimeSlotsOverlap(userEvent, timeSlot)
      )
  );

  return filteredTimeSlots;
}

/**
 * takes in an array of events from the users calendar
 * returns events available in the next seven days from tomorrow
 */
function eventsAvailableInTheNextSevenDaysFromTomorrow(slots) {
  const tomorrow = moment().add(0, "day").format("YYYY-MM-DD");

  const sevenDaysFromTomorrow = moment().add(7, "days").format("YYYY-MM-DD");

  const eventsAvailableInTheNextSevenDaysFromTomorrow = slots.filter(
    (slot) =>
      moment(slot.start).format("YYYY-MM-DD") > tomorrow &&
      moment(slot.end).format("YYYY-MM-DD") <= sevenDaysFromTomorrow
  );
  return eventsAvailableInTheNextSevenDaysFromTomorrow;
}

/**
 * takes in an object(req.query)
 * and validates the key entered for the query.
 * returns void
 */
const queryKeyName = "hostUserId";

function validateQueryKey(queryKey) {
  const queryKeyArray = Object.keys(queryKey);
  const queryKeyName = "hostUserId";
  if (!queryKeyArray.length || queryKeyArray.length > 1) {
    throw new Error(`Please specify a single query key called ${queryKeyName}`);
  }
  if (
    queryKeyArray.length === 1 &&
    queryKeyArray[0].trim() !== "hostUserId"
  ) {
    throw new Error(
      `Please ensure the query key specified is called ${queryKeyName}`
    );
  }
}

/**
 * takes in query value
 * validates and sanitises the value
 * returns the value
 */
function sanitiseAndReturnQueryValue(queryValue) {
  if (queryValue.trim() === "") {
    throw new Error(`Please specify a value for ${queryKeyName}`);
  }
  return queryValue.trim();
}

/**
 * checks if stated time is within 9am-5pm
 * returns a boolean
 */
function isTimeWithinRange(timeStamp, startTime, endTime) {
  const extractedHour = moment(timeStamp).hour() - 1;

  return extractedHour >= startTime && extractedHour <= endTime;
}

/**
 * checks if timeFrames are valid
 * returns a boolean
 */
function areAllTimeFramesValid(timeFrames) {
  const startOfDay = 9;
  const endOfDay = 17;

  return timeFrames.every((timeFrame) =>
    isTimeWithinRange(timeFrame, startOfDay, endOfDay)
  );
}

/**
 * checks if timeslots are on the hour
 * returns a boolean
 */
function isTimeSlotOnTheHour(timeSlot) {
  const time = moment(timeSlot);
  return time.minute() === 0 && time.second() === 0;
}

module.exports = {
  generateAvailableTimeSlots,
  excludeOverlappingTimeSlots,
  eventsAvailableInTheNextSevenDaysFromTomorrow,
  validateQueryKey,
  sanitiseAndReturnQueryValue,
  isTimeWithinRange,
  areAllTimeFramesValid,
  isTimeSlotOnTheHour,
  doTimeSlotsOverlap
};
