const createHttpError = require("http-errors");
const { object, string, mixed, number } = require("yup");

const validateCreate = async (user) => {
  try {
    const schema = object({
      fullName: string().required("Full name is required"),
      password: string().required("Password is required"),
      email: string().email().required("Email is required"),
      genre: mixed()
        .oneOf(["Male", "Female"], "Gender must be either Male or Female")
        .required("Role is required")
        .defined(),
      age: number()
        .required("Age is required")
        .positive("Age must be positive"),
      phoneNumber: string().required("Phone number is required"),
      role: mixed()
        .oneOf(["recruiter", "job_seeker", "admin", "superAdmin"])
        .required("Role is required")
        .defined(),
      company: string().when("role", {
        is: "recruiter",
        then: (schema) => schema.required("Company is required"),
      }),
      skills: string().when("role", {
        is: "job_seeker",
        then: (schema) => schema.required("Skills are required"),
      }),
      degrees: string().when("role", {
        is: "job_seeker",
        then: (schema) => schema.required("Degrees are required"),
      }),
      majors: string().when("role", {
        is: "job_seeker",
        then: (schema) => schema.required("Majors are required"),
      }),
    });
    const data = schema.validateSync(user);

    return data;
  } catch (err) {
    throw createHttpError(400, err);
  }
};

module.exports = {
  validateCreate: validateCreate,
};
