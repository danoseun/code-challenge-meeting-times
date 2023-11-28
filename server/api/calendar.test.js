const request = require("supertest");
const router = require("./calendar");
const express = require("express");
const moment = require("moment");
const util = require("../utils/calendar.util");

const app = express();
app.use(router);

describe("GET /api/calendar", () => {
  it("returns timeslots", async () => {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    const hostUserId = "Eng Test User";
    const res = await request(app)
      .get(`/api/calendar?hostUserId=${hostUserId}`)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.name).toBe("Eng Test User");
    expect(res.body.timeSlots.length).toBeGreaterThanOrEqual(5);
    expect(
      res.body.timeSlots.every((dateString) => dateFormatRegex.test(dateString))
    ).toBe(true);
  });

  it("asserts that all returned slots do not exceed a time frame(9am-5pm)", async () => {
    const hostUserId = "Eng Test User";
    const res = await request(app)
      .get(`/api/calendar?hostUserId=${hostUserId}`)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(util.areAllTimeFramesValid(res.body.timeSlots)).toBe(true);
  });

  it("asserts that all returned slots are on the hour", async () => {
    const hostUserId = "Eng Test User";
    const res = await request(app)
      .get(`/api/calendar?hostUserId=${hostUserId}`)
      .expect("Content-Type", /json/)
      .expect(200);
    res.body.timeSlots.forEach((slot) => {
      expect(util.isTimeSlotOnTheHour(slot)).toBe(true);
    });
  });

  it("returns timeslots for another user", async () => {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    const hostUserId = "q";
    const res = await request(app)
      .get(`/api/calendar?hostUserId=${hostUserId}`)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.name).toBe("q");
    expect(res.body.timeSlots.length).toBeGreaterThanOrEqual(5);
    expect(
      res.body.timeSlots.every((dateString) => dateFormatRegex.test(dateString))
    ).toBe(true);
  });

  it("returns an error if key name is not specified", async () => {
    const res = await request(app)
      .get(`/api/calendar`)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(res.body).toBe(
      "Please specify a single query key called hostUserId"
    );
  });

  it("returns an error if wrong key name is specified", async () => {
    const res = await request(app)
      .get(`/api/calendar?host`)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(res.body).toBe(
      "Please ensure the query key specified is called hostUserId"
    );
  });

  it("returns an error if no value is specified for the query", async () => {
    const res = await request(app)
      .get(`/api/calendar?hostUserId=`)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(res.body).toBe("Please specify a value for hostUserId");
  });
});
