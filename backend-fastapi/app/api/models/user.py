from app.api.models.auth import SignUpFormForStudent, SignUpFormGeneral, SignUpFormWithDepartment, SignUpFormWithoutPassword


class CleanedUserData(SignUpFormWithoutPassword):
    pass


class CleanedStudentData(SignUpFormGeneral, SignUpFormForStudent, SignUpFormWithDepartment):
    pass
