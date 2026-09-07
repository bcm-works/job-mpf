# Notes

## Summary

- This file includes my implementation notes, decisions made, thoughts and general recommendations.
- Please also refer to the ADRs in [docs/adrs](docs/adrs/).
- I've focused my time on this exercise based on my understanding of the role I'm applying for.
- The [scope of the app implementation](docs/adrs/002-app-prototype.md) was lowered based on my focus areas.
- The logo image was created using the [Emblems app](https://apps.gnome.org/Emblem/).

## Time Spent

As an estimate, the time I spent working on this submission was:

- 50% on framework and infra setup, AI configuration, and general documentation
- 25% on app config, theming and related documentation
- 25% on app-level coding, supported by AI

## AI Usage

I have stuck to the rules from my [AI Use document](docs/AI-USE.md), so I have defined the tech stack, infrastructure, frameworks and database schema.

Then I used [OpenCode](https://opencode.ai/) to generate the intial app-level code.

I then refined the output to meet my own standards, via extra prompts and manual code changes.

## Improvements, ideas and reflections

- Various sections need further changes to be production ready, such as adding user login and management features
- Depending on expected production usage, I would recommend using Docker containers to simplify deployment to auto-scaling systems like GCP Cloud Run
