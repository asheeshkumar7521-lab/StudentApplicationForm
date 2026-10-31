
const admissionForm = document.getElementById("admissionForm");
const studentContainer = document.getElementById("studentContainer");

const photoInput = document.getElementById("photo");
const uploadBtn = document.getElementById("uploadBtn");
const fileName = document.getElementById("fileName");

// Open file selector
uploadBtn.addEventListener("click", () => {
    photoInput.click();
});

// Show selected photo name
photoInput.addEventListener("change", () => {
    fileName.textContent = photoInput.files.length
        ? photoInput.files[0].name
        : "No file selected";
});

// Show validation error
function showError(id, message) {
    document.getElementById(id).textContent = message;
}

// Clear validation errors
function clearErrors() {
    document.querySelectorAll("#admissionForm small").forEach((element) => {
        element.textContent = "";
    });
}

// Get selected gender
function getGender() {
    const selected = document.querySelector(
        'input[name="gender"]:checked'
    );

    return selected ? selected.value : "";
}

// Get selected skills
function getSkills() {
    return Array.from(
        document.querySelectorAll('input[name="skills"]:checked')
    ).map((skill) => skill.value);
}

// Validate all required fields
function validateForm() {
    clearErrors();

    let isValid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const age = document.getElementById("age").value;
    const dob = document.getElementById("dob").value;
    const time = document.getElementById("time").value;
    const gender = getGender();
    const course = document.getElementById("course").value;
    const address = document.getElementById("address").value.trim();
    const skills = getSkills();
    const photo = photoInput.files[0];
    const terms = document.getElementById("terms").checked;

    // 1. Full Name
    if (name.length < 3) {
        showError("nameError", "Name must contain at least 3 characters.");
        isValid = false;
    } else if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
        showError("nameError", "Please enter a valid name.");
        isValid = false;
    }

    // 2. Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        showError("emailError", "Email is required.");
        isValid = false;
    } else if (!emailPattern.test(email)) {
        showError("emailError", "Please enter a valid email address.");
        isValid = false;
    }

    // 3. Password
    if (password.length < 8) {
        showError("passwordError", "Password must contain at least 8 characters.");
        isValid = false;
    } else if (
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)
    ) {
        showError(
            "passwordError",
            "Include uppercase, lowercase and at least one number."
        );
        isValid = false;
    }

    // 4. Age
    const ageNumber = Number(age);

    if (!age) {
        showError("ageError", "Age is required.");
        isValid = false;
    } else if (
        !Number.isInteger(ageNumber) ||
        ageNumber < 15 ||
        ageNumber > 60
    ) {
        showError("ageError", "Age must be between 15 and 60.");
        isValid = false;
    }

    // 5. Date of Birth
    if (!dob) {
        showError("dobError", "Please select your date of birth.");
        isValid = false;
    } else {
        const birthDate = new Date(dob + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (Number.isNaN(birthDate.getTime()) || birthDate >= today) {
            showError("dobError", "Date of birth must be in the past.");
            isValid = false;
        } else if (
            age &&
            Math.abs(
                ageNumber -
                (
                    today.getFullYear() -
                    birthDate.getFullYear() -
                    (
                        today.getMonth() < birthDate.getMonth() ||
                        (
                            today.getMonth() === birthDate.getMonth() &&
                            today.getDate() < birthDate.getDate()
                        ) ? 1 : 0
                    )
                )
            ) > 0
        ) {
            showError("dobError", "Age does not match your date of birth.");
            isValid = false;
        }
    }

    // 6. Preferred Interview Time
    if (!time) {
        showError("timeError", "Please select your preferred time.");
        isValid = false;
    }

    // 7. Gender
    if (!gender) {
        showError("genderError", "Please select your gender.");
        isValid = false;
    }

    // 8. Course
    if (!course) {
        showError("courseError", "Please select a course.");
        isValid = false;
    }

    // 9. Address
    if (address.length < 10) {
        showError("addressError", "Address must contain at least 10 characters.");
        isValid = false;
    }

    // 10. Skills
    if (skills.length === 0) {
        showError("skillsError", "Please select at least one skill.");
        isValid = false;
    }

    // 11. Student Photo
    if (!photo) {
        showError("photoError", "Please upload your photo.");
        isValid = false;
    } else if (
        !["image/jpeg", "image/png", "image/webp"].includes(photo.type)
    ) {
        showError("photoError", "Please upload JPG, PNG or WEBP image.");
        isValid = false;
    } else if (photo.size > 5 * 1024 * 1024) {
        showError("photoError", "Photo size must not exceed 5 MB.");
        isValid = false;
    }

    // 12. Terms and Conditions
    if (!terms) {
        showError("termsError", "Please accept the terms and conditions.");
        isValid = false;
    }

    return isValid;
}

// Safely create text elements
function createTextElement(tag, text, parent) {
    const element = document.createElement(tag);
    element.textContent = text;
    parent.appendChild(element);
    return element;
}

// Handle form submission
admissionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const application = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        age: document.getElementById("age").value,
        dob: document.getElementById("dob").value,
        time: document.getElementById("time").value,
        gender: getGender(),
        course: document.getElementById("course").value,
        address: document.getElementById("address").value.trim(),
        skills: getSkills(),
        photo: photoInput.files[0]
    };

    displayApplication(application);

    alert("Student admission form submitted successfully!");

    admissionForm.reset();
    fileName.textContent = "No file selected";
});

// Display submitted application
function displayApplication(application) {
    const card = document.createElement("div");
    card.className = "student-card";

    // Photo preview
    const image = document.createElement("img");
    const imageURL = URL.createObjectURL(application.photo);

    image.src = imageURL;
    image.alt = "Student photo";
    image.className = "student-photo";

    card.appendChild(image);

    createTextElement("h3", application.name, card);
    createTextElement("p", "Email: " + application.email, card);
    createTextElement("p", "Age: " + application.age, card);
    createTextElement("p", "Date of Birth: " + application.dob, card);
    createTextElement("p", "Interview Time: " + application.time, card);
    createTextElement("p", "Gender: " + application.gender, card);
    createTextElement("p", "Course: " + application.course, card);
    createTextElement("p", "Address: " + application.address, card);
    createTextElement("p", "Skills: " + application.skills.join(", "), card);

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete Application";
    deleteButton.className = "submit-btn";

    deleteButton.addEventListener("click", () => {
        URL.revokeObjectURL(imageURL);
        card.remove();
    });

    card.appendChild(deleteButton);

    studentContainer.prepend(card);
}
