# Portfolio Guide

What makes stympaul.com and nexvyn.dev feel like people and not templates, and how to get the same quality as a developer without copying either.

This is a planning document. Nothing here is built yet. The sections marked **[from interview]** stay empty until we've talked properly.

---

## 1. What the site actually is

Satyam Paul is a Mumbai-based director, photographer and strategist who's doing an MBA. The site is a single hand-built HTML page with no framework look to it. It reads like a magazine you flip through, not a résumé.

### Section map

| Section | What it holds | How you interact |
|---|---|---|
| **Contents** (nav) | Table of contents, like a magazine | Pick a section |
| **Bio** | Polaroid portrait plus a one-paragraph confession | Read |
| **Things in My Vicinity** | Desk objects: coffee cup, desk clock, film canister, old key, paper clip, small plant | "hover over the things", "shuffle" |
| **The Repository** | Professional work, filtered by role: *as a Director*, *as a Creative Strategist*, *as a Social Media Artist* | "Drag to wander, pick a role to zoom in" |
| **The Exhibition** | Artwork going back to childhood, hung on gallery walls | Drag to look around, arrow keys turn walls |
| **The Film Roll** | Analog photographs | "scratch a frame to develop it" |
| **The Consumption Shelf** | A monthly zine of the media he consumed "instead of scrolling through reels" | Drag the shelf, pull an issue out |
| **Max the Moment** | One featured piece credited to a friend (@art.akshat), with behind-the-scenes photos | Hover the sticker and roses grow out of the letters |
| **Contact / Footer** | "Say hello", "copy[write]" | Click |

Note what's missing: no "Skills" section, no logo grid, no "Experience" timeline, no testimonials. The only credentials (Hindu College, the MBA finishing in 2027) are stated flatly in one sentence near the top.

---

## 2. Why it feels human

### 2.1 It opens by admitting it doesn't have an answer

> "When asked what I do, I blank out."

Most portfolios open with a confident title. This one opens with the moment of awkwardness everyone has at parties. The list after it ("direct, write, strategise, shoot, design, draw, connect-dots, think, walk, think and walk") breaks its own rhythm on purpose. The repeated "think and walk" is a joke that only works because it's typed by someone who actually walks to think.

**Lesson:** start from a real, slightly uncomfortable truth about yourself, not from a job title.

### 2.2 Section names are places and objects, not categories

"The Repository", "The Exhibition", "The Film Roll", "The Shelf". Each name sets up a small physical world, and the interaction belongs to that world: you *scratch* film to develop it, *pull* an issue off a shelf, *turn* to face a gallery wall. The metaphor isn't decoration. It's how you use the section.

**Lesson:** a metaphor only earns its place if the interaction comes from it. A "terminal-themed" dev portfolio where you still just scroll past cards is a costume, not a metaphor.

### 2.3 Captions are specific and a bit off-hand

Project notes from the Repository:

- "It was a super hot day when we shot this"
- "Covered the concert like it was supposed to be"
- "Make a tissue box with lyrics printed"
- "Beautiful human being"
- "Took a different route to interviews in the internet space"

None of them is a metric or a buzzword. They read like what you'd say pointing at a photo on your phone. The heat on shoot day is the kind of detail only someone who was there would remember, and that's why it reads as true.

**Lesson:** one concrete, sensory, slightly unimportant detail per project does more than three bullets of impact.

### 2.4 The imperfections stay in

"cumulated" instead of "accumulated". "Connecting the dots that seem unconnectable." British spelling (*strategise*, *colour*). The About section is in third person while the hero is in first person. A copy editor would "fix" all of these, and the site would lose some of its voice in the process.

**Lesson:** don't run your copy through a polish pass until it sounds like nobody. Fix real errors, but keep your rhythm and your odd word choices.

### 2.5 It shows where the work came from

The Exhibition starts with childhood drawings. Max the Moment has a behind-the-scenes toggle. The About says plainly: "He is still figuring out his approach to projects."

**Lesson:** showing process, origins and unfinished thinking makes a person seem real. Showing only finished work makes them seem like a brand.

### 2.6 There's a ritual that keeps going

The Consumption Shelf is a *monthly* series. It gives the site a pulse: something new keeps arriving, it says what he pays attention to, and it frames the habit against something relatable (doomscrolling reels).

**Lesson:** a recurring, low-effort, personal series beats a blog you'll abandon in two posts.

### 2.7 It credits other people

The featured piece belongs to a friend, credited by handle. The bio talks about "the sense of community that creatives can form."

**Lesson:** generosity reads as confidence. A portfolio that's only about you feels lonely.

### 2.8 Accessibility is written with care too

The aria-labels aren't dry: *"The Max the Moment sticker. Move over it, or touch it, and a garden of roses grows out of the letters."* There's a `prefers-reduced-motion` path, a `hover:none` path for touch, and keyboard support for the gallery walls.

**Lesson:** craft that most visitors never see is still craft, and for a developer it's *direct evidence of your skill*.

---

## 3. Aesthetics, in detail

### Palette
Warm paper, near-black ink, one red. That's all.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#fbfaf7` | `#141413` |
| `--paper` | `#f6f4ee` | `#fff` |
| `--ink` | `#1b1b1b` | `#f1efe9` |
| `--soft` | `#6d6a64` | `#9b978e` |
| `--red` | `#d9261c` | `#ff4a3d` |

Secondary warm tones (`#fff3a8`, `#ffe2a0`, `#cdbfa8`) only show up inside objects: tape, paper, the glow of a bulb. They never appear in the UI.

**Takeaway:** keep a restrained base and let colour live inside the content, not in the chrome around it.

### Type
- **Bodoni 72 Oldstyle** for display: a high-contrast didone, the kind magazines use for mastheads. This is where the editorial feel comes from.
- **Helvetica Neue** for UI and small labels: neutral, almost invisible.
- **Lastik** as a secondary serif, plus a **handwriting** face for annotations.
- Headings are fluid: `clamp(2.6rem, 5vw, 4.4rem)`.

**Takeaway:** an expressive display face plus a quiet UI face, plus one "human hand" layer used sparingly.

### Texture and motion
- Polaroid portrait, gallery walls, film strips, stickers, a shelf of zines: everything is a physical object.
- Cursors change with the action: `grab`/`grabbing` for things you drag, `crosshair` for scratching film.
- Small 3D lifts on hover (`perspective(900px) translateZ(46px)`), drop shadows that feel like paper on a desk, warm glow filters.
- Respects reduced motion and touch devices.

### Microcopy
All lowercase, imperative, tactile verbs: *hover over the things*, *drag to wander*, *scratch a frame to develop it*, *pull an issue out*. The instructions sound like a friend handing you something, not like a UI.

---

## 4. Second reference: nexvyn.dev

A design engineer's portfolio, built on Next.js. It's the opposite approach to stympaul.com: almost no decoration on the surface, with all the personality in the details. It's also closer to your stack, which makes it the more useful warning *and* the more useful model.

### Structure
| Part | What it holds |
|---|---|
| **Hero** | Name, "Design Engineer", two sentences of bio, contact options (X, email, book a call) |
| **Status pills** | "feel free to reach out", "open to work" |
| **"psst, it's a game"** | A small sheep sprite that links to `/island`, a playable version of the whole portfolio |
| **Projects** | Four projects, each with a one-line description and its GitHub star count (660, 225, 7, none) |
| **Mind** | Short craft notes with an RSS feed. The latest: "Don't wait for the slide to finish before fading in the content" |
| **/projects** | Includes **nexvyn/ui v0**, "where the component system started" |
| **Footer** | GitHub link, CC BY-NC 4.0 license |

### Why it works

**The learning story is honest and specific.** "Most of what I know came from the things I reverse-engineer and rebuild from scratch." It doesn't claim talent. It describes a habit, and you can believe it because the projects prove it.

**Star counts are shown without spin.** 660 next to 7, and one project with no count at all. Showing the small number is what makes the big one believable. Nothing is rounded up to "1k+".

**One sentence per project, about how it *feels*, not what it uses.** "UI components that care about how things feel." No stack pills anywhere on the homepage.

**The writing shows the obsession.** A note titled after one specific animation-timing decision tells you more about this developer than a skills section could. It's the dev version of the Consumption Shelf: an ongoing ritual that shows what they pay attention to.

**The playful part is hidden and optional.** The serious visitor gets a fast, plain page. The curious one finds a sheep, then an island, and the island's contact section says "You made it across the island." The game is a reward for curiosity, not a gate.

**The origin trail is kept.** Keeping `v0` of the component library in the projects list does what the childhood art does in stympaul's Exhibition.

### Aesthetics
- **Type:** Inter for everything, a monospace for numbers (the star counts), and **Caveat** (handwriting) for small asides like "psst".
- **Palette:** neutral greys, close to shadcn's default neutral tokens (`#0a0a0a` / `#fff` background, `#e5e5e5` borders), with amber reserved for small highlights.
- **Motion:** fast and subtle, and clearly considered (their note on fade timing is the evidence).

### The important lesson for you
nexvyn's surface is close to an untouched Next.js + shadcn + Inter setup, which is the exact default this guide warns against. It still doesn't read as a template because **every sentence is specific, the numbers are honest, the writing proves the craft, and there's one hidden thing made with obvious love.** A minimal look on its own is fine. A minimal look with *generic content* is what reads as a template.

### Licensing
The site is CC BY-NC 4.0 and the owner states they don't allow copying it. We take principles from it only: no layout, sheep, island or copy.

### The two references side by side

| | stympaul.com | nexvyn.dev |
|---|---|---|
| Dial | Maximal: the site is a world | Minimal: the world is hidden behind a sheep |
| Personality lives in | Metaphors, objects, interactions | Copy, numbers, writing, one easter egg |
| Proof of craft | Tactile interactions | Feel, timing, the projects themselves |
| Recurring ritual | Monthly media zine | Craft notes with RSS |
| Origin trail | Childhood art | `nexvyn/ui v0` |
| Risk if copied badly | A costume | A template |

**Decision to make after the interview:** where you sit on this dial. It depends on what you build and who you want to impress, not on which site looks cooler.

---

## 5. What not to copy (and where it slips)

- **Placeholder exits.** The "Say hello" and "copy[write]" links point to `#`. After that much care, the contact link going nowhere stings. *Make the exits work first.*
- **Third-person About.** It reads as a press bio and slightly undercuts the first-person hero. Use it only if you mean it to.
- **The metaphors are his.** Film, galleries and zines come from a photographer-director's life. If you borrow them, they'll feel borrowed. Your metaphors have to come from *your* desk, *your* habits and *your* craft.

---

## 6. Translating this to a developer portfolio

### The usual dev-portfolio defaults that read as generic
- "Hi, I'm ___ 👋, a passionate full-stack developer"
- A typewriter effect cycling through job titles
- A grid of tech logos, or skill bars with percentages
- Three identical project cards, each with an image, a stack-pill row and GitHub/Live buttons
- Gradient blobs, glassmorphism, untouched shadcn defaults
- "Let's build something amazing together!"
- Copy that sounds like an LLM: *leveraging, seamless, robust, passionate about crafting, delve, elevate*

All of these say "I followed a tutorial." None of them is wrong on its own, but each one is a default, and a page made of defaults doesn't belong to anyone.

### Principles mapped from stympaul.com

| stympaul.com does | Developer equivalent (the *principle*, not a template) |
|---|---|
| "When asked what I do, I blank out" | Open with something true and specific you'd actually say about your work, including the awkward part. |
| Work filtered by role (*as a Director*) | Filter by the hat you were wearing (*as the person who fixed the build*, *as the only frontend dev*), not by tech stack. |
| "It was a super hot day when we shot this" | One human detail per project: the 2 a.m. bug, the user who emailed, the feature you cut. |
| Childhood art in The Exhibition | Your origin trail: the first thing you broke, an ugly early project kept on purpose. |
| Scratch a frame to develop it | An interaction that comes from *how you work*. Only decide this after the interview. |
| Monthly Consumption Shelf | A small recurring ritual you'll realistically keep going. |
| Credits @art.akshat | Name the people you built with, learned from, or shipped alongside. |
| Thoughtful aria-labels, reduced motion | Your craft as proof: performance, accessibility, view-source quality. For a developer, the site *is* a project. |

### How to write copy that doesn't sound generated
1. **Write first drafts out loud.** Voice-note an explanation of the project to a friend, transcribe it, then trim. Don't add anything.
2. **Every claim needs a noun you can picture.** "Improved performance" means nothing. "The dashboard used to take long enough to make tea" is something you can picture.
3. **Keep one odd word choice per section.** It's a fingerprint.
4. **Numbers only if they're real and you remember why they mattered.**
5. **Say what you're still figuring out.** One sentence of honest uncertainty earns more trust than a paragraph of confidence.
6. **Cut adjectives about yourself.** Let the work and the details carry them.
7. **Read it in your own accent.** If a sentence sounds like a LinkedIn post, rewrite it until it sounds like you.

### Stack notes for this repo (Next.js + Tailwind + shadcn)
- Use shadcn only as unstyled-feeling primitives (dialogs, focus management). Restyle everything visible, or the site will look like every other shadcn site.
- Pick type before colour. Self-host the fonts with `next/font`.
- Define tokens on `:root` in the same spirit as the table above: one base, one ink, one accent, plus a dark mode you've actually designed.
- Plan for `prefers-reduced-motion` and touch from day one. Don't bolt them on afterwards.
- Budget: the reference site is one 156 KB HTML file. Heavy interaction doesn't have to mean a heavy bundle.

---

## 7. The interview

The portfolio can't be designed until I know the person. The interview runs in rounds, and each round's answers shape the next questions.

| Round | Goal |
|---|---|
| 1. Origins | Where you're from, how you got into code, what you did before or alongside it |
| 2. The work | Projects in depth: why each existed, what went wrong, what you'd redo, who was involved |
| 3. Habits and objects | Your desk, your rituals, what you consume, how you think (walking? whiteboard? 3 a.m.?) |
| 4. Taste | Sites, books, films, music, objects you love, and things you find cringe |
| 5. Voice | How you talk: your phrases, your humour, languages you mix, how friends describe you |
| 6. Direction | Who this portfolio is for, what you want it to get you, what you don't want to be mistaken for |

After the interview, Haiku drafts copy *from your own words* (transcribed answers, not invented phrasing). I then edit it against the rules in section 6.

### [from interview] Who you are
_Empty until we talk._

### [from interview] Your metaphor and sections
_Empty. This is the "Film Roll" equivalent, and it has to come from you._

### [from interview] Visual direction
_Empty: type, palette and textures, chosen from your taste, not trends._

### [from interview] Voice sheet
_Empty: your phrases, your rhythm, words to avoid._
