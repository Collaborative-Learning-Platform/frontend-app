import { Link } from "react-router-dom";


function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The requested page could not be found.</p>
      <nav>
        <Link to="/">Go back to home</Link>
      </nav>
    </div>
  )
}

export default NotFound;