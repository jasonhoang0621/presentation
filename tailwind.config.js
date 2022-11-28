/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    button: {
      primary: {
        backgroundColor: "#3B82F6",
        color: "#fff",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "0.25rem",
        fontWeight: "600",
        transition: "all 0.2s ease-in-out",
        cursor: "pointer",
        boxShadow: "0 0 0 0 rgba(59,130,246,0.5)",
        outline: "none",
        hover: {
          backgroundColor: "#2563EB",
          boxShadow: "0 0 0 0.2rem rgba(59,130,246,0.5)",
        },
        focus: {
          backgroundColor: "#2563EB",
          boxShadow: "0 0 0 0.2rem rgba(59,130,246,0.5)",
        },
      },
    },
    extend: {},
  },
  plugins: [],
};
