// Auth Service (Mock for now, ready for Firebase)
export const loginUser = async (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email.includes('error')) reject("Invalid credentials");
            else resolve({
                uid: "123",
                email,
                role: email.includes("student") ? "tenant" : "broker",
                verified: false
            });
        }, 800);
    });
};

export const registerUser = async (email, password, role) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ uid: "456", email, role, verified: false });
        }, 1000);
    });
};

export const logoutUser = () => {
    localStorage.removeItem('user');
};
