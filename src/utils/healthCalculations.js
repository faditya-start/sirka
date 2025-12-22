export const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let category = "";
    if (bmi < 18.5) category = "Kekurangan berat badan";
    else if (bmi < 25) category = "Normal (ideal)";
    else if (bmi < 30) category = "Kelebihan berat badan";
    else category = "Kegemukan (Obesitas)";

    return {
        value: parseFloat(bmi.toFixed(1)),
        category
    };
};

export const calculateBMR = (weight, height, age, gender) => {
    if (!weight || !height || !age || !gender) return null;

    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === "pria") {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    return Math.round(bmr);
};

export const calculateDailyCalorieTarget = (bmr, activityLevel, goal) => {
    if (!bmr) return null;

    const tdee = bmr * (activityLevel || 1.2);

    let target;
    switch (goal) {
        case "Turun Berat Badan":
            target = tdee - 500;
            break;
        case "Naik Berat Badan":
            target = tdee + 500;
            break;
        default:
            target = tdee;
    }

    return Math.round(target);
};
