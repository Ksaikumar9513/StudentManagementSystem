/**
 * guard.js
 * Simple client-side "auth guard" for the demo — redirects to login
 * if there's no active session, or if the session role doesn't match
 * what the page requires. In the real Java version this is handled
 * server-side via HttpSession checks in each Servlet.
 */
function requireRole(role) {
    const session = DB.getSession();
    if (!session || session.role !== role) {
        window.location.href = 'login.html';
    }
}
