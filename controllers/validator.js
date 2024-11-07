const { param, body, validationResult } = require("express-validator")
const accountValidation = () => {
  return [
    body("firstName")
      // Each field is required. Verified as not null, undefined, or falsy
      .exists({ checkFalsy: true })
        .withMessage("First name is required.")
      .bail()
      .isAlpha()
        .withMessage("Please use letters only.")
      .isLength({ min: 2 })
        .withMessage("Please write your full first name."),
    body("lastName")
      .exists({ checkFalsy: true })
        .withMessage("Last name is required.")
      .bail()
      .isAlpha()
        .withMessage("Please use letters only.")
      .isLength({ min: 2 })
        .withMessage("Please write your full last name."),
    body("email")
      .exists({ checkFalsy: true })
        .withMessage("Email is required.")
      .bail()
      .isEmail()
        .withMessage("Please use a valid email."), 
    body("street")
      .exists({ checkFalsy: true })
        .withMessage("Street address is required.")
      .bail()
      .isLength({ min: 5, max: 100 })
        .withMessage("Street address must be at least 5 characters."), 
    // Source: https://stackoverflow.com/questions/43872975/regular-expression-to-match-u-s-cities-allowing-certain-special-characters
    body("city")
      .exists({ checkFalsy: true })
        .withMessage("City is required.")
      .bail()
      .matches(/^[a-zA-Z',.\s-]{1,25}$/g)
        .withMessage("City name must contain only accepted characters."), 
    body("state")
      .exists({ checkFalsy: true })
        .withMessage("State is required.")
      .bail()
      .isAlpha()
        .withMessage("Please use letters only.")
      .isLength({ min: 2, max: 2 })
        .withMessage("Please us a 2 digit state code."), 
    body("zip")
      .exists({ checkFalsy: true })
        .withMessage("Zip code is required.")
      .bail()
      .isPostalCode("US")
        .withMessage("Enter a valid US zip code."), 
    body("phone")
      .isMobilePhone("en-US")
        .withMessage("Please a valid US phone number.")
  ];
}

const scheduleValidation = () => {
  return [
    body("accountID")
      // Make sure id exists and is not empty or falsy
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Id is required.")
      // Stops validation chain if id is missing
      .bail()
      .isMongoId()
      .withMessage("Please use a valid MongoDB ID."),
    body("scheduleDate")
      .exists({ checkFalsy: true })
        .withMessage("You must enter a date.")
      .bail()
      .isISO8601()
        .withMessage("Please use the following format: YYYY-MM-DD.")
      // Source: https://stackoverflow.com/questions/51480936/express-validator-how-to-validate-start-date-is-before-end-date
      .custom((value) => {
        const selectedDate = new Date(value);
        const currentDate = new Date();
        if (selectedDate < currentDate) {
          throw new Error("Please use a date that has not past.");
        }
        return true;
      }),
    body("scheduleTime")
      .exists({ checkFalsy: true })
        .withMessage("Time is required.")
      .bail()
      // Source: https://stackoverflow.com/questions/7536755/regular-expression-for-matching-hhmm-time-format
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Invalid time format. Use HH:MM in 24-hour format.'),
    body("notes")
      .exists({ checkFalsy: true })
        .withMessage("Please enter an initial comment.")
      .bail()
      .notEmpty()
        .withMessage("Notes cannot be empty.")
      .isLength({ max: 1000 })
        .withMessage("Notes exceed the max limit of 1,000 characters.")
  ];
}

const noteValidation = () => {
  return [
    body("notes")
      .exists({ checkFalsy: true })
        .withMessage("Please enter an initial comment.")
      .bail()
      .notEmpty()
        .withMessage("Notes cannot be empty.")
      .isLength({ max: 1000 })
        .withMessage("Notes exceed the max limit of 1,000 characters.")
  ];
}

const idValidation = () => {
  return [
    param("id")
      // Make sure id exists and is not empty or falsy
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Id is required.")
      // Stops validation chain if id is missing
      .bail()
      .isMongoId()
      .withMessage("Please use a valid MongoDB ID.")
  ];
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ 
    // [err.param]: err.msg
    field: err.param, 
    message: err.msg
   }));

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  accountValidation, 
  scheduleValidation, 
  noteValidation, 
  idValidation, 
  validate
}