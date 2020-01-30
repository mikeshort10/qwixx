module.exports = {
  theme: {
    extend: {
      spacing: {
        "14": "14rem",
        "144": "36rem"
      },
      height: {
        "36": "9rem"
      },
      width: {},
      maxHeight: {
        "12": "48rem"
      },
      fill: theme => ({
        red: theme("colors.red.500"),
        green: theme("colors.green.500"),
        blue: theme("colors.blue.500"),
        yellow: theme("colors.yellow.500"),
        white: theme("colors.white")
      })
    }
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus"]
  },
  plugins: []
};
