import  { lazy, Suspense} from "react";
import GlobalLoading from "../../components library/GlobalLoading";

const MyWorkout = lazy(() =>
  import("../../pages/OtherPage/Workout Routines/MyWorkout/MyWorkout")
);
const AddRequestWorkoutInputs = lazy(() =>
  import("../../pages/OtherPage/Workout Routines/AddRequestWorkoutInputs/AddRequestWorkoutInputs")
);
const Transactions = lazy(() =>
  import("../../pages/OtherPage/Financial Management/Transactions/Transactions")
);
const UnActiveUser = lazy(() =>
  import("../../pages/OtherPage/User Management/UnActiveUser")
);

const Invoices = lazy(() =>
  import("../../pages/OtherPage/Financial Management/Invoices/Invoices")
);
const AddTransactionType = lazy(() =>
  import(
    "../../pages/OtherPage/Financial Management/AddTransactionType/AddTransactionType"
  )
);
const AddRequestDietPlan = lazy(() =>
  import(
    "../../pages/OtherPage/Diet Plans/AddRequestDietPlan/AddRequestDietPlan"
  )
);
const AddPaymentMethod = lazy(() =>
  import(
    "../../pages/OtherPage/Financial Management/AddPaymentMethod/AddPaymentMethod"
  )
);

// Dashboard Pages
const Panel = lazy(() => import("../../pages/Dashboard/Panel"));
const Visitor = lazy(() =>
  import("../../pages/OtherPage/Overview/Visitor/Visitor")
);
const AddNewUser = lazy(() =>
  import("../../pages/OtherPage/User Management/AddNewUser")
);
const Members = lazy(() =>
  import("../../pages/OtherPage/User Management/Members")
);
const AssignLockers = lazy(() =>
  import("../../pages/OtherPage/Locker Management/AssignLockers")
);
const ManageLockers = lazy(() =>
  import("../../pages/OtherPage/Locker Management/ManageLockers")
);
const LockerPayments = lazy(() =>
  import("../../pages/OtherPage/Locker Management/LockerPayments")
);
const ExpenseTracking = lazy(() =>
  import(
    "../../pages/OtherPage/Financial Management/ExpenseTracking/ExpenseTracking"
  )
);
const TaxManagement = lazy(() =>
  import("../../pages/OtherPage/Financial Management/TaxManagement")
);
const AutomatedReminders = lazy(() =>
  import("../../pages/OtherPage/Member Follow-Up/AutomatedReminders")
);
const FeedbackSurveys = lazy(() =>
  import("../../pages/OtherPage/Member Follow-Up/FeedbackSurveys")
);
const FollowUpScheduling = lazy(() =>
  import("../../pages/OtherPage/Member Follow-Up/FollowUpScheduling")
);
const DueFinder = lazy(() =>
  import("../../pages/OtherPage/Member Follow-Up/DueFinder")
);
const RoutineLibrary = lazy(() =>
  import("../../pages/OtherPage/Workout Routines/RoutineLibrary")
);
const CreateRoutine = lazy(() =>
  import("../../pages/OtherPage/Workout Routines/CreateRoutine")
);
const AssignRoutine = lazy(() =>
  import("../../pages/OtherPage/Workout Routines/AssignRoutine")
);
const TrackProgress = lazy(() =>
  import("../../pages/OtherPage/Workout Routines/TrackProgress")
);
const ScheduleClasses = lazy(() =>
  import("../../pages/OtherPage/Class and Event Management/ScheduleClasses")
);
const ManageClasses = lazy(() =>
  import("../../pages/OtherPage/Class and Event Management/ManageClasses")
);
const RegisterClasses = lazy(() =>
  import("../../pages/OtherPage/Class and Event Management/RegisterClasses")
);
const ClassAttendance = lazy(() =>
  import("../../pages/OtherPage/Class and Event Management/ClassAttendance")
);

// const FinancialReports = lazy(() =>
//   import("../../pages/OtherPage/Reports and Analytics/FinancialReports")
// );
const MemberPackage = lazy(() =>
  import("../../pages/OtherPage/Setup/MemberPackage")
);
const StaffRole = lazy(() => import("../../pages/OtherPage/Setup/StaffRole"));
const ChangePassword = lazy(() =>
  import("../../pages/OtherPage/Setup/ChangePassword")
);
const Usermigration = lazy(() =>
  import("../../pages/OtherPage/User Management/User-migration")
);
const GymStaff = lazy(() =>
  import("../../pages/OtherPage/User Management/GymStaff/GymStaff")
);
const Addworkout = lazy(() =>
  import("../../pages/OtherPage/Workout Routines/Addworkout")
);
const Announcement = lazy(() =>
  import("../../pages/OtherPage/Setup/Announcement")
);

const UpdateAccessinfo = lazy(() =>
  import("../../pages/OtherPage/User Management/UpdateAccessinfo")
);
// SMS Area
const SmsCampaign = lazy(() =>
  import("../../pages/OtherPage/SMS Management/SmsCampaign")
);
const SMSLogs = lazy(() =>
  import("../../pages/OtherPage/SMS Management/SMSLogs")
);
const Sendsinglesms = lazy(() =>
  import("../../pages/OtherPage/SMS Management/Sendsinglesms")
);
const Sendgroupsms = lazy(() =>
  import("../../pages/OtherPage/SMS Management/Sendgroupsms")
);
const Smstemplates = lazy(() =>
  import("../../pages/OtherPage/SMS Management/Smstemplates")
);
const SmsGroup = lazy(() =>
  import("../../pages/OtherPage/SMS Management/SmsGroup")
);

const AddPackagePage = lazy(() =>
  import("../../pages/OtherPage/User Management/AddPackage/AddPackagePage")
);

const InitialPage = lazy(() =>
  import("../../pages/OtherPage/Overview/InitialPage/InitialPage")
);
const Workout_routine = lazy(() =>
  import("../../pages/User_Dashboard/Workout_routine")
);
const Diet_plan = lazy(() => import("../../pages/User_Dashboard/Diet_plan"));
const Change_Password = lazy(() =>
  import("../../pages/User_Dashboard/Change_Password")
);
const Shedule_Classes = lazy(() =>
  import("../../pages/User_Dashboard/Shedule_Classes")
);
const User_Profile = lazy(() =>
  import("../../pages/User_Dashboard/User_Profile")
);

const DietLibrary = lazy(() =>
  import("../../pages/OtherPage/Diet Plans/DietLibrary/DietLibrary")
);
const RequestDietPlan = lazy(() =>
  import("../../pages/OtherPage/Diet Plans/RequestDietPlan/RequestDietPlan")
);
const AssignDietPlan = lazy(() =>
  import("../../pages/OtherPage/Diet Plans/AssignDietPlan/AssignDietPlan")
);
const TrackDietProgress = lazy(() =>
  import("../../pages/OtherPage/Diet Plans/TrackDietProgress")
);
const UserProfile = lazy(() =>
  import("../../pages/OtherPage/Setup/UserProfile")
);
const CompanyProfile = lazy(() =>
  import("../../pages/OtherPage/Setup/CompanyProfile")
);

const DoorReport = lazy(() =>
  import("../../pages/OtherPage/Door Acess/Report")
);
const MonthlyDoor = lazy(() =>
  import("../../pages/OtherPage/Door Acess/Monthly")
);
const DailyDoor = lazy(() => import("../../pages/OtherPage/Door Acess/Daily"));
const DoorHistory = lazy(() =>
  import("../../pages/OtherPage/Door Acess/History")
);
const Userpermission = lazy(() =>
  import("../../pages/OtherPage/Setup/UserPermission/Userpermission")
);
const SenderID = lazy(() =>
  import("../../pages/OtherPage/SMS Management/SenderID")
);
const PrivateRoute = lazy(() => import("./routes/PrivateRoute"));

function DashboardChildrenRoutes() {
  // const axiosSecure = UseAxiosSecure();

  const user = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser == "undefined" || storedUser == null
      ? null
      : JSON.parse(storedUser);
  };

  console.log("user routes", user());

  const role = user()?.role || "";
  // const role = "Front Desk Officer"; // add later
  // const role = "admin"; // add later
  // const role = "Coffee Shtaff";
  // const role = "Operation Manager";

  // fetchPermissions();

  // const permissionRoutesArray = fetchPermissions();

  const isPermittedRoute = (pathName) => {
    const permissionRoutesArray = () => {
      const storedUser = localStorage.getItem("permissionRoutes");
      return storedUser == "undefined" || storedUser == null
        ? []
        : JSON.parse(storedUser);
    };
    const isAllowed = permissionRoutesArray()
      ? permissionRoutesArray().includes(pathName)
      : false;

    if (role === "admin") {
      return pathName;
    }

    // return pathName;
    return isAllowed ? pathName : "";
  };

  // console.log("filterRouteItems", filterRouteItems);
  const dashboardChildrenRoutes = [
    // errorElement: <PrivateRoute> <Error404></Error404></PrivateRoute>,
    {
      path: "",
      element: (
        // <PrivateRoute>
        //   <Panel></Panel>
        // </PrivateRoute>
        // <InitialPage />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Panel />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      path: isPermittedRoute("overview"),
      element: (
        // <PrivateRoute>
        //   <Panel></Panel>
        // </PrivateRoute>
        // <InitialPage />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <InitialPage />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "visitor",
      path: isPermittedRoute("visitor"),

      element: (
        // <PrivateRoute>
        //   <Visitor />
        // </PrivateRoute>
        // <Visitor />

        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Visitor />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "workout-routine",
      path: isPermittedRoute("create-workout-question-input"),
      element: (
        // <PrivateRoute>
        //   <Visitor />
        // </PrivateRoute>
        // <Workout_routine />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <AddRequestWorkoutInputs />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "workout-routine",
      path: isPermittedRoute("workout-routine"),
      element: (
        // <PrivateRoute>
        //   <Visitor />
        // </PrivateRoute>
        // <Workout_routine />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Workout_routine />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "workout-routine",
      path: isPermittedRoute("my-workout"),
      element: (
        // <PrivateRoute>
        //   <Visitor />
        // </PrivateRoute>
        // <Workout_routine />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <MyWorkout />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "diet-plan",
      path: isPermittedRoute("diet-plan"),
      element: (
        // <PrivateRoute>
        //   <Visitor />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Diet_plan />
          </PrivateRoute>
        </Suspense>
        // <p>Hellow</p>
      ),
    },
    {
      // path: "user_profile",
      path: isPermittedRoute("user_profile"),
      element: (
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <User_Profile />
          </PrivateRoute>
        </Suspense>
      ),
    },

    {
      // path: "shedule_classes",
      path: isPermittedRoute("shedule_classes"),
      element: (
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Shedule_Classes />
          </PrivateRoute>
        </Suspense>
      ),
    },

    {
      // path: "change_password",
      path: isPermittedRoute("change_password"),
      element: (
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Change_Password />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "diet-plan",
      path: isPermittedRoute("add-request-diet-plan"),
      element: (
        // <PrivateRoute>
        //   <Visitor />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <AddRequestDietPlan />
          </PrivateRoute>
        </Suspense>
        // <p>Hellow</p>
      ),
    },
    {
      // path: "add-new-user",
      path: isPermittedRoute("add-new-user"),
      element: (
        // <PrivateRoute>
        //   <AddNewUser />
        // </PrivateRoute>
        // <AddNewUser />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <AddNewUser />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "members",
      path: isPermittedRoute("members"),
      element: (
        // <PrivateRoute>
        //   <Members />
        // </PrivateRoute>
        // <Members />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Members />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      path: "add_package/:id",
      // path: isPermittedRoute("add_package/:id"),
      element: (
        // <PrivateRoute>
        //   <Members />
        // </PrivateRoute>
        // <AddPackagePage />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <AddPackagePage />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "gym-staff",
      path: isPermittedRoute("gym-staff"),

      element: (
        // <PrivateRoute>
        //   <GymStaff />
        // </PrivateRoute>
        // <GymStaff />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <GymStaff />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "assign-lockers",
      path: isPermittedRoute("assign-lockers"),
      element: (
        // <PrivateRoute>
        //   <AssignLockers />
        // </PrivateRoute>
        // <AssignLockers />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <AssignLockers />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "manage-lockers",
      path: isPermittedRoute("manage-lockers"),
      element: (
        // <PrivateRoute>
        //   <ManageLockers />
        // </PrivateRoute>
        // <ManageLockers />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <ManageLockers />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "locker-payments",
      path: isPermittedRoute("locker-payments"),
      element: (
        // <PrivateRoute>
        //   <LockerPayments />
        // </PrivateRoute>
        // <LockerPayments />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <LockerPayments />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "invoices-billing",
      path: isPermittedRoute("invoices-billing"),
      element: (
        // <PrivateRoute>
        //   <InvoicesBilling />
        // </PrivateRoute>
        // <InvoicesBilling />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "reports",
      path: isPermittedRoute("reports"),
      element: (
        // <PrivateRoute>
        //   <InvoicesBilling />
        // </PrivateRoute>
        // <Report />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Invoices />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "expense-tracking",
      path: isPermittedRoute("expense-tracking"),
      element: (
        // <PrivateRoute>
        //   <ExpenseTracking />
        // </PrivateRoute>
        // <ExpenseTracking />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <ExpenseTracking />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "tax-management",
      path: isPermittedRoute("tax-management"),
      element: (
        // <PrivateRoute>
        //   <TaxManagement />
        // </PrivateRoute>
        // <TaxManagement />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <TaxManagement />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "automated-reminders",
      path: isPermittedRoute("automated-reminders"),
      element: (
        // <PrivateRoute>
        //   <AutomatedReminders />
        // </PrivateRoute>
        // <AutomatedReminders />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <AutomatedReminders />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "feedback-surveys",
      path: isPermittedRoute("feedback-surveys"),
      element: (
        // <PrivateRoute>
        //   <FeedbackSurveys />
        // </PrivateRoute>
        // <FeedbackSurveys />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <FeedbackSurveys />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "follow-up-scheduling",
      path: isPermittedRoute("follow-up-scheduling"),

      element: (
        // <PrivateRoute>
        //   <FollowUpScheduling />
        // </PrivateRoute>
        // <FollowUpScheduling />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <FollowUpScheduling />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "due-finder",
      path: isPermittedRoute("due-finder"),
      element: (
        // <PrivateRoute>
        //   <DueFinder />
        // </PrivateRoute>
        // <DueFinder />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <DueFinder />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "routine-library",
      path: isPermittedRoute("routine-library"),

      element: (
        // <PrivateRoute>
        //   <RoutineLibrary />
        // </PrivateRoute>
        // <RoutineLibrary />
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <RoutineLibrary />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "create-routine",
      path: isPermittedRoute("create-routine"),
      element: (
        // <PrivateRoute>
        //   <CreateRoutine />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <CreateRoutine />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "assign-routine",
      path: isPermittedRoute("assign-routine"),
      element: (
        // <PrivateRoute>
        //   <AssignRoutine />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <AssignRoutine />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "track-progress",
      path: isPermittedRoute("track-progress"),
      element: (
        // <PrivateRoute>
        //   <TrackProgress />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <TrackProgress />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "diet-library",
      path: isPermittedRoute("diet-library"),
      element: (
        // <PrivateRoute>
        //   <DietLibrary />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <DietLibrary />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "request-diet-plan",
      path: isPermittedRoute("request-diet-plan"),
      element: (
        // <PrivateRoute>
        //   <CreateDietPlan />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <RequestDietPlan />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "assign-diet-plan",
      path: isPermittedRoute("assign-diet-plan"),
      element: (
        // <PrivateRoute>
        //   <AssignDietPlan />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <AssignDietPlan />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "track-diet-progress",
      path: isPermittedRoute("track-diet-progress"),
      element: (
        // <PrivateRoute>
        //   <TrackDietProgress />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <TrackDietProgress />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "schedule-classes",
      path: isPermittedRoute("schedule-classes"),
      element: (
        // <PrivateRoute>
        //   <ScheduleClasses />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <ScheduleClasses />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "manage-classes",
      path: isPermittedRoute("manage-classes"),
      element: (
        // <PrivateRoute>
        //   <ManageClasses />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <ManageClasses />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "register-classes",
      path: isPermittedRoute("register-classes"),
      element: (
        // <PrivateRoute>
        //   <RegisterClasses />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <RegisterClasses />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "class-attendance",
      path: isPermittedRoute("class-attendance"),

      element: (
        // <PrivateRoute>
        //   <ClassAttendance />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <ClassAttendance />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "member-package",
      path: isPermittedRoute("member-package"),

      element: (
        // <PrivateRoute>
        //   <MemberPackage />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <MemberPackage />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "staff-role",
      path: isPermittedRoute("staff-role"),
      element: (
        // <PrivateRoute>
        //   <StaffRole />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <StaffRole />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "staff-role",
      path: isPermittedRoute("payment-method"),
      element: (
        // <PrivateRoute>
        //   <StaffRole />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <AddPaymentMethod />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "staff-role",
      path: isPermittedRoute("create-transaction-type"),
      element: (
        // <PrivateRoute>
        //   <StaffRole />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <AddTransactionType />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "change-password",
      path: isPermittedRoute("change-password"),
      element: (
        // <PrivateRoute>
        //   <ChangePassword />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "user-migration",
      path: isPermittedRoute("user-migration"),

      element: (
        // <PrivateRoute>
        //   <Usermigration />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Usermigration />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "addworkout",
      path: isPermittedRoute("addworkout"),
      element: (
        // <PrivateRoute>
        //   <Addworkout />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Addworkout />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "smscampaign",
      path: isPermittedRoute("smscampaign"),
      element: (
        // <PrivateRoute>
        //   <SmsCampaign />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <SmsCampaign />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "smslogs",
      path: isPermittedRoute("smslogs"),
      element: (
        // <PrivateRoute>
        //   <SMSLogs />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <SMSLogs />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "sendsinglesms",
      path: isPermittedRoute("sendsinglesms"),
      element: (
        // <PrivateRoute>
        //   <Sendsinglesms />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Sendsinglesms />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "sendgroupsms",
      path: isPermittedRoute("sendgroupsms"),
      element: (
        // <PrivateRoute>
        //   <Sendgroupsms />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Sendgroupsms />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "userprofile",
      path: isPermittedRoute("userprofile"),
      element: (
        // <PrivateRoute>
        //   <UserProfile />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "companyprofile",
      path: isPermittedRoute("companyprofile"),
      element: (
        // <PrivateRoute>
        //   <CompanyProfile />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <CompanyProfile />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "smstemplates",
      path: isPermittedRoute("smstemplates"),
      element: (
        // <PrivateRoute>
        //   <Smstemplates />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Smstemplates />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "smsgroup",
      path: isPermittedRoute("smsgroup"),

      element: (
        // <PrivateRoute>
        //   <SmsGroup />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <SmsGroup />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "doorreport",
      path: isPermittedRoute("doorreport"),

      element: (
        // <PrivateRoute>
        //   <SmsGroup />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <DoorReport />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "monthlydoor",
      path: isPermittedRoute("monthlydoor"),
      element: (
        // <PrivateRoute>
        //   <SmsGroup />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <MonthlyDoor />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "doorhistory",
      path: isPermittedRoute("unactiveuser"),
      element: (
        // <PrivateRoute>
        //   <SmsGroup />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <UnActiveUser />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "doorhistory",
      path: isPermittedRoute("updateaccessinfo"),
      element: (
        // <PrivateRoute>
        //   <SmsGroup />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <UpdateAccessinfo />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "doorhistory",
      path: isPermittedRoute("announcement"),
      element: (
        // <PrivateRoute>
        //   <SmsGroup />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Announcement />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "dailydoor",
      path: isPermittedRoute("dailydoor"),
      element: (
        // <PrivateRoute>
        //   <SmsGroup />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <DailyDoor />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "senderid",
      path: isPermittedRoute("senderid"),
      element: (
        // <PrivateRoute>
        //   <SmsGroup />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <SenderID />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      // path: "doorhistory",
      path: isPermittedRoute("doorhistory"),
      element: (
        // <PrivateRoute>
        //   <SmsGroup />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <DoorHistory />
          </PrivateRoute>
        </Suspense>
      ),
    },

    {
      // path: "userpermission",
      path: isPermittedRoute("userpermission"),
      element: (
        // <PrivateRoute>
        //   <SmsGroup />
        // </PrivateRoute>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute>
            <Userpermission />
          </PrivateRoute>
        </Suspense>
      ),
    },
  ];

  // return role === "admin" ? dashboardChildrenRoutes : [];
  return dashboardChildrenRoutes;
}

export default DashboardChildrenRoutes;
