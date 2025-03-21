export const isLoggedIn = () => {
	const token = localStorage.getItem("token"); // Retrieve token
	return token !== null; // Returns true if token exists, false otherwise
  };
  
  export const logout = () => {
	localStorage.removeItem("token"); // Remove token on logout
	window.location.href = "/login"; // Redirect to login page
  };
  
  //redux