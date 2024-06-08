function validate_name(name, type) {
  if (name.length < 3) {
    return { validity: false, message: `The ${type} cannot be shorter than 3 characters.` };
  }
  if (name.length > 32) {
    return { validity: false, message: `The ${type} cannot be longer than 32 characters` };
  }
  // Regular expression to match only letters (uppercase and lowercase), spaces, and hyphens
  const regex = /^[a-zA-Z\s\-]+$/;

  if (!regex.test(name)) {
    return { validity: false, message: `The ${type} can only be letters.` };
  }
  return { validity: true };
}
function validate_password(password, confirm_password) {
  if (password.length <= 5) {
    return { validity: false, message: `The password length must be greater than 5.` };
  }
  if (password.length >= 15) {
    return { validity: false, message: `The password length must be less than 15.` };
  }

  if (password !== confirm_password) {
    return { validity: false, message: `Passwords do not match.` };
  }
  return { validity: true };
}

function validate_role(role) {
  // Array of valid roles
  const valid_roles = ["a", "gp", "op"];

  // Check if the role is included in the array of valid roles
  if (valid_roles.includes(role)) {
    return { validity: true };
  }
  return { validity: false, message: `Invalid type of role.` };
}

function validate_username(username) {
  // Check if the length of the username is within the specified range
  if (username.length <= 5) {
    return { validity: false, message: `The username length must be greater than 5.` };
  }
  if (username.length >= 15) {
    return { validity: false, message: `The username length must be less than 15.` };
  }
  return { validity: true };
}

const validate_user = (first_name, middle_name, last_name, username, role, password, confirm_password) => {
  // check for first name, middle name and last name
  const first_name_validity = validate_name(first_name, "first name");
  const middle_name_validity = validate_name(middle_name, "middle name");
  const last_name_validity = validate_name(last_name, "last name");

  if (!first_name_validity.validity) {
    return first_name_validity;
  }
  if (!middle_name_validity.validity) {
    return middle_name_validity;
  }
  if (!last_name_validity.validity) {
    return last_name_validity;
  }
  //check for username
  const username_validty = validate_username(username);
  if (!username_validty.validity) {
    return username_validty;
  }
  //check for password
  const password_validty = validate_password(password, confirm_password);
  if (!password_validty.validity) {
    return password_validty;
  }
  //check for role
  const role_validity = validate_role(role);
  if (!role_validity.validity) {
    return role_validity;
  }
  return { validity: true };
};

module.exports = validate_user;
