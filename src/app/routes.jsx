// File: src/app/routes.jsx

import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import AppointmentsList from "../pages/appointments/AppointmentsList";
import AppointmentCreate from "../pages/appointments/AppointmentCreate";
import AppointmentDetails from "../pages/appointments/AppointmentDetails";

export const router = createBrowserRouter([
  { path: "/", element: <AppointmentsList /> },
  { path: "/login", element: <Login /> },

  { path: "/appointments", element: <AppointmentsList /> },
  { path: "/appointments/new", element: <AppointmentCreate /> },
  { path: "/appointments/:id", element: <AppointmentDetails /> },
]);
