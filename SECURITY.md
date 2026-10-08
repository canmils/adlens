# Security

This beta is intended for trusted local use. Do not expose it as an unrestricted public capture service. Remote use requires HTTPS, a strong access token, explicit allowed origin and isolated browser egress.

The application blocks private/reserved URL targets and checks browser subrequests. DNS rebinding and browser vulnerabilities require infrastructure isolation beyond those checks. Model credentials are excluded from Chromium's environment, but the capture process still runs under the app's OS user. Stronger isolation is future work.

Report vulnerabilities privately to the repository owner using GitHub private vulnerability reporting if enabled. Do not publish exploitable details or credentials in a public issue. If private reporting is unavailable, request a private contact channel without including exploit details.
