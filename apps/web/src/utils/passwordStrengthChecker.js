export function checkPasswordStrength(password) {
    const strengthCriteria = [
        { regex: /[a-z]/, message: "At least one lowercase letter" },
        { regex: /[A-Z]/, message: "At least one uppercase letter" },
        { regex: /[0-9]/, message: "At least one digit" },
        { regex: /[@$!%*?&#]/, message: "At least one special character" },
        { regex: /.{8,}/, message: "At least 8 characters long" },
    ];

    const passedCriteria = strengthCriteria.filter(criteria => criteria.regex.test(password));

    const strength = {
        weak: passedCriteria.length <= 2,
        moderate: passedCriteria.length === 3 || passedCriteria.length === 4,
        strong: passedCriteria.length === 5,
    };

    return {
        isValid: strength.strong,
        strength,
        failedCriteria: strengthCriteria.filter(criteria => !criteria.regex.test(password))
    };
}
