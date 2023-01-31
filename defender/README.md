# Hypercerts Openzeppelin Defender integration

Integrates the HypercertMinter contract with Openzeppelin Defender.
This updates the supabase database, where we keep a cache of `(wallet,claimId)` pairs so users
can see which fractions they might be able to claim.

Build new auto tasks and deploy them using `yarn deploy`.
This will create [Sentinels](https://docs.openzeppelin.com/defender/sentinel) on OpenZeppelin
Defender, which will monitor for specific function calls or emitted events.
When either is monitored, an [Autotask](https://docs.openzeppelin.com/defender/autotasks) is run.
These are defined inside `src/auto-tasks/`.