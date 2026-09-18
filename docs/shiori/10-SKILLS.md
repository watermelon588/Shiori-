# 10 · Skills Available in This Project

74 skills are vendored into `.claude/skills/` (copied from the global `~/.claude/skills` and the Ponytail plugin on 2026-09-17), so the project carries its own toolkit.
Excluded as irrelevant: `write-swift`, `animate-expo` (React Native), `my-skills` (index only).

To refresh after the global skills update (Git Bash, from the repo root):

```bash
for d in ~/.claude/skills/*/; do n=$(basename "$d"); case "$n" in write-swift|synced|my-skills|animate-expo) continue;; esac; rm -rf ".claude/skills/$n"; cp -r "$d" ".claude/skills/$n"; done
for d in ~/.claude/plugins/cache/ponytail/ponytail/*/skills/*/; do n=$(basename "$d"); rm -rf ".claude/skills/$n"; cp -r "$d" ".claude/skills/$n"; done
```

## Design & UI

| Skill | Use for |
|---|---|
| `design-taste-frontend` (+ `-v1`) | Anti-generic direction, redesign audit, pre-flight checklist |
| `redesign-existing-projects` | Upgrading existing screens without breaking function |
| `impeccable` | Critique, polish, hierarchy, a11y, states, tokens; also its own agents (asset producer, finish reviewer, documenter) |
| `high-end-visual-design` | Premium spacing, type, shadows, card structure |
| `stitch-design-taste` | Writing a DESIGN.md design system |
| `minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste` | Alternate aesthetic families for variation exploration |
| `frontend-ui-engineering`, `pick-ui-library` | Production components, choosing headless primitives |
| `apple-design` | Fluid physical motion, materials, typography |
| `emil-design-eng` | Component polish and the invisible details |
| `mobile-native` | Phone feel (for the future PWA) |
| `prototype`, `idea-refine`, `interview-me` | Exploring concepts before building |

## Motion

| Skill | Use for |
|---|---|
| `animate` | **Build** any animation (gate → purpose → tool → props → curve) |
| `review-animations` | Critique a diff's motion |
| `improve-animations` | App-wide motion audit plus a plan |
| `find-animation-opportunities` | Where motion is missing |
| `animation-vocabulary` | Naming an effect |
| `gsap-core`, `gsap-react`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-performance`, `gsap-frameworks` | Scroll-pinned or timeline showpieces (GSAP is not installed yet; add it only if a showpiece needs it) |

## Images & brand

| Skill | Use for |
|---|---|
| `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code` | Generating design comps, then implementing them |
| `brandkit`, `higgsfield-brandkit` | Logo / identity boards |
| `higgsfield-generate` and the other `higgsfield-*` | Image/video generation through the Higgsfield CLI (needs that CLI and an account) |

## Code quality & workflow

| Skill | Use for |
|---|---|
| `ponytail` (`lite`/`full`/`ultra`), `ponytail-review`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help` | Keep solutions minimal; review for over-engineering |
| `graphify` | Build or query a knowledge graph of the codebase (`python -m graphify`; `graphifyy` 0.9.63 installed). Start with a sub-folder such as `seanime/seanime-web/src`, because the full repo is large. |
| `planning-and-task-breakdown`, `spec-driven-development`, `incremental-implementation` | Big features (PWA, agent layer) |
| `debugging-and-error-recovery`, `browser-testing-with-devtools` | Fixing breakage |
| `performance-optimization`, `observability-and-instrumentation` | Keeping animation-heavy UI fast |
| `security-and-hardening` | Before hosting 24/7 |
| `code-review-and-quality`, `code-simplification`, `test-driven-development` | Quality passes |
| `documentation-and-adrs`, `context-engineering`, `using-agent-skills` | Docs and agent setup |
| `git-workflow-and-versioning`, `ci-cd-and-automation`, `shipping-and-launch`, `deprecation-and-migration`, `constraint-driven-development`, `doubt-driven-development`, `source-driven-development`, `api-and-interface-design` | As named |
| `full-output-enforcement`, `find-skills`, `ask-sonner` | Utilities |
