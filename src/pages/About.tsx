import { Link } from "react-router-dom";
import { useState } from "react";




function About() {
  
  const [loading, setLoading] = useState(false);

  const handleTestLogin = async () => {
    setLoading(true);


    setLoading(false);
  };

  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page.</p>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/create-quiz">Create Quiz</Link> | <Link to="/theme-demo">Theme Demo</Link>
      </nav>
      <hr />
      <button onClick={handleTestLogin} disabled={loading} style={{marginTop: 16}}>
        {loading ? "Testing /auth/login..." : "Test /auth/login"}
      </button>
      {loginResult && (
        <pre style={{background: 'black', padding: 8, marginTop: 8}}>
          {JSON.stringify(loginResult, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default About;
