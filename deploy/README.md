# Deployment files

These yaml files are used to deploy xjoin-search to ephemeral, stage, and prod environments.

## Ephemeral environment configuration

A separate Clowder deployment file is required for the project in order to define the Elasticsearch and XJoinPipieline resources.
Clowder has not yet integrated these resources, so their deployment to the ephemeral cluster is defined as separate resources in `ephemeral.yaml`.
Elasticsearch and XJoinPipeline are defined in app-interface for stage/prod.
