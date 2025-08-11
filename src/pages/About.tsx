import { Link } from "react-router-dom";


function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page.</p>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/create-quiz">Create Quiz</Link> | <Link to="/theme-demo">Theme Demo</Link>
      </nav>
    </div>
  )
}

export default About;