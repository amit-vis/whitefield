const validateEmail = (email) => {
    const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegx.test(email);
};

const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
};

const validateRequiredFields = (fields) => {
    return fields.every(field => field !== undefined && field !== "");
};

module.exports = {
    validateEmail,
    validateMobile,
    validateRequiredFields
}