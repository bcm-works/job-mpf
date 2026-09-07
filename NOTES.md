# Notes

## Summary

- This file includes my implementation notes, decisions made, thoughts and general recommendations.
- Please also refer to the ADRs in [docs/adrs](docs/adrs/).
- The [scope of the app implementation](docs/adrs/002-app-prototype.md) was altered based on my focus areas.
- I created the [logo](src/public/icons/logo.png) using the [Emblems app](https://apps.gnome.org/Emblem/).
- I've focused my time on this exercise based on my understanding of the role I'm applying for.
- Due to family commitments, my time on this project has been split up over various days.
- I have increased my time spent here based on a desire to clearly demonstrate my skills.
- In a real-world project, I would include myself in the initial information gathering and planning stages so that each team member spent appropriate time working towards the joint goals of the project and our internal technical quality and maintenance standards.

## Time Spent

As an estimate, the time I spent working on this submission was:

- `50%` on framework and infra setup, AI configuration, and general documentation
- `25%` on app config, theming and related documentation
- `25%` on app-level coding, supported by AI

## AI Usage

I have stuck to the rules from my [AI Use document](docs/AI-USE.md), so I have defined the tech stack, infrastructure, frameworks and database schema.

Then I used [OpenCode](https://opencode.ai/) to generate the intial app-level code.

I then refined the output to meet my own standards, via extra prompts and manual code changes.

## Improvements, ideas and reflections

- Unit tests have not been added as yet, this task should be built out by AI tooling and human review later on
- Various sections need further changes to be production ready, such as adding user login and management features
- Depending on expected production usage, I would recommend using Docker containers to simplify deployment to auto-scaling systems like GCP Cloud Run
- If the infrastructure plan is to move from Deno Deploy, the database layer code would have to be changed from it's current Deno KV setup
