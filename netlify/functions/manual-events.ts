import type { Handler } from "@netlify/functions";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src", "data", "manual-events.json");

function readEvents() {
  if (!fs.existsSync(DATA_PATH)) {
    return [];
  }

  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw || "[]");
}

function writeEvents(events: any[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(events, null, 2), "utf-8");
}

export const handler: Handler = async (event) => {
  try {
    // GET: Return all manual events
    if (event.httpMethod === "GET") {
      const eventsList = readEvents();

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventsList),
      };
    }

    // POST: Add a new manual event
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");

      if (!body.date || !body.title || !body.type) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Missing required fields: date, title, type",
          }),
        };
      }

      const eventsList = readEvents();

      const newEvent = {
        id: `evt-${Date.now()}`,
        date: body.date,
        type: body.type,
        title: body.title,
        description: body.description || "",
      };

      eventsList.push(newEvent);
      writeEvents(eventsList);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Event added successfully",
          event: newEvent,
        }),
      };
    }

    // DELETE: Remove event by id
    if (event.httpMethod === "DELETE") {
      const { id } = JSON.parse(event.body || "{}");

      if (!id) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing event id" }),
        };
      }

      let eventsList = readEvents();
      eventsList = eventsList.filter((e: any) => e.id !== id);

      writeEvents(eventsList);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Event deleted successfully" }),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (err: any) {
    console.error("Manual events API error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
