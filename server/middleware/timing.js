/**
 * Request Timing Middleware
 * Logs the response time for every request.
 * Flags slow requests (> 1000ms) so they are easy to spot in the console.
 */
const timingMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `${req.method} ${req.originalUrl} - ${duration}ms`;

    if (duration > 1000) {
      console.warn(`🐌 SLOW REQUEST: ${log}`);
    } else {
      console.log(log);
    }
  });

  next();
};

export default timingMiddleware;
