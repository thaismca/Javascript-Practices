//Exports HTML that generates admin sign up form

module.exports = () => {
  return `
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" name />
        <button>Sign Up</button>
      </form>
    </div>
  `;
};