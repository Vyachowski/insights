# 3. Money as integer kopecks

**Status:** accepted

**Decision:** amounts are stored as integer kopecks and converted to rubles at the query boundary.

**Why:** integers keep sums exact, with no floating-point drift.

**Consequence:** every write converts rubles to kopecks, and every read that returns money converts back in `app/server/`. Components only see rubles.
