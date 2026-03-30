Critical: the screenshot endpoint is an SSRF primitive. mediaRoutes.ts accepts any http/https URL and mediaRoutes.ts loads it with Playwright. In production, that lets an authenticated client make the server browse internal services, cloud metadata endpoints, or private network hosts.

High: auth is exposed without meaningful production hardening. server.ts enables unrestricted cors() for every origin, and the login flow in authController.ts has no rate limiting, no lockout, no audit trail, and issues 7-day JWTs from a single password. That is weak for an internet-facing admin backend.

High: required secrets/config are not validated at startup. authController.ts and requireAuth.ts assume ADMIN_PASSWORD_HASH and JWT_SECRET exist. If they are missing or malformed, the app can boot and then fail at request time. The same pattern exists for DB config in prisma.ts.

Medium: update requests bypass validation. Create uses validateProject, but update does not in projectRoutes.ts. That means invalid or incomplete payloads can be written during edits even though creates are guarded.

Medium: error handling is wrong for Express middleware flow. errorHandler.ts sends a 500 response and then calls next() in errorHandler.ts. After headers are sent, forwarding the error can produce noisy double-handling behavior.

Medium: operational readiness is thin. package.json has no real test suite, and there is no start script for a standard production launch path. That doesn’t make it insecure by itself, but it does mean you have no regression safety net and a less clean deploy setup.
