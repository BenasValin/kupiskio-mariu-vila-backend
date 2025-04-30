
// src/types.ts (create this file if it doesn't exist)
import moment from 'moment';

export interface BookedRangeData {
  house: string;
  start_date: string; // Assuming API returns dates as strings
  end_date: string;   // Assuming API returns dates as strings
  name?: string;
  surname?: string;
  phone?: string;
  email?: string;
  message?: string;
}

export interface BlockedDateData {
    date: string; // Assuming API returns dates as strings
}


export interface BookedRange {
  house: string;
  startDate: moment.Moment;
  endDate: moment.Moment;
  color: string;
}

export interface BookingInfo {
  name: string;
  surname: string;
  phone: string;
  email: string;
  message: string;
}

export interface BookingInfoData {
  name: string;
  surname: string;
  phone: string;
  email: string;
  message: string;
  // Add other fields if the API returns more
}

export interface ApiError {
    message: string;
    // other potential error fields
}