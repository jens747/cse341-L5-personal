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
  idValidation, 
  validate
}