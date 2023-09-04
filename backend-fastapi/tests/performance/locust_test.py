import random

from locust import HttpUser, between, task

from tests.helpers import TEAM_CSD, TEAM_TUTOR, TEST_CSD_TOKEN, TEST_STUDENT_TOKEN, TEST_TUTOR_TOKEN

class PerformanceTests(HttpUser):
    wait_time = between(1, 3)

    """
        Group: Authentication
        Test to sign in user

        API: /api/auth/token
        Invoke by: Student
        Requires:
            - email
            - password
        Returns:
            - token
    """

    @task(1)
    def test_signin(self):
        response = self.client.post("/api/auth/token", json={"email": "charly@student.com", "password": "123"})
        # print(response.json())

    """
        Group: Users
        Test to get own user data

        API: /api/users/me
        Invoke by: Student
        Requires:
            - token
        Returns:
            - user data
    """

    @task(2)
    def test_get_own_user_data(self):
        response = self.client.get(url="/api/users/me", headers={"authorization": "Bearer " + TEST_STUDENT_TOKEN})
        # print(response.json())

    """
        Group: Users
        Test to check if user email exists

        API: /api/users/email/exists
        Invoked by: Tutor
        Requires:
            - email
        Returns:
            - email exists
    """

    @task(3)
    def test_check_email(self):
        response = self.client.get(
            "/api/users/email/exists", params={"email": "charly@student.com"}, headers={"authorization": "Bearer " + TEST_TUTOR_TOKEN}
        )
        # print(response.json())

    """
        Group: Notifications
        Test to get notifications for a specific user

        API: /api/notifications
        Invoked by: Tutor
        Requires:
            - token
        Returns:
            - notifications
    """

    @task(4)
    def test_get_notifications(self):
        response = self.client.get(url="/api/notifications", headers={"authorization": "Bearer " + TEST_TUTOR_TOKEN})
        # print(response.json())

    """
        Group: Appointments
        Test to get all appointments for a team

        API: /api/appointments/team/future
        Invoked by: CSD
        Requires:
            - token
        Returns:
            - appointments
    """

    @task(5)
    def test_get_all_appointments(self):
        response = self.client.get(
            url=f"/api/appointments/team/future?team={TEAM_CSD}", headers={"authorization": "Bearer " + TEST_CSD_TOKEN}
        )
        # print(response.json())

    """
        Group: Appointments
        Test to get all appointments for a student

        API: /api/appointments/me/future
        Invoked by: Student
        Requires:
            - token
        Returns:
            - appointments
    """

    @task(6)
    def test_get_all_student_appointments(self):
        response = self.client.get(url="/api/appointments/me/future", headers={"authorization": "Bearer " + TEST_STUDENT_TOKEN})
        # print(response.json())

    """
        Group: Communications
        Test to get placement tutor email Id for student

        API: /api/communications/student/tutorEmailId
        Invoked by: Student
        Requires:
            - token
        Returns:
            - placement tutor email Id
    """

    @task(7)
    def test_get_placement_tutor_email_id(self):
        response = self.client.get(
            url="/api/communications/student/tutorEmailId", headers={"authorization": "Bearer " + TEST_STUDENT_TOKEN}
        )
        # print(response.json())

    """
        Group: Home
        Test to get home page data

        API: /api/home
        Invoked by: TUTOR
        Requires:
            - token
        Returns:
            - home page data
    """

    @task(8)
    def test_get_home_page_data(self):
        response = self.client.get(url="/api/home", headers={"authorization": "Bearer " + TEST_TUTOR_TOKEN})
        # print(response.json())

    """
        Group: Job Applications
        Test to get all job applications for a student

        API: /api/student/jobs/applications
        Invoked by: Student
        Requires:
            - token
        Returns:
            - job applications
    """

    @task(9)
    def test_get_all_job_applications(self):
        response = self.client.get(url="/api/student/jobs/applications", headers={"authorization": "Bearer " + TEST_STUDENT_TOKEN})
        # print(response.json())

    """
        Group: Jobs
        Test to get all jobs for a student

        API: /api/jobs
        Invoked by: Student
        Requires:
            - token
        Returns:
            - jobs
    """

    @task(10)
    def test_get_all_jobs(self):
        response = self.client.get(url=f"/api/jobs?page={random.randint(1, 5)}", headers={"authorization": "Bearer " + TEST_STUDENT_TOKEN})
        # print(response.json())

    """
        Group: Placement Applications
        Test to get all placement applications for a tutor

        API: /api/tutor/placement/applications
        Invoked by: Tutor
        Requires:
            - token
        Returns:
            - placement applications
    """

    @task(11)
    def test_get_all_placement_applications_for_tutor(self):
        response = self.client.get(
            url=f"/api/tutor/placement/applications?page={random.randint(1, 3)}", headers={"authorization": "Bearer " + TEST_TUTOR_TOKEN}
        )
        # print(response.json())

    """
        Group: Placement Applications
        Test to get all approved placement applications for CSD

        API: /api/csd/placement/applications/approved
        Invoked by: CSD
        Requires:
            - token
        Returns:
            - placement applications
    """

    @task(12)
    def test_get_all_placement_applications_for_csd(self):
        response = self.client.get(
            url=f"/api/csd/placement/applications/approved?page={random.randint(1, 3)}",
            headers={"authorization": "Bearer " + TEST_CSD_TOKEN},
        )
        # print(response.json())

    """
        Group: Placement Reports
        Test to get all placement reports for a tutor

        API: /api/tutor/placement/reports
        Invoked by: Tutor
        Requires:
            - token
        Returns:
            - placement reports
    """

    @task(13)
    def get_all_palcement_reports_for_tutor(self):
        response = self.client.get(
            url=f"/api/tutor/placement/reports?page={random.randint(1, 3)}", headers={"authorization": "Bearer " + TEST_TUTOR_TOKEN}
        )
        # print(response.json())

    """
        Group: Placement Visit Itineraries
        Test to get all placement visit itineraries for a tutor

        API: /api/tutor/placement/visit/itinerary
        Invoked by: Tutor
        Requires:
            - token
        Returns:
            - placement visit itineraries
    """

    @task(14)
    def test_get_all_placement_visit_itineraries_for_tutor(self):
        response = self.client.get(
            url=f"/api/tutor/placement/visit/itinerary?page={random.randint(1, 3)}", headers={"authorization": "Bearer " + TEST_TUTOR_TOKEN}
        )
        # print(response.json())
