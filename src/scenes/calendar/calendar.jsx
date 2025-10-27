import { useState, useEffect, useRef } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const LOCAL_STORAGE_KEY = "calendar-events";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const calendarRef = useRef(null);

  // Media queries
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const savedEvents = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedEvents) {
      const parsed = JSON.parse(savedEvents);
      setCurrentEvents(parsed);
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        parsed.forEach((event) => {
          calendarApi.addEvent(event);
        });
      }
    }
  }, []);

  const saveEventsToLocalStorage = (events) => {
    const rawEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.startStr || event.start,
      end: event.endStr || event.end,
      allDay: event.allDay,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rawEvents));
  };

  const handleDateClick = (selected) => {
    setStart(selected.dateStr);
    setEnd(selected.dateStr);
  };

  const handleAddEvent = () => {
    if (!title || !start) {
      alert("Please fill in at least Title and Start date.");
      return;
    }

    const newEvent = {
      id: `${start}-${title}`,
      title,
      start,
      end: end || start,
      allDay: true,
    };

    const calendarApi = calendarRef.current.getApi();
    calendarApi.unselect();
    calendarApi.addEvent(newEvent);

    const updatedEvents = [...currentEvents, newEvent];
    setCurrentEvents(updatedEvents);
    saveEventsToLocalStorage(updatedEvents);

    setTitle("");
    setStart("");
    setEnd("");
  };

  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'?`
      )
    ) {
      selected.event.remove();

      const updatedEvents = currentEvents.filter(
        (event) => event.id !== selected.event.id
      );
      setCurrentEvents(updatedEvents);
      saveEventsToLocalStorage(updatedEvents);
    }
  };

  return (
    <Box m={isMobile ? "10px" : "20px"}>
      <Header title="Calendar" subtitle="Full Calendar with Form Input" />

      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        gap={isMobile ? 3 : 2}
      >
        {/* SIDEBAR */}
        <Box
          flex={isMobile ? "1 1 100%" : "1 1 25%"}
          backgroundColor={colors.primary[400]}
          p={isMobile ? "10px" : "15px"}
          borderRadius="4px"
          minWidth={isMobile ? "auto" : "280px"}
        >
          <Typography variant="h5" mb={2} textAlign={isMobile ? "center" : "left"}>
            Add New Event
          </Typography>
          <TextField
            label="Event Title"
            variant="outlined"
            size="small"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Start Date"
            type="date"
            variant="outlined"
            size="small"
            fullWidth
            margin="normal"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            variant="outlined"
            size="small"
            fullWidth
            margin="normal"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            color="secondary"

            fullWidth
            onClick={handleAddEvent}
            sx={{ mt: 2 }}
          >
            Add Event
          </Button>

          <Typography variant="h5" mt={4} mb={2}>
            Events
          </Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "4px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={formatDate(event.start, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex={isMobile ? "1 1 100%" : "1 1 70%"}>
          <FullCalendar
            ref={calendarRef}
            height={isMobile ? "auto" : "75vh"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => {
              const rawEvents = events.map((e) => ({
                id: e.id,
                title: e.title,
                start: e.startStr,
                end: e.endStr,
                allDay: e.allDay,
              }));
              setCurrentEvents(rawEvents);
              saveEventsToLocalStorage(events);
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
