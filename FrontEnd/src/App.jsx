import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import UserDetail from "./pages/UserDetails";
import Meetings from "./pages/Meetings";
import CreateMeeting from "./pages/CreateMeeting";
import MeetingDetails from "./pages/MeetingDetails";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

function App() {
  return (
      <Routes>
          <Route index element={<Home/>} />
          <Route path='/home' element={<Home/>} />
          <Route path="login" element={<Login/>} />
          <Route path="register" element={<Register/>} />
       <Route element={<Layout />}>   
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects/>} />
          <Route path='/projects/create' element={<CreateProject/>} />
          <Route path='/projects/edit/:id' element={<EditProject/>} />
          <Route path="users" element={<Users/>} />
          <Route path='/users/create' element={<CreateUser/>} />
          <Route path='/users/edit/:id' element={<EditUser/>} />
          <Route path='/users/:id' element={<UserDetail />} />
          <Route path="meetings" element={<Meetings/>} />
          <Route path='/meetings/create' element={<CreateMeeting/>} />
          <Route path='/meetings/:id' element={<MeetingDetails />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path='/tasks/create' element={<CreateTask />} />
          <Route path='/tasks/edit/:id' element={<EditTask />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
  );
}

export default App;