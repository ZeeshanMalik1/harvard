import React from "react";
import { useParams } from "react-router-dom";
import { events } from "../constants/events";
import EventDetail from "./EventDetail";
import constants from "../constants/constant";
import FixedSection from "./FixedSection";

const EventDetailWrapper = () => {
  const { eventId } = useParams();
  const event = events.find((e) => e.id.toString() === eventId);

  if (!event) return <h2 style={{ padding: "40px" }}>{constants.eventSection.Error}</h2>;

  return (
    <>
  <EventDetail images={event.images} />
  <FixedSection/>
      </>
)
  ;
};

export default EventDetailWrapper;
