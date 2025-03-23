export const websiteUrlConstraints = {
  maxLength: 100,
  match: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
};

export const nameConstraints = {
  maxLength: 15,
};

export const descriptionConstraints = {
  maxLength: 500,
};
