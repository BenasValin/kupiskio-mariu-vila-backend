import React, { useState, useEffect } from "react";
import { serverURL } from "@/config";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import {
  Button,
  TextInput,
  Textarea,
  Text,
  Box,
  Paper,
  Title,
  Stack,
  Group,
  Alert,
  Grid,
  rem,
  RangeSlider,
} from "@mantine/core";
import moment from "moment";
import { BookingInfoData } from "@/types";
import Footer from "./Components/Footer";

moment.locale("lt");

interface House {
  id: string;
  name: string;
}

interface BookingInfo {
  name: string;
  surname: string;
  phone: string;
  email: string;
  message: string;
}

interface BookedRange {
  house: string;
  startDate: moment.Moment;
  endDate: moment.Moment;
  color: string;
}

const houses: House[] = [
  { id: "zvejunamelis", name: "Žvejų namelis" },
  { id: "pagrindisPastatasPirmas", name: "Pagrindinė salė" },
  { id: "pagrindisPastatasAntras", name: "Pagrindinio pastato miegamieji" },
  { id: "pirtiesPastatasPirmas", name: "Pirtis" },
  { id: "pirtiesPastatasAntras", name: "Pirties pastato miegamieji" },
];

const bookingColors = [
  "#FF6B6B",
  "#4DABF7",
  "#63E6BE",
  "#FFD43B",
  "#AE3EC9",
  "#F06595",
  "#8CE99A",
  "#FAB005",
];

const getBookingColor = (index: number): string => {
  return bookingColors[index % bookingColors.length];
};

const Kalendorius: React.FC = () => {
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="flex flex-col gap-3 justify-center">
      {houses.map((house) => (
        <HouseCalendar key={house.id} house={house} isMobile={isMobile} />
      ))}
      <Footer></Footer>
    </div>
  );
};

interface HouseCalendarProps {
  house: House;
  isMobile: boolean;
}

const HouseCalendar: React.FC<HouseCalendarProps> = ({ house, isMobile }) => {
  const [notificationText, setNotificationText] = useState<string>("");
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  // State for the main calendar display range
  const [displayDateRange, setDisplayDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  // State for the NEW dates selected in the update inputs
  const [updateDateRange, setUpdateDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo>({
    name: "",
    surname: "",
    phone: "",
    email: "",
    message: "",
  });
  const [selectedDays, setSelectedDays] = useState<number>(0);
  const [selectedRange, setSelectedRange] = useState<BookedRange | null>(null);

  useEffect(() => {
    const fetchBookedRanges = async () => {
      try {
        const response = await fetch(
          `${serverURL}/api/booked-ranges?house=${house.id}`
        );
        const data = await response.json();
        setBookedRanges(
          data.map(
            (
              range: {
                house: string;
                start_date: string;
                end_date: string;
              },
              index: number
            ) => ({
              // Added index here
              house: range.house,
              startDate: moment(range.start_date),
              endDate: moment(range.end_date),
              color: getBookingColor(index), // Use indexed color
            })
          )
        );
      } catch (error) {
        console.error("Error fetching booked ranges:", error);
      }
    };

    fetchBookedRanges();
  }, [house.id]);

  const fetchBookingInfo = (startDate: moment.Moment) => {
    fetch(
      `${serverURL}/api/booking-info?date=${startDate.format(
        "YYYY-MM-DD"
      )}&house=${house.id}`
    )
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            console.warn(
              `No booking info found for ${startDate.format(
                "YYYY-MM-DD"
              )} for house ${house.id}`
            );
            clearBookingForm();
            return null; //
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data === null) return;

        const booking = data[0];
        if (booking) {
          setBookingInfo({
            name: booking.name || "",
            surname: booking.surname || "",
            phone: booking.phone || "",
            email: booking.email || "",
            message: booking.message || "",
          });
        } else {
          clearBookingForm();
        }
      })
      .catch((error) => {
        console.error("Error fetching booking info:", error);
        clearBookingForm(); // Clear form on error
      });
  };

  const ListItem = ({ range }: { range: any }) => {
    return (
      <div
        onClick={() => {
          setSelectedRange(range);
          setUpdateDateRange([range.startDate, range.endDate]);
          fetchBookingInfo(range.startDate);
          setSelectedDays(range.endDate.diff(range.startDate, "days") + 1);
          setDisplayDateRange([null, null]);
        }}
        style={{ backgroundColor: range.color }}
        className={`rounded-md w-full px-3 py-1 cursor-pointer`}
      >
        {range.startDate.format("D MM YYYY")}
        <a> - </a>
        {range.endDate.format("D MM YYYY")}
      </div>
    );
  };

  // Clear form and related states
  const clearBookingForm = () => {
    setBookingInfo({
      name: "",
      surname: "",
      phone: "",
      email: "",
      message: "",
    });
    setSelectedRange(null);
    setUpdateDateRange([null, null]); // Clear update dates
    setSelectedDays(0);
    setNotificationText("");
  };

  // Reset selection and form
  const resetSelection = () => {
    setDisplayDateRange([null, null]); // Clear main calendar selection
    clearBookingForm();
  };

  // Check if a date should be disabled in the main calendar
  const isDateBlocked = (date: Date): boolean => {
    const dateToCheck = moment(date).startOf("day");

    // Check past dates
    if (moment().startOf("day").diff(dateToCheck, "days") > 0) {
      return true;
    }

    if (
      bookedRanges.some((range) =>
        dateToCheck.isBetween(range.startDate, range.endDate, "day", "[]")
      )
    ) {
      // If we are currently editing THAT specific range, allow selecting its dates for visual feedback
      if (
        selectedRange &&
        dateToCheck.isBetween(
          selectedRange.startDate,
          selectedRange.endDate,
          "day",
          "[]"
        )
      ) {
        return false;
      }
      return true; // Block dates within other booked ranges
    }

    return false;
  };

  // Handler for the main DatePicker component
  const handleMainDatesChange = (value: [Date | null, Date | null]) => {
    const [startDate, endDate] = value; // Convert dates to moments for easier comparison

    const startMoment = startDate ? moment(startDate).startOf("day") : null;
    const endMoment = endDate ? moment(endDate).startOf("day") : null; // --- Prioritize Clicking on Existing Bookings --- // If a start date is selected (either a single click or the start of a new range attempt)

    if (startMoment) {
      const clickedRange = bookedRanges.find((range) =>
        startMoment.isBetween(
          range.startDate,
          range.endDate.clone().add(1, "day"), // Use [) to include start and exclude end for between
          "day",
          "[)"
        )
      );

      if (clickedRange) {
        // If the clicked date is part of an existing booking,
        // immediately set the selection to the full booked range
        const rangeStart = clickedRange.startDate.toDate();
        const rangeEnd = clickedRange.endDate.toDate();

        setDisplayDateRange([rangeStart, rangeEnd]); // Highlight in main calendar
        setSelectedRange(clickedRange); // Store the original range being edited
        setUpdateDateRange([rangeStart, rangeEnd]); // Set initial values for update inputs
        setNotificationText(
          `Redaguojamas užsakymas nuo ${clickedRange.startDate.format(
            "YYYY-MM-DD"
          )} iki ${clickedRange.endDate.format("YYYY-MM-DD")}`
        );
        setSelectedDays(
          clickedRange.endDate.diff(clickedRange.startDate, "days") + 1
        );

        fetchBookingInfo(clickedRange.startDate); // Fetch and populate name, surname etc.
        return; // IMPORTANT: Exit the function here to prevent new range selection logic
      }
    } // --- Logic for Selecting NEW Booking Range or Clearing Selection --- // This code is only reached if the clicked date is NOT part of a booked range, // or if the selection is being cleared (startDate is null). // If a range was previously selected for editing and the user clicked outside of it // or is starting a new full range selection, clear the editing state.

    // This condition is refined: if selectedRange exists AND (either startDate is null OR
    // a new full range is being selected).
    if (selectedRange && (startMoment === null || (startMoment && endMoment))) {
      clearBookingForm(); // Clear form fields, selectedRange, updateDateRange etc.
    }

    setDisplayDateRange([startDate, endDate]); // Update main calendar display

    if (startMoment && endMoment) {
      // A full new range has been selected

      // Validation for NEW range (ensure it doesn't conflict with ANY existing booking)
      const isValidNewRange = !bookedRanges.some((range) => {
        const existingStart = range.startDate.startOf("day");
        const existingEnd = range.endDate.startOf("day"); // Check for overlap: (StartA <= EndB) and (EndA >= StartB)
        return (
          startMoment.isBefore(existingEnd.clone().add(1, "day")) &&
          endMoment.isAfter(existingStart.clone().subtract(1, "day"))
        );
      });

      if (!isValidNewRange) {
        setNotificationText(
          "Naujas pasirinktas laikotarpis konfliktuoja su esamu užsakymu. Pasirinkite kitą."
        );
        setSelectedDays(0); // Optionally reset the selection if invalid // setDisplayDateRange([null, null]);
        return;
      } // Valid new range selected

      setSelectedDays(endMoment.diff(startMoment, "days") + 1);
      setNotificationText(""); // Clear any previous notification // Ensure update fields and booking info are cleared for a new booking
      setUpdateDateRange([null, null]);
      setBookingInfo({
        name: "",
        surname: "",
        phone: "",
        email: "",
        message: "",
      });
    } else {
      // Only one or no date selected in main calendar (partially selected or cleared)
      setSelectedDays(0);
      if (!startMoment) {
        // Selection was fully cleared
        setNotificationText("");
        clearBookingForm(); // Also clear form if selection is fully cleared
      } else {
        // Only a start date is selected for a potential new range
        // Do not clear the form here, as the user is in the process of selecting
        // a new range. Notification handled below.
      }
    }

    // Update notification text for partial new selection only if not editing
    if (!selectedRange && startMoment && !endMoment) {
      setNotificationText("Pasirinkite išvykimo datą.");
    }
  };
  // Handler for the dedicated update DatePickerInputs
  const handleUpdateDatesChange = (value: [Date | null, Date | null]) => {
    const [newStart, newEnd] = value;
    setUpdateDateRange([newStart, newEnd]); // Always update the state immediately

    // Update selectedDays count based on updateDateRange if we are editing
    if (selectedRange && newStart && newEnd) {
      const newStartMoment = moment(newStart).startOf("day");
      const newEndMoment = moment(newEnd).startOf("day");

      // Check for validity of the updated range against *other* bookings before calculating days
      const conflictsWithOtherBooking = bookedRanges.some((range) => {
        // Skip conflict check with the original range being edited
        if (
          selectedRange &&
          range.startDate.isSame(selectedRange.startDate, "day") &&
          range.endDate.isSame(selectedRange.endDate, "day")
        ) {
          return false;
        }
        // Check for overlap with *other* existing bookings
        const existingStart = range.startDate.startOf("day");
        const existingEnd = range.endDate.startOf("day");
        // Overlap condition: (StartA <= EndB) and (EndA >= StartB)
        return (
          newStartMoment.isBefore(existingEnd.clone().add(1, "day")) &&
          newEndMoment.isAfter(existingStart.clone().subtract(1, "day"))
        );
      });

      if (newEndMoment.isBefore(newStartMoment)) {
        setSelectedDays(0); // Invalid range
        setNotificationText(
          "Nauja išvykimo data negali būti ankstesnė už atvykimo datą."
        );
      } else if (conflictsWithOtherBooking) {
        setSelectedDays(0); // Conflict
        setNotificationText(
          "Naujas pasirinktas laikotarpis konfliktuoja su kitu esamu užsakymu."
        );
      } else {
        setSelectedDays(newEndMoment.diff(newStartMoment, "days") + 1);
        setNotificationText(
          `Pasirinkta dienų: ${newEndMoment.diff(newStartMoment, "days") + 1}`
        );
      }
    } else if (selectedRange) {
      // If editing but dates are incomplete in update inputs
      setSelectedDays(0);
      setNotificationText(
        "Prašome pasirinkti naujas atvykimo ir išvykimo datas."
      );
    }
    // If not editing, selectedDays is controlled by handleMainDatesChange
  };

  // Handle input changes for text fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBookingInfo((prevBookingInfo) => ({
      ...prevBookingInfo,
      [name]: value,
    }));
  };

  // --- API Call Functions ---

  // Function to refresh booked ranges from server
  const refreshBookedRanges = () => {
    return fetch(`${serverURL}/api/booked-ranges?house=${house.id}`)
      .then((response) => response.json())
      .then((data) => {
        setBookedRanges(
          data.map(
            (
              range: {
                house: string;
                start_date: string;
                end_date: string;
              },
              index: number
            ) => ({
              // Added index here
              house: range.house,
              startDate: moment(range.start_date),
              endDate: moment(range.end_date),
              color: getBookingColor(index), // Use indexed color
            })
          )
        );
      })
      .catch((error) =>
        console.error("Error refreshing booked ranges:", error)
      );
  };

  // Handle NEW booking confirmation
  const handleBookingConfirmation = (bookingData: BookingInfoData) => {
    const [startDate, endDate] = displayDateRange; // Use main calendar selection

    if (!startDate || !endDate) {
      setNotificationText(
        "Prašome pasirinkti atvykimo ir išvykimo datas kalendoriuje."
      );
      return;
    }

    const startMoment = moment(startDate).startOf("day");
    const endMoment = moment(endDate).startOf("day");

    if (endMoment.isBefore(startMoment)) {
      setNotificationText(
        "Išvykimo data negali būti ankstesnė už atvykimo datą."
      );
      return;
    }

    // Add validation again just before submitting (optional redundancy)
    const isValidNewRange = !bookedRanges.some((range) => {
      const existingStart = range.startDate.startOf("day");
      const existingEnd = range.endDate.startOf("day");
      // Check for overlap: (StartA <= EndB) and (EndA >= StartB)
      return (
        startMoment.isBefore(existingEnd.clone().add(1, "day")) &&
        endMoment.isAfter(existingStart.clone().subtract(1, "day"))
      );
    });
    if (!isValidNewRange) {
      setNotificationText(
        "Pasirinktas laikotarpis tapo užimtas. Prašome pasirinkti iš naujo."
      );
      refreshBookedRanges().then(resetSelection); // Refresh and clear
      return;
    }

    fetch(`${serverURL}/api/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        house: house.id,
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
        ...bookingData,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Booking failed");
        }
        return response.json();
      })
      .then((data) => {
        setNotificationText("Užsakymas patvirtintas!");
        resetSelection(); // Clear selection and form
        refreshBookedRanges(); // Update calendar display
      })
      .catch((error) => {
        console.error("Error confirming booking:", error);
        setNotificationText(`Klaida tvirtinant užsakymą: ${error.message}`);
        refreshBookedRanges(); // Refresh calendar even on error
      });
  };

  // Handle UPDATE booking
  const handleUpdateBooking = (bookingData: BookingInfoData) => {
    if (!selectedRange) {
      console.warn(
        "Update called without a selectedRange, attempting confirmation instead."
      );
      if (displayDateRange[0] && displayDateRange[1]) {
        handleBookingConfirmation(bookingData);
      } else {
        setNotificationText(
          "Pasirinkite užsakymą redagavimui arba naujas datas užsakymui."
        );
      }
      return;
    }

    const [newStartDate, newEndDate] = updateDateRange; // Use the dedicated update inputs
    const { name, surname, phone, email, message } = bookingData;

    if (!newStartDate || !newEndDate) {
      setNotificationText(
        "Prašome pasirinkti naujas atvykimo ir išvykimo datas."
      );
      return;
    }

    const newStartMoment = moment(newStartDate).startOf("day");
    const newEndMoment = moment(newEndDate).startOf("day");

    // --- Validation for Updated Range ---
    if (newEndMoment.isBefore(newStartMoment)) {
      setNotificationText(
        "Nauja išvykimo data negali būti ankstesnė už atvykimo datą."
      );
      return;
    }

    const conflictsWithOtherBooking = bookedRanges.some((range) => {
      // Skip conflict check with the original range being edited
      if (
        selectedRange &&
        range.startDate.isSame(selectedRange.startDate, "day") &&
        range.endDate.isSame(selectedRange.endDate, "day")
      ) {
        return false;
      }
      // Check for overlap with *other* existing bookings
      const existingStart = range.startDate.startOf("day");
      const existingEnd = range.endDate.startOf("day");
      // Overlap condition: (StartA <= EndB) and (EndA >= StartB)
      return (
        newStartMoment.isBefore(existingEnd.clone().add(1, "day")) &&
        newEndMoment.isAfter(existingStart.clone().subtract(1, "day"))
      );
    });

    if (conflictsWithOtherBooking) {
      setNotificationText(
        "Naujas pasirinktas laikotarpis konfliktuoja su kitu esamu užsakymu."
      );
      return;
    }
    // --- End Validation ---

    fetch(`${serverURL}/api/update-booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        house: house.id,
        originalStartDate: selectedRange.startDate.format("YYYY-MM-DD"), // Send original dates for lookup
        originalEndDate: selectedRange.endDate.format("YYYY-MM-DD"),
        newStartDate: newStartMoment.format("YYYY-MM-DD"), // Send new dates
        newEndDate: newEndMoment.format("YYYY-MM-DD"),
        name,
        surname,
        phone,
        email,
        message,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Update failed");
        }
        response.json();
      })
      .then((data) => {
        setNotificationText("Užsakymo informacija atnaujinta!");
        resetSelection(); // Clear selection and form
        refreshBookedRanges(); // Update calendar display
        setSelectedRange(null);
        setUpdateDateRange([null, null]);
      })
      .catch((error) => {
        console.error("Error updating booking information:", error);
        setNotificationText(`Klaida atnaujinant užsakymą: ${error.message}`);
        refreshBookedRanges(); // Refresh calendar even on error
      });
  };

  // Handle DELETE booking
  const handleDeleteRange = () => {
    if (!selectedRange) return;

    // Confirmation dialog
    if (
      !window.confirm(
        `Ar tikrai norite atšaukti užsakymą nuo ${selectedRange.startDate.format(
          "YYYY-MM-DD"
        )} iki ${selectedRange.endDate.format("YYYY-MM-DD")}?`
      )
    ) {
      return;
    }

    fetch(`${serverURL}/api/delete-range`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        house: house.id,
        startDate: selectedRange.startDate.format("YYYY-MM-DD"),
        endDate: selectedRange.endDate.format("YYYY-MM-DD"),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Delete failed");
        }
        return response.json();
      })
      .then((data) => {
        setNotificationText("Užsakymas atšauktas!");
        resetSelection(); // Clear selection and form
        refreshBookedRanges(); // Update calendar display
      })
      .catch((error) => {
        console.error("Error deleting range:", error);
        setNotificationText(`Klaida atšaukiant užsakymą: ${error.message}`);
        refreshBookedRanges(); // Refresh calendar even on error
      });
  };

  // Function to render day styles with custom colors for booked ranges
  const getDayStyles = (date: Date) => {
    const dateToCheck = moment(date).startOf("day");

    for (const range of bookedRanges) {
      // Check if the date is within a booked range (inclusive of start and end)
      if (dateToCheck.isBetween(range.startDate, range.endDate, "day", "[]")) {
        // Determine if this is the currently selected range for editing
        const isSelected =
          selectedRange &&
          dateToCheck.isBetween(
            selectedRange.startDate,
            selectedRange.endDate,
            "day",
            "[]"
          );

        return {
          backgroundColor: range.color, // Use the assigned color
          color: isSelected ? "white" : undefined, // White text for better contrast on colored days when selected
          fontWeight: isSelected ? ("bold" as "bold") : undefined, // Bold text when selected
          opacity: isSelected ? 1 : 0.8, // Full opacity if selected, slightly transparent otherwise
        };
      }
    }
    // Style for blocked dates (past dates, explicitly blocked)
    if (
      isDateBlocked(date) &&
      moment(date).startOf("day").isSameOrAfter(moment().startOf("day"))
    ) {
      return {
        textDecoration: "line-through", // Indicate blocked dates
        color: "#A0A0A0", // Grey out blocked dates
        opacity: 0.7,
      };
    }

    return {}; // Return empty object explicitly if no style
  };

  return (
    <Paper p="lg" radius="md" withBorder shadow="sm" className="houseContainer">
      <Title order={3} mb="lg" ta={isMobile ? "center" : "left"}>
        {house.name}
      </Title>

      <div className="grid grid-cols-[1fr_1fr_350px] gap-5">
        <div>
          {" "}
          <Box className="calendarSection">
            <DatePicker
              type="range"
              value={displayDateRange} // Use display range for the main calendar
              onChange={handleMainDatesChange} // Use the dedicated handler
              numberOfColumns={isMobile ? 1 : 2}
              getDayProps={(date) => ({
                style: getDayStyles(date),
              })}
              minDate={new Date()} // Prevent selecting past dates
              locale="lt" // Set locale for calendar
              allowSingleDateInRange={false} // Typically ranges are more than 1 day for booking
              styles={{
                calendarHeaderControl: {
                  "&[data-disabled]": {
                    opacity: 0.4,
                    cursor: "not-allowed",
                  },
                },
                // Add custom styles for selected range background if needed,
                // though the getDayStyles handles individual day colors well.
                // range: {
                //     backgroundColor: 'var(--mantine-color-blue-light)',
                // }
              }}
            />
          </Box>
        </div>
        <div>
          {" "}
          <Box className="kalendoriusInfoContainer">
            <Stack gap="md">
              {/* Show Update Date Inputs only when editing */}
              {selectedRange && (
                <>
                  <Title order={5} mt="xs" mb={0}>
                    Pakeisti datas:
                  </Title>
                  <Group grow gap="sm">
                    <DatePickerInput
                      label="Nauja atvykimo data"
                      placeholder="Pasirinkti datą"
                      value={updateDateRange[0]}
                      onChange={(date) =>
                        handleUpdateDatesChange([date, updateDateRange[1]])
                      }
                      minDate={moment().toDate()} // Cannot update to a past start date
                      locale="lt" // Set locale for picker
                      valueFormat="YYYY-MM-DD"
                      clearable
                      variant="filled"
                    />
                    <DatePickerInput
                      label="Nauja išvykimo data"
                      placeholder="Pasirinkti datą"
                      value={updateDateRange[1]}
                      onChange={(date) =>
                        handleUpdateDatesChange([updateDateRange[0], date])
                      }
                      minDate={updateDateRange[0] || moment().toDate()} // Min date is new start date or today
                      locale="lt" // Set locale for picker
                      valueFormat="YYYY-MM-DD"
                      clearable
                      variant="filled"
                    />
                  </Group>
                  <Text size="sm" c="dimmed" mt={-rem(10)}>
                    Pasirinkite naujas atvykimo ir išvykimo datas redaguojamam
                    užsakymui.
                  </Text>
                  <hr
                    style={{
                      width: "100%",
                      borderTop: "1px solid var(--mantine-color-gray-3)",
                      margin: "10px 0",
                    }}
                  />
                  <Title order={5} mt={0} mb="xs">
                    Kontaktinė informacija:
                  </Title>
                </>
              )}

              {/* Show New Booking Date Info when a new range is selected in the main calendar */}
              {!selectedRange && displayDateRange[0] && displayDateRange[1] && (
                <>
                  <Title order={5} mt="xs" mb={0}>
                    Naujas užsakymas:
                  </Title>
                  <Text size="sm">
                    Atvykimo data:{" "}
                    <Text span fw={700}>
                      {moment(displayDateRange[0]).format("YYYY-MM-DD")}
                    </Text>
                  </Text>
                  <Text size="sm" mt={-rem(15)}>
                    Išvykimo data:{" "}
                    <Text span fw={700}>
                      {moment(displayDateRange[1]).format("YYYY-MM-DD")}
                    </Text>
                  </Text>
                  <hr
                    style={{
                      width: "100%",
                      borderTop: "1px solid var(--mantine-color-gray-3)",
                      margin: "10px 0",
                    }}
                  />
                  <Title order={5} mt={0} mb="xs">
                    Kontaktinė informacija:
                  </Title>
                </>
              )}

              {/* Always show booking info fields */}
              <TextInput
                name="name"
                value={bookingInfo.name}
                onChange={handleInputChange}
                placeholder="Vardas"
                label="Vardas"
                readOnly={
                  !selectedRange &&
                  (!displayDateRange[0] || !displayDateRange[1])
                } // Readonly if not editing AND no *complete* new range selected
                variant={
                  !selectedRange &&
                  (!displayDateRange[0] || !displayDateRange[1])
                    ? "filled"
                    : "default"
                }
              />
              <TextInput
                name="surname"
                value={bookingInfo.surname}
                onChange={handleInputChange}
                placeholder="Pavardė"
                label="Pavardė"
                readOnly={
                  !selectedRange &&
                  (!displayDateRange[0] || !displayDateRange[1])
                }
                variant={
                  !selectedRange &&
                  (!displayDateRange[0] || !displayDateRange[1])
                    ? "filled"
                    : "default"
                }
              />
              <TextInput
                name="phone"
                value={bookingInfo.phone}
                onChange={handleInputChange}
                placeholder="Tel. Nr."
                label="Telefono numeris"
                readOnly={
                  !selectedRange &&
                  (!displayDateRange[0] || !displayDateRange[1])
                }
                variant={
                  !selectedRange &&
                  (!displayDateRange[0] || !displayDateRange[1])
                    ? "filled"
                    : "default"
                }
                type="tel" // Use tel type for phones
              />
              <TextInput
                name="email"
                value={bookingInfo.email}
                onChange={handleInputChange}
                placeholder="El. Paštas"
                label="El. paštas"
                type="email" // Use email type
                readOnly={
                  !selectedRange &&
                  (!displayDateRange[0] || !displayDateRange[1])
                }
                variant={
                  !selectedRange &&
                  (!displayDateRange[0] || !displayDateRange[1])
                    ? "filled"
                    : "default"
                }
              />
              <Textarea
                name="message"
                value={bookingInfo.message}
                onChange={handleInputChange}
                placeholder="Papildoma informacija (pvz., žmonių sk., pageidavimai)"
                label="Papildoma informacija"
                minRows={3}
                readOnly={
                  !selectedRange &&
                  (!displayDateRange[0] || !displayDateRange[1])
                }
                variant={
                  !selectedRange &&
                  (!displayDateRange[0] || !displayDateRange[1])
                    ? "filled"
                    : "default"
                }
              />

              {selectedDays > 0 && (
                <Text size="lg" fw={700}>
                  Pasirinkta dienų: {selectedDays}
                </Text>
              )}

              <Group grow mt="sm">
                <Button
                  onClick={() => {
                    if (selectedRange) {
                      handleUpdateBooking(bookingInfo);
                    } else {
                      handleBookingConfirmation(bookingInfo);
                    }
                  }}
                  size="md"
                  variant="filled"
                  color="blue"
                  // Disable button if trying to book new but no valid range selected in main calendar,
                  // or if trying to update but no valid update range selected.
                  disabled={
                    !!(
                      (
                        (!selectedRange &&
                          !(displayDateRange[0] && displayDateRange[1])) ||
                        (selectedRange &&
                          !(updateDateRange[0] && updateDateRange[1])) ||
                        selectedDays <= 0
                      ) // Also disable if selected days is 0 or less (invalid range)
                    )
                  }
                >
                  {selectedRange
                    ? "Išsaugoti pakeitimus" // Changed text for clarity
                    : "Patvirtinti užsakymą"}
                </Button>

                {selectedRange && (
                  <Button
                    onClick={handleDeleteRange}
                    color="red"
                    size="md"
                    variant="outline"
                  >
                    Atšaukti užsakymą
                  </Button>
                )}
              </Group>
              {/* Button to clear selection / cancel editing - appears below if group grows */}
              {(selectedRange || displayDateRange[0]) && (
                <Button
                  onClick={resetSelection}
                  variant="light"
                  size="md"
                  color="blue"
                >
                  {selectedRange
                    ? "Atšaukti redagavimą"
                    : "Išvalyti pasirinkimą"}
                </Button>
              )}
            </Stack>
          </Box>
        </div>
        <div className="flex flex-col gap-2 border-l border-gray-300 pl-4">
          <h3>Rezervuotos datos:</h3>
          {bookedRanges.map((range) => {
            return <ListItem range={range}></ListItem>;
          })}
        </div>
      </div>

      {notificationText && (
        <Alert
          color={
            selectedRange && notificationText.includes("Redaguojamas užsakymas")
              ? "blue"
              : notificationText.includes("konfliktuoja") ||
                notificationText.includes("Klaida")
              ? "red"
              : notificationText.includes("Prašome pasirinkti")
              ? "yellow"
              : "green" // Default for success messages
          }
          mt="md"
          withCloseButton
          onClose={() => setNotificationText("")}
          title={
            selectedRange && notificationText.includes("Redaguojamas užsakymas")
              ? "Informacija"
              : notificationText.includes("konfliktuoja") ||
                notificationText.includes("Klaida")
              ? "Klaida"
              : notificationText.includes("Prašome pasirinkti")
              ? "Dėmesio"
              : "Sėkmė"
          }
        >
          {notificationText}
        </Alert>
      )}
    </Paper>
  );
};

export default Kalendorius;
