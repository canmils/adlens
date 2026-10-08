# Beta verification

Automated checks exercise URL/network rejection, authentication, origin checks, CSV escaping, provider request shape and refusal/missing-key handling. AI integration is tested with a synthetic provider response, not a paid live request.

Live Marca capture, general website detection quality, Docker image execution, accessibility compliance and end-to-end real model accuracy must be evaluated on the deployment used by the owner. Passing unit/integration checks does not establish universal website compatibility.

Known beta gaps: no scheduled monitoring; no automatic retention cleanup; currency budget enforced only through provider settings; no multi-user access; collection stored in browser; exact-image caching rather than perceptual grouping. Requirements in the specification are broader than this initial release.
