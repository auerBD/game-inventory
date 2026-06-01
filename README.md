# Game Inventory Website

Ein webbasiertes Inventarsystem im Stil eines RPG-/Survival-Spiels. Das Projekt demonstriert moderne Webentwicklung mit HTML, CSS und JavaScript und beinhaltet dynamisches Rendering, Drag-and-Drop-Funktionalität sowie responsive Gestaltung.

## Projektziele

- Semantisch korrektes HTML5
- Responsives Layout mit CSS Grid und Flexbox
- Dynamisches Rendering von Inventar-Items per JavaScript
- Drag-and-Drop zwischen Item-Pool und Inventar
- CSS-Animationen und Transition-Effekte
- Mehrseitige Webanwendung

## Features

### Inventory System

- Darstellung eines Inventar-Rasters
- Verschiedene Item-Typen und Seltenheiten
- Mengenanzeige (Quantity Badge)
- Dynamische Erstellung aller Items über JavaScript

### Drag & Drop

- Verschieben von Items zwischen Slots
- Tauschen belegter Slots
- Rückverschieben in den Item-Pool
- Visuelles Feedback während des Ziehens

### Benutzeroberfläche

- Dark-Mode-Design
- Responsive Darstellung für Desktop, Tablet und Smartphone
- Hover-, Fokus- und Glow-Effekte
- Tooltips mit Item-Informationen

### Zusätzliche Seiten

- Inventory-Seite
- Stats-Seite
- Navigation zwischen den Seiten

## Technologien

- HTML5
- CSS3
  - CSS Grid
  - Flexbox
  - Transitions
  - Animations
- Vanilla JavaScript
  - DOM-Manipulation
  - HTML5 Drag & Drop API

## Projektstruktur

```text
inventory-project/
│
├── index.html
├── stats.html
│
├── css/
│   ├── style.css
│   └── transitions.css
│
├── js/
│   ├── data.js
│   ├── inventory.js
│   └── dragdrop.js
│
└── assets/
    └── icons/
```

## Installation

1. Repository klonen:

```bash
git clone <repository-url>
```

2. Projektordner öffnen:

```bash
cd inventory-project
```

3. `index.html` im Browser öffnen.

## Entwicklung

Empfohlener Git-Workflow:

1. Neues Feature erstellen:

```bash
git checkout -b feature/name
```

2. Änderungen committen:

```bash
git add .
git commit -m "Add feature"
```

3. Branch in `main` mergen.

## Status

🚧 Projekt in Entwicklung

Aktuelle Phase: Projekt-Setup & Grundstruktur

## Autor

**Name:** Bence Daniel Auer

**Studiengang:** MSD25

**FH Joanneum**