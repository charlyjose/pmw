import * as z from "zod";

export const placementFormSchema = z.object({
  // 1. Student details
  firstName: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  lastName: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  studentNumber: z
    .string()
    .min(9, {
      message: "Student number must be 9 digits",
    })
    .max(9, {
      message: "Student number must be 9 digits",
    }),
  email: z
    .string()
    .min(2, {
      message: "Email must be at least 2 characters.",
    })
    .max(30, {
      message: "Email must not be longer than 30 characters.",
    }).email(),
  programme: z
    .string()
    .min(2, {
      message: "Programme of study must be at least 2 characters.",
    })
    .max(100, {
      message: "Programme of study must not be longer than 100 characters.",
    }),
  department: z
    .string()
    .min(2, {
      message: "School/Department must be at least 2 characters.",
    })
    .max(100, {
      message: "School/Department must not be longer than 100 characters.",
    }),
  contactNumber: z
    .string()
    .min(2, {
      message: "Contact number must be at least 2 characters.",
    })
    .max(30, {
      message: "Contact number must not be longer than 30 characters.",
    }),
  studentVisa: z.string(),


  // 2. Placement provider details
  organisationName: z
    .string()
    .min(2, {
      message: "Name of Organisation must be at least 2 characters.",
    })
    .max(100, {
      message: "Name of Organisation must not be longer than 100 characters.",
    }),
  organisationAddress: z
    .string()
    .min(2, {
      message: "Address must be at least 2 characters.",
    })
    .max(100, {
      message: "Address must not be longer than 100 characters.",
    }),
  organisationPostcode: z
    .string()
    .min(5, {
      message: "Postcode must be at least 5 characters.",
    })
    .max(7, {
      message: "Postcode must not be longer than 7 characters.",
    }),
  organisationWebAddress: z
    .string().url(),
  organisationContactName: z
    .string()
    .min(2, {
      message: "Contact Name must be at least 2 characters.",
    })
    .max(100, {
      message: "Contact Name must not be longer than 100 characters.",
    }),
  organisationContactJobTitle: z
    .string()
    .min(2, {
      message: "Contact Job Title must be at least 2 characters.",
    })
    .max(100, {
      message: "Contact Job Title must not be longer than 100 characters.",
    }),
  organisationContactEmail: z
    .string()
    .min(2, {
      message: "Contact Email must be at least 2 characters.",
    })
    .max(100, {
      message: "Contact Email must not be longer than 100 characters.",
    }).email(),
  organisationContactNumber: z
    .string()
    .min(2, {
      message: "Contact Number must be at least 2 characters.",
    })
    .max(30, {
      message: "Contact Number must not be longer than 30 characters.",
    }).optional(),


  // 3. Placement Role Details
  roleTitle: z
    .string()
    .min(2, {
      message: "Role Title must be at least 2 characters.",
    })
    .max(100, {
      message: "Role Title must not be longer than 100 characters.",
    }),
  roleStartDate: z.date({
    required_error: "Role Start Date is required",
  }).refine((data) => {
    const today = new Date();
    const selectedDate = new Date(data);
    return selectedDate >= today;
  }, {
    message: "Role Start Date must be in the future",
  }),
  roleEndDate: z.date({
    required_error: "Role End Date is required",
  }).refine((data) => {
    const today = new Date();
    const selectedDate = new Date(data);
    return selectedDate >= today;
  }, {
    message: "Role End Date must be in the future",
  }),
  workingHours: z
    .string(),
  probationPeriod: z.string(),
  salary: z
    .string(),
  roleSource: z.string(),
  roleInformed: z.string(),
  roleDescription: z
    .string()
    .min(2, {
      message: "Role Description must be at least 2 characters.",
    })
    .max(1000, {
      message: "Role Description must not be longer than 1000 characters.",
    }),
  probationPeriodDetails: z
    .string()
    .min(2, {
      message: "Probation Period Details must be at least 2 characters.",
    })
    .max(1000, {
      message: "Probation Period Details must not be longer than 1000 characters.",
    }).optional(),


  // 4. Work Factors
  remoteWorking: z.string(),
  remoteWorkingOverview: z
    .string()
    .min(2, {
      message: "Remote Working Overview must be at least 2 characters.",
    })
    .max(1000, {
      message: "Remote Working Overview must not be longer than 1000 characters.",
    }).optional(),
  remoteWorkingReason: z
    .string()
    .min(2, {
      message: "Remote Working Reason must be at least 2 characters.",
    })
    .max(1000, {
      message: "Remote Working Reason must not be longer than 1000 characters.",
    }).optional(),


  // 5. Transport and Travel Factors
  travelMethod: z.string(),
  travelMethodDetails: z
    .string()
    .min(2, {
      message: "Travel Method Details must be at least 2 characters.",
    })
    .max(1000, {
      message: "Travel Method Details must not be longer than 1000 characters.",
    }).optional(),
  travelDifferentLocation: z.string(),
  travelDifferentLocationDetails: z
    .string()
    .min(2, {
      message: "Travel Different Location Details must be at least 2 characters.",
    })
    .max(1000, {
      message: "Travel Different Location Details must not be longer than 1000 characters.",
    }).optional(),


  // 6. Location and Regional Factors
  locationRisks: z
    .string(),
  locationRisksDetails: z
    .string().
    min(2, {
      message: "Location Risks Details must be at least 2 characters.",
    })
    .max(1000, {
      message: "Location Risks Details must not be longer than 1000 characters.",
    }).optional(),
  accommodationArrangements: z
    .string(),
  accommodationArrangementsDetails: z
    .string().
    min(2, {
      message: "Accommodation Arrangements Details must be at least 2 characters.",
    })
    .max(1000, {
      message: "Accommodation Arrangements Details must not be longer than 1000 characters.",
    }).optional(),


  // 7. Health and Environmental Factors
  precautionaryMeasures: z
    .string(),
  precautionaryMeasuresDetails: z
    .string().
    min(2, {
      message: "Precautionary Measures Details must be at least 2 characters.",
    })
    .max(1000, {
      message: "Precautionary Measures Details must not be longer than 1000 characters.",
    }).optional(),


  // 8. Personal Factors
  healthConditions: z
    .string(),
  healthConditionsDetails: z
    .string().
    min(2, {
      message: "Health Conditions Details must be at least 2 characters.",
    })
    .max(1000, {
      message: "Health Conditions Details must not be longer than 1000 characters.",
    }).optional(),
  disability: z
    .string(),
  disabilityDetails: z
    .string().
    min(2, {
      message: "Disability Details must be at least 2 characters.",
    })
    .max(1000, {
      message: "Disability Details must not be longer than 1000 characters.",
    }).optional(),


  // 9. Policies and Insurance
  placementOverseas: z.string(),


  // Declaration
  declarationName: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  declarationSignature: z
    .string()
    .min(2, {
      message: "Signature must be at least 2 characters.",
    })
    .max(30, {
      message: "Signature must not be longer than 30 characters.",
    }),
});

/*
1. Student details
First name
Last name
Student number
Email address
Programme of study
School/Department
Contact telephone number
Do you have a student visa?
------------------------------------------------------------------------------------------------------------------------
2. Placement provider details
Name of Organisation
Address where the placement will be based
Postcode
Web Address
Contact Name
Contact Job Title
Contact Email
Contact Telephone Number
------------------------------------------------------------------------------------------------------------------------
3. Placement Role Details
Role Title
Role Start Date
Role End Date
Working hours per week
Does your role include a probation period?
What is your salary (annual) for the placement?
How did you source this role?
Have you informed the Placement Provider that this placement forms part of your degree programme?
Please provide a role description of your placement. Alternatively, please attach a role description to your email submitting this form.
------------------------------------------------------------------------------------------------------------------------
4. Work Factors
Does this role involve working from home/remotely
Please provide an overview of how you will work remotely. This should include how often you will work remotely each week.
Why does this role involve working from home?
------------------------------------------------------------------------------------------------------------------------
5. Transport and Travel Factors
How will you travel to and from the placement?
Does this role involve working at a location different to the Placement Provider’s address that you have given in section 2?
------------------------------------------------------------------------------------------------------------------------
6.Location and Regional Factors
Are you aware of any risks at the organisation’s main location?
What are your accommodation arrangements when on placement?
------------------------------------------------------------------------------------------------------------------------
7. Health and Environmental Factors
Are you aware of any precautionary measures you are required to undertake before, during, or after the placement?
------------------------------------------------------------------------------------------------------------------------
8. Personal Factors
Do you have any health conditions that may require adjustments on your placement?
Do you have a disability which may require adjustments on your placement?
------------------------------------------------------------------------------------------------------------------------
9. Policies and Insurance
Is your placement overseas, or does it require international travel?
------------------------------------------------------------------------------------------------------------------------
10. Declaration and Signature
Name
Signature




*/